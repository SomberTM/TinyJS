import { Json } from "./Json";
import caller from "caller";

export interface LoggerOptions {
    dateTime?: boolean, 
    file?: boolean
}

export type TagType = "INFO" | "ERROR" | "WARN";

export class Logger {

    public options!: LoggerOptions;

    constructor(includes?: LoggerOptions) {
        this.options = includes || {};
    }

    public log(logtag: TagType, message: any, ...content: any[]) {
        console.log(`[${logtag}]${this.options.dateTime ? '[' + new Date(Date.now()).toLocaleString() + ']' : ''}${this.options.file ? '[' + caller().split('\\').find((val: string) => val.endsWith('.js') || val.endsWith('.ts')) + ']' : ''}: ${typeof message === 'object' ? JSON.stringify(message, null, 4) : message.toString()}`, ...content);
    }

}