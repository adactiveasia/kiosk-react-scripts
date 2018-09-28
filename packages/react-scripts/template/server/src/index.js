import Server from './Server';
import Version from './Version';
import Options from './Options';
import DataUpdater from './DataUpdater';

const handler = (opts) => {
    const updater = new DataUpdater();
    const serverOptions = new Options(opts);

    updater
        .update(serverOptions.path)
        .then(() => {
            const server = new Server(serverOptions);

            return server.start();
        });
};

/**
 * @exports APB
 */
export {
    /**
     * {@link Server}
     */
    Server,

    /**
     * {@link Options}
     */
    Options,

    /**
     * {@link Version}
     */
    Version,

    /**
     * {@link DataUpdater}
     */
    DataUpdater,

    handler,
};
