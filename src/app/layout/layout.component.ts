import { ChangeDetectorRef, Component, OnDestroy, Renderer2, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BreadCrumbService, LayoutService } from '@app/@theme/services';
import { filter, Subscription } from 'rxjs';
import { AppSidebarComponent } from './sidebar/sidebar.component';
import { AppTopBarComponent } from './top-bar/top-bar.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'lms-layout',
    templateUrl: './layout.component.html',
    styles: [`
        :host ::ng-deep .p-breadcrumb {
            border-radius: 0 !important;
            background-color: #fafafa;
        }
        :host ::ng-deep .p-scrolltop-sticky.p-link {
            position: absolute;
        }
        :host ::ng-deep .layout-menu ul a .layout-menuitem-icon.icomoon {
            margin-left: 0.15rem;
            font-size: 1.3rem;
            margin-right: 1.25rem;
        }
        :host ::ng-deep .layout-menu ul a .layout-menuitem-icon {
            margin-right: 1.25rem;
        }
    `],
})
export class AppLayoutComponent implements OnDestroy {

    menuOutsideClickListener: any;
    profileMenuOutsideClickListener: any;
    notificationOutsideClickListener: any;

    @ViewChild(AppSidebarComponent) appSidebar!: AppSidebarComponent;
    @ViewChild(AppTopBarComponent) appTopbar!: AppTopBarComponent;

    breadcrumbHome = { icon: 'icomoon icon-home2', routerLink: '/' };
    breadcrumbSubscription: Subscription;
    breadcrumbs: Array<any> = [];
    showBreadcrumb = true;

    constructor(
        public layoutService: LayoutService,
        public renderer: Renderer2,
        public router: Router,
        public cd: ChangeDetectorRef,
        private readonly breadcrumbService: BreadCrumbService,
    ) {
        this.breadcrumbService.breadcrumbs$
            .pipe(takeUntilDestroyed())
            .subscribe(
                (breadcrumbs) => {
                    this.breadcrumbs = [...breadcrumbs || []];
                }
            );
        this.layoutService.overlayOpen$
            .pipe(takeUntilDestroyed())
            .subscribe(() => {
                if (!this.menuOutsideClickListener) {
                    this.menuOutsideClickListener = this.renderer.listen('document', 'click', event => {
                        const isOutsideClicked = !(
                            this.appSidebar.el.nativeElement.isSameNode(event.target)
                            || this.appSidebar.el.nativeElement.contains(event.target)
                            || this.appTopbar.menuButton.nativeElement.isSameNode(event.target)
                            || this.appTopbar.menuButton.nativeElement.contains(event.target)
                        );

                        if (isOutsideClicked) {
                            this.hideMenu();
                        }
                    });
                }

                if (!this.profileMenuOutsideClickListener) {
                    this.profileMenuOutsideClickListener = this.renderer.listen('document', 'click', event => {
                        const isOutsideClicked = !(
                            this.appTopbar.menu.nativeElement.isSameNode(event.target)
                            || this.appTopbar.menu.nativeElement.contains(event.target)
                            || this.appTopbar.topbarMenuButton.nativeElement.isSameNode(event.target)
                            || this.appTopbar.topbarMenuButton.nativeElement.contains(event.target)
                            || this.appTopbar.topbarMenuButtonFull.nativeElement.isSameNode(event.target)
                            || this.appTopbar.topbarMenuButtonFull.nativeElement.contains(event.target)
                        );

                        if (isOutsideClicked) {
                            this.hideProfileMenu();
                        }
                    });
                }

                if (!this.notificationOutsideClickListener) {
                    this.notificationOutsideClickListener = this.renderer.listen('document', 'click', event => {
                        const isOutsideClicked = !(
                            this.appTopbar.notificationView.nativeElement.isSameNode(event.target)
                            || this.appTopbar.notificationView.nativeElement.contains(event.target)
                            || this.appTopbar.notificationBtn.nativeElement.isSameNode(event.target)
                            || this.appTopbar.notificationBtn.nativeElement.contains(event.target)
                        );

                        if (isOutsideClicked) {
                            this.hideNotifications();
                        }
                    });
                }

                if (this.layoutService.state.staticMenuMobileActive) {
                    this.blockBodyScroll();
                }
            });
        this.router.events
            .pipe(
                takeUntilDestroyed(),
                filter(event => event instanceof NavigationEnd)
            )
            .subscribe((event: NavigationEnd) => {
                this.showBreadcrumb = event?.url !== '/pages';

                
                this.hideMenu();
                this.hideProfileMenu();
                this.hideNotifications();
            });
    }

    hideMenu() {
        this.layoutService.state.overlayMenuActive = false;
        this.layoutService.state.staticMenuMobileActive = false;
        this.layoutService.state.menuHoverActive = false;
        if (this.menuOutsideClickListener) {
            this.menuOutsideClickListener();
            this.menuOutsideClickListener = null;
        }
        this.unblockBodyScroll();
    }

    hideProfileMenu() {
        this.layoutService.state.profileSidebarVisible = false;
        if (this.profileMenuOutsideClickListener) {
            this.profileMenuOutsideClickListener();
            this.profileMenuOutsideClickListener = null;
        }
    }

    hideNotifications() {
        this.layoutService.state.notificationsVisible = false;
        if (this.notificationOutsideClickListener) {
            this.notificationOutsideClickListener();
            this.notificationOutsideClickListener = null;
        }
    }

    blockBodyScroll(): void {
        if (document.body.classList) {
            document.body.classList.add('blocked-scroll');
        }
        else {
            document.body.className += ' blocked-scroll';
        }
    }

    unblockBodyScroll(): void {
        if (document.body.classList) {
            document.body.classList.remove('blocked-scroll');
        }
        else {
            document.body.className = document.body.className.replace(new RegExp('(^|\\b)' +
                'blocked-scroll'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    }

    get containerClass() {
        return {
            'layout-theme-light': this.layoutService.config.colorScheme === 'light',
            'layout-theme-dark': this.layoutService.config.colorScheme === 'dark',
            'layout-overlay': this.layoutService.config.menuMode === 'overlay',
            'layout-static': this.layoutService.config.menuMode === 'static',
            'layout-static-inactive': this.layoutService.state.staticMenuDesktopInactive && this.layoutService.config.menuMode === 'static',
            'layout-overlay-active': this.layoutService.state.overlayMenuActive,
            'layout-mobile-active': this.layoutService.state.staticMenuMobileActive,
            'p-input-filled': this.layoutService.config.inputStyle === 'filled',
            'p-ripple-disabled': !this.layoutService.config.ripple
        };
    }

    ngOnDestroy() {
        if (this.menuOutsideClickListener) {
            this.menuOutsideClickListener();
        }
    }
}
