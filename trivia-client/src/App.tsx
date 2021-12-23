import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import logo from './logo.svg';
import HomePage from './pages/HomePage';
import { useContext, Fragment } from 'react';
import { AppContext } from './context/app.context';
import './App.css';
import AppLayout from './layouts/App.layout';
import { Login } from './pages/Login';
import CreateAccountPage from './pages/CreateAccountPage';
import GamesLayout from './layouts/Games.layout';
import GamesHistory from './pages/GamesHistory';
import Game from './pages/Game';

function App({username: pUsername, token: pToken}: {username: string | null, token: string | null}) {
  const [username, setUsername] = useState(pUsername);
  const [token, setToken] = useState(pToken);
  
  const context = {
    username, 
    token,
    setUsername,
    setToken
  };
  
  return (
    <AppContext.Provider value={context}>
      <Router>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={context.token ? <HomePage /> : <CreateAccountPage />} />
            <Route path="login" element={<Login />} />
            <Route path="games" element={<GamesLayout />}>
              <Route index element={<GamesHistory />} />
              <Route path=":gameId" element={<Game />} />
            </Route> 
          </Route>
        </Routes>
      </Router>
    </AppContext.Provider>

  );
}

export default App;
