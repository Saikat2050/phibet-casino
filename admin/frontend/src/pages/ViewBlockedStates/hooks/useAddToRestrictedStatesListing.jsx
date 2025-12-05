/* eslint-disable react/prop-types */
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
	addRestrictedStatesStart,
	fetchStatesStart,
} from '../../../store/actions';
import { KeyValueCell } from '../RestrictedStatesListCol';
import ActionButtons from '../ActionButtons';
import { modules } from '../../../constants/permissions';
import ButtonList from '../../../components/Common/ButtonList';
import { debounceTime } from '../../../constants/config';

let debounce;
const useAddToRestrictedStatesListing = (unrestrictedStates = []) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { state: casinoState } = useLocation();
	const paramId = useParams();
	const [searchString, setSearchString] = useState('');
	const { addToRestrictedStatesLoading } = useSelector(
		(state) => state.RestrictedStates
	);

	const id =
		casinoState?.type === 'providers'
			? paramId?.casinoProviderId
			: paramId?.casinoGameId;

	const [unrestrictedStatesState, setUnrestrictedStatesState] = useState([]);
	const [selectedStatesState, setSelectedStatesState] = useState([]);

	const onAddState = (cell) => {
		setSelectedStatesState((prev) => [...prev, cell]);
		setUnrestrictedStatesState((prev) =>
			prev.filter((state) => state.id !== cell.id)
		);
	};

	const onRemoveState = (cell) => {
		setSelectedStatesState((prev) =>
			prev.filter((state) => state.id !== cell.id)
		);
		setUnrestrictedStatesState((prev) => [...prev, cell]);
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
					<ActionButtons handleStatus={onAddState} row={cell.row} />
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
						handleStatus={onRemoveState}
						row={cell.row}
					/>
				),
			},
		],
		[]
	);

	useEffect(() => {
		if (unrestrictedStates?.length) {
			setUnrestrictedStatesState(unrestrictedStates);
		} else setUnrestrictedStatesState([]);
	}, [unrestrictedStates]);

	const onSubmitSelected = () => {
		const states = selectedStatesState.map((g) => g.code);
		const key = casinoState?.type === 'providers' ? 'providerId' : 'gameId';
		dispatch(
			addRestrictedStatesStart({
				data: {
					type: casinoState?.type,
					stateCodes: states,
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
			disabled: addToRestrictedStatesLoading,
		},
	];

	const actionList = <ButtonList buttonList={buttonList} />;

	const fetchUnrestrictedStates = (inputString) => {
		dispatch(
			fetchStatesStart({
				...{ searchString: inputString },
			})
		);
	};

	useEffect(() => {
		debounce = setTimeout(() => {
			fetchUnrestrictedStates(searchString);
		}, debounceTime);

		return () => clearTimeout(debounce);
	}, [searchString]);

	return {
		columns,
		unrestrictedStatesState,
		selectedStatesState,
		selectedTableColumns,
		onSubmitSelected,
		addToRestrictedStatesLoading,
		searchString,
		setSearchString,
		actionList,
	};
};

export default useAddToRestrictedStatesListing;
