import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import AnimatedOverlay from './AnimatedOverlay/AnimatedOverlay';
import { PlayerDataContext, SocketContext } from '../../../App';
import styles from './NameContainer.module.css';

const NameContainer = ({ player, time }) => {
    const context = useContext(PlayerDataContext);
    const socket = useContext(SocketContext);

    const handleLeaveGame = () => {
        console.log('Leave game button clicked');
        socket.emit('player:exit');
        console.log('player:exit event emitted');
    };

    return (
        <div className={styles.containerWrapper}>
            <div className={styles.container} style={{ backgroundColor: player.ready ? player.color : 'lightgrey' }}>
                <div className={styles.playerInfo}>
                    {player.avatar && (
                        <img 
                            src={player.avatar} 
                            alt={`${player.name}'s avatar`} 
                            className={styles.avatar}
                        />
                    )}
                    <p>{player.name}</p>
                </div>
                {player.nowMoving ? <AnimatedOverlay time={time} /> : null}
            </div>
            {context && context.color === player.color ? 
                <button 
                    onClick={handleLeaveGame}
                    title="Leave Game"
                    className={styles.leaveButton}
                >
                    X
                </button> 
            : null}
        </div>
    );
};

NameContainer.propTypes = {
    player: PropTypes.object,
    time: PropTypes.number,
    testId: PropTypes.string,
};

export default NameContainer;
