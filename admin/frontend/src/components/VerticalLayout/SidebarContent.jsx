import PropTypes from 'prop-types';
import React, { useEffect, useRef, useCallback, useMemo } from 'react';

// //Import Scrollbar
import SimpleBar from 'simplebar-react';

// MetisMenu
import MetisMenu from 'metismenujs';
import { Link, useLocation } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import withRouter from '../Common/withRouter';
import { sideBarElements } from '../../constants/sidebar';
import usePermission from '../Common/Hooks/usePermission';
import Logo from '../../assets/images/logo.png';

// i18n

const SidebarContent = ({ t }) => {
	const ref = useRef();
	const path = useLocation();
	const { isGranted, permissions } = usePermission();
	const superAdminUser = useSelector(
		(state) => state.PermissionDetails.superAdminUser
	);
	const leftSideBarTheme = useSelector(
		(state) => state.Layout.leftSideBarTheme
	);

	function scrollElement(item) {
		if (item) {
			const currentPosition = item.offsetTop;
			if (currentPosition > window.innerHeight) {
				ref.current.getScrollElement().scrollTop = currentPosition - 300;
			}
		}
	}
	const activateParentDropdown = useCallback((item) => {
		item.classList.add('active');
		const parent = item.parentElement;
		const parent2El = parent.childNodes[1];
		if (parent2El && parent2El.id !== 'side-menu') {
			parent2El.classList.add('mm-show');
		}

		if (parent) {
			parent.classList.add('mm-active');
			const parent2 = parent.parentElement;

			if (parent2) {
				parent2.classList.add('mm-show'); // ul tag

				const parent3 = parent2.parentElement; // li tag

				if (parent3) {
					parent3.classList.add('mm-active'); // li
					parent3.childNodes[0].classList.add('mm-active'); // a
					const parent4 = parent3.parentElement; // ul
					if (parent4) {
						parent4.classList.add('mm-show'); // ul
						const parent5 = parent4.parentElement;
						if (parent5) {
							parent5.classList.add('mm-show'); // li
							parent5.childNodes[0].classList.add('mm-active'); // a tag
						}
					}
				}
			}
			scrollElement(item);
			return false;
		}
		scrollElement(item);
		return false;
	}, []);

	const removeActivation = (items) => {
		for (let i = 0; i < items.length; i += 1) {
			const item = items[i];
			const parent = items[i].parentElement;

			if (item && item.classList.contains('active')) {
				item.classList.remove('active');
			}
			if (parent) {
				const parent2El =
					parent.childNodes && parent.childNodes.lenght && parent.childNodes[1]
						? parent.childNodes[1]
						: null;
				if (parent2El && parent2El.id !== 'side-menu') {
					parent2El.classList.remove('mm-show');
				}

				parent.classList.remove('mm-active');
				const parent2 = parent.parentElement;

				if (parent2) {
					parent2.classList.remove('mm-show');

					const parent3 = parent2.parentElement;
					if (parent3) {
						parent3.classList.remove('mm-active'); // li
						parent3.childNodes[0].classList.remove('mm-active');

						const parent4 = parent3.parentElement; // ul
						if (parent4) {
							parent4.classList.remove('mm-show'); // ul
							const parent5 = parent4.parentElement;
							if (parent5) {
								parent5.classList.remove('mm-show'); // li
								parent5.childNodes[0].classList.remove('mm-active'); // a tag
							}
						}
					}
				}
			}
		}
	};

	const activeMenu = useCallback(() => {
		const pathName = path.pathname;
		let matchingMenuItem = null;
		const ul = document.getElementById('side-menu');
		const items = ul.getElementsByTagName('a');
		removeActivation(items);

		for (let i = 0; i < items.length; i += 1) {
			if (pathName === items[i].pathname) {
				matchingMenuItem = items[i];
				break;
			}
		}
		if (matchingMenuItem) {
			activateParentDropdown(matchingMenuItem);
		}
	}, [path.pathname, activateParentDropdown]);

	useEffect(() => {
		ref.current.recalculate();
	}, []);

	useEffect(() => {
		// eslint-disable-next-line no-new
		new MetisMenu('#side-menu');
		activeMenu();
	}, []);

	useEffect(() => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
		activeMenu();
	}, [activeMenu]);

	const hideModule = (nav) =>
		nav?.groupedModules?.filter((module) => isGranted(module, 'R'))?.length ===
		0;

	const renderSideBar = useMemo(
		() =>
			sideBarElements
				.filter((nav) => {
					if (nav?.module && !isGranted(nav.module, 'R')) {
						return false;
					}

					if (
						nav?.groupedModules &&
						!isEmpty(superAdminUser) &&
						hideModule(nav)
					) {
						return false;
					}

					return true;
				})
				?.map((nav) => {
					if (nav?.isSeparator) {
						return nav.title ? (
							<li className="menu-title" key={nav?.id}>
								{nav.title}{' '}
							</li>
						) : null;
					}
					return (
						<li key={nav?.id}>
							<Link to={nav.link} className={nav.linkClass}>
								<i className={nav.iconName} />
								<span className={nav.spanClass}>{t(nav.label)}</span>
							</Link>
							{nav?.subMenu?.length && (
								<ul className="sub-menu">
									{nav?.subMenu?.map((sub) => {
										if (sub?.module && !isGranted(sub.module, 'R')) {
											return null;
										}
										return (
											<li key={sub?.link}>
												<Link
													to={sub.link}
													onClick={() =>
														sub?.callback ? sub.callback() : null
													}
												>
													{t(sub.label)}
												</Link>
											</li>
										);
									})}
								</ul>
							)}
						</li>
					);
				}),
		[sideBarElements, permissions]
	);

	return (
		<div className="h-100">
			<div className="logo-container">
				<Link to="/">
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
				</Link>
			</div>
			<SimpleBar className="h-100 simple-bar" forceVisible ref={ref}>
				<div id="sidebar-menu" className="h-100 position-relative">
					<ul
						className="metismenu list-unstyled sidebar-padding"
						id="side-menu"
					>
						{renderSideBar}
					</ul>
					{/* <p className="text-center w-100 bottom-text">
          ARC 1.0.0 powered by PHIBET
        </p> */}
				</div>
			</SimpleBar>
		</div>
	);
};

SidebarContent.defaultProps = {
	t: () => {},
};

SidebarContent.propTypes = {
	t: PropTypes.func,
};

export default withRouter(withTranslation()(SidebarContent));
