/* eslint-disable no-param-reassign */
import { put, takeLatest, all, fork, select } from 'redux-saga/effects';
import { orderBy } from 'lodash';

// Crypto Redux States
import {
	getBonusesSuccess,
	getBonusesFail,
	updateSABonusStatusSuccess,
	updateSABonusStatusFail,
	deleteBonusComplete,
	deleteBonusFailure,
	reorderBonusSuccess,
	reorderBonusFailure,
	getBonusDetailSuccess,
	getBonusDetailFail,
} from './actions';

import {
	DELETE_BONUS_START,
	GET_BONUSES_START,
	UPDATE_SA_BONUS_STATUS,
	REORDER_BONUS_START,
	GET_BONUS_DETAIL,
} from './actionTypes';

import { getAllBonus, getBonusDetail } from '../../network/getRequests';
import { showToastr } from '../../utils/helpers';
import { deleteBonus } from '../../network/deleteRequests';
import { reorderBonus, toggleBonusStatus } from '../../network/postRequests';

function* getBonusListingWorker(action) {
	try {
		const payload = action && action.payload;
		let {
			data: { data },
		} = yield getAllBonus(payload);

		data = {
			...data,
			bonus: orderBy(data?.bonus, 'orderId'),
		};

		yield put(getBonusesSuccess(data));
	} catch (error) {
		yield put(getBonusesFail(error?.response?.data?.errors[0]?.description));
	}
}

function* updateSABonusStatusWorker(action) {
	try {
		const payload = action && action.payload;

		yield toggleBonusStatus(payload);
		yield put(updateSABonusStatusSuccess());

		const { bonusDetails } = yield select((state) => state.AllBonusDetails);

		const updatedBonusDetails = bonusDetails?.bonus?.map((bonus) => {
			if (bonus.id === payload.bonusId) {
				bonus.isActive = !bonus.isActive;
			}
			return bonus;
		});

		yield put(
			getBonusesSuccess({
				...bonusDetails,
				bonus: updatedBonusDetails,
			})
		);

		showToastr({
			message: `Status Updated Successfully`,
			type: 'success',
		});
	} catch (e) {
		yield put(updateSABonusStatusFail());
	}
}

function* getBonusDetailStartWorker(action) {
	try {
		const { bonusId, bonusType = '' } = action && action.payload;
		const { data } = yield getBonusDetail({ bonusId, bonusType });
		yield put(getBonusDetailSuccess(data?.data));
	} catch (error) {
		yield put(
			getBonusDetailFail(error?.response?.data?.errors[0]?.description)
		);
	}
}

function* deleteBonusWorker(action) {
	try {
		const { data, handleClose } = action && action.payload;
		const resData = yield deleteBonus(data);
		yield put(deleteBonusComplete());
		showToastr({
			message: resData?.data?.data?.message,
			type: 'success',
		});
		if (handleClose) {
			handleClose();
		}
	} catch (error) {
		yield put(
			deleteBonusFailure(error?.response?.data?.errors[0]?.description)
		);
	}
}

function* updateReorderBonusWorker(action) {
	try {
		const { data, navigate } = action && action.payload;

		yield reorderBonus(data);

		showToastr({
			message: 'Bonus Reorder succesfully',
			type: 'success',
		});

		yield put(reorderBonusSuccess());

		if (navigate) {
			navigate('/bonus');
		}
	} catch (e) {
		yield put(reorderBonusFailure(e?.response?.data?.errors[0]?.description));
	}
}

export function* watchBonusData() {
	yield takeLatest(GET_BONUS_DETAIL, getBonusDetailStartWorker);
	yield takeLatest(DELETE_BONUS_START, deleteBonusWorker);
	yield takeLatest(GET_BONUSES_START, getBonusListingWorker);
	yield takeLatest(UPDATE_SA_BONUS_STATUS, updateSABonusStatusWorker);
	yield takeLatest(REORDER_BONUS_START, updateReorderBonusWorker);
}

function* BonusDetailsSaga() {
	yield all([fork(watchBonusData)]);
}

export default BonusDetailsSaga;
