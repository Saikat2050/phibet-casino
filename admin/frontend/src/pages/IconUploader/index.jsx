import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import {
	uploadImageStart,
	uploadSportsCountryImageStart,
} from '../../store/sportsBook/actions';
import { showToastr } from '../../utils/helpers';
import ImageUploader from '../../components/Common/ImageUploader';

const IconUploader = ({ sportId, locationId, isUploading }) => {
	const dispatch = useDispatch();
	const [uploadedFile, setUploadedFile] = useState(null);
	const [error, setError] = useState('');

	const validateImageSize = (acceptedFiles) => {
		const file = acceptedFiles[0];
		const image = new Image();

		image.onload = () => {
			if (image.width === 30 && image.height === 30) {
				setUploadedFile(file);
				setError('');
			} else {
				setError('File size must be 30x30 pixels.');
			}
		};

		image.src = URL.createObjectURL(file);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (uploadedFile) {
			const fd = new FormData();
			fd.append('file', uploadedFile);
			if (sportId) {
				fd.append('id', sportId);
				dispatch(uploadImageStart(fd));
			}
			if (locationId) {
				fd.append('id', locationId);
				dispatch(uploadSportsCountryImageStart(fd));
			}
		} else {
			showToastr({
				type: 'error',
				message: 'Please upload an image.',
			});
		}
	};

	return (
		<ImageUploader
			validateImage={validateImageSize}
			handleSubmit={handleSubmit}
			error={error}
			uploadedFile={uploadedFile}
			isUploading={isUploading}
			handleClear={() => setUploadedFile(null)}
		/>
	);
};

IconUploader.defaultProps = {
	sportId: null,
	locationId: null,
	isUploading: false,
};

IconUploader.propTypes = {
	sportId: PropTypes.string,
	locationId: PropTypes.string,
	isUploading: PropTypes.bool,
};

export default IconUploader;
