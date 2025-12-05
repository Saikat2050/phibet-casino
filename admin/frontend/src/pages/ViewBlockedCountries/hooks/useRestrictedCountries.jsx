import { useEffect, useMemo } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCountriesStart } from '../../../store/actions';

const useRestrictedCountries = () => {
	const dispatch = useDispatch();
	const { state: casinoState } = useLocation();
	const paramId = useParams();
	const id =
		casinoState?.type === 'providers'
			? paramId?.casinoProviderId
			: paramId?.casinoGameId;

	const { countries } = useSelector((state) => state.Countries);

	useEffect(() => {
		if (!countries?.countries) {
			dispatch(fetchCountriesStart({}));
		}
	}, [id]);

	const {
		restricted: restrictedCountries,
		unrestricted: unrestrictedCountries,
	} = useMemo(() => {
		const restrictedCountryIds = casinoState?.restrictedCountries;
		const restricted = [];
		const unrestricted = [];
		if (countries?.countries) {
			countries?.countries?.forEach((country) => {
				if (restrictedCountryIds?.includes(country.code)) {
					restricted.push(country);
				} else {
					unrestricted.push(country);
				}
			});
		}
		return { restricted, unrestricted };
	}, [countries?.countries]);

	return {
		restrictedCountries,
		unrestrictedCountries,
	};
};

export default useRestrictedCountries;
