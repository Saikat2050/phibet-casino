"use client";
/* 
import React, { useState } from 'react';
import Select from 'react-select';


function CategorySelect({
    className = '',
    providers
}) {
  const [selectedOption, setSelectedOption] = useState(null);

  return (
    <div className={`${className}`}>
      <Select
        defaultValue={selectedOption}
        onChange={setSelectedOption}
        options={providers}
        placeholder='by providers'
        className='category-select'
        classNamePrefix='category'
      />
    </div>
  );
}

export default CategorySelect; */

import Select from "react-select";
import useSubCategoryStore from "@/store/useSubCategoryStore";
import { useEffect } from "react";

function CategorySelect({ className = "", providers }) {
  const {
    selectedProviderName,
    setSelectedProvider,
    fetchGames,
    searchTerm,
    clearSearchedGames,
    setSearchTerm,
    setSelectedSubcategoryGames,
    setSelectedProviderName,
    selectedProviderId,
  } = useSubCategoryStore();
  const handleChange = (selectedOption) => {
    setSelectedProvider(selectedOption ? selectedOption.value : null);
    setSelectedProviderName(selectedOption ? selectedOption.label : "");
    if (selectedOption.value == null && !searchTerm) {
      clearSearchedGames();
      setSearchTerm("");
      setSelectedSubcategoryGames([]);
      setSelectedProvider(null);
      setSelectedProviderName("");
    } else {
      fetchGames();
    }
  };

  useEffect(() => {
    if (!selectedProviderName) {
      setSelectedSubcategoryGames([]);
    }
  }, [selectedProviderName]);

  const options = providers.map((provider) => ({
    value: provider.id,
    label: provider.name,
  }));

  const customStyles = {
    menu: (provided) => ({
      ...provided,
      zIndex: 999,
    }),
  };
  const defaultOption = { value: null, label: "All" };

  // Set the current value based on the selected provider
  const getCurrentValue = () => {
    if (!selectedProviderId) {
      return defaultOption;
    }
    return (
      providers.find((option) => option.value === selectedProviderId) ||
      defaultOption
    );
  };

  return (
    <div className={`${className}`}>
      <Select
        value={getCurrentValue()}
        onChange={handleChange}
        options={providers}
        placeholder="by providers"
        className="category-select"
        // className="provider-select"
        classNamePrefix="category"
        //  classNamePrefix="form"
        // styles={{
        //   control: (provided, state) => ({
        //     ...provided,
        //     color: "#FFFFFF",
        //   }),
        //   menu: (provided) => ({
        //     ...provided,
        //     zIndex: 9999,
        //   }),
        //   input: (provided) => ({
        //     ...provided,
        //     color: "#FFFFFF", // Set search text color to white
        //   }),
        //   singleValue: (provided) => ({
        //     ...provided,
        //     color: "#FFFFFF", // Set selected option text color to white
        //   }),
        //   placeholder: (provided) => ({
        //     ...provided,
        //     color: "#FFFFFF", // Set placeholder text color to white
        //   }),
        // }}
      />
    </div>
  );
}

export default CategorySelect;
