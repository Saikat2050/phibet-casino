/* eslint-disable react/prop-types */
/* eslint-disable no-nested-ternary */
import React from 'react';
import { Card, CardBody, UncontrolledTooltip } from 'reactstrap';
import DivLoader from '../../../components/Common/Loader/divLoader';

const ReportList = (props) => {
	const {
		id = '999',
		title,
		isLoading,
		reportClass,
		customClass,
		type,
		current,
		previous,
		changed,
		tooltipContent,
		desc1,
		desc2,
		desc3,
		desc4,
	} = props;
	const diff = current - previous;
	return type === 'change' ? (
		<Card className="mini-stats-wid">
			<CardBody
				className={`bg-${customClass || 'success'}-subtle rounded-3 pb-2`}
			>
				<i className="bx bx-info-circle fs-3 widget-info" id={id} />
				<div>
					<p className={`text-muted fw-bolder fs-6 mb-2 ${reportClass}`}>
						{title}
					</p>
				</div>
				{isLoading ? (
					<DivLoader isSmall loaderVarient="text-light" />
				) : (
					<div className="d-flex justify-content-between">
						<div>
							<h6 className="mb-0">
								{current}{' '}
								<span
									className={`fs-2 align-middle mdi mdi-menu-${
										changed > 0 ? 'up text-success' : 'down text-danger'
									}`}
								/>
							</h6>

							<h6
								className={`mb-0 ${diff > 0 ? 'text-success' : 'text-danger'}`}
							>
								{diff > 0 ? '+' : ''}
								{diff} {`(${changed > 0 ? '+' : ''}${changed}%)`}
							</h6>
						</div>
					</div>
				)}
			</CardBody>
			<UncontrolledTooltip placement="top" target={id}>
				{tooltipContent}
			</UncontrolledTooltip>
		</Card>
	) : (
		<Card className="mini-stats-wid">
			<CardBody
				className={`bg-${customClass || 'success'}-subtle rounded-3 pb-1`}
			>
				<i className="bx bx-info-circle fs-3 widget-info" id={id} />
				<div>
					<p className={`text-muted fw-bolder fs-6 mb-2 ${reportClass}`}>
						{title}
					</p>
				</div>
				<div className="d-flex justify-content-between">
					<div>
						{desc1 ? <h6 className="mb-2">{desc1}</h6> : null}
						{desc2 ? <h6 className="mb-2">{desc2}</h6> : null}
					</div>
					{isLoading ? (
						<DivLoader isSmall loaderVarient="text-light" />
					) : (
						<div className="ms-2">
							{desc3 ? <h6 className="mb-2">{desc3}</h6> : null}
							{desc4 ? <h6 className="">{desc4}</h6> : null}
						</div>
					)}
				</div>
			</CardBody>
			<UncontrolledTooltip placement="top" target={id}>
				{tooltipContent}
			</UncontrolledTooltip>
		</Card>
	);
};

export default ReportList;
