import { useState, useEffect } from "react";

interface Employee {
  id: string;
  name: string;
  startDate: Date;
  generation: string;
}

interface FiscalQuarter {
  quarter: string;
  startDate: Date;
  endDate: Date;
  payoutDate: Date;
}

interface QuarterBonusTrackerProps {
  fiscalQuarters: FiscalQuarter[];
  employee: Employee | null;
}

const QuarterBonusTracker: React.FC<QuarterBonusTrackerProps> = ({
  fiscalQuarters,
  employee,
}) => {
  const [currentQuarter, setCurrentQuarter] = useState<FiscalQuarter | null>(
    null,
  );
  const [daysUntilPayout, setDaysUntilPayout] = useState<number>(0);

  useEffect(() => {
    const today = new Date();
    const current =
      fiscalQuarters.find(q => today >= q.startDate && today <= q.endDate) ||
      fiscalQuarters[0];

    setCurrentQuarter(current);

    const payoutDate = new Date(current.payoutDate);
    const diffTime = payoutDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setDaysUntilPayout(diffDays > 0 ? diffDays : 0);
  }, [fiscalQuarters, employee]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!currentQuarter) {
    return <div>Loading...</div>;
  }

  const isPastPayout =
    daysUntilPayout === 0 && new Date() > currentQuarter.payoutDate;

  const isTodayPayout = daysUntilPayout === 0 && !isPastPayout;

  const totalDaysInQuarter = Math.ceil(
    (currentQuarter.payoutDate.getTime() - currentQuarter.startDate.getTime()) /
      (1000 * 60 * 60 * 24),
  );

  const elapsedDays = totalDaysInQuarter - daysUntilPayout;
  const progressPercentage = Math.min(
    100,
    Math.max(0, (elapsedDays / totalDaysInQuarter) * 100),
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Quarter Bonus Tracker</h2>
      <p className="mb-4 text-gray-600">
        Quarter bonuses are paid 45 days after the end of each fiscal quarter.
        The amount is $1 for every billable hour worked during the quarter.
      </p>

      <div className="bg-white border border-orange-200 rounded-lg p-6 mb-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">
          Current Quarter: {currentQuarter.quarter}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <span className="text-gray-600 block mb-1">Start Date:</span>
            <span className="font-semibold">
              {formatDate(currentQuarter.startDate)}
            </span>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <span className="text-gray-600 block mb-1">End Date:</span>
            <span className="font-semibold">
              {formatDate(currentQuarter.endDate)}
            </span>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <span className="text-gray-600 block mb-1">Payout Date:</span>
            <span className="font-semibold">
              {formatDate(currentQuarter.payoutDate)}
            </span>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <span className="text-gray-600 block mb-1">Estimated Bonus:</span>
            <span className="font-semibold text-[#F5822B]">
              Look on Ruddr (in the last quarter section) for the actual amount
            </span>
          </div>
        </div>

        {isTodayPayout ? (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center mb-4">
            <span className="text-green-600 font-bold text-lg">
              Quarter bonus is paid next pay day (1st of the month)! 🎉
            </span>
          </div>
        ) : isPastPayout ? (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center mb-4">
            <span className="text-blue-600 font-medium">
              The payout date for this quarter has passed. Next quarter's bonus
              will be paid on {formatDate(fiscalQuarters[1].payoutDate)}.
            </span>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600 font-medium">
                Days until payout:
              </span>
              <span className="text-[#F5822B] font-bold text-lg">
                {daysUntilPayout}
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
              <div
                className="bg-[#F5822B] h-4 rounded-full"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </>
        )}
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-bold mb-4 text-gray-800">
          Fiscal Quarters Overview
        </h3>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b text-left">Quarter</th>
                <th className="py-2 px-4 border-b text-left">Period</th>
                <th className="py-2 px-4 border-b text-left">Payout Date</th>
                <th className="py-2 px-4 border-b text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {fiscalQuarters.map((quarter, index) => {
                const today = new Date();
                let status = "Upcoming";

                if (today > quarter.payoutDate) {
                  status = "Paid";
                } else if (today > quarter.endDate) {
                  status = "Pending Payment";
                } else if (today >= quarter.startDate) {
                  status = "Current";
                }

                return (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4 font-medium">{quarter.quarter}</td>
                    <td className="py-2 px-4">
                      {formatDate(quarter.startDate)} -{" "}
                      {formatDate(quarter.endDate)}
                    </td>
                    <td className="py-2 px-4">
                      {formatDate(quarter.payoutDate)}
                    </td>
                    <td className="py-2 px-4">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-medium
                        ${status === "Paid" ? "bg-green-100 text-green-800" : ""}
                        ${status === "Pending Payment" ? "bg-blue-100 text-blue-800" : ""}
                        ${status === "Current" ? "bg-orange-100 text-orange-800" : ""}
                        ${status === "Upcoming" ? "bg-gray-100 text-gray-800" : ""}
                      `}
                      >
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default QuarterBonusTracker;
