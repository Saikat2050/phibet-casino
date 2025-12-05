import React, { useMemo } from 'react';
import {
	Card,
	CardBody,
	Col,
	NavItem,
	NavLink,
	Row,
	TabContent,
	TabPane,
} from 'reactstrap';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const StepFormTabs = ({ tabsData, title, activeTab }) => {
	const tabsToShow = useMemo(
		() => tabsData.filter((tab) => !tab?.isHidden) || [],
		[tabsData]
	);

	return (
		<Row>
			<Col lg="12">
				<Card>
					<CardBody>
						<h4 className="card-title mb-4">{title}</h4>
						<div className="wizard clearfix">
							<div className="steps clearfix">
								<ul>
									{tabsToShow?.map((tab, idx) => (
										<NavItem
											className={classnames({ current: activeTab === tab.id })}
										>
											<NavLink
												className={classnames({
													current: activeTab === tab.id,
												})}
												onClick={() => {
													// toggleTab(tab.id);
												}}
											>
												<span className="number">{idx + 1}</span> {tab.title}
											</NavLink>
										</NavItem>
									))}
								</ul>
							</div>
							<div className="content clearfix">
								<TabContent activeTab={activeTab} className="body">
									{tabsToShow?.map((tab) => (
										<TabPane tabId={tab.id}>{tab.component}</TabPane>
									))}
								</TabContent>
							</div>
						</div>
					</CardBody>
				</Card>
			</Col>
		</Row>
	);
};

StepFormTabs.defaultProps = {
	//
};

StepFormTabs.propTypes = {
	title: PropTypes.string.isRequired,
	activeTab: PropTypes.number.isRequired,
	tabsData: PropTypes.arrayOf(
		PropTypes.objectOf(
			PropTypes.oneOfType([PropTypes.number, PropTypes.node, PropTypes.string])
		)
	).isRequired,
};

export default StepFormTabs;
