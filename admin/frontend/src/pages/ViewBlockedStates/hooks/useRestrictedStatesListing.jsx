/* eslint-disable react/prop-types */
import React, { useMemo } from 'react';
import { KeyValueCell } from '../RestrictedStatesListCol';

const useRestrictedStatesListing = () => {
	const columns = useMemo(() => [
		{
			Header: 'ID',
			accessor: 'id',
			notHidable: true,
			filterable: true,
			Cell: ({ cell }) => <KeyValueCell value={cell.value} />,
		},
		{
			Header: 'NAME',
			accessor: 'name',
			filterable: true,
			Cell: ({ cell }) => <KeyValueCell value={cell.value} />,
		},
		{
			Header: 'CODE',
			accessor: 'code',
			filterable: true,
			Cell: ({ cell }) => <KeyValueCell value={cell.value} />,
		},
	]);

	return {
		columns,
	};
};

export default useRestrictedStatesListing;
