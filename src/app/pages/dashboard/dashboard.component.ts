import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { StyleClassModule } from 'primeng/styleclass';
import { SharedModule } from '@app/@shared/shared.module';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChalkboardTeacher, faBookReader } from '@fortawesome/free-solid-svg-icons';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import _ from 'lodash';

@Component({
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    standalone: true,
    imports: [
        SharedModule,
        ChartModule,
        MenuModule,
        TableModule,
        StyleClassModule,
        ButtonModule,
        NgCircleProgressModule,
        FontAwesomeModule,
    ],
})
export class DashboardComponent  {
    faChalkboardTeacher = faChalkboardTeacher;
    faBookReader = faBookReader;
    faClock = faClock;

    recentStudyTimes = [
        {
            time: '17:00',
            type: 'Trung Tâm',
            subject: 'Toán Đại Cương 10',
            date: '09/10/2023',
        },
        {
            time: '7:00',
            type: 'Online',
            subject: 'Toán Hình Học 10',
            date: '09/10/2023',
            isOnline: true,
        },
        {
            time: '17:00',
            type: 'Trung Tâm',
            subject: 'Toán Giải Tích 10',
            date: '09/10/2023',
        },
    ];
    attendanceCols = [
        { id: '1', label: '08/05/2023' },
        { id: '2', label: '09/05/2023' },
        { id: '3', label: '10/05/2023' },
        { id: '4', label: '11/05/2023' },
        { id: '5', label: '12/05/2023' },
        { id: '6', label: '13/05/2023' },
        { id: '7', label: '14/05/2023' },
    ];
    listAttendance = [
        {
            subjectName: 'Toán Đại Cương 10',
            checked: {
                '1': true,
                '2': null,
                '3': null,
                '4': null,
                '5': true,
                '6': null,
                '7': null,
            },
        },
        {
            subjectName: 'Toán Hình Học 10',
            checked: {
                '1': null,
                '2': false,
                '3': null,
                '4': null,
                '5': null,
                '6': true,
                '7': null,
            },
        },
        {
            subjectName: 'Toán Giải Tích 10',
            checked: {
                '1': null,
                '2': null,
                '3': true,
                '4': null,
                '5': null,
                '6': null,
                '7': true,
            },
        },
        {
            subjectName: 'Luyện Tập Toán 10',
            checked: {
                '1': null,
                '2': null,
                '3': null,
                '4': true,
                '5': null,
                '6': null,
                '7': null,
            },
        },
    ];
    listStudyProcesses: Array<any> = [
        {
            id: '1',
            percent: 30,
            className: 'Kỹ Năng Làm Bài Tập',
            teacher: 'Thầy Nguyễn Anh E',
            exerciseCount: '10/10',
            deadline: '10/02/2024',
        },
        {
            id: '2',
            percent: 25,
            className: 'Toán Đại Cương 10',
            teacher: 'Thầy Nguyễn Anh E',
            exerciseCount: '9/36',
            deadline: '10/02/2024',
        },
        {
            id: '3',
            percent: 40,
            className: 'Toán Hình Học 10',
            teacher: 'Thầy Nguyễn Anh E',
            exerciseCount: '8/20',
            deadline: '10/02/2024',
        },
        {
            id: '4',
            percent: 80,
            className: 'Toán Giải Tích 10',
            teacher: 'Thầy Nguyễn Anh E',
            exerciseCount: '24/30',
            deadline: '10/02/2024',
        },
        {
            id: '5',
            percent: 100,
            className: 'Kỹ Năng Làm Bài Tập (2)',
            teacher: 'Thầy Nguyễn Anh E',
            exerciseCount: '34/34',
            deadline: '10/02/2024',
        },
    ];

    activeProcessId: any;
    activeProcess: any;

    constructor(
        private cd: ChangeDetectorRef,
    ) {
        this.changeStudyProcess(this.listStudyProcesses[0]);
    }

    changeStudyProcess(item: any) {
        this.activeProcess = item;
        this.activeProcessId = item.id;
    }

    goToPrevStudyProcess() {
        let index = _.findIndex(this.listStudyProcesses, item => item.id === this.activeProcessId);
        if (index === -1) return;
        index--;
        if (index === -1) index = this.listStudyProcesses.length - 1;
        let item = this.listStudyProcesses[index];
        if (!item) return;
        this.changeStudyProcess(item);
    }

    goToNextStudyProcess() {
        let index = _.findIndex(this.listStudyProcesses, item => item.id === this.activeProcessId);
        if (index === -1) return;
        index++;
        if (index > this.listStudyProcesses.length - 1) index = 0;
        let item = this.listStudyProcesses[index];
        if (!item) return;
        this.changeStudyProcess(item);
    }

}
