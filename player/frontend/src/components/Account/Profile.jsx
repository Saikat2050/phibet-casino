"use client";

import { useState, useEffect } from "react";
import CalenderIcon from "../../../public/assets/img/svg/CalenderIcon";
import Select, { components } from "react-select";
import LocationIcon from "../../../public/assets/img/svg/LocationIcon";
import Datepicker from "tailwind-datepicker-react";
import { toast } from 'react-toastify';
import {
  getProfile,
  sendOtpMobile,
  submitProfileAction,
  verifyOtpMobile,
} from "@/actions";
import { dateOptions } from "./DateOptions";
import { PrimaryButton } from "../Common/Button";
import EditIcon from "@/assets/images/profile/EditIcon";
import Link from "next/link";
import useUserStore from "@/store/useUserStore";
import SelectDownArrow from "../../../public/assets/img/svg/SelectDownArrow";
import { genderOptions, phoneOptions, titleOptions } from "@/config/data";
import Cross from "@/assets/images/Cross";
import ArrowCircleLeftWhite from "../../../public/assets/img/svg/ArrowCircleLeftWhite";
import useLocationStore from "@/store/useLocationStore";
import { useRouter } from "next/navigation";
import { profileSchema } from "@/schemas/profileSchema";
import CompletedKycModal from "../CompleteKycModal";
import useModalsStore from "@/store/useModalsStore";
import KycCompletedModal from "../KycCompletedModal";
import { useIP } from "../../utils/ipUtils";

function formatStateOptions(stateListing) {
  return stateListing
    .filter((state) => state.is_archived == false)
    .map((state) => ({
      value: state.state_id,
      label: state.name,
    }));
}

function formatStateOptions2(stateListing) {
  return stateListing.map((state) => ({
    value: state.state_id,
    label: state.name,
  }));
}

const DropdownIndicator = (props) => {
  return (
    <components.DropdownIndicator {...props}>
      <SelectDownArrow />
    </components.DropdownIndicator>
  );
};

const countryOptions = [{ value: "USA", label: "USA" }];

const TitleOption = (props) => (
  <components.Option {...props} className={"title-dropdown-option " + (props.isSelected ? "bg-white text-white" : "") + (props.isFocused ? " bg-white00 text-white" : "")}>
    <span className="mr-2">
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="8" r="4" fill="#34D399"/>
        <rect x="6" y="14" width="12" height="6" rx="3" fill="#34D399"/>
      </svg>
    </span>
    <span>{props.label}</span>
  </components.Option>
);

function Profile() {
  const { stateListing } = useLocationStore();
  const [show, setShow] = useState(false);
  const { setUser, user, userIp, setUserIp } = useUserStore();
  useIP(setUserIp);
  const [errors, setErrors] = useState({});
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const { openModal } = useModalsStore();
  const [initialFormValues, setInitialFormValues] = useState(null);
  const [userPhone, setUserPhone] = useState({
    phoneCode: phoneOptions[0].value,
    phone: "",
    phoneError: "",
    isPhoneEdit: false, // Changed default to false so it's editable if not verified
  });
  const [otp, setOtp] = useState(null);
  const [isOtpStage, setIsOtpStage] = useState(false);
  const router = useRouter();
  const [userFormValue, setUserFormValue] = useState({
    title: { value: null, label: "Title" },
    firstName: "",
    lastName: "",
    dateOfBirth: null,
    city: "",
    postalCode: "",
    state: { value: null, label: "Please select state" },
    address: "",
    gender: { value: null, label: "Please select gender" },
  });
  const [loading, setLoading] = useState(false);
  const formattedDob = new Date(user?.dateOfBirth || getDefaultDateOfBirth());
  formattedDob.setMinutes(
    formattedDob.getMinutes() + formattedDob.getTimezoneOffset()
  );

  const handleStateChange = (selectedOption) => {
    setUserFormValue((prev) => ({
      ...prev,
      state: selectedOption || { value: null, label: "Please select state" },
    }));
  };
  const handleGenderChange = (selectedOption) => {
    setUserFormValue((prev) => ({
      ...prev,
      gender: selectedOption || { value: null, label: "Please select gender" },
    }));
  };
  const handleTitleChange = (selectedOption) => {
    setUserFormValue((prev) => ({
      ...prev,
      title: selectedOption || { value: null, label: "Title" },
    }));
  };
  const handlePhoneCodeChange = (selectedOption) => {
    setUserPhone((prev) => ({
      ...prev,
      phoneCode: selectedOption?.value,
    }));
  };

  const handleDateChange = (date) => {
    setUserFormValue((prev) => ({ ...prev, dateOfBirth: date }));
  };

  const handleDateClose = (state) => {
    setShow(state);
  };

  const handleInputChange = (e) => {
    setUserFormValue({
      ...userFormValue,
      [e.target.name]: e.target.value,
    });
  };

  const getUserUpdatedProfile = async () => {
    const res = await getProfile();
    setUser(res);
  }

  const getUserProfile = async () => {
    const res = await getProfile();
    setUser(res);
    // if (res?.kycStatus === "K2") {
    //   router.push("/user/kyc");
    // }
  };

  useEffect(() => {
    getUserUpdatedProfile();
  }, []);

  function getDefaultDateOfBirth() {
    const today = new Date();

    today.setFullYear(today.getFullYear() - 18);

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  useEffect(() => {
    const formValues = {
      title: user?.title
        ? titleOptions?.find((title) => title?.value === user?.title)
        : { value: null, label: "Title" },
      gender: user?.gender
        ? genderOptions.find((gender) => gender.value === user?.gender)
        : { value: null, label: "Please select gender" },
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      dateOfBirth: formattedDob,
      city: user?.city || "",
      postalCode: user?.zipCode || "",
      state: formatStateOptions2(stateListing).find(
        (item) => user?.state == item.value
      ) || { value: null, label: "Please select state" },
      address: user?.addressLine_1 || "",
    };
    setUserFormValue(formValues);
    setInitialFormValues(formValues);

    // Set phone and isPhoneEdit based on verification status
    setUserPhone({
      phoneCode: phoneOptions[0].value,
      phone: user?.phone || "",
      phoneError: "",
      isPhoneEdit: user?.phoneVerified ? true : false, // If verified, set to true (meaning readonly)
    });
  }, [user]);

  const hasFormChanged = () => {
    if (!initialFormValues) return false;

    // Compare each field
    const fieldsToCompare = [
      'title',
      'gender',
      'firstName',
      'lastName',
      'city',
      'postalCode',
      'state',
      'address',
      'dateOfBirth'
    ];

    for (const field of fieldsToCompare) {
      if (field === 'title' || field === 'gender' || field === 'state') {
        if (userFormValue[field]?.value !== initialFormValues[field]?.value) {
          return true;
        }
      } else if (field === 'dateOfBirth') {
        // Compare dates
        const currentDate = userFormValue[field]?.toISOString();
        const initialDate = initialFormValues[field]?.toISOString();
        if (currentDate !== initialDate) {
          return true;
        }
      } else {
        if (userFormValue[field] !== initialFormValues[field]) {
          return true;
        }
      }
    }

    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    if (!isTermsAccepted) {
      toast.error("You must agree to the sweepstakes rules.");
      setLoading(false);
      return;
    }

    if (!user?.phoneVerified) {
      toast.error("Please verify your mobile number before proceeding.");
      setLoading(false);
      return;
    }

    const validation = profileSchema.safeParse(userFormValue);
    if (!validation.success) {
      setErrors(validation.error.format());
      setLoading(false);
      return;
    }

    const formattedDate = new Date(
      userFormValue.dateOfBirth
    ).toLocaleDateString("en-GB");
    const [day, month, year] = formattedDate.split("/");
    const finalFormattedDate = `${month}-${day}-${year}`;

    let payload = {
      ...userFormValue,
      dateOfBirth: finalFormattedDate,
      gender: userFormValue?.gender.value,
      title: userFormValue?.title.value,
    };
    if (userFormValue?.title.value == null) delete payload.title;

    const res = await submitProfileAction(payload, userIp);

    if (res?.data?.success) {
      toast.success("Profile updated successfully!");
      await getUserProfile();
      router.push("/");

      //       if (user?.kycStatus === "K4" || user?.kycStatus === "K5") {
      //         openModal(<KycCompletedModal close={true} />);
      //       } else if (user?.kycStatus === "K3") {
      //         router.replace("/user/kyc");
      //       }
      setLoading(false);
      return;
    }

    toast.error(res?.errors?.[0]?.description || "Something went wrong!");
    setLoading(false);
  };

  const sendOtp = async () => {
    const phoneRegex = /^[0-9]+$/;
    if (!phoneRegex.test(userPhone.phone)) {
      setUserPhone((prev) => ({
        ...prev,
        phoneError:
          "Please enter a valid phone number without spaces or special characters.",
      }));
      toast.error(
        "Please enter a valid phone number without spaces or special characters."
      );
      return;
    }

    let data = {
      phoneCode: userPhone.phoneCode,
      phone: userPhone.phone,
    };

    const res = await sendOtpMobile(data);

    if (res?.success) {
      setIsOtpStage(true);
      toast.success("Otp sent successfully!");
    } else {
      toast.error(res?.message || "Something went wrong!");
    }
  };

  const verifyOtp = async () => {
    let data = {
      code: userPhone.phoneCode || userPhone?.phoneCode?.value,
      phone: userPhone.phone,
      otp: otp,
    };

    const res = await verifyOtpMobile(data, userIp);

    if (res?.data?.success) {
      toast.success("Phone verified successfully!");
      getUserProfile();
      setUserPhone((prev) => ({
        ...prev,
        isPhoneEdit: true, // Set to true when verified (means readonly)
      }));
      setIsOtpStage(false);
    } else {
      toast.error(res?.errors?.[0]?.description || "Something went wrong!");
    }
  };

  return (
    <div className="py-[1.875rem] max-xl:py-6 px-3 md:px">
      <div className="flex items-center justify-between mb-4 md:hidden">
        <Link
          href="/user"
          className="text-xs text-white font-bold flex items-center justify-center gap-1 leading-none"
        >
          <ArrowCircleLeftWhite /> Back to Menu
        </Link>
        <span className="text-white text-sm font-bold">Profile</span>
      </div>
      <div className="max-w-[36.3125rem] m-auto">
        <div className="  border border-green-300 rounded-[0.5rem] px-[0.625rem] py-[1rem] mb-[0.625rem]">
          <div className="grid grid-cols-1 items-end max-nlg:grid-cols-1 gap-x-2.5">
            <div>
              <label
                className="block text-[1rem] font-bold leading-[1.375rem] text-white mb-[0.2rem]"
                htmlFor="firstName"
              >
                Mobile Number
              </label>
              <p
                className="text-[0.625rem] text-white text-normal mb-[0.313rem]"
              >
                {user?.phoneVerified
                  ? "Your phone is verified"
                  : isOtpStage
                    ? "Enter otp to verify your phone no."
                    : "Verify your mobile no."}
              </p>
              {isOtpStage ? (
                <div className="relative w-full flex flex-col gap-2">
                  <input
                    name="otp"
                    id="otp"
                    type="text"
                    placeholder="XXXX"

                    onChange={(e) => setOtp(e.target.value)}
                    className="  h-[2.875rem] placeholder  text-white text-sm rounded-[5px] focus:ring-2 focus:bg-[rgba(62,62,62,0.3)] focus:ring-green-100 block w-full px-4 py-3 border-none outline-none"
                  />
                  <button
                    type="button"
                    onClick={verifyOtp}
                    className="bg-white text-white px-4 py-2 rounded-[5px] h-[2.875rem] min-w-[120px] whitespace-nowrap hover:bg-white00 transition-colors duration-200 mt-2"
                  >
                    Verify OTP
                  </button>
                </div>
              ) : (
                <div className="relative w-full flex flex-col gap-2">
                  <div className="flex flex-row gap-2">
                    <div className="w-4/12">
                      <Select
                        defaultValue={phoneOptions[0]}
                        onChange={handlePhoneCodeChange}
                        options={phoneOptions}
                        placeholder="Code"
                        components={{ DropdownIndicator }}
                        className="form-select form__value__phone"
                        classNamePrefix="form"
                        isDisabled={user?.phoneVerified}
                        isSearchable={false}
                      />
                    </div>
                    <div className="flex-1 relative">
                      <input
                        name="phone"
                        id="phone"
                        type="text"
                        value={userPhone?.phone}
                        placeholder="98X XXX XX00"
                        disabled={user?.phoneVerified || userPhone?.isPhoneEdit}
                        onChange={(e) =>
                          setUserPhone((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                        className="  h-[2.875rem] placeholder  text-white text-sm rounded-[5px] focus:ring-2 focus:bg-[rgba(62,62,62,0.3)] focus:ring-green-100 block w-full px-4 py-3 border-none outline-none"
                      />
                      {!user?.phoneVerified && (
                        <Link
                          href="javascript:void(0);"
                          className="absolute top-4 right-[1.0625rem] cursor-pointer"
                          onClick={() =>
                            setUserPhone((prev) => ({
                              ...prev,
                              isPhoneEdit: !prev.isPhoneEdit,
                            }))
                          }
                        >
                          <EditIcon />
                        </Link>
                      )}
                    </div>
                  </div>
                  {!user?.phoneVerified && !isOtpStage && (
                    <button
                      type="button"
                      onClick={sendOtp}
                      className="bg-white text-white font-bold px-4 py-2 rounded-[5px] h-[2.875rem] min-w-[100px] hover:bg-white00 transition-colors duration-200 mt-2"
                    >
                      Send Verification Code
                    </button>
                  )}
                </div>
              )}
              <p className="text-[0.625rem] font-normal text-right mt-[0.313rem] mb-0">
                {user?.phoneVerified && (
                  <span className="text-white mb-0">Verified</span>
                )}
              </p>
            </div>
          </div>
        </div>
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-[0.625rem]">
            <div className="mb-2.5 ">
              <label className="text-[.8125rem] font-normal   mb-1 inline-block">
                Title
              </label>
              <div className="relative">
                <LocationIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 opacity-20" />
                <Select
                  value={userFormValue.title}
                  onChange={handleTitleChange}
                  options={titleOptions}
                  placeholder="Title"
                  className="coin-select"
                  classNamePrefix="coin"
                  components={{ DropdownIndicator, Option: TitleOption }}
                  isSearchable={false}
                  isDisabled={!!user?.title}
                  styles={{
                    option: (provided) => ({
                      ...provided,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                    }),
                  }}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm">
                    {errors.title._errors[0]}
                  </p>
                )}
              </div>
            </div>

            <div className="mb-2.5">
              <label
                className="text-[.8125rem] font-normal   mb-1 inline-block"
                htmlFor="firstName"
              >
                First Name
              </label>
              <input
                name="firstName"
                id="firstName"
                type="text"
                placeholder="First Name"
                value={userFormValue?.firstName}
                disabled={!!user?.firstName}
                onChange={handleInputChange}
                className="  h-[2.875rem] placeholder  text-white text-sm rounded-[5px] focus:ring-2 focus:bg-[rgba(62,62,62,0.3)] focus:ring-green-100 block w-full px-4 py-3 border-none outline-none"
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs">
                  {errors.firstName._errors[0]}
                </p>
              )}
            </div>
            <div className="mb-2.5 col-span-2 md:col-span-1">
              <label
                className="text-[.8125rem] font-normal   mb-1 inline-block"
                htmlFor="lastName"
              >
                Last Name
              </label>
              <input
                name="lastName"
                id="lastName"
                type="text"
                value={userFormValue?.lastName}
                disabled={!!user?.lastName}
                onChange={handleInputChange}
                placeholder="Last Name"
                className="  h-[2.875rem] placeholder  text-white text-sm rounded-[5px] focus:ring-2 focus:bg-[rgba(62,62,62,0.3)] focus:ring-green-100 block w-full px-4 py-3 border-none outline-none"
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm">
                  {errors.lastName._errors[0]}
                </p>
              )}
            </div>
          </div>
          <div className="block md:grid md:grid-cols-2 gap-x-[0.625rem]">
            <div className="mb-2.5">
              <label className="text-[.8125rem] font-normal   mb-1 inline-block">
                Date of birth
              </label>
              <div className="relative text-white">
                <CalenderIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 opacity-20" />
                <Datepicker
                  options={dateOptions}
                  onChange={handleDateChange}
                  show={show}
                  value={userFormValue.dateOfBirth}
                  setShow={handleDateClose}
                  classNames="custom-datepicker"
                >
                  <input
                    type="text"
                    className="  pl-12 h-[2.875rem] placeholder  text-white text-sm rounded-[5px] focus:ring-2 focus:bg-[rgba(62,62,62,0.3)] focus:ring-green-100 block w-full px-4 py-3 border-none outline-none"
                    placeholder="Select Date"
                    value={
                      userFormValue.dateOfBirth
                        ? userFormValue.dateOfBirth.toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                        : ""
                    }
                    onFocus={() => !user?.dateOfBirth && setShow(true)} // Only open datepicker if dateOfBirth is not set
                    readOnly={!!user?.dateOfBirth} // Make input read-only if dateOfBirth exists
                  />
                </Datepicker>
              </div>
              {errors.dateOfBirth && (
                <p className="text-red-500 text-sm">{errors.dateOfBirth._errors[0]}</p>
              )}
            </div>
            <div className="mb-2.5">
              <label className="text-[.8125rem] font-normal   mb-1 inline-block">
                Gender
              </label>
              <div className="relative">
                <LocationIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 opacity-20" />
                <Select
                  value={userFormValue.gender}
                  onChange={handleGenderChange}
                  options={genderOptions}
                  placeholder="Please select gender"
                  className="coin-select"
                  classNamePrefix="coin"
                  components={{ DropdownIndicator }}
                  isSearchable={false}
                  isDisabled={!!user?.gender}
                />
                {errors.gender && (
                  <p className="text-red-500 text-sm">
                    {errors.gender._errors[0]}
                  </p>
                )}
              </div>
            </div>
            <div className="col-span-2 mb-2.5">
              <label
                className="text-[.8125rem] font-normal   mb-1 inline-block"
                htmlFor="address"
              >
                Street Address
              </label>
              <input
                name="address"
                id="address"
                type="text"
                value={userFormValue?.address}
                onChange={handleInputChange}
                placeholder="Address"
                className="  h-[2.875rem] placeholder  text-white text-sm rounded-[5px] focus:ring-2 focus:bg-[rgba(62,62,62,0.3)] focus:ring-green-100 block w-full px-4 py-3 border-none outline-none"
                disabled={!!user?.addressLine_1}
              />
              {errors.address && (
                <p className="text-red-500 text-sm">
                  {errors.address._errors[0]}
                </p>
              )}
            </div>
            <div className="mb-2.5">
              <label className="text-[.8125rem] font-normal   mb-1 inline-block">
                Country
              </label>
              <div className="relative">
                <LocationIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 opacity-20" />
                <Select
                  defaultValue={countryOptions[0]}
                  options={countryOptions}
                  placeholder="Please select state"
                  className="coin-select"
                  classNamePrefix="coin"
                  components={{ DropdownIndicator: () => null }}
                  isSearchable={false}
                  isDisabled
                />
              </div>
            </div>
            <div className="mb-2.5">
              <label className="text-[.8125rem] font-normal   mb-1 inline-block">
                State
              </label>
              <div className="relative">
                <LocationIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 opacity-20" />
                <Select
                  value={userFormValue.state}
                  onChange={handleStateChange}
                  options={formatStateOptions(stateListing)}
                  placeholder="Please select state"
                  components={{ DropdownIndicator }}
                  className="coin-select"
                  classNamePrefix="coin"
                  isSearchable={false}
                  isDisabled={!!user?.state}
                />
                {errors.state && (
                  <p className="text-red-500 text-sm">
                    {errors.state._errors[0]}
                  </p>
                )}
              </div>
            </div>
            <div className="mb-2.5">
              <label
                className="text-[.8125rem] font-normal   mb-1 inline-block"
                htmlFor="city"
              >
                City
              </label>
              <input
                name="city"
                id="city"
                type="text"
                value={userFormValue?.city}
                onChange={handleInputChange}
                placeholder="City"
                className="  h-11 placeholder  text-white text-sm rounded-[5px] focus:ring-2 focus:bg-[rgba(62,62,62,0.3)] focus:ring-green-100 block w-full px-4 py-3 border-none outline-none"
                disabled={!!user?.city}
              />
              {errors.city && (
                <p className="text-red-500 text-sm">{errors.city._errors[0]}</p>
              )}
            </div>
            <div>
              <label
                className="block text-sm font-medium text-white mb-1 inline-block"
                htmlFor="postalCode"
              >
                ZIP Code
              </label>
              <input
                name="postalCode"
                id="postalCode"
                type="text"
                value={userFormValue?.postalCode}
                onChange={handleInputChange}
                placeholder="Postal Code"
                className="  h-11 placeholder  text-white text-sm rounded-[5px] focus:ring-2 focus:bg-[rgba(62,62,62,0.3)] focus:ring-green-100 block w-full px-4 py-3 border-none outline-none"
                disabled={!!user?.zipCode}
              />
              {errors.postalCode && (
                <p className="text-red-500 text-sm">
                  {errors.postalCode._errors[0]}
                </p>
              )}
            </div>
          </div>
          <div className="mt-[25px]">
            <div className="flex items-start gap-2 pt-2.5 pb-1 mt-4">
              <input
                checked={isTermsAccepted}
                onChange={() => setIsTermsAccepted(!isTermsAccepted)}
                type="checkbox"
                className="form-checkbox h-5 min-h-5 w-5 min-w-5 p-0
               checked:bg-checkIcon checked:bg-contain checked:drop-shadow-checkboxShadow
               rounded appearance-none border-2 border-solid border-white bg-transparent cursor-pointer
               transition-all duration-300 ease-in-out transform
               checked:scale-110 checked:shadow-lg checked:border-green-400"
              />
              <p className="text-sm  ">
                I accept and agree to bound by the{" "}
                <Link href="/VCSR1.0.pdf" className="text-white underline">
                  Sweepstakes Rules.
                </Link>{" "}
              </p>
            </div>
            <PrimaryButton
              type="submit"
              className={`h-[44px] min-w-[11.3125rem] ${(loading || !hasFormChanged()) ? "hover:cursor-not-allowed opacity-50" : "hover:cursor-pointer"
                }`}
              disabled={loading || !hasFormChanged()}
            >
              {loading ? "Loading..." : "Save Profile"}
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile;