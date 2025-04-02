import { Env } from '@env';
import _ from 'lodash';

export class DGFUtils {
    static absoluteUrl(url: string) {
        if (!_.startsWith(url, '/')) {
            url = '/' + (url || '');
        }
        return new URL(Env.API.SERVER_URL).origin + url;
    }

    static parseFileUrl(id: string, isImage = false) {
        return id
            ? new URL(Env.API.SERVER_URL).origin + `/api/files/${isImage ? 'images' : 'files'}/` + id
            : '';
    }
};