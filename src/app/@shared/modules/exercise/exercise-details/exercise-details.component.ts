import { ChangeDetectorRef, Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { SharedModule } from '@app/@shared/shared.module';
import { ThemeModule } from '@app/@theme/theme.module';
import { FileUploadModule } from 'primeng/fileupload';
import _ from 'lodash';
import { DGFRecord } from '@app/@shared/digiforce';
import { TableModule } from 'primeng/table';
import { Exercise, Question } from '@app/@shared/models';
import { QuestionModule } from '@app/@shared/modules/question/question.module';
import { QuestionService, SelectQuestionDialogComponent } from '@app/@shared/modules';
import { MathjaxModule } from '@app/@shared/mathjax';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { Utils } from '@app/@shared/utils';
import { AlertMessageService } from '@app/@shared/services';
import { CardModule } from 'primeng/card';
import { SpinnerModule } from '@app/@theme/components';
import { TabViewModule } from 'primeng/tabview';
import { ExerciseViewComponent } from '../exercise-view/exercise-view.component';
import { DialogModule } from 'primeng/dialog';
import { ToggleButtonModule } from 'primeng/togglebutton';

@Component({
    selector: 'lms-exercise-details',
    templateUrl: './exercise-details.component.html',
    standalone: true,
    imports: [
        SharedModule,
        ThemeModule,
        FileUploadModule,
        TableModule,
        QuestionModule,
        MathjaxModule,
        TabViewModule,
        InputTextareaModule,
        InputTextModule,
        CardModule,
        SpinnerModule,
        ExerciseViewComponent,
        DialogModule,
        ToggleButtonModule,
    ],
})
export class ExerciseDetailsComponent {
    @ViewChild('selectQuestion', { static: false }) selectQuestion: SelectQuestionDialogComponent;
    @ViewChild('exerciseView', { static: false }) exerciseView: ExerciseViewComponent;
    @Output() onClose = new EventEmitter();

    isLoading = new Utils.LoadingVar(false);

    formData = {
        name: '',
        description: '',
        nameInvalid: false,
    };
    listSelectedQuestions = [];
    record: DGFRecord<Exercise>;
    tabIndex = 1;

    isShowDialogPreview = false;

    constructor(
        private questionService: QuestionService,
        private alertMessageService: AlertMessageService,
        private cd: ChangeDetectorRef,
    ) { }


    async loadDetails(record: DGFRecord<Exercise>) {
        this.isLoading.start();
        this.record = record;
        this.tabIndex = 0;
        this.formData = {
            name: record.get('name'),
            description: record.get('description'),
            nameInvalid: false,
        };
        let arr = await this.record.fetchInclude<Question>('questions', 'question', true) as Array<any>;
        let formattedQuestions = [];
        for (let item of arr || []) {
            formattedQuestions.push(await this.questionService.formatQuestion(item));
        }
        this.listSelectedQuestions = formattedQuestions;
        this.isLoading.stop();
    }

    onClickCloseBtn() {
        this.onClose.next(true);
    }

    removeQuestion(index: number) {
        this.listSelectedQuestions.splice(index, 1);
        this.listSelectedQuestions = [...this.listSelectedQuestions];
    }

    validateData() {
        if (!this.formData.name) {
            this.formData.nameInvalid = true;
            this.alertMessageService.error('Vui lòng nhập tiêu đề');
            return false;
        }
        else {
            this.formData.nameInvalid = false;
        }
        return true;
    }

    // ------------------------------------------------------------------------
    // API
    // ------------------------------------------------------------------------

    async saveExercise() {
        if (!this.formData.name) {
            this.formData.nameInvalid = true;
            this.alertMessageService.error('Vui lòng nhập tiêu đề');
            return;
        }
        this.isLoading.start();
        try {
            this.record.set('name', this.formData.name);
            this.record.set('description', this.formData.description);
            this.record.set('questions', _.map(this.listSelectedQuestions, item => item.id));
            await this.record.save();

            this.alertMessageService.success('Lưu bài tập thành công');
        } catch (error) {
            console.log(error);
            this.alertMessageService.error('Lưu bài tập thất bại');
        }
        this.isLoading.stop();
    }

    // ------------------------------------------------------------------------
    // Select Question Dialog
    // ------------------------------------------------------------------------

    openSelectQuestionDialog() {
        this.selectQuestion.showDialog({
            selectedIds: _.map(this.listSelectedQuestions, item => item.id),
        });
    }

    addQuestion(questions: Array<DGFRecord<Question>>) {
        let currentIds = _.map(this.listSelectedQuestions, item => item.id);
        for (let q of questions) {
            if (!_.includes(currentIds, q.id)) {
                this.listSelectedQuestions.push(q);
            }
        }
    }

    // ------------------------------------------------------------------------
    // Preview Dialog
    // ------------------------------------------------------------------------

    showDialogPreview() {
        this.isShowDialogPreview = true;
        this.exerciseView.loadExercise(this.record, this.listSelectedQuestions);
    }

}