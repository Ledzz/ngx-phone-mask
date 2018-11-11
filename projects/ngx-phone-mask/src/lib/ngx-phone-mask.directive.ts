import { Directive, ElementRef, forwardRef, HostListener, Input, OnInit } from '@angular/core';
import { Formatter } from './formatter.class';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MaskService } from './mask-service.class';
import { copy, isDefined } from './utils';

const noop = () => {
};

@Directive({
	selector: '[ngxPhoneMask]',
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => NgxPhoneMaskDirective),
			multi: true
		}
	]
})
/*
export class NgxPhoneMaskDirective {
	private onTouchedCallback: () => void = noop;
	private onChangeCallback: (_: any) => void = noop;

	input: HTMLInputElement;
	formatter;
	overrideCursorPositions: Array<number>;

	constructor(private el: ElementRef) {
		this.formatter = new Formatter();
		this.input = this.el.nativeElement;
	}

	@HostListener('input', ['$event'])
	onInput(event) {
		const cursorPositions = [this.input.selectionStart, this.input.selectionEnd];
		this.formatter.onInput(event, (this.overrideCursorPositions || cursorPositions));
		this.updateValueAndPositions();
	}

	@HostListener('select', ['$event'])
	onSelectionChange(event) {
		this.overrideCursorPositions = [this.input.selectionStart, this.input.selectionEnd];
		// this.formatter.
	}

	writeValue(value: string) {
		this.formatter.setValue(value);
		this.updateValueAndPositions();
	}

	registerOnChange(fn: any) {
		this.onChangeCallback = fn;
	}

	registerOnTouched(fn: any) {
		this.onTouchedCallback = fn;
	}

	updateValueAndPositions() {
		this.input.value = this.formatter.inputValue;
		this.input.setSelectionRange(this.formatter.cursorPositions[0], this.formatter.cursorPositions[1]);
		this.overrideCursorPositions = null;
	}
}
*/
export class NgxPhoneMaskDirective implements OnInit {
	private onTouchedCallback: () => void = noop;
	private onChangeCallback: (_: any) => void = noop;

	input: HTMLInputElement;
	@Input() mask = '+9 (999) 999-99-99';

	@Input() repeat = '';
	@Input() clean = true;
	@Input() limit = true;
	@Input() restrict: 'select' | 'reject' | 'accept' = 'reject';
	private validate = false;

	value = '';

	maskService;
	options;

	constructor(private el: ElementRef) {
		this.input = this.el.nativeElement;
	}

	private timeout;

	setSelectionRange(selectionStart) {
		if (typeof selectionStart !== 'number') {
			return;
		}

		// using $timeout:
		// it should run after the DOM has been manipulated by Angular
		// and after the browser renders (which may cause flicker in some cases)
		clearTimeout(this.timeout);
		this.timeout = setTimeout(() => {
			const selectionEnd = selectionStart + 1;
			const input = this.input;

			if (input.setSelectionRange) {
				input.focus();
				input.setSelectionRange(selectionStart, selectionEnd);
			} else if ((<any>input).createTextRange) {
				const range = (<any>input).createTextRange();

				range.collapse(true);
				range.moveEnd('character', selectionEnd);
				range.moveStart('character', selectionStart);
				range.select();
			}
		});
	}

	async ngOnInit() {
		this.maskService = MaskService.create();

		await this.maskService.generateRegex({
			mask: this.mask,
			// repeat mask expression n times
			repeat: this.repeat,
			// clean model value - without divisors
			clean: this.clean,
			// limit length based on mask length
			limit: this.limit,
			// how to act with a wrong value
			restrict: this.restrict, //select, reject, accept
			// set validity mask
			validate: this.validate,
			// default model value
			model: this.value,
			// default input value
			value: this.value
		});
		// get initial options
		// let timeout;
		this.options = this.maskService.getOptions();

		// it should run after the DOM has been manipulated by Angular
		// but before the browser renders
		if (this.options.value) {
			setTimeout(() => this.setViewValue(copy(this.options.value)));
		}
	}

	@HostListener('click')
	@HostListener('input')
	@HostListener('paste')
	@HostListener('keyup')
	onInput() {
		// this.timeout = setTimeout(() => {
		// 	// Manual debounce to prevent multiple execution
		// 	clearTimeout(this.timeout);

		this.parseViewValue(this.input.value);
		// }, 0);
	}

	parseViewValue(value) {
		const untouchedValue = value;
		// set default value equal 0
		value = value || '';

		// get view value object
		let viewValue = this.maskService.getViewValue(value);

		// get mask without question marks
		const maskWithoutOptionals = this.options['maskWithoutOptionals'] || '';

		// get view values capped
		// used on view
		let viewValueWithDivisors = viewValue.withDivisors(true);
		// used on model
		let viewValueWithoutDivisors = viewValue.withoutDivisors(true);

		try {
			// get current regex
			const regex = this.maskService.getRegex(viewValueWithDivisors.length - 1);
			const fullRegex = this.maskService.getRegex(maskWithoutOptionals.length - 1);

			// current position is valid
			const validCurrentPosition = regex.test(viewValueWithDivisors) || fullRegex.test(viewValueWithDivisors);

			// difference means for select option
			const diffValueAndViewValueLengthIsOne = (value.length - viewValueWithDivisors.length) === 1;
			const diffMaskAndViewValueIsGreaterThanZero = (maskWithoutOptionals.length - viewValueWithDivisors.length) > 0;

			if (this.options.restrict !== 'accept') {
				if (this.options.restrict === 'select' && (!validCurrentPosition || diffValueAndViewValueLengthIsOne)) {
					const lastCharInputed = value[(value.length - 1)];
					const lastCharGenerated = viewValueWithDivisors[(viewValueWithDivisors.length - 1)];

					if ((lastCharInputed !== lastCharGenerated) && diffMaskAndViewValueIsGreaterThanZero) {
						viewValueWithDivisors = viewValueWithDivisors + lastCharInputed;
					}

					const wrongPosition = this.maskService.getFirstWrongPosition(viewValueWithDivisors);
					if (isDefined(wrongPosition)) {
						this.setSelectionRange(wrongPosition);
					}
				} else if (this.options.restrict === 'reject' && !validCurrentPosition) {
					viewValue = this.maskService.removeWrongPositions(viewValueWithDivisors);
					viewValueWithDivisors = viewValue.withDivisors(true);
					viewValueWithoutDivisors = viewValue.withoutDivisors(true);

					// setSelectionRange(viewValueWithDivisors.length);
				}
			}

			if (!this.options.limit) {
				viewValueWithDivisors = viewValue.withDivisors(false);
				viewValueWithoutDivisors = viewValue.withoutDivisors(false);
			}

			// Set validity
			/**
			 * TODO: Validation
			 if (this.options.validate && controller.$dirty) {
							if (fullRegex.test(viewValueWithDivisors) || controller.$isEmpty(untouchedValue)) {
								controller.$setValidity('mask', true);
							} else {
								controller.$setValidity('mask', false);
							}
						}
			 */

			// Update view and model values
			if (value !== viewValueWithDivisors) {
				const oldValue = this.input.value;
				this.setViewValue(copy(viewValueWithDivisors));
				const firstChange = oldValue.split('').findIndex((c, i) => c !== viewValueWithDivisors[i]);
				if (firstChange > 0) {
					setTimeout(() => this.input.setSelectionRange(firstChange, firstChange));
				}
				console.log(firstChange);

				console.log(viewValueWithDivisors, viewValueWithoutDivisors);
				// Not using $setViewValue so we don't clobber the model value and dirty the form
				// without any kind of user interaction.
			}


		} catch (e) {
			console.error('[mask - parseViewValue]');
			throw e;
		}

		// Update model, can be different of view value
		if (this.options.clean) {
			return viewValueWithoutDivisors;
		} else {
			return viewValueWithDivisors;
		}
	}

	setViewValue(value) {
		this.input.value = value;
		this.onChangeCallback(this.parseViewValue(value));
	}

	writeValue(value: string) {
		this.value = value;
		if (isDefined(value) && this.options) {
			this.parseViewValue(value);
		}
	}

	registerOnChange(fn: any) {
		this.onChangeCallback = fn;
	}

	registerOnTouched(fn: any) {
		this.onTouchedCallback = fn;
	}
}
