import AddServer from './AddServer/AddServer';
import JoinServer from './JoinServer/JoinServer';
import logoImage from '../../images/logo.png';
import styles from './LoginPage.module.css';

const LoginPage = () => {
    return (
        <div className={styles.container}>
            <div className={styles.logoContainer}>
                <img src={logoImage} alt="Hemkesh Ludo" className={styles.logo} />
            </div>
            <div className={styles.gameOptionsContainer}>
                <AddServer />
                <JoinServer />
            </div>
        </div>
    );
};

export default LoginPage;
