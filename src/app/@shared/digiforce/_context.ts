import { DGFUser, LMSRoles } from '@app/@declare';
import { Env } from '@env';
import { DGFUtils } from './_utils';
import { Subject } from 'rxjs';

export class DGFContext {
    static defaultSpaceId = Env.API.DEFAULT_SPACE;
    static user: DGFUser;
    static authToken: string;
    static spaceId: string;
    static userId: string;

    static changeContext$ = new Subject<any>();

    static initContext() {
        let userId = localStorage.getItem('DGF:UserId') as any;
        let spaceId = localStorage.getItem('DGF:SpaceId') as any;
        let authToken = localStorage.getItem('DGF:AuthToken') as any;
        DGFContext.setContext({
            userId,
            authToken,
            spaceId,
        });
    }

    static setContext(ctx: { user?: DGFUser, authToken?: string, spaceId?: string, userId?: string }) {
        if (ctx.user) {
            DGFContext.user = ctx.user;
            localStorage.setItem('DGF:UserId', ctx.user?._id);
        }
        else if (ctx.userId) {
            DGFContext.userId = ctx.userId;
            localStorage.setItem('DGF:UserId', ctx.userId);
        }
        if (ctx.authToken) {
            DGFContext.authToken = ctx.authToken;
            localStorage.setItem('DGF:AuthToken', ctx.authToken);
        }
        if (ctx.spaceId) {
            DGFContext.spaceId = ctx.spaceId;
            localStorage.setItem('DGF:SpaceId', ctx.spaceId);
        }
        DGFContext.changeContext$.next({
            user: DGFContext.user,
            authToken: DGFContext.authToken,
            spaceId: DGFContext.spaceId,
            userId: DGFContext.userId,
        });
    }

    static clearContext() {
        DGFContext.user = null as any;
        DGFContext.authToken = '';
        DGFContext.spaceId = '';
        DGFContext.userId = '';
        localStorage.removeItem('DGF:AuthToken');
        localStorage.removeItem('DGF:SpaceId');
        localStorage.removeItem('DGF:UserId');
        DGFContext.changeContext$.next(null);
    }

    static getUserId() {
        return DGFContext.user?._id || DGFContext.userId;
    }

    static getAuthToken() {
        return DGFContext.authToken;
    }

    static getSpaceId() {
        return DGFContext.spaceId || DGFContext.defaultSpaceId;
    }

    static getUser(): DGFUser {
        return DGFContext.user;
    }

    static getUserLMSRole(): LMSRoles {
        return DGFContext.user?.lms_role || LMSRoles.Student;
    }

    static getUserAvatarUrl(): string {
        return DGFContext.user?.avatar
            ? DGFUtils.absoluteUrl(`/avatar/${DGFContext.user._id}?w=220&h=200&fs=160&avatar=${DGFContext.user.avatar}`)
            : '';
    }

}
