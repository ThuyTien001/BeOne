import { Pipe, PipeTransform } from '@angular/core';
import _ from 'lodash';
import { fixMathjaxSpacing } from '../utils';

@Pipe({ name: 'lmsMathjaxFormat' })
export class MathjaxFormatPipe implements PipeTransform {
     addMathjaxTag(str: string) {
        if (str.indexOf('\\') !== -1 || str.indexOf('$') !== -1) {
            let res = str;
            let haveOnlyOneTag = str.indexOf('$') === str.lastIndexOf('$');
            if (haveOnlyOneTag) {
                if (!str.startsWith('$')) {
                    res = '$' + res;
                }
                if (!str.endsWith('$')) {
                    res = res + '$';
                }
            }
            return fixMathjaxSpacing(res);
        }

        return str;
    }
    transform(input: string): string {
        if (!input) return '';
        let res = input;
        let haveImage = /\\includegraphics{.*}/g.test(res);
        if (haveImage) {
            res = _.replace(res, /\\includegraphics{.*}/g, '');
        }
        return this.addMathjaxTag(res);
    }
}
