/* eslint-disable react/prop-types */
import React, { useMemo, useState } from 'react';

import { Container } from 'reactstrap';
import TableContainer from '../../components/Common/Table';

import {
	RTP,
	TemplateName,
	WageringContribution,
	Select,
} from './WageringTemplateListCol';
import {
	CustomInputField,
	CustomSwitchButton,
} from '../../helpers/customForms';
import { showToastr } from '../../utils/helpers';

const columns = (
	handleChange,
	selectedId,
	isAllSelected,
	handleSelectAll,
	commonContribution,
	handleAllContributionPercentageChange,
	handleContributionPercentage
) =>
	useMemo(
		() => [
			{
				Header: (
					<CustomSwitchButton
						label="Select All"
						labelClassName="form-check-label"
						htmlFor="customRadioInline1"
						type="switch"
						id="customRadioInline1"
						name="select"
						inputClassName="form-check-input"
						checked={isAllSelected}
						value={isAllSelected}
						onClick={(e) => handleSelectAll(e)}
					/>
				),
				accessor: 'checkField',
				disableSortBy: true,
				Cell: ({ cell }) => (
					<Select
						cell={cell}
						handleChange={handleChange}
						selectedId={selectedId}
					/>
				),
			},
			{
				Header: 'Game Name',
				accessor: 'name',
				Cell: ({ cell }) => <TemplateName cell={cell} />,
			},
			{
				Header: 'RTP',
				accessor: 'returnToPlayer',
				Cell: ({ cell }) => <RTP cell={cell} />,
			},
			{
				Header: 'Default Contribution',
				accessor: 'wageringContribution',
				Cell: ({ cell }) => <WageringContribution cell={cell} />,
			},
			{
				Header: 'Contribution Percentage',
				accessor: 'gameContributionPercentage',
				Cell: ({ cell }) => <RTP cell={cell} />,
			},
			{
				Header: (
					<CustomInputField
						placeholder="Enter Contribution Percentage"
						value={commonContribution}
						onChange={handleAllContributionPercentageChange}
						type="text"
					/>
				),
				disableSortBy: true,
				accessor: 'form',
				Cell: ({ cell }) => (
					<div key={cell?.row?.original?.id}>
						<CustomInputField
							id={cell?.row?.original?.id}
							key={cell?.row?.original?.id}
							placeholder="Enter Contribution Percentage"
							defaultValue={
								selectedId[cell.row.original.id]?.contributionPercentage || ''
							}
							onBlur={(e) =>
								handleContributionPercentage(e, cell.row.original.id)
							}
							type="number"
						/>
						<span className="text-danger">
							{selectedId[cell.row.original.id]?.error || ''}
						</span>
					</div>
				),
			},
		],
		[
			handleChange,
			selectedId,
			isAllSelected,
			handleSelectAll,
			commonContribution,
			handleAllContributionPercentageChange,
			handleContributionPercentage,
		]
	);

const CasinoGamesForm = ({
	casinoGames,
	wageringTemplateDetail,
	selectedId,
	setSelectedId,
	onChangeRowsPerPage,
	itemsPerPage,
	isCasinoGamesLoading,
	page,
	setPage,
	filterComponent,
	selectedFiltersComponent,
}) => {
	const [isAllSelected, setIsAllSelected] = useState(false);
	const [commonContribution, setCommonContribution] = useState('');
	const formattedCasinoGames = useMemo(() => {
		if (casinoGames?.games) {
			return casinoGames?.games?.map((game) => ({
				...game,
				gameContributionPercentage: selectedId[game.id]
					? selectedId[game.id].contributionPercentage
					: '-',
			}));
		}
		return [];
	}, [casinoGames, wageringTemplateDetail]);

	const handleChange = (e, cell) => {
		const id = cell?.row?.original?.id;
		if (!id) return;
		if (e.target.checked) {
			setSelectedId((prevSelectedId) => ({
				...prevSelectedId,
				[id]: { contributionPercentage: '', error: '' },
			}));
		} else {
			const selectedIds = { ...selectedId };
			delete selectedIds[id];
			setSelectedId(selectedIds);
		}
	};

	const handleSelectAll = (e) => {
		e.preventDefault();
		const selectedIds = selectedId;
		if (!e.target.checked) {
			formattedCasinoGames?.forEach(({ id }) => {
				delete selectedIds[id];
			});
			setIsAllSelected(false);
		} else {
			formattedCasinoGames?.forEach(({ id }) => {
				selectedIds[id] = { contributionPercentage: '', error: '' };
			});
			setIsAllSelected(true);
		}
		setSelectedId(selectedId);
	};

	const handleAllContributionPercentageChange = (e) => {
		e.preventDefault();
		const val = e.target.value;
		if (!(val >= 0 && val <= 100)) {
			showToastr({
				message: 'Contribution percentage must be in range 0 to 100',
				type: 'error',
			});
			return null;
		}
		setCommonContribution(val);
		const selectedIds = {};
		Object.keys(selectedId || {}).forEach((gameId) => {
			selectedIds[gameId] = { contributionPercentage: val, error: '' };
		});
		setSelectedId(selectedIds);
		return null;
	};

	const handleContributionPercentage = (e, id) => {
		e.preventDefault();
		const val = e.target.value;
		let error = '';
		if (!(val > 0 && val <= 100)) {
			error = 'Contribution percentage must be in range 0 to 100';
		}

		setSelectedId((prev) => ({
			...prev,
			[id]: { contributionPercentage: val, error },
		}));
		return null;
	};

	return (
		<Container fluid>
			<TableContainer
				columns={columns(
					handleChange,
					selectedId,
					isAllSelected,
					handleSelectAll,
					commonContribution,
					handleAllContributionPercentageChange,
					handleContributionPercentage
				)}
				data={formattedCasinoGames}
				isPagination
				customPageSize={itemsPerPage}
				totalPageCount={casinoGames?.totalPages}
				isManualPagination
				onChangePagination={setPage}
				currentPage={page}
				isLoading={isCasinoGamesLoading}
				changeRowsPerPageCallback={onChangeRowsPerPage}
				filterComponent={filterComponent}
				selectedFiltersComponent={selectedFiltersComponent}
			/>
		</Container>
	);
};

export default CasinoGamesForm;
