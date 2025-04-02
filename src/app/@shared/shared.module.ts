import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
    ShareDataService,
    KeyBoardService,
} from '@services';

import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';

const COMMON_PRIME_MODULES = [
    ButtonModule,
];

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ...COMMON_PRIME_MODULES,
    ],
    declarations: [],
    exports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        ...COMMON_PRIME_MODULES,
    ]
})
export class SharedModule {
    static forRoot(): ModuleWithProviders<SharedModule> {
        return {
            ngModule: SharedModule,
            providers: [
                ShareDataService,
                KeyBoardService,
            ]
        };
    }
}
