import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LogCard from '../components/LogCard';

const API_BASE = 'http://localhost:8000/api';

const Dashboard = () => {
  const [logs, setLogs] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [recentlyResponded, setRecentlyResponded] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchLogs = async () => {
    try {
      const res = await axios.get(`${API_BASE}/logs/`);
      setLogs(res.data);
    } catch (error) {
      console.error("Failed to fetch logs", error);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleResponse = (id) => {
    setRecentlyResponded((prev) => [...prev, id]);
    setTimeout(() => {
      setRecentlyResponded((prev) => prev.filter((logId) => logId !== id));
    }, 3000);
    fetchLogs();
  };

  // Filtering logic
  const filteredLogs = logs.filter((log) => {
    const matchesLevel =
      selectedLevel === "All" || log.threat_level === selectedLevel;

    const matchesSearch =
      log.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.source_ip.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesLevel && matchesSearch;
  });

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-center">Cyber Threat Logs</h2>

      {/* Search bar */}
      <div className="mb-3 d-flex justify-content-center">
        <input
          type="text"
          placeholder="Search by IP or content..."
          className="form-control w-50"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Filter buttons */}
      <div className="mb-4 d-flex flex-wrap gap-2 justify-content-center">
        {["All", "Low", "Medium", "High", "Critical"].map((level) => (
          <button
            key={level}
            className={`btn btn-sm ${
              selectedLevel === level ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setSelectedLevel(level)}
          >
            {level}
          </button>
        ))}
      </div>

      {/* Log cards */}
      <div className="row">
        {filteredLogs.map((log) => (
          <div className="col-md-6 col-lg-4 mb-3" key={log.id}>
            <LogCard
              log={log}
              onResponseTriggered={() => handleResponse(log.id)}
              highlight={recentlyResponded.includes(log.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
