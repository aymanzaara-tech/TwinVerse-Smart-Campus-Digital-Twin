import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Card from "../components/Card";

function Dashboard() {
  return (
    <div>
      <Navbar />

      <div className="flex">
        <Sidebar />

        <div className="flex-1 p-8 bg-gray-100 min-h-screen">
          <h1 className="text-3xl font-bold mb-8">
            Smart Campus Dashboard
          </h1>

          <div className="grid grid-cols-2 gap-6">

            <Card
              title="Temperature"
              value="28°C"
            />

            <Card
              title="Humidity"
              value="65%"
            />

            <Card
              title="Occupancy"
              value="45 Students"
            />

            <Card
              title="Comfort Score"
              value="90%"
            />

          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;