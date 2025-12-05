/* eslint-disable react/prop-types */
import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { TestimonialId, Author, Content, Status } from '../TestimonialListCol';
import {
	getAllTestimonials,
	deleteTestimonial,
} from '../../../store/testimonials/actions';
import Actions from '../../../components/Common/Actions';
import { useConfirmModal } from '../../../components/Common/ConfirmModal';
import usePermission from '../../../components/Common/Hooks/usePermission';
import { modules } from '../../../constants/permissions';
import { ICON_CLASS, TEXT_COLORS } from '../../../utils/constant';
import ButtonList from '../../../components/Common/ButtonList';

const useTestimonialListing = (filterValues) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { openConfirmModal } = useConfirmModal();
	const { testimonials, isLoading } = useSelector(
		(state) => state.Testimonials
	);
	const [page, setPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(10);
	const { isGranted, permissions } = usePermission();

	const handleView = (data) => navigate(`/testimonials/view/${data.id}`);
	const handleEdit = (data) => navigate(`/testimonials/edit/${data.id}`);

	const handleDelete = (id) => {
		dispatch(
			deleteTestimonial({
				testimonialId: id,
				callback: () => {
					dispatch(
						getAllTestimonials({
							perPage: itemsPerPage,
							page,
							...filterValues,
						})
					);
				},
			})
		);
	};

	const openDeleteConfirmationModal = (id) => {
		openConfirmModal('Do you really want to Delete the testimonial?', () =>
			handleDelete(id)
		);
	};

	const columns = useMemo(
		() => [
			{
				Header: 'ID',
				accessor: 'id',
				Cell: ({ value }) => <TestimonialId value={value} />,
				canSort: true,
			},
			{
				Header: 'Author',
				accessor: 'author',
				Cell: ({ value }) => <Author value={value} />,
				canSort: true,
			},
			{
				Header: 'Quote',
				accessor: 'content',
				Cell: ({ value }) => <Content value={value} />,
				canSort: true,
			},
			{
				Header: 'Status',
				accessor: 'isActive',
				disableFilters: true,
				disableSortBy: true,
				Cell: ({ value }) => <Status value={value} />,
			},
			{
				Header: 'Actions',
				accessor: 'actions',
				disableSortBy: true,
				Cell: ({ cell }) => (
					<Actions
						cell={cell}
						actionsList={[
							{
								actionName: 'View',
								actionHandler: handleView,
								isHidden: !isGranted(modules.testimonial, 'R'),
								icon: ICON_CLASS.view,
								iconColor: TEXT_COLORS.info,
							},
							{
								actionName: 'Edit',
								actionHandler: handleEdit,
								isHidden: !isGranted(modules.testimonial, 'U'),
								icon: ICON_CLASS.edit,
								iconColor: TEXT_COLORS.primary,
							},
							{
								actionName: 'Delete',
								actionHandler: (data) => openDeleteConfirmationModal(data?.id),
								isHidden: !isGranted(modules.testimonial, 'D'),
								icon: ICON_CLASS.delete,
								iconColor: TEXT_COLORS.danger,
							},
						]}
					/>
				),
			},
		],
		[permissions]
	);

	const handleAddClick = (e) => {
		e.preventDefault();
		navigate('create');
	};

	const buttonList = useMemo(
		() => [
			{
				label: (
					<>
						{' '}
						<i className="mdi mdi-plus" /> Create
					</>
				),
				handleClick: handleAddClick,
				link: '#!',
				module: modules.testimonial,
				operation: 'C',
			},
		],
		[permissions]
	);

	const actionList = <ButtonList buttonList={buttonList} />;

	useEffect(() => {
		dispatch(
			getAllTestimonials({
				perPage: itemsPerPage,
				page,
				...filterValues,
			})
		);
	}, [page, itemsPerPage]);

	const onChangeRowsPerPage = (newPerPage) => {
		setItemsPerPage(newPerPage);
		setPage(1);
	};

	return {
		formattedTestimonialDetails: testimonials?.data?.rows || [],
		isLoading,
		page,
		setPage,
		itemsPerPage,
		onChangeRowsPerPage,
		columns,
		totalPages: testimonials?.totalpages || 1,
		actionList,
	};
};

export default useTestimonialListing;
