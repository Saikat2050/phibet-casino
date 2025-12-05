/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Button, Container, Row } from 'reactstrap';
import Dropzone from 'react-dropzone';
import PropTypes from 'prop-types';

const ImageUploader = ({
	validateImage,
	handleSubmit,
	error,
	uploadedFile,
	isUploading,
	handleClear,
}) => (
	<Container className="px-4">
		<Row className="justify-content-center">
			<Dropzone onDrop={validateImage} accept="image/*">
				{({ getRootProps, getInputProps }) => (
					<div
						{...getRootProps()}
						className="dropzone"
						style={{
							border: '2px dashed #ccc',
							padding: '20px',
							textAlign: 'center',
						}}
					>
						{!(uploadedFile && !error) && (
							<>
								<input {...getInputProps()} />
								<div className="mb-3">
									<i className="display-4 text-muted bx bxs-cloud-upload" />
								</div>
								<h4>Drag & drop an image here, or click to select one.</h4>
								{error && <p className="text-danger">{error}</p>}
							</>
						)}
						<Row className="justify-content-center mt-4">
							{uploadedFile && !error && (
								<div className="text-center">
									<img
										src={URL.createObjectURL(uploadedFile)}
										className="img-thumbnail uploaded-image"
										alt="thumbnail"
									/>
								</div>
							)}
						</Row>
					</div>
				)}
			</Dropzone>
			<div className="d-flex justify-content-between mt-4">
				<Button
					color="danger"
					disabled={!uploadedFile || isUploading || error}
					onClick={handleClear}
					hidden={!uploadedFile}
				>
					Reset
				</Button>
				<Button
					color="primary"
					disabled={!uploadedFile || isUploading || error}
					onClick={handleSubmit}
					hidden={!uploadedFile}
				>
					{isUploading && (
						<i className="bx bx-hourglass bx-spin font-size-16 align-middle me-2" />
					)}
					Submit
				</Button>
			</div>
		</Row>
	</Container>
);

export default ImageUploader;

ImageUploader.defaultProps = {
	uploadedFile: null,
	isUploading: false,
};

ImageUploader.propTypes = {
	validateImage: PropTypes.func.isRequired,
	handleSubmit: PropTypes.func.isRequired,
	error: PropTypes.string.isRequired,
	uploadedFile: PropTypes.objectOf(PropTypes.func),
	isUploading: PropTypes.bool,
	handleClear: PropTypes.func.isRequired,
};
