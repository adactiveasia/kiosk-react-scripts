const { Server, DataUpdater } = require('./server/application-server.min');
const serverOptions = require('./server/options');

const updater = new DataUpdater();

updater.update(339, {
    "endpoint": "https://asia-api.adsum.io",
    "username": "1056-device",
    "key": "b6e8e6eaf2c7ff66b783e7721a57ed62f204c3bc3a68b729c1ea3a90a7c1e828"
}).then(() => {
    let server = new Server(serverOptions);

    server
        .start()
        .then(
            (server) => {
            },
            console.error,
        );
});
