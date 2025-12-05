/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { modules } from '../../../constants/permissions';
import { getAllPackages, reorderPackage } from '../../../store/actions';

const useReorderPackages = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { packages, isPackagesLoading } = useSelector(
		(state) => state.Packages
	);

	const [state, setState] = useState({ rows: [], count: 0 });

	const fetchData = () => {
		dispatch(
			getAllPackages({
				reorder: true,
			})
		);
	};

	useEffect(() => {
		fetchData();
	}, []);

	useEffect(() => {
		if (packages?.length) {
			setState({
				rows: packages,
				count: packages?.length || 0,
			});
		}
	}, [packages]);

	const formattedState = useMemo(
		() =>
			state?.rows?.map((item) => ({
				reorderId: item?.id,
				lable: item.lable,
				amount: item.amount,
				isActive: item.isActive,
			})),
		[state.rows]
	);

	const handleSave = () => {
		const row = [];
		state?.rows?.map((list) => row.push(list.id));
		dispatch(
			reorderPackage({
				values: { packageIds: row },
				navigate,
			})
		);
	};

	const buttonList = [
		{
			label: 'Save',
			handleClick: handleSave,
			link: '#!',
			module: modules.package,
			operation: 'U',
		},
	];

	return {
		state,
		setState,
		buttonList,
		handleSave,
		formattedState,
		isPackagesLoading,
	};
};

export default useReorderPackages;
