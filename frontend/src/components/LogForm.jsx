// src/components/LogForm.jsx
import React, { useState } from 'react';
import { Form, Button, Card, Spinner } from 'react-bootstrap';
import LogService from '../services/LogService';
import { useToast } from '../context/ToastContext';

const LogForm = ({ onLogCreated }) => {
  const [formData, setFormData] = useState({
    sourceIp: '',
    content: ''
  });
  const [loading, setLoading] = useState(false);
  const showToast = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await LogService.createLog(formData.sourceIp, formData.content);
      showToast('Log entry created successfully', 'success');
      setFormData({ sourceIp: '', content: '' });
      if (onLogCreated) {
        onLogCreated();
      }
    } catch (error) {
      showToast('Failed to create log: ' + (error.response?.data?.detail || 'Unknown error'), 'danger');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Header className="bg-primary text-white">New Log Entry</Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Source IP</Form.Label>
            <Form.Control
              type="text"
              name="sourceIp"
              placeholder="e.g., 192.168.1.1"
              value={formData.sourceIp}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Log Content</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="content"
              placeholder="Enter log content here..."
              value={formData.content}
              onChange={handleChange}
              required
            />
            <Form.Text className="text-muted">
              Include key information about the event for threat analysis.
            </Form.Text>
          </Form.Group>

          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? <><Spinner animation="border" size="sm" /> Creating...</> : 'Submit Log'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default LogForm;