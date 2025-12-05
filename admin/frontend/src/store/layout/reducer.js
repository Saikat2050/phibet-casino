// @flow
import {
	CHANGE_LAYOUT,
	CHANGE_LAYOUT_WIDTH,
	CHANGE_SIDEBAR_THEME,
	CHANGE_SIDEBAR_TYPE,
	CHANGE_TOPBAR_THEME,
	SHOW_RIGHT_SIDEBAR,
	TOGGLE_LEFTMENU,
	SHOW_SIDEBAR,
	CHANGE_LAYOUT_MODE,
	SAVE_SITE_DETAILS,
	TOGGLE_DROPDOWN,
} from './actionTypes';

// constants
import {
	layoutTypes,
	layoutModeTypes,
	layoutWidthTypes,
	topBarThemeTypes,
	leftBarThemeImageTypes,
	leftSidebarTypes,
	leftSideBarThemeTypes,
	tableHeaderClass,
} from '../../constants/layout';

export const LAYOUT_INIT_STATE = {
	layoutType: layoutTypes.VERTICAL,
	layoutModeType: layoutModeTypes.LIGHT,
	layoutWidth: layoutWidthTypes.FLUID,
	leftSideBarTheme: leftSideBarThemeTypes.DARK,
	leftSideBarThemeImage: leftBarThemeImageTypes.NONE,
	leftSideBarType: leftSidebarTypes.DEFAULT,
	topbarTheme: topBarThemeTypes.LIGHT,
	isPreloader: false,
	showRightSidebar: false,
	isMobile: false,
	showSidebar: true,
	leftMenu: false,
	tableHeaderClass: tableHeaderClass.GREY,
	showBreadcrumb: true,
	error: null,
	isLoading: true,
	openDropdownType: '',
};

const Layout = (state = LAYOUT_INIT_STATE, { type, payload } = {}) => {
	switch (type) {
		case CHANGE_LAYOUT:
			return {
				...state,
				layoutType: payload,
			};

		case CHANGE_LAYOUT_MODE:
			return {
				...state,
				layoutModeType: payload,
			};
		case CHANGE_LAYOUT_WIDTH:
			return {
				...state,
				layoutWidth: payload,
			};
		case CHANGE_SIDEBAR_THEME:
			return {
				...state,
				leftSideBarTheme: payload,
			};

		case CHANGE_SIDEBAR_TYPE:
			return {
				...state,
				leftSideBarType: payload.sidebarType,
			};
		case CHANGE_TOPBAR_THEME:
			return {
				...state,
				topbarTheme: payload,
			};
		case SHOW_RIGHT_SIDEBAR:
			return {
				...state,
				showRightSidebar: payload ?? !state.showRightSidebar,
			};
		case SHOW_SIDEBAR:
			return {
				...state,
				showSidebar: payload,
			};
		case TOGGLE_LEFTMENU:
			return {
				...state,
				leftMenu: payload,
			};

		case SAVE_SITE_DETAILS:
			return {
				...state,
				...LAYOUT_INIT_STATE,
				layoutModeType: payload.layoutModeType,
				layoutWidth: payload.layoutWidth,
				topbarTheme: payload.topbarTheme,
				leftSideBarType: payload.leftSideBarType,
				leftSideBarTheme: payload.leftSideBarTheme,
				error: '',
			};
		case TOGGLE_DROPDOWN: {
			return {
				...state,
				openDropdownType: payload,
			};
		}
		default:
			return state;
	}
};

export default Layout;
