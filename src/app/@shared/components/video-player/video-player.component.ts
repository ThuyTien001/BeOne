import { CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Utils } from '@app/@shared/utils';
import videojs from 'video.js';

@Component({
    selector: 'lms-video-player',
    templateUrl: 'video-player.component.html',
    standalone: true,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    styles: [`
        /* Make the video relative, instead of absolute, so that
        the parent container will size based on the video. Also,
        note the max-height rule. Note the line-height 0 is to prevent
        a small artifact on the bottom of the video.
        */
        :host ::ng-deep .video-js.vjs-fluid,
        :host ::ng-deep .video-js.vjs-16-9,
        :host ::ng-deep .video-js.vjs-4-3,
        :host ::ng-deep video.video-js,
        :host ::ng-deep video.vjs-tech {
            max-height: calc(100vh - 13rem);
            position: relative !important;
            height: auto !important;
            width: 100%;
            max-width: 100% !important;
            padding-top: 0 !important;
            line-height: 0;
        }

        /* Fix the control bar due to us resetting the line-height on the video-js */
        /* :host ::ng-deep .vjs-control-bar {
            line-height: 1;
        } */
    `],
})

export class VideoPlayerComponent implements OnInit, OnDestroy {
    @Input() url: string;
    @Output() ready = new EventEmitter();

    @ViewChild('target', { static: true }) target: ElementRef;

    player: any;

    constructor() { }

    ngOnInit() {
        this.init();
    }

    // Dispose the player OnDestroy
    ngOnDestroy() {
        this.dispose();
    }

    dispose() {
        if (this.player) {
            this.player.dispose();
        }
    }

    init() {
        if (this.player) return;
        this.player = videojs(
            this.target.nativeElement,
            {
                fluid: true,
                autoplay: false,
                sources: this.url ? [{ src: this.url, type: 'video/mp4' }] : [],
            },
            () => {
                this.ready.next(this);
            }
        );
    }

    changeSrc(url: string) {
        this.player.src({
            type: 'video/mp4',
            src: url || this.url,
        });
    }
}