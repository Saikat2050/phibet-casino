/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { isEqual } from 'lodash';
import { createPortal } from 'react-dom';
import {
	Card,
	Col,
	DropdownMenu,
	DropdownToggle,
	Row,
	UncontrolledDropdown,
	Button,
} from 'reactstrap';
import PropTypes, { oneOfType } from 'prop-types';
import { getField } from '../../helpers/customForms';
import { debounceTime } from '../../constants/config';
import TableSearchInput from './TableSearchInput';
import { toggleDropdown } from '../../store/actions';

let debounce;
const CustomFilters = ({
	filterFields,
	validation,
	customFieldCols,
	handleFilter,
	showSearchInput,
	searchInputPlaceHolder,
	hideCustomFilter,
	searchInputName,
}) => {
	const dispatch = useDispatch();
	const openDropdownType = useSelector(
		(state) => state.Layout.openDropdownType
	);

	const ref = useRef({
		isFirst: true,
		prevValues: null,
	});

	useEffect(() => {
		if (
			!ref.current.isFirst &&
			!isEqual(validation.values, ref.current.prevValues)
		) {
			debounce = setTimeout(() => {
				handleFilter(validation.values);
			}, debounceTime);
			ref.current.prevValues = validation.values;
		}
		ref.current.isFirst = false;
		return () => clearTimeout(debounce);
	}, [validation.values]);

	const handleClose = () => {
		dispatch(toggleDropdown(''));
	};

	useEffect(() => () => dispatch(toggleDropdown('')), []);

	const tableElement =
		showSearchInput && document.getElementById('search-input-portal');

	return (
		<>
			{tableElement
				? createPortal(
						<TableSearchInput
							validation={validation}
							placeholder={searchInputPlaceHolder}
							searchInputName={searchInputName}
						/>,
						tableElement
				  )
				: null}
			{!(hideCustomFilter || !filterFields?.length) ? (
				<UncontrolledDropdown isOpen={openDropdownType === 'filterDropdown'}>
					<DropdownToggle
						type="button"
						className="btn btn-light btn-outline-primary"
						onClick={() =>
							dispatch(
								toggleDropdown(
									openDropdownType === 'filterDropdown' ? '' : 'filterDropdown'
								)
							)
						} // Only open the dropdown on click
					>
						<i className="mdi mdi-plus" /> Add Filters
					</DropdownToggle>
					<DropdownMenu
						className="dropdown-menu-md p-4"
						style={{ width: '65vw', maxWidth: '40rem' }}
					>
						<h5>
							<b>Filters</b>
						</h5>
						<hr />
						<Row>
							<Col lg={12}>
								<Card className="filter-card">
									<Row>
										<Col xxl={12} xl={12} lg={12} md={12} sm={12}>
											<Row className="g-3">
												{filterFields?.map(
													(field) =>
														!field?.isHide && (
															<Col
																xxl={customFieldCols?.xxl}
																xl={customFieldCols?.xl}
																lg={customFieldCols?.lg}
																md={customFieldCols?.md}
																sm={customFieldCols?.sm}
																key={field?.name || field?.label}
															>
																<div className="position-relative">
																	<input style={{ display: 'none' }} />
																	{getField(field, validation)}
																</div>
															</Col>
														)
												)}
											</Row>
											<Row className="mt-3">
												<Col className="d-flex justify-content-end">
													<Button
														color="link"
														className="btn btn-link waves-effect"
														onClick={handleClose}
													>
														Close
													</Button>
												</Col>
											</Row>
										</Col>
									</Row>
								</Card>
							</Col>
						</Row>
					</DropdownMenu>
				</UncontrolledDropdown>
			) : null}
		</>
	);
};

CustomFilters.defaultProps = {
	validation: {},
	customFieldCols: { xxl: 6, xl: 6, lg: 6, md: 6, sm: 6 },
	showSearchInput: true,
	searchInputPlaceHolder: 'Search...',
	hideCustomFilter: false,
	searchInputName: 'searchString',
};

CustomFilters.propTypes = {
	filterFields: PropTypes.arrayOf(PropTypes.objectOf).isRequired,
	handleFilter: PropTypes.func.isRequired,
	validation: PropTypes.objectOf(
		oneOfType([
			PropTypes.object,
			PropTypes.func,
			PropTypes.bool,
			PropTypes.number,
			PropTypes.string,
		])
	),
	customFieldCols: PropTypes.objectOf({
		xxl: PropTypes.number,
	}),
	showSearchInput: PropTypes.bool,
	searchInputPlaceHolder: PropTypes.string,
	hideCustomFilter: PropTypes.bool,
	searchInputName: PropTypes.string,
};

export default CustomFilters;
