import { useEffect, useMemo } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchStatesStart } from '../../../store/actions';

const useRestrictedStates = () => {
	const dispatch = useDispatch();
	const { state: casinoState } = useLocation();

	const paramId = useParams();
	const id =
		casinoState?.type === 'providers'
			? paramId?.casinoProviderId
			: paramId?.casinoGameId;

	const { states } = useSelector((state) => state.States);

	useEffect(() => {
		if (!states?.states) {
			dispatch(fetchStatesStart({}));
		}
	}, [id]);

	const { restricted: restrictedStates, unrestricted: unrestrictedStates } =
		useMemo(() => {
			const restrictedStateIds = casinoState?.restrictedStates;
			const restricted = [];
			const unrestricted = [];
			if (states?.states) {
				states?.states?.forEach((state) => {
					if (restrictedStateIds?.includes(state.id)) {
						restricted.push(state);
					} else {
						unrestricted.push(state);
					}
				});
			}
			return { restricted, unrestricted };
		}, [states?.states]);

	return {
		restrictedStates,
		unrestrictedStates,
	};
};

export default useRestrictedStates;
