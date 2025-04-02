import { Injectable } from '@angular/core';
import { DGF, DGFRecord } from '@app/@shared/digiforce';
import { DoExercise, DoExerciseStatus } from '@app/@shared/models';
import { Utils } from '@app/@shared/utils';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class ExerciseService {

    constructor(
        private translateService: TranslateService,
    ) { }

    async formatDoExercise(record: DGFRecord<DoExercise>) {
        let noneText = this.translateService.instant('common.placeholder_none');
        for (let { prop, objectName } of [
            { prop: 'lesson', objectName: 'lesson' },
            { prop: 'grade', objectName: 'grade' },
            { prop: 'semester', objectName: 'semesters' },
            { prop: 'subject', objectName: 'subjects' },
        ]) {
            let valueRaw: any = record.get(prop as any);
            let value: string = valueRaw?.id || valueRaw;
            record.setInclude(prop as any, await DGF.getRecord(objectName, value));
            record.setFormattedValue(prop as any, await DGF.getRecordName(objectName, value) || noneText);
        }
        record.setFormattedValue('name', record.get('name') || noneText);
        record.setFormattedValue('startDate', Utils.formatDate(record.get('startDate'), true) || noneText);
        record.setFormattedValue('endDate', Utils.formatDate(record.get('endDate'), true) || noneText);
        record.setFormattedValue('status', {
            [DoExerciseStatus.Pending]: this.translateService.instant('excerise.status.pending'),
            [DoExerciseStatus.Processing]: this.translateService.instant('excerise.status.processing'),
            [DoExerciseStatus.Completed]: this.translateService.instant('excerise.status.completed'),
        }[record.get('status') as string] || '');
        record.setFormattedValue('statusSeverity' as any, {
            [DoExerciseStatus.Pending]: 'info',
            [DoExerciseStatus.Processing]: 'primary',
            [DoExerciseStatus.Completed]: 'success',
        }[record.get('status') as string] || '');

        return record;
    }

}