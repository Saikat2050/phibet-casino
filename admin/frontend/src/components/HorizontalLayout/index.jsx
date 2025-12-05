import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from 'reselect';
import { useLocation } from 'react-router-dom';
import withRouter from '../Common/withRouter';

// actions
import {
	changeLayout,
	changeTopbarTheme,
	changeLayoutWidth,
	showRightSidebarAction,
	changeLayoutMode,
} from '../../store/actions';

// redux

// components
import Navbar from './Navbar';
import Header from './Header';
import Footer from './Footer';
import RightSidebar from '../CommonForBoth/RightSidebar';

const Layout = ({ children }) => {
	const dispatch = useDispatch();

	const selectLayoutState = (state) => state.Layout;

	const selectLayoutProperties = createSelector(
		selectLayoutState,
		(layout) => ({
			topbarTheme: layout.topbarTheme,
			layoutWidth: layout.layoutWidth,
			isPreloader: layout.isPreloader,
			showRightSidebar: layout.showRightSidebar,
			layoutModeType: layout.layoutModeType,
		})
	);
	const {
		topbarTheme,
		layoutModeType,
		layoutWidth,
		isPreloader,
		showRightSidebar,
	} = useSelector(selectLayoutProperties);

	/*
	document title
	*/

	const pathName = useLocation();

	useEffect(() => {
		const title = pathName.pathname;
		const currentage = title.charAt(1).toUpperCase() + title.slice(2);

		document.title = `${currentage}ARC | Powered by Phibet`;
	}, [pathName.pathname]);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	// hides right sidebar on body click
	const hideRightbar = (event) => {
		const rightbar = document.getElementById('right-bar');
		const leftSide = document.getElementById('left-side-bar-id');

		// if clicked in inside right bar, then do nothing
		if (
			(rightbar && rightbar.contains(event.target)) ||
			leftSide?.contains(event.target)
		) {
			return null;
		}
		// if clicked in outside of rightbar then fire action for hide rightbar
		dispatch(showRightSidebarAction(false));
		return true;
	};

	/*
	layout settings
	*/
	useEffect(() => {
		dispatch(changeLayout('horizontal'));
	}, [dispatch]);

	const preLoaderDisplay = (dis) => {
		document.getElementById('preloader').style.display = dis;
		document.getElementById('status').style.display = dis;
	};

	useEffect(() => {
		// init body click event fot toggle rightbar
		document.body.addEventListener('click', hideRightbar, true);

		if (isPreloader === true) {
			preLoaderDisplay('block');
			setTimeout(() => {
				preLoaderDisplay('none');
			}, 2500);
		} else {
			preLoaderDisplay('none');
		}
	}, [isPreloader]);

	useEffect(() => {
		if (topbarTheme) {
			dispatch(changeTopbarTheme(topbarTheme));
		}
	}, [dispatch, topbarTheme]);

	useEffect(() => {
		if (layoutModeType) {
			dispatch(changeLayoutMode(layoutModeType));
		}
	}, [layoutModeType, dispatch]);

	useEffect(() => {
		if (layoutWidth) {
			dispatch(changeLayoutWidth(layoutWidth));
		}
	}, [dispatch, layoutWidth]);

	const [isMenuOpened, setIsMenuOpened] = useState(false);

	const openMenu = () => {
		setIsMenuOpened(!isMenuOpened);
	};

	return (
		<>
			<div id="preloader">
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

			<div id="layout-wrapper">
				<Header
					theme={topbarTheme}
					isMenuOpened={isMenuOpened}
					openLeftMenuCallBack={openMenu}
				/>
				<Navbar menuOpen={isMenuOpened} />
				<div className="main-content">{children}</div>
				<Footer />
			</div>

			{showRightSidebar ? <RightSidebar /> : null}
		</>
	);
};

Layout.propTypes = {
	children: PropTypes.element.isRequired,
};

export default withRouter(Layout);
