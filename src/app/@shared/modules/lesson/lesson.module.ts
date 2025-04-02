import { NgModule } from '@angular/core';
import { LessonDetailsComponent } from './lesson-details/lesson-details.component';
import { SubjectDetailsComponent } from './subject-details/subject-details.component';


@NgModule({
    imports: [
        LessonDetailsComponent,
        SubjectDetailsComponent,
    ],
    exports: [
        LessonDetailsComponent,
        SubjectDetailsComponent,
    ],
    declarations: [],
    providers: [],
})
export class LessonModule { }
