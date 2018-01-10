import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SampleComponent } from './sample/sample.component';
import { SampleService } from "./sample.service";

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [SampleComponent],
  providers: [SampleService],
  exports: [SampleComponent]
})
export class SampleModule { }
