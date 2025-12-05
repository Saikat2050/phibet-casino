import { useSelector } from 'react-redux';

const usePlayerOptions = () => {
	const { userTags } = useSelector((state) => state.UserDetails);
	return [
		{ label: 'Real', value: '' },
		{
			label: 'Internal',
			value: userTags?.tags?.find(({ tag }) =>
				tag?.toLowerCase()?.includes('internal')
			)?.id,
		},
	];
};

export default usePlayerOptions;
