import React, { useContext } from 'react';
import { SocketContext } from '../../../App';
import images from '../../../constants/diceImages';
import styles from './Dice.module.css';

const Dice = ({ rolledNumber, nowMoving, playerColor, movingPlayer }) => {
    const socket = useContext(SocketContext);

    const handleClick = () => {
        socket.emit('game:roll');
    };

    const isCurrentPlayer = movingPlayer === playerColor;
    const hasRolledNumber = rolledNumber !== null && rolledNumber !== undefined;

    if (!isCurrentPlayer) {
        return null;
    }

    // Determine position class based on player color
    const positionClass = styles[playerColor] || '';

    return (
        <div className={`${styles.container} ${positionClass}`}>
            {hasRolledNumber ? (
                <img 
                    src={images[rolledNumber - 1]} 
                    alt={rolledNumber} 
                    className={styles.diceImage}
                />
            ) : nowMoving ? (
                <img 
                    src={images[6]} 
                    className={`${styles.diceImage} ${styles.rollDice}`} 
                    alt='roll' 
                    onClick={handleClick} 
                />
            ) : null}
        </div>
    );
};

export default Dice;
