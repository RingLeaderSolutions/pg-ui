import { HubConnectionBuilder, HubConnection, LogLevel, IHttpConnectionOptions, HttpError, TimeoutError } from "@aspnet/signalr";
import { PrefixedConsoleLogger, ILogger } from "./Logger";
import { Arg, Wait } from "../helpers/Utils";
import StorageService from './storageService';

export enum SignalRConnectionState {
    Idle = 0,
    Active = 1,
    Connecting = 2,
    Recovering = 3,
    Errored = 4,
    Stopping = 5
}

export class SignalRService {
    private readonly connection: HubConnection;
    private readonly logger: ILogger;

    public state: SignalRConnectionState;
    public onStateChanged: (state: SignalRConnectionState, detail?: string) => void;

    public MaximumReconnectAttempts: number = 5;
    public ReconnectIntervalMilliseconds: number = 10000;

    constructor(hubUrl: string, logVerbose: boolean = false){
        Arg.isRequiredNotEmpty(hubUrl, "hubUrl");

        let logLevel = logVerbose ? LogLevel.Trace : LogLevel.Information;
        let connectionOptions: IHttpConnectionOptions = {
            logger: new PrefixedConsoleLogger(logLevel, 'SignalR'),
            logMessageContent: logVerbose,
            accessTokenFactory: () => new StorageService().getToken()
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
            throw new Error(`Unable to start an already-initialized connection [${SignalRConnectionState[this.state]}]. Call stop() first.`);
        }

        this.logger.info("Attempting to start SignalR hub connection.");
        this.updateState(SignalRConnectionState.Connecting);

        try {
            await this.connection.start();
            this.logger.info("Successfully established connection on first attempt.");
            this.updateState(SignalRConnectionState.Active);
        }
        catch(error){
            return await this.handleInitialStartFailure(error)
        }
    }

    /* Stop the underlying HubConnection. No retry capabilities, but may throw if the stop fails. */
    public async stop(): Promise<void>{
        if(this.state === SignalRConnectionState.Idle){
            throw new Error('Unable to stop an uninitialized connection. Call start() first.');
        }

        this.updateState(SignalRConnectionState.Stopping);
        this.logger.info("Attempting to stop SignalR HubConnection.");
        try {
            await this.connection.stop();
            this.logger.info("Successfully stopped connection.");
            this.updateState(SignalRConnectionState.Idle);
        }
        catch(ex)
        {
            this.updateState(SignalRConnectionState.Errored);
            this.logger.error(`Failed to stop the underlying HubConnection: ${ex}`)
            throw ex;
        }
    }

    private async handleInitialStartFailure(error: Error): Promise<void>{
        // If we've already failed an initial start, don't go for it again
        if(this.state == SignalRConnectionState.Errored){
            return;
        }
        
        if(error instanceof HttpError && error.statusCode === 401){
            this.logger.error(`Received [401 Unauthorized] response from hub, stopping connection and not retrying while we wait for reauthentication.`);
            await this.connection.stop();
            this.updateState(SignalRConnectionState.Errored);

            return;
        }

        this.logger.error(`Failed to establish initial connection: ${error.message}`);
        
        try {
            await this.attemptReconnect(() => this.connection.start(), 1, this.ReconnectIntervalMilliseconds);
            this.logger.warning("Successfully established initial connection to SignalR hub.");
            this.updateState(SignalRConnectionState.Active);
        }
        catch(ex){
            this.logger.critical(`Unable to re-establish initial SignalR connection after [${this.MaximumReconnectAttempts}] attempts.`);
            this.updateState(SignalRConnectionState.Errored);
            throw ex;
        }
    }

    private async onConnectionClosed(error?: Error): Promise<void>{
        if(!error){
            // We only care about unexpected connection closes, not ones by the stop() method.
            return;
        }
        
        this.logger.warning(`Connection was closed unexpectedly: ${error.message}`);
        this.updateState(SignalRConnectionState.Recovering);

        try {
            await this.attemptReconnect(() => this.connection.start(), 1, this.ReconnectIntervalMilliseconds)
            this.logger.warning("Successfully recovered connection to SignalR hub.");
            this.updateState(SignalRConnectionState.Active);
        }
        catch(ex){
            this.logger.critical(`Unable to re-establish SignalR connection after [${this.MaximumReconnectAttempts}] attempts.`);
            this.updateState(SignalRConnectionState.Errored);
            throw ex;
        }
    }

    /* Attempts to reconnect the underlying HubConnection using an exponential backoff retry policy. */
    private async attemptReconnect(connectPromise: () => Promise<void>, attemptNumber: number = 1, delay: number): Promise<void>{
        let attemptCount = `[${attemptNumber}/${this.MaximumReconnectAttempts}]`
        try {
            this.logger.warning(`Attempting retry ${attemptCount}...`);
            await connectPromise();
        }
        catch(ex){
            if(attemptNumber === this.MaximumReconnectAttempts){
                this.updateState(SignalRConnectionState.Errored);
                throw new Error(`Final attempt ${attemptCount} to reconnect failed.`)
            }
            this.logger.warning(`Retry attempt ${attemptCount} failed: waiting [${delay}]ms before next retry.`);
            await Wait(delay);
            await this.attemptReconnect(connectPromise, attemptNumber + 1, delay * 2);
        }
    }

    private updateState(state: SignalRConnectionState, detail?: string): void{
        if(this.state === state){
            return;
        }

        this.state = state;
        this.logger.debug(`Connection state updated to [${SignalRConnectionState[state]}]`);
        
        if(this.onStateChanged){
            this.onStateChanged(state, detail);
        }
    }
}

export function createNotificationService(): SignalRService{
    return new SignalRService(appConfig.signalRUri, false);
}