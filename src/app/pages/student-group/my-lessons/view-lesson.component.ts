import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DGF } from '@app/@shared/digiforce';
import { Subject } from '@app/@shared/models';
import { LessonModule, SubjectDetailsComponent } from '@app/@shared/modules';
import { BreadCrumbService } from '@app/@theme/services';

@Component({
    template: `
        <div class="animation-duration-500 fadein">
            <lms-subject-details #detailsComponent
                (onClose)="goBack()">
            </lms-subject-details>
        </div>
    `,
    standalone: true,
    imports: [
        LessonModule,
    ],
})

export class ViewLessonComponent implements AfterViewInit {
    @ViewChild('detailsComponent', { static: false }) detailsComponent: SubjectDetailsComponent;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private breadCrumbService: BreadCrumbService,
    ) { }

    ngAfterViewInit(): void {
        this.route.paramMap.subscribe(async (map: any) => {
            const params = map.params || {};
            let record = await DGF.getRecord<Subject>('subjects', params.subjectId);
            this.detailsComponent.loadDetails(record, params.chapterId, params.lessonId);
            return;
        });
    }

    goBack() {
        this.router.navigateByUrl('/pages/my-lessons/list');
    }
}