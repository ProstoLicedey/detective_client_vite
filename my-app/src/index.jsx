import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import UserStore from "./store/userStore.js";
import {createContext} from 'react';
import ErrorBoundary from "./components/Error.jsx";
import {BrowserRouter} from "react-router-dom";
import TimerStore from "./store/timerStore.js";
import AdminStore from "./store/adminStore.js";
import QuestionStore from "./store/questionStore.js";

export const Context = createContext(null)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <Context.Provider value={{
          user: new UserStore(),
          timer: new TimerStore(),
          admin: new AdminStore(),
          question: new QuestionStore(),
      }}>
          <ErrorBoundary>
              <BrowserRouter>
          <App />
              </BrowserRouter>
          </ErrorBoundary>
      </Context.Provider>
  </React.StrictMode>
);

