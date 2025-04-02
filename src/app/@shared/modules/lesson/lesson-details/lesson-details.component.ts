import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { VideoPlayerComponent } from '@app/@shared/components';
import { DGF, DGFRecord } from '@app/@shared/digiforce';
import { Chapter, Lesson, Subject } from '@app/@shared/models';
import { SharedModule } from '@app/@shared/shared.module';
import { LoadingVar, Utils } from '@app/@shared/utils';
import { SpinnerModule, UserAvatarComponent } from '@app/@theme/components';
import { ListboxModule } from 'primeng/listbox';
import { SkeletonModule } from 'primeng/skeleton';
import _ from 'lodash';

@Component({
    selector: 'lms-lesson-details',
    templateUrl: 'lesson-details.component.html',
    standalone: true,
    imports: [
        SharedModule,
        VideoPlayerComponent,
        ListboxModule,
        UserAvatarComponent,
        SpinnerModule,
        SkeletonModule,
    ],
    styles: [`
        :host ::ng-deep .p-listbox.p-component {
            border: none;
            border-radius: 0;
        }
        :host ::ng-deep .p-listbox .p-listbox-list .p-listbox-item {
            padding: 1.25rem;
        }
        :host ::ng-deep .p-listbox-list {
            padding-top: 0;
        }
    `],
})
export class LessonDetailsComponent {
    @ViewChild('videoPlayer', { static: false }) videoPlayer: VideoPlayerComponent;
    @Output() onClose = new EventEmitter();

    isLoading = new LoadingVar(false);
    isLoadingLesson = new LoadingVar(false);
    isLoadingBtn = new LoadingVar(false);

    subject: DGFRecord<Subject>;

    listChapters: Array<DGFRecord<Chapter>> = [];
    currentChapter: DGFRecord<Chapter>;

    listLessons: Array<DGFRecord<Lesson>> = [];
    currentLesson: DGFRecord<Lesson>;
    currentLessonIndex: number;
    lessonVideoUrl: string;

    constructor() { }

    async loadDetails(params: {
        lesson: DGFRecord<Lesson>,
        listLessons?: DGFRecord<Lesson>[],
    }) {
        this.currentLesson = params.lesson;
        if (!this.currentLesson) return;

        this.isLoadingLesson.start();

        if (params.listLessons) this.listLessons = params.listLessons;
        this.currentLessonIndex = _.findIndex(this.listLessons, item => item.id === this.currentLesson.id);

        this.lessonVideoUrl = DGF.Utils.parseFileUrl(this.currentLesson.get('video'));
        if (this.lessonVideoUrl) {
            await Utils.delay(200);
            this.videoPlayer.changeSrc(this.lessonVideoUrl);
        }
        this.isLoadingLesson.stop();
    }

    onChangeLesson() {
        this.loadDetails({ lesson: this.currentLesson });
    }

    nextLesson() {
        let l = this.listLessons[this.currentLessonIndex + 1];
        if (!l) return;
        this.loadDetails({ lesson: l });
    }

    previousLesson() {
        let l = this.listLessons[this.currentLessonIndex - 1];
        if (!l) return;
        this.loadDetails({ lesson: l });
    }

    async download() {
        if (!this.currentLesson) return;
        this.isLoadingBtn.start();
        let id = await DGF.API.post('/api_lms/get_download_lesson', {
            lessonId: this.currentLesson._id
        });
        window.open(DGF.Utils.absoluteUrl('/api_lms/download_lesson/' + id), '_blank');
        this.isLoadingBtn.stop();
    }
}