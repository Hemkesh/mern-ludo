import React, { useEffect, useState, createContext } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { Beforeunload } from "react-beforeunload";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

import Gameboard from "./components/Gameboard";
import NameInput from "./components/NameInput";

export const PlayerDataContext = createContext();

function App() {
  const [playerData, setPlayerData] = useState();
  const [redirect, setRedirect] = useState();

  useEffect(() => {
    const socket = io("http://localhost:5000", { withCredentials: true });
    socket.on("client data", (data) => {
      data = JSON.parse(data);
      setPlayerData(data);
      data.roomId != null ? setRedirect(true) : setRedirect(false);
    });
  }, []);

  const handleExit = (e) => {
    e.preventDefault();
    window.addEventListener("unload", () => {
      axios.post("/player/exit", { withCredentials: true });
    });
  };

  const idCallback = () => {
    axios
      .get("/player/", {
        withCredentials: true,
      })
      .then((response) => {
        setPlayerData(response.data);
        console.log(response.data);
        setRedirect(true);
      });
  };

  return (
    <Router>
      {redirect ? <Redirect to="/game" /> : <Redirect to="/login" />}
      <Switch>
        <Route exact path="/">
          LOADING...
        </Route>
        <Route path="/login">
          <NameInput idCallback={idCallback} />
        </Route>
        <Route path="/game">
          {playerData ? (
            <Beforeunload onBeforeunload={handleExit}>
              <PlayerDataContext.Provider value={playerData}>
                <Gameboard />
              </PlayerDataContext.Provider>
            </Beforeunload>
          ) : null}
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
