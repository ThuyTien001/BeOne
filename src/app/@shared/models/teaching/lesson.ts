
import { BaseDoc, DGFRecord } from '@app/@shared/digiforce';
import { Chapter } from './chapter';
import { Grade } from './grade';
import { Semester } from './semester';
import { Subject } from './subject';

export interface Lesson extends BaseDoc {
	name: string;
	code: string;
	grade: DGFRecord<Grade> | string;
    semester: DGFRecord<Semester> | string;
    subject: DGFRecord<Subject> | string;
    chapter: DGFRecord<Chapter> | string;
	video?: string;
}
