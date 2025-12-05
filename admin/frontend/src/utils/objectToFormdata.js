/* eslint-disable no-restricted-syntax */
/* eslint-disable no-prototype-builtins */

export const objectToFormDataAdd = (obj) => {
	const formData = new FormData();

	Object.entries(obj).forEach(([key, value]) => {
		formData.append(key, value);
	});

	return formData;
};

export const objectToFormData = (obj, form, namespace) => {
	const fd = form || new FormData();
	let formKey;

	for (const property in obj) {
		if (obj.hasOwnProperty(property)) {
			if (namespace) {
				formKey = `${namespace}[${property}]`;
			} else {
				formKey = property;
			}

			// if the property is an object, but not a File,
			// use recursivity.
			if (
				typeof obj[property] === 'object' &&
				!(obj[property] instanceof File)
			) {
				if (obj[property] instanceof Date) {
					// If it's a Date object, append its value as a string
					fd.append(formKey, obj[property].toISOString());
				} else {
					// Otherwise, continue recursion
					objectToFormData(obj[property], fd, property);
				}
			} else {
				// if it's a string or a File object
				fd.append(formKey, obj[property]);
			}
		}
	}
	return fd;
};
