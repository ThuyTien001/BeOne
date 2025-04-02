import { NgModule } from '@angular/core';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppLayoutModule } from './layout/layout.module';
import { HttpClient } from '@angular/common/http';
import { MojoTranslateLoader } from './custom-translate-loader';
import { Env } from '@env';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ThemeModule } from './@theme/theme.module';
import { AppInitializer } from './app.initializer';
import { RouteReuseStrategy, RouterModule } from '@angular/router';
import { AppLayoutComponent } from './layout/layout.component';
import { AuthGuard } from './@shared/guards';
import { RedirectComponent } from './redirect.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AlertMessageService } from './@shared/services';
import { MathjaxModule } from './@shared/mathjax';
import { CacheRouteReuseStrategy } from './cache-route-reuse.strategy';
import { SharedModule } from './@shared/shared.module';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

export function createTranslateLoader(http: HttpClient) {
    return new MojoTranslateLoader(http, '/i18n/');
}

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        AppLayoutModule,
        ToastModule,
        ThemeModule.forRoot(),
        SharedModule.forRoot(),
        FontAwesomeModule,
        TranslateModule.forRoot({
            defaultLanguage: Env.DEFAULT_LANGUAGE || 'vi',
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader, // exported factory function needed for AoT compilation
                deps: [HttpClient]
            }
        }),
        MathjaxModule.forRoot({
            config: {
                tex: { inlineMath: [['$', '$'], ['\\(', '\\)']] },
            },
            src: 'https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/startup.js'
        }),
        NgCircleProgressModule.forRoot({
            // set defaults value
            'radius': 60,
            'space': -10,
            'outerStrokeGradient': true,
            'outerStrokeWidth': 10,
            'outerStrokeColor': '#00a1e4',
            'outerStrokeGradientStopColor': '#0071a0',
            'innerStrokeColor': '#e7e8ea',
            'innerStrokeWidth': 10,
            'animateTitle': true,
            'animationDuration': 300,
            'titleFontSize': '20',
            'unitsFontSize': '20',
            'showTitle': true,
            'showUnits': true,
            'showSubtitle': false,
            'showBackground': false,
            'responsive': true,
            'clockwise': true,
            'lazy': true
        }),
        RouterModule.forRoot(
            [
                { path: 'public', loadChildren: () => import('./pages/public/public-layout.module').then(m => m.PublicLayoutModule) },
                { path: 'landing', redirectTo: '/public/landing' },
                { path: 'misc', loadChildren: () => import('./pages/misc/misc.module').then(m => m.MiscModule) },
                {
                    path: 'auth',
                    children: [
                        {
                            path: 'sign-up',
                            title: 'BeOne - Đăng ký',
                            loadComponent: () => import('./pages/auth/sign-up/sign-up.component').then(m => m.SignUpComponent)
                        },
                        {
                            path: 'login',
                            title: 'BeOne - Đăng nhập',
                            loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent)
                        },
                        { path: '**', redirectTo: '/misc/404' },
                    ],
                },
                {
                    path: 'pages',
                    title: 'BeOne',
                    component: AppLayoutComponent,
                    canActivate: [AuthGuard],
                    children: [
                        {
                            path: 'dashboard',
                            title: 'BeOne - Tổng quát',
                            data: { breadcrumb: 'Tổng quát' },
                            loadComponent: () => import('./pages/dashboard/dashboard.component')
                                .then(m => m.DashboardComponent)
                        },
                        {
                            path: 'profile',
                            title: 'BeOne - Lý lịch học sinh',
                            data: { breadcrumb: 'Lý lịch học sinh' },
                            loadComponent: () => import('./pages/profile/profile.component')
                                .then(m => m.ProfileComponent)
                        },
                        {
                            path: 'questions',
                            title: 'BeOne - Quản lý câu hỏi',
                            data: { breadcrumb: 'Câu hỏi' },
                            loadComponent: () => import('./pages/list-questions/list-questions.component')
                                .then(m => m.ListQuestionsComponent)
                        },
                        {
                            path: 'exercises',
                            data: { breadcrumb: 'Soạn bài tập' },
                            children: [
                                {
                                    path: 'list',
                                    title: 'BeOne - Soạn bài tập',
                                    data: { breadcrumb: '' },
                                    loadComponent: () => import('./pages/exercises/list-exercises.component')
                                        .then(m => m.ListExercisesComponent),
                                },
                                {
                                    path: 'details/:id',
                                    title: 'BeOne - Chi tiết bài tập',
                                    data: { breadcrumb: '...' },
                                    loadComponent: () => import('./pages/exercises/view-exercises.component')
                                        .then(m => m.ViewExerciseComponent),

                                },
                                { path: '**', redirectTo: 'list' },
                            ]
                        },
                        {
                            path: 'do-exercises',
                            data: { breadcrumb: 'Bài tập' },
                            children: [
                                {
                                    path: 'list',
                                    data: { breadcrumb: '' },
                                    title: 'BeOne - Làm bài tập',
                                    loadComponent: () => import('./pages/do-exercises/list-do-exercises.component')
                                        .then(m => m.ListDoExercisesComponent),
                                },
                                {
                                    path: 'details/:id',
                                    title: 'BeOne - Chi tiết bài tập',
                                    data: { breadcrumb: '...' },
                                    loadComponent: () => import('./pages/do-exercises/view-do-exercises.component')
                                        .then(m => m.ViewDoExerciseComponent),
                                },
                                { path: '**', redirectTo: 'list' },
                            ]
                        },
                        {
                            path: 'my-lessons',
                            title: 'BeOne - Khóa học của tôi',
                            data: { breadcrumb: 'Khóa học của tôi' },
                            children: [
                                {
                                    path: 'list',
                                    data: { breadcrumb: '' },
                                    title: 'BeOne - Khóa học của tôi',
                                    loadComponent: () => import('./pages/student-group/my-lessons/my-lessons.component')
                                        .then(m => m.MyLessonsComponent),
                                },
                                {
                                    path: 'details/:subjectId',
                                    title: 'BeOne - Khóa học',
                                    data: { breadcrumb: '' },
                                    loadComponent: () => import('./pages/student-group/my-lessons/view-lesson.component')
                                        .then(m => m.ViewLessonComponent),
                                },
                                {
                                    path: 'details/:subjectId/:chapterId',
                                    title: 'BeOne - Khóa học',
                                    data: { breadcrumb: '' },
                                    loadComponent: () => import('./pages/student-group/my-lessons/view-lesson.component')
                                        .then(m => m.ViewLessonComponent),
                                },
                                {
                                    path: 'details/:subjectId/:chapterId/:lessonId',
                                    title: 'BeOne - Khóa học',
                                    data: { breadcrumb: '' },
                                    loadComponent: () => import('./pages/student-group/my-lessons/view-lesson.component')
                                        .then(m => m.ViewLessonComponent),
                                },
                                { path: '**', redirectTo: 'list' },
                            ]
                        },
                    ]
                },
                { path: '', title: 'BeOne', pathMatch: 'full', component: RedirectComponent },
                { path: '**', redirectTo: '/misc/404' },
            ],
            {
                scrollPositionRestoration: 'enabled',
                anchorScrolling: 'enabled',
                onSameUrlNavigation: 'ignore',
            }
        ),
    ],
    providers: [
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        { provide: RouteReuseStrategy, useClass: CacheRouteReuseStrategy },
        AppInitializer,
        AlertMessageService,
        MessageService,
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
