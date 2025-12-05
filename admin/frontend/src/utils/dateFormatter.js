/* eslint-disable import/no-extraneous-dependencies */
import moment from 'moment-timezone';
import {
	dateTimeFormat,
	dateTimeFormatWithA,
	YMDFormat,
} from '../constants/config';

export const formatDateYMD = (date) =>
	date ? moment(date).format(YMDFormat) : date;

export const getDateTimeWithAMPM = (dateTime) =>
	dateTime ? moment(dateTime).format(dateTimeFormatWithA) : dateTime;

export const getDateTime = (dateTime) =>
	dateTime ? moment(dateTime).format(dateTimeFormat) : dateTime;

// New function for UTC to CT timezone conversion with 12-hour format for table listings
export const getDateTimeInCT = (dateTime) =>
	dateTime
		? moment(dateTime).tz('America/Chicago').format('Do MMM YYYY hh:mm A')
		: dateTime;
