/* eslint-disable react/destructuring-assignment */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

// Redux Store
import { withTranslation } from 'react-i18next';
import {
	showRightSidebarAction,
	toggleLeftmenu,
	changeSidebarType,
} from '../../store/actions';
// reactstrap

import ProfileMenu from '../CommonForBoth/TopbarDropdown/ProfileMenu';

// import images
import MegaMenu from '../CommonForBoth/TopbarDropdown/MegaMenu';

// i18n

const Header = (props) => {
	function toggleFullscreen() {
		if (
			!document.fullscreenElement &&
			/* alternative standard method */ !document.mozFullScreenElement &&
			!document.webkitFullscreenElement
		) {
			// current working methods
			if (document.documentElement.requestFullscreen) {
				document.documentElement.requestFullscreen();
			} else if (document.documentElement.mozRequestFullScreen) {
				document.documentElement.mozRequestFullScreen();
			} else if (document.documentElement.webkitRequestFullscreen) {
				document.documentElement.webkitRequestFullscreen(
					Element.ALLOW_KEYBOARD_INPUT
				);
			}
		} else if (document.cancelFullScreen) {
			document.cancelFullScreen();
		} else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} else if (document.webkitCancelFullScreen) {
			document.webkitCancelFullScreen();
		}
	}
	return (
		<header id="page-topbar">
			<div className="navbar-header">
				<div className="d-flex">
					<div className="navbar-brand-box">
						<Link to="/" className="logo">
							<span className="logo-sm">
								{/* <img
									src={logoDark}
									alt=""
									style={{ filter: 'invert(1)', height: '59px', width: '60px' }}
									height="20"
								/> */}
							</span>
							<span className="logo-lg">
								{/* <img
									src={logoDark}
									alt=""
									style={{ filter: 'invert(1)', height: '70px', width: '90px' }}
									height="30"
								/> */}
							</span>
						</Link>
					</div>

					<button
						type="button"
						className="btn btn-sm px-3 font-size-16 d-lg-none header-item"
						data-toggle="collapse"
						onClick={() => {
							props.toggleLeftmenu(!props.leftMenu);
						}}
						data-target="#topnav-menu-content"
					>
						<i className="fa fa-fw fa-bars" />
					</button>

					{/* <NavigationSearch /> */}

					<MegaMenu />
				</div>

				<div className="d-flex">
					{/* <div className="dropdown d-inline-block d-lg-none ms-2">
						<button
							type="button"
							className="btn header-item noti-icon "
							id="page-header-search-dropdown"
							onClick={() => setSearch(!isSearch)}
						>
							<i className="mdi mdi-magnify" />
						</button>
						<div
							className={
								isSearch
									? 'dropdown-menu dropdown-menu-lg dropdown-menu-end p-0 show'
									: 'dropdown-menu dropdown-menu-lg dropdown-menu-end p-0'
							}
							aria-labelledby="page-header-search-dropdown"
						>
							<form className="p-3">
								<div className="form-group m-0">
									<div className="input-group">
										<input
											type="text"
											className="form-control"
											placeholder="Search..."
											aria-label="Recipient's username"
										/>
										<div className="input-group-append">
											<button className="btn btn-primary" type="submit">
												<i className="mdi mdi-magnify" />
											</button>
										</div>
									</div>
								</div>
							</form>
						</div>
					</div> */}

					<div className="dropdown d-none d-lg-inline-block ms-1">
						<button
							type="button"
							className="btn header-item noti-icon "
							onClick={() => {
								toggleFullscreen();
							}}
							data-toggle="fullscreen"
						>
							<i className="bx bx-fullscreen" />
						</button>
					</div>

					<ProfileMenu />

					<div className="dropdown d-inline-block">
						<button
							onClick={() => {
								props.showRightSidebarAction(!props.showRightSidebar);
							}}
							type="button"
							className="btn header-item noti-icon right-bar-toggle "
						>
							<i className="bx bx-cog bx-spin" />
						</button>
					</div>
				</div>
			</div>
		</header>
	);
};

Header.defaultProps = {
	showRightSidebar: false,
	showRightSidebarAction: () => {},
	leftMenu: false,
	toggleLeftmenu: () => {},
};

Header.propTypes = {
	showRightSidebar: PropTypes.bool,
	showRightSidebarAction: PropTypes.func,
	leftMenu: PropTypes.bool,
	toggleLeftmenu: PropTypes.func,
};

const mapStatetoProps = (state) => {
	const { layoutType, showRightSidebar, leftMenu, leftSideBarType } =
		state.Layout;
	return { layoutType, showRightSidebar, leftMenu, leftSideBarType };
};

export default connect(mapStatetoProps, {
	showRightSidebarAction,
	toggleLeftmenu,
	changeSidebarType,
})(withTranslation()(Header));
