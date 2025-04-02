import { Component, ViewChild } from '@angular/core';
import { DGFRecord, DGF } from '@app/@shared/digiforce';
import { MathjaxModule } from '@app/@shared/mathjax';
import { ExerciseModule, LessonModule, QuestionModule, SubjectDetailsComponent } from '@app/@shared/modules';
import { SharedModule } from '@app/@shared/shared.module';
import { Utils } from '@app/@shared/utils';
import { SpinnerModule } from '@app/@theme/components';
import { ThemeModule } from '@app/@theme/theme.module';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
import { DropdownModule } from 'primeng/dropdown';
import { PaginatorModule } from 'primeng/paginator';
import { SkeletonModule } from 'primeng/skeleton';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from '@app/@shared/models';

@Component({
    templateUrl: 'my-lessons.component.html',
    styleUrls: ['./my-lessons.component.scss'],
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
        LessonModule,
        ProgressBarModule,
        DropdownModule,
        PaginatorModule,
        SkeletonModule,
    ],
})
export class MyLessonsComponent {
    @ViewChild('detailsComponent', { static: false }) detailsComponent: SubjectDetailsComponent;

    listSubjects: Array<any> = [];
    isLoading = new Utils.LoadingVar(false);
    totalRecords = 0;

    selectedSubject: DGFRecord<Subject>;

    perPage: number = 10;
    searchValue = '';
    isShowDetails = false;

    filterListSubjects = [
        { name: 'Toán', code: '1' },
        { name: 'Vật Lý', code: '2' },
        { name: 'Hóa', code: '3' },
        { name: 'Sinh', code: '4' },
    ];
    filterListClasses = [
        { name: 'Lớp 6', code: '6' },
        { name: 'Lớp 7', code: '7' },
        { name: 'Lớp 8', code: '8' },
        { name: 'Lớp 9', code: '9' },
        { name: 'Lớp 10', code: '10' },
        { name: 'Lớp 11', code: '11' },
        { name: 'Lớp 12', code: '12' },
    ];
    filter = { subject: '', class: '' };

    constructor(
        private router: Router,
        private route: ActivatedRoute,
    ) {
        setTimeout(() => {
            this.loadList({ rows: this.perPage, first: 0 });
        }, 300);
    }


    onSearch() {
        this.loadList({ rows: this.perPage, first: 0 });
    }

    async loadList({ rows, first }) {
        this.isLoading.start();
        this.perPage = rows || 10;
        let records: Array<DGFRecord<Subject>> = [];
        this.selectedSubject = null;
        const query = new DGF.Query<Subject>('subjects');
        if (this.searchValue) {
            query.contains('name', this.searchValue);
        }
        if (first === 0) {
            query.paging(this.perPage, 1);
            let res = await query.getPagingResult();
            records = res.records || [];
            this.totalRecords = res.count;
        }
        else {
            query.skip(first);
            query.limit(this.perPage);
            records = await query.find();
        }
        this.listSubjects = [];
        const getRandomInt = function (min: number, max: number) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        };
        for (let item of records) {
            let total = getRandomInt(20, 50);
            let completed = getRandomInt(0, total);
            item.setFormattedValue('teacher' as any, 'Thầy Nguyễn Văn A');
            item.setFormattedValue('progressLabel' as any, `${completed}/${total}`);
            item.setFormattedValue('progressValue' as any, Math.floor(completed === 0 ? 0 : completed / total * 100));
            item.setFormattedValue('isCompleted' as any, completed === total);
            this.listSubjects.push(item);
        }
        this.isLoading.stop();
    }

    loadDetails(record: DGFRecord<Subject>) {
        this.router.navigate(['../details/' + record.id], { relativeTo: this.route });
    }

}