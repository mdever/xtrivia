import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import { AppContext } from './context/app.context';
import './App.css';
import AppLayout from './layouts/App.layout';
import { Login } from './pages/Login';
import CreateAccountPage from './pages/CreateAccountPage';
import GamesLayout from './layouts/Games.layout';
import GamesHistory from './pages/GamesHistory';
import GameLayout from './layouts/Game.layout';
import NewGame from './pages/NewGame';
import GameSummary from './pages/GameSummary';
import QuestionLayout from './layouts/Question.layout';
import QuestionSummary from './pages/QuestionSummary';
import QuestionDetail from './pages/QuestionDetail';
import AnswerDetail from './pages/AnswerDetail';
import NewQuestion from './pages/NewQuestion';
import AnswersLayout from './layouts/Answers.layout';
import QuestionsLayout from './layouts/Questions.layout';
import { RecoilRoot } from 'recoil';
import NewAnswer from './pages/NewAnswer';
import AnswersSummary from './pages/AnswersSummary';
import HostRoom from './pages/HostRoom';
import PlayerRoom from './pages/PlayerRoom';

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
      <RecoilRoot>
        <Router>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={context.token ? <HomePage /> : <CreateAccountPage />} />
              <Route path="login" element={<Login />} />
              <Route path="games" element={<GamesLayout />}>
                <Route index element={<GamesHistory />} />
                <Route path="new" element={<NewGame />} />
                <Route path=":gameId" element={<GameLayout />}>
                  <Route index element={<GameSummary />} />
                  <Route path="questions" element={<QuestionsLayout />}>
                    <Route index element={<QuestionSummary />} />
                    <Route path="new" element={<NewQuestion />} />
                    <Route path=":questionId" element={<QuestionLayout />}>
                      <Route index element={<QuestionDetail />} />
                      <Route path="answers" element={<AnswersLayout />}>
                        <Route index element={<AnswersSummary />} />
                        <Route path="new" element={<NewAnswer />} />
                        <Route path=":answerId" element={<AnswerDetail />} />
                      </Route>
                    </Route>
                  </Route>
                </Route>
              </Route>
              <Route path="host/:roomCode" element={<HostRoom />} />
              <Route path="rooms/:roomCode" element={<PlayerRoom />} />
            </Route>
          </Routes>
        </Router>
      </RecoilRoot>
    </AppContext.Provider>

  );
}

export default App;
