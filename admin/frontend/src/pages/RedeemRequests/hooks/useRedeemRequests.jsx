/* eslint-disable react/prop-types */
import { useSelector } from 'react-redux';
import { React, useEffect, useMemo, useState } from 'react';
import { IsActive, Segment } from '../RedeemRequestsColList';
import {
	staticFormFields,
	getSegmentInitialValues,
	SegmentSchema,
} from '../formDetails';

import useForm from '../../../components/Common/Hooks/useFormModal';
import { modules } from '../../../constants/permissions';
import { formPageTitle } from '../../../components/Common/constants';
import { decryptCredentials } from '../../../network/storageUtils';
import usePermission from '../../../components/Common/Hooks/usePermission';
import Actions from '../../../components/Common/Actions';
import { ICON_CLASS, TEXT_COLORS } from '../../../utils/constant';
import { useConfirmModal } from '../../../components/Common/ConfirmModal';
import ButtonList from '../../../components/Common/ButtonList';

const useRedeemRequests = () => {
	const { openConfirmModal } = useConfirmModal();
	const { isGranted } = usePermission();
	const [isEdit, setIsEdit] = useState({ open: false, selectedRow: '' });
	const { userTags, userTagsLoading } = useSelector(
		(state) => state.UserDetails
	);

	const handleDelete = () => {
		// dispatch(
		// 	deleteTag({
		// 		tagId: parseInt(id, 10),
		// 	})
		// );
	};

	const handleDeleteClick = (row) => {
		openConfirmModal('Do you really want to delete the Segment?', () =>
			handleDelete(row?.id)
		);
	};

	const { isOpen, setIsOpen, validation, setHeader, header, formFields } =
		useForm({
			header: '',
			initialValues: getSegmentInitialValues(),
			validationSchema: SegmentSchema,
			// onSubmitEntry: handleSegments,
			staticFormFields: staticFormFields(),
		});

	// const onSuccess = () => {
	// 	setIsOpen((prev) => !prev);
	// 	validation.resetForm();
	// };

	const handleAddClick = (e) => {
		e.preventDefault();
		setIsOpen((prev) => !prev);
		setHeader('Create Segment');
		setIsEdit({ open: false, selectedRow: '' });
		validation.setValues(getSegmentInitialValues());
	};

	useEffect(() => {
		if (
			window.localStorage.getItem(formPageTitle.notification) &&
			!isEdit.open &&
			isOpen
		) {
			const values = JSON.parse(
				decryptCredentials(localStorage.getItem(formPageTitle.notification))
			);
			validation.setValues(values);
		}
	}, [isOpen]);

	const buttonList = useMemo(() => [
		{
			label: 'Create',
			handleClick: handleAddClick,
			link: '#/',
			module: modules.redeem,
			operation: 'C',
		},
	]);

	const actionList = <ButtonList buttonList={buttonList} />;

	const [itemsPerPage, setItemsPerPage] = useState(10);
	const [currentPage, setCurrentPage] = useState(1);

	useEffect(() => {
		// dispatch(
		// 	getAllTags({
		// 		perPage: itemsPerPage,
		// 		page: currentPage,
		// 	})
		// );
	}, [itemsPerPage, currentPage]);

	const formattedRedeem = [];

	const onChangeRowsPerPage = (value) => {
		setCurrentPage(1);
		setItemsPerPage(value);
	};

	const toggleFormModal = () => {
		setIsOpen((prev) => !prev);
	};

	const onClickEdit = (selectedRow) => {
		validation.setValues(getSegmentInitialValues(selectedRow));
		setIsEdit({ open: true, selectedRow });
		setHeader(`Update ${selectedRow.tag} Segment`);
		setIsOpen((prev) => !prev);
	};

	const actionsList = [
		{
			actionName: 'Edit',
			actionHandler: onClickEdit,
			isHidden: !isGranted(modules.redeem, 'U'),
			icon: ICON_CLASS.edit,
			iconColor: TEXT_COLORS.primary,
		},
		{
			actionName: 'Delete',
			actionHandler: handleDeleteClick,
			isHidden: !isGranted(modules.redeem, 'D'),
			icon: ICON_CLASS.delete,
			iconColor: TEXT_COLORS.danger,
		},
	];

	const columns = useMemo(
		() => [
			{
				Header: 'Name',
				accessor: 'tag',
				filterable: true,
				Cell: ({ cell }) => <Segment cell={cell} />,
			},
			{
				Header: 'Status',
				accessor: 'isActive',
				filterable: true,
				Cell: ({ cell }) => <IsActive value={cell.value} />,
			},
			{
				Header: 'Action',
				accessor: 'action',
				disableFilters: true,
				disableSortBy: true,
				Cell: ({ cell }) => {
					const onlyReadPermission = !isGranted(modules.redeem, 'U');

					return (
						<Actions
							cell={cell}
							actionsList={actionsList}
							disabled={onlyReadPermission}
						/>
					);
				},
			},
		],
		[userTags, isGranted(modules.redeem, 'U')]
	);

	return {
		columns,
		buttonList,
		formattedRedeem,
		itemsPerPage,
		totalPlayerPages: userTags?.totalPages,
		setCurrentPage,
		currentPage,
		onChangeRowsPerPage,
		isOpen,
		toggleFormModal,
		header,
		validation,
		formFields,
		userTagsLoading,
		handleDelete,
		actionList,
	};
};

export default useRedeemRequests;
