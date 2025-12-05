/* eslint-disable react/prop-types */
import { useDispatch, useSelector } from 'react-redux';
import { React, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyValueCellNA, Name } from '../SegmentColList';
import { modules } from '../../../constants/permissions';
import usePermission from '../../../components/Common/Hooks/usePermission';
import Actions from '../../../components/Common/Actions';
import { ICON_CLASS, TEXT_COLORS } from '../../../utils/constant';
import { useConfirmModal } from '../../../components/Common/ConfirmModal';
import ButtonList from '../../../components/Common/ButtonList';
import {
	deleteSegmentation,
	fetchSegmentation,
	fetchSegmentationConstants,
} from '../../../store/segmentation/actions';

const useSegmentation = (filterValues = {}) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { openConfirmModal } = useConfirmModal();
	const { isGranted, permissions } = usePermission();

	const { segmentationData, loading } = useSelector(
		(state) => state.Segmentation
	);

	const handleDelete = (id) => {
		dispatch(
			deleteSegmentation({
				id: parseInt(id, 10),
			})
		);
	};

	const handleDeleteClick = (row) => {
		openConfirmModal('Do you really want to Delete the segment?', () =>
			handleDelete(row?.id)
		);
	};

	const handleCreateClick = (e) => {
		e.preventDefault();
		navigate('create');
	};

	const buttonList = useMemo(() => [
		{
			label: ' + Create',
			handleClick: handleCreateClick,
			link: '#/',
			module: modules.player,
			operation: 'C',
		},
	]);

	const actionList = <ButtonList buttonList={buttonList} />;

	const [itemsPerPage, setItemsPerPage] = useState(10);
	const [currentPage, setCurrentPage] = useState(1);

	useEffect(() => {
		dispatch(fetchSegmentationConstants());
		dispatch(fetchSegmentation());
	}, []);

	useEffect(() => {
		dispatch(
			fetchSegmentation({
				perPage: itemsPerPage,
				page: currentPage,
				...filterValues,
			})
		);
	}, [itemsPerPage, currentPage]);

	const formattedSegments = useMemo(
		() =>
			segmentationData?.data?.segments?.map((data) => ({
				...data,
				id: data?.id,
				name: data?.name,
				comments: data?.comments,
			})) || [],
		[segmentationData]
	);

	const onChangeRowsPerPage = (value) => {
		setCurrentPage(1);
		setItemsPerPage(value);
	};

	const handleEdit = (row) => {
		const { id } = row;
		navigate(`/segmentation/edit/${id}`);
	};

	const handleView = (row) => {
		const { id, name } = row;
		navigate(`/segmentation/view/${id}`, { state: { name } });
	};

	const actionsList = [
		{
			actionName: 'View',
			actionHandler: handleView,
			isHidden: !isGranted(modules.segmentation, 'R'),
			icon: ICON_CLASS.view,
			iconColor: TEXT_COLORS.info,
		},
		{
			actionName: 'Edit',
			actionHandler: handleEdit,
			isHidden: !isGranted(modules.segmentation, 'U'),
			icon: ICON_CLASS.edit,
			iconColor: TEXT_COLORS.primary,
		},
		{
			actionName: 'Delete',
			actionHandler: handleDeleteClick,
			isHidden: !isGranted(modules.segmentation, 'D'),
			icon: ICON_CLASS.delete,
			iconColor: TEXT_COLORS.danger,
		},
	];

	const columns = useMemo(
		() => [
			{
				Header: 'Name',
				accessor: 'name',
				filterable: true,
				notHidable: true,
				Cell: ({ cell }) => <Name cell={cell} />,
			},
			{
				Header: 'Comment',
				accessor: 'comments',
				filterable: true,
				Cell: ({ cell }) => <KeyValueCellNA value={cell.value} />,
			},
			{
				Header: 'Action',
				accessor: 'action',
				disableFilters: true,
				disableSortBy: true,
				Cell: ({ cell }) => <Actions cell={cell} actionsList={actionsList} />,
			},
		],
		[formattedSegments, permissions]
	);

	return {
		columns,
		buttonList,
		formattedSegments,
		itemsPerPage,
		totalPlayerPages: segmentationData?.data?.totalPages,
		setCurrentPage,
		currentPage,
		onChangeRowsPerPage,
		handleDelete,
		actionList,
		loading,
	};
};

export default useSegmentation;
