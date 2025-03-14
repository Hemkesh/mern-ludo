import React, { useState, useEffect, useContext } from 'react';
import ReactLoading from 'react-loading';
import { PlayerDataContext, SocketContext } from '../../App';
import useSocketData from '../../hooks/useSocketData';
import Map from './Map/Map';
import Navbar from '../Navbar/Navbar';
import Overlay from '../Overlay/Overlay';
import GameHeader from './GameHeader/GameHeader';
import styles from './Gameboard.module.css';
import trophyImage from '../../images/trophy.webp';

const Gameboard = () => {
    const socket = useContext(SocketContext);
    const context = useContext(PlayerDataContext);
    const [pawns, setPawns] = useState([]);
    const [players, setPlayers] = useState([]);
    const [roomName, setRoomName] = useState('Lone-Shark');

    const [rolledNumber, setRolledNumber] = useSocketData('game:roll');
    const [time, setTime] = useState();
    const [isReady, setIsReady] = useState();
    const [nowMoving, setNowMoving] = useState(false);
    const [started, setStarted] = useState(false);

    const [movingPlayer, setMovingPlayer] = useState('red');

    const [winner, setWinner] = useState(null);

    useEffect(() => {
        socket.emit('room:data', context.roomId);
        socket.on('room:data', data => {
            data = JSON.parse(data);
            if (data.players == null) return;
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
                    setNowMoving(false);
                }
                setMovingPlayer(nowMovingPlayer.color);
            }
            const currentPlayer = data.players.find(player => player._id === context.playerId);
            setIsReady(currentPlayer.ready);
            setRolledNumber(data.rolledNumber);
            setPlayers(data.players);
            setPawns(data.pawns);
            setTime(data.nextMoveTime);
            setStarted(data.started);
            
            // If room has a custom name, update it
            if (data.name) {
                setRoomName(data.name + ' / ' + data.password);
            }
        });

        socket.on('game:winner', winner => {
            setWinner(winner);
        });
        socket.on('redirect', () => {
            window.location.reload();
        });

    }, [socket, context.playerId, context.roomId, setRolledNumber]);

    return (
        <>
            {pawns.length === 16 ? (
                <div className={styles.gameContainer}>
                    <GameHeader isReady={isReady} started={started} roomName={roomName} />
                    <div style={{ height: '20px' }}></div>
                    <div className={styles.gameboardLayout}>
                        <Navbar
                            players={players}
                            started={started}
                            time={time}
                            isReady={isReady}
                            movingPlayer={movingPlayer}
                            rolledNumber={rolledNumber}
                            nowMoving={nowMoving}
                            ended={winner !== null}
                        />
                        <div className={styles.mapContainer}>
                            <Map 
                                pawns={pawns} 
                                nowMoving={nowMoving} 
                                rolledNumber={rolledNumber} 
                                className={styles.gameMap}
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <div className={styles.gameContainer}>
                    <div className={styles.loadingContainer}>
                        <ReactLoading type='spinningBubbles' color='white' height={100} width={100} />
                    </div>
                </div>
            )}
            {winner ? (
                <Overlay>
                    <div className={styles.winnerContainer}>
                        <img src={trophyImage} alt='winner' />
                        <h1>
                            1st: <span style={{ color: winner }}>{winner}</span>
                        </h1>
                        <button onClick={() => socket.emit('player:exit')}>Play again</button>
                    </div>
                </Overlay>
            ) : null}
        </>
    );
};

export default Gameboard;
