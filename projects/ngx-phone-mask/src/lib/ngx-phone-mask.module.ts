import { NgModule } from '@angular/core';
import { NgxPhoneMaskDirective } from './ngx-phone-mask.directive';
import { TextMaskModule } from 'angular2-text-mask';
import { NgxPhoneMaskPipe } from './ngx-phone-mask.pipe';

@NgModule({
	imports: [TextMaskModule],
	declarations: [
		NgxPhoneMaskDirective,
		NgxPhoneMaskPipe
	],
	exports: [
		NgxPhoneMaskDirective,
		NgxPhoneMaskPipe
	]
})
export class NgxPhoneMaskModule {
}
