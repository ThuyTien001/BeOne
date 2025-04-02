import { Component } from '@angular/core';

@Component({
  selector: 'lms-spinner',
  template: `
    <div class="lms-roller">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    </div>
  `,
  styleUrls: ['./spinner.component.scss'],
})
export class SpinnerComponent {
  constructor() { }
}
