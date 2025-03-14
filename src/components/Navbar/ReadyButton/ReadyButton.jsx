import React, { useContext } from 'react';
import { SocketContext } from '../../../App';
import styles from './ReadyButton.module.css';

const ReadyButton = ({ isReady }) => {
    const socket = useContext(SocketContext);

    const handleReadyClick = () => {
        socket.emit('player:ready');
    };
    
    return (
        <div className={styles.container}>
            {isReady ? (
                <div className={styles.readyStatus}>
                    <span className={styles.checkmark}>✓</span>
                </div>
            ) : (
                <button 
                    className={styles.readyButton} 
                    onClick={handleReadyClick}
                >
                    Play
                </button>
            )}
        </div>
    );
};

export default ReadyButton;
