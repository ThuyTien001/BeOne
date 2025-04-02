import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import _ from 'lodash';

export type MessageConfig = string | {
    title?: string;
    message?: string;
    messageKey?: string;
    variables?: any; // Message Variables
};

/**
 * AlertMessageService
 *  Use to get translated alert message (success, error text or something else...)
 */
@Injectable()
export class AlertMessageService {
    constructor(
        private translateService: TranslateService,
        private messageService: MessageService,
    ) { }

    clear() {
        this.messageService.clear();
    }

    getMessage(messageKey: string, messageParams?: any): string {
        return this.translateService.instant(messageKey, messageParams);
    }

    toast(
        toastType: 'success' | 'error' | 'warn' | 'info',
        msg: MessageConfig
    ) {
        let content = _.isString(msg)
            ? this.getMessage(msg)
            : msg.messageKey
                ? this.getMessage(msg.messageKey, msg.variables)
                : msg.message;
        let severity = 'info';
        let summary = this.translateService.instant('core.toast.title_info');
        switch (toastType) {
            case 'success':
                severity = 'success';
                summary = this.translateService.instant('core.toast.title_success');
                break;
            case 'warn':
                severity = 'warn';
                summary = this.translateService.instant('core.toast.title_warning');
                break;
            case 'error':
                severity = 'error';
                summary = this.translateService.instant('core.toast.title_error');
                break;
            case 'info':
            default:
                severity = 'info';
                summary = this.translateService.instant('core.toast.title_default');
                break;
        }
        this.messageService.add({
            severity,
            summary: (msg as any)?.title || summary,
            detail: content,
        });
    }

    // ------------------------------------------------------------------------
    // Alias
    // ------------------------------------------------------------------------

    success(msg: MessageConfig) {
        this.toast('success', msg);
    }

    warn(msg: MessageConfig) {
        this.toast('warn', msg);
    }

    info(msg: MessageConfig) {
        this.toast('info', msg);
    }

    error(msg: MessageConfig) {
        this.toast('error', msg);
    }
}
