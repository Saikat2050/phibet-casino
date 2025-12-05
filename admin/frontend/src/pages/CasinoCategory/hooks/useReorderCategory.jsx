import { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import {
	getCasinoCategoryDetailStart,
	reorderCasinoCategoryStart,
} from '../../../store/casinoManagement/actions';
import { selectedLanguage } from '../../../constants/config';
import { modules } from '../../../constants/permissions';

const useReorderCategory = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();
	const { casinoCategoryDetails, iscasinoCategoryDetailsLoading } = useSelector(
		(state) => state.CasinoManagementData
	);
	const [state, setState] = useState({ rows: [], count: 0 });

	const isLobby = '/categories/reorder/lobby' === location.pathname
	const fetchData = () => {
		if (isLobby) {
			dispatch(getCasinoCategoryDetailStart({ isLobbyPage: true }));
		} else {
			dispatch(getCasinoCategoryDetailStart({ isSidebar: true }));
		}
	};

	let title = "Reorder Lobby Category"
	if(!isLobby) title = "Reorder Sidebar Category"

	useEffect(() => {
		fetchData();
	}, []);

	useEffect(() => {
		if (casinoCategoryDetails?.categories) {
			setState({
				rows: casinoCategoryDetails?.categories,
				count: casinoCategoryDetails?.categories?.length || 0,
			});
		}
	}, [casinoCategoryDetails]);

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
			reorderCasinoCategoryStart({
				data: { categoryIds: row },
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
		iscasinoCategoryDetailsLoading,
		buttonList,
		formattedState,
		title,
	};
};

export default useReorderCategory;
