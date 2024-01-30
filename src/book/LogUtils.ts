const writeLog = (mlog: (message?: any, ...optionalParams: any[]) => void, prefix: string, prefixColor: string, log: string) => {
    mlog(`%c${prefix} ` + `%c${log}`, `color: ${prefixColor}; font-weight: bold`, 'color: inherit, font-weight: none')
}

export const LogUtils = {
    error: (log: string) => writeLog(console.error, "[ERR]", '#d32f2f', log),
    debug: (log: string) => writeLog(console.debug, "[DEBUG]", '#ed6c02', log),
    info: (log: string) => writeLog(console.info, "[INFO]", '#0288d1', log),
}