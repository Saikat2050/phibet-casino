/* eslint-disable react/prop-types */
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import useForm from '../../../components/Common/Hooks/useFormModal';
import FormModal from '../../../components/Common/FormModal';
import { getInitialValuesUpdateUser, userSchema } from '../formDetails';
import {
	fetchCountriesStart,
	fetchStatesStart,
	updateUserInfo,
} from '../../../store/actions';
import { countryMasks } from '../constants';
import { useConfirmModal } from '../../../components/Common/ConfirmModal';

const staticFormFields = (stateList, countryCodes) => [
	{
		name: 'email',
		fieldType: 'textField',
		label: 'Email',
		isRequired: true,
		maximum: 50,
	},
	{
		name: 'firstName',
		fieldType: 'textField',
		label: 'First Name',
		isRequired: true,
		maximum: 20,
	},
	{
		name: 'lastName',
		fieldType: 'textField',
		label: 'Last Name',
		isRequired: true,
		maximum: 20,
	},
	{
		name: 'username',
		fieldType: 'textField',
		label: 'User Name',
		isRequired: true,
		maximum: 20,
	},
	{
		name: 'address1',
		fieldType: 'textField',
		label: 'Address 1',
		isRequired: true,
		maximum: 50,
	},
	{
		name: 'address2',
		fieldType: 'textField',
		label: 'Address 2',
		isRequired: false,
		maximum: 50,
	},
	{
		name: 'city',
		fieldType: 'textField',
		label: 'City',
		isRequired: true,
		maximum: 30,
	},
	{
		name: 'zipCode',
		fieldType: 'textField',
		label: 'Zip Code',
		isRequired: true,
		maximum: 5,
	},
	{
		name: 'phone',
		fieldType: 'phone',
		label: 'Phone',
		// isRequired: true,
		namesArray: ['phone', 'phoneCode'],
		countryCodes,
		maximum: 15,
	},
	{
		name: 'stateCode',
		fieldType: 'select',
		label: 'State',
		placeholder: 'Select State',
		isRequired: true,
		optionList: stateList,
	},
	{
		name: 'dateOfBirth',
		fieldType: 'datePicker',
		label: 'Date Of Birth',
		isRequired: true,
		type: 'date',
		maxDate: moment().subtract(21, 'years').toDate(),
	},
	{
		name: 'gender',
		fieldType: 'radioGroup',
		label: 'Gender',
		isRequired: true,
		optionList: [
			{
				optionLabel: 'Male',
				value: 'male',
			},
			{
				optionLabel: 'Female',
				value: 'female',
			},
			{
				optionLabel: 'Other',
				value: 'unknown',
			},
			// {
			// 	optionLabel: 'Other',
			// 	value: 'other',
			// },
		],
	},
	// {
	// 	name: 'ssn',
	// 	fieldType: 'textField',
	// 	label: 'SSN',
	// 	isRequired: true,
	// 	maximum: 20,
	// },
	// {
	// 	name: 'newsLetter',
	// 	fieldType: 'switch',
	// 	label: 'NewsLetter',
	// 	required: true,
	// },
	// {
	// 	name: 'sms',
	// 	fieldType: 'switch',
	// 	label: 'SMS',
	// 	required: true,
	// },
	{
		name: 'isIdComply',
		fieldType: 'select',
		label: 'Share With ID Comply',
		placeholder: 'Select Share With IdComply',
		value: false,
		isRequired: true,
		optionList: [
			{
				optionLabel: 'Yes',
				value: true,
			},
			{
				optionLabel: 'No',
				value: false,
			}
		],
	},
];

const UpdateUserInfo = ({ show, header, toggle }) => {
	const dispatch = useDispatch();
	const { userDetails, depositToOtherLoading } = useSelector(
		(state) => state.UserDetails
	);
	const { countries } = useSelector((state) => state.Countries);
	const { states } = useSelector((state) => state.States);
	const [countryCodes, setCountryCodes] = useState([]);
	const { openConfirmModal } = useConfirmModal();
	const [values, setValues] = useState({})

	useEffect(() => {
		if (countries?.countries?.length) {
			setCountryCodes(() => {
				const codes = countries?.countries?.map((country) =>
					country.code.toLowerCase()
				);

				return Object.fromEntries(
					Object.entries(countryMasks).filter(([key]) => codes.includes(key))
				);
			});
		}
	}, [countries]);

	useEffect(() => {
		dispatch(fetchStatesStart());
		dispatch(fetchCountriesStart());
	}, []);

	const formattedStates = useMemo(() => {
		const arrayToReturn = [];
		if (states?.states?.length) {
			states?.states?.map((country) =>
				arrayToReturn.push({
					optionLabel: country.name,
					value: country.code,
				})
			);
		}
		return arrayToReturn;
	}, [states]);

	const handleUserEdit = () => {
		const dateOfBirth = moment(validation.values.dateOfBirth).format('YYYY-MM-DD');
		dispatch(
			updateUserInfo({
				...validation.values,
				dateOfBirth,
				userId: Number(userDetails.id),
			})
		);
	};

	const updateUserProfileDetails = () => {
		openConfirmModal(
			`Sending data to IDComply. Check the data is matching with user actual ID ${userDetails?.username}`,
			handleUserEdit
		);
	};

	const handleUserEditSubmit = (values) => {
		setValues(values)
		if (values.isIdComply === 'true') {
			updateUserProfileDetails(values)
		} else {
			handleUserEdit(values)
		}
	}

	const { isOpen, setIsOpen, validation, formFields } = useForm({
		header,
		initialValues: getInitialValuesUpdateUser(userDetails),
		validationSchema: userSchema,
		onSubmitEntry: (values) => {
			handleUserEditSubmit(values);
			toggle();
		},
		staticFormFields: staticFormFields(formattedStates, countryCodes),
	});

	useEffect(() => {
		if (show) setIsOpen(true);
		else setIsOpen(false);
	}, [show]);

	return (
		<div>
			<FormModal
				isOpen={isOpen}
				toggle={() => {
					setIsOpen((prev) => !prev);
					toggle();
				}}
				header={header}
				validation={validation}
				formFields={formFields}
				submitLabel="Submit"
				customColClasses="col-sm-6"
				isSubmitLoading={depositToOtherLoading}
				className="modal-dialog modal-lg"
			/>
		</div>
	);
};

export default UpdateUserInfo;
