import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { Collapse } from 'reactstrap';
import { Link, useLocation } from 'react-router-dom';
import classname from 'classnames';

// i18n
import { withTranslation } from 'react-i18next';

import { connect } from 'react-redux';
import withRouter from '../Common/withRouter';
import { getMegaMenuElement } from '../../constants/sidebar';
import usePermission from '../Common/Hooks/usePermission';

const Navbar = ({ leftMenu, menuOpen }) => {
	const [open, setOpen] = useState(0);
	const { isGranted } = usePermission();
	const location = useLocation();

	useEffect(() => {
		if (open) setOpen(0);
	}, [location.pathname]);

	const removeActivation = (items) => {
		for (let i = 0; i < items.length; i += 1) {
			const item = items[i];
			const parent = items[i].parentElement;
			if (item && item.classList.contains('active')) {
				item.classList.remove('active');
			}
			if (parent) {
				if (parent.classList.contains('active')) {
					parent.classList.remove('active');
				}
			}
		}
	};

	function activateParentDropdown(item) {
		item.classList.add('active');
		const parent = item.parentElement;
		if (parent) {
			parent.classList.add('active'); // li
			const parent2 = parent.parentElement;
			parent2.classList.add('active'); // li
			const parent3 = parent2.parentElement;
			if (parent3) {
				parent3.classList.add('active'); // li
				const parent4 = parent3.parentElement;
				if (parent4) {
					parent4.classList.add('active'); // li
					const parent5 = parent4.parentElement;
					if (parent5) {
						parent5.classList.add('active'); // li
						const parent6 = parent5.parentElement;
						if (parent6) {
							parent6.classList.add('active'); // li
						}
					}
				}
			}
		}
		return false;
	}

	useEffect(() => {
		let matchingMenuItem = null;
		const ul = document.getElementById('navigation');
		const items = ul.getElementsByTagName('a');
		removeActivation(items);
		for (let i = 0; i < items.length; i += 1) {
			if (window.location.pathname === items[i].pathname) {
				matchingMenuItem = items[i];
				break;
			}
		}
		if (matchingMenuItem) {
			activateParentDropdown(matchingMenuItem);
		}
	});

	return (
		<div className="topnav">
			<div className="container-fluid">
				<nav
					className="navbar navbar-light navbar-expand-lg topnav-menu"
					id="navigation"
				>
					<Collapse
						isOpen={leftMenu}
						className="navbar-collapse"
						id="topnav-menu-content"
					>
						<ul className="navbar-nav">
							{getMegaMenuElement()?.map((nav) =>
								nav?.groupedModules?.filter((module) => isGranted(module, 'R'))
									?.length === 0 ? null : (
									<li className="nav-item dropdown">
										<Link
											className="nav-link arrow-none"
											onClick={(e) => {
												e.preventDefault();
												setOpen((prev) => (prev === nav.id ? 0 : nav.id));
											}}
											to={nav?.link || '#'}
										>
											<i className="bx bx-home-circle me-2" />
											{nav.label} {menuOpen}
											<div className="arrow-down" />
										</Link>
										<div
											className={classname('dropdown-menu', {
												show: open === nav.id,
											})}
										>
											{nav?.subMenu?.map((subNav) =>
												subNav?.module &&
												!isGranted(subNav.module, 'R') ? null : (
													<Link to={subNav.link} className="dropdown-item">
														{subNav.label}
													</Link>
												)
											)}
										</div>
									</li>
								)
							)}
						</ul>
					</Collapse>
				</nav>
			</div>
		</div>
	);
};

Navbar.propTypes = {
	leftMenu: PropTypes.bool.isRequired,
	menuOpen: PropTypes.bool.isRequired,
};

const mapStatetoProps = (state) => {
	const { leftMenu } = state.Layout;
	return { leftMenu };
};

export default withRouter(
	connect(mapStatetoProps, {})(withTranslation()(Navbar))
);
