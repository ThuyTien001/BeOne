import {
    Directive,
    ElementRef,
    Input,
    OnChanges,
    SimpleChanges,
} from '@angular/core';
import { fixMathjaxBugs, getMathjaxContent, isMathjax } from '../utils';
import { MathjaxContent } from '../models';
import { Utils } from '@app/@shared/utils';

@Directive({
    selector: 'mathjax,[mathjax]',
})
export class MathjaxDirective implements OnChanges {
    private mathJaxExpressions?: MathjaxContent | string;
    private readonly element: HTMLElement;

    @Input()
    set mathjax(val: MathjaxContent | string) {
        this.mathJaxExpressions = val;
    }

    constructor(private el: ElementRef) {
        this.element = el.nativeElement;
    }

    ngOnChanges(changes: SimpleChanges): void {
        const expressions = changes.mathjax;
        if (
            !expressions ||
            expressions.currentValue === expressions.previousValue
        ) {
            return;
        }
        const value = getMathjaxContent(expressions.currentValue) + '';
        if (isMathjax(value)) {
            const filteredVal = fixMathjaxBugs(value);
            this.typeset(() => {
                this.element.innerHTML = `<span class='mathjax-process'>${filteredVal}</span>`;
            });
        } else {
            this.element.innerHTML = value;
        }
    }

    private async typeset(callback: () => void): Promise<any> {
        const MathJax = (window as any).MathJax || {};
        if (!MathJax?.isReady) {
            this.element.innerHTML = '<div></div>';
            if (MathJax?.promise) {
                return MathJax.promise.then(() => this.typeset(callback));
            }
            else {
                await Utils.delay(100);
                this.typeset(callback);
            }
        } else {
            MathJax.startup.promise = MathJax.startup.promise
                .then(() => MathJax.typesetPromise(callback()))
                .catch((err: any) => console.log('Typeset failed: ' + err.message));
            return MathJax.startup.promise;
        }
    }
}
