/* eslint-disable react/jsx-no-useless-fragment */
import React from 'react';
import { Badge } from 'reactstrap';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import 'react-image-lightbox/style.css';
import DivLoader from '../../components/Common/Loader/divLoader';
import { CustomToggleButton } from '../../helpers/customForms';
import ImageCell from '../../components/Common/ImageCell';
import { selectedLanguage } from '../../constants/config';

const CasinoGameId = ({ value }) => (
	<Link to="/#" className="text-body fw-bold">
		{value ?? ''}
	</Link>
);
const Name = ({ value }) => value?.[selectedLanguage] ?? '';

const Custom = ({ value }) => value ?? '';

const Provider = ({ value }) => value ?? '';

const Rtp = ({ value }) => value ?? '';

const Category = ({ value }) => value ?? '';

const ThumbnailUrl = ({ value }) => <ImageCell imgSrc={value} />;

const DeviceType = ({ value }) => value ?? '';

const KeyValueCell = ({ cell }) => (cell.value ? cell.value : '-');

const Status = ({ value }) =>
	value ?? '' ? (
		<Badge className="bg-success">Active</Badge>
	) : (
		<Badge className="bg-danger">In Active</Badge>
	);

CasinoGameId.propTypes = {
	value: PropTypes.number.isRequired,
};

ThumbnailUrl.propTypes = {
	value: PropTypes.string.isRequired,
};

Status.propTypes = {
	value: PropTypes.bool.isRequired,
};

const IsFeatured = ({ cellProps, toggleIsFeaturedGames }) => {
	const { isFeaturedLoading, featuredGameData } = useSelector(
		(state) => state.CasinoManagementData
	);
	return (
		<>
			{isFeaturedLoading &&
			Number(featuredGameData?.casinoGameId) ===
				Number(cellProps?.row?.original.casinoGameId) ? (
				<DivLoader isWithoutPadding />
			) : (
				<div className="form-check-success d-flex justify-content-center">
					<CustomToggleButton
						containerClass="false"
						type="checkbox"
						className="form-check-input"
						checked={cellProps?.value?.toString() === 'true'}
						switchSizeClass="form-switch-sm"
						onClick={(e) => toggleIsFeaturedGames(e, cellProps)}
					/>
				</div>
			)}
		</>
	);
};
IsFeatured.propTypes = {
	cellProps: PropTypes.oneOfType([PropTypes.object]),
	toggleIsFeaturedGames: PropTypes.func,
};

IsFeatured.defaultProps = {
	cellProps: PropTypes.oneOfType([PropTypes.object]),
	toggleIsFeaturedGames: PropTypes.func,
};

const LandingPage = ({ cellProps, toggleLandingPageGames }) => {
	const { landingPageLoading, landingGameData } = useSelector(
		(state) => state.CasinoManagementData
	);
	return (
		<>
			{landingPageLoading &&
			Number(landingGameData?.casinoGameId) ===
				Number(cellProps?.row?.original.casinoGameId) ? (
				<DivLoader isWithoutPadding />
			) : (
				<div className="form-check-success d-flex justify-content-center">
					<CustomToggleButton
						containerClass="false"
						type="checkbox"
						className="form-check-input"
						checked={cellProps?.value?.toString() === 'true'}
						switchSizeClass="form-switch-sm"
						onClick={(e) => toggleLandingPageGames(e, cellProps)}
					/>
				</div>
			)}
		</>
	);
};
LandingPage.propTypes = {
	cellProps: PropTypes.oneOfType([PropTypes.object]),
	toggleLandingPageGames: PropTypes.func,
};

LandingPage.defaultProps = {
	cellProps: PropTypes.oneOfType([PropTypes.object]),
	toggleLandingPageGames: PropTypes.func,
};

export {
	CasinoGameId,
	Name,
	Provider,
	Rtp,
	Category,
	ThumbnailUrl,
	DeviceType,
	Status,
	IsFeatured,
	LandingPage,
	Custom,
	KeyValueCell,
};
