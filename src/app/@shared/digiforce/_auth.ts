import { BehaviorSubject, Subject } from 'rxjs';
import _ from 'lodash';
import { DGFUser } from '@app/@declare';
import { DGFAPI } from './_api';
import { DGFContext } from './_context';
import moment from 'moment';
const sha256 = require('crypto-js/sha256');

export type LoginResponse = {
    sessionId: string;
    token: string;
    tokens: {
        refreshToken: string;
        accessToken: string;
    };
    space: string;
    spaces: Array<{
        _id: string;
        name: string;
    }>;
    user: DGFUser,
};

export class DGFAuth {
    static authenticatedSubject: Subject<boolean> = new BehaviorSubject(true);
    static currentUser: DGFUser;
    static authToken: string;

    /**
     * Check current user is authenticated
     * @returns boolean
     */
    static get isAuthenticated(): boolean {
        return !!DGFContext.getUserId();
    }

    static get isAdmin(): boolean {
        return !!DGFContext.getUser()?.is_space_admin;
    }

    static getCurrentUser(): any {
        return DGFContext.getUser();
    }

    static async validate() {
        if (!this.isAuthenticated) return;
        try {
            let requestData = { 'utcOffset': moment().utcOffset() / 60 };
            let authToken = DGFContext.getAuthToken();
            let spaceId = DGFContext.getSpaceId();
            let headers: any = {};
            if (authToken && spaceId) {
                headers['Authorization'] = 'Bearer ' + spaceId + ',' + authToken;
            } else if (authToken) {
                headers['X-User-Id'] = DGFContext.getUserId();
                headers['X-Auth-Token'] = authToken;
            }
            let res = await DGFAPI.post('api_lms/validate_user', requestData);
            this.authToken = res.authToken;
            this.currentUser = res || {};
            this.currentUser.id = this.currentUser._id = res.userId;
            DGFContext.setContext({
                user: this.currentUser,
                userId: this.currentUser?._id,
                authToken: this.authToken,
                spaceId: res.space,
            });
            return this.currentUser;
        } catch (error) {
            DGFContext.clearContext();
            console.log('Validate User failed', error);
            return;
        }
    }

    static async login(
        phoneNumber: string,
        pwd: string,
        firebaseIdToken?: string,
    ): Promise<LoginResponse | any> {
        try {
            let res: LoginResponse = await DGFAPI.post(
                '/accounts/password/login',
                firebaseIdToken
                    ? {
                        'user': {
                            'mobile': phoneNumber,
                            'spaceId': DGFContext.getSpaceId(),
                            'firebaseAuth': true,
                            'firebaseIdToken': firebaseIdToken,
                        },
                    }
                    : {
                        'user': {
                            'mobile': phoneNumber,
                            'spaceId': DGFContext.getSpaceId(),
                        },
                        'password': sha256(pwd).toString(),
                        'hash': 'sha256',
                    }
            );
            this.authToken = res.token;
            this.currentUser = res.user;
            DGFContext.setContext({
                userId: this.currentUser?._id,
                authToken: this.authToken,
                spaceId: res.space,
            });
            await this.validate();
            return res;
        } catch (error) {
            console.log('Login Error', error);
            throw error;
        }
    }

    static async signUpWithFirebasePhoneNumber(params: {
        userDisplayName: string,
        verifyCode: string,
        phoneNumber: string,
        pwd: string,
        firebaseIdToken: string
    }): Promise<any> {
        try {
            let res: LoginResponse = await DGFAPI.post(
                '/api_lms/student/register',
                {
                    verifyCode: params.verifyCode,
                    password: sha256(params.pwd).toString(),
                    name: params.userDisplayName,
                    mobile: params.phoneNumber,
                    firebaseIdToken: params.firebaseIdToken,
                    spaceId: DGFContext.getSpaceId(),
                }
            );
            this.authToken = res.token;
            this.currentUser = res.user;
            DGFContext.setContext({
                userId: this.currentUser?._id,
                authToken: this.authToken,
                spaceId: res.space,
            });
            await this.validate();
            return res;
        } catch (error) {
            console.log('Login Error', error);
            throw error;
        }
    }

    static async logout() {
        this.authenticatedSubject.next(false);
        if (this.isAuthenticated) {
            try {
                await DGFAPI.post('api/v4/users/logout', {});
                this.clearAuthLocalStorage();
            } catch (error) {
                console.log('Logout Error: ', error);
            }
        }
        return true;
    }

    static clearAuthLocalStorage() {
        DGFContext.clearContext();
    }

}
