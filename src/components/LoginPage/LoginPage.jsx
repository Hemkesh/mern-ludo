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
            <div className={styles.logoContainer}>
                <img src={logoImage} alt="Hemkesh Ludo" className={styles.logo} />
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
