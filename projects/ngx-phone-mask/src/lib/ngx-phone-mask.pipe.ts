import { Pipe, PipeTransform } from '@angular/core';
import { conformToMask } from 'angular2-text-mask';
import { mask } from './utils';

@Pipe({
	name: 'ngxPhoneMask'
})

export class NgxPhoneMaskPipe implements PipeTransform {
	transform(value: string): string {
		if (!value) {
			return '';
		}

		return conformToMask(
			value,
			mask(),
			{ guide: false }
		).conformedValue;
	}
}
