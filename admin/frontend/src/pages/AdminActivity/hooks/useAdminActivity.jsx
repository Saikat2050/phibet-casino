/* eslint-disable react/prop-types */
import { useDispatch, useSelector } from 'react-redux';
import { React, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Name, TextField } from '../AdminActivityColList';
import { modules } from '../../../constants/permissions';
import usePermission from '../../../components/Common/Hooks/usePermission';
import { fetchAdminActivity } from '../../../store/actions';
import { getDateTimeInCT } from '../../../utils/dateFormatter';
import { capitalizeFirstLetter } from '../../../helpers/common';

const useSegmentation = (filterValues = {}) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { adminUserId } = useParams();
	const { permissions } = usePermission();

	const { adminActivityData, loading } = useSelector(
		(state) => state.adminActivity
	);

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

	const [itemsPerPage, setItemsPerPage] = useState(10);
	const [currentPage, setCurrentPage] = useState(1);

	// useEffect(() => {
	// 	dispatch(fetchAdminActivity());
	// }, []);

	useEffect(() => {
		dispatch(
			fetchAdminActivity({
				perPage: itemsPerPage,
				page: currentPage,
				adminUserId,
				...filterValues,
			})
		);
	}, [itemsPerPage, currentPage]);

	const formattedAdminData = useMemo(
		() =>
			adminActivityData?.data?.adminActivities?.map((data) => ({
				...data,
				id: data?.id,
				action: capitalizeFirstLetter(data?.action),
				category: capitalizeFirstLetter(data?.category),
				modifiedData: data?.modifiedData,
				previousData: data?.previousData,
				lastModified: getDateTimeInCT(data?.updatedAt),
			})) || [],
		[adminActivityData]
	);

	const onChangeRowsPerPage = (value) => {
		setCurrentPage(1);
		setItemsPerPage(value);
	};

	const columns = useMemo(
		() => [
			{
				Header: 'Category',
				accessor: 'category',
				filterable: true,
				Cell: ({ cell }) => <TextField value={cell?.value} />,
			},
			{
				Header: 'Action',
				accessor: 'action',
				filterable: true,
				Cell: ({ cell }) => <TextField value={cell.value} />,
			},
			{
				Header: 'Previous Data',
				accessor: 'previousData',
				filterable: true,
				Cell: ({ cell }) => <Name val={cell?.value} />,
			},
			{
				Header: 'Modified Data',
				accessor: 'modifiedData',
				filterable: true,
				Cell: ({ cell }) => <Name val={cell?.value} />,
			},
			{
				Header: 'Last Modified',
				accessor: 'lastModified',
				filterable: true,
				Cell: ({ cell }) => <TextField value={cell.value} />,
			},
		],
		[formattedAdminData, permissions]
	);

	return {
		columns,
		buttonList,
		formattedAdminData,
		itemsPerPage,
		totalPlayerPages: adminActivityData?.data?.totalPages,
		setCurrentPage,
		currentPage,
		onChangeRowsPerPage,
		loading,
	};
};

export default useSegmentation;
