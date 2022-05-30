import React, { useState, useEffect, useContext, useCallback } from 'react';
import { PlayerDataContext, SocketContext } from '../App';
import axios from 'axios';
import Map from './game-board-components/Map';
import Dice from './game-board-components/Dice';
import Navbar from './Navbar';

const Gameboard = () => {
    // Context data
    const socket = useContext(SocketContext);
    const context = useContext(PlayerDataContext);
    // Render data
    const [pawns, setPawns] = useState([]);
    const [players, setPlayers] = useState([]);
    // Game logic data
    const [rolledNumber, setRolledNumber] = useState(null);
    const [time, setTime] = useState();
    const [nowMoving, setNowMoving] = useState(false);
    const [started, setStarted] = useState(false);

    const checkWin = useCallback(() => {
        // Player wins when all pawns with same color are inside end base
        if (pawns.filter(pawn => pawn.color === 'red' && pawn.position === 73).length === 4) {
            alert('Red Won');
        } else if (pawns.filter(pawn => pawn.color === 'blue' && pawn.position === 79).length === 4) {
            alert('Blue Won');
        } else if (pawns.filter(pawn => pawn.color === 'green' && pawn.position === 85).length === 4) {
            alert('Green Won');
        } else if (pawns.filter(pawn => pawn.color === 'yellow' && pawn.position === 91).length === 4) {
            alert('Yellow Won');
        }
    }, [pawns]);
    // Fetching game data
    const fetchData = useCallback(() => {
        socket.emit('room:data');
    }, []);

    useEffect(() => {
        socket.on('room:data', data => {
            data = JSON.parse(data);
            // Filling navbar with empty player nick container
            while (data.players.length !== 4) {
                data.players.push({ name: '...' });
            }
            // Checks if client is currently moving player by session ID
            const nowMovingPlayer = data.players.find(player => player.nowMoving === true);
            if (nowMovingPlayer) {
                if (nowMovingPlayer._id === context.playerId) {
                    setNowMoving(true);
                } else {
                    setRolledNumber(null);
                    setNowMoving(false);
                }
            }
            checkWin();
            setPlayers(data.players);
            setPawns(data.pawns);
            setTime(data.nextMoveTime);
            setStarted(data.started);
        });
        //sending ajax every 1 sec
        const interval = setInterval(fetchData, 1000);
        return () => clearInterval(interval);
    }, [fetchData]);
    // Callback to handle dice rolling between dice and map component
    const rolledNumberCallback = number => {
        setRolledNumber(number);
    };

    return (
        <>
            <Navbar players={players} started={started} time={time} />
            {nowMoving ? <Dice nowMoving={nowMoving} rolledNumberCallback={rolledNumberCallback} /> : null}
            <Map pawns={pawns} nowMoving={nowMoving} rolledNumber={rolledNumber} />
        </>
    );
};

export default Gameboard;
