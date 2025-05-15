// src/pages/Dashboard.jsx - Updated
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Spinner, Alert, Form } from 'react-bootstrap';
import LogCard from '../components/LogCard';
import LogForm from '../components/LogForm';
import LogService from '../services/LogService';
import Navigation from '../components/Navigation';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [logs, setLogs] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [recentlyResponded, setRecentlyResponded] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLogForm, setShowLogForm] = useState(false);
  const { isLoggedIn } = useAuth();

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await LogService.getLogs(selectedLevel, searchTerm);
      setLogs(response.data.results || response.data); // Handle both paginated and non-paginated response
    } catch (error) {
      console.error("Failed to fetch logs", error);
      setError('Failed to load logs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchLogs();
    }
  }, [selectedLevel, searchTerm, isLoggedIn]);

  const handleResponse = (id) => {
    setRecentlyResponded((prev) => [...prev, id]);
    setTimeout(() => {
      setRecentlyResponded((prev) => prev.filter((logId) => logId !== id));
    }, 3000);
    fetchLogs();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchLogs();
  };

  // This function is no longer needed as we're filtering directly via the API
  const filteredLogs = logs;

  return (
    <>
      <Navigation />
      <Container className="py-4">
        <h2 className="mb-4 text-center">Cyber Threat Logs</h2>
        
        {/* Action buttons */}
        <div className="d-flex justify-content-end mb-4">
          <Button 
            variant={showLogForm ? "secondary" : "success"} 
            onClick={() => setShowLogForm(!showLogForm)}
          >
            {showLogForm ? "Hide Log Form" : "Add New Log"}
          </Button>
        </div>
        
        {/* Log form (collapsible) */}
        {showLogForm && (
          <LogForm onLogCreated={() => {
            fetchLogs();
            setShowLogForm(false);
          }} />
        )}

        {/* Search and filter form */}
        <Form onSubmit={handleSearch} className="mb-4">
          <Row className="align-items-end">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Search</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Search by IP or content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Threat Level</Form.Label>
                <Form.Select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                >
                  <option value="All">All Levels</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={2}>
              <Button type="submit" variant="primary" className="w-100">
                Filter
              </Button>
            </Col>
          </Row>
        </Form>

        {/* Error message */}
        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        )}

        {/* Loading indicator */}
        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : (
          <>
            {/* No results message */}
            {filteredLogs.length === 0 ? (
              <Alert variant="info">
                No logs found matching your criteria. Try adjusting your filters.
              </Alert>
            ) : (
              /* Log cards */
              <Row>
                {filteredLogs.map((log) => (
                  <Col md={6} lg={4} className="mb-3" key={log.id}>
                    <LogCard
                      log={log}
                      onResponseTriggered={() => handleResponse(log.id)}
                      highlight={recentlyResponded.includes(log.id)}
                    />
                  </Col>
                ))}
              </Row>
            )}
          </>
        )}
      </Container>
    </>
  );
};

export default Dashboard;