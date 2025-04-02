import { BaseDoc, DGFRecord } from '@app/@shared/digiforce';
import { Student } from './student';
import { Grade, Semester, Subject } from '../teaching';

export enum StudentScoreTypes {
	Time1 = 'time1',
	Time2 = 'time2',
	Time3 = 'time3',
	Time4 = 'time4',
};

export interface StudentScores extends BaseDoc {
	code: string;
	scoreNumber: number;
	grade: DGFRecord<Grade> | string;
	semester: DGFRecord<Semester> | string;
	student: DGFRecord<Student> | string;
	subject: DGFRecord<Subject> | string;
	type: StudentScoreTypes;
}
