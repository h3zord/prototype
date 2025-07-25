import {
  differenceInDays,
  isPast,
  isToday,
  format,
  differenceInCalendarDays,
} from "date-fns";
import React from "react";

export const DispatchDateBadge = React.memo(
  ({
    date,
    preparedToDispatch,
  }: {
    date: string;
    preparedToDispatch?: boolean;
  }) => {
    const dispatchDate = new Date(date);
    const today = new Date();

    // Normalize dates to exclude the time portion
    const normalizedDispatchDate = new Date(
      dispatchDate.getFullYear(),
      dispatchDate.getMonth(),
      dispatchDate.getDate()
    );
    const normalizedToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    // Calculate the difference in days
    const daysUntil = differenceInCalendarDays(
      normalizedDispatchDate,
      normalizedToday
    );

    let statusText = "";
    let badgeColor = "";

    if (preparedToDispatch) {
      statusText = "Despachar";
      badgeColor = "bg-green-600 font-sm font-medium text-white";
    } else if (isPast(dispatchDate) && !isToday(dispatchDate)) {
      statusText = "Atrasada";
      badgeColor = "bg-black font-medium text-white";
    } else if (isToday(dispatchDate)) {
      statusText = "Hoje";
      badgeColor = "bg-yellow-100 font-medium text-yellow-800";
    } else if (daysUntil === 1) {
      statusText = "Amanhã";
      badgeColor = "bg-blue-100 font-medium text-blue-800";
    } else if (daysUntil === 2) {
      statusText = "Em 2 dias";
      badgeColor = "bg-green-100 font-medium text-green-800";
    }

    const formattedDate = format(dispatchDate, "dd/MM/yyyy");

    return (
      <div className="text-center text-[12px] flex justify-between gap-2">
        {statusText ? (
          <div
            className={`px-1 py-1 rounded-full ${badgeColor} text-[12px] min-w-[60px]`}
          >
            {statusText}
          </div>
        ) : null}
        <div className={` mt-1 ${statusText ? "text-[12px]" : "text-[12px]"}`}>
          {formattedDate}
        </div>
      </div>
    );
  }
);
