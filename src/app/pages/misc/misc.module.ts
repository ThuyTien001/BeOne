import { NgModule } from '@angular/core';
import { provideRouter, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { NotfoundComponent } from './notfound/notfound.component';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { ErrorComponent } from './error/error.component';
import { MainLogoComponent } from '@app/@theme/components';
import { SharedModule } from '@app/@shared/shared.module';

@NgModule({
    imports: [
        SharedModule,
        ButtonModule,
        RouterModule,
        MainLogoComponent,
    ],
    declarations: [
        NotfoundComponent,
        AccessDeniedComponent,
        ErrorComponent,
    ],
    providers: [provideRouter([
        { path: 'access-denied', title: 'BeOne', component: AccessDeniedComponent },
        { path: 'error', title: 'BeOne', component: ErrorComponent },
        { path: '404', title: 'BeOne', component: NotfoundComponent },
        { path: '**', redirectTo: '404' },
    ])]
})
export class MiscModule { }
