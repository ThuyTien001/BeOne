import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { VideoPlayerComponent } from '@app/@shared/components';
import { DGF, DGFRecord } from '@app/@shared/digiforce';
import { Chapter, Lesson, Subject } from '@app/@shared/models';
import { SharedModule } from '@app/@shared/shared.module';
import { LoadingVar } from '@app/@shared/utils';
import { SpinnerModule, UserAvatarComponent } from '@app/@theme/components';
import { ListboxModule } from 'primeng/listbox';
import { TreeModule } from 'primeng/tree';
import { LessonDetailsComponent } from '../lesson-details/lesson-details.component';
import _ from 'lodash';
import { AccordionModule } from 'primeng/accordion';
import { BreadCrumbService } from '@app/@theme/services';

@Component({
    selector: 'lms-subject-details',
    templateUrl: 'subject-details.component.html',
    styleUrls: ['./subject-details.component.scss'],
    standalone: true,
    imports: [
        SharedModule,
        VideoPlayerComponent,
        ListboxModule,
        UserAvatarComponent,
        SpinnerModule,
        TreeModule,
        LessonDetailsComponent,
        AccordionModule,
    ],
})
export class SubjectDetailsComponent {
    @ViewChild('lessonDetails', { static: false }) lessonDetails: LessonDetailsComponent;
    @Output() onClose = new EventEmitter();

    isLoading = new LoadingVar(false);

    subject: DGFRecord<Subject>;
    listChapters: Array<DGFRecord<Chapter>> = [];
    treeData = [];

    currentLesson: DGFRecord<Lesson>;
    showType: 'subject' | 'lesson' = 'subject';
    activeIndex = [];

    breadcrumbSubjectId: string;
    breadcrumbLessonId: string;

    constructor(
        private breadCrumbService: BreadCrumbService,
    ) { }

    onClickCloseBtn() {
        this.onClose.next(true);
    }

    async loadDetails(
        subject: DGFRecord<Subject>,
        chapterId?: string,
        lessonId?: string,
    ) {
        this.showType = 'subject';
        this.subject = subject;
        if (!this.subject) return;
        this.isLoading.start();
        this.listChapters = await new DGF.Query<Chapter>('chapter')
            .equalTo('subject', this.subject._id)
            .find();
        let arr = [];
        for (let item of this.listChapters) {
            arr.push({
                key: item._id,
                label: item.getFormattedValue('name'),
                children: [],
                type: 'chapter',
                childrenLoaded: false,
                record: item,
                loading: new LoadingVar(true, 1000),
            });
        }
        this.treeData = arr;
        if (chapterId) {
            let index = _.findIndex(this.treeData, item => item.key === chapterId);
            if (index !== -1) {
                this.activeIndex = [index];
                await this.nodeExpand({ index });
            }

            if (lessonId) {
                this.loadLesson(this.treeData[index], _.find(this.treeData[index]?.children, item => item.key === lessonId));
            }
        }
        this.updateBreadcrumb(chapterId, lessonId);
        this.isLoading.stop();
    }

    async nodeExpand({ index }) {
        let node = this.treeData[index];
        if (!node) return;
        if (node.childrenLoaded) return;
        node.loading.start();
        let listLessons = await new DGF.Query<Lesson>('lesson')
            .equalTo('subject', this.subject._id)
            .equalTo('chapter', node.key)
            .find();
        let arr = [];
        for (let item of listLessons || []) {
            arr.push({
                key: item._id,
                label: item.getFormattedValue('name'),
                type: 'lesson',
                record: item,
            });
        }
        node.children = arr;
        node.childrenLoaded = true;
        node.loading.stop();
        return arr;
    }

    loadLesson(chapterNode: any, lessonNode: any) {
        if (!lessonNode?.record) return;
        this.showType = 'lesson';
        this.currentLesson = lessonNode?.record;
        this.lessonDetails.loadDetails({
            lesson: lessonNode?.record,
            listLessons: _.map(chapterNode.children, item => item.record) || [],
        });
        this.updateBreadcrumb(chapterNode.key, lessonNode.key, true);
    }

    closeLesson() {
        this.showType = 'subject';
        this.updateBreadcrumb(null, null, true);
    }

    updateBreadcrumb(chapterId?: string, lessonId?: string, updateUrl = false) {
        let subjectUrl = `/pages/my-lessons/details/${this.subject._id}`;
        let subjectName = this.subject.getFormattedValue('name');
        let url = subjectUrl;
        const updateSubjectAndChapter = () => {
            if (!this.breadcrumbSubjectId) {
                this.breadcrumbSubjectId = this.breadCrumbService.addNewBreadcrumb(
                    subjectUrl,
                    subjectName
                );
            }
            else {
                this.breadCrumbService.updateById(this.breadcrumbSubjectId, {
                    routerLink: subjectUrl,
                    label: subjectName
                });
            }
        };
       

        if (chapterId) {
            let chapterUrl = `/pages/my-lessons/details/${this.subject._id}/${chapterId}`;
            let chapterName = _.find(this.listChapters, item => item.id === chapterId)?.getFormattedValue('name');
            url = chapterUrl;
            subjectUrl = chapterUrl;
            subjectName += ` - ${chapterName}`;
            updateSubjectAndChapter();
    
            if (lessonId) {
                let lessonUrl = chapterUrl + `/${lessonId}`;
                let lessonName = this.currentLesson?.getFormattedValue('name');
                url = lessonUrl;
                if (!this.breadcrumbLessonId) {
                    this.breadcrumbLessonId = this.breadCrumbService.addNewBreadcrumb(
                        lessonUrl,
                        lessonName
                    );
                }
                else {
                    this.breadCrumbService.updateById(this.breadcrumbLessonId, {
                        routerLink: lessonUrl,
                        label: lessonName
                    });
                }
            }
            else {
                if (this.breadcrumbLessonId) {
                    this.breadCrumbService.deleteById(this.breadcrumbLessonId);
                }
            }
        }
        else {
            updateSubjectAndChapter();
            if (this.breadcrumbLessonId) {
                this.breadCrumbService.deleteById(this.breadcrumbLessonId);
            }
        }

       

        if (updateUrl && url) {
            window.history.pushState({}, '', url);
        }
    }

}