import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Utils } from '@app/@shared/utils';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Env } from '@env';
import _ from 'lodash';

@Component({
    templateUrl: './public-layout.component.html',
    styleUrls: ['./public-layout.component.scss'],
})
export class PublicLayoutComponent {

   

    constructor(public router: Router) {
        this.router.events.pipe(
            takeUntilDestroyed(),
            // Filter the NavigationEnd events as the breadcrumb is updated only when the route reaches its end 
            filter((event) => event instanceof NavigationEnd),
        ).subscribe(event => {
            let url: string = (event as any).url;
            let fragment = _.split(url, '#')[1];
            let opts = {};
            if (url.indexOf('landing') !== -1) {
                opts = { block: 'end' };
            }
            if (url.indexOf('study-center') !== -1 && fragment === 'maps') {
                opts = { block: 'end' };
            }
            if (url.indexOf('list-posts') !== -1 && fragment) {
                fragment = 'anchor';
            }
            if (fragment) {
                setTimeout(() => {
                    Utils.scrollToElement(fragment, null, opts);
                }, 200);
                return;
            }
            Utils.scrollToTopOfElement('public-page-wrapper');
        });
    }

    onNavigate() {
        $('#topbar-menu-container').addClass('hidden');
    }
}
