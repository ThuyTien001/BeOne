import { Component } from '@angular/core';
import { LayoutService } from '@app/@theme/services';

@Component({
    selector: 'lms-footer',
    templateUrl: './footer.component.html'
})
export class AppFooterComponent {
    constructor(public layoutService: LayoutService) { }
}
