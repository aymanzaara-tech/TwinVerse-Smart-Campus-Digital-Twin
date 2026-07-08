import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen p-6">
      <ul className="space-y-6 text-lg">

        <li>
          <Link to="/dashboard">🏠 Dashboard</Link>
        </li>

        <li>
          <Link to="/analytics">📈 Analytics</Link>
        </li>

        <li>
          <Link to="/3d-view">🏢 3D View</Link>
        </li>

        <li>
          <Link to="/settings">⚙ Settings</Link>
        </li>

      </ul>
    </div>
  );
}

export default Sidebar;