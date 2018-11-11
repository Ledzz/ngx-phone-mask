import { copy } from './utils';
import { UtilService } from './util-service.class';
import { OptionalService } from './optional-service.class';

export class MaskService {
	static create() {
		let options;
		let maskWithoutOptionals;
		let maskWithoutOptionalsLength = 0;
		let maskWithoutOptionalsAndDivisorsLength = 0;
		let optionalIndexes = [];
		const optionalDivisors = {};
		const optionalDivisorsCombinations = [];
		const divisors = [];
		const divisorElements = {};
		const regex = [];
		const patterns = {
			'9': /[0-9]/,
			'8': /[0-8]/,
			'7': /[0-7]/,
			'6': /[0-6]/,
			'5': /[0-5]/,
			'4': /[0-4]/,
			'3': /[0-3]/,
			'2': /[0-2]/,
			'1': /[0-1]/,
			'0': /[0]/,
			'*': /./,
			'w': /\w/,
			'W': /\W/,
			'd': /\d/,
			'D': /\D/,
			's': /\s/,
			'S': /\S/,
			'b': /\b/,
			'A': /[A-Z]/,
			'a': /[a-z]/,
			'Z': /[A-ZÇÀÁÂÃÈÉÊẼÌÍÎĨÒÓÔÕÙÚÛŨ]/,
			'z': /[a-zçáàãâéèêẽíìĩîóòôõúùũüû]/,
			'@': /[a-zA-Z]/,
			'#': /[a-zA-ZçáàãâéèêẽíìĩîóòôõúùũüûÇÀÁÂÃÈÉÊẼÌÍÎĨÒÓÔÕÙÚÛŨ]/,
			'%': /[0-9a-zA-ZçáàãâéèêẽíìĩîóòôõúùũüûÇÀÁÂÃÈÉÊẼÌÍÎĨÒÓÔÕÙÚÛŨ]/
		};

		// REGEX

		function generateIntermetiateElementRegex(i, forceOptional) {
			let hasOptional;
			let charRegex;
			try {
				const element = maskWithoutOptionals[i];
				const elementRegex = patterns[element];
				hasOptional = isOptional(i);

				if (elementRegex) {
					charRegex = '(' + elementRegex.source + ')';
				} else { // is a divisor
					if (!isDivisor(i)) {
						divisors.push(i);
						divisorElements[i] = element;
					}

					charRegex = '(' + '\\' + element + ')';
				}
			} catch (e) {
				throw e;
			}

			if (hasOptional || forceOptional) {
				charRegex += '?';
			}

			return new RegExp(charRegex);
		}

		function generateIntermetiateRegex(i, forceOptional?) {


			let elementRegex;
			let elementOptionalRegex;
			try {
				const intermetiateElementRegex = generateIntermetiateElementRegex(i, forceOptional);
				elementRegex = intermetiateElementRegex;

				const hasOptional = isOptional(i);
				let currentRegex = intermetiateElementRegex.source;

				if (hasOptional && ((i + 1) < maskWithoutOptionalsLength)) {
					const intermetiateRegex = generateIntermetiateRegex((i + 1), true).elementOptionalRegex();
					currentRegex += intermetiateRegex.source;
				}

				elementOptionalRegex = new RegExp(currentRegex);
			} catch (e) {
				throw e;
			}
			return {
				elementRegex: function () {
					return elementRegex;
				},
				elementOptionalRegex: function () {
					// from element regex, gets the flow of regex until first not optional
					return elementOptionalRegex;
				}
			};
		}

		function generateRegex(opts) {
			const deferred = new Promise((resolve, reject) => {

				options = opts;

				try {
					let mask = opts['mask'];
					const repeat = opts['repeat'];

					if (!mask) {
						return;
					}

					if (repeat) {
						mask = Array((parseInt(repeat, 10) + 1)).join(mask);
					}

					optionalIndexes = OptionalService.getOptionals(mask).fromMaskWithoutOptionals();
					options['maskWithoutOptionals'] = maskWithoutOptionals = OptionalService.removeOptionals(mask);
					maskWithoutOptionalsLength = maskWithoutOptionals.length;

					let cumulativeRegex;
					for (let i = 0; i < maskWithoutOptionalsLength; i++) {
						const charRegex = generateIntermetiateRegex(i);
						const elementRegex = charRegex.elementRegex();
						const elementOptionalRegex = charRegex.elementOptionalRegex();

						let newRegex = cumulativeRegex ? cumulativeRegex.source + elementOptionalRegex.source : elementOptionalRegex.source;
						newRegex = new RegExp(newRegex);
						cumulativeRegex = cumulativeRegex ? cumulativeRegex.source + elementRegex.source : elementRegex.source;
						cumulativeRegex = new RegExp(cumulativeRegex);

						regex.push(newRegex);
					}

					generateOptionalDivisors();
					maskWithoutOptionalsAndDivisorsLength = removeDivisors(maskWithoutOptionals).length;

					resolve({
						options: options,
						divisors: divisors,
						divisorElements: divisorElements,
						optionalIndexes: optionalIndexes,
						optionalDivisors: optionalDivisors,
						optionalDivisorsCombinations: optionalDivisorsCombinations
					});
				} catch (e) {
					reject(e);
					throw e;
				}
			});

			return deferred;
		}

		function getRegex(index) {
			let currentRegex;

			try {
				currentRegex = regex[index] ? regex[index].source : '';
			} catch (e) {
				throw e;
			}

			return (new RegExp('^' + currentRegex + '$'));
		}

		// DIVISOR

		function isOptional(currentPos) {
			return UtilService.inArray(currentPos, optionalIndexes);
		}

		function isDivisor(currentPos) {
			return UtilService.inArray(currentPos, divisors);
		}

		function generateOptionalDivisors() {
			function sortNumber(a, b) {
				return a - b;
			}

			const sortedDivisors = divisors.sort(sortNumber);
			const sortedOptionals = optionalIndexes.sort(sortNumber);
			for (let i = 0; i < sortedDivisors.length; i++) {
				const divisor = sortedDivisors[i];
				for (let j = 1; j <= sortedOptionals.length; j++) {
					const optional = sortedOptionals[(j - 1)];
					if (optional >= divisor) {
						break;
					}

					if (optionalDivisors[divisor]) {
						optionalDivisors[divisor] = optionalDivisors[divisor].concat(divisor - j);
					} else {
						optionalDivisors[divisor] = [(divisor - j)];
					}

					// get the original divisor for alternative divisor
					divisorElements[(divisor - j)] = divisorElements[divisor];
				}
			}
		}

		function removeDivisors(value) {
			value = value.toString();
			try {
				if (divisors.length > 0 && value) {
					const keys = Object.keys(divisorElements);
					let elments = [];

					for (let i = keys.length - 1; i >= 0; i--) {
						const divisor = divisorElements[keys[i]];
						if (divisor) {
							elments.push(divisor);
						}
					}

					elments = UtilService.uniqueArray(elments);

					// remove if it is not pattern
					const regex = new RegExp(('[' + '\\' + elments.join('\\') + ']'), 'g');
					return value.replace(regex, '');
				} else {
					return value;
				}
			} catch (e) {
				throw e;
			}
		}

		function insertDivisors(array, combination) {
			function insert(array, output) {
				const out = output;
				for (let i = 0; i < array.length; i++) {
					const divisor = array[i];
					if (divisor < out.length) {
						out.splice(divisor, 0, divisorElements[divisor]);
					}
				}
				return out;
			}

			let output = array;
			const divs = divisors.filter(function (it) {
				const optionalDivisorsKeys = Object.keys(optionalDivisors).map(function (it) {
					return parseInt(it, 10);
				});

				return !UtilService.inArray(it, combination) && !UtilService.inArray(it, optionalDivisorsKeys);
			});

			if (!Array.isArray(array) || !Array.isArray(combination)) {
				return output;
			}

			// insert not optional divisors
			output = insert(divs, output);

			// insert optional divisors
			output = insert(combination, output);

			return output;
		}

		function tryDivisorConfiguration(value) {
			let output = value.split('');
			let defaultDivisors = true;

			// has optional?
			if (optionalIndexes.length > 0) {
				const lazyArguments = [];
				const optionalDivisorsKeys = Object.keys(optionalDivisors);

				// get all optional divisors as array of arrays [[], [], []...]
				for (let i = 0; i < optionalDivisorsKeys.length; i++) {
					const val = optionalDivisors[optionalDivisorsKeys[i]];
					lazyArguments.push(val);
				}

				// generate all possible configurations
				if (optionalDivisorsCombinations.length === 0) {
					UtilService.lazyProduct(lazyArguments, function () {
						// convert arguments to array
						optionalDivisorsCombinations.push(Array.prototype.slice.call(arguments));
					}, undefined);
				}

				for (let i = optionalDivisorsCombinations.length - 1; i >= 0; i--) {
					let outputClone = copy(output);
					outputClone = insertDivisors(outputClone, optionalDivisorsCombinations[i]);

					// try validation
					const viewValueWithDivisors = outputClone.join('');
					const regex = getRegex(maskWithoutOptionals.length - 1);

					if (regex.test(viewValueWithDivisors)) {
						defaultDivisors = false;
						output = outputClone;
						break;
					}
				}
			}

			if (defaultDivisors) {
				output = insertDivisors(output, divisors);
			}

			return output.join('');
		}

		// MASK

		function getOptions() {
			return options;
		}

		function getViewValue(value) {
			try {
				const outputWithoutDivisors = removeDivisors(value);
				const output = tryDivisorConfiguration(outputWithoutDivisors);

				return {
					withDivisors: function (capped) {
						if (capped) {
							return output.substr(0, maskWithoutOptionalsLength);
						} else {
							return output;
						}
					},
					withoutDivisors: function (capped) {
						if (capped) {
							return outputWithoutDivisors.substr(0, maskWithoutOptionalsAndDivisorsLength);
						} else {
							return outputWithoutDivisors;
						}
					}
				};
			} catch (e) {
				throw e;
			}
		}

		// SELECTOR

		function getWrongPositions(viewValueWithDivisors, onlyFirst) {
			const pos = [];

			if (!viewValueWithDivisors) {
				return 0;
			}

			for (let i = 0; i < viewValueWithDivisors.length; i++) {
				const pattern = getRegex(i);
				const value = viewValueWithDivisors.substr(0, (i + 1));

				if (pattern && !pattern.test(value)) {
					pos.push(i);

					if (onlyFirst) {
						break;
					}
				}
			}

			return pos;
		}

		function getFirstWrongPosition(viewValueWithDivisors) {
			return getWrongPositions(viewValueWithDivisors, true)[0];
		}

		function removeWrongPositions(viewValueWithDivisors) {
			const wrongPositions = getWrongPositions(viewValueWithDivisors, false);
			let newViewValue = viewValueWithDivisors;

			for (let i = 0; i < (<any>wrongPositions).length; i++) {
				const wrongPosition = wrongPositions[i];
				const viewValueArray = viewValueWithDivisors.split('');
				viewValueArray.splice(wrongPosition, 1);
				newViewValue = viewValueArray.join('');
			}

			return getViewValue(newViewValue);
		}

		return {
			getViewValue: getViewValue,
			generateRegex: generateRegex,
			getRegex: getRegex,
			getOptions: getOptions,
			removeDivisors: removeDivisors,
			getFirstWrongPosition: getFirstWrongPosition,
			removeWrongPositions: removeWrongPositions
		};
	}
}
