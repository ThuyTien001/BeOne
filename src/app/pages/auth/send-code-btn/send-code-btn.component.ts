import { Component, Input, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SharedModule } from '@app/@shared/shared.module';
import { MessagesModule } from 'primeng/messages';
import _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import { FirebaseHandler } from '@app/@shared/firebase';
import { InputTextModule } from 'primeng/inputtext';

const TOTAL_COUNTDOWN = 60;

@Component({
    selector: 'lms-send-code-btn',
    templateUrl: './send-code-btn.component.html',
    styleUrls: ['./send-code-btn.component.scss'],
    standalone: true,
    imports: [
        SharedModule,
        ButtonModule,
        RouterModule,
        FormsModule,
        MessagesModule,
        InputTextModule,
    ],
})
export class SendCodeButtonComponent implements OnInit {

    @Input() phoneNumber = '';
    verifyCode = '';

    get sendCodeBtnLabel() {
        let base = this.translateService.instant('auth.send_code');
        return this.timer.current ? base + ` (${this.timer.current})` : base;
    };

    timer = {
        current: 0,
        interval: null,
        start: () => {
            this.timer.current = TOTAL_COUNTDOWN;
            this.timer.interval = setInterval(
                () => {
                    this.timer.current -= 1;
                    if (this.timer.current <= 0) this.timer.end();
                },
                1000
            ) as any;
        },
        end: () => {
            if (this.timer.interval) {
                clearInterval(this.timer.interval as any);
                this.timer.interval = null;
                this.timer.current = 0;
            }
        },
    };

    constructor(
        public router: Router,
        private translateService: TranslateService,
    ) { }

    ngOnInit(): void {
        FirebaseHandler.init();
    }

    async sendVerifyCode() {
        if (this.timer.current !== 0) return;
        this.timer.start();
        await FirebaseHandler.sendVerifyCode(this.phoneNumber);
    }

    getVerifyCode() {
        return this.verifyCode;
    }

}
