interface BonusTrackerProps {
  startDate: Date;
  name: string;
}

interface BonusDates {
  previousBonus: Date;
  nextBonus: Date;
}

const getClosestBonuses = (startDate: Date, today: Date): BonusDates => {
  const monthsBetween =
    (today.getFullYear() - startDate.getFullYear()) * 12 +
    (today.getMonth() - startDate.getMonth());
  const periodsPassed = Math.floor(monthsBetween / 6);

  const previousBonus = new Date(startDate);
  previousBonus.setMonth(startDate.getMonth() + periodsPassed * 6);

  const nextBonus = new Date(previousBonus);
  nextBonus.setMonth(previousBonus.getMonth() + 6);

  if (today < previousBonus) {
    nextBonus.setMonth(previousBonus.getMonth());
    previousBonus.setMonth(previousBonus.getMonth() - 6);
  }

  return { previousBonus, nextBonus };
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

const BonusTracker: React.FC<BonusTrackerProps> = ({ startDate, name }) => {
  const today = new Date();
  const { previousBonus, nextBonus } = getClosestBonuses(startDate, today);
  const daysLeft = getDaysUntil(nextBonus);
  const isTodayBonus = daysLeft === 0;

  return (
    <div className="bg-white rounded-xl shadow-md p-4 text-center w-full">
      <h2 className="text-lg font-semibold mb-2">{name}</h2>
      {isTodayBonus ? (
        <p className="text-green-600 font-bold">¡El bono es hoy! 🤑</p>
      ) : (
        <p className="text-blue-700 text-sm">
          Faltan <span className="font-bold">{daysLeft}</span> días
        </p>
      )}
      <div className="text-xs text-gray-500 mt-2">
        <p>
          Anterior:{" "}
          {previousBonus.toLocaleDateString("es-ES", {
            month: "long",
            year: "numeric",
          })}
        </p>
        <p>
          Próximo:{" "}
          {nextBonus.toLocaleDateString("es-ES", {
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>
    </div>
  );
};

export default BonusTracker;
