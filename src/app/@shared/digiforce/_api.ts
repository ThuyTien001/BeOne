import axios from 'axios';
import _ from 'lodash';
import { DGFContext } from './_context';
import { DGFUtils } from './_utils';

export class DGFAPI {
    static async insert(objectName: string, data: any) {
        return await DGFAPI.post(`api/v4/${objectName}`, data || {});
    };

    static async update(objectName: string, id: string, data: any) {
        return await DGFAPI.request(
            'PUT',
            {
                path: `api/v4/${objectName}/${id}`,
                data: data || {}
            }
        );
    };

    static async delete(objectName: string, id: string) {
        return await DGFAPI.request('DELETE', { path: `api/v4/${objectName}/${id}` });
    };

    static async findOne(objectName: string, id: string, fields?: Array<string>) {
        if (fields) {
            return _.get(
                await DGFAPI.post('graphql', {
                    'query': `{record:${objectName}__findOne(id: "${id}"){${_.join(fields, ' ')}}}`
                }),
                'data.record'
            );
        }
        else {
            return await DGFAPI.get(`api/v4/${objectName}/${id}`, {});
        }
    };

    static async find(objectName: string, pipeline: any) {
        return _.get(
            await DGFAPI.post('api_lms/query', {
                objectName,
                pipeline,
            }),
            'records'
        );
    };

    static async request(
        method: 'GET' | 'POST' | 'PUT' | 'DELETE',
        params: { path: string, data?: any, headers?: any }
    ) {
        return _.get(
            await axios({
                method: method,
                url: DGFUtils.absoluteUrl(params.path),
                headers: {
                    'Content-Type': 'application/json',
                    'X-User-Id': DGFContext.getUserId(),
                    'X-Auth-Token': DGFContext.getAuthToken(),
                    ...(params.headers || {}),
                },
                data: JSON.stringify(params.data || {}),
            }),
            'data'
        );
    }

    static async requestWithFile(params: {
        path: string,
        file: File,
        data?: any,
        headers?: any,
    }) {
        let formData = new FormData();
        formData.append('file', params.file);
        for (let prop in params.data || {}) {
            formData.append(prop, params.data[prop]);
        }
        return _.get(
            await axios.post(
                DGFUtils.absoluteUrl(params.path),
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'X-User-Id': DGFContext.getUserId(),
                        'X-Auth-Token': DGFContext.getAuthToken(),
                        ...(params.headers || {}),
                    }
                }
            ),
            'data'
        );
    }

    // Alias for Common HTTP request ------------------------------------------

    static async put(url: string, data: any, headers?: any) {
        return await DGFAPI.request('PUT', { path: url, headers, data });
    }

    static async post(url: string, data: any, headers?: any) {
        return await DGFAPI.request('POST', { path: url, headers, data });
    }

    static async get(url: string, headers?: any) {
        return await DGFAPI.request('GET', { path: url, headers });
    }

}