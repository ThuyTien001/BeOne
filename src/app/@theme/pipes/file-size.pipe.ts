import { Pipe, PipeTransform } from '@angular/core';
import { Utils } from '@app/@shared/utils';
import _ from 'lodash';

@Pipe({ name: 'lmsFileSize' })
export class FileSizePipe implements PipeTransform {
    transform(input: string): string {
        return input && Utils.File.formatFileSize(_.toNumber(input));
    }
}
