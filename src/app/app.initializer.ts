import { APP_INITIALIZER } from '@angular/core';
import { DGF } from './@shared/digiforce';
import moment from 'moment';
import _ from 'lodash';

export function init_app() {
    moment.locale('vi');
    return async () => {
        try {
            await DGF.init();
            (window as any).DGF = DGF;
        } catch (error) {
            console.log('load config error', error);
        }
    };
}

export const AppInitializer = {
    provide: APP_INITIALIZER,
    useFactory: init_app,
    deps: [],
    multi: true
};
