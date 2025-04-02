import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { Utils } from '@app/@shared/utils';
import { BehaviorSubject, Subject, filter } from 'rxjs';
import _ from 'lodash';


@Injectable({
    providedIn: 'root',
})
export class BreadCrumbService {

    // Subject emitting the breadcrumb hierarchy 
    private readonly _breadcrumbs$ = new BehaviorSubject<Array<any>>([]);

    // Observable exposing the breadcrumb hierarchy 
    readonly breadcrumbs$ = this._breadcrumbs$.asObservable();

    _breadcrumbs: Array<any>;
    cacheLabels = {};

    constructor(private router: Router) {
        this.router.events.pipe(
            // Filter the NavigationEnd events as the breadcrumb is updated only when the route reaches its end 
            filter((event) => event instanceof NavigationEnd)
        ).subscribe(event => {
            // Construct the breadcrumb hierarchy 
            const root = this.router.routerState.snapshot.root;
            const breadcrumbs = [];
            this.addBreadcrumb(root, [], breadcrumbs);

            this._breadcrumbs = breadcrumbs;
            // Emit the new hierarchy 
            this._breadcrumbs$.next(this._breadcrumbs);
            this.updateCache();
        });
    }

    updateCache() {
        for (let item of this._breadcrumbs || []) {
            this.cacheLabels[item.routerLink] = item;
        }
    }

    private addBreadcrumb(
        route: ActivatedRouteSnapshot,
        parentUrl: string[],
        breadcrumbs: Array<any>,
    ) {
        if (route) {
            // Construct the route URL 
            const routeUrl = parentUrl.concat(route.url.map(url => url.path));

            // Add an element for the current route part 
            if (route.data.breadcrumb) {
                const breadcrumb = {
                    label: this.getLabel(route.data),
                    routerLink: '/' + routeUrl.join('/'),
                    id: Utils.guid(),
                };
                if (!breadcrumb.label) return;
                if (breadcrumb.label === '...' && this.cacheLabels[breadcrumb.routerLink]) {
                    breadcrumb.label = this.cacheLabels[breadcrumb.routerLink]?.label;
                }
                breadcrumbs.push(breadcrumb);
            }
            // Add another element for the next route part 
            this.addBreadcrumb(route.firstChild, routeUrl, breadcrumbs);

        }
    }

    private getLabel(data: any) {
        // The breadcrumb can be defined as a static string or as a function to construct the breadcrumb element out of the route data 
        return typeof data.breadcrumb === 'function' ? data.breadcrumb(data) : data.breadcrumb;
    }

    updateLabelOfLastBreadcrumb(label: string) {
        if (this._breadcrumbs.length) {
            this._breadcrumbs[this._breadcrumbs.length - 1].label = label || '';
            this._breadcrumbs$.next(this._breadcrumbs);
            this.updateCache();
        }
    }

    addNewBreadcrumb(routerLink: string, label: string) {
        if (!this._breadcrumbs) this._breadcrumbs = [];
        let id = Utils.guid();
        this._breadcrumbs.push({
            label,
            routerLink,
            id,
        });
        this._breadcrumbs$.next(this._breadcrumbs);
        this.updateCache();
        return id;
    }

    updateById(id: string, value: { routerLink: string, label: string }) {
        let index = _.findIndex(this._breadcrumbs, item => item.id === id);
        if (index === -1) return;

        if (value?.routerLink) this._breadcrumbs[index].routerLink = value.routerLink;
        if (value?.label) this._breadcrumbs[index].label = value.label;
        this._breadcrumbs$.next(this._breadcrumbs);
        this.updateCache();
    }

    deleteById(id: string) {
        this._breadcrumbs = _.filter(this._breadcrumbs, item => item.id !== id);
        this._breadcrumbs$.next(this._breadcrumbs);
    }

}
