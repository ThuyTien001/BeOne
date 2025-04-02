import { DGFAPI } from './_api';
import _ from 'lodash';
import { DGFQuery } from './query';

export interface BaseDoc {
    _id?: string;
    created?: string;
    modified?: string;
    space?: string;
}

export interface Doc extends BaseDoc {
    [key: string]: any
}

export class DGFRecord<T>{
    objectName!: string;
    rootDocument!: Doc;
    _formatted: any = {};

    constructor(objectName: string, doc?: T) {
        this.objectName = objectName;
        this.assignDoc(doc as any || {});
    }

    setFormattedValue(field: keyof (BaseDoc & T), value: any) {
        this._formatted[field as string] = value;
    }

    getFormattedValue(field: keyof (BaseDoc & T) | string) {
        return this._formatted[field as string] || this.get(field as any);
    }

    assignDoc(doc: any) {
        this.rootDocument = {
            ...this.rootDocument,
            ...doc
        };
    }

    async save() {
        try {
            delete this.rootDocument['__include'];
            const doc: Doc = {
                ...this.rootDocument
            };
            if (!this.id) {
                this.assignDoc(await DGFAPI.insert(this.objectName, doc));
            } else {
                this.assignDoc(await DGFAPI.update(this.objectName, this.id, doc));
            }
            return this;
        }
        catch (err: any) {
            throw {
                code: 400,
                message: 'Save object failed',
                error: err.message,
                doc: this
            };
        }
    }

    async delete() {
        return await DGFAPI.delete(this.objectName, this.id);
    }

    get<U>(field: keyof (BaseDoc & T)): U {
        try {
            if (this.rootDocument?.['__include'] && this.rootDocument?.['__include'][field]) {
                return this.rootDocument?.['__include'][field];
            }
            return this.rootDocument[field as string];
        }
        catch (err) {
            return null as any;
        }
    }

    getInclude<U>(field: keyof (BaseDoc & T), objectName: string): DGFRecord<U> {
        if (this.rootDocument?.['__include'] && this.rootDocument?.['__include'][field]) {
            return new DGFRecord(objectName, this.rootDocument?.['__include'][field]) as DGFRecord<U>;
        }
        return new DGFRecord(objectName, {
            _id: this.rootDocument[field as string]
        }) as DGFRecord<U>;
    }

    setInclude<U>(field: keyof (BaseDoc & T), record: DGFRecord<U>) {
        _.set(this.rootDocument, `__include[${_.toString(field)}]`, record);
    }

    async fetchInclude<U>(
        field: keyof (BaseDoc & T),
        objectName: string,
        multiple: boolean,
    ): Promise<DGFRecord<U> | Array<DGFRecord<U>>> {
        let cache = _.get(this.rootDocument, `__include[${_.toString(field)}]`);

        if (!cache) {
            let value = this.rootDocument[field as string];
            let record;
            if (value) {
                if (multiple) {
                    record = await new DGFQuery(objectName)
                        .containedIn('_id', value)
                        .find();
                }
                else {
                    record = new DGFRecord(objectName, value);
                    await record.fetch();
                }
            }
            this.setInclude(field, record);
            cache = record;
        }
        return cache;
    }

    set(field: keyof (BaseDoc & T), value: any) {
        this.rootDocument[field as any] = value;
    }

    get _id(): string {
        return this.get('_id');
    }

    set _id(val: string) {
        this.set('_id', val);
    }

    get id(): string {
        return this.get('_id');
    }

    set id(val: string) {
        this.set('_id', val);
    }

    get created(): Date {
        return this.get('created');
    }

    set created(val: Date) {
        this.set('created', val);
    }

    get modified(): Date {
        return this.get('modified');
    }

    set modified(val: Date) {
        this.set('modified', val);
    }

    get space(): string {
        return this.get('space');
    }

    set space(val: string) {
        this.set('space', val);
    }

    toJson() {
        return this.rootDocument as T;
    }

    get object() {
        return this.rootDocument as T;
    }

    async fetch() {
        this.assignDoc(await DGFAPI.findOne(this.objectName, this.id));
        return this;
    }

    static async saveAll<T>(DGFObjects: Array<DGFRecord<T>>) {
        return await Promise.all(DGFObjects.map(object => object.save()));
    }

    static async deleteAll(DGFObjects: Array<DGFRecord<any>>) {
        return await Promise.all(DGFObjects.map(object => object.delete()));
    }
}