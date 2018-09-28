import { HubConnectionBuilder, HubConnection, LogLevel, HttpTransportType } from "@aspnet/signalr";
import { PrefixedConsoleLogger, ILogger } from "./Logger";
import { Arg, Wait } from "../helpers/Utils";

export enum SignalRConnectionState {
    Idle = 0,
    Active = 1,
    Connecting = 2,
    Recovering = 3,
    Errored = 4
}

export class SignalRService {
    private readonly connection: HubConnection;
    private readonly logger: ILogger;

    public state: SignalRConnectionState;
    public onStateChanged: (state: SignalRConnectionState, detail?: string) => void;

    public MaximumReconnectAttempts: number = 10;
    public ReconnectIntervalMilliseconds: number = 10000;

    constructor(hubUrl: string, logVerbose: boolean = false){
        Arg.isRequiredNotEmpty(hubUrl, "hubUrl");

        let logLevel = logVerbose ? LogLevel.Trace : LogLevel.Information;
        let connectionOptions = {
            logger: new PrefixedConsoleLogger(logLevel, 'SignalR'),
            logMessageContent: logVerbose
        };
        
        this.logger = new PrefixedConsoleLogger(logLevel, 'SignalRService');
        this.state = SignalRConnectionState.Idle;

        this.connection = new HubConnectionBuilder()
            .withUrl(appConfig.signalRUri, connectionOptions)
            .configureLogging(logLevel)
            .build();
        this.connection.onclose((error?: Error) => this.onConnectionClosed(error))
    }

    /* Register the provided callback(s) for the given methodName, executed when invoked by the external SignalR hub */
    public subscribe(methodName: string, callback: (...args: any[]) => void): void {
        Arg.isRequiredNotEmpty(methodName, "methodName");
        Arg.isRequired(callback, "callback");

        this.logger.debug(`Adding subscription for [${methodName}] method on hub.`);
        this.connection.on(methodName, callback);
    }

    /* Unregister all callbacks for the given methodName */
    public unsubscribe(methodName: string): void {
        Arg.isRequired(methodName, "methodName");

        this.logger.debug(`Removing all subscriptions for [${methodName}] method on hub.`);
        this.connection.off(methodName);
    }

    /* Initialise the underlying HubConnection. Will retry if the initial connection fails. */
    public async start(): Promise<void>{
        if(this.state !== SignalRConnectionState.Idle){
            this.logger.warning(`Ignoring attempt to start already-initialized connection`);
            return Promise.reject('Unable to start an already-initialized connection. Call stop() first.');
        }

        this.logger.info("Attempting to start SignalR hub connection.");
        this.updateState(SignalRConnectionState.Connecting);

        try {
            return await this.connection.start()
                .then(
                    () => {
                        this.logger.info("Successfully established connection.");
                        this.updateState(SignalRConnectionState.Active);
                        return Promise.resolve();
                    },
                    async (error: any) => {
                        return await this.handleInitialStartFailure(error)
                    });
        }
        catch(error){
            return await this.handleInitialStartFailure(error)
        }
    }

    /* Stop the underlying HubConnection. No retry capabilities. */
    public async stop(): Promise<void>{
        if(this.state === SignalRConnectionState.Idle){
            this.logger.warning(`Ignoring attempt to stop an uninitialized connection`);
            return Promise.reject('Unable to stop an uninitialized connection. Call start() first.');
        }

        this.logger.info("Attempting to stop SignalR hub connection");
        return await this.connection.stop()
            .then(() => {
                this.logger.info("Successfully stopped connection.");
                this.updateState(SignalRConnectionState.Idle);
            });
    }

    private async handleInitialStartFailure(error: any): Promise<void>{
        // If we've already failed an initial start, don't go for it again
        if(this.state == SignalRConnectionState.Errored){
            return;
        }

        this.logger.error("Failed to establish initial connection.");
        
        return await this.attemptReconnect(
            () => this.connection.start(), this.MaximumReconnectAttempts, this.ReconnectIntervalMilliseconds)
            .then(
                () => this.successfullyReconnected("Successfully established initial connection to SignalR hub."),
                () => {
                    let message = `Unable to establish initial SignalR connection after [${this.MaximumReconnectAttempts + 1}] attempts.`;
                    return this.maxReconnectAttemptsReached(message);
                }
            );
    }

    private async onConnectionClosed(error?: Error): Promise<void>{
        if(!error){
            // We only care about unexpected connection closes, not ones by the stop() method.
            return;
        }
        
        this.logger.warning(`Connection was closed unexpectedly: ${error.message}`);
        this.updateState(SignalRConnectionState.Recovering);

        return await this.attemptReconnect(
            () => this.connection.start(), this.MaximumReconnectAttempts, this.ReconnectIntervalMilliseconds)
            .then(
                () => this.successfullyReconnected("Successfully recovered connection to SignalR hub."),
                () => {
                    let message = `Unable to re-establish SignalR connection after [${this.MaximumReconnectAttempts}] attempts.`;
                    return this.maxReconnectAttemptsReached(message);
                }
            );
    }

    /* Attempts to reconnect the underlying HubConnection using an exponential backoff retry policy. */
    private async attemptReconnect(connectPromise: () => Promise<void>, maximumAttempts: number, delay: number): Promise<void>{
        this.logger.warning(`Retrying connection: [${maximumAttempts}] attempts remaining.`);

        await connectPromise()
            .then(
                () => {
                    return Promise.resolve();
                },
                async (error) => {
                    if(maximumAttempts == 0){
                        this.updateState(SignalRConnectionState.Errored);
                        return Promise.reject("Final attempt to reconnect failed.")
                    }
                    this.logger.warning(`Waiting ${delay}ms before next retry.`);
                    await Wait(delay);
                    return await this.attemptReconnect(connectPromise, maximumAttempts - 1, delay * 2);
                }
            );
    }

    private successfullyReconnected(message: string): Promise<void>{
        this.logger.warning(message);
        this.updateState(SignalRConnectionState.Active);
        return Promise.resolve();
    }

    private maxReconnectAttemptsReached(message: string): Promise<void>{
        this.logger.critical(message);
        this.updateState(SignalRConnectionState.Errored);

        return Promise.reject(message);
    }

    private updateState(state: SignalRConnectionState, detail?: string): void{
        if(this.state === state){
            return;
        }

        this.logger.info(`Connection state updated to [${SignalRConnectionState[state]}]`);
        this.state = state;

        if(this.onStateChanged){
            this.onStateChanged(state, detail);
        }
    }
}