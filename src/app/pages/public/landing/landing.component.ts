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
import { title } from 'process';

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
        // MainLogoComponent,
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
    displayedItems = [];
    displayedFeatured = [];
    loadMore() {
        const next = this.displayedItems.length + 3;
        this.displayedItems = this.listFeaturedAction.slice(0, next);
      }
      loadMoreFuture() {
        const next = this.displayedFeatured.length + 3;
        this.displayedFeatured = this.listFeatured.slice(0, next);
      }
    listFeatured = [
        {
            url: 'assets/images/landing/Item1.png',
            title: 'An toàn vận hành lò hơi - Bảo vệ an toàn, nâng tầm chất lượng công việc',
            content: '1.200.000 VND',
        },
        {
            url: 'assets/images/landing/Item2.png',
            title: 'Xây dựng đại xứ bán hàng doanh nghiệp bằng ứng dụng AI',
            content: '1.200.000 VND',
        },
        {
            url: 'assets/images/landing/Item3.png',
            title: 'Kỹ năng đàm phán và thương lượng',
            content: '1.200.000 VND',
        },
        {
            url: 'assets/images/landing/Item1.png',
            title: 'An toàn vận hành lò hơi - Bảo vệ an toàn, nâng tầm chất lượng công việc',
            content: '1.200.000 VND',
        },
        {
            url: 'assets/images/landing/Item2.png',
            title: 'Xây dựng đại xứ bán hàng doanh nghiệp bằng ứng dụng AI',
            content: '1.200.000 VND',
        },
        {
            url: 'assets/images/landing/Item3.png',
            title: 'Kỹ năng đàm phán và thương lượng',
            content: '1.200.000 VND',
        },
        {
            url: 'assets/images/landing/Item1.png',
            title: 'An toàn vận hành lò hơi - Bảo vệ an toàn, nâng tầm chất lượng công việc',
            content: '1.200.000 VND',
        },
        {
            url: 'assets/images/landing/Item2.png',
            title: 'Xây dựng đại xứ bán hàng doanh nghiệp bằng ứng dụng AI',
            content: '1.200.000 VND',
        },
        {
            url: 'assets/images/landing/Item3.png',
            title: 'Kỹ năng đàm phán và thương lượng',
            content: '1.200.000 VND',
        },
        {
            url: 'assets/images/landing/Item3.png',
            title: 'Kỹ năng đàm phán và thương lượng',
            content: '1.200.000 VND',
        },
    ];
    listFeaturedAction =[
        {
            url: 'assets/images/landing/Item4.png',
            title: 'Cơ hội nhận quà khi bình chọn sáng kiến khoa học 2025',
        },
        {
            url: 'assets/images/landing/Item5.png',
            title: 'Các nhà khoa học VinFuture được vinh danh tại Breakthrough 2025'
        },
        {
            url: 'assets/images/landing/Item6.png',
            title: '\'Tiến sĩ giá đỗ biến\' tài sản trí tuệ thành tiền'
        },
        {
            url: 'assets/images/landing/Item4.png',
            title: 'Cơ hội nhận quà khi bình chọn sáng kiến khoa học 2025',
        },
        {
            url: 'assets/images/landing/Item5.png',
            title: 'Các nhà khoa học VinFuture được vinh danh tại Breakthrough 2025'
        },
        {
            url: 'assets/images/landing/Item6.png',
            title: '\'Tiến sĩ giá đỗ biến\' tài sản trí tuệ thành tiền'
        },
        {
            url: 'assets/images/landing/Item4.png',
            title: 'Cơ hội nhận quà khi bình chọn sáng kiến khoa học 2025',
        },
        {
            url: 'assets/images/landing/Item5.png',
            title: 'Các nhà khoa học VinFuture được vinh danh tại Breakthrough 2025'
        },
        {
            url: 'assets/images/landing/Item6.png',
            title: '\'Tiến sĩ giá đỗ biến\' tài sản trí tuệ thành tiền'
        }
    ];
    // listTeachers = [
    //     {
    //         url: 'assets/images/landing/teacher-1.png',
    //         name: 'GV. NGUYỄN KIM ANH',
    //         position: 'Giáo viên Toán 6',
    //     },
    //     {
    //         url: 'assets/images/landing/teacher-2.png',
    //         name: 'GV. LÊ QUANG TUẤN',
    //         position: 'Trưởng ban học thuật',
    //     },
    //     {
    //         url: 'assets/images/landing/teacher-3.png',
    //         name: 'GV. LÊ KIM PHƯỢNG',
    //         position: 'Giáo viên Toán 11',
    //     },
    // ];
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
        // this.loadListPost();
        this.displayedItems = this.listFeaturedAction.slice(0, 3); // Hiện 3 cái đầu
        this.displayedFeatured = this.listFeatured.slice(0, 3);
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
