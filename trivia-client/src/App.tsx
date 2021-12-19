import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import logo from './logo.svg';
import HomePage from './pages/HomePage';
import { useContext, Fragment } from 'react';
import { AppContext } from './context/app.context';
import './App.css';

function App() {

  const context = useContext(AppContext);
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App/>}>
          <Routes>
            <Route path="/">
              <Fragment>
                <div>App-&gt;Default</div>
              </Fragment>
            </Route>
            <Route path="signup">
              <Fragment>
                <div>Sign Up</div>
              </Fragment>
            </Route>
          </Routes>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
