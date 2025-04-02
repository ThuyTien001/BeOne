import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { SharedModule } from '@app/@shared/shared.module';
import { ThemeModule } from '@app/@theme/theme.module';
import { FileUploadModule } from 'primeng/fileupload';
import _ from 'lodash';
import { DGF, DGFRecord } from '@app/@shared/digiforce';
import { TableModule } from 'primeng/table';
import { Exercise } from '@app/@shared/models';
import { QuestionModule } from '@app/@shared/modules/question/question.module';
import { ExerciseModule } from '@app/@shared/modules';
import { MathjaxModule } from '@app/@shared/mathjax';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { Utils } from '@app/@shared/utils';
import { AlertMessageService } from '@app/@shared/services';
import { SpinnerModule } from '@app/@theme/components';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    templateUrl: './list-exercises.component.html',
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
        ExerciseModule,
        SpinnerModule,
    ],
})
export class ListExercisesComponent implements AfterViewInit {
    listExercises: Array<any> = [];
    tableLoading = new Utils.LoadingVar(false);
    totalRecords = 0;

    isShowModalCreate = false;
    isCreate = false;
    modalData: any = {};
    selectedExercise: DGFRecord<Exercise>;

    perPage: number;

    searchValue = '';

    constructor(
        private alertMessageService: AlertMessageService,
        private cd: ChangeDetectorRef,
        private router: Router,
        private route: ActivatedRoute,
    ) { }

    ngAfterViewInit() {
        // This line to fix error of p-table when isTableLoading
        this.cd.detectChanges();
    }

    onRowDoubleClick(selectedRow: DGFRecord<Exercise>) {
        this.selectedExercise = selectedRow;
        this.router.navigate(['../details/' + this.selectedExercise.id], { relativeTo: this.route });
    }

    onSearch() {
        this.loadList({ rows: this.perPage, first: 0 });
    }

    async loadList({ rows, first }) {
        this.tableLoading.start();
        this.perPage = rows;
        let records = [];
        this.selectedExercise = null;
        const query = new DGF.Query<Exercise>('exercise');
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
        this.listExercises = [];
        for (let item of records) {
            this.listExercises.push(item);
        }
        this.tableLoading.stop();
    }

    async showModalCreate() {
        this.modalData = {
            name: '',
            description: '',
            nameInvalid: false,
        };
        this.isShowModalCreate = true;
    }

    selectTrueAnswer({ id }) {
        this.modalData.trueAnswer = id;
    }

    validateData() {
        if (!this.modalData.name) {
            this.modalData.nameInvalid = true;
            this.alertMessageService.error('Vui lòng nhập tiêu đề');
            return false;
        }
        else {
            this.modalData.nameInvalid = false;
        }
        return true;
    }

    async createExercise() {
        if (!this.validateData()) return;

        try {
            let record = new DGF.Record<Exercise>('exercise');
            record.set('name', this.modalData.name);
            record.set('description', this.modalData.description);
            await record.save();
            this.loadList({ rows: this.perPage, first: 0 });

            this.alertMessageService.success('Tạo bài tập thành công');
            this.isShowModalCreate = false;
        } catch (error) {
            console.log(error);
            this.alertMessageService.error('Tạo bài tập thất bại');
        }
    }
}