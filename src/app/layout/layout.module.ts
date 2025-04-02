import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputTextModule } from 'primeng/inputtext';
import { SidebarModule } from 'primeng/sidebar';
import { BadgeModule } from 'primeng/badge';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputSwitchModule } from 'primeng/inputswitch';
import { RippleModule } from 'primeng/ripple';
import { RouterModule } from '@angular/router';
import { AppLayoutComponent } from './layout.component';
import { AppTopBarComponent } from './top-bar/top-bar.component';
import { AppFooterComponent } from './footer/footer.component';
import { AppSidebarComponent } from './sidebar/sidebar.component';
import { ButtonModule } from 'primeng/button';
import { AppMenuitemComponent } from './sidebar/menu-item/menu-item.component';
import { ThemeModule } from '@app/@theme/theme.module';
import { MainLogoComponent, SpinnerModule, UserAvatarComponent } from '@app/@theme/components';
import { SharedModule } from '@app/@shared/shared.module';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ScrollTopModule } from 'primeng/scrolltop';
import { MenuModule } from 'primeng/menu';
import { OverlayModule } from 'primeng/overlay';
import { PasswordModule } from 'primeng/password';
import { MessagesModule } from 'primeng/messages';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';

@NgModule({
    imports: [
        SharedModule,
        ThemeModule,
        BrowserModule,
        FormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        InputTextModule,
        SidebarModule,
        BadgeModule,
        RadioButtonModule,
        InputSwitchModule,
        RippleModule,
        RouterModule,
        ButtonModule,
        MainLogoComponent,
        UserAvatarComponent,
        BadgeModule,
        BreadcrumbModule,
        ScrollTopModule,
        MenuModule,
        OverlayModule,
        PasswordModule,
        MessagesModule,
        DialogModule,
        SpinnerModule,
        DividerModule,
    ],
    exports: [AppLayoutComponent],
    declarations: [
        AppMenuitemComponent,
        AppTopBarComponent,
        AppFooterComponent,
        AppSidebarComponent,
        AppLayoutComponent,
    ]
})
export class AppLayoutModule { }
