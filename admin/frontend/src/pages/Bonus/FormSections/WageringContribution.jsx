/* eslint-disable react/prop-types */
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Col, Row } from 'reactstrap';
import { isEmpty } from 'lodash';
import { getWageringTemplateDetail } from '../../../store/actions';
import {
	CustomInputField,
	CustomSelectField,
} from '../../../helpers/customForms';
import TableContainer from '../../../components/Common/Table';
import { selectedLanguage } from '../../../constants/config';
import { BONUS_KEY_RELATION } from '../constants';
import Actions from './Actions';

const KeyValueCell = ({ cell }) => (cell.value ? cell.value : '');

const columns = [
	{
		Header: 'Id',
		accessor: 'wageringTemplateId',
		disableSortBy: true,
		Cell: ({ cell }) => <KeyValueCell cell={cell} />,
	},

	{
		Header: 'NAME',
		accessor: 'name',
		disableSortBy: true,
		Cell: ({ cell }) => <KeyValueCell cell={cell} />,
	},
	{
		Header: 'RTP',
		accessor: 'rtp',
		disableSortBy: true,
		Cell: ({ cell }) => <KeyValueCell cell={cell} />,
	},
	{
		Header: 'WAGERING CONTRIBUTION',
		accessor: 'contribution',
		disableSortBy: true,
		Cell: ({ cell }) => <KeyValueCell cell={cell} />,
	},
];

const WageringContribution = ({
	bonusDetails,
	isEdit,
	selectedTemplate,
	setSelectedTemplate,
	activeTab,
	submitButtonLoading,
	toggleTab,
	tabsToShow,
}) => {
	const dispatch = useDispatch();
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(10);
	const [searchText, setSearchText] = useState('');
	const {
		wageringTemplateDetail,
		wageringTemplateDetailLoading,
		SAWageringTemplate,
	} = useSelector((state) => state.WageringTemplate);

	useEffect(() => {
		if (!isEmpty(bonusDetails)) {
			setSelectedTemplate(
				bonusDetails[BONUS_KEY_RELATION[bonusDetails.bonusType]]
					?.wageringTemplateId
			);
		}
	}, [bonusDetails]);

	const handleNextClick = (nextTab) => {
		toggleTab(nextTab);
	};

	const wageringTemplateOptions = useMemo(() => {
		if (wageringTemplateDetail?.wageringTemplates?.length) {
			return wageringTemplateDetail.wageringTemplates.map((template) => ({
				optionLabel: template.name,
				value: template.id,
			}));
		}
		return [];
	}, [wageringTemplateDetail]);

	useEffect(() => {
		if (wageringTemplateDetail?.wageringTemplates?.length && !isEdit) {
			setSelectedTemplate(wageringTemplateDetail?.wageringTemplates?.[0]?.id);
		}
	}, [wageringTemplateDetail, isEdit]);

	useEffect(() => {
		if (selectedTemplate) {
			dispatch(
				getWageringTemplateDetail({
					wageringTemplateId: selectedTemplate,
					page: currentPage,
					search: searchText,
					perPage: itemsPerPage,
				})
			);
		}
	}, [searchText, selectedTemplate, currentPage, itemsPerPage]);

	const formattedWageringTemplates = useMemo(() => {
		if (SAWageringTemplate?.template?.length) {
			return SAWageringTemplate?.template?.[0]?.wageringTemplateGameDetails?.map(
				(item) => ({
					...item,
					name: item?.casinoGame?.name?.[selectedLanguage] || '',
					rtp: `${item?.casinoGame?.returnToPlayer ?? 0} %`,
					contribution: `${item.contributionPercentage ?? 0} %`,
				})
			);
		}
		return [];
	}, [SAWageringTemplate]);

	return (
		<Card>
			<Row>
				<Col sm="6" className="mb-3">
					<CustomSelectField
						label="Wagering Template"
						type="select"
						onChange={(e) => {
							setSelectedTemplate(e.target.value);
						}}
						placeholder="Select Wagering Template"
						value={selectedTemplate}
						options={
							<>
								<option value={null} selected disabled>
									Select Wagering Template
								</option>
								{wageringTemplateOptions?.map(({ optionLabel, value }) => (
									<option key={value} value={value}>
										{optionLabel}
									</option>
								))}
							</>
						}
					/>
				</Col>
				<Col sm="6" className="mb-3">
					<CustomInputField
						label="Search"
						onChange={(e) => {
							setSearchText(e.target.value);
						}}
						placeholder="Enter Game Name"
						value={searchText}
					/>
				</Col>
				<Col lg="12" className="mb-3">
					<TableContainer
						isLoading={wageringTemplateDetailLoading}
						columns={columns}
						data={formattedWageringTemplates}
						isPagination
						customPageSize={itemsPerPage}
						tableClass="table-bordered align-middle nowrap mt-2"
						// paginationDiv="col-sm-12 col-md-7"
						paginationDiv="justify-content-center"
						pagination="pagination justify-content-start pagination-rounded"
						totalPageCount={SAWageringTemplate?.template?.totalPages}
						isManualPagination
						onChangePagination={setCurrentPage}
						currentPage={currentPage}
						changeRowsPerPageCallback={setItemsPerPage}
					/>
				</Col>
			</Row>
			<Actions
				handleNextClick={handleNextClick}
				submitButtonLoading={submitButtonLoading}
				activeTab={activeTab}
				toggleTab={toggleTab}
				tabsToShow={tabsToShow}
			/>
		</Card>
	);
};

export default WageringContribution;
