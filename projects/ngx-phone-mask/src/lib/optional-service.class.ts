export class OptionalService {
	static getOptionals(mask) {
		const indexes = [];

		try {
			const regexp = /\?/g;
			let match = [];

			while ((match = regexp.exec(mask)) != null) {
				// Save the optional char
				indexes.push(((<any>match).index - 1));
			}
		} catch (e) {
			throw e;
		}

		return {
			fromMask: function () {
				return indexes;
			},
			fromMaskWithoutOptionals: function () {
				return OptionalService.getOptionalsRelativeMaskWithoutOptionals(indexes);
			}
		};
	}

	static getOptionalsRelativeMaskWithoutOptionals(optionals) {
		const indexes = [];
		for (let i = 0; i < optionals.length; i++) {
			indexes.push(optionals[i] - i);
		}
		return indexes;
	}

	static removeOptionals(mask) {
		let newMask;

		try {
			newMask = mask.replace(/\?/g, '');
		} catch (e) {
			throw e;
		}

		return newMask;
	}
}
