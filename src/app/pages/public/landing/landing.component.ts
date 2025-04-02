import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LayoutService } from '@app/@theme/services';
import { StyleClassModule } from 'primeng/styleclass';
import { DividerModule } from 'primeng/divider';
import { ChartModule } from 'primeng/chart';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { MainLogoComponent } from '@app/@theme/components';
import { SharedModule } from '@app/@shared/shared.module';
import { InputTextModule } from 'primeng/inputtext';
import { CarouselModule } from 'primeng/carousel';
import { DGF } from '@app/@shared/digiforce';
import { SkeletonModule } from 'primeng/skeleton';
import { TranslateService } from '@ngx-translate/core';
import { PublicPageService } from '../shared';

@Component({
    templateUrl: './landing.component.html',
    standalone: true,
    imports: [
        SharedModule,
        DividerModule,
        StyleClassModule,
        ChartModule,
        PanelModule,
        ButtonModule,
        MainLogoComponent,
        InputTextModule,
        CarouselModule,
        SkeletonModule,
        RouterModule,
    ],
    styleUrls: ['./landing.component.scss'],
})
export class LandingComponent implements OnInit {

    firstPost: any = {};
    listPost: Array<any> = [];
    listFeatured = [
        {
            url: 'assets/images/landing/adv2-1.svg',
            title: 'Lớp quy mô nhỏ',
            content: '15 học viên trở xuống',
        },
        {
            url: 'assets/images/landing/adv2-2.svg',
            title: 'Ứng dụng công nghệ',
            content: 'Trong dạy và học',
        },
        {
            url: 'assets/images/landing/adv2-3.svg',
            title: 'Giáo viên sư phạm',
            content: 'Giàu kinh nghiệm giảng dạy',
        },
    ];
    listTeachers = [
        {
            url: 'assets/images/landing/teacher-1.png',
            name: 'GV. NGUYỄN KIM ANH',
            position: 'Giáo viên Toán 6',
        },
        {
            url: 'assets/images/landing/teacher-2.png',
            name: 'GV. LÊ QUANG TUẤN',
            position: 'Trưởng ban học thuật',
        },
        {
            url: 'assets/images/landing/teacher-3.png',
            name: 'GV. LÊ KIM PHƯỢNG',
            position: 'Giáo viên Toán 11',
        },
    ];
    responsiveOptions = [
        {
            breakpoint: '991px',
            numVisible: 3,
            numScroll: 1
        },
        {
            breakpoint: '767px',
            numVisible: 1,
            numScroll: 1
        }
    ];

    isLoadingPost = false;

    constructor(
        public layoutService: LayoutService,
        public router: Router,
        public translateService: TranslateService,
        public publicPageService: PublicPageService,
    ) { }

    navigateToPostDetail(post: any) {
        this.router.navigateByUrl(`/post-details?id=${post.id}`, {});
    }

    ngOnInit(): void {
        this.loadListPost();
    }

    async loadListPost() {
        this.isLoadingPost = true;
        try {
            this.listPost = [];
            let res = await DGF.API.post('api_lms/extracurriculars/get_posts_for_landing', {});
            for (let item of res.posts || []) {
                this.listPost.push(this.publicPageService.formatPostData(item));
            }
            this.firstPost = this.listPost[0] || {};
        } catch (error) {
            console.log(error);
        }
        this.isLoadingPost = false;
    }
}
