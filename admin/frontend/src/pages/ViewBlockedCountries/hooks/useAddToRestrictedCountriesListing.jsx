/* eslint-disable react/prop-types */
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addRestrictedCountriesStart } from '../../../store/actions';
import { KeyValueCell } from '../RestrictedCountriesListCol';
import ActionButtons from '../ActionButtons';
import { modules } from '../../../constants/permissions';
import ButtonList from '../../../components/Common/ButtonList';

const useAddToRestrictedCountriesListing = (unrestrictedCountries = []) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { state: casinoState } = useLocation();
	const paramId = useParams();
	const [searchString, setSearchString] = useState('');
	const { addToRestrictedCountriesLoading } = useSelector(
		(state) => state.RestrictedCountries
	);

	const id =
		casinoState?.type === 'providers'
			? paramId?.casinoProviderId
			: paramId?.casinoGameId;

	const [unrestrictedCountriesState, setUnrestrictedCountriesState] = useState(
		[]
	);
	const [selectedCountriesState, setSelectedCountriesState] = useState([]);

	const onAddCountry = (cell) => {
		setSelectedCountriesState((prev) => [...prev, cell]);
		setUnrestrictedCountriesState((prev) =>
			prev.filter((country) => country.id !== cell.id)
		);
	};

	const onRemoveCountry = (cell) => {
		setSelectedCountriesState((prev) =>
			prev.filter((country) => country.id !== cell.id)
		);
		setUnrestrictedCountriesState((prev) => [...prev, cell]);
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
				Header: 'CODE',
				accessor: 'code',
				filterable: true,
				Cell: ({ cell }) => <KeyValueCell value={cell.value} />,
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
				Header: 'CODE',
				accessor: 'code',
				filterable: true,
				Cell: ({ cell }) => <KeyValueCell value={cell.value} />,
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
		if (unrestrictedCountries?.length) {
			setUnrestrictedCountriesState(() => {
				if (searchString?.length > 1) {
					const searchStr = searchString;
					return unrestrictedCountries?.filter(({ code, name }) =>
						`${code?.toLowerCase()} ${name?.toLowerCase()}`?.includes(
							searchStr?.toLowerCase()
						)
					);
				}
				return unrestrictedCountries;
			});
		} else setUnrestrictedCountriesState([]);
	}, [unrestrictedCountries, searchString]);

	const onSubmitSelected = () => {
		const countries = selectedCountriesState.map((g) => g.code);
		const key = casinoState?.type === 'providers' ? 'providerId' : 'gameId';
		dispatch(
			addRestrictedCountriesStart({
				data: {
					type: casinoState?.type,
					countryCodes: countries,
					[key]: id,
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
		columns,
		unrestrictedCountriesState,
		selectedCountriesState,
		selectedTableColumns,
		onSubmitSelected,
		addToRestrictedCountriesLoading,
		searchString,
		setSearchString,
		actionList,
	};
};

export default useAddToRestrictedCountriesListing;
