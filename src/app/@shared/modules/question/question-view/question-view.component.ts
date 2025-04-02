import { Component, Input, OnChanges, EventEmitter, Output, OnInit } from '@angular/core';
import _ from 'lodash';
import { Utils } from '@app/@shared/utils';
import { QuestionType } from '@app/@declare';
import { DGF, DGFRecord } from '@app/@shared/digiforce';
import { Question } from '@app/@shared/models';

const LABELS = {
    question: 'Câu hỏi',
    answer: 'Đáp án',
    input_answer_placeholder: 'Nhập đáp án....',
};

const ALPHABETS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export type AnswerItem = {
    answerId: string;
    name: string;
    isTrue?: boolean;
};

@Component({
    selector: 'lms-question-view',
    templateUrl: './question-view.component.html',
    styles: [`
        :host ::ng-deep {
            p-inputnumber,
            p-inputnumber .p-inputnumber,
            p-inputnumber .p-inputnumber input { 
                width: 100%;
            }
        }
        .white-space-break-spaces{
            white-space: break-spaces;
        }
    `],

})
export class QuestionViewComponent implements OnInit, OnChanges {
    LABELS = LABELS;

    @Output() valueChange = new EventEmitter<any>();

    @Input() questionPrefix: string;
    @Input() disabled: boolean;
    @Input() value: any;

    @Input() question: string | DGFRecord<Question>;
    @Input() questionLabel: string;
    @Input() questionContent: string;
    @Input() questionExplain: string;
    @Input() showExplain: boolean;
    @Input() showResult: boolean;
    @Input() questionType: QuestionType = QuestionType.Single;
    @Input() listAnswers: AnswerItem[] = [];
    @Input() trueAnswer?: any;
    @Input() hideInput?: boolean;

    uid = Utils.guid();

    _question: DGFRecord<Question>;

    _valueCheckboxes: Array<string> = []; // Checkbox value
    _valueText = ''; // Text value
    _valueNumber: number | null; // Number value
    _listAnswers: Array<{
        id: string;
        label: string;
        uid: string;
        prefix?: string;
    }> = [];
    trueAnswerId = '';

    constructor() { }

    async ngOnInit() {
        if (_.isString(this.question)) {
            this._question = await DGF.getRecord('question', this.question);
        }
        else if (this.question?.id) {
            this._question = this.question;
        }
        if (this._question) {
            this.questionType = this._question?.get('type') || QuestionType.Single;
            this.questionLabel = this._question?.get('name') || '';
            this.questionContent = this._question?.get('content') || '';
            this.questionExplain = this._question?.get('explain') || '';
            this.updateListAnswers(this._question?.get('answers') || []);
        }
        else {
            this.updateListAnswers(this.listAnswers);
        }
    }

    ngOnChanges(evt: any) {
        if (evt.value) {
            let val = evt.value.currentValue;
            switch (this.questionType) {
                case 'single':
                    if (_.isString(val)) {
                        this._valueCheckboxes = val ? [val] : [];
                    }
                    else {
                        this._valueCheckboxes = [];
                    }
                    break;
                case 'multiple':
                    if (_.isArray(val)) {
                        this._valueCheckboxes = val;
                    }
                    else {
                        this._valueCheckboxes = [];
                    }
                    break;
                case 'text':
                    if (_.isString(val)) {
                        this._valueText = val;
                    }
                    else {
                        this._valueText = '';
                    }
                    break;
                case 'number':
                    if (_.isNumber(val)) {
                        this._valueNumber = val;
                    }
                    else {
                        this._valueNumber = null;
                    }
                    break;
                default:
                    break;
            }
        }
        if (evt.listAnswers) {
            this.updateListAnswers(evt.listAnswers.currentValue);
        }
        if (evt.trueAnswer) {
            this.trueAnswerId = evt.trueAnswer.currentValue;
        }
    }

    getValue() {
        switch (this.questionType) {
            case QuestionType.Multiple:
                return this._valueCheckboxes || [];
            case QuestionType.Number:
                return this._valueNumber;
            case QuestionType.Text:
                return this._valueText;
            case QuestionType.Single:
            default:
                return this._valueCheckboxes[0];
        }
    }

    isEmpty() {
        let val: any = this.getValue();
        switch (this.questionType) {
            case QuestionType.Multiple:
                return !val?.length;
            case QuestionType.Number:
                return !val && (val !== 0);
            case QuestionType.Text:
                break;
            case QuestionType.Single:
            default:
                return !val;
        }
    }

    updateListAnswers(listAnswers: Array<any>) {
        this._listAnswers = _.map(listAnswers || [], (item: AnswerItem, index: number) => {
            let _item: any = {};
            _item.prefix = `${ALPHABETS[index]}. `;
            _item.uid = `${this.uid}_${item.answerId}`;
            _item.id = item.answerId;
            _item.label = item.name;
            if (item.isTrue) {
                this.trueAnswerId = item.answerId;
            }
            return _item;
        });
        if (this.trueAnswer) {
            this.trueAnswerId = this.trueAnswer;
        }
    }

    onCheckboxChange() {
        if (this.questionType === 'single') {
            if (this._valueCheckboxes.length > 1) {
                this._valueCheckboxes = [this._valueCheckboxes[this._valueCheckboxes.length - 1]];
            }
            this.valueChange.next(this._valueCheckboxes[0]);
        }
        else {
            this.valueChange.next(this._valueCheckboxes || []);
        }
    }

    onTextChange() {
        this.valueChange.next(this._valueText);
    }

    onNumberChange() {
        this.valueChange.next(this._valueNumber);
    }

}
