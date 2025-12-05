/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import * as Yup from 'yup';

const generalFormSchema = () =>
	Yup.object({
		name: Yup.string()
			.required('Chat Rain Title Required')
			.test(
				'not-only-spaces',
				'Input cannot contain only blankspaces',
				(value) => !/^\s+$/.test(value)
			)
			.nullable(),
		prizeMoney: Yup.string()
			.required('Prize Money Required')
			.test(
				'no-scientific-notation',
				'Input must be a valid number',
				(value) => /^[0-9]*\.?[0-9]+$/.test(value) && !/^\s+$/.test(value)
			),
		currency: Yup.string()
			.required('Currency Required')
			.test(
				'not-only-spaces',
				'Input cannot contain only blankspaces',
				(value) => !/^\s+$/.test(value)
			)
			.nullable(),
		chatGroupId: Yup.string().required('Channel Required'),
	});

// export { generalFormSchema };
export default generalFormSchema;
