import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable()
export class KeyBoardService {
    keyBoardSubject: Subject<boolean>;
    constructor() {
        this.keyBoardSubject = new BehaviorSubject(false);
        if (document.addEventListener) {
            document.addEventListener('keydown', (event: any) => {
                this.keyBoardSubject.next(event);
            });
        }
        else {
            (document as any).attachEvent('onkeydown', (event: any) => {
                this.keyBoardSubject.next(event);
            });
        }
    }

}
