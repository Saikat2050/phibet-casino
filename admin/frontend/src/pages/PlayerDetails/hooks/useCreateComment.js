import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
	getInitialValues,
	staticFormFields,
	validationSchema,
} from '../formDetails';
import {
	createUserComment,
	deleteUserComment,
	updateUserComment,
} from '../../../store/actions';
import useForm from '../../../components/Common/Hooks/useFormModal';
import { formPageTitle } from '../../../components/Common/constants';
import { decryptCredentials } from '../../../network/storageUtils';
import { useConfirmModal } from '../../../components/Common/ConfirmModal';

const useCreateComment = ({ userId }) => {
	const dispatch = useDispatch();
	const { openConfirmModal } = useConfirmModal();
	const { createUserCommentsSuccess, updateUserCommentSuccess } = useSelector(
		(state) => state.UserDetails
	);
	const [isEdit, setIsEdit] = useState({ open: false, selectedRow: '' });
	const [showModal, setShowModal] = useState(false);

	const handleCreateComment = (values) => {
		dispatch(
			createUserComment({
				...values,
				userId,
			})
		);
	};

	const handleUpdate = (values) => {
		dispatch(
			updateUserComment({
				...values,
				userId,
			})
		);
	};

	const {
		isOpen,
		setIsOpen,
		header,
		setHeader,
		validation,
		formFields,
		setFormFields,
	} = useForm({
		header: 'Add Note',
		initialValues: getInitialValues(),
		validationSchema,
		staticFormFields,
		onSubmitEntry: isEdit.open ? handleUpdate : handleCreateComment,
	});

	const handleAddClick = (e) => {
		e.preventDefault();
		validation.resetForm(getInitialValues());
		setHeader('Add Note');
		setIsEdit({ open: false, selectedRow: '' });
		setIsOpen((prev) => !prev);
	};

	const handleUpdateClick = (selectedRow) => {
		setIsEdit({ open: true, selectedRow });
		setHeader('Edit Note');
		validation.setValues(selectedRow);
		setIsOpen((prev) => !prev);
	};

	const handleDelete = (commentId) => {
		dispatch(deleteUserComment({ commentId }));
	};

	const confirmDelete = (row) => {
		openConfirmModal('Do you really want to delete the Note?', () =>
			handleDelete(row?.id)
		);
	};

	useEffect(() => {
		if (createUserCommentsSuccess || updateUserCommentSuccess) setIsOpen(false);
	}, [createUserCommentsSuccess, updateUserCommentSuccess]);

	useEffect(() => {
		if (window.localStorage.getItem(formPageTitle.notes) && isOpen) {
			const values = JSON.parse(
				decryptCredentials(localStorage.getItem(formPageTitle.notes))
			);
			validation.setValues(values);
		}
	}, [isOpen]);

	return {
		isOpen,
		setIsOpen,
		header,
		validation,
		formFields,
		setFormFields,
		showModal,
		setShowModal,
		handleUpdateClick,
		handleAddClick,
		handleDelete,
		confirmDelete,
	};
};

export default useCreateComment;
