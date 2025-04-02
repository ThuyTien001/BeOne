
import { BaseDoc, DGFRecord } from '@app/@shared/digiforce';
import { DoExercise } from './do-exercise';

export interface DoExerciseResult extends BaseDoc {
    code: string;
    doExercise: DGFRecord<DoExercise> | string;
    score: number;
    snapshotQuestionResults: Record<string, {
        explain: string;
        answerId: string;
    }>;
}
