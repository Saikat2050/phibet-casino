import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const BackButton = ({ customMb }) => {
	const navigate = useNavigate();
	const onBackClick = () => navigate(-1);

	return (
		<h4
			className={`mb-0 ms-2 font-size-16 mb-${customMb}`}
			role="presentation"
			style={{ cursor: 'pointer' }}
			onClick={onBackClick}
		>
			<>
				<i className="fas fa-angle-left" /> BACK
			</>
		</h4>
	);
};

BackButton.defaultProps = {
	customMb: 2,
};

BackButton.propTypes = {
	customMb: PropTypes.number,
};

export default memo(BackButton);
