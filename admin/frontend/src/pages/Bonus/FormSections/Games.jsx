/* eslint-disable react/prop-types */
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Col, Row } from 'reactstrap';
import { isEmpty } from 'lodash';
import {
	getCasinoGamesStart,
	getCasinoProvidersDataStart,
} from '../../../store/actions';
import {
	CustomInputField,
	CustomSelectField,
	CustomSwitchButton,
} from '../../../helpers/customForms';
import TableContainer from '../../../components/Common/Table';
import { selectedLanguage } from '../../../constants/config';
import Actions from './Actions';
import { showToastr } from '../../../utils/helpers';

const KeyValueCell = ({ cell }) => (cell.value ? cell.value : '');

const CheckboxInput = ({ cell, gameIds, toggleSelectGame }) => (
	<div className=" d-flex justify-content-center">
		<CustomSwitchButton
			type="checkbox"
			containerClass="false"
			className="form-check-input"
			checked={gameIds?.includes(cell?.row?.original?.id?.toString())}
			switchSizeClass="form-switch-sm"
			onClick={() => toggleSelectGame(cell?.row?.original?.id?.toString())}
		/>
	</div>
);

const columnsArray = ({ gameIds, toggleSelectGame }) => [
	{
		Header: 'SELECT',
		accessor: 'select',
		disableSortBy: true,
		Cell: ({ cell }) => (
			<CheckboxInput
				gameIds={gameIds}
				toggleSelectGame={toggleSelectGame}
				cell={cell}
			/>
		),
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
		Header: 'PROVIDER',
		disableSortBy: true,
		accessor: 'providerName',
		Cell: ({ cell }) => <KeyValueCell cell={cell} />,
	},
];

const Games = ({
	gameIds,
	setGameIds,
	activeTab,
	submitButtonLoading,
	toggleTab,
	tabsToShow,
}) => {
	const dispatch = useDispatch();
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(10);
	const [searchText, setSearchText] = useState('');
	const [selectedProvider, setSelectedProvider] = useState('');
	const { casinoProvidersData, casinoGames, isCasinoGamesLoading } =
		useSelector((state) => state.CasinoManagementData);

	useEffect(() => {
		dispatch(getCasinoProvidersDataStart());
	}, []);

	const handleNextClick = (nextTab) => {
		if (isEmpty(gameIds)) {
			showToastr({ message: 'Please select at least 1 game', type: 'error' });
		} else {
			toggleTab(nextTab);
		}
	};

	const providerOptions = useMemo(() => {
		if (casinoProvidersData?.providers) {
			return casinoProvidersData?.providers?.map((provider) => ({
				optionLabel: provider.name[selectedLanguage],
				value: provider.id,
			}));
		}
		return [];
	}, [casinoProvidersData]);

	useEffect(() => {
		dispatch(
			getCasinoGamesStart({
				perPage: itemsPerPage,
				page: currentPage,
				search: searchText,
				casinoProviderId: selectedProvider || '',
				freespins: true,
			})
		);
	}, [itemsPerPage, currentPage, searchText, selectedProvider]);

	const formattedCasinoGames = useMemo(() => {
		if (casinoGames?.games) {
			return casinoGames?.games?.map((game) => ({
				...game,
				name: game.name[selectedLanguage],
				providerName: casinoProvidersData?.providers?.find(
					(obj) => obj.id === game.casinoProviderId
				)?.name[selectedLanguage],
			}));
		}
		return [];
	}, [casinoGames, casinoProvidersData]);

	const toggleSelectGame = (id) => {
		if (gameIds.includes(id)) {
			const array = gameIds.filter((game) => game !== id);
			setGameIds(array);
		} else {
			setGameIds((prev) => [...prev, id]);
		}
	};

	const columns = useMemo(
		() => columnsArray({ gameIds, toggleSelectGame }),
		[gameIds]
	);

	return (
		<Card>
			<Row>
				<Col sm="6" className="mb-3">
					<CustomSelectField
						label="Provider"
						type="select"
						onChange={(e) => {
							setSelectedProvider(e.target.value);
						}}
						placeholder="Select Provider"
						value={selectedProvider}
						options={
							<>
								<option value="" selected>
									Select Provider
								</option>
								{providerOptions?.map(({ optionLabel, value }) => (
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
						isLoading={isCasinoGamesLoading}
						columns={columns}
						data={formattedCasinoGames}
						isPagination
						customPageSize={itemsPerPage}
						tableClass="table-bordered align-middle nowrap mt-2"
						// paginationDiv="col-sm-12 col-md-7"
						paginationDiv="justify-content-center"
						pagination="pagination justify-content-start pagination-rounded"
						totalPageCount={casinoGames?.totalPages}
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

export default Games;
