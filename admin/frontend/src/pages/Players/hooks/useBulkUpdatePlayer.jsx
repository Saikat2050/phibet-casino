/* eslint-disable react/prop-types */
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	attachTag,
	createTag,
	deleteTag,
	removeTag,
	updateSAUserStatus,
	verifyUserEmail,
} from '../../../store/actions';
import useForm from '../../../components/Common/Hooks/useFormModal';

const useBulkUpdatePlayer = (selectedPlayers, onSuccess) => {
	const dispatch = useDispatch();
	const [options, setOptions] = useState([]);
	const { userTags } = useSelector((state) => state.UserDetails);

	const handleVerifyEmail = () => {
		dispatch(
			verifyUserEmail(
				{
					userIds: selectedPlayers,
				},
				onSuccess
			)
		);
	};
	const updateUserStatus = (isActive) => {
		dispatch(
			updateSAUserStatus(
				{
					userIds: selectedPlayers,
					isActive,
					pageType: 'PlayerListing',
				},
				onSuccess
			)
		);
	};
	const tagSchema = () =>
		Yup.object().shape({
			tag: Yup.string()
				.required('Segment Required')
				.max(30, 'Segment must be at most 30 characters'),
			tagAction: Yup.string().required('Segment Action Required'),
		});

	const tagActionsOptionsList = [
		{
			optionLabel: 'Create Segment',
			value: 'createTag',
		},
		{
			optionLabel: 'Attach Segment',
			value: 'addTag',
		},
		{
			optionLabel: 'Delete Segment',
			value: 'delete',
		},
		{
			optionLabel: 'Remove Segment',
			value: 'removeTag',
		},
	];

	// eslint-disable-next-line no-shadow
	const staticFormFields = (options, isCreateTag) => [
		{
			name: 'tagAction',
			fieldType: 'radioGroup',
			optionList: tagActionsOptionsList,
			fieldColOptions: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12, xxl: 12 },
		},
		{
			name: 'tag',
			fieldType: isCreateTag ? 'textField' : 'select',
			placeholder: isCreateTag ? 'Enter Segment' : 'Select Segment',
			required: false,
			optionList: options || [],
			maximum: 50,
			fieldColOptions: { xs: 8, sm: 8, md: 8, lg: 8, xl: 8, xxl: 8 },
		},
	];

	// const updateUserStatus = () => {
	// 	dispatch(
	// 		updateSAUserStatus({
	// 			userId: selectedPlayers,
	// 		})
	// 	);
	// };
	const submitTagsCreate = (formValues) => {
		if (formValues?.tagAction === 'addTag') {
			dispatch(
				attachTag(
					{
						userIds: selectedPlayers,
						tagId: formValues?.tag,
					},
					onSuccess
				)
			);
		} else if (formValues?.tagAction === 'removeTag') {
			dispatch(
				removeTag(
					{
						userIds: selectedPlayers,
						tagId: formValues?.tag,
					},
					onSuccess
				)
			);
		} else if (formValues?.tagAction === 'createTag') {
			dispatch(
				createTag(
					{
						tag: formValues?.tag,
						userIds: selectedPlayers,
					}
					// onSuccess
				)
			);
		} else if (formValues?.tagAction === 'delete') {
			dispatch(
				deleteTag(
					{
						tagId: formValues?.tag,
					},
					onSuccess
				)
			);
		}
	};

	const { validation, formFields, setFormFields } = useForm({
		header: `Manage Segment`,
		initialValues: {
			tag: null,
			tagAction: '',
		},
		validationSchema: tagSchema,
		onSubmitEntry: submitTagsCreate,
		staticFormFields: staticFormFields(),
	});

	useEffect(() => {
		if (validation?.values?.tagAction === 'createTag') {
			setFormFields(staticFormFields([], true));
		}
		if (validation?.values?.tagAction !== 'createTag') {
			setOptions(
				userTags?.tags
					.filter((userTag) => userTag.isActive !== false)
					.map((tag) => ({
						id: tag?.id,
						optionLabel: tag?.tag,
						value: tag?.id,
					}))
			);
		}
	}, [validation?.values?.tagAction, validation?.values?.tag, userTags]);

	useEffect(() => {
		if (validation?.values?.tagAction !== 'createTag') {
			setFormFields(staticFormFields(options));
		}
	}, [options]);

	useEffect(() => {
		if (validation?.values?.tagAction) {
			validation?.setFieldValue('tag', null);
		}
	}, [validation?.values?.tagAction]);

	return {
		validation,
		formFields,
		handleVerifyEmail,
		updateUserStatus,
	};
};

export default useBulkUpdatePlayer;
