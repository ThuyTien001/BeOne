import { Component, ViewChild } from '@angular/core';
import _ from 'lodash';
import { QuestionDetailsDialogComponent } from '@app/@shared/modules';
import { LoadingVar, Utils } from '@app/@shared/utils';
import { QuestionType } from '@app/@declare';
import { DGF } from '@app/@shared/digiforce';
import { AlertMessageService } from '@app/@shared/services';
import { FileUpload } from 'primeng/fileupload';

@Component({
    selector: 'lms-upload-questions-dialog',
    templateUrl: './upload-questions-dialog.component.html',
    styleUrls: ['./upload-questions-dialog.component.scss'],
})
export class UploadQuestionsDialogComponent {
    @ViewChild('upload', { static: false }) upload: FileUpload;
    @ViewChild('detailsDialog', { static: false }) detailsDialog: QuestionDetailsDialogComponent;
    isLoadingDialog = new LoadingVar(false);

    isShowModalUpload = false;
    listQuestions = [];
    isShowSubmitBtn = true;

    constructor(private alertMessageService: AlertMessageService) { }


    showDialog() {
        this.listQuestions = [];
        if (this.upload) this.upload.clear();
        this.isShowModalUpload = true;
    }

    async uploadHandler(evt: any) {
        let file = _.get(evt, 'files[0]');

        let getTextFromFile = (file: File) => {
            return new Promise((resolve, reject) => {
                let reader = new FileReader();
                reader.readAsText(file);
                reader.onload = function () {
                    resolve(reader.result);
                };
                reader.onerror = function (error) {
                    reject(error);
                };
            });
        };

        let text: any = await getTextFromFile(file);
        const cleanArrayString = (arr: Array<any>) => {
            return _.filter(
                _.map(arr, str => _.trim(str)),
                str => !!str
            );
        };

        let start = text.indexOf('\\begin{questions}');
        let end = text.indexOf('\\end{questions}');
        let temp = text.substring(start + 17, end);
        let arrayRawData = cleanArrayString(_.split(temp, '\\question '));
        this.isLoadingDialog = new LoadingVar(true, Math.max(arrayRawData.length * 20, 300));
        await Utils.delay(200);

        let listQuestions = [];
        for (let str of arrayRawData) {
            let [questionStr, choiceStr] = _.split(str, '\\begin{choices}');
            if (!questionStr || !choiceStr) continue;

            questionStr = _.trim(questionStr);
            choiceStr = _.trim(_.replace(choiceStr, '\\end{choices}', ''));

            let listChoices = _.map(
                cleanArrayString(_.split(choiceStr, '\\choice ')),
                (str, index) => {
                    return {
                        answerId: Utils.guid(),
                        name: str,
                        isTrue: index === 0,
                    };
                }
            );
            listQuestions.push({
                id: Utils.guid(),
                name: questionStr,
                answers: listChoices,
                content: '',
                explain: '',
                type: QuestionType.Single,
            });
        }
        this.listQuestions = listQuestions;
        this.isLoadingDialog.stop();
    }

    onClearFile() {
        this.listQuestions = [];
    }

    editQuestion(questionData: any) {
        this.detailsDialog.showDialog(true, {
            answers: questionData.answers,
            name: questionData.name,
            content: questionData.content,
            explain: questionData.explain,
            id: questionData.id,
        });
    }

    removeQuestion({ id }) {
        this.listQuestions = _.filter(this.listQuestions, item => item.id !== id);
    }

    saveQuestion(questionData: any) {
        let index = _.findIndex(this.listQuestions, item => item.id === questionData.id);
        if (index === -1) return;
        this.listQuestions[index] = {
            id: questionData.id,
            name: questionData.name,
            content: questionData.content,
            explain: questionData.explain,
            answers: questionData.answers,
            type: QuestionType.Single,
        };
        this.listQuestions = [...this.listQuestions];
    }

    async uploadQuestion() {
        this.isLoadingDialog = new LoadingVar(true, 300);
        try {
            await DGF.API.post('/api_lms/question/import_question', {
                listQuestions: this.listQuestions,
            });
            this.alertMessageService.success('Cập nhật danh sách câu hỏi thành công');
        } catch (error) {
            console.log(error);
            this.alertMessageService.error('Cập nhật danh sách câu hỏi thất bại');
        }
        this.isLoadingDialog.stop();
    }
}