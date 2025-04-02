import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Env } from '@env';

@Component({
    selector: 'lms-side-btn-group',
    standalone: true,
    imports: [CommonModule],
    styleUrls: ['./side-btn-group.component.scss'],
    templateUrl: './side-btn-group.component.html',
})

export class SideBtnGroupComponent implements OnInit {
    phoneNumber = Env.ZALO?.PHONE_NUMBER;

    isShowZaloBtn = Env.ZALO?.ENABLE && Env.ZALO?.PHONE_NUMBER;
    isShowPhoneBtn = !!Env.ZALO?.PHONE_NUMBER;
    isShowMessegerBtn = !!Env.FACEBOOK?.ENABLE;

    zaloLabel = '';
    zaloHoverLabel = 'Chat Ngay';
    zaloUrl = '';

    phoneUrl = '';

    constructor() { }

    ngOnInit() {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            this.zaloUrl = `https://zalo.me/${this.phoneNumber}`;
        }
        else {
            this.zaloUrl = `https://chat.zalo.me/?phone=${this.phoneNumber}`;
        }
        this.phoneUrl = `tel:${this.phoneNumber}`;
        setTimeout(() => {
            this.loadMesseger();
        }, 200);
    }

    loadMesseger() {
        if (this.isShowMessegerBtn) {
            // Codes below come from Facebook Businness
            let chatbox = document.getElementById('fb-customer-chat');
            chatbox.setAttribute('page_id', Env.FACEBOOK?.PAGE_ID);
            chatbox.setAttribute('attribution', 'biz_inbox');

            (window as any).fbAsyncInit = function () {
                (window as any).FB.init({
                    xfbml: true,
                    version: 'v16.0'
                });
            };

            (function (d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) return;
                js = d.createElement(s); js.id = id;
                js.src = Env.FACEBOOK?.SCRIPT_URL;
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));
        }
    }
}