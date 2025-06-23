export class Logger {
    context;
    constructor(context) {
        this.context = context;
    }
    info(message, ...args) {
        console.error(`[INFO] [${this.context}] ${message}`, ...args);
    }
    error(message, error) {
        console.error(`[ERROR] [${this.context}] ${message}`, error);
    }
    warn(message, ...args) {
        console.error(`[WARN] [${this.context}] ${message}`, ...args);
    }
    debug(message, ...args) {
        if (process.env.DEBUG) {
            console.error(`[DEBUG] [${this.context}] ${message}`, ...args);
        }
    }
}
