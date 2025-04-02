import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { DGF } from '@app/@shared/digiforce';
import { DoExerciseDetailsComponent, ExerciseModule, ExerciseService } from '@app/@shared/modules';
import { BreadCrumbService } from '@app/@theme/services';

@Component({
    template: `
        <div class="animation-duration-500 fadein">
            <lms-do-exercise-details #detailsComponent
                (onClose)="goBack()">
            </lms-do-exercise-details>
        </div>
    `,
    standalone: true,
    imports: [
        ExerciseModule,
    ],
})

export class ViewDoExerciseComponent implements AfterViewInit {
    @ViewChild('detailsComponent', { static: false }) detailsComponent: DoExerciseDetailsComponent;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private exerciseService: ExerciseService,
        private breadCrumbService: BreadCrumbService,
    ) {

    }

    ngAfterViewInit(): void {
        this.route.paramMap.subscribe(async (map: any) => {
            let record = await this.exerciseService.formatDoExercise(
                await DGF.getRecord('doExercise', map.params.id)
            );
            this.detailsComponent.loadDetails(record);
            this.breadCrumbService.updateLabelOfLastBreadcrumb(record.getFormattedValue('name'));
            return;
        });
    }

    goBack() {
        this.router.navigateByUrl('/pages/do-exercises/list');
    }
}