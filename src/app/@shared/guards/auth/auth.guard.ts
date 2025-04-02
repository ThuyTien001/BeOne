import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { DGF } from '@app/@shared/digiforce';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard  {
    constructor(public router: Router) { }

    /**
     * Check authentication and permission of current user before navigate other page
     *
     * @returns boolean
     */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (!DGF.Auth.isAuthenticated) {
            this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
            return false;
        }
        return true;
    }
}
