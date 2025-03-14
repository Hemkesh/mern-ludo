import React, { useContext } from 'react';
import { PlayerDataContext, SocketContext } from '../../../App';
import styles from './GameHeader.module.css';

const GameHeader = ({ isReady, started, roomName }) => {
    const context = useContext(PlayerDataContext);
    const socket = useContext(SocketContext);

    const handleReadyClick = () => {
        socket.emit('player:ready');
    };

    const handleLeaveGame = () => {
        socket.emit('player:exit');
    };

    return (
        <div className={styles.headerContainer}>
            <div className={styles.gameInfo}>
                <h2 className={styles.gameTitle}>Game: {roomName || context.roomId}</h2>
            </div>
            <div className={styles.actionButtons}>
                {!started && (
                    isReady ? (
                        <div className={styles.readyStatus}>
                            <span className={styles.checkmark}>✓</span> Ready
                        </div>
                    ) : (
                        <button 
                            className={styles.playButton} 
                            onClick={handleReadyClick}
                        >
                            Play
                        </button>
                    )
                )}
                <button 
                    className={styles.leaveButton}
                    onClick={handleLeaveGame}
                    title="Leave Game"
                >
                    Leave
                </button>
            </div>
        </div>
    );
};

export default GameHeader;
