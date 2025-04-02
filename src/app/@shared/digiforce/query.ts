import { PipelineBuilder } from 'mongodb-pipeline-builder';
import {
    Expression, Equal, NotEqual, GreaterThan, GreaterThanEqual, LessThan, LessThanEqual, ArrayElemAt, In, Not
} from 'mongodb-pipeline-builder/operators';
import { EqualityPayload, Field } from 'mongodb-pipeline-builder/helpers';
import { BaseDoc, DGFRecord } from './record';
import { DGFAPI } from './_api';
import _ from 'lodash';

export class DGFQuery<T> {
    static updateCacheCallback: Function;
    objectName!: string;
    pipelineBuilder!: PipelineBuilder;
    debug = false;

    constructor(objectName: string, debug?: boolean) {
        this.objectName = objectName;
        this.pipelineBuilder = new PipelineBuilder(
            'pipeline_' + Math.ceil(Math.random() * 1000000),
            { debug }
        );
        this.debug = debug || false;
    }

    get pipeline() {
        try {
            if (this.debug) {
                console.log(JSON.stringify(this.pipelineBuilder.getPipeline()));
            }
            return this.pipelineBuilder.getPipeline() || [];
        } catch (err: any) {
            if (err.message?.indexOf('pipeline is empty') === -1) {
                throw err;
            }
            return [];
        }
    }

    makeObject(objectName: string, doc: any) {
        return new DGFRecord<T>(objectName, doc);
    }

    async find(): Promise<Array<DGFRecord<T>>> {
        const docs: Array<any> = await DGFAPI.find(this.objectName, this.pipeline);
        let listRecords = docs.map(doc => this.makeObject(this.objectName, doc));
        if (DGFQuery.updateCacheCallback) DGFQuery.updateCacheCallback(this.objectName, listRecords);
        return listRecords;
    }

    async first(): Promise<DGFRecord<any> | null> {
        this.limit(1);
        const docs: Array<any> = await DGFAPI.find(this.objectName, this.pipeline);
        let raw = docs[0];
        if (raw) {
            let record = this.makeObject(this.objectName, raw);
            if (DGFQuery.updateCacheCallback) DGFQuery.updateCacheCallback(this.objectName, record);
            return record;
        }
        else {
            return null;
        }
    }

    // ------------------------------------------------------------------------
    // Conditions
    // ------------------------------------------------------------------------

    select(fields: Array<string>) {
        const project: { [key: string]: any } = {};
        fields.forEach(field => project[field] = true);
        this.pipelineBuilder.Project(project);
        return this;
    }

    equalTo(field: keyof (BaseDoc & T), value: any) {
        this.pipelineBuilder.Match(Expression(Equal(`$${field as string}`, value)));
        return this;
    }

    notEqualTo(field: keyof (BaseDoc & T), value: any) {
        this.pipelineBuilder.Match(Expression(NotEqual(`$${field as string}`, value)));
        return this;
    }

    exists(field: keyof (BaseDoc & T)) {
        this.pipelineBuilder.Match({
            [field]: {
                $exists: true
            }
        });
        return this;
    }

    doesNotExist(field: keyof (BaseDoc & T)) {
        this.pipelineBuilder.Match({
            [field]: {
                $exists: false
            }
        });
        return this;
    }

    greaterThan(field: keyof (BaseDoc & T), value: any) {
        this.pipelineBuilder.Match(Expression(GreaterThan(`$${field as string}`, value)));
        return this;
    }

    greaterThanOrEqualTo(field: keyof (BaseDoc & T), value: any) {
        this.pipelineBuilder.Match(Expression(GreaterThanEqual(`$${field as string}`, value)));
        return this;
    }

    lessThan(field: keyof (BaseDoc & T), value: any) {
        this.pipelineBuilder.Match(Expression(LessThan(`$${field as string}`, value)));
        return this;
    }

    lessThanOrEqualTo(field: keyof (BaseDoc & T), value: any) {
        this.pipelineBuilder.Match(Expression(LessThanEqual(`$${field as string}`, value)));
        return this;
    }

    include(field: keyof (BaseDoc & T), from: string) {
        this.pipelineBuilder.Lookup(EqualityPayload(from, `__include_${field as string}`, field as string, '_id'));
        this.pipelineBuilder.AddFields(Field(`__include.${field as string}`, ArrayElemAt(`$__include_${field as string}`, 0)));
        this.pipelineBuilder.Project({
            [`__include_${field as string}`]: 0
        });
        return this;
    }

    matchesQuery(field: keyof (BaseDoc & T), query: any, matchFromField?: string) {
        this.pipelineBuilder.Lookup({
            from: query.name,
            as: `__matches_${field as string}`,
            let: {
                [`${field as string}_match_id`]: `$${field as string}`
            },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $eq: [
                                `$${matchFromField || '_id'}`,
                                `$$${field as string}_match_id`
                            ]
                        }
                    }
                },
                ...query.pipeline
            ]
        });
        (this.pipelineBuilder as any).stageList.push({
            $match: {
                $expr: {
                    $gt: [
                        {
                            $size: `$__matches_${field as string}`
                        },
                        0
                    ]
                }
            }
        });
        this.pipelineBuilder.Project({
            [`__matches_${field as string}`]: 0
        });
        return this;
    }

    containedIn(field: keyof (BaseDoc & T), values: Array<any>) {
        this.pipelineBuilder.Match(Expression(In(`$${field as string}`, values)));
        return this;
    }

    notContainedIn(field: keyof (BaseDoc & T), values: Array<any>) {
        this.pipelineBuilder.Match(Expression(Not(In(`$${field as string}`, values))));
        return this;
    }

    contains(field: keyof (BaseDoc & T), value: string, sensitiveCase = false) {
        this.pipelineBuilder.Match(
            {
                [field]: sensitiveCase ? { $regex: value } : `regexContent__${value}`
            }
        );
        return this;
    }

    // ------------------------------------------------------------------------
    // Sort
    // ------------------------------------------------------------------------

    addAscending(fields: Array<keyof (BaseDoc & T)>) {
        this.pipelineBuilder.Sort(...fields.map(field => {
            return {
                [field]: 1
            };
        }));
        return this;
    }

    addDescending(fields: Array<keyof (BaseDoc & T)>) {
        this.pipelineBuilder.Sort(...fields.map(field => {
            return {
                [field]: -1
            };
        }));
        return this;
    }

    // ------------------------------------------------------------------------
    // Paging
    // ------------------------------------------------------------------------

    paging(perPage: number, page: number) {
        if (this.pipeline.length === 0) {
            this.notEqualTo('_id' as any, null);
        }
        this.pipelineBuilder.Paging(perPage, page);
        return this;
    }

    async getPagingResult() {
        const res = await DGFAPI.find(this.objectName, this.pipeline);
        let docs = _.get(res, '[0].docs') || [];
        let count = _.get(res, '[0].count[0].totalElements') || 0;
        let records = docs.map((doc: any) => this.makeObject(this.objectName, doc));
        if (DGFQuery.updateCacheCallback) DGFQuery.updateCacheCallback(this.objectName, records);
        return { records: records, count };
    }

    skip(value: number) {
        if (value) this.pipelineBuilder.Skip(value);
        return this;
    }

    limit(value: number) {
        this.pipelineBuilder.Limit(value);
        return this;
    }

    // ------------------------------------------------------------------------
    // Relation Expressions
    // ------------------------------------------------------------------------

    static or<T>(queries: Array<DGFQuery<T>>) {
        const orCondition: Array<any> = [];
        if (queries.filter(item => item.objectName === queries[0].objectName).length != queries.length) {
            throw Error('The name should be same');
        }
        queries.forEach(query => {
            orCondition.push({
                '$and': query.pipeline.map((item: any) => item.$match).filter((item: any) => item)
            });
        });
        const query = new DGFQuery<T>(queries[0].objectName);
        (query.pipelineBuilder as any).stageList = [
            {
                '$match': {
                    '$or': orCondition
                }
            }
        ];
        return query;
    }
}