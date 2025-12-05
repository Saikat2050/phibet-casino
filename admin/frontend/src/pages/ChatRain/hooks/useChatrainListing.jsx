/* eslint-disable react/prop-types */
import React, { useMemo, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getChatrain } from '../../../store/actions';
import { Id, Title, Status } from '../ChatrainListCol';
import ActionButtons from '../ActionButtons';

const useChatrainListing = (filterValues = {}) => {
	const [itemsPerPage, setItemsPerPage] = useState(10);
	const [page, setPage] = useState(1);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { chatRain, isLoading } = useSelector((state) => state.Chatrain);

	const onChangeRowsPerPage = (value) => {
		setItemsPerPage(value);
		setPage(1);
	};

	const formattedChatrain = useMemo(() => chatRain?.chatRains, [chatRain]);

	const fetchData = () => {
		const { ...rest } = filterValues;
		dispatch(
			getChatrain({
				perPage: itemsPerPage,
				page,
				...rest,
			})
		);
	};

	useEffect(() => {
		fetchData();
	}, [page, itemsPerPage]);

	const handleView = (props) => {
		navigate(`/chat/chat-rain/${props?.chatGroupId}`, {
			state: { chatRainDetails: props },
		});
	};

	const columns = useMemo(
		() => [
			{
				Header: 'ID',
				accessor: 'id',
				filterable: true,
				Cell: ({ cell }) => <Id value={cell.value} />,
			},
			{
				Header: 'Name',
				accessor: 'name',
				filterable: true,
				Cell: ({ cell }) => <Title value={cell.value} />,
			},
			{
				Header: 'Closed',
				accessor: 'isClosed',
				filterable: true,
				Cell: ({ cell }) => <Status value={cell.value} />,
			},
			{
				Header: 'Amount',
				accessor: 'prizeMoney',
				filterable: true,
				Cell: ({ cell }) => <Title value={cell.value} />,
			},
			{
				Header: 'Currency',
				accessor: 'currency',
				filterable: true,
				Cell: ({ cell }) => <Title value={cell.value?.code} />,
			},
			{
				Header: 'ACTION',
				accessor: 'action',
				disableSortBy: true,
				disableFilters: true,
				Cell: ({ cell }) => (
					<ActionButtons
						row={cell.row}
						// handleStatus={handleStatus}
						handleView={handleView}
						// handleDelete={handleDelete}
					/>
				),
			},
		],
		[]
	);

	return {
		formattedChatrain,
		chatRain,
		isLoading,
		page,
		setPage,
		totalCount: chatRain?.totalPages,
		itemsPerPage,
		onChangeRowsPerPage,
		columns,
	};
};

export default useChatrainListing;
