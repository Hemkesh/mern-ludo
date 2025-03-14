import React, { useState, useContext } from 'react';
import Switch from '@mui/material/Switch';
import { SocketContext } from '../../../App';
import WindowLayout from '../WindowLayout/WindowLayout';
import styles from './AddServer.module.css';

// Arrays of common English words for random server name generation
const firstWords = ['Happy', 'Brave', 'Swift', 'Mighty', 'Clever', 'Noble', 'Wise', 'Lucky', 'Gentle', 'Bright', 'Grand', 'Jolly', 'Golden', 'Silver', 'Crystal'];
const secondWords = ['Dragon', 'Tiger', 'Eagle', 'Lion', 'Falcon', 'Wolf', 'Bear', 'Shark', 'Dolphin', 'Panther', 'Phoenix', 'Raven', 'Jaguar', 'Hawk', 'Cobra'];

const AddServer = () => {
    const socket = useContext(SocketContext);
    const [isPrivate, setIsPrivate] = useState(false);
    const [generatedInfo, setGeneratedInfo] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [copyStatus, setCopyStatus] = useState('');
    
    // Function to generate a random server name (two words with a hyphen)
    const generateServerName = () => {
        const firstWord = firstWords[Math.floor(Math.random() * firstWords.length)];
        const secondWord = secondWords[Math.floor(Math.random() * secondWords.length)];
        return `${firstWord}-${secondWord}`;
    };
    
    // Function to generate a random 6-digit password
    const generatePassword = () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
    };

    const handleButtonClick = e => {
        e.preventDefault();
        setIsCreating(true);
        
        // Generate random server name and password
        const randomServerName = generateServerName();
        const randomPassword = generatePassword();
        
        // Store the generated values to display to the user
        setGeneratedInfo({
            name: randomServerName,
            password: isPrivate ? randomPassword : ''
        });
        
        socket.emit('room:create', {
            name: randomServerName,
            password: isPrivate ? randomPassword : '',
            private: isPrivate,
        });
    };
    
    const handleCopyInvite = () => {
        if (!generatedInfo) return;
        
        let inviteText = `Join me on Ludo at https://ludo.hemkesh.com\n\nRoom Name: ${generatedInfo.name}`;
        
        if (isPrivate && generatedInfo.password) {
            inviteText += `\nPassword: ${generatedInfo.password}`;
        }
        
        navigator.clipboard.writeText(inviteText)
            .then(() => {
                setCopyStatus('Copied!');
                setTimeout(() => setCopyStatus(''), 2000);
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
                setCopyStatus('Failed to copy');
            });
    };

    return (
        <WindowLayout
            title='Host A Game'
            content={
                <div className={styles.formContainer}>
                    {!generatedInfo ? (
                        <>
                            <div className={styles.privateContainer}>
                                <label>Private Game</label>
                                <Switch checked={isPrivate} color='primary' onChange={() => setIsPrivate(!isPrivate)} />
                            </div>
                            <p className={styles.infoText}>
                                {isPrivate ? 
                                    'A random name and password will be generated for your private game.' : 
                                    'A random name will be generated for your public game.'}
                            </p>
                            <button 
                                onClick={handleButtonClick} 
                                className={styles.hostButton}
                                disabled={isCreating}
                            >
                                {isCreating ? 'Creating...' : 'Host Game'}
                            </button>
                        </>
                    ) : (
                        <div className={styles.gameCreatedContainer}>
                            <h3 className={styles.successTitle}>Game Created!</h3>
                            <div className={styles.gameInfoBox}>
                                <div className={styles.infoRow}>
                                    <span className={styles.infoLabel}>Server Name:</span>
                                    <span className={styles.infoValue}>{generatedInfo.name}</span>
                                </div>
                                {isPrivate && (
                                    <div className={styles.infoRow}>
                                        <span className={styles.infoLabel}>Password:</span>
                                        <span className={styles.infoValue}>{generatedInfo.password}</span>
                                    </div>
                                )}
                            </div>
                            <p className={styles.noteText}>
                                Share this information with players who want to join your game.
                            </p>
                            <button 
                                onClick={handleCopyInvite} 
                                className={styles.copyButton}
                            >
                                {copyStatus || 'Copy Invite Link'}
                            </button>
                        </div>
                    )}
                </div>
            }
        />
    );
};

export default AddServer;
