import Copy from "@/assets/images/Copy";
import { copyToClipboard, formatDate } from "@/utils/helper";
import React from "react";
import { FiXCircle } from "react-icons/fi";

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

const renderStatus = (status) => <span>{STATUS_MAP[status] || "Unknown"}</span>;
const TransactionRecordsListing = ({
  data,
  actionType,
  handleCancelRequest,
  cancelLoading,
}) => {
  return (
    <tr key={data.transactionid}>
      <td className="whitespace-nowrap px-[10px] py-[9px] font-normal text-[13px] capitalize   text-start pr-4 relative ">
        <div className="group">
          {" "}
          <span>
            {data.transactionid
              ? data.transactionid.substring(0, 10) + "..."
              : "-"}{" "}
          </span>
          <span className="absolute left-0 bg-white px-1 rounded-lg -top-3 group-hover:block hidden text-blackOpacity-100">
            {" "}
            {data.transactionid ? data.transactionid : "-"}
          </span>
        </div>
        {data?.transactionid?.length > 0 && (
          <button
            className="hover:text-white group-hover:text-blue-500 absolute top-1/4 right-0 cursor-pointer"
            onClick={() => copyToClipboard(data.transactionid)}
          >
            <Copy />
          </button>
        )}
      </td>
      <td className="whitespace-nowrap px-[10px] py-[9px] font-normal text-[13px] capitalize   text-start">
        {data.transactiontype == "daily bonus" ||
        data.transactiontype == "welcome bonus"
          ? data.created_at
            ? formatDate(data.created_at)
            : "-"
          : data.updated_at
          ? formatDate(data.updated_at)
          : "-"}
      </td>
      <td className="whitespace-nowrap px-[10px] py-[9px] font-normal text-[13px] capitalize   text-start">
        {data.gccoin ? data.gccoin : "-"}
      </td>
      <td className="whitespace-nowrap px-[10px] py-[9px] font-normal text-[13px] capitalize   text-start">
        {data.sccoin ? data.sccoin : "-"}
      </td>
      {/* {actionType.value == "deposit" && ( */}
      <td className="whitespace-nowrap px-[10px] py-[9px] font-normal text-[13px] capitalize   text-start">
        {data.amount ? data.amount : "-"}
      </td>
      {/* )} */}
      <td className="whitespace-nowrap px-[10px] py-[9px] font-normal text-[13px] capitalize   text-start">
        {data.status in STATUS_MAP ? renderStatus(data.status) : "-"}
      </td>
      <td className="whitespace-nowrap px-[10px] py-[9px] font-normal text-[13px] capitalize   text-start">
        {data.transactiontype ? data.transactiontype : "-"}
      </td>
      <td className="whitespace-nowrap px-[10px] py-[9px] font-normal text-[13px] capitalize   text-start">
        {data.method ? data.method : "-"}
      </td>
      <td className="whitespace-nowrap px-[10px] py-[9px] font-normal text-[13px] capitalize   text-start">
        {data.transactiontype == "Redemption" && data.status === 0 ? (
          <button
            onClick={() => handleCancelRequest(data)}
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
  );
};

export default React.memo(TransactionRecordsListing);
