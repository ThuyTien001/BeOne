import _ from 'lodash';
import FileSaver from 'file-saver';

export class FileUtils {

    static formatFileSize(byteCount: number): string {
        let n = _.clone(byteCount || 0);
        for (let unit of ['B', 'KB', 'MB']) {
            if (n >= 1024) {
                n /= 1024.0;
            }
            else {
                return n.toFixed(2) + unit;
            }
        }
        return n.toFixed(2) + 'MB';
    }

    static formatFileName(fileName: string, removeExtension?: string): string {
        fileName = fileName || '';
        let ext = FileUtils.getFileExtension(fileName);
        let name = fileName.substring(fileName.lastIndexOf('/') + 1);
        name = name.substring(0, name.lastIndexOf('.'));
        if (name.length > 100) {
            name = name.substring(0, 100);
        }
        return removeExtension ? name : `${name}.${ext}`;
    }


    static getFileExtension(fileName: string) {
        let arr = fileName.split('.');
        return _.toLower(arr.length > 1 ? arr[arr.length - 1] : '');
    }

    static getBase64FromImageUrl(url: string) {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();

            xhr.responseType = 'arraybuffer';
            xhr.open('GET', url);

            xhr.onload = function () {
                let base64, binary, bytes, mediaType;

                bytes = new Uint8Array(xhr.response);
                // NOTE String.fromCharCode.apply(String, ... may cause "Maximum call stack size exceeded"
                binary = [].map.call(bytes, function (byte) {
                    return String.fromCharCode(byte);
                }).join('');
                mediaType = xhr.getResponseHeader('content-type');
                base64 = [
                    'data:',
                    mediaType ? mediaType + ';' : '',
                    'base64,',
                    btoa(binary)
                ].join('');
                resolve(base64);
            };
            xhr.onerror = reject;
            xhr.send();
        });
    }

    static getBase64FromFile(file: File) {
        return new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function () {
                resolve(reader.result);
            };
            reader.onerror = function (error) {
                console.log('getBase64FromFile error: ', error);
                reject(error);
            };
        });
    }

    static downloadFile(fileUrl: string, fileName?: string) {
        // If we need to save really large files bigger than the blob's size limitation
        // or don't have enough RAM, then have a look at the more advanced StreamSaver.js
        // Browser  |   Max Blob Size
        // Chrome   |   2GB
        // Firefox  |   800MB
        // Opera    |   500MB
        FileSaver.saveAs(fileUrl, fileName || FileUtils.formatFileName(fileUrl));
    }
}
