import React from 'react';
import { LoaderConainer } from './style';

const Loader = () => (
	<LoaderConainer className="d-flex justify-content-center">
		<div className="spinner-border text-dark" role="status">
			<span className="sr-only">Loading...</span>
		</div>
	</LoaderConainer>
);

export default Loader;
