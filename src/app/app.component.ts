import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNGConfig } from 'primeng/api';
import { Env } from 'src/env/env';
import _ from 'lodash';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'lms-root',
    template: `
        <router-outlet></router-outlet>
        <p-toast></p-toast>
    `,
})
export class AppComponent implements OnInit {

    constructor(
        private primengConfig: PrimeNGConfig,
        private translateService: TranslateService,
        private route: ActivatedRoute,
    ) { }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            if (params?.debug) (window as any).isDebug = true;
        });
        // Turn off Google Analytics of Video.js
        (window as any).HELP_IMPROVE_VIDEOJS = false;

        this.primengConfig.ripple = true;

        // Setup translate
        let defaultLang = Env.DEFAULT_LANGUAGE || 'en';
        let currentLang = localStorage.getItem('lang') || defaultLang;
        let listLang = Env.LANGUAGES || [];
        if (!_.includes(listLang, defaultLang)) listLang.push(defaultLang);
        if (!_.includes(listLang, currentLang)) currentLang = defaultLang;
        this.translateService.addLangs(listLang);
        this.translateService.use(currentLang);

        this.translateService.get('primeng').subscribe(res => this.primengConfig.setTranslation(res));
    }
}
