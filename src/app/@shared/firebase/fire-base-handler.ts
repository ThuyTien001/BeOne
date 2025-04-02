import { Utils } from '@app/@shared/utils';
import { getAuth, RecaptchaVerifier, Auth, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { Env } from '@env';
import _ from 'lodash';

export class FirebaseHandler {
    static auth: Auth;
    static recaptchaVerifier: RecaptchaVerifier;
    static confirmation: ConfirmationResult;
    static initiation = false;

    static init() {
        if (FirebaseHandler.initiation) return;

        FirebaseHandler.initiation = true;
        const config = {
            appId: Env.FIREBASE.APP_ID,
            projectId: Env.FIREBASE.PROJECT_ID,
            apiKey: Env.FIREBASE.API_KEY,
            authDomain: Env.FIREBASE.AUTH_DOMAIN,
            storageBucket: Env.FIREBASE.STORAGE_BUCKET,
            messagingSenderId: Env.FIREBASE.MESSAGING_SENDER_ID,
            measurementId: Env.FIREBASE.MEASUREMENT_ID,
        };
        Utils.devLog('Firebase Config: ', config);
        initializeApp(config);
        FirebaseHandler.auth = getAuth();
        FirebaseHandler.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
            'size': 'invisible',
            'callback': (response: any) => {
                Utils.devLog('RecaptchaVerifier Callback', response);
            },
            'expired-callback': function (response: any) {
                Utils.devLog('RecaptchaVerifier Expired', response);
            }
        }, FirebaseHandler.auth);
        Utils.devLog('Firebase init completed');
    }

    static async sendVerifyCode(phoneNumber: string) {
        try {
            FirebaseHandler.confirmation = await signInWithPhoneNumber(
                FirebaseHandler.auth,
                FirebaseHandler.formatPhoneNumber(phoneNumber),
                FirebaseHandler.recaptchaVerifier
            );
        } catch (error) {
            console.error('Send Verify Code', error);
            throw error;
        }
    }

    static async verifyCode(code: string) {
        if (!FirebaseHandler.confirmation) throw Error('Missing confirmation handler, Are you sent code to user?');

        try {
            let result = await FirebaseHandler.confirmation.confirm(code);
            return await result.user.getIdToken();
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    static formatPhoneNumber(val: string) {
        return _.startsWith(val, '0') ? '+84' + val.slice(1) : val;
    }
}