import { useState, useEffect } from "react";
import Header from "./components/Header";
import BonusCard from "./components/BonusCard";
import BonusInfo from "./components/BonusInfo";
import QuarterBonusTracker from "./components/QuarterBonusTracker";
interface Employee {
  id: string;
  name: string;
  startDate: Date;
  generation: string;
}

const employees: Employee[] = [
  {
    id: "ss1",
    name: "Wilson Castillo",
    startDate: new Date(2022, 7, 15),
    generation: "Gen 1",
  },
  {
    id: "ss2",
    name: "Camilo Joga",
    startDate: new Date(2022, 7, 15),
    generation: "Gen 1",
  },
  {
    id: "ss4",
    name: "Fernando Reyes",
    startDate: new Date(2023, 0, 4),
    generation: "Gen 1.2",
  },
  {
    id: "ss5",
    name: "Carlos Collado",
    startDate: new Date(2023, 9, 15),
    generation: "Gen 2",
  },
  {
    id: "ss6",
    name: "Ricardo Arturo",
    startDate: new Date(2023, 9, 15),
    generation: "Gen 2",
  },
  {
    id: "ss7",
    name: "Tommy Sanchez",
    startDate: new Date(2023, 9, 15),
    generation: "Gen 2",
  },
  {
    id: "ss8",
    name: "Joao Gabriel",
    startDate: new Date(2024, 8, 5),
    generation: "Gen 3",
  },
  {
    id: "ss9",
    name: "Fernando Valerio",
    startDate: new Date(2024, 8, 5),
    generation: "Gen 3",
  },
  {
    id: "ss10",
    name: "Oliver Castillo",
    startDate: new Date(2024, 8, 5),
    generation: "Gen 3",
  },
  {
    id: "ss11",
    name: "Carlos Jorge",
    startDate: new Date(2024, 8, 5),
    generation: "Gen 3",
  },
];

const generations = Array.from(new Set(employees.map(emp => emp.generation)));

const getFiscalQuarterDates = () => {
  const currentYear = new Date().getFullYear();

  return [
    {
      quarter: "Q1",
      startDate: new Date(currentYear, 0, 1),
      endDate: new Date(currentYear, 2, 31),
      payoutDate: new Date(currentYear, 4, 15),
    },
    {
      quarter: "Q2",
      startDate: new Date(currentYear, 3, 1),
      endDate: new Date(currentYear, 5, 30),
      payoutDate: new Date(currentYear, 7, 14),
    },
    {
      quarter: "Q3",
      startDate: new Date(currentYear, 6, 1),
      endDate: new Date(currentYear, 8, 30),
      payoutDate: new Date(currentYear, 10, 14),
    },
    {
      quarter: "Q4",
      startDate: new Date(currentYear, 9, 1),
      endDate: new Date(currentYear, 11, 31),
      payoutDate: new Date(currentYear + 1, 1, 15),
    },
  ];
};

const App = () => {
  const [activeGeneration, setActiveGeneration] = useState<string>(
    generations[0],
  );
  const [activeTab, setActiveTab] = useState<string>("escrow");
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);

  const employeesInGeneration = employees.filter(
    emp => emp.generation === activeGeneration,
  );

  useEffect(() => {
    if (employeesInGeneration.length > 0) {
      setCurrentEmployee(employeesInGeneration[0]);
    }
  }, [activeGeneration]);

  const handleChangeEmployee = (employeeId: string) => {
    const selected = employees.find(emp => emp.id === employeeId);
    if (selected) {
      setCurrentEmployee(selected);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-center mb-6 space-x-2">
          {generations.map(gen => (
            <button
              key={gen}
              onClick={() => setActiveGeneration(gen)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200
                ${
                  activeGeneration === gen
                    ? "bg-[#F5822B] text-white"
                    : "bg-white text-gray-700 hover:bg-orange-50 border border-gray-300"
                }`}
            >
              {gen}
            </button>
          ))}
        </div>

        {employeesInGeneration.length > 0 && (
          <div className="mb-6">
            <label
              htmlFor="ssloyee-select"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Select Employee:
            </label>
            <select
              id="ssloyee-select"
              className="bg-white border border-gray-300 text-gray-700 rounded-lg p-2 w-full max-w-md"
              onChange={e => handleChangeEmployee(e.target.value)}
              value={currentEmployee?.id || ""}
            >
              {employeesInGeneration.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} (Started: {emp.startDate.toLocaleDateString()})
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex mb-6 border-b border-gray-300">
          <button
            onClick={() => setActiveTab("escrow")}
            className={`px-6 py-3 font-medium text-sm ${
              activeTab === "escrow"
                ? "border-b-2 border-[#F5822B] text-[#F5822B]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Escrow Bonus
          </button>
          <button
            onClick={() => setActiveTab("quarter")}
            className={`px-6 py-3 font-medium text-sm ${
              activeTab === "quarter"
                ? "border-b-2 border-[#F5822B] text-[#F5822B]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Quarter Bonus
          </button>
          <button
            onClick={() => setActiveTab("info")}
            className={`px-6 py-3 font-medium text-sm ${
              activeTab === "info"
                ? "border-b-2 border-[#F5822B] text-[#F5822B]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Bonus Information
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          {activeTab === "escrow" && currentEmployee && (
            <BonusCard employee={currentEmployee} />
          )}

          {activeTab === "quarter" && (
            <QuarterBonusTracker
              fiscalQuarters={getFiscalQuarterDates()}
              employee={currentEmployee}
            />
          )}

          {activeTab === "info" && <BonusInfo />}
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-4 text-center text-sm">
        <p>Shadow-Soft Bonus Tracker - {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default App;
