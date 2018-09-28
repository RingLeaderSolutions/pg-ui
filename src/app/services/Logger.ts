// These values are designed to match the ASP.NET Log Levels since that's the pattern we're emulating here.
/** Indicates the severity of a log message.
 *
 * Log Levels are ordered in increasing severity. So `Debug` is more severe than `Trace`, etc.
 */
export enum LogLevel {
    /** Log level for very low severity diagnostic messages. */
    Trace = 0,
    /** Log level for low severity diagnostic messages. */
    Debug = 1,
    /** Log level for informational diagnostic messages. */
    Information = 2,
    /** Log level for diagnostic messages that indicate a non-fatal problem. */
    Warning = 3,
    /** Log level for diagnostic messages that indicate a failure in the current operation. */
    Error = 4,
    /** Log level for diagnostic messages that indicate a failure that will terminate the entire application. */
    Critical = 5,
    /** The highest possible log level. Used when configuring logging to indicate that no log messages should be emitted. */
    None = 6,
}

/** An abstraction that provides a sink for diagnostic messages. */
export interface ILogger {
    log(logLevel: LogLevel, message: string): void;

    trace(message: string): void;
    debug(message: string): void;
    critical(message: string): void;
    error(message: string): void;
    warning(message: string): void;
    info(message:string): void;
}

abstract class LoggerBase implements ILogger {
    abstract log(logLevel: LogLevel, message: string): void;
    
    trace(message: string): void {
        this.log(LogLevel.Trace, message);
    }
    debug(message: string): void {
        this.log(LogLevel.Debug, message);
    }
    info(message: string): void {
        this.log(LogLevel.Information, message);
    }
    warning(message: string): void {
        this.log(LogLevel.Warning, message);
    }
    error(message: string): void {
        this.log(LogLevel.Error, message);
    }
    critical(message: string): void {
        this.log(LogLevel.Critical, message);
    }
}

export class PrefixedConsoleLogger extends LoggerBase {
    private readonly minimumLogLevel: LogLevel;
    private readonly messagePrefix: string;

    constructor(minimumLogLevel: LogLevel, messagePrefix: string = '') {
        super();

        this.minimumLogLevel = minimumLogLevel;
        this.messagePrefix = messagePrefix;
    }

    public log(logLevel: LogLevel, message: string): void {
        let formattedMessage = this.formatMessage(logLevel, message);
        if (logLevel >= this.minimumLogLevel) {
            switch (logLevel) {
                case LogLevel.Critical:
                case LogLevel.Error:
                    console.error(formattedMessage);
                    break;
                case LogLevel.Warning:
                    console.warn(formattedMessage);
                    break;
                case LogLevel.Information:
                    console.info(formattedMessage);
                    break;
                default:
                    // console.debug only goes to attached debuggers in Node, so we use console.log for Trace and Debug
                    console.log(formattedMessage);
                    break;
            }
        }
    }

    protected formatMessage(level: LogLevel, message: string): string {
        return `[${this.messagePrefix}] [${LogLevel[level]}]: ${message}`;
    }
}