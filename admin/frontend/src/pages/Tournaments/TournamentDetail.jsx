/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useMemo, useState } from 'react';
import { Badge, Col, Card, CardBody, Row } from 'reactstrap';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { keyBy } from 'lodash';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import TabsPage from '../../components/Common/TabsPage';
import BasicDetails from './components/BasicDetails';
import PrizeDetails from './components/PrizeDetails';
import GameDetails from './components/GameDetails';
import LeaderBoard from './components/LeaderBoard';
import Transactions from './components/Transactions';
import {
	getTournamentDetailByIdStart,
	resetTournamentDetail,
} from '../../store/tournaments/actions';
import { CustomSelectField } from '../../helpers/customForms';
import { StatusBadge } from './TournamentListCol';
import { defaultCurrencyId } from '../../constants/config';
import { getAllTags } from '../../store/actions';
import { modules } from '../../constants/permissions';
import usePermission from '../../components/Common/Hooks/usePermission';

const TournamentDetail = () => {
	const { tournamentId } = useParams();
	const { isGranted } = usePermission();
	const dispatch = useDispatch();
	const [activeTab, setActiveTab] = useState('1');

	const { currencies, currencyById } = useSelector((state) => state.Currencies);

	const [currencyId, setCurrencyId] = useState(defaultCurrencyId);

	const { tournamentDetail, tournamentDetailLoading } = useSelector(
		(state) => state.Tournament
	);
	const { userTagsById, userTags } = useSelector((state) => state.UserDetails);

	useEffect(() => {
		if (!userTags && isGranted(modules.segmentation, 'R')) {
			dispatch(getAllTags());
		}
	}, []);

	const toggle = (tab) => {
		if (activeTab !== tab) {
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

	const currencyWise = useMemo(() => {
		const code = currencyById?.[currencyId]?.code || '';
		const symbol = currencyById?.[currencyId]?.symbol || '';
		const tourCurrencyById = keyBy(
			tournamentDetail?.tournamentCurrencies || [],
			'currencyId'
		);

		const poolPrize = tourCurrencyById?.[currencyId]?.poolPrize || 0;
		const minPlayerLimit = tourCurrencyById?.[currencyId]?.minPlayerLimit || 0;
		const maxPlayerLimit = tourCurrencyById?.[currencyId]?.maxPlayerLimit || 0;
		const entryFees = tourCurrencyById?.[currencyId]?.entryFees || 0;
		const rebuyFees = tourCurrencyById?.[currencyId]?.entryFees || 0;

		const prizes = tourCurrencyById?.[currencyId]?.tournamentPrizes || [];

		return {
			code,
			symbol,
			poolPrize,
			minPlayerLimit,
			maxPlayerLimit,
			entryFees,
			rebuyFees,
			prizes,
		};
	}, [currencyById, currencyId, tournamentDetail?.tournamentCurrencies]);

	const tabData = [
		{
			id: '1',
			title: 'Overview',
			component: (
				<BasicDetails
					tournamentDetail={{ ...tournamentDetail, ...currencyWise }}
					tournamentDetailLoading={tournamentDetailLoading}
				/>
			),
		},
		{
			id: '2',
			title: 'Prize Distribution',
			component: <PrizeDetails currencyWise={currencyWise} />,
		},
		{
			id: '3',
			title: 'Selected Games',
			component: <GameDetails tournamentDetail={tournamentDetail} />,
		},
		{
			id: '4',
			title: 'LeaderBoard',
			component: (
				<LeaderBoard
					tournamentDetail={tournamentDetail}
					currencyId={currencyId}
					currencyWise={currencyWise}
				/>
			),
		},
		{
			id: '5',
			title: 'Bet History',
			component: (
				<Transactions
					tournamentDetail={tournamentDetail}
					currencyId={currencyId}
				/>
			),
		},
	];

	return (
		<div className="page-content">
			<Breadcrumbs
				title="Tournaments"
				breadcrumbItem="View"
				titleLink="/tournaments"
				leftTitle={
					<>
						<i className="fas fa-angle-left" /> Back
					</>
				}
			/>
			<Card>
				<CardBody>
					<Row lg={12} className="mt-2">
						<Col lg={4} className="p-4">
							<img
								alt="tournament"
								src={tournamentDetail?.image ? tournamentDetail?.image : ''}
								width="100%"
								height="auto"
								style={{ maxHeight: '265px' }}
							/>
						</Col>
						<Col lg={8} className="mt-2">
							<Row>
								<Col lg={9}>
									<h3>{tournamentDetail?.name?.EN}</h3>
								</Col>
								<Col sm={12} lg={3} className="mb-3">
									<CustomSelectField
										id="currencyId"
										type="select"
										name="currencyId"
										value={currencyId}
										onChange={(e) => setCurrencyId(e.target.value)}
										options={
											<>
												<option value={null} selected disabled>
													Select currency
												</option>
												{currencies?.currencies
													?.filter((curr) => curr.type !== 'point')
													?.map(({ id: value, name }) => (
														<option key={value} value={value}>
															{name}
														</option>
													))}
											</>
										}
									/>
								</Col>
							</Row>
							<div className="hstack gap-3 flex-wrap">
								<div className="text-muted">
									Status :{' '}
									{tournamentDetail?.status ? (
										<StatusBadge
											className="font-size-12"
											value={tournamentDetail?.status}
										/>
									) : (
										<Badge className="bg-warning font-size-12">
											No Details
										</Badge>
									)}
								</div>
								<div className="vr" />
								<div className="text-muted">
									Registration Closed :{' '}
									{tournamentDetail?.isRegistrationClosed ? (
										<Badge className="bg-success font-size-12">Yes</Badge>
									) : (
										<Badge className="bg-danger font-size-12">No</Badge>
									)}
								</div>
								<div className="vr" />
								<div className="text-muted">
									segments :{' '}
									{tournamentDetail?.tagIds?.length
										? tournamentDetail?.tagIds?.map((tagId) => (
												<Badge className="badge-soft-secondary me-1">
													{userTagsById[tagId]?.tag}
												</Badge>
										  ))
										: '-'}
								</div>
							</div>

							<Row className="mt-4">
								<Col lg={3} sm={6} className="my-2">
									<div className="p-2 border rounded text-center">
										<p className="text-muted fw-medium mb-1 font-size-16">
											<i className="mdi mdi-ethereum me-1 text-success" />
											Pool Prize
										</p>
										<h5 className="fs-17 text-success mb-0">
											{currencyWise?.symbol || ''}
											{currencyWise.poolPrize}
										</h5>
									</div>
								</Col>
								{/* <Col lg={3} sm={6}>
									<div className="p-2 border rounded text-center">
										<p className="text-muted fw-medium mb-1 font-size-16">
											Credit Points
										</p>
										<h5 className="fs-17 text-success  mb-0">
											{tournamentDetail?.creditPoints}
										</h5>
									</div>
								</Col> */}
								<Col lg={3} sm={6}>
									<div className="p-2 border rounded text-center">
										<p className="text-muted fw-medium mb-1 font-size-16">
											Start Date
										</p>
										<h5 className="fs-17 text-warning  mb-0">
											{moment(tournamentDetail?.startDate).format(
												'MMM Do YY, h:mm a'
											)}
										</h5>
									</div>
								</Col>
								<Col lg={3} sm={6}>
									<div className="p-2 border rounded text-center">
										<p className="text-muted fw-medium mb-1 font-size-16">
											End Date
										</p>
										<h5 id="auction-time-1" className="mb- text-danger">
											{moment(tournamentDetail?.endDate).format(
												'MMM Do YY, h:mm a'
											)}
										</h5>
									</div>
								</Col>
								<Col lg={3} sm={6}>
									<div className="p-2 border rounded text-center">
										<p className="text-muted fw-medium mb-1 font-size-16">
											Registration End
										</p>
										<h5 id="auction-time-1" className="mb- text-danger">
											{moment(tournamentDetail?.registrationEndDate).format(
												'MMM Do YY, h:mm a'
											)}
										</h5>
									</div>
								</Col>
							</Row>

							<div className="mt-4 text-muted">
								<h4 className="fs-12">Description :</h4>
								{tournamentDetail?.description?.EN}
							</div>
						</Col>
					</Row>
					<Row className="mt-4 text-muted">
						<h4 className="mb-3 fs-12">Tournament Info :</h4>
						<TabsPage
							activeTab={activeTab}
							tabsData={tabData}
							toggle={toggle}
							navClass="p-0"
							tabType="tab"
							tabContentClass="border border-top-0"
							tabCardClass="mb-0 shadow-none"
						/>
					</Row>
				</CardBody>
			</Card>
		</div>
	);
};

export default TournamentDetail;
