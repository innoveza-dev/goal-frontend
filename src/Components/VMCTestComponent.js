import React, { useState } from 'react';
import axios from 'axios';

const VMCTestComponent = () => {
  const [testResult, setTestResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setTestResult('Testing connection...');
    
    try {
      const token = localStorage.getItem('token');
      
      // Test 1: Check if backend is accessible
      const response = await axios.get('http://localhost:5000/api/vmc', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      setTestResult(`✅ Backend connection successful!\nData received: ${JSON.stringify(response.data, null, 2)}`);
    } catch (error) {
      setTestResult(`❌ Backend connection failed!\nError: ${error.message}\nDetails: ${JSON.stringify(error.response?.data || 'No response data', null, 2)}`);
    }
    
    setLoading(false);
  };

  const testSubmission = async () => {
    setLoading(true);
    setTestResult('Testing submission...');
    
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      // Test data
      const testData = {
        vmcSets: [
          {
            vision: [{ description: 'Test Vision Description' }],
            mission: [{ description: 'Test Mission Description' }],
            core: [{ title: 'Test Core Value' }]
          }
        ]
      };
      
      formData.append('data', JSON.stringify(testData));
      
      console.log('Sending test data:', testData);
      
      const response = await axios.post('http://localhost:5000/api/vmc/vision', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setTestResult(`✅ Submission successful!\nResponse: ${JSON.stringify(response.data, null, 2)}`);
    } catch (error) {
      setTestResult(`❌ Submission failed!\nError: ${error.message}\nDetails: ${JSON.stringify(error.response?.data || 'No response data', null, 2)}`);
    }
    
    setLoading(false);
  };

  return (
    <div className="card p-4 m-4">
      <h3>VMC Debug Test Component</h3>
      <div className="d-flex gap-2 mb-3">
        <button 
          className="btn btn-primary" 
          onClick={testConnection}
          disabled={loading}
        >
          Test Backend Connection
        </button>
        <button 
          className="btn btn-success" 
          onClick={testSubmission}
          disabled={loading}
        >
          Test Data Submission
        </button>
      </div>
      
      {loading && <div className="text-primary">Loading...</div>}
      
      {testResult && (
        <div className="mt-3">
          <h5>Test Result:</h5>
          <pre style={{ 
            background: '#f8f9fa', 
            padding: '1rem', 
            borderRadius: '4px',
            whiteSpace: 'pre-wrap',
            maxHeight: '400px',
            overflow: 'auto'
          }}>
            {testResult}
          </pre>
        </div>
      )}
    </div>
  );
};

export default VMCTestComponent;
