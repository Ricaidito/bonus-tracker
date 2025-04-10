const BonusInfo = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Bonus Information</h2>

      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-[#F5822B] rounded-full flex items-center justify-center mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold">Escrow Bonus</h3>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <p className="mb-4">
            The Escrow Bonus is a performance reward provided to Shadow-Soft
            employees based on their tenure with the company.
          </p>

          <h4 className="font-bold text-lg mb-2">Key Details:</h4>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <span className="font-medium">First Payment:</span> Paid after
              completing one full year with Shadow-Soft
            </li>
            <li>
              <span className="font-medium">Subsequent Payments:</span> Every
              six months after the first payment
            </li>
            <li>
              <span className="font-medium">Amount:</span> $2 for every hour
              worked during the previous period (approximately $1,920 per
              payment)
            </li>
            <li>
              <span className="font-medium">Calculation:</span> Based on a
              standard 40-hour work week (excluding PTO and holidays)
            </li>
          </ul>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-bold text-blue-800 mb-2">Example:</h4>
            <p className="text-blue-700">
              If you started at Shadow-Soft on January 15, 2024, your first
              Escrow Bonus would be paid on January 15, 2025. Subsequent bonuses
              would be paid on July 15, 2025, January 15, 2026, and so on.
            </p>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-[#F5822B] rounded-full flex items-center justify-center mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold">Quarter Bonus</h3>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <p className="mb-4">
            The Quarter Bonus is a performance incentive based on billable
            client hours during each fiscal quarter. Unlike the Escrow Bonus,
            this bonus is paid on the same schedule to all eligible employees.
          </p>

          <h4 className="font-bold text-lg mb-2">Key Details:</h4>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <span className="font-medium">Payment Schedule:</span> 45 days
              after the end of each fiscal quarter
            </li>
            <li>
              <span className="font-medium">Amount:</span> $1 for every billable
              hour worked with clients during the quarter
            </li>
            <li>
              <span className="font-medium">Eligibility:</span> All Shadow-Soft
              employees who have recorded billable hours during the quarter
            </li>
          </ul>

          <h4 className="font-bold text-lg mb-2">Fiscal Quarters:</h4>
          <table className="min-w-full bg-white border border-gray-200 mb-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b text-left">Quarter</th>
                <th className="py-2 px-4 border-b text-left">Period</th>
                <th className="py-2 px-4 border-b text-left">Payout Date</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2 px-4">Q1</td>
                <td className="py-2 px-4">January 1 - March 31</td>
                <td className="py-2 px-4">May 15</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 px-4">Q2</td>
                <td className="py-2 px-4">April 1 - June 30</td>
                <td className="py-2 px-4">September 14</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 px-4">Q3</td>
                <td className="py-2 px-4">July 1 - September 30</td>
                <td className="py-2 px-4">December 14</td>
              </tr>
              <tr>
                <td className="py-2 px-4">Q4</td>
                <td className="py-2 px-4">October 1 - December 31</td>
                <td className="py-2 px-4">February 15 (following year)</td>
              </tr>
            </tbody>
          </table>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-bold text-blue-800 mb-2">Example:</h4>
            <p className="text-blue-700">
              If you worked 480 billable hours in Q1 (January-March), you would
              receive a Quarter Bonus of $480 on May 15.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BonusInfo;
