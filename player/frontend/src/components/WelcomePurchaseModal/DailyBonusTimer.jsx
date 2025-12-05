"use client";
import React, { useEffect, useState } from "react";
import moment from "moment";

const DailyBonusTimer = ({ eventDateTime }) => {
  const calculateTimeLeft = () => {
    const eventTime = Math.floor(new Date(moment(eventDateTime)) / 1000);
    const currentTime = Math.floor(Date.now() / 1000);
    const leftTime = eventTime - currentTime;
    let duration = moment.duration(leftTime, "seconds");

    if (duration.asSeconds() <= 0) {
      return null; // Timer is over
    }

    return {
      hours: String(duration.hours()).padStart(2, "0"),
      minutes: String(duration.minutes()).padStart(2, "0"),
      seconds: String(duration.seconds()).padStart(2, "0"),
    };
  };

  const [timeLeft, setTimeLeft] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      const timeLeftValue = calculateTimeLeft();
      setTimeLeft(timeLeftValue);
      if (timeLeftValue) setLoading(false); // Set loading to false once timeLeft is calculated
    }, 1000);

    return () => clearInterval(timer);
  }, [eventDateTime]);

  if (loading) {
    return <p>Loading...</p>; // Replace this with a spinner if desired
  }

  if (!timeLeft) {
    return <p className="text-red-500 font-bold">Event End!</p>;
  }

  return (
    <div className="flex justify-center items-center space-x-2">
      <div className="flex flex-col items-center">
        <span className="text-lg font-semibold  ">
          {timeLeft.hours}
        </span>
        <span className="text-sm   max-sm:hidden">Hours</span>
      </div>
      <span className="text-lg font-semibold  ">:</span>
      <div className="flex flex-col items-center">
        <span className="text-lg font-semibold  ">
          {timeLeft.minutes}
        </span>
        <span className="text-sm   max-sm:hidden">Minutes</span>
      </div>
      <span className="text-lg font-semibold  ">:</span>
      <div className="flex flex-col items-center">
        <span className="text-lg font-semibold  ">
          {timeLeft.seconds}
        </span>
        <span className="text-sm   max-sm:hidden">Seconds</span>
      </div>
    </div>
  );
};

export default DailyBonusTimer;
