import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DGF } from '@app/@shared/digiforce';
import { Exercise } from '@app/@shared/models';
import { ExerciseDetailsComponent, ExerciseModule } from '@app/@shared/modules';
import { BreadCrumbService } from '@app/@theme/services';

@Component({
    template: `
        <div class="animation-duration-500 fadein">
            <lms-exercise-details #detailsComponent
                (onClose)="goBack()">
            </lms-exercise-details>
        </div>
    `,
    standalone: true,
    imports: [
        ExerciseModule,
    ],
})

export class ViewExerciseComponent implements AfterViewInit {
    @ViewChild('detailsComponent', { static: false }) detailsComponent: ExerciseDetailsComponent;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private breadCrumbService: BreadCrumbService,
    ) { }

    ngAfterViewInit(): void {
        this.route.paramMap.subscribe(async (map: any) => {
            let record = await DGF.getRecord<Exercise>('exercise', map.params.id);
            this.detailsComponent.loadDetails(record);
            this.breadCrumbService.updateLabelOfLastBreadcrumb(record.getFormattedValue('name'));
            return;
        });
    }

    goBack() {
        this.router.navigateByUrl('/pages/exercises/list');
    }
}