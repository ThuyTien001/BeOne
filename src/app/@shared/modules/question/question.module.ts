import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SharedModule } from '@app/@shared/shared.module';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { MathjaxModule } from '@app/@shared/mathjax';
import { QuestionViewComponent } from './question-view/question-view.component';
import { SelectQuestionDialogComponent } from './select-question-dialog/select-question-dialog.component';
import { UploadQuestionsDialogComponent } from './upload-question-dialog/upload-questions-dialog.component';
import { QuestionDetailsDialogComponent } from './question-details-dialog/question-details-dialog.component';
import { QuestionService } from './question.service';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadModule } from 'primeng/fileupload';
import { ThemeModule } from '@app/@theme/theme.module';
import { SpinnerModule } from '@app/@theme/components';

@NgModule({
    imports: [
        SharedModule,
        ThemeModule,
        ButtonModule,
        CheckboxModule,
        RadioButtonModule,
        InputTextareaModule,
        InputNumberModule,
        InputTextModule,
        MathjaxModule,
        DialogModule,
        TableModule,
        FileUploadModule,
        SpinnerModule,
    ],
    exports: [
        QuestionViewComponent,
        SelectQuestionDialogComponent,
        UploadQuestionsDialogComponent,
        QuestionDetailsDialogComponent,
    ],
    declarations: [
        QuestionViewComponent,
        SelectQuestionDialogComponent,
        UploadQuestionsDialogComponent,
        QuestionDetailsDialogComponent,
    ],
    providers: [QuestionService],
})
export class QuestionModule { }
