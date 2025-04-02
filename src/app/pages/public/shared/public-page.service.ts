import { Injectable } from '@angular/core';
import { DGF } from '@app/@shared/digiforce';
import { ExtracurricularType } from '@app/@shared/models/center';
import { TranslateService } from '@ngx-translate/core';
import moment from 'moment';

@Injectable()
export class PublicPageService {
    constructor(private translateService: TranslateService) { }

    formatPostData(postData: any) {
        let tag = postData.tag;
        return {
            id: postData._id,
            thumbnail: DGF.Utils.parseFileUrl(postData.thumbnail, true),
            title: postData.name,
            description: postData.description,
            content: postData.content,
            publishDate: postData.publishDate
                ? moment(postData.publishDate).format(
                    this.translateService.currentLang === 'vi'
                        ? '[Ngày] DD [Tháng] MM [Năm] YYYY'
                        : 'LL'
                )
                : '',
            tag: tag,
            tagLabel: this.getExtracurricularTypeLabel(tag),
        };
    }

    getExtracurricularTypeLabel(t: ExtracurricularType) {
        return {
            [ExtracurricularType.Incoming]: 'Sắp diễn ra',
            [ExtracurricularType.Tips]: 'Bí quyết',
            [ExtracurricularType.Info]: 'Tin tức',
        }[t] || '';
    }
}
