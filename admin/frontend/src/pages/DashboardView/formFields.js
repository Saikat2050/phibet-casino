import * as Yup from 'yup';
import { getItem } from '../../network/storageUtils';
import { STORAGE_KEY } from '../../components/Common/constants';

const DASH_REPORTS = {
	reportCards: 'reportCards',
	purchase: 'purchase',
	redeem: 'redeem',
	wagered: 'wagered',
	payout: 'payout',
	ggrReport: 'ggrReport',
	playerLogin: 'playerLogin',
	activePlayers: 'activePlayers',
	coinPlayers: 'coinPlayers',
	demographic: 'demographic',
	kpiSummary: 'kpiSummary',
	topGames: 'topGames',
	topPlayers: 'topPlayers',
	kpiReport: 'kpiReports',
	bonusReport: 'bonusReport'
};

const dashboardElements = (hide = ['none']) => [
	{
		name: DASH_REPORTS.reportCards,
		fieldType: 'switch',
		label: 'Widgets',
		switchSpanClass: 'custom-switch-dash',
		isDisabled: hide.includes(DASH_REPORTS.reportCards),
	},
	{
		name: DASH_REPORTS.purchase,
		fieldType: 'switch',
		label: 'Purchase Chart',
		switchSpanClass: 'custom-switch-dash',
		isDisabled: hide.includes(DASH_REPORTS.purchase),
	},
	{
		name: DASH_REPORTS.redeem,
		fieldType: 'switch',
		label: 'Redeem Chart',
		switchSpanClass: 'custom-switch-dash',
		isDisabled: hide.includes(DASH_REPORTS.redeem),
	},
	{
		name: DASH_REPORTS.ggrReport,
		fieldType: 'switch',
		label: 'Revenue Report',
		switchSpanClass: 'custom-switch-dash',
		isDisabled: hide.includes(DASH_REPORTS.ggrReport),
	},
	{
		name: DASH_REPORTS.wagered,
		fieldType: 'switch',
		label: 'Wagered Chart',
		switchSpanClass: 'custom-switch-dash',
		isDisabled: hide.includes(DASH_REPORTS.wagered),
	},
	{
		name: DASH_REPORTS.payout,
		fieldType: 'switch',
		label: 'Payout Chart',
		switchSpanClass: 'custom-switch-dash',
		isDisabled: hide.includes(DASH_REPORTS.payout),
	},
	{
		name: DASH_REPORTS.coinPlayers,
		fieldType: 'switch',
		label: 'Active Players of Coins',
		switchSpanClass: 'custom-switch-dash',
		isDisabled: hide.includes(DASH_REPORTS.coinPlayers),
	},
	{
		name: DASH_REPORTS.activePlayers,
		fieldType: 'switch',
		label: 'Active Players Chart',
		switchSpanClass: 'custom-switch-dash',
		isDisabled: hide.includes(DASH_REPORTS.activePlayers),
	},
	{
		name: DASH_REPORTS.topGames,
		fieldType: 'switch',
		label: 'Top Games',
		switchSpanClass: 'custom-switch-dash',
		isDisabled: hide.includes(DASH_REPORTS.topGames),
	},
	{
		name: DASH_REPORTS.topPlayers,
		fieldType: 'switch',
		label: 'Player Performance',
		switchSpanClass: 'custom-switch-dash',
		isDisabled: hide.includes(DASH_REPORTS.topPlayers),
	},
	{
		name: DASH_REPORTS.bonusReport,
		fieldType: 'switch',
		label: 'BonusReport',
		switchSpanClass: 'custom-switch-dash',
		isDisabled: hide.includes(DASH_REPORTS.bonusReport),
	},
];

const initialElement = () => {
	let dashConfig = getItem(STORAGE_KEY.DASH_CONFIG);
	if (typeof dashConfig === 'string') {
		dashConfig = JSON.parse(dashConfig);
	}
	return {
		[DASH_REPORTS.reportCards]: dashConfig?.[DASH_REPORTS.reportCards] ?? true,
		[DASH_REPORTS.purchase]: dashConfig?.[DASH_REPORTS.purchase] ?? true,
		[DASH_REPORTS.redeem]: dashConfig?.[DASH_REPORTS.redeem] ?? true,
		[DASH_REPORTS.wagered]: dashConfig?.[DASH_REPORTS.wagered] ?? true,
		[DASH_REPORTS.payout]: dashConfig?.[DASH_REPORTS.payout] ?? true,
		[DASH_REPORTS.ggrReport]: dashConfig?.[DASH_REPORTS.ggrReport] ?? true,
		[DASH_REPORTS.playerLogin]: dashConfig?.[DASH_REPORTS.playerLogin] ?? true,
		[DASH_REPORTS.coinPlayers]: dashConfig?.[DASH_REPORTS.coinPlayers] ?? true,
		[DASH_REPORTS.activePlayers]:
			dashConfig?.[DASH_REPORTS.activePlayers] ?? true,
		[DASH_REPORTS.demographic]: dashConfig?.[DASH_REPORTS.demographic] ?? true,
		[DASH_REPORTS.kpiSummary]: dashConfig?.[DASH_REPORTS.kpiSummary] ?? true,
		[DASH_REPORTS.topGames]: dashConfig?.[DASH_REPORTS.topGames] ?? true,
		[DASH_REPORTS.topPlayers]: dashConfig?.[DASH_REPORTS.topPlayers] ?? true,
		[DASH_REPORTS.kpiReport]: dashConfig?.[DASH_REPORTS.kpiReport] ?? true,
		[DASH_REPORTS.bonusReport]: dashConfig?.[DASH_REPORTS.bonusReport] ?? true,
	};
};

const validationSchema = () => Yup.object({});

export { dashboardElements, initialElement, validationSchema, DASH_REPORTS };
