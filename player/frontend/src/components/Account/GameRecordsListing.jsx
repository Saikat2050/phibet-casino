import { formatDate } from '@/utils/helper'
import React from 'react'

const GameRecordsListing = ({ data }) => {
    return (
        <tr key={data.id}>
            <td className="whitespace-nowrap px-[10px] py-3   text-[13px] border-b-[1px] border-whiteOpacity-500">{data?.game_id}</td>
            <td className="whitespace-nowrap px-[10px] py-3   text-[13px] border-b-[1px] border-whiteOpacity-500">{formatDate(data?.created_at)}</td>
            <td className="whitespace-nowrap px-[10px] py-3   text-[13px] border-b-[1px] border-whiteOpacity-500">{data?.game_identifier}</td>
            <td className="whitespace-nowrap px-[10px] py-3 text-red-600 text-[13px] font-bold border-b-[1px] border-whiteOpacity-500">{data?.bet_amount}</td>
            <td className="whitespace-nowrap px-[10px] py-3   text-[13px] border-b-[1px] border-whiteOpacity-500">{data?.win_amount || "0"}</td>
        </tr>
    )
}

export default React.memo(GameRecordsListing)