import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import logo from './logo.svg';
import HomePage from './pages/HomePage';
import { useContext, Fragment } from 'react';
import { AppContext } from './context/app.context';
import './App.css';
import AppLayout from './layouts/App.layout';
import UnauthHomePage from './pages/UnauthHomePage';

function App() {

  const context = useContext(AppContext);
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={context.token ? <HomePage /> : <UnauthHomePage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
