import React, { useState, useContext, useEffect } from 'react';
import { SocketContext } from '../../../App';
import useInput from '../../../hooks/useInput';
import useKeyPress from '../../../hooks/useKeyPress';
import AvatarSelector from '../AvatarSelector/AvatarSelector';
import styles from './NameInput.module.css';

const NameInput = ({ isRoomPrivate, roomId, room, onJoinComplete }) => {
    const socket = useContext(SocketContext);
    
    // Get saved nickname and avatar from localStorage
    const getSavedUserData = () => {
        try {
            const userData = JSON.parse(localStorage.getItem('userData'));
            return userData || { nickname: '', avatar: 'https://cdn.jsdelivr.net/gh/alohe/avatars/png/toon_1.png' };
        } catch (error) {
            console.error('Error parsing user data:', error);
            return { nickname: '', avatar: 'https://cdn.jsdelivr.net/gh/alohe/avatars/png/toon_1.png' };
        }
    };
    
    const userData = getSavedUserData();
    const nickname = useInput(userData.nickname);
    const [selectedAvatar, setSelectedAvatar] = useState(userData.avatar);
    
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

    const handleAvatarSelect = (avatar) => {
        setSelectedAvatar(avatar);
    };

    const handleButtonClick = () => {
        if (nickname.value.trim() === '') return;
        
        // Save user data to localStorage
        localStorage.setItem('userData', JSON.stringify({
            nickname: nickname.value,
            avatar: selectedAvatar
        }));
        
        socket.emit('player:login', { 
            name: nickname.value, 
            password: password.value, 
            roomId: roomId,
            avatar: selectedAvatar
        });

        // Call the onJoinComplete callback if provided
        if (onJoinComplete) {
            onJoinComplete();
        }
    };

    useKeyPress('Enter', handleButtonClick);

    useEffect(() => {
        socket.on('error:wrongPassword', () => {
            setIsPasswordWrong(true);
        });
        
        // Add a listener for successful login to trigger onJoinComplete
        socket.on('player:login', () => {
            if (onJoinComplete) {
                onJoinComplete();
            }
        });
        
        return () => {
            socket.off('player:login');
        };
    }, [socket, onJoinComplete]);

    return (
        <div className={styles.container} style={{ height: isRoomPrivate ? '350px' : '300px' }}>
            <AvatarSelector 
                selectedAvatar={selectedAvatar}
                onAvatarSelect={handleAvatarSelect}
            />
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
