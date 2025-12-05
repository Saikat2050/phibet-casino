import React from 'react';
import PropTypes from 'prop-types';

class NodeLabel extends React.PureComponent {
	render() {
		const { nodeDatum, toggleNode, layoutModeType } = this.props;
		const textColor = layoutModeType === 'dark' ? '#ffffff' : '#c48e48';
		return (
			<g onClick={() => toggleNode(nodeDatum)}>
				<circle r={15} fill="#c48e48" stroke="white" strokeWidth={3} />
				<text
					strokeWidth="0"
					x="20"
					y="4"
					fill={textColor}
					fontSize="18px"
					className="fas"
					style={{
						textShadow: layoutModeType === 'dark' ? '1px 1px 2px #000' : 'none',
					}}
				>
					{nodeDatum?.isInitial ? '' : '\uf007'}
				</text>

				<text
					strokeWidth="0"
					x={nodeDatum?.isInitial ? '25' : '40'}
					y="4"
					fill={textColor}
					fontSize="18px"
					className="fas"
					style={{
						textShadow: layoutModeType === 'dark' ? '1px 1px 2px #000' : 'none',
					}}
				>
					{nodeDatum?.name}
				</text>
			</g>
		);
	}
}

NodeLabel.defaultProps = {
	nodeDatum: {},
	toggleNode: () => {},
	layoutModeType: '',
};

NodeLabel.propTypes = {
	nodeDatum: PropTypes.objectOf,
	toggleNode: PropTypes.func,
	layoutModeType: PropTypes.string,
};

export default NodeLabel;
