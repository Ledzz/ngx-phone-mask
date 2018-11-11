const masks = [
	'+1',
	'+1 (1',
	'+1 (11',
	'+1 (111',
	'+1 (111) 1',
	'+1 (111) 11',
	'+1 (111) 11-1',
	'+1 (111) 11-11',
	'+1 (111) 11-111',
	'+1 (111) 111-111',
	'+1 (111) 111-11-11'
];

export const clean = (dirty) => {
	return (dirty || '').toString()
		.replace(/[^\d\^]/gm, '');
};


export const format = (dirty: string) => {
	let lastCharIndex = 0;
	const cleanValue = clean(dirty);
	const charCount = cleanValue.replace(/\^/gm, '').length;
	if (charCount === 0) {
		return '';
	}
	const mask = masks[charCount - 1];
	if (charCount > 1 && !mask) {
		return '';
	}
	// let cursorPosition;
	const formatted = mask.split('').map((c, i) => {
		if (c === '1') {
			/*if (cleanValue[lastCharIndex] === '^') {
				cursorPosition = i + 1;
				lastCharIndex++;
			}*/

			lastCharIndex++;
			return cleanValue[lastCharIndex - 1];
		} else {
			return c;
		}
	}).join('');

	// if (!cursorPosition) {
	// 	cursorPosition = formatted.length;
	// }


	// cursorPosition++; // because of '+'

	return formatted;
	/* {
            formatted: `+${formatted}`,
            // cursorPosition
        }*/
};


export const mapChars = (str1: string, str2: string) => {
	const map = <any>{};
	let lastFoundIndex = 0;
	// const arr2 = str2.split('');

	(str1 || '').split('').forEach((char, index) => {
		const foundIndex = str2.indexOf(char, lastFoundIndex);
		map[index] = foundIndex;
		lastFoundIndex = foundIndex;
	});

	return map;
};

export const insertOrReplace = (str: string, replacement: string, startIndex: number, endIndex: number = startIndex): string => {
	if (startIndex === endIndex) {
		return str.substr(0, startIndex - 1) + replacement + str.substr(endIndex - 1);
	}
	return str.substr(0, startIndex) + replacement + str.substr(endIndex);
};


export const copy = (obj: any) => JSON.parse(JSON.stringify(obj));

export const isDefined = (value)  => typeof value !== 'undefined';
