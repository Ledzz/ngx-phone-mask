export const clean = (number) => {
	return number
		.toString()
		.replace(/[^\d\^\+]/gm, '');
};

export const mask = () => (rawValue) => {
	if (!rawValue || clean(rawValue).length <= 12) {
		return ['+', /[1-9]/, ' ', '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/];
	}

	return ['+', /[1-9]/, ' ', '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/];

};
