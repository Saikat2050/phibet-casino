/* eslint-disable react/prop-types */
/* eslint-disable react/no-unstable-nested-components */
import React, { useEffect, useMemo, useState } from 'react';
import { Container } from 'reactstrap';
import TableContainer from '../../components/Common/Table';
import { Comment, KeyValueCell, KeyValueCellNA } from './TableCol';
import FormModal from '../../components/Common/FormModal';
import useCreateComment from './hooks/useCreateComment';
import { formPageTitle } from '../../components/Common/constants';
import ConfirmationModal from '../../components/Common/ConfirmationModal';
import { ICON_CLASS, TEXT_COLORS } from '../../utils/constant';
import Actions from '../../components/Common/Actions';
import ButtonList from '../../components/Common/ButtonList';

const Notes = ({ userDetails, userId }) => {
	const [itemsPerPage, setItemsPerPage] = useState(10);
	const [currentPage, setCurrentPage] = useState(1);
	const [userComment, setUserComment] = useState(
		userDetails?.userComment || []
	);

	useEffect(() => {
		setUserComment(
			userDetails?.userComment
				? [
						{
							id: userDetails?.userComment?.id,
							title: userDetails?.userComment?.title,
							comment: userDetails?.userComment?.comment,
							commenterName: userDetails?.userComment?.adminUser?.username,
						},
				  ]
				: []
		);
	}, [userDetails?.userComment]);

	const {
		isOpen,
		setIsOpen,
		formFields,
		header,
		validation,
		isCreateCommentLoading,
		showModal,
		setShowModal,
		handleUpdateClick,
		handleAddClick,
		confirmDelete,
	} = useCreateComment({ userId });

	const actionsList = [
		{
			actionName: 'Edit',
			actionHandler: handleUpdateClick,
			isHidden: false,
			icon: ICON_CLASS.edit,
			iconColor: TEXT_COLORS.primary,
		},
		{
			actionName: 'Delete',
			actionHandler: confirmDelete,
			isHidden: false,
			icon: ICON_CLASS.delete,
			iconColor: TEXT_COLORS.danger,
		},
	];

	const columns = useMemo(
		() => [
			// {
			// 	Header: 'ID',
			// 	accessor: 'id',
			// 	notHidable: true,
			// 	filterable: true,
			// 	Cell: ({ cell }) => <Id value={cell.value} />,
			// },
			{
				Header: 'TITLE',
				accessor: 'title',
				filterable: true,
				Cell: ({ cell }) => <KeyValueCellNA value={cell.value} />,
			},
			{
				Header: 'NOTE',
				accessor: 'comment',
				filterable: true,
				Cell: ({ cell }) => <Comment value={cell.value} />,
			},
			{
				Header: 'NOTED BY',
				accessor: 'commenterName',
				Cell: ({ cell }) => <KeyValueCell value={cell.value} />,
			},
			// {
			// 	Header: 'NOTED AT',
			// 	accessor: 'createdAt',
			// 	Cell: ({ cell }) => <KeyValueCell value={(cell.value)} />,
			// },
			{
				Header: 'ACTION',
				disableSortBy: true,
				Cell: ({ cell }) => <Actions cell={cell} actionsList={actionsList} />,
			},
		],
		[userComment]
	);

	const buttonList = useMemo(() => {
		let list = [];
		if (!userComment?.length) {
			list = [
				{
					label: 'Add Note',
					handleClick: handleAddClick,
					link: '#!',
				},
			];
		}
		return list;
	}, [userComment]);

	const actionList = <ButtonList buttonList={buttonList} />;

	const onChangeRowsPerPage = (value) => {
		setItemsPerPage(value);
	};

	return (
		<Container fluid>
			<TableContainer
				isLoading={false}
				columns={columns || []}
				data={userComment || []}
				isPagination
				customPageSize={itemsPerPage}
				totalPageCount={1}
				isManualPagination
				onChangePagination={setCurrentPage}
				currentPage={currentPage}
				changeRowsPerPageCallback={onChangeRowsPerPage}
				actionList={actionList}
			/>
			<FormModal
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				showConfirmationModal={showModal}
				setShowConfirmationModal={setShowModal}
				isEditOpen={false}
				header={header}
				validation={validation}
				formFields={formFields}
				submitLabel="Submit"
				customColClasses="col-md-12"
				isSubmitLoading={isCreateCommentLoading}
			/>
			<ConfirmationModal
				openModal={showModal}
				setOpenModal={setShowModal}
				validation={validation}
				pageType={formPageTitle.notes}
			/>
		</Container>
	);
};

export default Notes;
