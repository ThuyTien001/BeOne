import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DGF } from '@app/@shared/digiforce';
import { AvatarModule } from 'primeng/avatar';
import _ from 'lodash';
import { SharedModule } from '@app/@shared/shared.module';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'lms-avatar',
    standalone: true,
    imports: [
        AvatarModule,
        SharedModule,
    ],
    styles: [`
        :host ::ng-deep .full-size .p-avatar {
            width: 100%;
            height: 100%;
        }
        :host ::ng-deep .p-avatar {
            background-color: var(--surface-ground) !important;
        }
        :host ::ng-deep .p-avatar img {
            object-fit: cover !important;
        }
    `],
    template: `
        <p-avatar
            [ngClass]="{'full-size': fullSize}"
            [size]="size || 'large'"
            [shape]="shape || 'circle'"
            [image]="url"
            [label]="label" 
            [icon]="icon">
        </p-avatar>
    `
})

export class UserAvatarComponent implements OnInit {
    // @Input() userId: string;
    @Input() fullSize?: boolean;
    @Input() size?: string;
    @Input() shape?: string;
    @ViewChild('menu', { static: false }) menu: any;

    url: string;
    icon: string;
    label: string;
    isLoading = false;
    constructor() {
        DGF.Context.changeContext$
            .pipe(takeUntilDestroyed())
            .subscribe(() => this.loadData());
    }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.url = DGF.Context.getUserAvatarUrl();

        let fullName = _.get(DGF.Context.getUser(), 'name') || '';
        if (this.url) {
            this.icon = '';
            this.label = '';
        }
        else {
            if (!fullName) {
                this.label = 'U';
            }
            else {
                let arr = _.split(fullName, ' ');
                if (arr.length > 1) {
                    this.label = arr[0][0] + arr[arr.length - 1][0];
                }
                else {
                    this.label = arr[0][0];
                }
            }
            this.label = _.toUpper(this.label);
            if (!this.label) {
                this.icon = 'pi pi-user';
            }
        }
    }
}