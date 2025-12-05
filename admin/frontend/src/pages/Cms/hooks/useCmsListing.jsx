/* eslint-disable react/prop-types */
import React, { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
	deleteCms,
	getAllCmsDetails,
	resetAllCmsDetails,
	updateSaCmsStatus,
} from '../../../store/cms/actions';
import { Title, Slug, Portal, Status } from '../CmsListCol';
import { ICON_CLASS, TEXT_COLORS } from '../../../utils/constant';
import { modules } from '../../../constants/permissions';
import usePermission from '../../../components/Common/Hooks/usePermission';
import Actions from '../../../components/Common/Actions';
import { useConfirmModal } from '../../../components/Common/ConfirmModal';

const useCmsListing = (filterValues = {}) => {
	const navigate = useNavigate();
	const { openConfirmModal } = useConfirmModal();
	const { cmsDetails, isLoading, error, isDeleteCmsLoading } = useSelector(
		(state) => state.AllCms
	);
	const [limit, setLimit] = useState(10);
	const [itemsPerPage, setItemsPerPage] = useState(10);
	const [page, setPage] = useState(1);
	const [selectedClient, setSelectedClient] = useState('');
	const { isGranted } = usePermission();

	const dispatch = useDispatch();

	const formattedCmsDetails = useMemo(() => {
		if (cmsDetails) {
			return cmsDetails?.pages.map((detail) => ({
				...detail,
				title: detail?.title?.EN,
				portal: detail?.tenant?.name
					? `${detail?.tenant?.name} ${detail.tenant?.domain}`
					: 'All',
			}));
		}
		return [];
	}, [cmsDetails]);

	const onChangeRowsPerPage = (value) => {
		setItemsPerPage(value);
	};

	const fetchData = () => {
		dispatch(
			getAllCmsDetails({
				perPage: itemsPerPage,
				page,
				adminId: selectedClient,
				...filterValues,
			})
		);
	};

	const handleStatus = (row) => {
		dispatch(
			updateSaCmsStatus({
				pageId: row?.id,
			})
		);
	};

	const handleClose = () => {
		fetchData();
	};

	const cmsDeleteHandler = (id) => {
		dispatch(
			deleteCms({
				data: {
					pageId: id,
				},
				handleClose,
			})
		);
	};

	const handleEditClick = (row) => {
		navigate(`edit/${row?.id}`);
	};

	const handleViewClick = (row) => {
		navigate(`details/${row?.id}`);
	};

	useEffect(() => {
		fetchData();
	}, [limit, selectedClient, page, itemsPerPage]);

	// resetting cms list redux state
	useEffect(() => () => dispatch(resetAllCmsDetails()), []);

	const confirmDelete = (row) => {
		openConfirmModal('Are you sure you want to delete this page?', () =>
			cmsDeleteHandler(row?.id)
		);
	};

	const actionsList = [
		{
			actionName: 'View',
			actionHandler: handleViewClick,
			isHidden: !isGranted(modules.page, 'R'),
			icon: ICON_CLASS.view,
			iconColor: TEXT_COLORS.info,
		},
		{
			actionName: 'Edit',
			actionHandler: handleEditClick,
			isHidden: !isGranted(modules.page, 'U'),
			icon: ICON_CLASS.edit,
			iconColor: TEXT_COLORS.primary,
		},
		{
			actionName: 'Toggle Status',
			actionHandler: handleStatus,
			isHidden: !isGranted(modules.page, 'TS'),
			icon: ICON_CLASS.toggleStatus,
			iconColor: TEXT_COLORS.success,
		},
		{
			actionName: 'Delete',
			actionHandler: confirmDelete,
			isHidden: !isGranted(modules.page, 'D'),
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
			// 	Cell: ({ cell }) => <CmsPageId value={cell.value} />,
			// },
			{
				Header: 'TITLE',
				accessor: 'title',
				filterable: true,
				Cell: ({ cell }) => <Title value={cell.value} />,
			},
			{
				Header: 'SLUG',
				accessor: 'slug',
				filterable: true,
				Cell: ({ cell }) => <Slug value={cell.value} />,
			},
			{
				Header: 'PORTAL',
				accessor: 'portal',
				filterable: true,
				Cell: ({ cell }) => <Portal value={cell.value} />,
			},
			{
				Header: 'STATUS',
				accessor: 'isActive',
				disableFilters: true,
				disableSortBy: true,
				Cell: ({ cell }) => <Status value={cell.value} />,
			},
			{
				Header: 'ACTION',
				// accessor: 'action',
				disableFilters: true,
				disableSortBy: true,
				Cell: ({ cell }) => <Actions cell={cell} actionsList={actionsList} />,
			},
		],
		[
			formattedCmsDetails,
			isGranted(modules.page, 'R'),
			isGranted(modules.page, 'U'),
			isGranted(modules.page, 'TS'),
		]
	);

	return {
		cmsDetails,
		formattedCmsDetails,
		isLoading,
		itemsPerPage,
		totalCmsCount: cmsDetails?.totalPages || 0,
		error,
		setLimit,
		setPage,
		setSelectedClient,
		handleStatus,
		onChangeRowsPerPage,
		columns,
		cmsDeleteHandler,
		isDeleteCmsLoading,
	};
};

export default useCmsListing;
