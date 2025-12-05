/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable react/prop-types */
import * as Yup from 'yup';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import useForm from '../../../components/Common/Hooks/useFormModal';
import FormModal from '../../../components/Common/FormModal';
import {
	attachTag,
	createTag,
	getAllTags,
	removeTag,
} from '../../../store/actions';
import usePermission from '../../../components/Common/Hooks/usePermission';
import { modules } from '../../../constants/permissions';

const tagSchema = () =>
	Yup.object().shape({
		tag: Yup.string()
			.required('Segment name is required')
			.test('tag-conditional-validation', 'Segment Required', function (value) {
				const { tagAction } = this.parent;
				if (tagAction === 'createTag') {
					if (!value) {
						return this.createError({ message: 'Segment Required' });
					}
					if (value.length < 3) {
						return this.createError({
							message: 'Segment must be at least 3 characters',
						});
					}
					if (value.length > 30) {
						return this.createError({
							message: 'Segment must be at most 30 characters',
						});
					}
				}
				return true;
			}),
		tagAction: Yup.string().required('Segment Action Required'),
	});

const tagActionsOptionsList = [
	{
		optionLabel: 'Attach',
		value: 'addTag',
	},
	{
		optionLabel: 'Remove',
		value: 'removeTag',
	},
	{
		optionLabel: 'Create',
		value: 'createTag',
	},
];

const staticFormFields = (options, isCreateTag) => [
	{
		name: 'tagAction',
		fieldType: 'radioGroup',
		label: 'Segment Action',
		optionList: tagActionsOptionsList,
		isRequired: true,
	},
	{
		name: 'tag',
		fieldType: isCreateTag ? 'textField' : 'select',
		// label: '',
		placeholder: isCreateTag ? 'Enter Segment' : 'Select Segment',
		required: false,
		optionList: options || [],
		maximum: 30,
	},
];

const ManageTagModal = ({ userDetails, show, handleClose }) => {
	const { isGranted, permissions } = usePermission();
	const { playerId } = useParams();
	const dispatch = useDispatch();
	const [options, setOptions] = useState([]);
	const { updateUserTagsLoading, userTags } = useSelector(
		(state) => state.UserDetails
	);

	useEffect(() => {
		if (isGranted(modules.segmentation, 'R')) dispatch(getAllTags());
	}, [permissions]);

	const submitTagsCreate = (formValues) => {
		if (formValues?.tagAction === 'addTag') {
			dispatch(
				attachTag({
					userIds: [playerId],
					tagId: formValues?.tag,
				})
			);
		} else if (formValues?.tagAction === 'removeTag') {
			dispatch(
				removeTag({
					userIds: [playerId],
					tagId: formValues?.tag,
				})
			);
		} else if (formValues?.tagAction === 'createTag') {
			dispatch(
				createTag({
					tag: formValues?.tag,
				})
			);
		}
	};

	const { isOpen, setIsOpen, header, validation, formFields, setFormFields } =
		useForm({
			header: `Manage Segment for ${userDetails?.firstName} ${userDetails?.lastName}`,
			initialValues: {
				tag: null,
				tagAction: '',
			},
			validationSchema: tagSchema,
			onSubmitEntry: (values, { resetForm }) => {
				submitTagsCreate(values);
				resetForm();
				handleClose();
			},
			staticFormFields: staticFormFields(),
		});

	useEffect(() => {
		if (
			userTags?.tags?.length > 0 &&
			validation?.values?.tagAction === 'addTag' &&
			userDetails
		) {
			setOptions(
				userTags?.tags
					.filter(
						(userTag) =>
							userTag.isActive !== false &&
							!userDetails?.userTags?.some(
								(tags) => tags?.tagId === userTag?.id
							)
					)
					.map((tag) => ({
						id: tag?.id,
						optionLabel: tag?.tag,
						value: tag?.id,
					}))
			);
		}

		if (validation?.values?.tagAction === 'removeTag' && userDetails) {
			setOptions(
				userDetails?.userTags?.map((tag) => ({
					id: tag.tagId,
					optionLabel: tag?.tag?.tag,
					value: tag.tagId,
				}))
			);
		}

		if (validation?.values?.tagAction === 'createTag') {
			setFormFields(staticFormFields([], true));
		}
	}, [validation?.values?.tagAction, userTags, userDetails]);

	useEffect(() => {
		setFormFields(staticFormFields(options));
	}, [options]);

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
					handleClose();
				}}
				header={header}
				validation={validation}
				formFields={formFields}
				submitLabel="Submit"
				customColClasses="col-md-12"
				isSubmitLoading={updateUserTagsLoading}
			/>
		</div>
	);
};

export default ManageTagModal;
