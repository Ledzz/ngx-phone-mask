import { NgModule } from '@angular/core';
import { NgxPhoneMaskDirective } from './ngx-phone-mask.directive';
import { TextMaskModule } from 'angular2-text-mask';

@NgModule({
	imports: [TextMaskModule],
	declarations: [NgxPhoneMaskDirective],
	exports: [NgxPhoneMaskDirective]
})
export class NgxPhoneMaskModule {
}
