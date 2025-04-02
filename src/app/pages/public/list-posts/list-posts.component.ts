import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { DividerModule } from 'primeng/divider';
import { MainLogoComponent } from '@app/@theme/components';
import { SharedModule } from '@app/@shared/shared.module';
import { CarouselModule } from 'primeng/carousel';
import { SkeletonModule } from 'primeng/skeleton';
import _ from 'lodash';
import { PublicPageService } from '../shared';
import { ExtracurricularType } from '@app/@shared/models/center';
import { Paginator, PaginatorModule } from 'primeng/paginator';
import { DGF } from '@app/@shared/digiforce';
import { LoadingVar, Utils } from '@app/@shared/utils';
import { TranslateService } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';

@Component({
    templateUrl: './list-posts.component.html',
    styleUrls: ['./list-posts.component.scss'],
    standalone: true,
    imports: [
        SharedModule,
        DividerModule,
        MainLogoComponent,
        SkeletonModule,
        CarouselModule,
        RouterModule,
        PaginatorModule,
    ],
})
export class ListPostsComponent {
    @ViewChild('paginator', { static: false }) paginator: Paginator;

    isLoading = new LoadingVar(false, 500);

    listFilters = [];

    perPage = 10;
    totalRecords = 0;

    listPosts = [];

    filter = 'all';

    constructor(
        public router: Router,
        private route: ActivatedRoute,
        private publicPageService: PublicPageService,
        private translateService: TranslateService,
    ) {
        this.listFilters = [
            {
                value: 'all',
                label: this.translateService.instant('common.all'),
            },
            ..._.map([
                ExtracurricularType.Incoming,
                ExtracurricularType.Tips,
                ExtracurricularType.Info,
            ], t => ({
                value: t,
                label: this.publicPageService.getExtracurricularTypeLabel(t),
            }))
        ];

        if (!this.updateFragment(this.route.snapshot.fragment)) {
            this.loadListPost();
        }
        this.router.events.pipe(
            takeUntilDestroyed(),
            // Filter the NavigationEnd events as the breadcrumb is updated only when the route reaches its end 
            filter((event) => event instanceof NavigationEnd),
        ).subscribe(event => {
            let url: string = (event as any).url;
            let fragment = _.split(url, '#')[1];
            this.updateFragment(fragment);
        });

    }

    updateFragment(fragment: string) {
        fragment = fragment || this.route.snapshot.fragment;
        if (_.includes([
            ExtracurricularType.Incoming,
            ExtracurricularType.Tips,
            ExtracurricularType.Info
        ], fragment)) {
            this.filter = fragment;
            this.loadListPost(0);
            return true;
        }
        return false;
    }

    async loadListPost(skip = 0) {
        this.isLoading.start();
        Utils.scrollToElement('anchor');
        let res = await DGF.API.post('/api_lms/extracurriculars/get_list_posts', {
            skip,
            limit: this.perPage,
            getCount: skip === 0,
            filterTag: this.filter !== 'all' ? this.filter : null,
        });
        if (skip === 0) {
            this.totalRecords = res.count || 0;
        }
        this.listPosts = _.map(res.posts, item => this.publicPageService.formatPostData(item));
        this.isLoading.stop();
    }

    onPageChange(evt) {
        this.loadListPost(evt.first);
    }

    applyFilter(val: string) {
        this.filter = val;
        this.paginator.changePage(0);
    }

}
