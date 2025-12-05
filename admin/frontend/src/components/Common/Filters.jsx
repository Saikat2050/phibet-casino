/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import { Card, Col, Row, Form, UncontrolledTooltip } from 'reactstrap';
import PropTypes, { oneOfType } from 'prop-types';
import { getField } from '../../helpers/customForms';

const Filters = ({
	filterFields,
	validation,
	actionButtons,
	isFilterChanged,
	customFieldCols,
}) => (
	<Row>
		<Col lg={12}>
			<Card className="filter-card">
				<Form
					onSubmit={(e) => {
						e.preventDefault();
						validation.handleSubmit();
						return false;
					}}
				>
					<Row>
						<Col xxl={11} xl={11} lg={11} md={11} sm={11}>
							<Row className="g-3">
								{filterFields?.map(
									(field) =>
										!field?.isHide && (
											<Col
												xxl={customFieldCols?.xxl || 2}
												xl={customFieldCols?.xl || 3}
												lg={customFieldCols?.lg || 4}
												md={customFieldCols?.md || 4}
												sm={customFieldCols?.sm || 6}
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
						</Col>
						<Col
							xxl={1}
							xl={1}
							lg={1}
							md={1}
							sm={1}
							className="align-symbol-end"
						>
							{isFilterChanged &&
								actionButtons?.map(
									({ icon, handleClick, isHide, tooltip, id }) =>
										!isHide && (
											<Col xxl={1} xl={1} lg={1} md={1} sm={1} xs={1}>
												<div className="position-relative h-100 hstack gap-3">
													<i
														className={`${icon} align-middle filter-icons`}
														onClick={handleClick}
														onKeyDown={() => {}}
														id={id || icon || 'clear-filter'}
													/>
													<UncontrolledTooltip
														placement="top"
														target={id || icon || 'clear-filter'}
													>
														{tooltip}
													</UncontrolledTooltip>
												</div>
											</Col>
										)
								)}
						</Col>
					</Row>
				</Form>
			</Card>
		</Col>
	</Row>
);

Filters.defaultProps = {
	// isAdvanceOpen: false,
	isFilterChanged: true,
	validation: {},
	customFieldCols: {},
};

Filters.propTypes = {
	filterFields: PropTypes.arrayOf(PropTypes.objectOf).isRequired,
	validation: PropTypes.objectOf(
		oneOfType([
			PropTypes.object,
			PropTypes.func,
			PropTypes.bool,
			PropTypes.number,
			PropTypes.string,
		])
	),
	actionButtons: PropTypes.arrayOf(PropTypes.objectOf).isRequired,
	// isAdvanceOpen: PropTypes.bool,
	isFilterChanged: PropTypes.bool,
	customFieldCols: PropTypes.objectOf({
		xxl: PropTypes.number,
	}),
};

export default Filters;
