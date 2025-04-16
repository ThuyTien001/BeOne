import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DividerModule } from 'primeng/divider';
import { MainLogoComponent } from '@app/@theme/components';
import { SharedModule } from '@app/@shared/shared.module';
import { CarouselModule } from 'primeng/carousel';
import { SkeletonModule } from 'primeng/skeleton';
import { PaginatorModule } from 'primeng/paginator';
import { ShareDataService } from '@app/@shared/services';
import _ from 'lodash';

const LABELS = {
    // Filter
    'breadcumb': 'Trang chủ > Học tại trung tâm',
    'filter_title': 'Các Lớp Học Tại Trung Tâm',
    // Card Item
    'date_range': 'Khai giảng ngày',
    'schedule_time': 'Thời gian học',
    'teacher': 'Giáo viên',
    'center': 'Trung tâm',
    'phone_number': 'Điện thoại',
    // Map
    'map_title': 'Vị trí trung tâm',
};

@Component({
    templateUrl: './study-center.component.html',
    styleUrls: ['./study-center.component.scss'],
    standalone: true,
    imports: [
        SharedModule,
        DividerModule,
        // MainLogoComponent,
        SkeletonModule,
        CarouselModule,
        RouterModule,
        PaginatorModule,
    ],
})
export class StudyCenterComponent implements OnInit {
    LABELS = LABELS;

    filterListGrades = [];
    filterListSubjects = [];

    listTeachingClasses = [
        {
            title: 'Toán Tư Duy Lớp 6',
            dateRange: '05.04.2023 - 05.07.2023',
            scheduleTime: 'T2 - T4 - T6 (17:00 - 19:00)',
            teacher: 'Lê Quang Tuấn',
            center: '43 Tân Canh, P.1, Q. Tân Bình, TP.HCM',
            phoneNumber: '0903 247 626',
        },
        {
            title: 'Toán Tư Duy Lớp 6',
            dateRange: '05.04.2023 - 05.07.2023',
            scheduleTime: 'T2 - T4 - T6 (17:00 - 19:00)',
            teacher: 'Lê Quang Tuấn',
            center: '43 Tân Canh, P.1, Q. Tân Bình, TP.HCM',
            phoneNumber: '0903 247 626',
        },
        {
            title: 'Toán Tư Duy Lớp 6',
            dateRange: '05.04.2023 - 05.07.2023',
            scheduleTime: 'T2 - T4 - T6 (17:00 - 19:00)',
            teacher: 'Lê Quang Tuấn',
            center: '43 Tân Canh, P.1, Q. Tân Bình, TP.HCM',
            phoneNumber: '0903 247 626',
        },
        {
            title: 'Toán Tư Duy Lớp 6',
            dateRange: '05.04.2023 - 05.07.2023',
            scheduleTime: 'T2 - T4 - T6 (17:00 - 19:00)',
            teacher: 'Lê Quang Tuấn',
            center: '43 Tân Canh, P.1, Q. Tân Bình, TP.HCM',
            phoneNumber: '0903 247 626',
        },
    ];

    constructor(
        public router: Router,
        private shareDataService: ShareDataService,
    ) { }

    async ngOnInit() {
        this.filterListGrades = [
            ...(await this.shareDataService.getListGrades() || [])
        ];
        this.filterListSubjects = [
            ...(await this.shareDataService.getListSubjects() || [])
        ];
    }

    onSearch() {

    }
}
