const Header = () => {
  return (
    <header className="bg-gray-800 py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="text-white font-semibold text-xl flex items-center">
            <div className="w-8 h-8 bg-[#F5822B] rounded-md flex items-center justify-center mr-2">
              <span className="text-white font-bold">S</span>
            </div>
            <span>Shadow-Soft</span>
          </div>
        </div>

        <div className="flex items-center">
          <h1 className="text-white text-lg font-medium">Bonus Tracker</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
