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
  today.setHours(0, 0, 0, 0);

  const firstBonus = new Date(startDate);
  firstBonus.setFullYear(firstBonus.getFullYear() + 1);

  const isToday = (date: Date) => {
    const dateToCheck = new Date(date);
    dateToCheck.setHours(0, 0, 0, 0);
    return dateToCheck.getTime() === today.getTime();
  };

  const isFuture = (date: Date) => {
    const dateToCheck = new Date(date);
    dateToCheck.setHours(0, 0, 0, 0);
    return dateToCheck.getTime() > today.getTime();
  };

  if (isFuture(firstBonus) || isToday(firstBonus)) {
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

  const allBonusDates = [];

  allBonusDates.push(new Date(firstBonus));

  let currentDate = new Date(firstBonus);
  while (true) {
    currentDate = new Date(currentDate);
    currentDate.setMonth(currentDate.getMonth() + 6);

    if (currentDate.getFullYear() > today.getFullYear() + 2) {
      break;
    }

    allBonusDates.push(new Date(currentDate));
  }

  let previousBonus = null;
  for (let i = allBonusDates.length - 1; i >= 0; i--) {
    if (!isFuture(allBonusDates[i]) && !isToday(allBonusDates[i])) {
      previousBonus = allBonusDates[i];
      break;
    }
  }

  let nextBonus = null;
  let isTodayBonus = false;

  for (let i = 0; i < allBonusDates.length; i++) {
    if (isToday(allBonusDates[i])) {
      nextBonus = allBonusDates[i];
      isTodayBonus = true;
      break;
    } else if (isFuture(allBonusDates[i])) {
      nextBonus = allBonusDates[i];
      break;
    }
  }

  if (!nextBonus) {
    nextBonus = new Date(previousBonus || firstBonus);
    nextBonus.setMonth(nextBonus.getMonth() + 6);
  }

  const futureBonus1 = new Date(nextBonus);
  futureBonus1.setMonth(nextBonus.getMonth() + 6);

  const futureBonus2 = new Date(nextBonus);
  futureBonus2.setMonth(nextBonus.getMonth() + 12);

  return {
    firstBonus,
    previousBonus,
    nextBonus,
    futureBonuses: [futureBonus1, futureBonus2],
    isTodayBonus,
  };
};

const getDaysUntil = (targetDate: Date): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = new Date(targetDate);
  target.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const BackgroundConfetti = () => {
  return (
    <div className="confetti-container">
      {Array.from({ length: 50 }).map((_, i) => {
        const size = Math.random() * 8 + 4;
        const left = Math.random() * 100;
        const animationDuration = Math.random() * 3 + 2;
        const delay = Math.random() * 3;

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
              zIndex: 1,
            }}
          />
        );
      })}
      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.8;
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
      {bonusDates.isTodayBonus && <BackgroundConfetti />}

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
            <h3 className="text-2xl font-bold mb-4 text-ss-orange animate-pulse">
              🎉 Bonus Day! 🎉
            </h3>
            <div className="p-6 bg-green-50 border-2 border-green-300 rounded-lg text-center mb-6">
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
