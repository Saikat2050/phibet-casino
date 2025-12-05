/* eslint-disable react/prop-types */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-enable jsx-a11y/label-has-associated-control */
import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range'; // Ensure this import matches your library setup
import { Button, Card, Col, Row } from 'reactstrap';
import Select from 'react-select';
import { INITIAL_FILTERS, TIMEZONES } from '../constant';
import { convertToUTC } from '../../../utils/helpers';
import { CustomSelectField } from '../../../helpers/customForms';
import usePlayerOptions from '../../../utils/usePlayerOptions';

const DashboardFilters = ({ handleDashFilters }) => {
	const playerOptions = usePlayerOptions();
	const [filters, setFilters] = useState([
		{
			startDate: INITIAL_FILTERS.fromDate,
			endDate: INITIAL_FILTERS.toDate,
			timezone: INITIAL_FILTERS.timezone,
			key: 'selection',
			tagIds: '',
		},
	]);
	const layoutModeType = useSelector((state) => state.Layout.layoutModeType);

	const [isPickerVisible, setPickerVisible] = useState(false);
	const pickerRef = useRef(null);

	const handleApplyFilter = () => {
		const { startDate, endDate, timezone, tagIds } = filters[0];

		const { startUTC, endUTC } = convertToUTC(startDate, endDate, timezone);

		handleDashFilters({
			fromDate: startUTC,
			toDate: endUTC,
			tagIds,
			timezone,
		});
	};

	const handleInputClick = () => {
		setPickerVisible((prev) => !prev);
	};

	// const handleApplyFilter = () => {
	// 	handleDashFilters({
	// 		fromDate: filters[0].startDate,
	// 		toDate: filters[0]?.endDate,
	// 		timezone: filters[0].timezone,
	// 	});
	// };

	const handleChange = (item) => {
		setFilters([item.selection]);
	};

	useEffect(() => {
		function handleClickOutside(event) {
			if (pickerRef.current && !pickerRef.current.contains(event.target)) {
				setPickerVisible(false);
			}
		}
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [pickerRef]);

	// console.log('filters', filters);

	return (
		<Card className="p-3">
			<Row className="align-items-center">
				<Col xl={4} md={5} sm={5} xs={12} className="mt-1">
					<label
						style={{ marginLeft: '1px' }}
						className="game-report-dashboard-filter-label"
						htmlFor="dateRangePicker"
					>
						Date Range
					</label>
					<div ref={pickerRef} id={layoutModeType}>
						<input
							type="text"
							className="form-control cursor-pointer"
							onClick={handleInputClick}
							value={`${filters[0]?.startDate?.toLocaleDateString() || ''} - ${
								filters[0]?.endDate?.toLocaleDateString() || ''
							}`}
							readOnly
						/>
						{isPickerVisible && (
							<DateRangePicker
								key={layoutModeType}
								id={layoutModeType}
								className="dash-date-range"
								dateDisplayFormat="dd/MM/yyyy"
								onChange={handleChange}
								showSelectionPreview
								moveRangeOnFirstSelection={false}
								months={2}
								ranges={filters}
								direction="horizontal"
								preventSnapRefocus
								calendarFocus="backwards"
								maxDate={new Date()}
							/>
						)}
					</div>
				</Col>
				<Col xl={4} md={5} sm={5} xs={12} className="mt-1">
					<label
						style={{ marginLeft: '1px' }}
						className="game-report-dashboard-filter-label"
						htmlFor="timezoneSelect"
					>
						Timezone
					</label>
					<Select
						options={TIMEZONES}
						value={TIMEZONES.find((tz) => tz.code === filters[0].timezone)}
						onChange={(selected) =>
							setFilters([{ ...filters[0], timezone: selected.code }])
						}
						formatOptionLabel={(option) =>
							`${option.label} (${option.code}) ${option.value}`
						}
						isSearchable={false}
					/>
				</Col>
				<Col xl={4} md={5} sm={5} xs={12} className="mt-1">
					<label
						className="game-report-dashboard-filter-label"
						htmlFor="playerSelect"
					>
						Player
					</label>
					<CustomSelectField
						name="dashboardTag"
						type="select"
						value={filters[0].tagIds || ''}
						className="mx-2"
						placeholder="Player By"
						key="my_unique_select_key_gameReport"
						onChange={(e) => {
							const selectedTag = e.target.value;
							setFilters([{ ...filters[0], tagIds: selectedTag }]);
						}}
						options={playerOptions?.map((item) => (
							<option value={item.value} key={item.value}>
								{item.label}
							</option>
						))}
					/>
				</Col>
				<Col
					// xl={4}
					// md={2}
					// sm={2}
					// xs={12}
					className="d-flex justify-content-end mt-1"
				>
					<Button color="primary" onClick={handleApplyFilter}>
						Apply
					</Button>
				</Col>
			</Row>
		</Card>
	);
};

export default DashboardFilters;
