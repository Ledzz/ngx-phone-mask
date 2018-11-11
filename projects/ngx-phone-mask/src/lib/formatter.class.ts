import { clean, format, insertOrReplace, mapChars } from './utils';

export class Formatter {
	cleanValue: string;
	inputValue: string;
	cursorPositions: number[];

	constructor() {
		console.log('formatter created');
	}

	keyDown(code) {

	}

	onInput(event, cursorPositions?: number[]) {
		switch (event.inputType) {
			case 'insertText':
				this.insertText(event.data, cursorPositions);
				break;
			case 'deleteContentBackward':
				break;
			case 'deleteContentForward':
				break;
			case 'insertFromPaste':
				break;
			default:
				break;
		}
	}

	setValue(value: string) {
		this.inputValue = format(value);
		this.cursorPositions = [this.inputValue.length, this.inputValue.length];
	}

	insertText(data: string, cursorPositions: number[]) {
		// Leave only allowerd symbols in new chars
		const allowedSymbols = clean(data);
		if (!allowedSymbols.length) {
			return;
		}

		// Insert new chars
		const oldValue = this.inputValue;
		const newValue = format(insertOrReplace(oldValue, allowedSymbols, cursorPositions[0], cursorPositions[1]));
		console.log(newValue);
		const map = mapChars(oldValue, newValue);

		this.inputValue = newValue;
		this.cursorPositions = [cursorPositions[0] + allowedSymbols.length, cursorPositions[0] + allowedSymbols.length];
	}
}
