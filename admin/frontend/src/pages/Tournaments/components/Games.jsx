/* eslint-disable react/prop-types */
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row } from 'reactstrap';
import { isEmpty, uniqBy } from 'lodash';
import { CustomSwitchButton } from '../../../helpers/customForms';
import TableContainer from '../../../components/Common/Table';
import {
	Provider,
	Status,
	ThumbnailUrl,
} from '../../CasinoGames/CasinoGamesListCol';
import useGameFilters from '../hooks/useGameFilters';
import { getCasinoGamesStart } from '../../../store/actions';
import Actions from './Actions';
import { showToastr } from '../../../utils/helpers';

const KeyValueCell = ({ cell }) => (cell.value ? cell.value : '-');

const CheckboxInput = ({ cell, selectedGames, toggleSelectGame }) => (
	<div className="d-flex justify-content-center">
		<CustomSwitchButton
			type="checkbox"
			// containerClass="false"
			containerClass="form-switch-md"
			className="form-check-input"
			checked={selectedGames?.find(
				({ casinoGameId }) =>
					casinoGameId === cell?.row?.original?.id.toString()
			)}
			switchSizeClass="form-switch-sm"
			onClick={() => toggleSelectGame(cell?.row?.original?.id)}
		/>
	</div>
);

const columnsArray = ({
	selectedGames,
	toggleSelectGame,
	formattedCasinoGames,
	setSelectedGames,
}) => [
	{
		Header: () => (
			<div className="d-flex align-items-center">
				<p className="mx-3 mb-0">All </p>
				<CustomSwitchButton
					type="checkbox"
					name="selectAll"
					containerClass="form-switch-md"
					className="form-check-input"
					checked={
						formattedCasinoGames?.length > 0 &&
						formattedCasinoGames?.every((v) =>
							selectedGames?.find(
								({ casinoGameId }) => casinoGameId === v?.id?.toString()
							)
						)
					}
					switchSizeClass="form-switch-sm"
					onClick={(e) => {
						const newData = [];
						if (!e.target.checked) {
							formattedCasinoGames?.forEach((v) =>
								newData.push({ casinoGameId: v.id })
							);
							setSelectedGames((prev) =>
								uniqBy([...prev, ...newData], 'casinoGameId')
							);
						} else {
							setSelectedGames((prev) => {
								const filteredGames = prev.filter(
									({ casinoGameId }) =>
										!formattedCasinoGames.find(
											(item) => item.id.toString() === casinoGameId
										)
								);
								return filteredGames;
							});
						}
					}}
				/>
			</div>
		),
		accessor: 'code',
		disableSortBy: true,
		Cell: ({ cell }) => (
			<CheckboxInput
				selectedGames={selectedGames}
				toggleSelectGame={toggleSelectGame}
				cell={cell}
			/>
		),
	},
	{
		Header: 'THUMBNAIL',
		accessor: 'iconUrl',
		filterable: true,
		disableSortBy: true,
		Cell: ({ cell }) => <ThumbnailUrl value={cell.value} />,
	},
	{
		Header: 'GAME ID',
		disableSortBy: true,
		accessor: 'id',
		Cell: ({ cell }) => <KeyValueCell cell={cell} />,
	},
	{
		Header: 'NAME',
		disableSortBy: true,
		accessor: 'name',
		Cell: ({ cell }) => <KeyValueCell cell={cell} />,
	},
	{
		Header: 'CATEGORY',
		disableSortBy: true,
		accessor: 'category',
		Cell: ({ cell }) => <KeyValueCell cell={cell} />,
	},
	{
		Header: 'PROVIDER',
		accessor: 'provider',
		filterable: true,
		Cell: ({ cell }) => <Provider value={cell.value || '-'} />,
	},
	{
		Header: 'STATUS',
		accessor: 'isActive',
		disableFilters: true,
		disableSortBy: true,
		Cell: ({ cell }) => <Status value={cell.value} />,
	},
];

const Games = ({
	selectedGames,
	setSelectedGames,
	submitButtonLoading,
	toggleTab,
	tabsToShow,
	activeTab,
}) => {
	const dispatch = useDispatch();
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(10);

	const { casinoGames, isCasinoGamesLoading } = useSelector(
		(state) => state.CasinoManagementData
	);

	const { filterValidation, filterComponent, selectedFiltersComponent } =
		useGameFilters();

	useEffect(() => {
		dispatch(
			getCasinoGamesStart({
				perPage: itemsPerPage,
				page: currentPage,
				...filterValidation.values,
			})
		);
	}, [itemsPerPage, currentPage]);

	const formattedCasinoGames = useMemo(() => {
		if (casinoGames) {
			return casinoGames?.games?.map((game) => ({
				...game,
				name: game?.name?.EN,
				category: game?.casinoCategory?.name?.EN || '',
				provider: game?.casinoProvider?.name?.EN || '',
			}));
		}
		return [];
	}, [casinoGames]);

	const toggleSelectGame = (id) => {
		const found = selectedGames?.find((game) => game.casinoGameId === id);
		if (found) {
			const updatedGames = selectedGames?.filter(
				({ casinoGameId }) => casinoGameId !== id.toString()
			);
			setSelectedGames(updatedGames);
		} else {
			setSelectedGames((prev) => [...prev, { casinoGameId: id }]);
		}
	};

	const handleNextClick = (nextTab) => {
		if (isEmpty(selectedGames)) {
			showToastr({
				message: 'Please select at least one game.',
				type: 'error',
			});
		} else {
			toggleTab(nextTab);
		}
	};

	const columns = useMemo(
		() =>
			columnsArray({
				selectedGames,
				toggleSelectGame,
				formattedCasinoGames,
				setSelectedGames,
			}),
		[selectedGames, formattedCasinoGames]
	);

	return (
		<Row>
			<TableContainer
				isLoading={isCasinoGamesLoading}
				columns={columns || []}
				data={formattedCasinoGames || []}
				isPagination
				customPageSize={itemsPerPage}
				tableClass="table-bordered align-middle nowrap mt-2"
				paginationDiv="justify-content-center"
				pagination="pagination justify-content-start pagination-rounded"
				totalPageCount={casinoGames?.totalPages || 1}
				isManualPagination
				onChangePagination={setCurrentPage}
				currentPage={currentPage}
				changeRowsPerPageCallback={setItemsPerPage}
				filterComponent={filterComponent}
				selectedFiltersComponent={selectedFiltersComponent}
			/>
			<Actions
				handleNextClick={handleNextClick}
				submitButtonLoading={submitButtonLoading}
				activeTab={activeTab}
				toggleTab={toggleTab}
				tabsToShow={tabsToShow}
			/>
		</Row>
	);
};

export default Games;
