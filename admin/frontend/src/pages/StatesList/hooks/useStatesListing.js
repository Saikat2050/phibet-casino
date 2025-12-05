import { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchStatesStart, resetStatesData } from '../../../store/actions';

const useStatesListing = (filterValues = {}) => {
	const dispatch = useDispatch();
	const [itemsPerPage, setItemsPerPage] = useState(10);
	const [currentPage, setCurrentPage] = useState(1);
	const { states, loading: isStatesLoading } = useSelector(
		(state) => state.States
	);

	const fetchData = () =>
		dispatch(
			fetchStatesStart({
				perPage: itemsPerPage,
				page: currentPage,
				...filterValues,
			})
		);

	useEffect(() => {
		fetchData();
	}, [currentPage, itemsPerPage]);

	// resetting state list redux state
	useEffect(() => () => dispatch(resetStatesData()), []);

	const onChangeRowsPerPage = (value) => {
		setItemsPerPage(value);
	};

	const formattedStates = useMemo(() => {
		const formattedValues = [];
		if (states) {
			states.states?.map((state) =>
				formattedValues.push({
					...state,
					stateName: state.name,
					language: state.language?.name,
					stateCode: state.code,
				})
			);
		}
		return formattedValues;
	}, [states]);

	return {
		currentPage,
		setCurrentPage,
		totalStatesCount: states?.totalPages,
		isStatesLoading,
		formattedStates,
		itemsPerPage,
		onChangeRowsPerPage,
	};
};

export default useStatesListing;
