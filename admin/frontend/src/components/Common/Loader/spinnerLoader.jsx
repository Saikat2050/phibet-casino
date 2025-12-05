import React from 'react';
import { DivSpinnerLoaderConainer } from './style';

const SpinnerLoader = () => (
	<DivSpinnerLoaderConainer className="d-flex justify-content-center small-loader">
		<div
			className="spinner-grow spinner-grow-sm spinner-border-sm"
			role="status"
		>
			<span className="sr-only">Loading...</span>
		</div>
		<div
			className="spinner-grow spinner-grow-sm ml-2 spinner-border-sm"
			role="status"
		>
			<span className="sr-only">Loading...</span>
		</div>
		<div
			className="spinner-grow spinner-grow-sm ml-2 spinner-border-sm"
			role="status"
		>
			<span className="sr-only">Loading...</span>
		</div>
	</DivSpinnerLoaderConainer>
);

export default SpinnerLoader;
