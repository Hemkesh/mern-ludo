import React from 'react';
import Dice from './Dice/Dice';
import NameContainer from './NameContainer/NameContainer';
import { PLAYER_COLORS } from '../../constants/colors';
import styles from './Navbar.module.css';

const Navbar = ({ players, started, time, isReady, rolledNumber, nowMoving, movingPlayer, ended }) => {
    return (
        <div className={styles.navbarContainer}>
            {players.map((player, index) => (
                <div 
                    className={`${styles.playerContainer} ${styles[PLAYER_COLORS[index]]} ${PLAYER_COLORS[index] === movingPlayer && started ? styles.activePlayer : ''}`} 
                    key={index}
                >
                    <div className={styles.playerContent}>
                        <NameContainer player={player} time={time} />
                        {started && !ended ? <Dice playerColor={PLAYER_COLORS[index]} rolledNumber={rolledNumber} nowMoving={nowMoving} movingPlayer={movingPlayer} /> : null}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Navbar;
