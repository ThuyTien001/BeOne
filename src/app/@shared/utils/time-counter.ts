import { computed, signal } from '@angular/core';


export class TimeCounter {
    private interval;
    // Unit: milisecond
    step = 1000;
    value = signal(0);
    label = computed(() => {
        let label = '';
        let totalSeconds = Math.floor(this.value() / 1000);
        let h = Math.floor(totalSeconds / 3600);
        let m = Math.floor((totalSeconds - (h * 3600)) / 60);
        let s = Math.floor(totalSeconds - (h * 3600) - (m * 60));
        if (h > 0) label += h + ' Giờ ';
        if (m > 0 || h > 0) label += m + ' Phút ';
        if (s > 0 || m > 0 || h > 0) label += s + ' Giây';
        return label;
    });
    running = false;

    constructor(value = 0, step = 1000) {
        this.step = step || 1000;
        this.value.set(value || 0);
    }

    start() {
        this.running = true;
        this.interval = setInterval(() => {
            this.value.update(val => val + this.step);
        }, this.step);
    }

    stop() {
        if (!this.running) return;
        this.running = false;
        clearInterval(this.interval);
    }
};