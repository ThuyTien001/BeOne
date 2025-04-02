import { ModuleWithProviders, NgModule } from '@angular/core';
import {
    MathjaxDefaultConfig,
    mathjax_url,
    RootMathjaxConfig,
} from './models';
import { MathjaxDirective } from './directive';
import { MathjaxFormatPipe } from './pipes/mathjax-format.pipe';

@NgModule({
    declarations: [
        MathjaxDirective,
        MathjaxFormatPipe,
    ],
    exports: [
        MathjaxDirective,
        MathjaxFormatPipe,
    ],
})
export class MathjaxModule {
    constructor(private moduleConfig: RootMathjaxConfig) {
        this.addConfigToDocument();
        this.addMathjaxToDocument();
    }

    private addConfigToDocument() {
        const tagId = 'mathjax-config-script';
        const isScript = document.getElementById(tagId);
        if (isScript) return;
        const providConfig = {
            ...MathjaxDefaultConfig,
            ...(this.moduleConfig?.config ?? {}),
        };

        const script = document.createElement('script') as HTMLScriptElement;
        script.id = tagId;
        script.type = 'text/javascript';
        script.text = `
            MathJax = ${JSON.stringify(providConfig)};
            MathJax.isReady = false;
            MathJax.promise = new Promise(function (resolve, reject) {
                MathJax.startup = {
                    ready() {
                    MathJax.isReady = true;
                    MathJax.startup.defaultReady();
                    MathJax.startup.promise.then(() => resolve());
                    }
                };
            });
        `;
        document.getElementsByTagName('head')[0].appendChild(script);
    }

    private addMathjaxToDocument() {
        const tagId = 'mathjax-script';
        const isScript = document.getElementById(tagId);
        if (isScript) return;
        const script = document.createElement('script') as HTMLScriptElement;
        script.id = tagId;
        script.type = 'text/javascript';
        script.src = this.moduleConfig?.src ?? mathjax_url;
        script.async = true;
        document.getElementsByTagName('head')[0].appendChild(script);
    }

    public static forRoot(
        config?: RootMathjaxConfig
    ): ModuleWithProviders<MathjaxModule> {
        return {
            ngModule: MathjaxModule,
            providers: [{ provide: RootMathjaxConfig, useValue: config ?? {} }],
        };
    }
}
