import { AfterViewInit, Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DividerModule } from 'primeng/divider';
import { MainLogoComponent } from '@app/@theme/components';
import { SharedModule } from '@app/@shared/shared.module';
import { CarouselModule } from 'primeng/carousel';
import { SkeletonModule } from 'primeng/skeleton';
import { DGF } from '@app/@shared/digiforce';
import _ from 'lodash';
import { PublicPageService } from '../shared';
import { LoadingVar, Utils } from '@app/@shared/utils';

@Component({
    templateUrl: './post-details.component.html',
    styleUrls: ['./post-details.component.scss'],
    standalone: true,
    imports: [
        SharedModule,
        DividerModule,
        MainLogoComponent,
        SkeletonModule,
        CarouselModule,
        RouterModule,
    ],
})
export class PostDetailsComponent implements AfterViewInit {
    isLoading = new LoadingVar(false, 500);
    title = '';
    publishDate = '';
    contentHTML = '';
    listOtherPosts: Array<{
        thumbnail: string,
        title: string,
        description: string,
    }> = [];
    tag = {
        cssClass: '',
        label: '',
    };
    responsiveOptions = [
        {
            breakpoint: '1200px',
            numVisible: 2,
            numScroll: 2
        },
        {
            breakpoint: '991px',
            numVisible: 1,
            numScroll: 1
        }
    ];

    constructor(
        public router: Router,
        private route: ActivatedRoute,
        private publicPageService: PublicPageService,
    ) { }


    ngAfterViewInit(): void {
        this.route.paramMap.subscribe(async (map: any) => {
            await this.fetchPostDetails(map.params.id);
        });
    }

    async fetchPostDetails(id: string) {
        if (!id) return;

        this.isLoading.start();
        try {
            let res = await DGF.API.post('api_lms/extracurriculars/get_details', {
                id: id
            });
            let post = res?.post;
            if (!post?._id) throw new Error('Can not find post');
            let postData = this.publicPageService.formatPostData(post);
            this.title = postData.title;
            this.contentHTML = postData.content;
            this.publishDate = postData.publishDate;
            this.tag = {
                cssClass: postData.tag,
                label: postData.tagLabel,
            };
            this.listOtherPosts = _.map(
                res.otherPosts,
                item => this.publicPageService.formatPostData(item)
            );
        } catch (error) {
            console.log(error);
            this.router.navigate(['/misc/404']);
        }
        this.isLoading.stop();
    }

}
