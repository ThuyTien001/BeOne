import _ from 'lodash';
import { Injectable } from '@angular/core';
import { DGF } from '@app/@shared/digiforce';
import { Grade } from '@app/@shared/models';

@Injectable()
export class ShareDataService {
    data: { [key: string]: any };

    constructor() {
        this.data = {};
    }

    setData(key: string, value: any) {
        if (key) {
            this.data[key] = value;
        }
    }

    getData(key: string, clearData?: boolean) {
        if (!key) {
            return null;
        }
        if (clearData) {
            let data = _.cloneDeep(this.data[key]);
            this.data[key] = undefined;
            return data;
        }
        else {
            return _.cloneDeep(this.data[key]);
        }
    }

    async getListGrades() {
        let cache = this.getData('_cache_listGrades');
        if (!cache) {
            let q = new DGF.Query<Grade>('grade').addAscending(['order_number']);
            cache = _.map(await q.find(), record => ({
                record: record,
                value: record.id,
                label: record.get('name'),
            }));
            this.setData('_cache_listGrades', cache);
        }
        return cache || [];
    }

    async getListSemesters() {
        let cache = this.getData('_cache_listSemesters');
        if (!cache) {
            let q = new DGF.Query<Grade>('semesters').addAscending(['order_number']);
            cache = _.map(await q.find(), record => ({
                record: record,
                value: record.id,
                label: record.get('name'),
            }));
            this.setData('_cache_listSemesters', cache);
        }
        return cache || [];
    }

    async getListSubjects() {
        let cache = this.getData('_cache_listSubjects');
        if (!cache) {
            let q = new DGF.Query<Grade>('subjects');
            cache = _.map(await q.find(), record => ({
                record: record,
                value: record.id,
                label: record.get('name'),
            }));
            this.setData('_cache_listSubjects', cache);
        }
        return cache || [];
    }
}
