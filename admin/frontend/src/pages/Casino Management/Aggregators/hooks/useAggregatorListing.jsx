import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from 'reselect';
import {
	getAggregatorsList,
	resetAggregatorsList,
} from '../../../../store/actions';
import useAggregatorList from './useAggregatorList';

const useAggregatorListing = (handleStatus) => {
	const [itemsPerPage, setItemsPerPage] = useState(10);
	const [currentPage, setCurrentPage] = useState(1);

	const onChangeRowsPerPage = (value) => {
		setCurrentPage(1);
		setItemsPerPage(value);
	};

	const dispatch = useDispatch();
	const fetchData = () => {
		dispatch(
			getAggregatorsList({
				perPage: itemsPerPage,
				page: currentPage,
			})
		);
	};

	useEffect(() => {
		fetchData();
	}, [currentPage, itemsPerPage]);

	const selectAggregatorsState = (state) => state.AggregatorsReducer;
	const columns = useAggregatorList(handleStatus);
	const AggregatorsProperties = createSelector(
		selectAggregatorsState,
		(aggregatorsReducer) => ({
			aggregatorsData: aggregatorsReducer.aggregatorsData,
			loading: aggregatorsReducer.loading,
			isCreateAggregatorSuccess: aggregatorsReducer.isCreateAggregatorSuccess,
		})
	);
	const { aggregatorsData, loading, isCreateAggregatorSuccess } = useSelector(
		AggregatorsProperties
	);

	useEffect(() => {
		if (isCreateAggregatorSuccess) fetchData();
	}, [isCreateAggregatorSuccess]);

	// resetting aggregator list redux state
	useEffect(() => () => dispatch(resetAggregatorsList()), []);

	return {
		onChangeRowsPerPage,
		columns,
		aggregatorsData,
		itemsPerPage,
		setCurrentPage,
		currentPage,
		loading,
	};
};

export default useAggregatorListing;
