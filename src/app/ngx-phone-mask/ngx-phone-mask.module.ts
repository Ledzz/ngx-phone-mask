import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPhoneMaskDirective } from './ngx-phone-mask.directive';

@NgModule({
  	imports: [
		CommonModule
	],
	declarations: [NgxPhoneMaskDirective],
	exports: [NgxPhoneMaskDirective]
})
export class NgxPhoneMaskModule { }
