/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import * as Yup from 'yup';

const generalFormSchema = () =>
	Yup.object({
		name: Yup.string()
			.min(3, 'Minimum 3 Characters Required')
			.max(50, 'Maximum 50 Characters Allowed')
			.required('Channel Title Required'),
		description: Yup.string()
			.trim()
			.required('Channel Description Required')
			.nullable(),
		isActive: Yup.bool(),
		isGlobal: Yup.bool(),
		channelCriteria: Yup.string(),
		kycToggle: Yup.bool(),
		timeToggle: Yup.bool(),
		wageringToggle: Yup.bool(),
		tierToggle: Yup.bool(),
		timeValue: Yup.number().when(['timeToggle'], {
			is: (timeToggle) => timeToggle,
			then: () =>
				Yup.number()
					.typeError('Tier level must be a number')
					.required('Time duration is required'),
		}),
		tierValue: Yup.number().when(['tierToggle'], {
			is: (tierToggle) => tierToggle,
			then: () =>
				Yup.number()
					.typeError('Tier level must be a number')
					.required('Tier level is required'),
		}),
		wageringValue: Yup.number().when(['wageringToggle'], {
			is: (wageringToggle) => wageringToggle,
			then: () =>
				Yup.number()
					.typeError('Wagering value be a number')
					.required('Wagering value is required'),
		}),
		// channelCriteria: Yup
	});

const criteriaFormSchema = () =>
	Yup.object({
		KYC_CRITERIA: Yup.bool().required('KYC Criteria Required').nullable(),
		WAGERING_CRITERIA: Yup.number()
			.required('Wagering Amount Required')
			.nullable(),
		RANKING_LEVEL_CRITERIA: Yup.number()
			.required('Tier Level Required')
			.nullable(),
		TIME_CRITERIA: Yup.number().required('Time Required').nullable(),
	});

export { generalFormSchema, criteriaFormSchema };
