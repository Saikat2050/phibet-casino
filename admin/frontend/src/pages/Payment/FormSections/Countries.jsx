/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/prop-types */
import React, { useEffect, useState, useMemo } from 'react';
import { Col, Row } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import { isEmpty } from 'lodash';
import {
	CustomInputField,
	CustomSwitchButton,
} from '../../../helpers/customForms';
import { fetchCountriesStart } from '../../../store/actions';
import useForm from '../../../components/Common/Hooks/useFormModal';
import { getInitialValues } from '../formDetails';
import Actions from './Actions';
import TableContainer from '../../../components/Common/Table';
import {
	debounceTime,
	tableCustomClass,
	tbodyClass,
} from '../../../constants/config';

const KeyValueCell = ({ cell }) => (cell.value ? cell.value : '');

const CheckboxInput = ({ cell, blockedCountries, toggleBlockedCountry }) => (
	<div className=" d-flex justify-content-center">
		<CustomSwitchButton
			type="checkbox"
			containerClass="false"
			className="form-check-input"
			checked={blockedCountries?.includes(cell?.row?.original?.id?.toString())}
			switchSizeClass="form-switch-sm"
			onClick={() => toggleBlockedCountry(cell?.row?.original?.id?.toString())}
		/>
	</div>
);

const columnsArray = ({ blockedCountries, toggleBlockedCountry }) => [
	{
		Header: 'SELECT',
		accessor: 'select',
		disableSortBy: true,
		notHidable: true,
		Cell: ({ cell }) => (
			<CheckboxInput
				blockedCountries={blockedCountries}
				toggleBlockedCountry={toggleBlockedCountry}
				cell={cell}
			/>
		),
	},
	{
		Header: 'Country Id',
		disableSortBy: true,
		notHidable: true,
		accessor: 'id',
		Cell: ({ cell }) => <KeyValueCell cell={cell} />,
	},
	{
		Header: 'NAME',
		disableSortBy: true,
		accessor: 'name',
		Cell: ({ cell }) => <KeyValueCell cell={cell} />,
	},
];

let debounce;

const Countries = ({
	setAllFields,
	paymentDetails,
	activeTab,
	submitButtonLoading,
	tabsToShow,
	toggleTab,
	blockedCountries,
	setBlockedCountries,
}) => {
	const dispatch = useDispatch();
	const { countries, loading } = useSelector((state) => state.Countries);
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(10);
	const [searchText, setSearchText] = useState('');

	const { validation } = useForm({
		initialValues: getInitialValues()?.blockedCountries,
	});

	const handleSubmit = async (nextTab) =>
		setAllFields((prev) => {
			const updateFields = {
				...prev,
				blockedCountries,
			};
			toggleTab(nextTab, updateFields);
			return updateFields;
		});

	useEffect(() => {
		if (!isEmpty(paymentDetails)) {
			if (paymentDetails.blockedCountries) {
				setBlockedCountries(paymentDetails.blockedCountries);
				validation.setValues(paymentDetails.blockedCountries);
			}
		}
	}, [paymentDetails, countries]);

	useEffect(() => {
		debounce = setTimeout(() => {
			dispatch(
				fetchCountriesStart({
					perPage: itemsPerPage,
					page: currentPage,
					searchString: searchText,
				})
			);
		}, debounceTime);
		return () => clearTimeout(debounce);
	}, [itemsPerPage, currentPage, searchText]);

	const handleNextClick = async (nextTab) => {
		handleSubmit(nextTab);
	};

	const toggleBlockedCountry = (id) => {
		if (blockedCountries.includes(id)) {
			const array = blockedCountries.filter((game) => game !== id);
			setBlockedCountries(array);
		} else {
			setBlockedCountries((prev) => [...prev, id]);
		}
	};

	const onChangeRowsPerPage = (value) => {
		setCurrentPage(1);
		setItemsPerPage(value);
	};

	const columns = useMemo(
		() => columnsArray({ blockedCountries, toggleBlockedCountry }),
		[blockedCountries]
	);

	return (
		<div>
			<Row>
				<Col sm="6" className="mb-3">
					<CustomInputField
						label="Search"
						onChange={(e) => {
							setSearchText(e.target.value);
						}}
						placeholder="Enter Country Name"
						value={searchText}
					/>
				</Col>
				<Col lg="12" className="mb-3">
					<TableContainer
						columns={columns || []}
						data={countries?.countries || []}
						isPagination
						customPageSize={itemsPerPage}
						tableClass={`table-bordered align-middle nowrap mt-2 ${tableCustomClass}`}
						tbodyClass={tbodyClass}
						paginationDiv="justify-content-center"
						pagination="pagination justify-content-start pagination-rounded"
						totalPageCount={countries?.countries?.length || 10}
						isManualPagination
						onChangePagination={setCurrentPage}
						currentPage={currentPage}
						isLoading={loading}
						changeRowsPerPageCallback={onChangeRowsPerPage}
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
		</div>
	);
};

export default Countries;
