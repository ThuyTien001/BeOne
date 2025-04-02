import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DGF } from '@app/@shared/digiforce';
import { LayoutService, MenuService } from '@app/@theme/services';
import { MenuItem, Message } from 'primeng/api';
import _ from 'lodash';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AlertMessageService } from '@app/@shared/services';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
const sha256 = require('crypto-js/sha256');

@Component({
    selector: 'lms-topbar',
    styleUrls: ['./top-bar.component.scss'],
    templateUrl: './top-bar.component.html'
})
export class AppTopBarComponent {
    @Input() minimal: boolean = false;

    @ViewChild('menuButton') menuButton!: ElementRef;
    @ViewChild('topBarMenuButton') topbarMenuButton!: ElementRef;
    @ViewChild('topBarMenuButtonFull') topbarMenuButtonFull!: ElementRef;
    @ViewChild('topBarMenu') menu!: ElementRef;

    @ViewChild('notificationBtn') notificationBtn!: ElementRef;
    @ViewChild('notificationView') notificationView!: ElementRef;

    items!: MenuItem[];
    scales: number[] = [12, 13, 14, 15, 16];

    userDisplayName = '';


    isLoadingDialog = false;
    isShowChangePwdDialog = false;
    changPwdData: {
        current: string,
        new: string,
        confirm: string,
        errMessages: Array<Message>,
    } = { current: '', new: '', confirm: '', errMessages: [], };

    constructor(
        public layoutService: LayoutService,
        public menuService: MenuService,
        private router: Router,
        public translateService: TranslateService,
        public alertMessageService: AlertMessageService,
    ) {
        this.applyScale();
        this.userDisplayName = _.get(DGF.Context.getUser(), 'name') || '';
        DGF.Context.changeContext$
        .pipe(takeUntilDestroyed())
        .subscribe(() => {
            this.userDisplayName = _.get(DGF.Context.getUser(), 'name') || '';
        });
    }

    get isShowMenu() {
        return this.layoutService.isDesktop()
            ? !this.layoutService.state.staticMenuDesktopInactive
            : this.layoutService.state.staticMenuMobileActive;
    }

    async logout() {
        try {
            await DGF.Auth.logout();
        } catch (error) {
            console.log(error);
        }
        this.router.navigate(['/auth/login']);
    }

    goToProfilePage() {
        this.router.navigate(['/pages/profile']);
    }

    // ------------------------------------------------------------------------
    // Appearances Setting
    // ------------------------------------------------------------------------

    get visible(): boolean {
        return this.layoutService.state.configSidebarVisible;
    }

    set visible(_val: boolean) {
        this.layoutService.state.configSidebarVisible = _val;
    }

    get scale(): number {
        return this.layoutService.config.scale;
    }

    set scale(_val: number) {
        this.layoutService.config.scale = _val;
    }

    get menuMode(): string {
        return this.layoutService.config.menuMode;
    }

    set menuMode(_val: string) {
        this.layoutService.config.menuMode = _val;
    }

    get inputStyle(): string {
        return this.layoutService.config.inputStyle;
    }

    set inputStyle(_val: string) {
        this.layoutService.config.inputStyle = _val;
    }

    get ripple(): boolean {
        return this.layoutService.config.ripple;
    }

    set ripple(_val: boolean) {
        this.layoutService.config.ripple = _val;
    }

    onConfigButtonClick() {
        this.layoutService.showConfigSidebar();
    }

    changeTheme(theme: string, colorScheme: string) {
        const themeLink = <HTMLLinkElement>document.getElementById('theme-css');
        const newHref = themeLink.getAttribute('href')!.replace(this.layoutService.config.theme, theme);
        this.replaceThemeLink(newHref, () => {
            this.layoutService.config.theme = theme;
            this.layoutService.config.colorScheme = colorScheme;
            this.layoutService.onConfigUpdate();
        });
    }

    replaceThemeLink(href: string, onComplete: Function) {
        const id = 'theme-css';
        const themeLink = <HTMLLinkElement>document.getElementById('theme-css');
        const cloneLinkElement = <HTMLLinkElement>themeLink.cloneNode(true);

        cloneLinkElement.setAttribute('href', href);
        cloneLinkElement.setAttribute('id', id + '-clone');

        themeLink.parentNode!.insertBefore(cloneLinkElement, themeLink.nextSibling);

        cloneLinkElement.addEventListener('load', () => {
            themeLink.remove();
            cloneLinkElement.setAttribute('id', id);
            onComplete();
        });
    }

    decrementScale() {
        this.scale--;
        this.applyScale();
    }

    incrementScale() {
        this.scale++;
        this.applyScale();
    }

    applyScale() {
        document.documentElement.style.fontSize = this.scale + 'px';
    }

    // ------------------------------------------------------------------------
    // Change Password
    // ------------------------------------------------------------------------

    openChangePasswordDialog() {
        this.changPwdData = {
            current: '',
            new: '',
            confirm: '',
            errMessages: [],
        };
        this.isShowChangePwdDialog = true;
    }

    async changePassword() {
        if (!this.changPwdData.current) {
            this.changPwdData.errMessages = [{
                severity: 'error',
                summary: this.translateService.instant('profile.change_pwd.alert.missing_password'),
            }];
            return;
        }
        if (!this.changPwdData.new
            || !this.changPwdData.confirm
            || this.changPwdData.new !== this.changPwdData.confirm
        ) {
            this.changPwdData.errMessages = [{
                severity: 'error',
                summary: this.translateService.instant('profile.change_pwd.alert.pwd_not_match'),
            }];
            return;
        }
        this.isLoadingDialog = true;
        try {

            await DGF.API.post(
                '/accounts/password/changePassword',
                {
                    oldPassword: sha256(this.changPwdData.current).toString(),
                    newPassword: sha256(this.changPwdData.new).toString(),
                },
                {
                    Authorization: 'BEARER ' + DGF.Context.getAuthToken()
                }
            );
            this.alertMessageService.success('profile.change_pwd.alert.success');
            this.isShowChangePwdDialog = true;
        } catch (error) {
            console.log(error);
            this.alertMessageService.error('profile.change_pwd.alert.error');
        }
        this.isLoadingDialog = false;
    }

}
