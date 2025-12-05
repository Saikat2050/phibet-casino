import React from 'react';

const Preloader = () => (
	<div>
		<div id="status">
			<div className="spinner-chase">
				<div className="chase-dot" />
				<div className="chase-dot" />
				<div className="chase-dot" />
				<div className="chase-dot" />
				<div className="chase-dot" />
				<div className="chase-dot" />
			</div>
		</div>
	</div>
);

export default Preloader;
