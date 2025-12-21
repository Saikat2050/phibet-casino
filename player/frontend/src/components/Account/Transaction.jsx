"use client";

import { useEffect, useState } from "react";
import TablePagination from "../Pagination/Index";
import Select, { components } from "react-select";
import Datepicker from "tailwind-datepicker-react";
import { dateOptions } from "./DateOptions";
import { cancelRedemptionRequestAction, getTransactionData } from "@/actions";
import SelectDownArrow from "../../../public/assets/img/svg/SelectDownArrow";
import Link from "next/link";
import ArrowCircleLeftWhite from "../../../public/assets/img/svg/ArrowCircleLeftWhite";
import TransactionRecordsListing from "./TransactionRecordsListing";
import { toast } from 'react-toastify';
// Custom DropdownIndicator component
const DropdownIndicator = (props) => {
  return (
    <components.DropdownIndicator {...props}>
      <SelectDownArrow />
    </components.DropdownIndicator>
  );
};

const options = [
  { value: "all", label: "All" },
  // { value: "gcCoin", label: "USD Coin" },
  // { value: "scCoin", label: "USD Coin" },
  // { value: "admin", label: "Admin Bonus" },
  { value: "bonus", label: "Awarded Gifts" },
  { value: "deposit", label: "Purchase" },
  { value: "redeem", label: "Redeem" },
];

function Transaction() {
  const currentDate = new Date();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );

  const [dateError, setDateError] = useState("");
  const [showStartDate, setShowStartDate] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);
  const [startDate, setStartDate] = useState(firstDayOfMonth);
  const [endDate, setEndDate] = useState(currentDate);
  const [actionType, setActionType] = useState(options[0]);
  const [transactionData, setTransactionData] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 6;
  const [cancelLoading, setCancelLoading] = useState(false);

  function formatDateToISOWithoutTZ(date) {
    const year = date?.getFullYear();
    const month = String(date?.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(date?.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  let params = {
    startDate: formatDateToISOWithoutTZ(startDate),
    endDate: formatDateToISOWithoutTZ(endDate),
    page: page,
    limit: limit,
    actionType: actionType?.value,
    // actionType?.value === "gcCoin"
    //   ? "all"
    //   : actionType?.value === "scCoin"
    //   ? "all"
    //   : actionType?.value,
    coinType: "all",
    // actionType?.value === "gcCoin"
    //   ? "USD"
    //   : actionType?.value === "scCoin"
    //   ? "USD"
    //   : "all",
  };
  const fetchTransactionData = async (params) => {
    try {
      const response = await getTransactionData(params);

      const transData = response?.data?.data;
      // Reset transaction data to prevent old records from persisting
      setTransactionData([]);
      setTransactionData(transData?.rows || []);
      setCount(transData?.count || 0);
    } catch (error) {
      console.error("***********Error fetching transaction data:", error);
    }
  };

  useEffect(() => {
    if (startDate && endDate && !dateError) {
      function formatDateToISOWithoutTZ(date) {
        const year = date?.getFullYear();
        const month = String(date?.getMonth() + 1).padStart(2, "0"); // Months are 0-based
        const day = String(date?.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      }

      params = {
        startDate: formatDateToISOWithoutTZ(startDate),
        endDate: formatDateToISOWithoutTZ(endDate),
        page: page,
        limit: limit,
        actionType: actionType?.value,
        // actionType?.value === "gcCoin"
        //   ? "all"
        //   : actionType?.value === "scCoin"
        //   ? "all"
        //   : actionType?.value,
        coinType: "all",
        // actionType?.value === "gcCoin"
        //   ? "USD"
        //   : actionType?.value === "scCoin"
        //   ? "USD"
        //   : "all",
      };
      fetchTransactionData(params);
    }
  }, [startDate, endDate, actionType, page]);

  useEffect(() => {
    setPage(1);
  }, [startDate, endDate, actionType]);

  const handleStartDateChange = (date) => {
    setStartDate(date);

    if (date && endDate && date > endDate) {
      setDateError("End date must be after start date.");
      // setEndDate(null);
    } else {
      setDateError("");
    }
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);

    if (startDate && date < startDate) {
      setDateError("End date must be after start date.");
    } else {
      setDateError("");
    }
  };

  const handleDateClose = (state, type) => {
    if (type === "start") {
      setShowStartDate(state);
    } else if (type === "end") {
      setShowEndDate(state);
    }
  };

  const getDateOptions = (type, placeholder) => {
    return {
      ...dateOptions,
      minDate:
        type === "end" ? startDate || dateOptions.minDate : dateOptions.minDate,
      disabledDates:
        type === "end" && startDate
          ? [new Date(startDate.getTime() - 86400000)]
          : [],
      inputPlaceholderProp: placeholder,
      defaultDate: type === "end" ? endDate : startDate,
    };
  };

  const handlePageChange = (page) => {
    setPage(page);
  };

  const handleCancelRequest = async (item) => {
    setCancelLoading(true);
    try {
      const response = await cancelRedemptionRequestAction({
        transactionId: item.transactionid,
      });
      if (response.success) {
        toast.success("Request canceled successfully.");
        fetchTransactionData(params); // Refresh data after cancelation
      } else {
        toast.error(response.message || "Failed to cancel request.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while canceling the request.");
    }
    setCancelLoading(false);
  };
  const totalPages = Math.ceil(count / limit);
  const showPagination = transactionData?.length > 0 && totalPages > 1;
  return (
    <div className="py-[30px] px-3 nlg:px-[50px] max-xl:py-6">
      <div className="flex items-center justify-between mb-4 md:hidden">
        <Link
          href="/user"
          className="text-xs text-white font-bold flex items-center justify-center gap-1 leading-none"
        >
          <ArrowCircleLeftWhite /> Back to Menu
        </Link>
        <span className="text-white text-sm font-bold capitalize">
          Transaction
        </span>
      </div>
      <div className="flex flex-col md:flex-row gap-2.5">
        <div className="w-full flex-1">
          <div className="relative">
            <Datepicker
              options={getDateOptions("start", "Start date")}
              onChange={handleStartDateChange}
              show={showStartDate}
              setShow={(state) => handleDateClose(state, "start")}
              classNames="custom-datepicker"
            />
          </div>
        </div>
        <div className="w-full flex-1">
          <div className="relative">
            <Datepicker
              options={getDateOptions("end", "End date")}
              onChange={handleEndDateChange}
              show={showEndDate}
              setShow={(state) => handleDateClose(state, "end")}
              classNames="custom-datepicker"
              disabled={!startDate}
            />
          </div>
          {dateError && (
            <p className="text-red-500 mt-2 text-[12px]">{dateError}</p>
          )}
        </div>
        <div className="w-full flex-1">
          <div className="relative">
            <Select
              value={actionType}
              onChange={setActionType}
              options={options}
              placeholder="Select Coin"
              components={{ DropdownIndicator }}
              className="coin-select"
              classNamePrefix="coin"
              isSearchable={false}
            />
          </div>
        </div>
      </div>
      <div className="mt-2.5">
        <div className="overflow-x-auto overflow-y-hidden">
          <table className="min-w-full bg-transparent">
            <thead>
              <tr className=" -600 [&>th:first-child]:rounded-bl-[6px] [&>th:first-child]:rounded-tl-[6px] [&>th:last-child]:rounded-br-[6px] [&>th:last-child]:rounded-tr-[6px]">
                <th className="whitespace-nowrap px-[10px] py-[9px] font-normal text-[13px] capitalize   text-start">
                  Transaction ID
                </th>
                <th className="whitespace-nowrap px-[10px] py-[9px] font-normal text-[13px] capitalize   text-start">
                  Date & Time
                </th>
                <th className="whitespace-nowrap px-[10px] py-[9px] font-normal text-[13px] capitalize   text-start">
                 USD
                </th>
                {/* <th className="whitespace-nowrap px-[10px] py-[9px] font-normal text-[13px] capitalize   text-start">
                  Sweep Coin
                </th> */}
                {/* {actionType.value == "deposit" && ( */}
                <th className="whitespace-nowrap px-[10px] py-[9px] font-normal text-[13px] capitalize   text-start">
                  Amount
                </th>
                {/* )} */}
                <th className="whitespace-nowrap px-[10px] py-[9px] font-normal text-[13px] capitalize   text-start">
                  Status
                </th>
                <th className="whitespace-nowrap px-[10px] py-[9px] font-normal text-[13px] capitalize   text-start">
                  Type
                </th>
                <th className="whitespace-nowrap px-[10px] py-[9px] font-normal text-[13px] capitalize   text-start">
                  Method
                </th>
                <th className="whitespace-nowrap px-[10px] py-[9px] font-normal text-[13px] capitalize   text-start">
                  Action
                </th>
              </tr>
              {/* <tr>
                <td Name="whitespace-nowrap px-[10px] py-3   text-[13px] border-b-[1px] border-whiteOpacity-500">1218</td>
                <td className="whitespace-nowrap px-[10px] py-3   text-[13px] border-b-[1px] border-whiteOpacity-500">Dec 30, 2019 07:52</td>
                <td className="whitespace-nowrap px-[10px] py-3   text-[13px] border-b-[1px] border-whiteOpacity-500">Gold 1</td>
                <td className="whitespace-nowrap px-[10px] py-3   text-[13px] border-b-[1px] border-whiteOpacity-500">Sweep</td>
                <td className="whitespace-nowrap px-[10px] py-3   text-[13px] font-bold border-b-[1px] border-whiteOpacity-500">Win</td>
                <td className="whitespace-nowrap px-[10px] py-3   text-[13px] border-b-[1px] border-whiteOpacity-500">Type 1</td>
                <td className="whitespace-nowrap px-[10px] py-3   text-[13px] border-b-[1px] border-whiteOpacity-500">Method 1</td>
                <td className="whitespace-nowrap px-[10px] py-3   text-[13px] border-b-[1px] border-whiteOpacity-500">Action 1</td>
              </tr>
              <tr>
                <td className="whitespace-nowrap px-[10px] py-3   text-[13px] border-b-[1px] border-whiteOpacity-500">1218</td>
                <td className="whitespace-nowrap px-[10px] py-3   text-[13px] border-b-[1px] border-whiteOpacity-500">Dec 30, 2019 07:52</td>
                <td className="whitespace-nowrap px-[10px] py-3   text-[13px] border-b-[1px] border-whiteOpacity-500">Gold 2</td>
                <td className="whitespace-nowrap px-[10px] py-3   text-[13px] border-b-[1px] border-whiteOpacity-500">Sweep</td>
                <td className="whitespace-nowrap px-[10px] py-3 text-red-600 text-[13px] border-b-[1px] border-whiteOpacity-500">Loss</td>
                <td className="whitespace-nowrap px-[10px] py-3   text-[13px] border-b-[1px] border-whiteOpacity-500">Type 2</td>
                <td className="whitespace-nowrap px-[10px] py-3   text-[13px] border-b-[1px] border-whiteOpacity-500">Method 2</td>
                <td className="whitespace-nowrap px-[10px] py-3   text-[13px] border-b-[1px] border-whiteOpacity-500">Action 2</td>
              </tr> */}
            </thead>
            <tbody className="text-base">
              {transactionData?.map((data) => {
                return (
                  <TransactionRecordsListing
                    data={data}
                    actionType={actionType}
                    handleCancelRequest={handleCancelRequest}
                    cancelLoading={cancelLoading}
                  />
                );
              })}
              {/* {transactionData?.length == 0 &&
              <tr style={{columnSpan: "8",textAlign:'center'}}>
                <td className="whitespace-nowrap px-[10px] py-[9px] font-normal text-[13px] capitalize   text-start">
                  No record Found
                </td>
                </tr>} */}
              {transactionData?.length === 0 && (
                <tr>
                  <td
                    colSpan="8"
                    className="whitespace-nowrap px-[10px] py-[9px] font-normal text-[13px] capitalize   text-center"
                  >
                    No record found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {showPagination && (
        <TablePagination
          className="mt-4"
          totalPages={totalPages}
          currentPage={page}
          onPageChange={handlePageChange}
          showPagination={showPagination}
        />
      )}
    </div>
  );
}

export default Transaction;
