/* eslint-disable react/prop-types */
import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchNotificationsStart } from '../../../store/actions';
import { selectedLanguage } from '../../../constants/config';
import { modules } from '../../../constants/permissions';
import usePermission from '../../../components/Common/Hooks/usePermission';
import { KeyValueCell } from '../NotificationListCol';
import Actions from '../../../components/Common/Actions';
import { ICON_CLASS, TEXT_COLORS } from '../../../utils/constant';
import ButtonList from '../../../components/Common/ButtonList';

const useNotificationListing = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { permissions } = usePermission();

	const [itemsPerPage, setItemsPerPage] = useState(10);
	const [currentPage, setCurrentPage] = useState(1);
	const { notifications, loading: isNotificationLoading } = useSelector(
		(state) => state.Notification
	);

	const fetchData = () => {
		dispatch(
			fetchNotificationsStart({
				perPage: itemsPerPage,
				page: currentPage,
			})
		);
	};

	useEffect(() => {
		fetchData();
	}, [currentPage, itemsPerPage]);

	const formattedNotifications = useMemo(() => {
		const formattedValues = [];
		if (notifications) {
			notifications?.notification?.map((notification) =>
				formattedValues.push({
					...notification,
					titleEN: notification?.title?.[selectedLanguage],
					descriptionEN: notification?.description?.[selectedLanguage],
				})
			);
		}
		return formattedValues;
	}, [notifications]);

	const onChangeRowsPerPage = (value) => {
		setItemsPerPage(value);
	};

	const handleSentNotification = () => {
		navigate('/send-notification');
	};

	const buttonList = useMemo(() => [
		{
			label: 'Send',
			handleClick: handleSentNotification,
			module: modules.notification,
			operation: 'C',
		},
	]);

	const handleViewClick = (row) =>
		navigate('/notification-details', { state: { details: row } });

	const actionsList = [
		{
			actionName: 'Notification Details',
			actionHandler: handleViewClick,
			isHidden: false,
			icon: ICON_CLASS.view,
			iconColor: TEXT_COLORS.info,
		},
	];

	const buttonActionList = <ButtonList buttonList={buttonList} />;

	const columns = useMemo(
		() => [
			// {
			// 	Header: 'ID',
			// 	accessor: 'id',
			// 	notHidable: true,
			// 	// filterable: true,
			// 	Cell: ({ cell }) => <Id value={cell.value} />,
			// },
			{
				Header: 'Title',
				accessor: 'titleEN',
				// filterable: true,
				Cell: ({ cell }) => <KeyValueCell value={cell.value} />,
			},
			{
				Header: 'Description',
				accessor: 'descriptionEN',
				// filterable: true,
				Cell: ({ cell }) => (
					<KeyValueCell value={cell.value} id={cell?.row?.original?.id} />
				),
			},
			// {
			// 	Header: 'Status',
			// 	accessor: 'isActive',
			// 	disableSortBy: true,
			// 	disableFilters: true,
			// 	Cell: ({ cell }) => <Status value={cell.value} />,
			// },
			{
				Header: 'ACTION',
				accessor: 'actions',
				disableSortBy: true,
				disableFilters: true,
				Cell: ({ cell }) => <Actions actionsList={actionsList} cell={cell} />,
			},
		],
		[permissions]
	);

	return {
		currentPage,
		setCurrentPage,
		totalNotificationCount: notifications?.totalPages,
		isNotificationLoading,
		formattedNotifications,
		itemsPerPage,
		onChangeRowsPerPage,
		buttonActionList,
		columns,
	};
};

export default useNotificationListing;
