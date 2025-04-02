import { Injectable } from '@angular/core';
import { DGFRecord } from '@app/@shared/digiforce';
import { Question } from '@app/@shared/models';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class QuestionService {
    constructor(
        private translateService: TranslateService,
    ) { }

    async formatQuestion(record: DGFRecord<Question>) {
        record.setFormattedValue(
            'type',
            record.get('type')
                ? this.translateService.instant(`question.type.${record.get('type')}`)
                : ''
        );
        return record;
    }

}