import { NgModule } from '@angular/core';
import { RouterModule, provideRouter } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MainLogoComponent } from '@app/@theme/components';
import { SharedModule } from '@app/@shared/shared.module';
import { StyleClassModule } from 'primeng/styleclass';
import { PublicLayoutComponent } from './public-layout.component';
import { PublicPageService } from './shared';
import { SideBtnGroupComponent } from './side-btn-group/side-btn-group.component';

@NgModule({
    imports: [
        SharedModule,
        StyleClassModule,
        ButtonModule,
        MainLogoComponent,
        RouterModule,
        SideBtnGroupComponent,
    ],
    exports: [PublicLayoutComponent],
    declarations: [
        PublicLayoutComponent,
    ],
    providers: [
        PublicPageService,
        provideRouter([
            {
                path: '',
                title: 'BeOne',
                component: PublicLayoutComponent,
                children: [
                    {
                        path: 'landing',
                        title: 'BeOne - Trang chủ',
                        loadComponent: () => import('./landing/landing.component').then(m => m.LandingComponent)
                    },
                    {
                        path: 'study-center',
                        title: 'BeOne - Học tại trung tâm',
                        loadComponent: () => import('./study-center/study-center.component').then(m => m.StudyCenterComponent)
                    },
                    {
                        path: 'teachers',
                        title: 'BeOne - Giáo Viên',
                        loadComponent: () => import('./teachers/teachers.component').then(m => m.TeachersComponent)
                    },
                    {
                        path: 'list-posts',
                        title: 'BeOne - Tin tức và sự kiện',
                        loadComponent: () => import('./list-posts/list-posts.component').then(m => m.ListPostsComponent)
                    },
                    {
                        path: 'post/:id',
                        title: 'BeOne - Tin tức và sự kiện',
                        loadComponent: () => import('./post-details/post-details.component').then(m => m.PostDetailsComponent)
                    },
                    { path: '**', redirectTo: 'landing' },
                ]
            },
        ])
    ]
})
export class PublicLayoutModule { }
