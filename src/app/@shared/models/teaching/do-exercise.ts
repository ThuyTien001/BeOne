import { QuestionType } from '@app/@declare';
import { BaseDoc, DGFRecord } from '@app/@shared/digiforce';
import { Exercise } from './exercise';
import { Lesson } from './lesson';
import { Grade } from './grade';
import { Semester } from './semester';
import { Subject } from './subject';

export enum DoExerciseStatus {
    Pending = 'pending',
    Processing = 'processing',
    Completed = 'completed',
}

export interface DoExercise extends BaseDoc {
	name: string;
	code: string;
	description: string;
	exercise: DGFRecord<Exercise> | string;
	student: DGFRecord<any> | string;
	startDate: Date;
	endDate: Date;
    status: DoExerciseStatus;

    lesson: DGFRecord<Lesson> | string;
    grade: DGFRecord<Grade> | string;
    semester: DGFRecord<Semester> | string;
    subject: DGFRecord<Subject> | string;

	snapshotQuestions: Array<{
        id: string;
        name: string;
        type: QuestionType;
        answers: Array<{
            answerId: string,
            name: string,
        }>;
        content?: string;
    }>;
}
