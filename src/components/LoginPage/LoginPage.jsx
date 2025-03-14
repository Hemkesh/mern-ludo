import React, { useState } from 'react';
import AddServer from './AddServer/AddServer';
import JoinServer from './JoinServer/JoinServer';
import Overlay from '../Overlay/Overlay';
import logoImage from '../../images/logo.png';
import styles from './LoginPage.module.css';

const LoginPage = () => {
    const [showJoinPopup, setShowJoinPopup] = useState(false);

    const handleJoinGameClick = () => {
        setShowJoinPopup(true);
    };

    const handleCloseJoinPopup = () => {
        setShowJoinPopup(false);
    };

    return (
        <div className={styles.container}>
            {/* Animated background dots are created via CSS */}
            
            {/* Floating game pieces */}
            <div className={`${styles.gamePiece} ${styles.redPiece}`}></div>
            <div className={`${styles.gamePiece} ${styles.bluePiece}`}></div>
            <div className={`${styles.gamePiece} ${styles.yellowPiece}`}></div>
            <div className={`${styles.gamePiece} ${styles.greenPiece}`}></div>
            
            <div className={styles.logoContainer}>
                <img src={logoImage} alt="Hemkesh Ludo" className={styles.logo} />
            </div>
            
            <div className={styles.gameIntroText}>
                <h1>Welcome to Ludo!</h1>
                <p>The classic board game reimagined for online play</p>
            </div>
            
            <div className={styles.gameButtonsContainer}>
                <div className={styles.buttonWrapper}>
                    <AddServer />
                </div>
                <div className={styles.buttonWrapper}>
                    <button 
                        className={styles.joinButton} 
                        onClick={handleJoinGameClick}
                    >
                        Join a Game
                    </button>
                </div>
            </div>
            
            {showJoinPopup && (
                <Overlay handleOverlayClose={handleCloseJoinPopup}>
                    <JoinServer onClose={handleCloseJoinPopup} />
                </Overlay>
            )}
        </div>
    );
};

export default LoginPage;
