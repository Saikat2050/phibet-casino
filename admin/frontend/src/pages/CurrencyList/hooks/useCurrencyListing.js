import { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCurrenciesStart } from '../../../store/actions';

const useCurrencyListing = () => {
	const dispatch = useDispatch();
	const {
		currencies,
		loading: isCurrenciesLoading,
		isCreateCurrencySuccess,
	} = useSelector((state) => state.Currencies);

	const fetchData = () => {
		dispatch(fetchCurrenciesStart());
	};

	useEffect(() => {
		fetchData();
	}, []);

	const formattedCurrencies = useMemo(() => {
		const formattedValues = [];
		if (currencies) {
			currencies?.currencies?.map((currency) =>
				formattedValues.push({
					...currency,
					primary: currency.isPrimary ? 'YES' : 'NO',
				})
			);
		}
		return formattedValues;
	}, [currencies]);

	useEffect(() => {
		if (isCreateCurrencySuccess) fetchData();
	}, [isCreateCurrencySuccess]);

	return {
		isCurrenciesLoading,
		formattedCurrencies,
	};
};

export default useCurrencyListing;
