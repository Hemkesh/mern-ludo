import React, { useState, useContext, useEffect } from 'react';
import { SocketContext } from '../../../App';
import useInput from '../../../hooks/useInput';
import useKeyPress from '../../../hooks/useKeyPress';
import styles from './NameInput.module.css';

const NameInput = ({ isRoomPrivate, roomId, room }) => {
    const socket = useContext(SocketContext);
    const nickname = useInput('');
    
    // Get the created game info from localStorage
    const getCreatedGamePassword = () => {
        if (isRoomPrivate && room) {
            try {
                const createdGameInfo = JSON.parse(localStorage.getItem('createdGame'));
                if (createdGameInfo && createdGameInfo.name === room.name) {
                    return createdGameInfo.password;
                }
            } catch (error) {
                console.error('Error parsing created game info:', error);
            }
        }
        return '';
    };
    
    // Initialize password with the value from localStorage if it's the user's created game
    const initialPassword = getCreatedGamePassword();
    const password = useInput(initialPassword);
    const [isPasswordWrong, setIsPasswordWrong] = useState(false);

    const handleButtonClick = () => {
        socket.emit('player:login', { name: nickname.value, password: password.value, roomId: roomId });
    };

    useKeyPress('Enter', handleButtonClick);

    useEffect(() => {
        socket.on('error:wrongPassword', () => {
            setIsPasswordWrong(true);
        });
    }, [socket]);

    return (
        <div className={styles.container} style={{ height: isRoomPrivate ? '100px' : '50px' }}>
            <input placeholder='Nickname' type='text' {...nickname} />
            {isRoomPrivate ? (
                <input
                    placeholder='Room password'
                    type='text'
                    value={password.value}
                    onChange={password.onChange}
                    style={{ backgroundColor: isPasswordWrong ? 'red' : null }}
                />
            ) : null}
            <button onClick={handleButtonClick}>JOIN</button>
        </div>
    );
};

export default NameInput;
