import { Component, Input, OnInit } from '@angular/core';
import { DGFRecord } from '@app/@shared/digiforce';
import { Exercise, Question } from '@app/@shared/models';
import { QuestionModule } from '@app/@shared/modules';
import { SharedModule } from '@app/@shared/shared.module';
import { ThemeModule } from '@app/@theme/theme.module';

@Component({
    selector: 'lms-exercise-view',
    templateUrl: 'exercise-view.component.html',
    standalone: true,
    imports: [
        SharedModule,
        ThemeModule,
        QuestionModule,
    ],

})
export class ExerciseViewComponent {
    @Input() exercise: DGFRecord<Exercise>;
    @Input() showResult: boolean;

    listQuestions: Array<DGFRecord<Question>> = [];

    constructor() { }

    async loadExercise(exercise: DGFRecord<Exercise>, listQuestions?: Array<DGFRecord<Question>>) {
        this.exercise = exercise;
        this.listQuestions = listQuestions || this.exercise.get('questions') || [];
    }
}