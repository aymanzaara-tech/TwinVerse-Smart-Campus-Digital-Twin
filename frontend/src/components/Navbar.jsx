function Navbar() {
  return (
    <nav className="bg-blue-700 text-white flex justify-between items-center px-6 py-4 shadow-md">
      <h1 className="text-2xl font-bold">
        TwinVerse
      </h1>

      <div className="flex gap-6 text-xl">
        <span>🔔</span>
        <span>👤</span>
      </div>
    </nav>
  );
}

export default Navbar;