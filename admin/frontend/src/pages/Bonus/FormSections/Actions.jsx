import React, { useMemo } from 'react';
import { Button } from 'reactstrap';
import PropTypes from 'prop-types';

const Actions = ({
	handleNextClick = () => {},
	submitButtonLoading = false,
	activeTab = '',
	toggleTab = () => {},
	tabsToShow = [],
	submitButtonText = '',
}) => {
	const currentTabIndex = useMemo(
		() => tabsToShow.findIndex((tab) => tab.id === activeTab),
		[tabsToShow, activeTab]
	);

	return (
		<div className="wizard clearfix">
			<div className="actions clearfix">
				<ul>
					<li>
						<Button
							disabled={currentTabIndex === 0 || submitButtonLoading}
							onClick={(e) => {
								e.preventDefault();
								toggleTab(
									currentTabIndex !== 0
										? tabsToShow[currentTabIndex - 1].id
										: ''
								);
							}}
						>
							Previous
						</Button>
					</li>
					<li>
						<Button
							disabled={submitButtonLoading}
							onClick={(e) => {
								e.preventDefault();
								handleNextClick(
									currentTabIndex !== tabsToShow.length - 1
										? tabsToShow[currentTabIndex + 1].id
										: 'submit'
								);
							}}
						>
							{submitButtonLoading && (
								<i className="bx bx-hourglass bx-spin font-size-16 align-middle me-2" />
							)}
							{currentTabIndex === tabsToShow.length - 1
								? submitButtonText || 'Submit'
								: 'Next'}
						</Button>
					</li>
				</ul>
			</div>
		</div>
	);
};

export default Actions;

Actions.defaultProps = {
	submitButtonText: 'Submit',
	submitButtonLoading: false,
};

Actions.propTypes = {
	activeTab: PropTypes.number.isRequired,
	toggleTab: PropTypes.func.isRequired,
	submitButtonText: PropTypes.string,
	submitButtonLoading: PropTypes.bool,
	handleNextClick: PropTypes.func.isRequired,
	// eslint-disable-next-line react/require-default-props
	tabsToShow: PropTypes.arrayOf(),
};
