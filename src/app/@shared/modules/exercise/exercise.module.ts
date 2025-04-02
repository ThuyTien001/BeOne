import { NgModule } from '@angular/core';
import { ExerciseViewComponent } from './exercise-view/exercise-view.component';
import { ExerciseDetailsComponent } from './exercise-details/exercise-details.component';
import { DoExerciseDetailsComponent } from './do-exercise-details/do-exercise-details.component';
import { ExerciseService } from './exercise.service';

@NgModule({
    imports: [
        ExerciseViewComponent,
        ExerciseDetailsComponent,
        DoExerciseDetailsComponent,
    ],
    exports: [
        ExerciseViewComponent,
        ExerciseDetailsComponent,
        DoExerciseDetailsComponent,
    ],
    declarations: [],
    providers: [ExerciseService],
})
export class ExerciseModule { }
