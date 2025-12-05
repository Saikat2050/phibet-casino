import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const useButtonList = () => {
	const navigate = useNavigate();
	const handleAddClick = (e) => {
		e.preventDefault();
		navigate('add');
	};

	const buttonList = useMemo(() => [
		{
			label: 'Create',
			handleClick: handleAddClick,
			link: '#!',
			// module: modules.Bonus,
			operation: 'C',
		},
	]);
	return {
		buttonList,
	};
};

export default useButtonList;
