const { Server, DataUpdater } = require('./server/application-server');
const serverOptions = require('./server/options');

const updater = new DataUpdater();

updater
    .update(__dirname)
    .then(() => {
        let server = new Server(serverOptions);

        server
            .start()
            .then(
                (server) => {
                },
                console.error,
            );
    });
