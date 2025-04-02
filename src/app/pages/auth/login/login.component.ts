import { Component, ViewChild } from '@angular/core';
import { DGF } from '@app/@shared/digiforce';

import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MainLogoComponent, SpinnerModule } from '@app/@theme/components';
import { SharedModule } from '@app/@shared/shared.module';
import { MessagesModule } from 'primeng/messages';
import _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import { SendCodeButtonComponent } from '../send-code-btn/send-code-btn.component';
import { FirebaseHandler } from '@app/@shared/firebase';

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: true,
    imports: [
        SharedModule,
        ButtonModule,
        RouterModule,
        CheckboxModule,
        InputTextModule,
        FormsModule,
        PasswordModule,
        MainLogoComponent,
        SpinnerModule,
        MessagesModule,
        SendCodeButtonComponent,
    ],
})
export class LoginComponent {
    @ViewChild('sendCodeBtn', { static: false }) sendCodeBtn: SendCodeButtonComponent;

    isLoading = false;
    password!: string;
    errMessages: any = [];

    loginType: 'code' | 'pwd' = 'code';

    _phoneNumber = '';
    get phoneNumber() {
        return this._phoneNumber ? `0${this._phoneNumber}` : '';
    };

    constructor(
        public router: Router,
        private route: ActivatedRoute,
        private translateService: TranslateService,
    ) { }

    changeLoginType() {
        this.loginType = this.loginType === 'code' ? 'pwd' : 'code';
    }

    async login() {
        this.isLoading = true;
        try {
            if (this.loginType === 'pwd') {
                await DGF.Auth.login(this.phoneNumber, this.password);
            }
            else {
                let verifyCode = this.sendCodeBtn.getVerifyCode();
                let idToken = await FirebaseHandler.verifyCode(verifyCode);
                if (!idToken) {
                    this.errMessages = [{
                        severity: 'error',
                        summary: this.translateService.instant('auth.invalid_code'),
                    }];
                    return;
                }
                await DGF.Auth.login(this.phoneNumber, '', idToken);
            }
            let { url, queryParams } = this.getUrlAndQueryParams(this.route.snapshot.queryParams['returnUrl']);
            this.router.navigate([url], { queryParams });
        } catch (error) {
            console.log('Login Error: ', error);
            let invalidCredentials = _.get(error, 'response.data.message') === 'accounts.invalid_credentials';
            let errMsg = this.translateService.instant('auth.login_failed');
            if (invalidCredentials) {
                errMsg = this.translateService.instant('auth.invalid_username_password');
            }
            this.errMessages = [{
                severity: 'error',
                summary: this.translateService.instant('common.error'),
                detail: errMsg
            }];
        }
        setTimeout(() => { this.isLoading = false }, 300);
    }

    getUrlAndQueryParams(inputUrl: string) {
        let url = '/';
        let queryParams: any = {};
        if (!inputUrl) {
            return { url, queryParams };
        }
        else {
            let index = inputUrl.indexOf('?');
            if (index === -1) {
                return { url: inputUrl, queryParams };
            }
            else {
                url = inputUrl.substring(0, index);
                let urlParams = new URLSearchParams(inputUrl.substring(index));
                urlParams.forEach((value, prop) => {
                    queryParams[prop] = value;
                });
                return { url, queryParams };
            }
        }
    }

}
