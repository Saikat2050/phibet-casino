/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
// import { formatDateYMD, safeStringify } from '../../../utils/helpers';
import General from '../components/General';
import Games from '../components/Games';
import {
	createTournamentStart,
	getTournamentDetailByIdStart,
	resetTournamentDetail,
	updateTournamentStart,
} from '../../../store/tournaments/actions';
import Currencies from '../components/Currency';

const useCreateTournaments = () => {
	const { tournamentId } = useParams();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [allFields, setAllFields] = useState({});
	const [activeTab, setActiveTab] = useState('general');
	const [selectedGames, setSelectedGames] = useState([]);

	const {
		isCreateTournamentLoading,
		tournamentDetail,
		tournamentSegmentDetail,
		isUpdateTournamentLoading,
	} = useSelector((state) => state.Tournament);

	useEffect(() => {
		if (tournamentDetail && tournamentId) {
			setSelectedGames(
				tournamentDetail?.casinoTournamentGames?.map((game) => ({
					id: game.id,
					casinoGameId: game.casinoGameId,
				})) || []
			);
		}
	}, [tournamentDetail]);

	const toggleTab = (tab, updatedAllFields = allFields) => {
		if (tab === 'submit') {
			if (!isCreateTournamentLoading || !isUpdateTournamentLoading) {
				const currencyData = allFields?.currencyDetails?.map(
					({
						entryFees,
						currencyId,
						rebuyLimit,
						rebuyFees,
						poolPrize,
						maxPlayerLimit,
						minPlayerLimit,
						prizes,
						tournamentPrizeType,
					}) => ({
						entryFees,
						currencyId,
						rebuyLimit,
						rebuyFees,
						poolPrize,
						maxPlayerLimit,
						minPlayerLimit,
						prizes: Object.values(prizes || {})?.map(
							({ rank, type, value }) => ({
								rank,
								type,
								...(tournamentPrizeType === 'cash'
									? { amount: value }
									: { item: value }),
							})
						),
					})
				);
				const data = {
					...updatedAllFields,
					currencyDetails: currencyData,
					casinoGameIds: selectedGames?.map((game) => game.casinoGameId),
					tagIds:
						allFields?.tagIds?.map((tag) => parseInt(tag?.value, 10)) || [],
				};

				if (typeof data?.image === 'string') {
					delete data.image;
				}
				if (!tournamentId) {
					dispatch(
						createTournamentStart({
							data,
							navigate,
						})
					);
				} else {
					dispatch(
						updateTournamentStart({
							data: {
								...data,
								tournamentId: Number(tournamentId),
							},
							navigate,
						})
					);
				}
			}
		} else if (activeTab !== tab) {
			setActiveTab(tab);
		}
	};

	useEffect(() => {
		if (tournamentId) {
			dispatch(
				getTournamentDetailByIdStart({
					tournamentId: Number(tournamentId),
				})
			);
		}
		return () => dispatch(resetTournamentDetail());
	}, [tournamentId]);

	const tabsToShow = [
		// add same condition like tabData
		{
			id: 'general',
		},
		{
			id: 'coins',
		},
		{
			id: 'games',
		},
	];

	const tabData = [
		{
			id: 'general',
			title: 'Basic Info',
			component: (
				<General
					isLoading={false}
					activeTab={activeTab}
					setActiveTab={setActiveTab}
					allFields={allFields}
					setAllFields={setAllFields}
					tournamentDetail={tournamentDetail}
					tournamentSegmentDetail={tournamentSegmentDetail}
					tournamentId={tournamentId}
					submitButtonLoading={isCreateTournamentLoading}
					tabsToShow={tabsToShow}
					toggleTab={toggleTab}
				/>
			),
		},
		{
			id: 'coins',
			title: 'Coins',
			component: (
				<Currencies
					setActiveTab={setActiveTab}
					allFields={allFields}
					setAllFields={setAllFields}
					casinoTournamentId={tournamentId}
					tournamentDetail={tournamentDetail}
					submitButtonLoading={isCreateTournamentLoading}
					tabsToShow={tabsToShow}
					activeTab={activeTab}
					toggleTab={toggleTab}
				/>
			),
		},
		{
			id: 'games',
			title: 'Games',
			component: (
				<Games
					setActiveTab={setActiveTab}
					allFields={allFields}
					setAllFields={setAllFields}
					selectedGames={selectedGames}
					setSelectedGames={setSelectedGames}
					casinoTournamentId={tournamentId}
					submitButtonLoading={isCreateTournamentLoading}
					tabsToShow={tabsToShow}
					activeTab={activeTab}
					toggleTab={toggleTab}
				/>
			),
		},
	];

	return {
		tabData,
		activeTab,
	};
};

export default useCreateTournaments;
