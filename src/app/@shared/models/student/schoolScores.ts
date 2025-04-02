import { BaseDoc, DGFRecord } from '@app/@shared/digiforce';
import { Student } from './student';
import { Grade, Semester, Subject } from '../teaching';

export interface SchoolScores extends BaseDoc {
	code: string;
	scoreNumber: number;
	grade: DGFRecord<Grade> | string;
	semester: DGFRecord<Semester> | string;
	student: DGFRecord<Student> | string;
	subject: DGFRecord<Subject> | string;
}
