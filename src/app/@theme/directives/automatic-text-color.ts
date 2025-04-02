import { Directive, ElementRef, HostBinding, Input } from '@angular/core';
import { Utils } from '@app/@shared/utils';

@Directive({ selector: '[automaticTextColor]' })
export class AutomaticTextColorDirective {
    el: ElementRef;

    @HostBinding('style.color')
    get color() {
        let bgColor = '#ffffff';
        if (this.el.nativeElement) {
            bgColor = window.getComputedStyle(this.el.nativeElement, null).getPropertyValue('background-color');
        }
        return Utils.getTextColorByBGColor(bgColor, this.lightColor, this.darkColor);
    }

    @Input() lightColor?: string;
    @Input() darkColor?: string;

    constructor(el: ElementRef) {
        this.el = el;
    }

}

