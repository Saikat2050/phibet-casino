"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import TablePagination from "../Pagination/Index";
import Select, { components } from "react-select";
import Datepicker from "tailwind-datepicker-react";
import { dateOptions } from "./DateOptions";
import { getGameHistoryData } from "@/actions";
import SelectDownArrow from "../../../public/assets/img/svg/SelectDownArrow";
import { formatDate } from "@/utils/helper";
import ArrowCircleLeftWhite from "../../../public/assets/img/svg/ArrowCircleLeftWhite";
import GameRecordsListing from "./GameRecordsListing";

const DropdownIndicator = (props) => {
  return (
    <components.DropdownIndicator {...props}>
      <SelectDownArrow />
    </components.DropdownIndicator>
  );
};

const options = [
  { value: "GC", label: "GC Coin" },
  { value: "SC", label: "SC Coin" },
];

function GameHistory() {
  const currentDate = new Date();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );

  const [showStartDate, setShowStartDate] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);
  const [startDate, setStartDate] = useState(firstDayOfMonth);
  const [endDate, setEndDate] = useState(currentDate);
  const [selectedCoin, setSelectedCoin] = useState({
    value: "GC",
    label: "GC Coin",
  });

  const [dateError, setDateError] = useState("");
  const [gameHistoryData, setGameHistoryData] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 6;

  const fetchGameHistoryData = async (params) => {
    try {
      const response = await getGameHistoryData(params);

      setGameHistoryData(response?.data?.data?.rows);
      setCount(response?.data?.data?.count);
    } catch (error) {
      console.error("Error fetching game history data:", error);
    }
  };

  // useEffect(() => {

  //   if (startDate && endDate && !dateError) {
  //     const params = {
  //       startDate: startDate.toLocaleDateString("en-CA").split("T")[0],
  //       endDate: endDate.toLocaleDateString("en-CA").split("T")[0],
  //       coinType: selectedCoin.value,
  //       page: 1,
  //       limit,
  //     };
  //     fetchGameHistoryData(params);
  //   }
  // }, [startDate, endDate, selectedCoin]);

  useEffect(() => {
    if (startDate && endDate && !dateError) {
      const params = {
        startDate: startDate.toLocaleDateString("en-CA").split("T")[0],
        endDate: endDate.toLocaleDateString("en-CA").split("T")[0],
        coinType: selectedCoin.value,
        page,
        limit,
      };

      fetchGameHistoryData(params);
    }
  }, [page, startDate, endDate, selectedCoin]);

  useEffect(() => {
    setPage(1);
  }, [startDate, endDate, selectedCoin]);

  const handleStartDateChange = (date) => {
    setStartDate(date);
    if (date && endDate && date > endDate) {
      setDateError("End date must be after start date.");
      // setEndDate('');
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

  const totalPages = Math.ceil(count / limit);
  const showPagination = gameHistoryData?.length > 0 && totalPages > 1;


  return (
    <div className="py-[30px] px-3 nlg:px-[50px] max-xl:py-6 md:min-h-[505px]">
      <div className="flex items-center justify-between mb-4 md:hidden">
        <Link
          href="/user"
          className="text-xs text-white font-bold flex items-center justify-center gap-1 leading-none"
        >
          <ArrowCircleLeftWhite /> Back to Menu
        </Link>
        <span className="text-white text-sm font-bold capitalize">
          Game History
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
              value={selectedCoin}
              onChange={setSelectedCoin}
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
          <table className="min-w-full divide-y-2 bg-transparent">
            <thead>
              <tr className=" -600 [&>th:first-child]:rounded-bl-[6px] [&>th:first-child]:rounded-tl-[6px] [&>th:last-child]:rounded-br-[6px] [&>th:last-child]:rounded-tr-[6px]">
                <th className="whitespace-nowrap px-[10px] py-[9px] font-normal text-[13px] capitalize   text-start">
                  Game ID
                </th>
                <th className="whitespace-nowrap px-[10px] py-[9px] font-normal text-[13px] capitalize   text-start">
                  Date & Time
                </th>
                <th className="whitespace-nowrap px-[10px] py-[9px] font-normal text-[13px] capitalize   text-start">
                  Game Name
                </th>
                <th className="whitespace-nowrap px-[10px] py-[9px] font-normal text-[13px] capitalize   text-start">
                  Stake
                </th>
                <th className="whitespace-nowrap px-[10px] py-[9px] font-normal text-[13px] capitalize   text-start">
                  Win
                </th>
              </tr>
            </thead>
            <tbody className="divide-y text-base">
              {gameHistoryData?.map((data) => (
                <GameRecordsListing data={data} />
                // <tr key={data.id}>
                //   <td className="whitespace-nowrap px-[10px] py-3   text-[13px] border-b-[1px] border-whiteOpacity-500">{data?.game_id}</td>
                //   <td className="whitespace-nowrap px-[10px] py-3   text-[13px] border-b-[1px] border-whiteOpacity-500">{formatDate(data?.created_at)}</td>
                //   <td className="whitespace-nowrap px-[10px] py-3   text-[13px] border-b-[1px] border-whiteOpacity-500">{data?.game_identifier}</td>
                //   <td className="whitespace-nowrap px-[10px] py-3 text-red-600 text-[13px] font-bold border-b-[1px] border-whiteOpacity-500">{data?.bet_amount}</td>
                //   <td className="whitespace-nowrap px-[10px] py-3   text-[13px] border-b-[1px] border-whiteOpacity-500">{data?.win_amount || "0"}</td>
                // </tr>
              ))}
              {gameHistoryData?.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="whitespace-nowrap px-[10px] py-[9px] font-normal text-[13px] capitalize   text-center"
                  >
                    No record found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
    </div>
  );
}

export default GameHistory;
