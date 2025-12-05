import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { sideBarElements } from '../../constants/sidebar';

const NavigationSearch = () => {
	const [navigationSearch, setNavigationSearch] = useState();
	const navigate = useNavigate();
	const [searchRes, setSearchRes] = useState([]);
	const handleChange = (e) => {
		e.preventDefault();
		const str = e.target.value;
		const result = [];
		sideBarElements.forEach((nav) => {
			if (nav.searchString.includes(str)) {
				result.push({
					label: nav.label,
					link: nav.link,
					icon: nav.iconName,
				});
			}
			nav.subMenu?.forEach((sub) => {
				if (sub.searchString.includes(str)) {
					result.push({
						label: sub.label,
						link: sub.link,
						icon: sub.iconName,
					});
				}
			});
		});
		setNavigationSearch(str);
		setSearchRes(result);
	};
	return (
		<div className="app-search d-none d-lg-block">
			<div className="position-relative">
				<div className="col-md-10">
					<input
						className="form-control"
						list="datalistOptions"
						id="navigationSearch"
						placeholder="Search..."
						type="search"
						value={navigationSearch}
						onChange={handleChange}
					/>
					<datalist id="datalistOptions">
						{searchRes.map((res) => (
							<option onClick={() => navigate(res.link)}>
								<Link to={res.link}>{res.label}</Link>
							</option>
						))}
					</datalist>
				</div>
				<span className="bx bx-search-alt" />
			</div>
		</div>
	);
};

export default NavigationSearch;
