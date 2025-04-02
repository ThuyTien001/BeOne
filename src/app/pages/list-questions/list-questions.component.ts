import { AfterViewInit, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { SharedModule } from '@app/@shared/shared.module';
import { ThemeModule } from '@app/@theme/theme.module';
import { FileUploadModule } from 'primeng/fileupload';
import _ from 'lodash';
import { DGF, DGFRecord } from '@app/@shared/digiforce';
import { TableModule } from 'primeng/table';
import { Question } from '@app/@shared/models';
import { QuestionModule } from '@app/@shared/modules/question/question.module';
import { QuestionDetailsDialogComponent, QuestionService, UploadQuestionsDialogComponent } from '@app/@shared/modules';
import { MathjaxModule } from '@app/@shared/mathjax';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { Utils } from '@app/@shared/utils';
import { AlertMessageService } from '@app/@shared/services';
import { QuestionType } from '@app/@declare';
import { SpinnerModule } from '@app/@theme/components';

@Component({
    templateUrl: './list-questions.component.html',
    standalone: true,
    imports: [
        SharedModule,
        ThemeModule,
        FileUploadModule,
        TableModule,
        QuestionModule,
        MathjaxModule,
        DialogModule,
        InputTextareaModule,
        InputTextModule,
        SpinnerModule,
    ],
})
export class ListQuestionsComponent implements AfterViewInit {
    @ViewChild('detailsDialog', { static: false }) detailsDialog: QuestionDetailsDialogComponent;
    @ViewChild('uploadDialog', { static: false }) uploadDialog: UploadQuestionsDialogComponent;

    listQuestions: Array<any> = [];
    tableLoading = new Utils.LoadingVar(false);
    totalRecords = 0;

    isCreate = false;
    selectedQuestion: DGFRecord<Question>;

    perPage: number;

    searchValue = '';

    constructor(
        private questionService: QuestionService,
        private alertMessageService: AlertMessageService,
        private cd: ChangeDetectorRef,
    ) { }

    ngAfterViewInit() {
        // This line to fix error of p-table when isTableLoading
        this.cd.detectChanges();
    }

    showModalUpload() {
        this.uploadDialog.showDialog();
    }

    onRowDoubleClick(selectedRow: DGFRecord<Question>) {
        this.selectedQuestion = selectedRow;
        this.showModalDetails(true);
    }

    searchQuestion() {
        this.loadListQuestions({ rows: this.perPage, first: 0 });
    }

    async loadListQuestions({ rows, first }) {
        this.tableLoading.start();
        this.perPage = rows;
        let records = [];
        this.selectedQuestion = null;
        const query = new DGF.Query<Question>('question');
        if (this.searchValue) {
            query.contains('name', this.searchValue);
        }
        if (first === 0) {
            query.paging(rows, 1);
            let res = await query.getPagingResult();
            records = res.records || [];
            this.totalRecords = res.count;
        }
        else {
            query.skip(first);
            query.limit(rows);
            records = await query.find();
        }
        this.listQuestions = [];
        for (let item of records) {
            this.listQuestions.push(await this.questionService.formatQuestion(item));
        }
        this.tableLoading.stop();
    }

    showModalDetails(isEdit = false) {
        this.detailsDialog.showDialog(isEdit, this.selectedQuestion);
    }

    async saveQuestion(modalData: any) {
        try {
            let record: DGFRecord<Question>;
            if (this.isCreate) {
                record = new DGF.Record<Question>('question');
            }
            else {
                record = this.selectedQuestion;
            }
            record.set('name', modalData.name);
            record.set('answers', modalData.answers);
            record.set('content', modalData.content);
            record.set('explain', modalData.explain);
            record.set('type', QuestionType.Single);
            await record.save();

            this.alertMessageService.success('Lưu câu hỏi thành công');
            this.loadListQuestions({ rows: this.perPage, first: 0 });
        } catch (error) {
            console.log(error);
            this.alertMessageService.error('Lưu câu hỏi thất bại');
        }

    }
}