import { LocalCacheManager } from '@adactive/adsum-client-api';
import { createLogger, transports, format } from 'winston';
import fs from 'fs';
import path from 'path';

const color = format.colorize({ all: true });

class DataUpdater {
    constructor() {
        this.logger = createLogger({
            level: 'info',
            transports: [
                new transports.Console({
                    format: format.combine(
                        format.label({ label: 'AS' }),
                        format.timestamp(),
                        format.prettyPrint(),
                        format.printf((info) => {
                            let header = `[${info.label}] ${info.timestamp} ${info.level}`;

                            if (info.durationMs) {
                                let duration = info.durationMs;
                                let unit = 'ms';

                                if (duration > 1000) {
                                    duration /= 1000;
                                    unit = 's';

                                    if (duration > 60) {
                                        duration /= 60;
                                        unit = 'm';

                                        if (duration > 60) {
                                            duration /= 60;
                                            unit = 'h';
                                        }
                                    }
                                }

                                header = `${header} (duration=${duration.toFixed(2)}${unit})`;
                            }

                            return color.colorize(
                                info.level,
                                info.level,
                                `${header}: ${info.message}`,
                            );
                        }),
                    ),
                }),
            ],
        });
    }

    update(publicDir) {
        const cacheManager = new LocalCacheManager(path.join(publicDir, 'local'));

        return this.getConfigs(publicDir)
            .then((configs) => {
                if (configs.length === 0) {
                    const errorMessage = `No config found in ${publicDir}/config.json or ${publicDir}/configs/{siteId}/config.json`;

                    this.logger.error(errorMessage);

                    return Promise.reject(new Error(errorMessage));
                }

                this.logger.info(`Will update ${configs.length} sites`);

                return Promise.all(configs.map(config => this.updateSite(config, cacheManager)));
            });
    }

    getConfigs(publicDir) {
        return this.readConfigFile(`${publicDir}/config.json`)
            .then(defaultConfig => this.readConfigDir(`${publicDir}/configs`, defaultConfig)
                .then((sites) => {
                    const tasks = sites.map(site => this.readConfigFile(`${publicDir}/configs/${site}/config.json`, site));

                    return Promise.all(tasks);
                })
                .then((results) => {
                    const configs = results.filter(result => result !== null);

                    if (defaultConfig !== null) {
                        configs.push(defaultConfig);
                    }

                    return configs;
                }));
    }

    readConfigDir(path, defaultConfig = null) {
        return new Promise((resolve) => {
            fs.readdir(path, 'utf8', (err, files) => {
                if (err) {
                    this.logger.warn(`Unable to read ${path}`);
                    resolve([]);
                } else {
                    const result = files.map(file => parseInt(file, 10))
                        .filter((site) => {
                            if (!Number.isInteger(site)) {
                                return false;
                            }

                            if (defaultConfig !== null && defaultConfig.api.site === site) {
                                this.logger.warn(`${path} will be ignored as it is handled by default config`);
                                return false;
                            }

                            return true;
                        });

                    resolve(result);
                }
            });
        });
    }

    readConfigFile(path, expectedSite = null) {
        return new Promise((resolve) => {
            fs.readFile(path, 'utf8', (err, data) => {
                let result = null;

                if (err) {
                    this.logger.warn(`Unable to read config file ${path}`);
                } else {
                    try {
                        const config = JSON.parse(data);

                        if (this.isValidConfig(config, path, expectedSite)) {
                            result = config;
                        }
                    } catch (e) {
                        this.logger.error(`Config file ${path} is not a valid JSON file`);
                    }
                }

                resolve(result);
            });
        });
    }

    updateSite(config, cacheManager) {
        const profiler = this.logger.startTimer();

        return cacheManager.update(config.api.site, config.api)
            .then((updated) => {
                if (updated) {
                    profiler.done({
                        message: 'Sync success, cache is up-to-date',
                    });
                } else {
                    profiler.done({
                        message: 'Sync failed (no Internet connexion), but cache is present',
                        level: 'warn',
                    });
                }

                return { site: config.api.site, cache: true, updated };
            })
            .catch((e) => {
                const errorMessage = 'Unable to sync, and no cache available';
                this.logger.error(`${errorMessage} caused by \n\t\t${e.toString()}`);

                return { site: config.api.site, cache: false, error: new Error(errorMessage) };
            });
    }

    isValidConfig(config, sourcePath, expectedSite) {
        if (config === null || typeof config !== 'object') {
            this.logger.error(`Invalid config file ${sourcePath}, should be an object`);

            return false;
        }

        if (config.api === null || typeof config.api !== 'object') {
            this.logger.error(`Invalid config file ${sourcePath}, config.api should be an object`);

            return false;
        }

        if (!config.api.endpoint) {
            this.logger.error(`Invalid config file ${sourcePath}, config.api.endpoint is empty`);

            return false;
        }

        if (!Number.isInteger(config.api.site)) {
            this.logger.error(`Invalid config file ${sourcePath}, config.api.site should be an integer`);

            return false;
        }

        if (!config.api.username) {
            this.logger.error(`Invalid config file ${sourcePath}, config.api.username is empty`);

            return false;
        }

        if (!config.api.key) {
            this.logger.error(`Invalid config file ${sourcePath}, config.api.key is empty`);

            return false;
        }

        if (expectedSite !== null && config.api.site !== expectedSite) {
            this.logger.error(`Invalid config file ${sourcePath}, should match site ${expectedSite}`);

            return false;
        }

        return true;
    }
}

export default DataUpdater;
