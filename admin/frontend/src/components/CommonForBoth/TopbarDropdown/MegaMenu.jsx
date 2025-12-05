/* eslint-disable react/jsx-no-useless-fragment */
import React, { useEffect, useState } from 'react';
import { Row, Col, Dropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import { Link, useLocation } from 'react-router-dom';
import megamenuImg from '../../../assets/images/megamenu-img.png';
import { getMegaMenuElement } from '../../../constants/sidebar';
import usePermission from '../../Common/Hooks/usePermission';

const MegaMenu = () => {
	const [megaMenu, setmegaMenu] = useState(false);
	const { isGranted } = usePermission();

	const location = useLocation();

	useEffect(() => {
		if (megaMenu) setmegaMenu(false);
	}, [location.pathname]);

	return (
		<Dropdown
			className="dropdown-mega d-none d-lg-block ms-2"
			isOpen={megaMenu}
			toggle={() => {
				setmegaMenu(!megaMenu);
			}}
		>
			<DropdownToggle className="btn header-item " caret tag="button">
				{' '}
				Menu <i className="mdi mdi-chevron-down" />
			</DropdownToggle>
			<DropdownMenu className="dropdown-megamenu">
				<Row>
					<Col sm={12}>
						<Row>
							{getMegaMenuElement()?.map((nav) => (
								<Col md={2} key={nav.label}>
									{nav?.groupedModules?.filter((module) =>
										isGranted(module, 'R')
									)?.length === 0 ? null : (
										<h5 className="font-size-14 mt-0">{nav?.label}</h5>
									)}
									{nav?.subMenu?.length && (
										<ul className="list-unstyled megamenu-list">
											{nav?.subMenu?.map((sub) => {
												if (sub?.module && !isGranted(sub.module, 'R')) {
													return null;
												}
												return (
													<li key={sub.link}>
														<Link to={sub.link}>{sub.label}</Link>
													</li>
												);
											})}
										</ul>
									)}
								</Col>
							))}
							<Col md={2} className="menu-image">
								<div>
									<img
										src={megamenuImg}
										alt=""
										className="img-fluid mx-auto d-block"
									/>
								</div>
							</Col>
						</Row>
					</Col>
				</Row>
			</DropdownMenu>
		</Dropdown>
	);
};

export default MegaMenu;
