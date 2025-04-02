import { Env } from '@env';
import _ from 'lodash';
import moment from 'moment';
import { FileUtils } from './file-utils';
import { LoadingVar } from './loading-var';
import { TimeCounter } from './time-counter';

export class Utils {
    static LoadingVar = LoadingVar;
    static TimeCounter = TimeCounter;
    static File = FileUtils;
    static guidIndex = 0;
    static themeVariables: any;

    static devLog(...arg: any[]) {
        if (Env.IS_PRODUCTION && !(window as any).isDebug) return;
        console.log(...arg);
    }

    static validate(type: 'phone' | 'email', value: string) {
        if (!value) return false;
        switch (type) {
            case 'phone':
                return new RegExp('^[0-9]{9,11}$').test(value);
            case 'email':
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value);
            default:
                break;
        }
        return true;
    }

    static mergeObject(defaultObj: any, specObject: any) {
        if (typeof specObject !== 'object') {
            return defaultObj;
        }
        if (typeof defaultObj !== 'object') {
            return specObject;
        }
        for (let prop in specObject) {
            if (typeof specObject[prop] === 'object' && defaultObj[prop]) {
                defaultObj[prop] = Utils.mergeObject(defaultObj[prop], specObject[prop]);
            }
            else {
                defaultObj[prop] = specObject[prop];
            }
        }
        return defaultObj;
    }

    static guid() {
        let id = (new Date().getTime().toString(16) + Math.random().toString(16).substr(2)).substr(2, 16);
        id += (Utils.guidIndex++) + '';
        return id;
    }

    static delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms || 0));
    }

    static scrollToElement(targetId: any, el?: any, customParams?: any) {
        el = el || document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest', ...(customParams || {}) });
    }

    static scrollToTopOfElement(containerId: any, el?: any) {
        el = el || document.getElementById(containerId);
        if (!el) return;
        el.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth',
        });
    }

    static fromOADate(msDate: number, getNumber = false): Date | number {
        let oaDate = new Date(Date.UTC(1899, 11, 30));
        const millisecondsOfaDay = 24 * 60 * 60 * 1000;
        let num = msDate * millisecondsOfaDay + oaDate.getTime();
        return getNumber ? num : new Date(num);
    }

    static setValue(
        target: any,
        path: any,
        value: any,
    ) {
        let currentValue = _.get(target, path);
        if (_.isObject(currentValue) && _.isObject(value) && !_.isArray(value)) {
            return _.set(target, path, { ...currentValue, ...value });
        }
        return _.set(target, path, value);
    }

    /**
     * 
     * @param arr Array of strings
     * @param separator default is ", "
     * @param prefixTemplate Ex: 'no. ' => '1. Item1, 2. Item2'
     * @returns 
     */
    static joinArrayToString(arr: Array<string>, separator = ', ', prefixTemplate = '') {
        let arrStr = _.filter(arr, str => !!str);
        if (prefixTemplate) {
            for (let i = 0; i < arrStr.length; i++) {
                let prefix = prefixTemplate.replace('index', i + '').replace('no', i + 1 + '');
                if (prefix) arrStr[i] = prefix + arrStr[i];
            }
        }
        return _.join(arrStr, separator);
    }

    static downloadObjectAsJson(exportObj: Record<string, any> | string, exportName: string) {
        exportName = exportName || 'data';
        let exportData;
        if (_.isObject(exportObj)) {
            exportData = JSON.stringify(exportObj);
        }
        else {
            exportData = exportObj;
        }
        let dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(exportData);
        let downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute('href', dataStr);
        downloadAnchorNode.setAttribute('download', exportName + '.json');
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }

    static uniqArray(inputArray: Array<any>, propKey?: string) {
        if (propKey) {
            return _.unionBy(_.filter(inputArray, item => item && item[propKey]), propKey);
        }
        else {
            return _.uniq(_.filter(inputArray, item => !!item));
        }
    }

    static formatDate(value: string | Date, hideTime = false) {
        if (!value) return '';
        const format = hideTime ? 'DD-MM-YYYY' : 'HH:mm DD-MM-YYYY';
        let m = moment(value);
        return m.isValid() ? m.format(format) : '';
    }

    static parseREMtoPX(rem: number) {
        if (!_.isNumber(rem)) rem = parseFloat(rem);
        return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
    }

    /**
     * Get text color base on brightness of background
     * @param backgroundColor hex color string
     * @returns text color: #000000 | #ffffff
     */
    static getTextColorByBGColor(backgroundColor: string, lightColor = '#ffffff', darkColor = '#000000') {
        const hexToRgb = function (hex: string) {
            if (_.startsWith(hex, 'rgb')) {
                let txt1 = hex.split('(')[1];
                let txt2 = (txt1 || '').split(')')[0];
                let result = (txt2 || '').split(',');
                return {
                    r: parseInt(result[0]),
                    g: parseInt(result[1]),
                    b: parseInt(result[2])
                };
            }
            let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : {};
        };
        let bgRGB: any = hexToRgb(backgroundColor || '#ffffff');
        let rawBrightness = ((parseInt(bgRGB.r) * 299) +
            (parseInt(bgRGB.g) * 587) +
            (parseInt(bgRGB.b) * 114));
        const brightness = rawBrightness !== 0 ? Math.round(rawBrightness / 1000) : 0;
        return (brightness > 125) ? darkColor : lightColor;
    }
}
