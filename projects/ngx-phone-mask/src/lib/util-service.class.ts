export class UtilService {
	// sets: an array of arrays
	// f: your callback function
	// context: [optional] the `this` to use for your callback
	// http://phrogz.net/lazy-cartesian-product
	static lazyProduct(sets, f, context) {
		if (!context) {
			context = this;
		}

		const p = [];
		const max = sets.length - 1;
		const lens = [];

		for (let i = sets.length; i--;) {
			lens[i] = sets[i].length;
		}

		function dive(d) {
			const a = sets[d];
			const len = lens[d];

			if (d === max) {
				for (let i = 0; i < len; ++i) {
					p[d] = a[i];
					f.apply(context, p);
				}
			} else {
				for (let i = 0; i < len; ++i) {
					p[d] = a[i];
					dive(d + 1);
				}
			}

			p.pop();
		}

		dive(0);
	}

	static inArray(i, array) {
		let output;

		try {
			output = array.indexOf(i) > -1;
		} catch (e) {
			throw e;
		}

		return output;
	}

	static uniqueArray(array) {
		const u = {};
		const a = [];

		for (let i = 0, l = array.length; i < l; ++i) {
			if (u.hasOwnProperty(array[i])) {
				continue;
			}

			a.push(array[i]);
			u[array[i]] = 1;
		}

		return a;
	}
}
