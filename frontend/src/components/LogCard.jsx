import React, { useState } from 'react';
import { Badge, Button, Spinner } from 'react-bootstrap';
import LogService from '../services/LogService';
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
      // Use LogService instead of direct axios call
      await LogService.triggerResponse(log.id);
      showToast("✅ Response triggered successfully", "success");
      onResponseTriggered();
    } catch (err) {
      console.error("Response trigger error:", err);
      showToast(`❌ Failed to trigger response: ${err.response?.data?.detail || "Unknown error"}`, "danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`card h-100 shadow-sm ${highlight ? "border border-3 border-success bg-light" : ""}`}>
      <div className="card-body d-flex flex-column justify-content-between">
        <div>
          <h5 className="card-title mb-1 d-flex justify-content-between align-items-center">
            <span>{log.source_ip}</span>
            <Badge bg={badgeColor[log.threat_level] || 'secondary'}>
              {log.threat_level}
            </Badge>
          </h5>
          <p className="mb-2"><small className="text-muted">{new Date(log.timestamp).toLocaleString()}</small></p>
          <p className="card-text">{log.content}</p>

          {/* Response history toggle */}
          {log.responses && log.responses.length > 0 && (
            <div className="mt-2">
              <Button
                variant="link"
                size="sm"
                className="text-decoration-none p-0"
                onClick={() => setShowHistory(!showHistory)}
              >
                {showHistory ? "Hide" : "Show"} Response History ({log.responses.length})
              </Button>

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
          <Button
            variant="outline-primary"
            size="sm"
            onClick={triggerResponse}
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-1" />
                <span>Responding...</span>
              </>
            ) : "Trigger Response"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LogCard;