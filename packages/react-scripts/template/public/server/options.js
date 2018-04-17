let applicationLogger = {
    log(level, msg, context) { console.log(`[${level}]: ${msg}`); if (context) { console.log(context); } },
    error(...args) { return this.log('error', ...args); },
    warn(...args) { return this.log('warn', ...args); },
    info(...args) { return this.log('info', ...args); },
    verbose(...args) { return this.log('verbose', ...args); },
    debug(...args) { return this.log('debug', ...args); },
    silly(...args) { return this.log('silly', ...args); }
};
let apiLogger = {
    log(level, msg, context) { console.log(`[${level}]: ${msg}`); if (context) { console.log(context); } },
    error(...args) { return this.log('error', ...args); },
    warn(...args) { return this.log('warn', ...args); },
    info(...args) { return this.log('info', ...args); },
    verbose(...args) { return this.log('verbose', ...args); },
    debug(...args) { return this.log('debug', ...args); },
    silly(...args) { return this.log('silly', ...args); }
};
let analyticsLogger = {
    log(level, msg, context) { console.log(`[${level}]: ${msg}`); if (context) { console.log(context); } },
    error(...args) { return this.log('error', ...args); },
    warn(...args) { return this.log('warn', ...args); },
    info(...args) { return this.log('info', ...args); },
    verbose(...args) { return this.log('verbose', ...args); },
    debug(...args) { return this.log('debug', ...args); },
    silly(...args) { return this.log('silly', ...args); }
};
try {
    const NodeLogger = require('node-logger');

    NodeLogger.loggers.add({ name: 'AS', level: 'debug', label: 'AS' });
    NodeLogger.loggers.add({ name: 'APA', level: 'debug', label: 'APA' });
    NodeLogger.loggers.add({ name: 'APAN', level: 'debug', label: 'APAN' });

    applicationLogger = NodeLogger.loggers.get('AS');
    apiLogger = NodeLogger.loggers.get('APA');
    analyticsLogger = NodeLogger.loggers.get('APAN');
} catch (e) {
}
// //////////////////////////////////////////////////////////////////////////////////////////

const options = {
    port: 8080,
    xml_file: './config.xml',
    data_folder: './local',
    path: './public/',
    logger: applicationLogger,
    api: {
        logger: apiLogger,
        apiVersion: '2.3',
        updater: {
            timeoutMsec: 60000,
            maxRetryCount: 5,
            retryDelayMsec: 60000,
            checkSslCertificateAuthorities: true,
            queryFiltersByDomain: {
                file: 'context=texture,texture_occlusion',
                map: 'type=dae,path,model,aoDae'
            }
        }
    },
    analytics: {
        logger: analyticsLogger,
        storage: {
            flushMsec: 60000
        }
    }
};

module.exports = options;
