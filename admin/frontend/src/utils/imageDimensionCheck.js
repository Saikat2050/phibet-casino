/* eslint-disable func-names */
/* eslint-disable import/prefer-default-export */
import * as Yup from 'yup';

const imageWidthAndHeight = (provideFile) => {
	// take the given file (which should be an image) and return the width and height
	const imgDimensions = { width: null, height: null };

	return new Promise((resolve) => {
		const reader = new FileReader();

		reader.readAsDataURL(provideFile);
		reader.onload = function () {
			const img = new Image();
			img.src = reader.result;

			img.onload = function () {
				imgDimensions.width = img.width;
				imgDimensions.height = img.height;

				resolve(imgDimensions);
			};
		};
	});
};

const imageDimensionCheck = Yup.addMethod(
	Yup.mixed,
	'imageDimensionCheck',
	function (message, imageDimensions) {
		return this.test(
			'image-width-height-check',
			message,
			async function (value) {
				const { path, createError } = this;

				if (!value) {
					return true;
				}

				if (typeof value === 'string') {
					return true;
				}

				const {
					minRequiredWidth,
					minRequiredHeight,
					maxRequiredWidth,
					maxRequiredHeight,
					exactWidth,
					exactHeight,
				} = imageDimensions || {};

				const imgDimensions = await imageWidthAndHeight(value);
				if (exactWidth && exactHeight) {
					if (
						imgDimensions.width !== exactWidth ||
						imgDimensions.height !== exactHeight
					) {
						return createError({
							path,
							message: `The image dimensions must be exactly ${exactWidth}px by ${exactHeight}px!`,
						});
					}
				} else {
					if (
						imgDimensions.width < minRequiredWidth ||
						imgDimensions.width > maxRequiredWidth
					) {
						return createError({
							path,
							message: `The image width needs to be between ${minRequiredWidth}px - ${maxRequiredWidth}px!`,
						});
					}

					if (
						imgDimensions.height < minRequiredHeight ||
						imgDimensions.height > maxRequiredHeight
					) {
						return createError({
							path,
							message: `The image height needs to be between ${minRequiredHeight}px - ${maxRequiredHeight}px!`,
						});
					}
				}
				return true;
			}
		);
	}
);

export default imageDimensionCheck;
