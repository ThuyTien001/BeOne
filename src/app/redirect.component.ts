import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DGF } from '@shared/digiforce';

@Component({
    standalone: true,
    template: '',
    imports: [
        RouterModule,
    ],
})
export class RedirectComponent {
    constructor(private router: Router) {
        if (DGF.Auth.isAuthenticated) {
            this.router.navigate(['/pages']);
        }
        else {
            this.router.navigate(['/landing']);
        }
    }
}