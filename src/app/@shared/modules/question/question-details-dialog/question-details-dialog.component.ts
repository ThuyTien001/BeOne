import { Component, EventEmitter, Output } from '@angular/core';
import { DGFRecord } from '@app/@shared/digiforce';
import { Question } from '@app/@shared/models';
import { Utils } from '@app/@shared/utils';
import { AlertMessageService } from '@app/@shared/services';
import _ from 'lodash';

@Component({
    selector: 'lms-question-details-dialog',
    templateUrl: './question-details-dialog.component.html',
})
export class QuestionDetailsDialogComponent {
    @Output() save = new EventEmitter();

    isShowModalDetails = false;
    isCreate = false;
    modalData: any = {};
    id: string;

    constructor(
        private alertMessageService: AlertMessageService,
    ) { }

    async showDialog(
        isEdit = false,
        data: DGFRecord<Question> | {
            answers: Array<any>
            name: string,
            content: string,
            explain: string,
            id?: string,
        }
    ) {
        this.isCreate = !isEdit;
        let getFieldValue = (fieldName: string) => {
            if (_.isFunction((data as any)?.get)) {
                return (data as any).get(fieldName);
            }
            return _.get(data, fieldName);
        };
        if (this.isCreate) {
            this.modalData = {
                listAnswers: [
                    { id: Utils.guid(), value: '', },
                    { id: Utils.guid(), value: '', },
                    { id: Utils.guid(), value: '', },
                    { id: Utils.guid(), value: '', },
                ],
                name: '',
                content: '',
                explain: '',
                nameInvalid: false,
            };
            this.modalData.trueAnswer = this.modalData.listAnswers[0].id;
        }
        else {
            this.id = getFieldValue('id');
            let listAnswers = [];
            let answers: Array<any> = getFieldValue('answers') || [];
            let trueAnswer;
            for (let item of answers) {
                listAnswers.push({
                    id: item.answerId || Utils.guid(),
                    value: item.name,
                });
                if (item.isTrue) {
                    trueAnswer = item.answerId;
                }
            }
            this.modalData = {
                listAnswers: listAnswers,
                name: getFieldValue('name'),
                content: getFieldValue('content'),
                explain: getFieldValue('explain'),
                nameInvalid: false,
                trueAnswer,
            };
        }
        this.isShowModalDetails = true;
    }

    selectTrueAnswer({ id }) {
        this.modalData.trueAnswer = id;
    }

    validateData() {
        if (!this.modalData.name) {
            this.modalData.nameInvalid = true;
            this.alertMessageService.error('Nội dung câu hỏi rỗng');
            return false;
        }
        else {
            this.modalData.nameInvalid = false;
        }
        let invalid = false;
        for (let ans of this.modalData.listAnswers) {
            if (!ans.value) {
                ans.invalid = true;
                if (!invalid) this.alertMessageService.error('Vui lòng nhập đủ 4 đáp án');
                invalid = true;
            }
            else {
                ans.invalid = false;
            }
        }
        return !invalid;
    }

    async saveQuestion() {
        if (!this.validateData()) return;

        let modalData = this.modalData;
        modalData.answers = _.map(
            modalData.listAnswers,
            item => ({
                answerId: item.id,
                name: item.value,
                isTrue: item.id === modalData.trueAnswer
            })
        );
        this.save.next({
            ..._.pick(modalData, [
                'name',
                'answers',
                'content',
                'explain',
                'type',
            ]),
            id: this.id
        });
        this.isShowModalDetails = false;
    }
}