import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App/App';
import Dlt from './Dlt/Dlt';
import Mouse from './Mouse/Mouse';

function RouteIndex() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App/>} />
        <Route path="/dlt" element={<Dlt/>} />
        <Route path="/mouse" element={<Mouse/>} />
      </Routes>
    </Router>
  );
}

export default RouteIndex