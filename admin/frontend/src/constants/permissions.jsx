import React from 'react';

const modules = {
	// kyc: 'kyc',
	amoe: 'amoe',
	coin: 'coin',
	page: 'page',
	vip: 'vip',
	admin: 'admin',
	bonus: 'bonus',
	banner: 'banner',
	limits: 'limits',
	player: 'player',
	redeem: 'redeem',
	comment: 'comment',
	gallery: 'gallery',
	package: 'package',
	referral: 'referral',
	// kpiReport: 'kpiReport',
	// demography: 'demography',
	gameReport: 'gameReport',
	// reportGame: 'reportGame',
	// notification: 'notification',
	reportLedger: 'reportLedger',
	segmentation: 'segmentation',
	casinoManagement: 'casinoManagement',
	// kpiSummaryReport: 'kpiSummaryReport',
	// livePlayerDetail: 'livePlayerDetail',
	// disputeManagement: 'disputeManagement',
	reportTransaction: 'reportTransaction',
	applicationSetting: 'applicationSetting',
	// tournamentManagement: 'tournamentManagement',
	reportCasinoTransaction: 'reportCasinoTransaction',
	reportPlayerPerformance: 'reportPlayerPerformance',
	paymentManagement: 'paymentManagement',
	state: 'state',
	spinWheelConfiguration: 'spinWheelConfiguration',
	seoPage: 'seoPage',
	emailTemplate: 'emailTemplate',
	bonusReport: 'bonusReport',
	testimonial: 'testimonial',
	adminActivity: 'adminActivity',
};

const permissionIcons = () => ({
	[modules.seoPage]: <i className="mdi mdi-book-open-page-variant" />,
	[modules.page]: <i className="bx bx-list-ol" />,
	[modules.bonus]: <i className="bx bxs-dollar-circle" />,
	[modules.player]: <i className="bx bx-user" />,
	[modules.admin]: <i className="bx bx-shield-quarter" />,
	[modules.comment]: <i className="bx bx-comment-dots" />,
	[modules.vip]: <i className="bx bx-crown" />,
	[modules.gallery]: <i className="bx bxs-image" />,
	[modules.emailTemplate]: <i className="mdi mdi-email-multiple-outline" />,
	// [modules.kyc]: <i className="bx bx-user-check" />,
	// [modules.kpiReport]: <i className="bx bxs-report" />,
	// [modules.demography]: <i className="mdi mdi-map-marker" />,
	[modules.banner]: <i className="mdi mdi-file-presentation-box" />,
	[modules.casinoManagement]: <i className="mdi mdi-gamepad-variant-outline" />,
	// [modules.kpiSummaryReport]: <i className="mdi mdi-chart-box-outline" />,
	// [modules.livePlayerDetail]: <i className="mdi mdi-television-play" />,
	[modules.applicationSetting]: <i className="mdi mdi-web" />,
	// [modules.tournamentManagement]: <i className="bx bxs-trophy" />,
	[modules.limits]: <i className="mdi mdi-currency-usd-off" />,
	[modules.referral]: <i className="bx bx-user-plus" />,
	[modules.amoe]: <i className="bx bx-money" />,
	[modules.redeem]: <i className="mdi mdi-account-cash-outline" />,
	[modules.package]: <i className="mdi mdi-wallet-giftcard" />,
	// [modules.coin]: <i className="bx bx-bitcoin" />,
	// [modules.notification]: <i className="bx bx-bell" />,
	// [modules.reportGame]: <i className="bx bx-chart" />,
	[modules.reportLedger]: <i className="bx bx-notepad" />,
	[modules.segmentation]: <i className="bx bx-sitemap" />,
	[modules.adminActivity]: <i className="bx bx-sitemap" />,
	[modules.reportTransaction]: <i className="bx bx-wallet-alt" />,
	[modules.reportCasinoTransaction]: <i className="bx bx-trophy" />,
	[modules.reportPlayerPerformance]: <i className="bx bx-line-chart" />,
	// [modules.disputeManagement]: <i className="mdi mdi-face-agent" />,
	[modules.gameReport]: <i className="bx bx-football" />,
	[modules.report]: <i className="bx bx-wallet" />,
	[modules.bonus]: <i className="bx bxs-dollar-circle" />,
	[modules.state]: <i className="bx bxs-dollar-circle" />,
	[modules.paymentManagement]: <i className="bx bxs-dollar-circle" />,
	[modules.spinWheelConfiguration]: <i className="mdi mdi-ship-wheel" />,
	[modules.testimonial]: <i className="bx bx-message-square-detail" />,
});

const permissionLabel = (label) => {
	switch (label) {
		case 'C':
			return 'Create';
		case 'R':
			return 'Read';
		case 'U':
			return 'Update';
		case 'D':
			return 'Delete';
		case 'TS':
			return 'Toggle Status';
		case 'A':
			return 'Apply';
		case 'CC':
			return 'Create Custom';
		case 'MM':
			return 'Manage Coins';
		case 'L':
			return 'Limit';
		case 'TE':
			return 'Test Email';
		case 'VE':
			return 'Verify Email';
		case 'VP':
			return 'Verify Phone';
		case 'RP':
			return 'Reset Password';
		case 'I':
			return 'Issue';
		case 'VK':
			return 'Verify KYC';
		default:
			return label;
	}
};

export { permissionIcons, permissionLabel, modules };
