/* eslint-disable react/prop-types */
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addRestrictedCountriesStart } from '../../../store/actions';
import { KeyValueCell, Status } from '../RestrictedCountriesListCol';
import ActionButtons from '../ActionButtons';
import { modules } from '../../../constants/permissions';
import ButtonList from '../../../components/Common/ButtonList';

const useRemoveFromRestrictedCountriesListing = (restrictedCountries) => {
	const dispatch = useDispatch();
	const { state: casinoState } = useLocation();
	const navigate = useNavigate();
	const paramId = useParams();
	const id =
		casinoState?.type === 'providers'
			? paramId?.casinoProviderId
			: paramId?.casinoGameId;
	const { addToRestrictedCountriesLoading } = useSelector(
		(state) => state.RestrictedCountries
	);

	const [restrictedCountriesState, setRestrictedCountriesState] = useState([]);
	const [selectedCountriesState, setSelectedCountriesState] = useState([]);

	const onAddCountry = (cell) => {
		setSelectedCountriesState((prev) => [...prev, cell]);
		setRestrictedCountriesState((prev) =>
			prev.filter((country) => country.id !== cell.id)
		);
	};

	const onRemoveCountry = (cell) => {
		setSelectedCountriesState((prev) =>
			prev.filter((country) => country.id !== cell.id)
		);
		setRestrictedCountriesState((prev) => [...prev, cell]);
	};

	const columns = useMemo(
		() => [
			{
				Header: 'ID',
				accessor: 'id',
				notHidable: true,
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
				Header: 'Status',
				accessor: 'isActive',
				filterable: true,
				Cell: ({ cell }) => <Status value={cell.value} />,
			},
			{
				Header: 'ACTIONS',
				accessor: 'action',
				disableSortBy: true,
				filterable: false,
				Cell: ({ cell }) => (
					<ActionButtons handleStatus={onAddCountry} row={cell.row} />
				),
			},
		],
		[]
	);

	const selectedTableColumns = useMemo(
		() => [
			{
				Header: 'ID',
				accessor: 'id',
				notHidable: true,
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
				Header: 'Status',
				accessor: 'isActive',
				filterable: true,
				Cell: ({ cell }) => <Status value={cell.value} />,
			},
			{
				Header: 'ACTIONS',
				accessor: 'action',
				disableSortBy: true,
				filterable: false,
				Cell: ({ cell }) => (
					<ActionButtons
						type="remove"
						handleStatus={onRemoveCountry}
						row={cell.row}
					/>
				),
			},
		],
		[]
	);

	useEffect(() => {
		if (restrictedCountries.length) {
			setRestrictedCountriesState(restrictedCountries);
		} else setRestrictedCountriesState([]);
	}, [restrictedCountries]);

	const onSubmitSelected = () => {
		const countries = selectedCountriesState.map((g) => g.code);
		const key = casinoState?.type === 'providers' ? 'providerId' : 'gameId';
		dispatch(
			addRestrictedCountriesStart({
				data: {
					type: casinoState?.type,
					countryCodes: countries,
					[key]: id,
					operation: 'remove',
				},
				navigate,
			})
		);
	};

	const buttonList = [
		{
			label: 'Submit',
			link: '',
			handleClick: onSubmitSelected,
			module: modules.casinoManagement,
			operation: 'U',
			disabled: addToRestrictedCountriesLoading,
		},
	];

	const actionList = <ButtonList buttonList={buttonList} />;

	return {
		restrictedCountriesState,
		columns,
		selectedCountriesState,
		selectedTableColumns,
		onSubmitSelected,
		addToRestrictedCountriesLoading,
		actionList,
	};
};

export default useRemoveFromRestrictedCountriesListing;
