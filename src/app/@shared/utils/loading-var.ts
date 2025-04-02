import moment from 'moment';

export class LoadingVar {
    value = false;
    private startAt: any;
    private pending: boolean;
    private delayTime: number = 300; // ms

    constructor(initValue?: boolean, delayTime?: number) {
        this.value = !!initValue;
        this.delayTime = delayTime || 300;
    }

    start() {
        this.startAt = moment();
        this.value = true;
    }

    stop() {
        if (this.pending) return;
        this.pending = true;
        let diff = moment().diff(this.startAt, 'ms');
        diff = diff < this.delayTime ? this.delayTime : 0;
        setTimeout(() => {
            this.value = false;
            this.pending = false;
        }, diff);
    }
}
