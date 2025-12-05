import React from 'react';
import PropTypes from 'prop-types';
import { Button, UncontrolledTooltip } from 'reactstrap';
import { useNavigate } from 'react-router-dom';

const ActionButtons = ({ row, handleView }) => {
	const navigate = useNavigate();
	const rainId = row?.original?.id;
	const chatRainId = row?.original?.chatRainId;

	const handleEdit = () =>
		navigate(`/chat/chat-rain/edit/${rainId}`, {
			state: { chatRainDetails: row?.original },
		});

	return (
		<ul className="list-unstyled hstack gap-1 mb-0">
			<li data-bs-toggle="tooltip" data-bs-placement="top" title="View">
				<Button
					className="btn btn-sm btn-soft-info"
					id={`viewToolTip-${chatRainId}`} // Unique ID for each button
					onClick={() => handleView(row?.original)}
				>
					<i className="mdi mdi-eye-outline" id={`view-${chatRainId}`} />
					<UncontrolledTooltip
						placement="top"
						target={`viewToolTip-${chatRainId}`}
					>
						View Chat Rain
					</UncontrolledTooltip>
				</Button>
			</li>

			{!row?.original?.isClosed && (
				<li>
					<Button
						className="btn btn-sm btn-soft-info"
						id={`editToolTip-${chatRainId}`} // Unique ID
						onClick={handleEdit}
					>
						<i className="mdi mdi-pencil-outline" />
						<UncontrolledTooltip
							placement="top"
							target={`editToolTip-${chatRainId}`}
						>
							Edit Chat Rain
						</UncontrolledTooltip>
					</Button>
				</li>
			)}
		</ul>
	);
};

// ✅ Define PropTypes
ActionButtons.propTypes = {
	row: PropTypes.shape({
		original: PropTypes.shape({
			id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
			chatRainId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
			isClosed: PropTypes.bool,
		}),
	}).isRequired,
	handleView: PropTypes.func.isRequired,
};

export default ActionButtons;
