import React, { useRef } from "react";
import { useCookies } from "react-cookie";

import Login from "./Components/Login";
import AppBar from "./Components/AppBar";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  const [cookies, setCookies] = useCookies(["sessionName"]);

  const routerRef = useRef(null);
  if (cookies["sessionName"]) {
    return (
      <Router ref={routerRef}>
        <AppBar />
      </Router>
    );
  } else {
    return (
      <Router>
        <Switch>
          <Route exact path="/">
            <Login />
          </Route>
        </Switch>
      </Router>
    );
  }
}

export default App;
