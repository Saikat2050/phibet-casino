/* eslint-disable react/prop-types */
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addRestrictedStatesStart } from '../../../store/actions';
import { KeyValueCell, Status } from '../RestrictedStatesListCol';
import ActionButtons from '../ActionButtons';
import { modules } from '../../../constants/permissions';
import ButtonList from '../../../components/Common/ButtonList';

const useRemoveFromRestrictedStatesListing = (restrictedStates) => {
	const dispatch = useDispatch();
	const { state: casinoState } = useLocation();
	const navigate = useNavigate();
	const paramId = useParams();
	const id =
		casinoState?.type === 'providers'
			? paramId?.casinoProviderId
			: paramId?.casinoGameId;
	const { addToRestrictedStatesLoading } = useSelector(
		(state) => state.RestrictedStates
	);

	const [restrictedStatesState, setRestrictedStatesState] = useState([]);
	const [selectedStatesState, setSelectedStatesState] = useState([]);

	const onAddState = (cell) => {
		setSelectedStatesState((prev) => [...prev, cell]);
		setRestrictedStatesState((prev) =>
			prev.filter((state) => state.id !== cell.id)
		);
	};

	const onRemoveState = (cell) => {
		setSelectedStatesState((prev) =>
			prev.filter((state) => state.id !== cell.id)
		);
		setRestrictedStatesState((prev) => [...prev, cell]);
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
						handleStatus={onRemoveState}
						row={cell.row}
					/>
				),
			},
		],
		[]
	);

	useEffect(() => {
		if (restrictedStates.length) {
			setRestrictedStatesState(restrictedStates);
		} else setRestrictedStatesState([]);
	}, [restrictedStates]);

	const onSubmitSelected = () => {
		const states = selectedStatesState.map((g) => g.code);
		const key = casinoState?.type === 'providers' ? 'providerId' : 'gameId';
		dispatch(
			addRestrictedStatesStart({
				data: {
					type: casinoState?.type,
					stateCodes: states,
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
			disabled: addToRestrictedStatesLoading,
		},
	];

	const actionList = <ButtonList buttonList={buttonList} />;

	return {
		restrictedStatesState,
		columns,
		selectedStatesState,
		selectedTableColumns,
		onSubmitSelected,
		addToRestrictedStatesLoading,
		actionList,
	};
};

export default useRemoveFromRestrictedStatesListing;
