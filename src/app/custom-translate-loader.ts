import { HttpClient } from '@angular/common/http';
import { TranslateLoader } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import _ from 'lodash';

export class MojoTranslateLoader implements TranslateLoader {
    ListFolderNames = [
        'primeng',
        'auth',
    ];

    constructor(
        private http: HttpClient,
        public prefix: string = '/i18n/',
        public suffix: string = '.json'
    ) { }

    /**
     * Gets the translations from the server
     */
    public getTranslation(lang: string): Observable<Record<string, any>> {
        (window as any).mojo_translate_loaded = false;
        return new Observable(subscriber => {
            let arr = [];
            let getPromise = (url: string) => {
                // If load failed then return {} to avoid break all translate text
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                return new Promise((resolve, reject) => {
                    this.http.get(url).toPromise()
                        .then(r => resolve(r))
                        .catch(e => {
                            console.warn('Load translate file failed', e);
                            resolve({});
                        });
                });
            };
            arr.push(getPromise(`${this.prefix}${lang}${this.suffix}`));
            Promise.all(arr)
                .then(r => {
                    let result = {};
                    for (let obj of r) {
                        result = this.mergeJson(result, obj);
                    }
                    subscriber.next(result);
                    subscriber.complete();
                    (window as any).mojo_translate_loaded = true;
                })
                .catch(err => {
                    console.log('Load translation error', err);
                    subscriber.next({});
                    subscriber.complete();
                    (window as any).mojo_translate_loaded = true;
                });
        });
    }

    private mergeJson(json1: any, json2: any) {
        if (!json1) return json2 || {};
        if (!json2) return json1 || {};

        for (let prop in json2) {
            if (_.isObject(json2[prop]) && _.isObject(json1[prop])) {
                json1[prop] = this.mergeJson(json1[prop], json2[prop]);
            }
            else {
                json1[prop] = json2[prop] || '';
            }
        }
        return json1;
    }
}
