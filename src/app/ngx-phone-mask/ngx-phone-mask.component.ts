import { Component, ViewChild, ElementRef } from '@angular/core';
import { phoneCodes } from './phone-codes';

// const InputMask = require('inputmask-core');
import InputMask from 'inputmask-core';

const countPlaceholders = code => code.replace('\\1', '').replace(/[^1]/gm, '').length;

const mostCommonCode = (codes) => {
	return codes.sort((a, b) => {
		return countPlaceholders(a.mask) > countPlaceholders(b.mask) ? -1 : 1;
	})[0];
}
const cleanMask = (mask) => {
	return mask
		.replace(/[\s\(\)\-]/gm, '')
		.replace(/\\1/gm, '-')
		.replace(/1/gm, '')
		.replace(/\-/gm, '1');
}
const codeFitsMask = (value, mask) => {
	const cleanedMask = cleanMask(mask)
	return value.startsWith(cleanedMask) || cleanedMask.startsWith(value);
}

const valueFitsMask = (value, mask) => {
	const maskRegexpString = mask
		.replace(/[\s\(\)\-]/gm, '')
		.replace(/\\1/gm, '-')
		.replace(/1/gm, '\\d')
		.replace(/\+/gm, '\\+')
		.replace(/\-/gm, '1');

	const maskRegexp = new RegExp(maskRegexpString);
	return maskRegexp.test(value);
}

const defaultMask = '+1 (111) 111-11-11';

@Component({
	selector: 'ngx-phone-mask',
	templateUrl: './ngx-phone-mask.component.html',
	styleUrls: ['./ngx-phone-mask.component.css']
})
export class NgxPhoneMaskComponent {
	@ViewChild('input') public input: ElementRef;

	public mask = new InputMask({
		pattern: defaultMask,
		isRevealingMask: true
	});
	public code;

	constructor() {	}

	onInput(event) {
		const char = event.key;
		event.preventDefault();

		if (event.key === 'Backspace') {
			if (phoneCodes.find(code => cleanMask(code.mask) === this.cleanValue())) {
				console.log('asdfasdfasdf');
				this.mask.setPattern(defaultMask);
			} else {
				this.mask.backspace();
			}
			this.updateInputView();
			return;
		}
		if (char.length !== 1) {
			return;
		}
		const value = this.cleanValue() + char;

		const properCodes = phoneCodes.filter(code => codeFitsMask(value, code.mask));

		const commonCode = mostCommonCode(properCodes);

		const fullMatch = properCodes.filter(code => valueFitsMask(value, code.mask));

		let useCode;

		if (properCodes.length === 1) { // Если мы можем точно определить страну
			useCode = commonCode;
		}

		if (fullMatch.length) { // Если мы можем точно определить страну
			useCode = fullMatch[0];
		}
		if (useCode) {
			this.code = useCode;
			console.log(value, this.code.mask)
			this.mask.setPattern(this.code.mask, {
				value,
				selection: this.mask.selection
			});
		}

		this.mask.input(char);
		this.updateInputView();
	}

	updateInputView() {
		const input = this.input.nativeElement;
		console.log('text in input: ' + this.mask.getValue())
		input.value = this.mask.getValue();
		input.setSelectionRange(this.mask.selection.start, this.mask.selection.end);
	}

	cleanValue() {
		return '+' + this.mask.getValue().replace(/\D/gm, '');
	}
}
