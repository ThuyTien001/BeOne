import { Component, ViewChild } from '@angular/core';
import { DGF } from '@app/@shared/digiforce';

import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { Router, RouterModule } from '@angular/router';
import { MainLogoComponent, SpinnerModule } from '@app/@theme/components';
import { SharedModule } from '@app/@shared/shared.module';
import { MessagesModule } from 'primeng/messages';
import { InputMaskModule } from 'primeng/inputmask';
import _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import { Utils } from '@app/@shared/utils';
import { FirebaseHandler } from '@app/@shared/firebase';
import { SendCodeButtonComponent } from '../send-code-btn/send-code-btn.component';

@Component({
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.scss'],
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
        InputMaskModule,
        // SendCodeButtonComponent,
    ],
})
export class SignUpComponent {
    @ViewChild('sendCodeBtn', { static: false }) sendCodeBtn: SendCodeButtonComponent;

    _phoneNumber: any;
    get phoneNumber() {
        return this._phoneNumber ? `0${this._phoneNumber}` : '';
    };

    password!: string;
    passwordConfirm = '';
    userDisplayName = '';
    isLoading = false;
    errMessages: any = [];

    constructor(
        private router: Router,
        private translateService: TranslateService,
    ) { }

    validatePhoneNumber() {
        if (!this._phoneNumber) {
            this.errMessages = [{
                severity: 'error',
                summary: this.translateService.instant('auth.missing_phone'),
            }];
            return false;
        }
        else if (!Utils.validate('phone', this.phoneNumber)) {
            this.errMessages = [{
                severity: 'error',
                summary: this.translateService.instant('auth.invalid_phone'),
            }];
            return false;
        }
        return true;
    }

    validateData() {
        // this.errMessages = [];
        if (!this.validatePhoneNumber()) {
            return false;
        }
        // let verifyCode = this.sendCodeBtn.getVerifyCode();
        // if (!verifyCode) {
        //     this.errMessages = [{
        //         severity: 'error',
        //         summary: this.translateService.instant('auth.invalid_code'),
        //     }];
        //     return false;
        // }
        if (!this.password || !this.passwordConfirm) {
            this.errMessages = [{
                severity: 'error',
                summary: this.translateService.instant('auth.invalid_password'),
            }];
            return true;
        }
    }

    async signUp() {
        if (!this.validateData()) return;
        this.isLoading = true;
        try {
            let verifyCode = this.sendCodeBtn.getVerifyCode();
            let idToken = await FirebaseHandler.verifyCode(verifyCode);
            if (!idToken) {
                this.errMessages = [{
                    severity: 'error',
                    summary: this.translateService.instant('auth.invalid_code'),
                }];
            }
            else {
                await DGF.Auth.signUpWithFirebasePhoneNumber({
                    userDisplayName: this.userDisplayName,
                    phoneNumber: this.phoneNumber,
                    pwd: this.password,
                    firebaseIdToken: idToken,
                    verifyCode: verifyCode,
                });
                this.router.navigate(['/']);
            }
        } catch (error: any) {
            Utils.devLog(error);
            if (error.response.data === 'accounts.mobileAlreadyExists') {
                this.errMessages = [{
                    severity: 'error',
                    summary: this.translateService.instant('auth.mobile_already_exists'),
                }];
            }
            else {
                this.errMessages = [{
                    severity: 'error',
                    summary: this.translateService.instant('auth.sign_up_failed'),
                }];
            }
        }
        this.isLoading = false;
    }

}
