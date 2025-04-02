import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DGF } from '@app/@shared/digiforce';
import { Question } from '@app/@shared/models';
import { Utils } from '@app/@shared/utils';
import { QuestionService } from '../question.service';
import _ from 'lodash';

@Component({
    selector: 'lms-select-question',
    templateUrl: 'select-question-dialog.component.html',
})
export class SelectQuestionDialogComponent implements OnInit {
    @Output() onSubmit = new EventEmitter();

    tableLoading = new Utils.LoadingVar(false);
    isShowDialog = false;
    listQuestions = [];

    totalRecords = 0;
    perPage = 10;
    selected: any = [];
    searchValue = '';

    selectedIds = [];
    constructor(
        private questionService: QuestionService,
    ) { }

    ngOnInit() {
        console.log();
    }

    showDialog(params?: {
        selectedIds?: Array<string>,
    }) {
        this.selectedIds = params?.selectedIds || [];
        this.isShowDialog = true;
        this.searchValue = '';
        this.search();
    }

    async loadListQuestions({ rows, first }) {
        this.tableLoading.start();
        this.perPage = rows;
        let records = [];
        this.selected = [];
        const query = new DGF.Query<Question>('question');
        if (this.searchValue) {
            query.contains('name', this.searchValue);
        }
        if (this.selectedIds?.length) {
            query.notContainedIn('_id', this.selectedIds);
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
            let formatted = await this.questionService.formatQuestion(item);
            this.listQuestions.push(formatted);
        }
        this.listQuestions = [...this.listQuestions];
        this.selected = [...this.selected];
        this.tableLoading.stop();
    }

    search() {
        this.loadListQuestions({ rows: this.perPage, first: 0 });
    }

    confirm() {
        this.onSubmit.next(this.selected);
        this.isShowDialog = false;
    }

}