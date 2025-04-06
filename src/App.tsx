import { useState } from "react";
import BonusTracker from "./components/BonusTracker";

interface Bonus {
  name: string;
  startDate: Date;
}

interface BonusGroup {
  id: string;
  label: string;
  bonuses: Bonus[];
}

const bonusGroups: BonusGroup[] = [
  {
    id: "gen1",
    label: "Gen 1",
    bonuses: [{ name: "Scrow bonus", startDate: new Date(2025, 1, 1) }],
  },
  {
    id: "gen1_2",
    label: "Gen 1.2",
    bonuses: [{ name: "Scrow bonus", startDate: new Date(2024, 0, 15) }],
  },
  {
    id: "gen2",
    label: "Gen 2",
    bonuses: [{ name: "Scrow bonus", startDate: new Date(2024, 9, 15) }],
  },
  {
    id: "gen3",
    label: "Gen 3",
    bonuses: [{ name: "Scrow bonus", startDate: new Date(2025, 0, 1) }],
  },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("gen1");

  const activeGroup = bonusGroups.find(group => group.id === activeTab)!;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Tabs */}
      <div className="flex justify-center mb-4 space-x-2">
        {bonusGroups.map(group => (
          <button
            key={group.id}
            onClick={() => setActiveTab(group.id)}
            className={`px-4 py-2 rounded-xl font-medium transition-colors duration-200
              ${
                activeTab === group.id
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-blue-100 border border-gray-300"
              }`}
          >
            {group.label}
          </button>
        ))}
      </div>

      {/* Grid de bonos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
        {activeGroup.bonuses.map(bonus => (
          <BonusTracker
            key={bonus.name}
            name={bonus.name}
            startDate={bonus.startDate}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
