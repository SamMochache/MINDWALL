import React, { useState } from 'react';
import axios from 'axios';
import { useToast } from '../context/ToastContext';

const badgeColor = {
  Low: 'success',
  Medium: 'warning',
  High: 'danger',
  Critical: 'dark',
};

const LogCard = ({ log, onResponseTriggered, highlight }) => {
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const showToast = useToast();

  const triggerResponse = async () => {
    setLoading(true);
    try {
      await axios.post(`http://localhost:8000/api/logs/${log.id}/respond/`);
      showToast("✅ Response triggered successfully", "success");
      onResponseTriggered();
    } catch (err) {
      showToast("❌ Failed to trigger response", "danger");
    }
    setLoading(false);
  };

  return (
    <div className={`card h-100 shadow-sm ${highlight ? "border border-3 border-success bg-light" : ""}`}>
      <div className="card-body d-flex flex-column justify-content-between">
        <div>
          <h5 className="card-title mb-1 d-flex justify-content-between align-items-center">
            <span>{log.source_ip}</span>
            <span className={`badge bg-${badgeColor[log.threat_level] || 'secondary'}`}>
              {log.threat_level}
            </span>
          </h5>
          <p className="mb-2"><small className="text-muted">{new Date(log.timestamp).toLocaleString()}</small></p>
          <p className="card-text">{log.content}</p>

          {/* Response history toggle */}
          {log.responses && log.responses.length > 0 && (
            <div className="mt-2">
              <button
                className="btn btn-sm btn-link text-decoration-none"
                onClick={() => setShowHistory(!showHistory)}
              >
                {showHistory ? "Hide" : "Show"} Response History ({log.responses.length})
              </button>

              {showHistory && (
                <ul className="list-group list-group-flush mt-2">
                  {log.responses.map((resp, idx) => (
                    <li className="list-group-item small" key={idx}>
                      <strong>{new Date(resp.timestamp).toLocaleString()}</strong> — <em>{resp.action}</em><br />
                      <span>{resp.notes || "No notes."}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <div className="mt-3 text-end">
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={triggerResponse}
            disabled={loading}
          >
            {loading ? "Responding..." : "Trigger Response"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogCard;
