import {
    ComponentRef,
    Directive,
    ElementRef,
    Input,
    OnInit,
    Renderer2,
    ViewContainerRef,
    HostBinding,
    Inject,
} from '@angular/core';

import { SpinnerComponent } from './spinner.component';
import $ from 'jquery';
import _ from 'lodash';

@Directive({ selector: '[spinner]' })
export class SpinnerDirective implements OnInit {

    private shouldShow = false;
    private elementSelector = '';
    spinnerComp: ComponentRef<SpinnerComponent>;


    /**
     * Directive value - show or hide spinner
     * @param {boolean} val
     */
    @Input()
    set spinner(val: boolean | { show: boolean, selector: string }) {
        let show = false;
        let selector = '';
        if (_.isObject(val)) {
            show = val.show;
            selector = val.selector;
        }
        else {
            show = val;
        }
        if (this.spinnerComp) {
            if (show) {
                this.show();
            } else {
                this.hide();
            }
        } else {
            this.shouldShow = show;
            this.elementSelector = selector;
        }
    }

    @HostBinding('class.spinner-container') isSpinnerExist = false;

    constructor(
        @Inject(ViewContainerRef) private viewContainerRef: ViewContainerRef,
        @Inject(Renderer2) private renderer: Renderer2,
        @Inject(ElementRef) private directiveElement: ElementRef
    ) {
    }

    ngOnInit() {
        if (this.shouldShow) {
            this.show();
        }
    }

    hide() {
        if (this.isSpinnerExist) {
            this.viewContainerRef.remove();
            this.isSpinnerExist = false;
        }
    }

    show() {
        if (!this.isSpinnerExist) {
            this.spinnerComp = this.viewContainerRef.createComponent<SpinnerComponent>(SpinnerComponent);
            this.spinnerComp.changeDetectorRef.detectChanges();
            let el;
            if (this.elementSelector) {
                el = $(this.elementSelector)[0];
            }
            else {
                el = this.directiveElement.nativeElement;
            }
            if (el) {
                if (el.clientHeight < 120) {
                    if (el.clientHeight > 70) {
                        // 70-120
                        $(this.spinnerComp.location.nativeElement).css('zoom', 0.7);
                    }
                    else {
                        // 0-70
                        $(this.spinnerComp.location.nativeElement).css('zoom', 0.5);
                    }
                }
                this.renderer.appendChild(el, this.spinnerComp.location.nativeElement);
            }
            this.isSpinnerExist = true;
        }
    }

}
