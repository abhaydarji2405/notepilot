import React from 'react';
import { MY_WEBSITE } from '../../constants';
import styles from './Footer.module.css';

const Footer = () => (
  <footer className={styles.footer}>
    <span className={styles.copy}>© {new Date().getFullYear()} NotePilot · All rights reserved.</span>
    <a href={MY_WEBSITE} target="_blank" rel="noopener noreferrer" className={styles.link}>
      abhaydarji.com
    </a>
  </footer>
);

export default Footer;
