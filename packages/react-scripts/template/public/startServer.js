const AS = require('./server/application-server.es6');
const serverOptions = require('./server/options');

let server = new AS.Server(new AS.Options(serverOptions));

server.start().then(
    (server)=>{
        console.log(server.url);

        server.analytics.start();
        /*result.analytics.ping().then(
            (result)=>{
                console.log(result);
            }
        );*/

        AS.Chrome(server.url);
    },
    (e)=> {
        console.log(e);
    }
);



