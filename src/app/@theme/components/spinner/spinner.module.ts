import { NgModule } from '@angular/core';
import { SpinnerComponent } from './spinner.component';
import { SpinnerDirective } from './spinner.directive';


@NgModule({
  imports: [],
  exports: [SpinnerComponent, SpinnerDirective],
  declarations: [SpinnerComponent, SpinnerDirective],
})
export class SpinnerModule {}
