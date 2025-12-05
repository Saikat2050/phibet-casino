"use client";

import React from "react";
import Select, { components } from "react-select";
import { PrimaryButton } from "./Common/Button";
import { useState } from "react";
import SelectDownArrow from "../../public/assets/img/svg/SelectDownArrow";
// import { isLoggedIn } from '@/utils/helper';
import { sendUserFeedback } from "@/actions";
import { toast } from 'react-toastify';
import Login from "./Auth/Login";
import useModalsStore from "@/store/useModalsStore";
import useUserStore from "@/store/useUserStore";
import {  getCookie } from "@/utils/clientCookieUtils";
// Custom DropdownIndicator component
const DropdownIndicator = (props) => {
  return (
    <components.DropdownIndicator {...props}>
      <SelectDownArrow />
    </components.DropdownIndicator>
  );
};

const options = [
  { value: "Feedback", label: "Feedback" },
  { value: "Bug-Report", label: "Bug Report" },
];

const Contact = () => {
  const { isLoggedIn,user } = useUserStore();
  const [selectedOption, setSelectedOption] = useState(null);
  const [body, setBody] = useState("");
  const { openModal } = useModalsStore();
  const [errors, setErrors] = useState({ title: "", body: "" });

  const validateForm = () => {
    let formErrors = { title: "", body: "" };
    let isValid = true;

    // Validate title (select field)
    if (!selectedOption) {
      formErrors.title = "Please select a feedback subject.";
      isValid = false;
    }

    // Validate body (textarea field)
    if (body.length < 30) {
      formErrors.body = "The message must be at least 30 characters long.";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userToken) {
      openModal(<Login />);
    } else if (validateForm()) {
      const formData = {
        title: selectedOption.value,
        body,
      };

      const res = await sendUserFeedback(formData);

      if (res?.data?.success) {
        setSelectedOption(null);
        setBody("");
        setErrors({ title: "", body: "" });
        toast.success("Your message is recorded successfully!");
      } else {
        toast.error("Something went wrong.");
      }
    }
  };
  const userToken = getCookie("accessToken");
  return (
    <div className="bg-primary-100 rounded-2xl p-5 max-w-[19.5625rem] w-full ml-auto">
      <div>
        <h3 className="text-20 font-semibold text-white">
        Join Our Newsletter
        </h3>
      </div>
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-2">
          <input type="text" placeholder="Your Name" className="h-9 rounded-lg px-3 py-1 bg-primary-300 w-full text-14 text-white placeholder:text-tertiary-300 focus:outline-none" />
        </div>
        <div className="mb-2" >
          <input type="email" placeholder="Email Address" className="h-9 rounded-lg px-3 py-1 bg-primary-300 w-full text-14 text-white placeholder:text-tertiary-300 focus:outline-none" />
        </div>
        {/* <div className="pb-2.5">
          <Select
            value={selectedOption}
            placeholder="Select a feedback subject"
            onChange={setSelectedOption}
            components={{ DropdownIndicator }}
            options={options}
            className="faq-select"
            classNamePrefix="faq-inner"
            isSearchable={false}
          />
          {errors.title && (
            <p className="text-red-500 text-xs">{errors.title}</p>
          )}
        </div>
        <div className="mb-4">
          <textarea
            className="  placeholder  text-white text-sm rounded-md focus:ring-2 focus:bg-[rgba(62,62,62,0.3)] focus:ring-green-100 block w-full p-3.5 border-none outline-none placeholder:font-bold"
            rows="4"
            placeholder="Enter the text (min 30 characters)"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          ></textarea>
          {errors.body && <p className="text-red-500 text-xs">{errors.body}</p>}
        </div> */}
        <PrimaryButton className="w-full !rounded-md shadow-none" type="submit">
        Join Our Community
        </PrimaryButton>
      </form>
    </div>
  );
};

export default Contact;
