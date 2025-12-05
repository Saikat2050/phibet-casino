/* eslint-disable react/prop-types */
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Pages } from '../BannerManagementListCol';
import { getSABanners, resetSABannersData } from '../../../store/actions';
import { modules } from '../../../constants/permissions';
import { ICON_CLASS, TEXT_COLORS } from '../../../utils/constant';
import usePermission from '../../../components/Common/Hooks/usePermission';
import Actions from '../../../components/Common/Actions';

const useBannerManagement = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { isGranted } = usePermission();
	const {
		SABanners,
		SABannersloading,
		isEditSABannersSuccess,
		isDeleteSABannersSuccess,
	} = useSelector((state) => state.SASettings);

	const fetchData = () => {
		dispatch(getSABanners({}));
	};

	useEffect(() => () => dispatch(resetSABannersData()), []);

	useEffect(() => {
		if (isEditSABannersSuccess || isDeleteSABannersSuccess) fetchData();
	}, [isEditSABannersSuccess, isDeleteSABannersSuccess]);

	useEffect(() => fetchData(), []);

	const handleEditClick = (cell) => {
		navigate(`/banner/${cell?.id}`);
	};

	const handleViewClick = (cell) => {
		navigate(`/banner/view/${cell?.id}`);
	};

	const actionsList = () => [
		{
			actionName: 'View',
			actionHandler: handleViewClick,
			isHidden: !isGranted(modules.banner, 'R'),
			icon: ICON_CLASS.view,
			iconColor: TEXT_COLORS.primary,
		},
		{
			actionName: 'Edit',
			actionHandler: handleEditClick,
			isHidden: !isGranted(modules.banner, 'U'),
			icon: ICON_CLASS.edit,
			iconColor: TEXT_COLORS.primary,
		},
	];

	const columns = useMemo(
		() => [
			{
				Header: 'PAGES',
				accessor: 'type',
				filterable: true,
				Cell: ({ cell }) => <Pages value={cell.value} />,
			},
			{
				Header: 'Action',
				accessor: 'action',
				disableFilters: true,
				disableSortBy: true,
				Cell: ({ cell }) => (
					<Actions cell={cell} actionsList={actionsList(cell?.row?.original)} />
				),
			},
		],
		[
			SABanners,
			isGranted(modules.banner, 'U'),
			isGranted(modules.banner, 'C'),
			isGranted(modules.banner, 'D'),
			isGranted(modules.banner, 'TS'),
			isGranted(modules.banner, 'R'),
		]
	);

	return {
		columns,
		formattedSABanners: SABanners?.filter(({ type }) => type !== 'home') || [],
		SABannersloading,
	};
};

export default useBannerManagement;
