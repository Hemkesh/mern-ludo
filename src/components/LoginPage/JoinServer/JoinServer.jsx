import React, { useContext, useEffect, useState } from 'react';
import { SocketContext } from '../../../App';
import refresh from '../../../images/login-page/refresh.png';
import NameInput from '../NameInput/NameInput';
import Overlay from '../../Overlay/Overlay';
import ServersTable from './ServersTable/ServersTable';
import withLoading from '../../HOC/withLoading';
import useSocketData from '../../../hooks/useSocketData';
import styles from './JoinServer.module.css';

const JoinServer = ({ onClose }) => {
    const socket = useContext(SocketContext);
    const [rooms, setRooms] = useSocketData('room:rooms');

    const [joining, setJoining] = useState(false);
    const [clickedRoom, setClickedRoom] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        socket.emit('room:rooms');
        socket.on('room:rooms', () => {
            setIsLoading(false);
        });
    }, [socket]);

    const getRooms = () => {
        setRooms([]);
        socket.emit('room:rooms');
    };

    const handleJoinClick = room => {
        setClickedRoom(room);
        setJoining(true);
    };

    const handleJoinComplete = () => {
        if (onClose) {
            onClose();
        }
    };

    const handleClose = () => {
        if (onClose) {
            onClose();
        }
    };

    const ServersTableWithLoading = withLoading(ServersTable);

    return (
        <div className={styles.joinServerPopup}>
            <div className={styles.joinServerHeader}>
                <h2>Join A Game</h2>
                <button className={styles.closeButton} onClick={handleClose}>×</button>
            </div>
            
            <div className={styles.joinServerContent}>
                <div className={styles.refreshContainer}>
                    <button className={styles.refreshButton} onClick={getRooms}>
                        <img src={refresh} alt='refresh' />
                        Refresh Games
                    </button>
                </div>
                
                <div className={styles.serversTableContainer}>
                    <ServersTableWithLoading
                        isLoading={isLoading}
                        rooms={rooms}
                        handleJoinClick={handleJoinClick}
                    />
                </div>
            </div>
            
            {joining ? (
                <Overlay handleOverlayClose={() => setJoining(false)}>
                    <NameInput 
                        roomId={clickedRoom._id} 
                        isRoomPrivate={clickedRoom.private} 
                        room={clickedRoom}
                        onJoinComplete={handleJoinComplete} 
                    />
                </Overlay>
            ) : null}
        </div>
    );
};
export default JoinServer;
