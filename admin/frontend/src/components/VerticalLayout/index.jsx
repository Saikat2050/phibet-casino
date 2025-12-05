/* eslint-disable */
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import withRouter from '../Common/withRouter';
import {
	changeLayout,
	changeLayoutMode,
	changeSidebarTheme,
	changeSidebarType,
	changeTopbarTheme,
	changeLayoutWidth,
	showRightSidebarAction,
} from '../../store/actions';

// Layout Related Components
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import RightSidebar from '../CommonForBoth/RightSidebar';

//redux
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from 'reselect';

const Layout = (props) => {
	const dispatch = useDispatch();

	const selectLayoutState = (state) => state.Layout;

	const selectLayoutProperties = createSelector(
		selectLayoutState,
		(layout) => ({
			isPreloader: layout.isPreloader,
			layoutModeType: layout.layoutModeType,
			leftSideBarThemeImage: layout.leftSideBarThemeImage,
			leftSideBarType: layout.leftSideBarType,
			layoutWidth: layout.layoutWidth,
			topbarTheme: layout.topbarTheme,
			showRightSidebar: layout.showRightSidebar,
			leftSideBarTheme: layout.leftSideBarTheme,
			layoutType: layout.layoutType,
		})
	);

	const {
		isPreloader,
		leftSideBarThemeImage,
		layoutWidth,
		leftSideBarType,
		topbarTheme,
		showRightSidebar,
		leftSideBarTheme,
		layoutModeType,
		layoutType,
	} = useSelector(selectLayoutProperties);

	const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

	const toggleMenuCallback = () => {
		if (leftSideBarType === 'default') {
			dispatch(changeSidebarType('condensed', isMobile));
		} else if (leftSideBarType === 'condensed') {
			dispatch(changeSidebarType('default', isMobile));
		}
	};

	//hides right sidebar on body click
	const hideRightbar = (event) => {
		const rightbar = document.getElementById('right-bar');
		const leftSide = document.getElementById('left-side-bar-id');

		//if clicked in inside right bar, then do nothing
		if (
			(rightbar && rightbar.contains(event.target)) ||
			leftSide?.contains(event.target)
		) {
			return;
		} else {
			//if clicked in outside of rightbar then fire action for hide rightbar
			dispatch(showRightSidebarAction(false));
		}
	};

	/*
	layout  settings
	*/

	const preLoaderDisplay = (dis) => {
		document.getElementById('preloader').style.display = dis;
		document.getElementById('status').style.display = dis;
	};

	useEffect(() => {
		//init body click event fot toggle rightbar
		document.body.addEventListener('click', hideRightbar, true);

		if (isPreloader === true) {
			preLoaderDisplay('block');
			setTimeout(function () {
				preLoaderDisplay('none');
			}, 2500);
		} else {
			preLoaderDisplay('none');
		}
	}, [isPreloader]);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	// useEffect(() => {
	//   if(layoutType === 'vertical') {
	//     dispatch(changeLayout("vertical"));
	//   }
	// }, [layoutType]);

	useEffect(() => {
		if (leftSideBarTheme) {
			dispatch(changeSidebarTheme(leftSideBarTheme));
		}
	}, [leftSideBarTheme, dispatch]);

	useEffect(() => {
		if (layoutModeType) {
			dispatch(changeLayoutMode(layoutModeType));
		}
	}, [layoutModeType, dispatch]);

	useEffect(() => {
		if (layoutWidth) {
			dispatch(changeLayoutWidth(layoutWidth));
		}
	}, [layoutWidth, dispatch]);

	useEffect(() => {
		if (leftSideBarType) {
			dispatch(changeSidebarType(leftSideBarType));
		}
	}, [leftSideBarType, dispatch]);

	useEffect(() => {
		if (topbarTheme) {
			dispatch(changeTopbarTheme(topbarTheme));
		}
	}, [topbarTheme, dispatch]);

	return (
		<React.Fragment>
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
				{/* <Header toggleMenuCallback={toggleMenuCallback} /> */}
				<Sidebar
					theme={leftSideBarTheme}
					type={leftSideBarType}
					isMobile={isMobile}
				/>
				<div className="main-content">{props.children}</div>
				<Footer />
			</div>
			{showRightSidebar ? <RightSidebar /> : null}
		</React.Fragment>
	);
};

Layout.propTypes = {
	changeLayoutWidth: PropTypes.func,
	changeSidebarTheme: PropTypes.func,
	changeSidebarType: PropTypes.func,
	changeTopbarTheme: PropTypes.func,
	// children: PropTypes.object,
	isPreloader: PropTypes.any,
	layoutWidth: PropTypes.any,
	leftSideBarTheme: PropTypes.any,
	leftSideBarThemeImage: PropTypes.any,
	leftSideBarType: PropTypes.any,
	location: PropTypes.object,
	showRightSidebar: PropTypes.any,
	topbarTheme: PropTypes.any,
};

export default withRouter(Layout);
