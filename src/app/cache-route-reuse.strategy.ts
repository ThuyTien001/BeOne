import { RouteReuseStrategy } from '@angular/router/';
import { ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';
import _ from 'lodash';
import { Injectable } from '@angular/core';

@Injectable()
export class CacheRouteReuseStrategy implements RouteReuseStrategy {
    storedRouteHandles = new Map<string, DetachedRouteHandle>();
    allowPrefixPath = [
        '/pages/questions',
        '/pages/exercises/list',
        '/pages/my-lessons/list',
        '/pages/do-exercises/list',
    ];

    shouldReuseRoute(before: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        return before.routeConfig === curr.routeConfig;
    }

    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
        let cachePath = this.getCachePath(route);
        return this.storedRouteHandles.get(cachePath) as DetachedRouteHandle;
    }

    shouldAttach(route: ActivatedRouteSnapshot): boolean {
        const path = this.getCachePath(route);
        const isReload = _.get(route, 'queryParams.reload', false);
        return path && !isReload && this.storedRouteHandles.has(path);
    }

    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        return !!this.getCachePath(route);
    }

    store(route: ActivatedRouteSnapshot, detachedTree: DetachedRouteHandle): void {
        let path = this.getCachePath(route);
        if (path) this.storedRouteHandles.set(this.getCachePath(route), detachedTree);
    }

    private getCachePath(route: ActivatedRouteSnapshot): string {
        let url = this.getResolvedUrl(route);
        if (url.indexOf('login') !== -1 || url.indexOf('sign-up') !== -1) {
            // Clear cache when Application navigate to login page
            this.storedRouteHandles = new Map<string, DetachedRouteHandle>();
            return '';
        }
        for (let str of this.allowPrefixPath) {
            if (_.startsWith(url, str)) {
                return url;
            }
        }
        return '';
    }

    private getResolvedUrl(route: ActivatedRouteSnapshot): string {
        let url = route.pathFromRoot
            .map(v => v.url.map(segment => segment.toString()).join('/'))
            .join('/');
        return url;
    }
}
