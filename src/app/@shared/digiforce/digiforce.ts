import { Env } from '@env';
import _ from 'lodash';
import { DGFContext } from './_context';
import { DGFUtils } from './_utils';
import { DGFAPI } from './_api';
import { DGFAuth } from './_auth';
import { DGFQuery } from './query';
import { DGFRecord } from './record';
import { Utils } from '../utils';

const getNameFromRecord = (record: any, fieldName = 'name') => {
    if (!record) return '';
    let temp = '';
    if (_.isFunction(record.get)) {
        temp = record.get(fieldName);
    }
    return temp || _.get(record, 'rootDocument.' + fieldName) || _.get(record, fieldName) || null;
};


export class DGF {
    static API = DGFAPI;
    static Auth = DGFAuth;
    static Context = DGFContext;
    static Utils = DGFUtils;
    static Query = DGFQuery;
    static Record = DGFRecord;
    static defaultSpaceId = Env.API.DEFAULT_SPACE;

    static async init(): Promise<void> {
        DGF.Context.initContext();
        await DGF.Auth.validate();
        Utils.devLog('Digiforce Init Context DONE --------------------------', DGF.Context.getUser());
    }

    // ------------------------------------------------------------------------
    // Cache Records
    // ------------------------------------------------------------------------

    static Caches: {
        _cacheRecords: Record<string, any>,
        _cacheRecordNames: Record<string, any>,
    } = { _cacheRecords: {}, _cacheRecordNames: {}, };

    static updateCache(objectName: string, data: any, fieldName = 'name') {
        if (!DGF.Caches._cacheRecords[objectName]) {
            DGF.Caches._cacheRecords[objectName] = {};
        }
        if (!_.isArray(data)) {
            data = [data];
        }
        for (let item of data) {
            let id = item.id || item._id;
            if (!id) continue;
            _.set(DGF.Caches._cacheRecords, `[${objectName}][${id}]`, item || null);
            _.set(DGF.Caches._cacheRecordNames, `[${objectName}][${id}]`, getNameFromRecord(item, fieldName) || null);
        }
    }

    static async getRecord<T>(
        objectName: string,
        id: string,
        fetchIfNeeded = true
    ): Promise<DGFRecord<T> | null> {
        if (!id || !objectName) return null;
        let record = _.get(DGF.Caches._cacheRecords, `[${objectName}][${id}]`);
        if (record === undefined && fetchIfNeeded) {
            record = await new DGFQuery<T>(objectName)
                .equalTo('_id', id)
                .first();
            _.set(DGF.Caches._cacheRecords, `[${objectName}][${id}]`, record || null);
            _.set(DGF.Caches._cacheRecordNames, `[${objectName}][${id}]`, getNameFromRecord(record) || null);
        }
        return record;
    }

    static async getRecordName(objectName: string, id: string, fetchIfNeeded = true) {
        if (!id || !objectName) return '';
        await DGF.getRecord(objectName, id, fetchIfNeeded);
        return DGF.Caches._cacheRecordNames[objectName][id] || '';
    }

}

DGFQuery.updateCacheCallback = DGF.updateCache;