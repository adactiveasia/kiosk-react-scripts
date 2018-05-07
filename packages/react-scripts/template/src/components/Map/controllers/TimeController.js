import { Path  } from '@adactive/adsum-web-map';

class TimeController {
    constructor() {
        this.awm = null;
        this.locked = false;
    }

    init(awm) {
        this.awm = awm;
        return this;
    }

}

const timeController = new TimeController();
export default timeController;