import { Component, ElementRef, OnInit } from '@angular/core';
import { LayoutService } from '@app/@theme/services';
import { MENU_FOR_TEACHER, MENU_ITEMS } from '../menu-items';
import { DGF } from '@app/@shared/digiforce';
import _ from 'lodash';

@Component({
    selector: 'lms-sidebar',
    styleUrls: ['./sidebar.component.scss'],
    templateUrl: './sidebar.component.html'
})
export class AppSidebarComponent implements OnInit {
    menuItems: any = [];
    userDisplayName = '';
    userPosition = '';

    constructor(public layoutService: LayoutService, public el: ElementRef) { }

    ngOnInit(): void {
        this.userDisplayName = _.get(DGF.Context.getUser(), 'name') || '';

        let userRole = DGF.Context.getUserLMSRole();
        if (userRole === 'teacher') {
            this.userPosition = 'Giáo Viên';
            this.menuItems = [{ label: '1', items: MENU_FOR_TEACHER }];
        }
        else {
            this.userPosition = 'Học Sinh';
            this.menuItems = [{ label: '1', items: MENU_ITEMS }];
        }
    }

}

