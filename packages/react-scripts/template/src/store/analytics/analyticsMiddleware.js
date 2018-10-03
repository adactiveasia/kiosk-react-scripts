import { Tracker } from '@adactive/adsum-client-analytics';
import trackMapActions from './trackMapActions';
import config from '../../services/Config';

let tracker = null;
let getMessage = action => `Analytics tracker is not ready, action "${action.type}" will not be record`;

config.wait().then(() => {
    if (!config.config.analytics) {
        console.error('Current Site does not support analytics v2, you need to enable it on Studio admin');
        getMessage = () => 'Current Site does not support analytics v2, you need to enable it on Studio admin';

        return;
    }

    // Overwrite analytics config to use localhost API instead
    tracker = new Tracker(Object.assign({}, config.config.analytics, { endpoint: '/proxy-analytics' }));
    tracker.start(200);
});

const analyticsMiddleware = store => next => (action) => {
    if (tracker === null) {
        console.warn(getMessage(action));

        return next(action);
    }
    trackMapActions(tracker, store, action);

    return next(action);
};

export default analyticsMiddleware;
