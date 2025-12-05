import React, { Fragment } from 'react';
import { Button, Spinner, UncontrolledTooltip } from 'reactstrap';
import PropTypes from 'prop-types';

const ExportList = ({ exportList }) => (
	<div className="flex-shrink-0">
		{exportList?.map(
			({
				label,
				tooltip,
				icon,
				isCsv,
				handleDownload,
				type,
				buttonColor,
				isDownloading,
			}) => (
				<>
					{isCsv && (
						<Button
							onClick={() => handleDownload({ type })}
							className="btn btn-light btn-outline-primary"
							color={buttonColor || 'primary'}
							id={`id-csv-${label}`}
							style={{
								width: '110px',
							}}
						>
							{isDownloading ? (
								<Spinner size="sm" />
							) : (
								<>
									{icon} {label}
								</>
							)}
						</Button>
					)}
					{tooltip && (
						<UncontrolledTooltip placement="top" target={`id-csv-${label}`}>
							{isDownloading ? 'Download In Progress' : tooltip}
						</UncontrolledTooltip>
					)}
				</>
			)
		)}
	</div>
);

export default ExportList;

ExportList.defaultProps = {
	exportList: [],
};

ExportList.propTypes = {
	exportList: PropTypes.arrayOf(
		PropTypes.shape({
			label: PropTypes.string,
			tooltip: PropTypes.string,
			icon: PropTypes.element,
			isCsv: PropTypes.bool,
			isXml: PropTypes.bool,
			handleDownload: PropTypes.func,
			type: PropTypes.string,
			buttonColor: PropTypes.string,
			isDownloading: PropTypes.bool,
		})
	),
};
