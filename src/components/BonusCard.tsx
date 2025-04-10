import { useState, useEffect } from "react";

interface Employee {
  id: string;
  name: string;
  startDate: Date;
  generation: string;
}

interface BonusCardProps {
  employee: Employee;
}

interface BonusDates {
  firstBonus: Date;
  previousBonus: Date | null;
  nextBonus: Date;
  futureBonuses: Date[];
  isTodayBonus: boolean;
}

const getEscrowBonusDates = (startDate: Date): BonusDates => {
  const today = new Date();

  const firstBonus = new Date(startDate);
  firstBonus.setFullYear(firstBonus.getFullYear() + 1);

  const isToday = (date: Date) => {
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  if (today < firstBonus) {
    if (isToday(firstBonus)) {
      return {
        firstBonus,
        previousBonus: null,
        nextBonus: new Date(
          firstBonus.getFullYear(),
          firstBonus.getMonth() + 6,
          firstBonus.getDate(),
        ),
        futureBonuses: [
          new Date(
            firstBonus.getFullYear(),
            firstBonus.getMonth() + 12,
            firstBonus.getDate(),
          ),
          new Date(
            firstBonus.getFullYear(),
            firstBonus.getMonth() + 18,
            firstBonus.getDate(),
          ),
        ],
        isTodayBonus: true,
      };
    }

    return {
      firstBonus,
      previousBonus: null,
      nextBonus: firstBonus,
      futureBonuses: [
        new Date(
          firstBonus.getFullYear(),
          firstBonus.getMonth() + 6,
          firstBonus.getDate(),
        ),
        new Date(
          firstBonus.getFullYear(),
          firstBonus.getMonth() + 12,
          firstBonus.getDate(),
        ),
      ],
      isTodayBonus: false,
    };
  }

  const monthsSinceStart =
    (today.getFullYear() - startDate.getFullYear()) * 12 +
    (today.getMonth() - startDate.getMonth());

  const completePeriods = Math.floor((monthsSinceStart - 12) / 6) + 1;

  const lastBonusDate = new Date(startDate);
  lastBonusDate.setFullYear(startDate.getFullYear() + 1);
  lastBonusDate.setMonth(lastBonusDate.getMonth() + (completePeriods - 1) * 6);

  const nextScheduledBonus = new Date(lastBonusDate);
  nextScheduledBonus.setMonth(lastBonusDate.getMonth() + 6);

  if (isToday(nextScheduledBonus)) {
    return {
      firstBonus,
      previousBonus: lastBonusDate,
      nextBonus: nextScheduledBonus,
      futureBonuses: [
        new Date(
          nextScheduledBonus.getFullYear(),
          nextScheduledBonus.getMonth() + 6,
          nextScheduledBonus.getDate(),
        ),
        new Date(
          nextScheduledBonus.getFullYear(),
          nextScheduledBonus.getMonth() + 12,
          nextScheduledBonus.getDate(),
        ),
      ],
      isTodayBonus: true,
    };
  }

  if (lastBonusDate > today) {
    lastBonusDate.setMonth(lastBonusDate.getMonth() - 6);
  }

  if (isToday(lastBonusDate)) {
    return {
      firstBonus,
      previousBonus: new Date(
        lastBonusDate.getFullYear(),
        lastBonusDate.getMonth() - 6,
        lastBonusDate.getDate(),
      ),
      nextBonus: new Date(
        lastBonusDate.getFullYear(),
        lastBonusDate.getMonth() + 6,
        lastBonusDate.getDate(),
      ),
      futureBonuses: [
        new Date(
          lastBonusDate.getFullYear(),
          lastBonusDate.getMonth() + 12,
          lastBonusDate.getDate(),
        ),
        new Date(
          lastBonusDate.getFullYear(),
          lastBonusDate.getMonth() + 18,
          lastBonusDate.getDate(),
        ),
      ],
      isTodayBonus: true,
    };
  }

  return {
    firstBonus,
    previousBonus: lastBonusDate,
    nextBonus: nextScheduledBonus,
    futureBonuses: [
      new Date(
        nextScheduledBonus.getFullYear(),
        nextScheduledBonus.getMonth() + 6,
        nextScheduledBonus.getDate(),
      ),
      new Date(
        nextScheduledBonus.getFullYear(),
        nextScheduledBonus.getMonth() + 12,
        nextScheduledBonus.getDate(),
      ),
    ],
    isTodayBonus: false,
  };
};

const getDaysUntil = (targetDate: Date): number => {
  const today = new Date();
  const diffTime =
    new Date(
      targetDate.getFullYear(),
      targetDate.getMonth(),
      targetDate.getDate(),
    ).getTime() -
    new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const Confetti = () => {
  return (
    <div className="confetti-container">
      {Array.from({ length: 100 }).map((_, i) => {
        const size = Math.random() * 10 + 5;
        const left = Math.random() * 100;
        const animationDuration = Math.random() * 3 + 2;
        const delay = Math.random() * 5;

        const colors = ["#F5822B", "#FFC107", "#4CAF50", "#2196F3", "#9C27B0"];
        const color = colors[Math.floor(Math.random() * colors.length)];

        return (
          <div
            key={i}
            className="confetti"
            style={{
              position: "absolute",
              width: `${size}px`,
              height: `${size}px`,
              backgroundColor: color,
              left: `${left}%`,
              top: "-10px",
              opacity: 0,
              animation: `fall ${animationDuration}s ease-in ${delay}s forwards`,
              zIndex: 1000,
            }}
          />
        );
      })}
      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(600px) rotate(360deg);
            opacity: 0;
          }
        }
        .confetti-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

const BonusCard: React.FC<BonusCardProps> = ({ employee }) => {
  const [bonusDates, setBonusDates] = useState<BonusDates | null>(null);
  const [daysLeft, setDaysLeft] = useState<number>(0);
  const [estimatedAmount, setEstimatedAmount] = useState<number>(0);

  useEffect(() => {
    if (employee) {
      const dates = getEscrowBonusDates(employee.startDate);
      setBonusDates(dates);

      if (!dates.isTodayBonus) {
        setDaysLeft(getDaysUntil(dates.nextBonus));
      } else {
        setDaysLeft(0);
      }

      console.log("Calculated bonus dates:", dates);
      console.log("Is today a bonus day?", dates.isTodayBonus);

      // Calculate estimated amount ($2 per hour, ~40 hours per week, 48 weeks (PTO, holidays, etc..) divided by 2)
      setEstimatedAmount((2 * 40 * 48) / 2);
    }
  }, [employee]);

  if (!bonusDates) {
    return <div>Loading...</div>;
  }

  const progressPercentage = Math.min(
    100,
    Math.max(0, 100 - (daysLeft / 180) * 100),
  );

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="relative">
      {bonusDates.isTodayBonus && <Confetti />}

      <h2 className="text-2xl font-bold mb-4">Escrow Bonus Tracker</h2>
      <p className="mb-4 text-gray-600">
        Escrow bonuses are paid after one year at Shadow-Soft, then every six
        months thereafter.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
        <div className="mb-4">
          <span className="text-gray-600">Employee:</span>
          <span className="font-semibold ml-2">{employee.name}</span>
        </div>
        <div className="mb-4">
          <span className="text-gray-600">Start Date:</span>
          <span className="font-semibold ml-2">
            {formatDate(employee.startDate)}
          </span>
        </div>
        <div className="mb-4">
          <span className="text-gray-600">First Bonus Date:</span>
          <span className="font-semibold ml-2">
            {formatDate(bonusDates.firstBonus)}
          </span>
        </div>
      </div>

      <div className="bg-white border border-orange-200 rounded-lg p-6 mb-6">
        {bonusDates.isTodayBonus ? (
          <div className="text-center py-8">
            <h3 className="text-2xl font-bold mb-4 text-ss-orange">
              🎉 Bonus Day! 🎉
            </h3>
            <div className="p-6 bg-green-50 border-2 border-green-300 rounded-lg text-center mb-6 animate-pulse">
              <span className="text-green-600 font-bold text-xl">
                Congratulations! Your escrow bonus is being processed today!
              </span>
            </div>
            <div className="my-4 p-4 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Amount:</span>
              <span className="ml-2 text-2xl font-bold text-ss-orange">
                ${estimatedAmount.toLocaleString()}
              </span>
            </div>
            <p className="text-gray-600 mt-4">
              Your next bonus will be on{" "}
              <span className="font-semibold">
                {formatDate(bonusDates.nextBonus)}
              </span>
            </p>
          </div>
        ) : (
          <>
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              Next Escrow Bonus
            </h3>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600 font-medium">Days remaining:</span>
              <span className="text-[#F5822B] font-bold text-lg">
                {daysLeft}
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
              <div
                className="bg-[#F5822B] h-4 rounded-full"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>

            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Next bonus date:</span>
              <span className="font-semibold">
                {formatDate(bonusDates.nextBonus)}
              </span>
            </div>

            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Estimated amount:</span>
              <span className="font-semibold text-[#F5822B]">
                ${estimatedAmount.toLocaleString()}
              </span>
            </div>

            {bonusDates.previousBonus && (
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Previous bonus date:</span>
                <span className="font-semibold">
                  {formatDate(bonusDates.previousBonus)}
                </span>
              </div>
            )}
          </>
        )}
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-bold mb-4 text-gray-800">
          Future Escrow Bonuses
        </h3>
        <div className="space-y-2">
          {bonusDates.futureBonuses.map((date, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-3 bg-white rounded border border-gray-200"
            >
              <span className="text-gray-600">
                Bonus #{bonusDates.previousBonus ? index + 3 : index + 2}
              </span>
              <span className="font-semibold">{formatDate(date)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BonusCard;
