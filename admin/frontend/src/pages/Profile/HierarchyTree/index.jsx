import React from 'react';
import Tree from 'react-d3-tree';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import NodeLabel from './NodeLabel';

const HierarchyTree = ({ adminDetails }) => {
	const { adminChildren } = useSelector((state) => state.AllAdmins);
	const layoutModeType = useSelector((_) => _.Layout.layoutModeType);

	const containerStyles = {
		width: '100%',
		height: '100vh',
	};

	return (
		<div style={containerStyles}>
			{adminDetails && adminChildren && (
				<Tree
					data={adminChildren}
					orientation="vertical"
					translate={{ x: 550, y: 100 }}
					collapsible
					separation={{ siblings: 1.3, nonSiblings: 2 }}
					renderCustomNodeElement={({ nodeDatum, toggleNode }) => (
						<NodeLabel
							nodeDatum={nodeDatum}
							toggleNode={toggleNode} // pass toggleNode instead
							layoutModeType={layoutModeType}
						/>
					)}
				/>
			)}
		</div>
	);
};

HierarchyTree.defaultProps = {
	adminDetails: {},
};

HierarchyTree.propTypes = {
	adminDetails: PropTypes.objectOf(),
};

export default HierarchyTree;
