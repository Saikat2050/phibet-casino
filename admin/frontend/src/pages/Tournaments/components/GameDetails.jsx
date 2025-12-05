/* eslint-disable react/prop-types */
import React, { useMemo } from 'react';
import { Row } from 'reactstrap';

import {
	KeyValueCell,
	ThumbnailUrl,
} from '../../CasinoGames/CasinoGamesListCol';
import TableContainer from '../../../components/Common/Table';
import { selectedLanguage } from '../../../constants/config';

const columns = [
	{
		Header: 'GAME ID',
		accessor: 'casinoGameId',
		Cell: ({ cell }) => <KeyValueCell cell={cell} />,
	},
	{
		Header: 'NAME',
		accessor: 'name',
		Cell: ({ cell }) => <KeyValueCell cell={cell} />,
	},
	{
		Header: 'THUMBNAIL',
		accessor: 'iconUrl',
		filterable: true,
		disableSortBy: true,
		Cell: ({ cell }) => <ThumbnailUrl value={cell.value} />,
	},
	// {
	// 	Header: 'CATEGORY',
	// 	accessor: 'category',
	// 	Cell: ({ cell }) => <KeyValueCell cell={cell} />,
	// },
	// {
	// 	Header: 'PROVIDER',
	// 	accessor: 'providerName',
	// 	filterable: true,
	// 	Cell: ({ cell }) => <Provider value={cell.value || '-'} />,
	// },
];

const GameDetails = ({ tournamentDetail }) => {
	const formattedCasinoGames = useMemo(
		() =>
			tournamentDetail?.casinoTournamentGames?.map((game) => ({
				...game,
				name: game?.casinoGame?.name?.[selectedLanguage],
				iconUrl: game?.casinoGame?.iconUrl,
			})),
		[tournamentDetail?.casinoTournamentGames]
	);

	return (
		<Row lg={12}>
			<TableContainer
				columns={columns || []}
				data={formattedCasinoGames || []}
				paginationDiv="justify-content-center"
				pagination="pagination justify-content-start pagination-rounded"
				customPageSize={formattedCasinoGames?.length || 100}
				tableClass="table-striped table-hover "
			/>
		</Row>
	);
};

export default GameDetails;
