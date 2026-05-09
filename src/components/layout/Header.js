import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';
import { GOOGLE_SCOPES, MY_WEBSITE } from '../../constants';
import { getGoogleUserInfo, getOrCreateDriveFolder, trackUserSignup } from '../../services/driveService';
import NotePilotLogo from '../common/NotePilotLogo';
import ThemeToggle from '../common/ThemeToggle';
import Button from '../common/Button';
import OpenFileModal from '../editor/OpenFileModal';
import GoogleIcon from '../../assets/google.svg';
import styles from './Header.module.css';

const Header = () => {
  const { user, isLoggedIn, login, logout } = useAuth();
  const [showOpenFile, setShowOpenFile] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const googleLogin = useGoogleLogin({
    scope: GOOGLE_SCOPES,
    onSuccess: async (tokenResponse) => {
      try {
        const token = tokenResponse.access_token;
        const userInfo = await getGoogleUserInfo(token);
        const userData = {
          name: userInfo.name,
          email: userInfo.email,
          picture: userInfo.picture,
          sub: userInfo.sub,
        };
        await getOrCreateDriveFolder(token);
        await trackUserSignup(token, userData);
        login(userData, token);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Login error:', err);
      }
    },
  });

  return (
    <>
      <header className={styles.header}>
        <div className={styles.left}>
          <NotePilotLogo height={30} />
        </div>

        <div className={styles.right}>
          <a
            href={MY_WEBSITE}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.myWebsite}
          >
            abhaydarji.com
          </a>

          <ThemeToggle />

          {isLoggedIn ? (
            <>
              <Button size="sm" variant="ghost" onClick={() => setShowOpenFile(true)}>
                Open File
              </Button>

              <div className={styles.userInfo}>
                {user.picture && !avatarError ? (
                  <img
                    src={user.picture}
                    alt={user.name}
                    className={styles.avatar}
                    onError={() => setAvatarError(true)}
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className={styles.avatarFallback}>
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className={styles.userName}>{user.name?.split(' ')[0]}</span>
              </div>

              <Button size="sm" variant="ghost" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <button className={styles.googleBtn} onClick={() => googleLogin()}>
                <img src={GoogleIcon} alt="" className={styles.googleIcon} />
                Login
              </button>
              <button className={styles.googleBtnPrimary} onClick={() => googleLogin()}>
                <img src={GoogleIcon} alt="" className={styles.googleIcon} />
                Sign up
              </button>
            </>
          )}
        </div>
      </header>

      <OpenFileModal isOpen={showOpenFile} onClose={() => setShowOpenFile(false)} />
    </>
  );
};

export default Header;
