import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PageHeader from "@/components/ui/PageHeader";
const API_URL = import.meta.env.VITE_API_URL;

export default function Settings() {
  const [settings, setSettings] = useState({
    systemName: "TwinVerse",
    campusName: "Sai Vidya Institute of Technology",
    building: "Main Block",
    seminarHall: "Smart Seminar Hall",

    refreshRate: "30",

    temperatureThreshold: 30,
    humidityThreshold: 70,
    occupancyLimit: 120,
    iaqThreshold: 70,

    liveUpdates: true,
    notifications: true,

    occupancyOverlay: true,
    seatLabels: true,
    temperatureHeatmap: true,
    cameraAnimation: true,
    deviceStatus: true,
    darkMode: true,
    accentColor: "Blue",
    compactMode: false,
    animations: true,
  });
  useEffect(() => {
  loadSettings();
}, []);

async function loadSettings() {
  try {
    const response = await fetch(`${API_URL}/api/settings`, {
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    });

    if (!response.ok) {
      throw new Error("Unable to load settings");
    }

    const data = await response.json();

    setSettings(data);

  } catch (error) {
    console.error(error);
  }
}

async function saveSettings() {
  try {
    const response = await fetch(`${API_URL}/api/settings`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },

      body: JSON.stringify(settings),
    });

    if (!response.ok) {
      throw new Error("Failed to save settings");
    }

    alert("Settings Saved Successfully!");

  } catch (error) {

    console.error(error);

    alert("Failed to Save Settings");
  }
}

async function testConnection() {
  try {

    const response = await fetch(`${API_URL}/`, {
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    });

    if (!response.ok)
      throw new Error();

    alert("Backend Connected Successfully");

  } catch {

    alert("Backend Connection Failed");
  }
}
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <PageHeader
        title="Settings"
        description="Configure your TwinVerse Smart Campus Digital Twin."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* General */}
        <div className="card p-6">
          <h2 className="text-xl font-bold mb-4">General</h2>

          <div className="space-y-4">

            <div>
              <label className="block mb-1 font-medium">System Name</label>

              <input
                type="text"
                value={settings.systemName}
                onChange={(e) =>
                  setSettings({ ...settings, systemName: e.target.value })
                }
                className="w-full rounded-lg border border-gray-700 bg-gray-900 p-2"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Campus Name</label>

              <input
                type="text"
                value={settings.campusName}
                onChange={(e) =>
                  setSettings({ ...settings, campusName: e.target.value })
                }
                className="w-full rounded-lg border border-gray-700 bg-gray-900 p-2"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Building</label>

              <input
                type="text"
                value={settings.building}
                onChange={(e) =>
                  setSettings({ ...settings, building: e.target.value })
                }
                className="w-full rounded-lg border border-gray-700 bg-gray-900 p-2"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Seminar Hall</label>

              <input
                type="text"
                value={settings.seminarHall}
                onChange={(e) =>
                  setSettings({ ...settings, seminarHall: e.target.value })
                }
                className="w-full rounded-lg border border-gray-700 bg-gray-900 p-2"
              />
            </div>

          </div>
        </div>

        {/* Backend */}
        <div className="card p-6">
          <h2 className="text-xl font-bold mb-4">Backend</h2>

          <div className="space-y-2">
            <p><strong>Status:</strong> 🟢 Connected</p>
            <p><strong>API URL:</strong></p>
            {/* Changed: replaced the hardcoded API URL with the Vite environment variable. */}
            <p className="text-sm break-all text-blue-400">
              {import.meta.env.VITE_API_URL}
            </p>

            <p><strong>Last Sync:</strong> Just Now</p>

            <button
  onClick={testConnection}
  className="mt-4 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700"
>
  Test Connection
</button>
          </div>
        </div>

        {/* Auto Refresh */}
        <div className="card p-6">
          <h2 className="text-xl font-bold mb-4">Auto Refresh</h2>

          <div className="space-y-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.liveUpdates}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    liveUpdates: e.target.checked,
                  })
                }
              />
              Enable Live Updates
            </label>

            <div>
              <label className="block mb-2 font-medium">
                Refresh Rate
              </label>

              <select
                value={settings.refreshRate}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    refreshRate: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-gray-700 bg-gray-900 p-2"
              >
                <option value="5">5 Seconds</option>
                <option value="10">10 Seconds</option>
                <option value="30">30 Seconds</option>
                <option value="60">1 Minute</option>
              </select>
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className="card p-6">
          <h2 className="text-xl font-bold mb-4">Alerts</h2>

          {/* Changed: kept only the editable alert inputs and removed the duplicate static text and extra checkbox. */}
          <div className="space-y-4">

            <div>
              <label>Temperature Threshold</label>

              <input
                type="number"
                value={settings.temperatureThreshold}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    temperatureThreshold: Number(e.target.value)
                  })
                }
                className="w-full rounded-lg border border-gray-700 bg-gray-900 p-2"
              />
            </div>

            <div>
              <label>Humidity Threshold</label>

              <input
                type="number"
                value={settings.humidityThreshold}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    humidityThreshold: Number(e.target.value)
                  })
                }
                className="w-full rounded-lg border border-gray-700 bg-gray-900 p-2"
              />
            </div>

            <div>
              <label>Occupancy Limit</label>

              <input
                type="number"
                value={settings.occupancyLimit}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    occupancyLimit: Number(e.target.value)
                  })
                }
                className="w-full rounded-lg border border-gray-700 bg-gray-900 p-2"
              />
            </div>

            <div>
              <label>IAQ Threshold</label>

              <input
                type="number"
                value={settings.iaqThreshold}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    iaqThreshold: Number(e.target.value)
                  })
                }
                className="w-full rounded-lg border border-gray-700 bg-gray-900 p-2"
              />
            </div>

            <label className="flex items-center gap-3">

              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    notifications: e.target.checked
                  })
                }
              />

              Enable Notifications

            </label>

          </div>
        </div>

        {/* Digital Twin */}
        <div className="card p-6">
          <h2 className="text-xl font-bold mb-4">Digital Twin</h2>

          {/* Changed: each Digital Twin toggle now updates its own state property. */}
          <div className="space-y-3">

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.occupancyOverlay}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    occupancyOverlay: e.target.checked
                  })
                }
              />
              Occupancy Overlay
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.seatLabels}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    seatLabels: e.target.checked
                  })
                }
              />
              Seat Labels
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.temperatureHeatmap}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    temperatureHeatmap: e.target.checked
                  })
                }
              />
              Temperature Heatmap
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.cameraAnimation}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    cameraAnimation: e.target.checked
                  })
                }
              />
              Camera Animation
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.deviceStatus}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    deviceStatus: e.target.checked
                  })
                }
              />
              Device Status
            </label>

          </div>
        </div>

        {/* Theme */}
        <div className="card p-6">
          <h2 className="text-xl font-bold mb-4">Theme</h2>

          <div className="space-y-3">

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.darkMode}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    darkMode: e.target.checked,
                  })
                }
              />
              Dark Mode
            </label>

            <div>

              <label className="block mb-2 font-medium">
                Accent Color

              </label>

              <select
                value={settings.accentColor}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    accentColor: e.target.value
                  })
                }
                className="w-full rounded-lg border border-gray-700 bg-gray-900 p-2"
              >

                <option>Blue</option>
                <option>Green</option>
                <option>Purple</option>

              </select>

            </div>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.compactMode}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    compactMode: e.target.checked,
                  })
                }
              />
              Compact Mode
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.animations}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    animations: e.target.checked,
                  })
                }
              />
              Animations
            </label>

          </div>
        </div>

        {/* User */}
        <div className="card p-6">
          <h2 className="text-xl font-bold mb-4">User</h2>

          <div className="space-y-2">
            <p><strong>Admin:</strong> Harini</p>
            <p><strong>Email:</strong> harini@twinverse.com</p>
            <p><strong>Role:</strong> Project Admin</p>
          </div>
        </div>

        {/* System Information */}
        <div className="card p-6">
          <h2 className="text-xl font-bold mb-4">System Information</h2>

          <div className="space-y-2">
            <p>Backend : FastAPI</p>
            <p>Firebase : Connected</p>
            <p>YOLOv8 : Active</p>
            <p>Open-Meteo : Connected</p>
            <p>Version : 1.0.0</p>
            <p>Last Updated : Today</p>
          </div>
        </div>

        {/* Data Management */}
        <div className="card p-6">
          <h2 className="text-xl font-bold mb-4">Data Management</h2>

          <div className="grid grid-cols-2 gap-3">

            <button className="rounded-lg bg-blue-600 py-2 hover:bg-blue-700">
              Download CSV
            </button>

            <button className="rounded-lg bg-green-600 py-2 hover:bg-green-700">
              Export Logs
            </button>

            <button className="rounded-lg bg-yellow-600 py-2 hover:bg-yellow-700">
              Reset Dashboard
            </button>

            <button className="rounded-lg bg-red-600 py-2 hover:bg-red-700">
              Clear Cache
            </button>

          </div>
        </div>

        {/* About */}
        <div className="card p-6">
          <h2 className="text-xl font-bold mb-4">About</h2>

          <div className="space-y-2">
            <p><strong>Project:</strong> TwinVerse</p>
            <p><strong>Type:</strong> Smart Campus Digital Twin</p>
            <p><strong>Guide:</strong> Dr. Manjunath T N</p>
            <p><strong>Backend:</strong> FastAPI + Firebase</p>
            <p><strong>Computer Vision:</strong> YOLOv8</p>
            <p><strong>Weather API:</strong> Open-Meteo</p>
            <p>
              <strong>GitHub:</strong>{" "}
              <a
                href="https://github.com/aymanzaara-tech/TwinVerse-Smart-Campus-Digital-Twin.git"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                TwinVerse-Smart-Campus-Digital-Twin
              </a>
            </p>
          </div>
        </div>

      </div>
      <div className="flex justify-end">

  <button
    onClick={saveSettings}
    className="bg-green-600 hover:bg-green-700 px-8 py-3 rounded-lg font-semibold"
  >
    Save Settings
  </button>

</div>
    </motion.div>
  );
}