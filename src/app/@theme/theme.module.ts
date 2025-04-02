import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { CapitalizePipe, RoundPipe, TimingPipe, NumberWithCommasPipe } from './pipes';
import { TranslateModule } from '@ngx-translate/core';
import { AutomaticTextColorDirective } from './directives';
import { BreadCrumbService, LayoutService, MenuService } from './services';
import { FileSizePipe } from './pipes/file-size.pipe';


const PIPES = [CapitalizePipe,  RoundPipe, TimingPipe, NumberWithCommasPipe, FileSizePipe];
const DIRECTIVES = [AutomaticTextColorDirective];

@NgModule({
    imports: [CommonModule, TranslateModule],
    exports: [CommonModule, ...PIPES, ...DIRECTIVES],
    declarations: [ ...PIPES, ...DIRECTIVES],
})
export class ThemeModule {
    static forRoot(): ModuleWithProviders<ThemeModule> {
        return {
            ngModule: ThemeModule,
            providers: [
                LayoutService,
                MenuService,
                BreadCrumbService,
            ],
        };
    }
}
