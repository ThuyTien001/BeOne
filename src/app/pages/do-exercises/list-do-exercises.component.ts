import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DGFRecord, DGF } from '@app/@shared/digiforce';
import { MathjaxModule } from '@app/@shared/mathjax';
import { DoExercise } from '@app/@shared/models';
import { ExerciseModule, ExerciseService, QuestionModule } from '@app/@shared/modules';
import { SharedModule } from '@app/@shared/shared.module';
import { Utils } from '@app/@shared/utils';
import { SpinnerModule } from '@app/@theme/components';
import { ThemeModule } from '@app/@theme/theme.module';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TableModule } from 'primeng/table';

@Component({
    templateUrl: 'list-do-exercises.component.html',
    standalone: true,
    imports: [
        SharedModule,
        ThemeModule,
        TableModule,
        QuestionModule,
        MathjaxModule,
        DialogModule,
        InputTextareaModule,
        InputTextModule,
        SpinnerModule,
        ExerciseModule,

        RouterModule,
    ],
})
export class ListDoExercisesComponent {

    listDoExercises: Array<any> = [];
    tableLoading = new Utils.LoadingVar(false);
    totalRecords = 0;

    isShowModalCreate = false;
    isCreate = false;
    modalData: any = {};
    selectedDoExercise: DGFRecord<DoExercise>;

    perPage: number;

    searchValue = '';
    isShowDetails = false;

    constructor(
        private exerciseService: ExerciseService,
        private router: Router,
        private route: ActivatedRoute,
    ) { }

    onRowDoubleClick(selectedRow: DGFRecord<DoExercise>) {
        this.selectedDoExercise = selectedRow;
        this.isShowDetails = true;
        this.router.navigate(['../details/' + this.selectedDoExercise.id], { relativeTo: this.route });
    }

    onSearch() {
        this.loadList({ rows: this.perPage, first: 0 });
    }

    async loadList({ rows, first }) {
        this.tableLoading.start();
        this.perPage = rows;
        let records = [];
        this.selectedDoExercise = null;
        const query = new DGF.Query<DoExercise>('doExercise');
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
        this.listDoExercises = [];
        for (let item of records) {
            this.listDoExercises.push(await this.exerciseService.formatDoExercise(item));
        }
        this.tableLoading.stop();
    }

    closeDetails() {
        this.isShowDetails = false;
    }

}