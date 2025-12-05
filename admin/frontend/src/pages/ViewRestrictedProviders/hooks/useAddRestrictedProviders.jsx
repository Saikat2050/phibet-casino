/* eslint-disable react/prop-types */
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, UncontrolledTooltip } from 'reactstrap';
import {
	addRestrictedItemsStart,
	fetchUnrestrictedItemsStart,
} from '../../../store/actions';
import { KeyValueCell, Status } from '../GamesListCol';
import { showToastr } from '../../../utils/helpers';

const useAddRestrictedProviders = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { countryId } = useParams();
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(10);
	const [addProvidersCurrentPage, setAddProvidersCurrentPage] = useState(1);
	const [addProvidersItemsPerPage, setAddProvidersItemsPerPage] = useState(10);
	const [selectedProviders, setSelectedProviders] = useState([]);

	const {
		unrestrictedItems: unrestrictedProviders,
		unrestrictedItemsLoading: unrestrictedProvidersLoading,
	} = useSelector((state) => state.Countries);

	useEffect(() => {
		dispatch(
			fetchUnrestrictedItemsStart({
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

	const onChangeAddProvidersRowsPerPage = (value) => {
		setAddProvidersItemsPerPage(value);
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

	const addRestrictedProvider = () => {
		const itemIds = selectedProviders?.map((g) => g.casinoProviderId);
		dispatch(
			addRestrictedItemsStart({
				data: { type: 'providers', itemIds, countryId },
				navigate,
			})
		);
	};

	const unrestrictedProviderscolumns = useMemo(
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

	const addProviderscolumns = useMemo(
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
		[unrestrictedProviders]
	);

	return {
		currentPage,
		setCurrentPage,
		itemsPerPage,
		setItemsPerPage,
		addProvidersCurrentPage,
		setAddProvidersCurrentPage,
		addProvidersItemsPerPage,
		setAddProvidersItemsPerPage,
		unrestrictedProviderscolumns,
		addProviderscolumns,
		selectedProviders,
		unrestrictedProvidersList: unrestrictedProviders?.rows || [],
		totalProvidersCount: unrestrictedProviders?.count || 0,
		unrestrictedProvidersLoading,
		onChangeRowsPerPage,
		onChangeAddProvidersRowsPerPage,
		addRestrictedProvider,
	};
};

export default useAddRestrictedProviders;
