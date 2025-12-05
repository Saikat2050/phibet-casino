import { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
	getCasinoProvidersDataStart,
	reorderCasinoProviderStart,
} from '../../../store/casinoManagement/actions';
import { selectedLanguage } from '../../../constants/config';
import { modules } from '../../../constants/permissions';

const useReorderProvider = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { casinoProvidersData, isCasinoProvidersDataLoading } = useSelector(
		(state) => state.CasinoManagementData
	);
	const [state, setState] = useState({ rows: [], count: 0 });

	const fetchData = () => {
		dispatch(getCasinoProvidersDataStart({}));
	};

	useEffect(() => {
		fetchData();
	}, []);

	useEffect(() => {
		if (casinoProvidersData?.providers) {
			setState({
				rows: casinoProvidersData?.providers,
				count: casinoProvidersData?.providers?.length || 0,
			});
		}
	}, [casinoProvidersData]);

	const formattedState = useMemo(
		() =>
			state?.rows?.map((item) => ({
				reorderId: item?.id,
				name: item?.name[selectedLanguage],
				isActive: item?.isActive,
			})),
		[state.rows]
	);

	const handleSave = () => {
		const row = [];
		state?.rows?.map((list) => row.push(`${list.id}`));

		dispatch(
			reorderCasinoProviderStart({
				data: { providerIds: row },
				navigate,
			})
		);
	};

	const buttonList = [
		{
			label: 'Save',
			handleClick: handleSave,
			link: '#!',
			module: modules.casinoManagement,
			operation: 'U',
		},
	];

	return {
		state,
		setState,
		isCasinoProvidersDataLoading,
		casinoProvidersData,
		buttonList,
		formattedState,
	};
};

export default useReorderProvider;
