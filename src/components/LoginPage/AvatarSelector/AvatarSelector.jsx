import React from 'react';
import PropTypes from 'prop-types';
import styles from './AvatarSelector.module.css';

const AVATARS = [
    'https://cdn.jsdelivr.net/gh/alohe/avatars/png/toon_1.png',
    'https://cdn.jsdelivr.net/gh/alohe/avatars/png/toon_2.png',
    'https://cdn.jsdelivr.net/gh/alohe/avatars/png/toon_3.png',
    'https://cdn.jsdelivr.net/gh/alohe/avatars/png/toon_4.png',
    'https://cdn.jsdelivr.net/gh/alohe/avatars/png/toon_5.png',
    'https://cdn.jsdelivr.net/gh/alohe/avatars/png/toon_6.png',
    'https://cdn.jsdelivr.net/gh/alohe/avatars/png/toon_7.png',
    'https://cdn.jsdelivr.net/gh/alohe/avatars/png/toon_8.png',
    'https://cdn.jsdelivr.net/gh/alohe/avatars/png/toon_9.png',
    'https://cdn.jsdelivr.net/gh/alohe/avatars/png/toon_10.png',
    'https://cdn.jsdelivr.net/gh/alohe/avatars/png/upstream_1.png',
    'https://cdn.jsdelivr.net/gh/alohe/avatars/png/upstream_2.png',
    'https://cdn.jsdelivr.net/gh/alohe/avatars/png/upstream_3.png',
    'https://cdn.jsdelivr.net/gh/alohe/avatars/png/upstream_4.png',
    'https://cdn.jsdelivr.net/gh/alohe/avatars/png/upstream_5.png',
    'https://cdn.jsdelivr.net/gh/alohe/avatars/png/upstream_6.png',
    'https://cdn.jsdelivr.net/gh/alohe/avatars/png/upstream_7.png',
    'https://cdn.jsdelivr.net/gh/alohe/avatars/png/upstream_8.png',
    'https://cdn.jsdelivr.net/gh/alohe/avatars/png/upstream_9.png',
    'https://cdn.jsdelivr.net/gh/alohe/avatars/png/upstream_10.png',
    'https://cdn.jsdelivr.net/gh/alohe/avatars/png/upstream_11.png',
    'https://cdn.jsdelivr.net/gh/alohe/avatars/png/upstream_12.png',
    'https://cdn.jsdelivr.net/gh/alohe/avatars/png/upstream_13.png',
    'https://cdn.jsdelivr.net/gh/alohe/avatars/png/upstream_14.png',
    'https://cdn.jsdelivr.net/gh/alohe/avatars/png/upstream_15.png',
    'https://cdn.jsdelivr.net/gh/alohe/avatars/png/upstream_16.png',
    'https://cdn.jsdelivr.net/gh/alohe/avatars/png/upstream_17.png',
    'https://cdn.jsdelivr.net/gh/alohe/avatars/png/upstream_18.png',
    'https://cdn.jsdelivr.net/gh/alohe/avatars/png/upstream_19.png',
    'https://cdn.jsdelivr.net/gh/alohe/avatars/png/upstream_20.png',
    'https://cdn.jsdelivr.net/gh/alohe/avatars/png/upstream_21.png',
    'https://cdn.jsdelivr.net/gh/alohe/avatars/png/upstream_22.png',
];

const AvatarSelector = ({ selectedAvatar, onAvatarSelect }) => {
    return (
        <div className={styles.avatarSelectorContainer}>
            <h4>Choose your avatar</h4>
            <div className={styles.avatarGrid}>
                {AVATARS.map((avatar, index) => (
                    <div 
                        key={index} 
                        className={`${styles.avatarOption} ${selectedAvatar === avatar ? styles.selected : ''}`}
                        onClick={() => onAvatarSelect(avatar)}
                    >
                        <img src={avatar} alt={`Avatar ${index + 1}`} />
                    </div>
                ))}
            </div>
        </div>
    );
};

AvatarSelector.propTypes = {
    selectedAvatar: PropTypes.string.isRequired,
    onAvatarSelect: PropTypes.func.isRequired,
};

export default AvatarSelector;
