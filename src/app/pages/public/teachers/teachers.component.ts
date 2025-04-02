import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SharedModule } from '@app/@shared/shared.module';
import _ from 'lodash';

@Component({
    templateUrl: './teachers.component.html',
    styleUrls: ['./teachers.component.scss'],
    standalone: true,
    imports: [
        SharedModule,
    ],
})
export class TeachersComponent {
    listTeachers = [
        {
            url: 'assets/images/teacher/teacher-bg-1.webp',
            title: 'GV. Nguyễn Kim Anh',
            grade: 'Giáo viên Toán lớp 6',
            school: 'Trường chuyên Lê Quý Đôn',
            description: 'Một giáo viên giỏi là người biết khơi gợi hy vọng, thổi bùng trí tưởng tượng và thấm nhuần niềm đam mê học hỏi',
            theme: 'teacher-profile-blue',
        },
        {
            url: 'assets/images/teacher/teacher-bg-2.webp',
            title: 'GV. Lê Hồng Quang',
            grade: 'Giáo viên Toán lớp 7',
            school: 'Trường chuyên Lê Quý Đôn',
            description: 'Giáo dục là một quá trình tự nhiên được thực hiện bởi trẻ nhỏ và không đạt được nhờ lắng nghe mà nhờ trải nghiệm trong môi trường',
            theme: 'teacher-profile-white',
        },
        {
            url: 'assets/images/teacher/teacher-bg-3.webp',
            title: 'GV. Lê Kim Phượng',
            grade: 'Giáo viên Toán lớp 8',
            school: 'Trường chuyên Lê Hồng Phong',
            description: 'Không thể dạy trẻ hình thành tính cách. Nó đến từ trải nghiệm chứ không phải giải thích',
            theme: 'teacher-profile-blue',
        },
        {
            url: 'assets/images/teacher/teacher-bg-4.webp',
            title: 'GV. Đoàn Hồng Đức Minh',
            grade: 'Giáo viên Toán lớp 9',
            school: 'Trường chuyên Lê Quý Đôn',
            description: 'Không nên dạy cho trẻ những gì chúng phải suy nghĩ, mà dạy cho chúng cách suy nghĩ',
            theme: 'teacher-profile-white',
        },
    ];

    constructor(
        public router: Router,
    ) { }

}
