// import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
// import { Link } from 'react-router-dom';
// import Logo from '../../assets/images/logo.png';

import withRouter from '../Common/withRouter';
// i18n
import SidebarContent from './SidebarContent';
import BottomAction from './BottomActions';

const Sidebar = () => {
	// const leftSideBarTheme = useSelector(
	// 	(state) => state.Layout.leftSideBarTheme
	// );
	const [isSidebar, setIsSidebar] = useState(true);

	const toggleSidebar = () => {
		setIsSidebar(!isSidebar);
	};

	return (
		<>
			{!isSidebar && (
				<div className="fixed hidden max-sm:block top-4 left-4 z-50">
					<button
						type="button"
						onClick={toggleSidebar}
						className="HamburgerLogo"
						id="vertical-menu-btn"
						aria-label="Open sidebar"
					>
						<i className="fa fa-fw fa-bars" />
					</button>
				</div>
			)}

			{isSidebar && (
				<div className="vertical-menu transition-all duration-300">
					<div className="navbar-brand-box flex justify-between items-center">
						{/* <Link
							to="/"
						>
							
							<span className="logo-lg" style={{ display: 'block' }}>
								{leftSideBarTheme === 'light' ? (
									<img
										src={Logo}
										style={{ height: '92px', width: '115px' }}
										className="logoImg"
										alt=""
									/>
								) : (
									<img src={Logo} className="logoImg" alt="" />
								)}
							</span>
						</Link> */}

						<button
							type="button"
							className="sideBarCloseButton"
							onClick={toggleSidebar}
							aria-label="Close sidebar"
						>
							<i className="fa fa-fw fa-times" />
						</button>
					</div>

					<div data-simplebar className="h-100" id="left-side-bar-id">
						<SidebarContent />
					</div>

					<div className="sidebar-background" />
					<BottomAction />
				</div>
			)}
		</>
	);
};

Sidebar.defaultProps = {
	// type: '',
};

Sidebar.propTypes = {
	// type: PropTypes.string,
};

const mapStatetoProps = (state) => ({
	layout: state.Layout,
});
export default connect(
	mapStatetoProps,
	{}
)(withRouter(withTranslation()(Sidebar)));
