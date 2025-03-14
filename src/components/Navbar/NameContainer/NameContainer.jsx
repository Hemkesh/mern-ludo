import React from 'react';
import PropTypes from 'prop-types';
import AnimatedOverlay from './AnimatedOverlay/AnimatedOverlay';
import styles from './NameContainer.module.css';

const NameContainer = ({ player, time }) => {
  return (
    <div className={styles.containerWrapper}>
      <div className={styles.container}>
        <div className={styles.playerInfo} style={{ color: 'white' }}>
          {player.avatar && (
            <img 
              src={player.avatar} 
              alt={`${player.name}'s avatar`} 
              className={styles.avatar}
            />
          )}
          <p className={styles.playerName}>{player.name}</p>
        </div>
        {player.nowMoving ? <AnimatedOverlay time={time} /> : null}
      </div>
    </div>
  );
};

NameContainer.propTypes = {
  player: PropTypes.object,
  time: PropTypes.number,
  testId: PropTypes.string,
};

export default NameContainer;
