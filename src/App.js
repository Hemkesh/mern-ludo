import React, { useEffect, useState, createContext } from 'react';
import { io } from 'socket.io-client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ReactLoading from 'react-loading';
import Gameboard from './components/Gameboard/Gameboard';
import LoginPage from './components/LoginPage/LoginPage';

export const PlayerDataContext = createContext();
export const SocketContext = createContext();

function App() {
    const [playerData, setPlayerData] = useState();
    const [playerSocket, setPlayerSocket] = useState();
    const [redirect, setRedirect] = useState();
    useEffect(() => {
        // Use the same protocol (http or https) as the current page
        // and don't specify the port in production
        const socketUrl = process.env.NODE_ENV === 'production' 
            ? `${window.location.protocol}//${window.location.host}`
            : `${window.location.protocol}//${window.location.hostname}:8080`;
            
        const socket = io(socketUrl, { withCredentials: true });
        socket.on('player:data', data => {
            data = JSON.parse(data);
            setPlayerData(data);
            if (data.roomId != null) {
                setRedirect(true);
            }
        });
        setPlayerSocket(socket);
    }, []);

    return (
        <SocketContext.Provider value={playerSocket}>
            <Router>
                <Routes>
                    <Route
                        exact
                        path='/'
                        element={() => {
                            if (redirect) {
                                return <Navigate to='/game' />;
                            } else if (playerSocket) {
                                return <LoginPage />;
                            } else {
                                return <ReactLoading type='spinningBubbles' color='white' height={667} width={375} />;
                            }
                        }}
                    ></Route>
                    <Route
                        path='/login'
                        element={() => {
                            if (redirect) {
                                return <Navigate to='/game' />;
                            } else if (playerSocket) {
                                return <LoginPage />;
                            } else {
                                return <ReactLoading type='spinningBubbles' color='white' height={667} width={375} />;
                            }
                        }}
                    ></Route>
                    <Route
                        path='/game'
                        element={() => {
                            if (playerData) {
                                return (
                                    <PlayerDataContext.Provider value={playerData}>
                                        <Gameboard />
                                    </PlayerDataContext.Provider>
                                );
                            } else {
                                return <Navigate to='/login' />;
                            }
                        }}
                    ></Route>
                </Routes>
            </Router>
        </SocketContext.Provider>
    );
}

export default App;
