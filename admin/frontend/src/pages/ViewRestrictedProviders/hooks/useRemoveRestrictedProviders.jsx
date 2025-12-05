/* eslint-disable react/prop-types */
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, UncontrolledTooltip } from 'reactstrap';
import {
	fetchRestrictedItemsStart,
	removeRestrictedItemsStart,
} from '../../../store/actions';
import { KeyValueCell, Status } from '../GamesListCol';
import { showToastr } from '../../../utils/helpers';

const useRemoveRestrictedProviders = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { countryId } = useParams();
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(10);
	const [removeProvidersCurrentPage, setRemoveProvidersCurrentPage] =
		useState(1);
	const [removeProvidersItemsPerPage, setRemoveProvidersItemsPerPage] =
		useState(10);
	const [selectedProviders, setSelectedProviders] = useState([]);

	const {
		restrictedItems: restrictedProviders,
		restrictedItemsLoading: restrictedProvidersLoading,
	} = useSelector((state) => state.Countries);

	useEffect(() => {
		dispatch(
			fetchRestrictedItemsStart({
				countryId,
				perPage: itemsPerPage,
				page: currentPage,
				type: 'providers',
			})
		);
	}, [countryId, currentPage, itemsPerPage]);

	const onChangeRowsPerPage = (value) => {
		setItemsPerPage(value);
	};

	const handleAddProvider = (row) => {
		setSelectedProviders((prevData) => {
			if (
				!prevData.find(
					(provider) => provider.casinoProviderId === row.casinoProviderId
				)
			) {
				return [...prevData, row];
			}
			showToastr({
				message: 'Provider already added',
				type: 'error',
			});
			return prevData;
		});
	};

	const handleRemoveProvider = (casinoProviderId) => {
		setSelectedProviders((prevData) =>
			prevData.filter(
				(provider) => provider.casinoProviderId !== casinoProviderId
			)
		);
	};

	const onChangeRemoveProvidersRowsPerPage = (value) => {
		setRemoveProvidersItemsPerPage(value);
	};

	const removeRestrictedProviders = () => {
		const itemIds = selectedProviders?.map((g) => g.casinoProviderId);
		dispatch(
			removeRestrictedItemsStart({
				data: { type: 'providers', itemIds, countryId: Number(countryId) },
				navigate,
			})
		);
	};

	const restrictedProviderscolumns = useMemo(
		() => [
			{
				Header: 'ID',
				accessor: 'casinoProviderId',
				filterable: true,
				Cell: ({ cell }) => <KeyValueCell value={cell.value} />,
			},
			{
				Header: 'NAME',
				accessor: 'name',
				filterable: true,
				Cell: ({ cell }) => <KeyValueCell value={cell.value} />,
			},
			{
				Header: 'STATUS',
				accessor: 'isActive',
				filterable: true,
				disableSortBy: true,
				Cell: ({ cell }) => <Status value={cell.value} />,
			},
			{
				Header: 'ACTIONS',
				accessor: 'actions',
				disableSortBy: true,
				Cell: ({ cell }) => {
					const casinoProviderId = cell?.row?.original?.casinoProviderId;
					return (
						<ul className="list-unstyled hstack gap-1 mb-0">
							<li data-bs-toggle="tooltip" data-bs-placement="top">
								<Button
									type="button"
									className="btn btn-sm btn-soft-success"
									onClick={(e) => {
										e.preventDefault();
										handleAddProvider(cell?.row?.original);
									}}
								>
									<i
										className="mdi mdi-plus-box"
										id={`plus-${casinoProviderId}`}
									/>
									<UncontrolledTooltip
										placement="top"
										target={`plus-${casinoProviderId}`}
									>
										Add this Game
									</UncontrolledTooltip>
								</Button>
							</li>
						</ul>
					);
				},
			},
		],
		[]
	);

	const removeProviderscolumns = useMemo(
		() => [
			{
				Header: 'ID',
				accessor: 'casinoProviderId',
				filterable: true,
				Cell: ({ cell }) => <KeyValueCell value={cell.value} />,
			},
			{
				Header: 'NAME',
				accessor: 'name',
				filterable: true,
				Cell: ({ cell }) => <KeyValueCell value={cell.value} />,
			},
			{
				Header: 'STATUS',
				accessor: 'isActive',
				filterable: true,
				disableSortBy: true,
				Cell: ({ cell }) => <Status value={cell.value} />,
			},
			{
				Header: 'ACTIONS',
				accessor: 'actions',
				disableSortBy: true,
				Cell: ({ cell }) => {
					const casinoProviderId = cell?.row?.original?.casinoProviderId;
					return (
						<ul className="list-unstyled hstack gap-1 mb-0">
							<li data-bs-toggle="tooltip" data-bs-placement="top" title="View">
								<Button
									type="button"
									className="btn btn-sm btn-soft-danger"
									onClick={(e) => {
										e.preventDefault();
										handleRemoveProvider(casinoProviderId);
									}}
								>
									<i
										className="mdi mdi-minus-box"
										id={`minus-${casinoProviderId}`}
									/>
									<UncontrolledTooltip
										placement="top"
										target={`minus-${casinoProviderId}`}
									>
										Remove this Game
									</UncontrolledTooltip>
								</Button>
							</li>
						</ul>
					);
				},
			},
		],
		[]
	);

	return {
		currentPage,
		setCurrentPage,
		itemsPerPage,
		setItemsPerPage,
		removeProvidersCurrentPage,
		setRemoveProvidersCurrentPage,
		removeProvidersItemsPerPage,
		setRemoveProvidersItemsPerPage,
		restrictedProviderscolumns,
		removeProviderscolumns,
		restrictedProvidersList: restrictedProviders?.rows || [],
		totalProvidersCount: restrictedProviders?.count || 0,
		restrictedProvidersLoading,
		onChangeRowsPerPage,
		onChangeRemoveProvidersRowsPerPage,
		selectedProviders,
		removeRestrictedProviders,
	};
};

export default useRemoveRestrictedProviders;
