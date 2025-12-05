import { BONUS_KEY_RELATION, BONUS_TYPES } from '../constants';

const getViewBonusInitialValues = (bonusDetails) => {
	const currencyDetails = bonusDetails?.bonusCurrencies?.length
		? {
				...bonusDetails.bonusCurrencies?.[0],
		  }
		: {
				zeroOutThreshold: '',
				currencyId: '',
				amount: '',
				maxBonusClaimed: '',
				minBetAmount: '',
				minDepositAmount: '',
		  };

	const wageringTemplateId =
		bonusDetails?.[BONUS_KEY_RELATION[bonusDetails?.bonusType]]
			?.wageringTemplateId || '';
	const quantity =
		bonusDetails?.[BONUS_KEY_RELATION[bonusDetails?.bonusType]]
			?.freespinQuantity || '';
	const gameIds =
		bonusDetails?.[BONUS_KEY_RELATION[bonusDetails?.bonusType]]?.gameIds || [];
	const percentage =
		bonusDetails?.[BONUS_KEY_RELATION[bonusDetails?.bonusType]]?.percentage ||
		'';

	return {
		promotionTitle: bonusDetails?.promotionTitle || {},
		description: bonusDetails?.description || {},
		termAndCondition: bonusDetails?.termAndCondition || {},
		wageringTemplateId,
		percentage,
		validFrom: bonusDetails?.validFrom ? new Date(bonusDetails?.validFrom) : '',
		validTo: bonusDetails?.validTo ? new Date(bonusDetails?.validTo) : '',
		bonusType: bonusDetails?.bonusType || BONUS_TYPES.JOINING,
		daysToClear: bonusDetails?.daysToClear || '1',
		quantity,
		isActive: bonusDetails?.isActive || true,
		visibleInPromotions: bonusDetails?.visibleInPromotions || false,
		validOnDays: bonusDetails?.validOnDays || '',
		bonusImage: bonusDetails?.imageUrl || '',
		currencyDetails,
		gameIds,
		...bonusDetails,
	};
};

export default getViewBonusInitialValues;
