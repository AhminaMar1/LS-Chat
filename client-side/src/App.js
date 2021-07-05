import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Admin from './mainComponents/admin/Admin';
import Client from './mainComponents/client/Client';
import './styles/App.css';

function App() {

  return (
    <div className="App">
      <Router>
      <div>
        <Switch>
          <Route path="/admin">
            <Admin/>
          </Route>
          <Route path="/">
            <Client />
          </Route>
        </Switch>
      </div>
    </Router>
    </div>
  );
}

export default App;
