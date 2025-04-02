import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild, computed, effect, signal } from '@angular/core';
import { SharedModule } from '@app/@shared/shared.module';
import { ThemeModule } from '@app/@theme/theme.module';
import { FileUploadModule } from 'primeng/fileupload';
import _ from 'lodash';
import { DGF, DGFRecord } from '@app/@shared/digiforce';
import { TableModule } from 'primeng/table';
import { QuestionModule } from '@app/@shared/modules/question/question.module';
import { ExerciseService, QuestionViewComponent } from '@app/@shared/modules';
import { MathjaxModule } from '@app/@shared/mathjax';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { TimeCounter, Utils } from '@app/@shared/utils';
import { AlertMessageService } from '@app/@shared/services';
import { CardModule } from 'primeng/card';
import { SpinnerModule } from '@app/@theme/components';
import { DoExercise } from '@app/@shared/models';
import { TranslateService } from '@ngx-translate/core';
import { TagModule } from 'primeng/tag';

export enum QuestionItemStatus {
    NotComplete = 'not-complete',
    Pass = 'pass',
    Failed = 'failed',
}

enum ViewMode {
    Information = 'information',
    DoExercise = 'do-exercise',
}

@Component({
    selector: 'lms-do-exercise-details',
    templateUrl: './do-exercise-details.component.html',
    standalone: true,
    imports: [
        SharedModule,
        ThemeModule,
        FileUploadModule,
        TableModule,
        QuestionModule,
        MathjaxModule,
        InputTextareaModule,
        InputTextModule,
        CardModule,
        SpinnerModule,
        TagModule,
    ],
    styles: [`
        :host ::ng-deep .p-tag {
            font-size: 0.9rem !important;
        }
    `],
})
export class DoExerciseDetailsComponent {
    QuestionItemStatus = QuestionItemStatus;

    @ViewChild('questionView', { static: false }) questionView: QuestionViewComponent;
    @Output() onClose = new EventEmitter();

    viewMode: ViewMode = ViewMode.Information;

    timeCounter = new TimeCounter();
    isLoading = new Utils.LoadingVar(false);
    record: DGFRecord<DoExercise>;

    exerciseName = '';
    listQuestions = [];

    currentQuestion = signal<any>({});
    currentQuestionIndex = computed(() => this.currentQuestion()?.no - 1);

    // Flags ------------------------------------------------------------------
    numberOfNotCompleted = signal(0);
    showSaveBtn = computed(() => this.currentQuestion()?.status === QuestionItemStatus.NotComplete);
    showSkipBtn = computed(() => this.showSaveBtn() && this.numberOfNotCompleted() > 1);
    showContinueBtn = computed(() => !this.showSaveBtn() && !this.isCompleted());
    isCompleted = computed(() => this.numberOfNotCompleted() === 0);
    isTriggerReload = false;

    summary = signal({
        total: 0,
        notComplete: 0,
        pass: 0,
        fail: 0,
    });
    displayResult = computed(() =>
        this.isCompleted()
            && this.summary().total
            && this.summary().pass
            ? `${this.summary().pass}/${this.summary().total}`
            : this.translateService.instant('common.placeholder_none')
    );
   

    constructor(
        private translateService: TranslateService,
        private alertMessageService: AlertMessageService,
        private exerciseService: ExerciseService,
        private cd: ChangeDetectorRef,
    ) {
        effect(() => {
            if (this.isCompleted()) {
                this.timeCounter.stop();
            }
        });
    }

    async loadDetails(record: DGFRecord<DoExercise>) {
        this.isLoading.start();
        this.isTriggerReload = false;
        this.record = record;
        this.exerciseName = this.record.get('name');
        let formattedQuestions = [];
        let snapshotQuestions: Array<DoExercise['snapshotQuestions']> = this.record.get('snapshotQuestions') || [];
        for (let i = 0; i < snapshotQuestions.length; i++) {
            const item = snapshotQuestions[i];
            let no = i + 1;
            formattedQuestions.push({
                ...item,
                prefix: no + '. ',
                no: no,
                status: QuestionItemStatus.NotComplete,
            });
        }
        this.listQuestions = formattedQuestions;
        let res = await DGF.API.post('/api_lms/get_exercise_result', {
            doExercise: this.record.id
        });
        this.updateResultForQuestion(res);
        this.timeCounter = new TimeCounter(res.processTime ? res.processTime * 1000 : 0);
        this.currentQuestion.set(this.listQuestions[0]);
        this.updateSummary();
        this.isLoading.stop();
    }

    async changeMode(viewMode: any) {
        this.viewMode = viewMode;
        switch (viewMode) {
            case ViewMode.Information:
                if (this.timeCounter) this.timeCounter.stop();
                if (this.isTriggerReload) {
                    await this.record.fetch();
                    this.record = await this.exerciseService.formatDoExercise(this.record);
                    this.loadDetails(this.record);
                }
                break;
            case ViewMode.DoExercise:
                if (!this.isCompleted()) {
                    this.timeCounter.start();
                }
                break;
            default:
                break;
        }
    }

    onClickCloseBtn() {
        this.onClose.next(true);
    }

    updateSummary() {
        this.numberOfNotCompleted.set(_.filter(this.listQuestions, q => q.status === QuestionItemStatus.NotComplete)?.length || 0);
        let summary = { total: 0, notComplete: 0, pass: 0, fail: 0, };
        for (let q of this.listQuestions || []) {
            summary.total++;
            switch (q.status) {
                case QuestionItemStatus.Pass:
                    summary.pass++;
                    break;
                case QuestionItemStatus.Failed:
                    summary.fail++;
                    break;
                case QuestionItemStatus.NotComplete:
                default:
                    summary.notComplete++;
                    break;
            }
        }
        this.summary.set(summary);
    }

    nextQuestion() {
        let currentIndex = _.findIndex(this.listQuestions, item => item.id === this.currentQuestion().id);
        if (currentIndex === -1) return;
        let tempBefore, tempAfter;
        for (let i = 0; i < this.listQuestions.length; i++) {
            const q = this.listQuestions[i];
            if (q.status === QuestionItemStatus.NotComplete) {
                if (i < currentIndex) {
                    if (!tempBefore) tempBefore = q;
                }
                else if (i > currentIndex) {
                    tempAfter = q;
                    break;
                }
            }
        }
        this.goToQuestion(tempAfter || tempBefore);
    }

    goToQuestion(questionData: any) {
        if (!questionData) return;
        this.currentQuestion.set(questionData);
    }

    updateResultForQuestion(opts: {
        answers: Record<string, string>,
        snapshotQuestionResults: Record<string, { explain: string, answerId: string }>,
    }) {
        let answers = opts.answers || {};
        let snapshotQuestionResults = opts.snapshotQuestionResults || {};
        for (let q of this.listQuestions) {
            if (answers[q.id] || snapshotQuestionResults[q.id]) {
                q.answer = answers[q.id];
                q.explain = snapshotQuestionResults[q.id]?.explain;
                q.trueAnswer = snapshotQuestionResults[q.id]?.answerId;
                q.status = q.answer === q.trueAnswer
                    ? QuestionItemStatus.Pass
                    : QuestionItemStatus.Failed;
            }
            if (this.currentQuestion()?.id === q.id) {
                this.currentQuestion.set(q);
            }
        }
        this.listQuestions = [...this.listQuestions];
        this.updateSummary();
        this.cd.detectChanges();
    }

    // ------------------------------------------------------------------------
    // API
    // ------------------------------------------------------------------------

    async updateResult() {
        if (this.questionView.isEmpty()) {
            this.alertMessageService.warn('Vui lòng chọn đáp án');
            return;
        }
        if (this.currentQuestion().status !== QuestionItemStatus.NotComplete) {
            this.alertMessageService.error('Không thể cập nhật câu hỏi đã được hoàn thành');
            return;
        }
        this.isTriggerReload = true;
        this.isLoading.start();
        try {
            let data = {
                doExercise: this.record.id,
                questionId: this.currentQuestion().id,
                answerId: this.questionView.getValue(),
                processTime: this.timeCounter.value() ? this.timeCounter.value() / 1000 : 0,
            };
            let res = await DGF.API.post('/api_lms/update_exercise_result', data);
            this.updateResultForQuestion(res);
        } catch (error) {
            console.log(error);
            this.alertMessageService.error('Lưu kết quả thất bại');
        }
        this.isLoading.stop();
    }

}