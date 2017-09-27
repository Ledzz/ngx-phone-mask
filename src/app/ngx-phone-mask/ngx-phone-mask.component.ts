import { Component, ViewChild, ElementRef, Input, forwardRef  } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { phoneCodes } from './phone-codes';

import InputMask from 'inputmask-core';

const noop = () => { };

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
	styleUrls: ['./ngx-phone-mask.component.css'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => NgxPhoneMaskComponent),
			multi: true
		}
	]
})
export class NgxPhoneMaskComponent implements ControlValueAccessor {
	private onTouchedCallback: () => void = noop;
	private onChangeCallback: (_: any) => void = noop;

	@Input() public valueType: 'clean' | 'raw' | 'full' = 'clean';
	@ViewChild('input') public input: ElementRef;

	public mask = new InputMask({
		pattern: defaultMask,
		isRevealingMask: true
	});
	public code;
	public disabled;

	constructor() {	}

	onInput(event) {
		const char = event.key;
		event.preventDefault();

		if (event.key === 'Backspace') {
			this.onBackspace();
			return;
		}
		if (char.length !== 1) {
			return;
		}
		const value = this.cleanValue() + char;

		this.setMask(value);

		this.mask.input(char);
		this.updateInputView();
	}

	onBackspace() {
		if (phoneCodes.find(code => cleanMask(code.mask) === this.cleanValue())) {
			this.mask.setPattern(defaultMask);
		} else {
			const old = this.mask.getValue();
			while (this.mask.getValue() === old && this.cleanValue() !== '+') {
				this.mask.backspace();
			}
		}
		const value = this.cleanValue();

		this.setMask(value);

		this.updateInputView();
	}
	setMask(value) {
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
			this.mask.setPattern(this.code.mask, {
				value,
				selection: this.mask.selection
			});
		}
	}
	updateInputView() {
		const input = this.input.nativeElement;
		this.emitValue();
		input.value = this.mask.getValue();
		input.setSelectionRange(this.mask.selection.start, this.mask.selection.end);
	}

	cleanValue() {
		return '+' + this.mask.getValue().replace(/\D/gm, '');
	}

	emitValue() {
		let value;
		switch(this.valueType) {
			case 'clean':
				value = this.cleanValue();
				break;
			case 'raw':
				value = this.mask.getRawValue();
				break;
			case 'full':
				value = this.mask.getValue();
				break;
		}
		this.onChangeCallback(value);
	}
	
	// From ControlValueAccessor interface
	writeValue(value: any) {
		this.mask.setValue(value);
	}

	registerOnChange(fn: any) {
		this.onChangeCallback = fn;
	}

	registerOnTouched(fn: any) {
		this.onTouchedCallback = fn;
	}

	setDisabledState(isDisabled) {
		this.disabled = isDisabled;
	}
}