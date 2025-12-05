/* eslint-disable */
export const emailDynamicOptions = ({ type, emailTypes }) => {
	const allOpt = [];

	const checkOptional = (type, keyDesc) => {
		const req = [];
		for (const index in keys) {
			const data = keys[index]?.optional;
			if (data?.includes(keyDesc)) {
				req.push(parseInt(index));
			}
		}
		return req?.includes(type);
	};

	const checkRequired = (type, keyDesc) => {
		const req = [];
		for (const index in keys) {
			const data = keys[index]?.required;
			if (data?.includes(keyDesc)) {
				req.push(parseInt(index));
			}
		}
		return req?.includes(type);
	};
	const keyDescription = emailTypes?.keyDescription;
	const keys = emailTypes?.dynamicKeys;

	for (const keyDesc in keyDescription) {
		const data = {
			key: keyDesc,
			description: keyDescription?.[keyDesc],
			required: checkRequired(parseInt(type), keyDesc),
			optional: checkOptional(parseInt(type), keyDesc),
		};
		allOpt.push(data);
	}

	return allOpt.filter((option) => option.optional || option.required);
};

export const EMAIL_TEMPLATE_EVENT_TYPES = {
	RESET_PASSWORD: 'reset_password',
	EMAIL_VERIFICATION: 'email_verification'
};
