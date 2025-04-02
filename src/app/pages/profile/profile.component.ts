import { Component, OnInit } from '@angular/core';
import { LayoutService } from '@app/@theme/services';
import { SharedModule } from '@app/@shared/shared.module';
import { AlertMessageService, ShareDataService } from '@app/@shared/services';
import { DGF } from '@app/@shared/digiforce';
import { UserAvatarComponent } from '@app/@theme/components';
import { applyFontForJsPDF } from '@app/@shared/utils';
import { TranslateService } from '@ngx-translate/core';
import { ThemeModule } from '@app/@theme/theme.module';
import _ from 'lodash';
import { TableModule } from 'primeng/table';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DropdownModule } from 'primeng/dropdown';
import { DividerModule } from 'primeng/divider';
import { StyleClassModule } from 'primeng/styleclass';
import { SchoolScores, StudentScoreTypes, StudentScores } from '@app/@shared/models';
import moment from 'moment';

const LABELS = {
    'student_profile': 'Lý lịch học sinh',
    'email': 'Email',
    'birthday': 'Ngày tháng năm sinh',
    'phonenumber': 'Số điện thoại',
    'address': 'Địa chỉ liên lạc',
    'school': 'Trường học',
    'parent_name': 'Phụ huynh',
    'parent_phonenumber': 'Số điện thoại PHHS',
};

@Component({
    templateUrl: './profile.component.html',
    standalone: true,
    styleUrls: ['./profile.component.scss'],
    imports: [
        SharedModule,
        UserAvatarComponent,
        ThemeModule,
        TableModule,
        DropdownModule,
        DividerModule,
        StyleClassModule,
    ],
})
export class ProfileComponent implements OnInit {
    LABELS = LABELS;

    fullName: string;
    avatarUrl: string;
    isLoading = false;
    isLoadingDialog = false;

    displayData: any = {};

    beOneScoresGroupByGrade: Record<string, any> = {};
    listBeOneScores = [];
    listSchoolScores = [];
    listGrades = [];
    filterGrade: any;
    filterGradeForSchool: any;
    showSchoolTableScores = false;
    listSemesters = [];
    filterSemesterForSchool: any;
    listAllSchoolScores = [];

    constructor(
        public layoutService: LayoutService,
        public alertMessageService: AlertMessageService,
        public translateService: TranslateService,
        public shareDataService: ShareDataService,
    ) { }

    ngOnInit() {
        this.loadUserInfo();
    }

    async loadUserInfo() {
        let user = DGF.Context.getUser();
        this.fullName = user.name;
        this.avatarUrl = DGF.Context.getUserAvatarUrl();

        this.listGrades = [
            ...(await this.shareDataService.getListGrades() || [])
        ];
        this.listSemesters = [
            ...(await this.shareDataService.getListSemesters() || [])
        ];
        let profileData = user.lms_profile_data || {};
        this.displayData = {
            birthday: profileData.birthday ? 'Ngày ' + moment(profileData.birthday).format('LL') : '',
            phonenumber: user.mobile,
            address: profileData.address,
            school: profileData.schoolName,
            parentName: profileData.parentData?.name,
            parentPhonenumber: profileData.parentData?.mobile,
            age: profileData.birthday
                ? `${moment().diff(profileData.birthday, 'years')} tuổi`
                : '',
            grade: await DGF.getRecordName('grade', profileData.grade),
        };
        await this.loadTableScores();
        await this.loadSchoolTableScores();
    }

    async loadTableScores() {
        let user = DGF.Context.getUser();
        let studentId = user.lms_student;
        let query = new DGF.Query<StudentScores>('studentScores')
            .equalTo('student', studentId)
            .limit(10000);
        let res = await query.find();
        let groupByGrade: any = _.groupBy(res, record => record.get('grade') || 'other');
        for (let gradeId in groupByGrade) {
            let temp = [];
            let groupBySubject = _.groupBy(groupByGrade[gradeId] || [], record => record.get('subject') || 'other');
            for (let subjectId in groupBySubject) {
                let tempObj = {
                    score1: _.find(groupBySubject[subjectId], item => item.get('type') === StudentScoreTypes.Time1)?.get('scoreNumber'),
                    score2: _.find(groupBySubject[subjectId], item => item.get('type') === StudentScoreTypes.Time2)?.get('scoreNumber'),
                    score3: _.find(groupBySubject[subjectId], item => item.get('type') === StudentScoreTypes.Time3)?.get('scoreNumber'),
                    score4: _.find(groupBySubject[subjectId], item => item.get('type') === StudentScoreTypes.Time4)?.get('scoreNumber'),
                };
                let total = 0;
                let count = 0;
                for (let val of [
                    tempObj.score1,
                    tempObj.score2,
                    tempObj.score3,
                    tempObj.score4,
                ]) {
                    let _val = _.toNumber(val);
                    if (_val) {
                        total += _val;
                        count++;
                    }
                }

                temp.push({
                    subjectId: subjectId,
                    subjectName: await DGF.getRecordName('subjects', subjectId),
                    ...tempObj,
                    score1: tempObj.score1 || '-',
                    score2: tempObj.score2 || '-',
                    score3: tempObj.score3 || '-',
                    score4: tempObj.score4 || '-',
                    scoreAverage: (count > 0 && total > 0) ? total / count : 0,
                });
            }
            groupByGrade[gradeId] = temp;
        }
        this.beOneScoresGroupByGrade = groupByGrade;
        this.filterListBeOneScore();
    }

    filterListBeOneScore() {
        this.listBeOneScores = _.map(
            this.beOneScoresGroupByGrade[this.filterGrade?.value] || [],
            (item, index) => {
                item.no = index + 1;
                return item;
            }
        );
    }

    async loadSchoolTableScores() {
        let user = DGF.Context.getUser();
        let studentId = user.lms_student;
        let query = new DGF.Query<SchoolScores>('schoolScores')
            .equalTo('student', studentId)
            .limit(10000);
        this.listAllSchoolScores = await query.find();
        await this.filterListSchoolScore();
    }

    async filterListSchoolScore() {
        let arr = _.filter(
            this.listAllSchoolScores,
            record => record.get('grade') === this.filterGradeForSchool?.value

        );
        let groupBySubject = _.groupBy(arr || [], record => record.get('subject') || 'other');
        let temp = [];
        let no = 1;
        for (let subjectId in groupBySubject) {
            let scoreArray = [];
            for (let seItem of this.listSemesters) {
                let seId = seItem.value;
                let a = _.find(groupBySubject[subjectId], item => item.get('semester') === seId)?.get('scoreNumber');
                scoreArray.push(a);
            }

            let total = 0;
            let count = 0;
            for (let val of scoreArray) {
                let _val = _.toNumber(val);
                if (_val) {
                    total += _val;
                    count++;
                }
            }

            temp.push({
                no: no++,
                subjectId: subjectId,
                subjectName: await DGF.getRecordName('subjects', subjectId),
                scoreArray: scoreArray,
                scoreAverage: (count > 0 && total > 0) ? total / count : 0,
            });
        }
        this.listSchoolScores = temp || [];
    }

    // ------------------------------------------------------------------------
    // Download Score Table
    // ------------------------------------------------------------------------
    download(isSchoolScore = false) {

        let doc = new jsPDF({ orientation: 'landscape' });

        applyFontForJsPDF(doc);

        doc.setFontSize(22)
            .setFont('Roboto', 'bold')
            .text('Bảng điểm', 150, 20, { align: 'center' });
        doc.setFontSize(12)
            .setFont('Roboto', 'bold')
            .text('Họ và Tên: ' + this.fullName, 15, 30);
        doc.setFontSize(12)
            .setFont('Roboto', 'bold')
            .text('Lớp học: ' + (this.filterGrade?.label || ''), 15, 40);

        if (isSchoolScore) {
            autoTable(doc, {
                head: [[
                    'STT',
                    'Môn học',
                    ..._.map(this.listSemesters, item => item.label),
                    'Điểm trung bình',
                ]],
                body: _.map(this.listSchoolScores, item => [
                    item.no,
                    item.subjectName,
                    ...(item.scoreArray || []),
                    item.scoreAverage,
                ]),
                styles: {
                    font: 'Roboto',
                    fontStyle: 'bold'
                },
                startY: 50,
            });
        }
        else {
            autoTable(doc, {
                head: [[
                    'STT',
                    'Lớp học',
                    'Điểm 1',
                    'Điểm 2',
                    'Điểm 3',
                    'Điểm 4',
                    'Điểm trung bình',
                ]],
                body: _.map(this.listBeOneScores, item => [
                    item.no,
                    item.subjectName,
                    item.score1,
                    item.score2,
                    item.score3,
                    item.score4,
                    item.scoreAverage,
                ]),
                styles: {
                    font: 'Roboto',
                    fontStyle: 'bold'
                },
                startY: 50,
            });
        }
        doc.save('bang-diem.pdf');
    }

}
