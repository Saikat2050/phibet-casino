import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import {
  cancelRedemptionRequestAction,
  getRedemptionRequestsAction,
} from "@/actions";
import TablePagination from "../Pagination/Index"; // Import the pagination component
import Select, { components } from "react-select";
import Datepicker from "tailwind-datepicker-react";
import { dateOptions } from "./DateOptions";
import SelectDownArrow from "../../../public/assets/img/svg/SelectDownArrow";
import { FiXCircle } from "react-icons/fi"; // Import cancel icon from react-icons
import Cross from "@/assets/images/Cross";
import useModalsStore from "@/store/useModalsStore";

// Custom DropdownIndicator component for the Select dropdown
const DropdownIndicator = (props) => {
  return (
    <components.DropdownIndicator {...props}>
      <SelectDownArrow />
    </components.DropdownIndicator>
  );
};

const RedemptionRequestsTable = () => {
  const currentDate = new Date();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const { closeModal } = useModalsStore();

  const [redemptionRequests, setRedemptionRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const [count, setCount] = useState(0);

  const [showStartDate, setShowStartDate] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);
  const [startDate, setStartDate] = useState(firstDayOfMonth);
  const [endDate, setEndDate] = useState(currentDate);
  const [dateError, setDateError] = useState("");

  useEffect(() => {
    fetchRedemptionRequests();
  }, [startDate, endDate, page, limit]);

  const fetchRedemptionRequests = async () => {
    setLoading(true);
    try {
      const params = {
        startDate: formatDateToISOWithoutTZ(startDate),
        endDate: formatDateToISOWithoutTZ(endDate),
        page,
        limit,
      };
      const response = await getRedemptionRequestsAction(params);

      if (response.success) {
        setRedemptionRequests(response.data.rows);
        setCount(response.data.count); // Assuming `count` is returned in the response
      } else {
        toast.error(response.message || "Failed to fetch redemption requests");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while fetching redemption requests.");
    }
    setLoading(false);
  };

  const handleCancelRequest = async (item) => {
    setCancelLoading(true);
    try {
      const response = await cancelRedemptionRequestAction({
        transactionId: item.transactionId,
      });
      if (response.success) {
        toast.success("Request canceled successfully.");
        fetchRedemptionRequests(); // Refresh data after cancelation
      } else {
        toast.error(response.message || "Failed to cancel request.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while canceling the request.");
    }
    setCancelLoading(false);
  };

  const STATUS_MAP = {
    0: "Pending",
    1: "Success",
    2: "Cancelled",
    3: "Failed",
    4: "Rollback",
    5: "Approved",
    6: "Declined",
    7: "In-progress",
    8: "Postpone",
  };

  const renderStatus = (status) => (
    <span>{STATUS_MAP[status] || "Unknown"}</span>
  );

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleStartDateChange = (date) => {
    if (date && endDate && date >= endDate) {
      setDateError("End date must be after start date.");
      setEndDate(null);
    } else {
      setStartDate(date);
      setDateError("");
    }
  };

  const handleEndDateChange = (date) => {
    if (startDate && date <= startDate) {
      setDateError("End date must be after start date.");
    } else {
      setEndDate(date);
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

  function formatDateToISOWithoutTZ(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const totalPages = Math.ceil(count / limit);
  const showPagination = redemptionRequests?.length > 0 && totalPages > 1;


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

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <div className="relative pt-8 pb-6 px-4 nlg:px-10   w-full rounded-lg">
      <div
        className="absolute top-2 right-4 cursor-pointer hover:rotate-90 transition-transform duration-200"
        onClick={() => closeModal()}
      >
        <Cross />
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
            <p className="text-red-500 mt-2 text-xs">{dateError}</p>
          )}
        </div>
      </div>

      <div className="mt-4 overflow-x-auto max-h-80 min-h-80 overflow-y-auto">
        {loading ? (
          <p className="text-center text-white">Loading...</p>
        ) : (
          <table className="min-w-full bg-transparent">
            <thead>
              <tr className="  sticky top-0">
                <th className="px-4 py-2 text-start text-white">
                  Withdraw Request ID
                </th>
                <th className="px-4 py-2 text-start text-white">Date & Time</th>
                <th className="px-4 py-2 text-start text-white">Amount</th>
                <th className="px-4 py-2 text-start text-white">Status</th>
                <th className="px-4 py-2 text-start text-white">
                  Cancel Request
                </th>
              </tr>
            </thead>
            <tbody className=" 00">
              {redemptionRequests.length > 0 ? (
                redemptionRequests.map((item) => (
                  <tr key={item.transactionId} className="hover: ">
                    <td className="px-4 py-2 border-b">{item.transactionId}</td>
                    <td className="px-4 py-2 border-b">
                      {formatDate(item.createdAt)}
                    </td>
                    <td className="px-4 py-2 border-b">${item.amount}</td>
                    <td className="px-4 py-2 border-b">
                      {renderStatus(item.status)}
                    </td>
                    <td className="px-4 py-2 border-b text-center">
                      {item.status === 0 ? (
                        <button
                          onClick={() => handleCancelRequest(item)}
                          className="text-red-600 hover:text-red-800"
                          disabled={cancelLoading}
                          title="Cancel Request"
                        >
                          <FiXCircle size={20} />
                        </button>
                      ) : (
                        <span className="text-white">-</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-white">
                    No redemption requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
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
};

export default RedemptionRequestsTable;
