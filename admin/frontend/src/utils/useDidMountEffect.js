import { useRef, useEffect } from 'react';

export const useDidMountEffect = () => {
	const isInitialRender = useRef(true);

	useEffect(() => {
		isInitialRender.current = false;
	}, []);

	return isInitialRender.current;
};

export default useDidMountEffect;
