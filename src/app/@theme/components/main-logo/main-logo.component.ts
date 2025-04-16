import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { LayoutService } from '@app/@theme/services';

@Component({
    selector: 'lms-main-logo',
    standalone: true,
    imports: [
        CommonModule,
    ],
    template: `
        <img src="assets/images/logo/{{_logo}}"
            alt="TRAINING Logo"
            [ngStyle]="{width: width, height: height}"
            [class]="className">
    `,
})
export class MainLogoComponent {
    @Input() logo?: 'logo-normal' | 'logo-white' | 'logo-mini';
    @Input() width?: string;
    @Input() height?: string;
    @Input() className?: string;

    constructor(public layoutService: LayoutService) { }

    get _logo() {
        let input = this.logo ? this.logo : this.layoutService.config.colorScheme === 'light' ? 'logo-normal' : 'logo-white';
        return {
            'logo-normal': 'Training.png',
            // 'logo-white': 'logo-beone-text-white.png',
            // 'logo-mini': 'logo-beone-mini.png',
        }[input] || 'Training.png';
    }
}
