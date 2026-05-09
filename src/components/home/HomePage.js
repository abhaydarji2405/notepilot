import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext';
import { GOOGLE_SCOPES, MY_WEBSITE } from '../../constants';
import {
  getGoogleUserInfo,
  getOrCreateDriveFolder,
  trackUserSignup,
} from '../../services/driveService';
import NotePilotLogo from '../common/NotePilotLogo';
import Button from '../common/Button';
import ThemeToggle from '../common/ThemeToggle';
import Modal from '../common/Modal';
import GoogleIcon from '../../assets/google.svg';
import styles from './HomePage.module.css';

/* Inline SVG illustration */
const Illustration = () => (
  <svg
    viewBox="0 0 560 360"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={styles.illustration}
  >
    <defs>
      <linearGradient id="npBg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#120f24" />
        <stop offset="100%" stopColor="#0a101f" />
      </linearGradient>
      <linearGradient id="npCore" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#211a37" />
        <stop offset="100%" stopColor="#131021" />
      </linearGradient>
      <linearGradient id="npAccent" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#7c3aed" />
        <stop offset="100%" stopColor="#06b6d4" />
      </linearGradient>
      <linearGradient id="npTag" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#332159" />
        <stop offset="100%" stopColor="#1d1632" />
      </linearGradient>
      <radialGradient id="npGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.34" />
        <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
      </radialGradient>
      <filter id="npShadow" x="-30%" y="-30%" width="160%" height="170%">
        <feDropShadow dx="0" dy="14" stdDeviation="12" floodColor="#000000" floodOpacity="0.35" />
      </filter>
      <filter id="npSoft" x="-50%" y="-50%" width="200%" height="220%">
        <feGaussianBlur stdDeviation="4" />
      </filter>
    </defs>

    <rect x="0" y="0" width="560" height="360" rx="20" fill="url(#npBg)" />
    <ellipse
      cx="280"
      cy="192"
      rx="210"
      ry="122"
      fill="url(#npGlow)"
      className={styles.illuCoreGlow}
    />

    <g className={styles.illuGrid}>
      {Array.from({ length: 7 }).map((_, row) =>
        Array.from({ length: 12 }).map((__, col) => (
          <circle
            key={`grid-${row}-${col}`}
            cx={28 + col * 45}
            cy={26 + row * 43}
            r="1.3"
            fill="#8b5cf6"
            opacity="0.13"
          />
        ))
      )}
    </g>

    <rect
      x="40"
      y="56"
      width="362"
      height="248"
      rx="16"
      fill="url(#npCore)"
      stroke="#3c3161"
      strokeWidth="1.3"
      filter="url(#npShadow)"
      className={styles.illuMainBoard}
    />

    <rect x="40" y="56" width="362" height="34" rx="16" fill="#1c1730" />
    <rect x="40" y="74" width="362" height="16" fill="#1c1730" />

    <circle cx="60" cy="73" r="4.5" fill="#f87171" />
    <circle cx="75" cy="73" r="4.5" fill="#fbbf24" />
    <circle cx="90" cy="73" r="4.5" fill="#34d399" />

    <text
      x="224"
      y="76"
      textAnchor="middle"
      fontFamily="'Inter', sans-serif"
      fontSize="12"
      fill="#8a7ebd"
    >
      NotePilot · Smart Notes
    </text>

    <rect x="58" y="102" width="96" height="26" rx="8" fill="#171229" stroke="#3f3470" />
    <text x="78" y="118" fontFamily="monospace" fontSize="10" fill="#c4b5fd">
      all-notes
    </text>
    <circle cx="139" cy="115" r="4" fill="#7c3aed" />

    <rect x="164" y="102" width="92" height="26" rx="8" fill="#151122" stroke="#2f2850" />
    <text x="182" y="118" fontFamily="monospace" fontSize="10" fill="#7d739f">
      tasks
    </text>

    <rect x="266" y="102" width="92" height="26" rx="8" fill="#151122" stroke="#2f2850" />
    <text x="284" y="118" fontFamily="monospace" fontSize="10" fill="#7d739f">
      ideas
    </text>

    <rect x="58" y="138" width="326" height="150" rx="12" fill="#120f20" stroke="#2f2850" />

    <rect x="72" y="154" width="14" height="14" rx="3" fill="#2a2244" />
    <path
      d="M75 161.5L79 165L84 157.5"
      stroke="#34d399"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <rect x="94" y="156" width="146" height="9" rx="4.5" fill="#d6d0f2" opacity="0.86" />
    <rect x="246" y="156" width="54" height="9" rx="4.5" fill="#7c3aed" opacity="0.72" />

    <rect x="72" y="178" width="14" height="14" rx="3" fill="#2a2244" />
    <path
      d="M75 185.5L79 189L84 181.5"
      stroke="#06b6d4"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <rect x="94" y="180" width="98" height="9" rx="4.5" fill="#d6d0f2" opacity="0.74" />
    <rect x="198" y="180" width="80" height="9" rx="4.5" fill="#34d399" opacity="0.65" />

    <rect x="72" y="202" width="14" height="14" rx="3" fill="#2a2244" />
    <path
      d="M75 209.5L79 213L84 205.5"
      stroke="#f59e0b"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <rect x="94" y="204" width="180" height="9" rx="4.5" fill="#d6d0f2" opacity="0.64" />

    <rect x="72" y="226" width="14" height="14" rx="3" fill="#2a2244" />
    <rect x="94" y="228" width="112" height="9" rx="4.5" fill="#d6d0f2" opacity="0.55" />
    <rect x="212" y="228" width="70" height="9" rx="4.5" fill="#f472b6" opacity="0.55" />

    <rect x="72" y="252" width="250" height="8" rx="4" fill="#2a2244" />
    <rect
      x="72"
      y="252"
      width="98"
      height="8"
      rx="4"
      fill="url(#npAccent)"
      opacity="0.72"
      className={styles.illuProgressPulse}
    />

    <rect
      x="424"
      y="76"
      width="102"
      height="78"
      rx="12"
      fill="url(#npTag)"
      stroke="#4a3b80"
      className={styles.illuQuickCard}
    />
    <text x="438" y="96" fontFamily="'Inter', sans-serif" fontSize="9" fill="#afa3de">
      Quick Capture
    </text>
    <rect x="438" y="106" width="74" height="7" rx="3.5" fill="#7c3aed" opacity="0.8" />
    <rect x="438" y="118" width="56" height="6" rx="3" fill="#5b4a90" />
    <rect x="438" y="129" width="40" height="6" rx="3" fill="#5b4a90" />

    <rect
      x="414"
      y="170"
      width="122"
      height="98"
      rx="12"
      fill="url(#npTag)"
      stroke="#4a3b80"
      className={styles.illuSyncCard}
    />
    <text x="430" y="189" fontFamily="'Inter', sans-serif" fontSize="9" fill="#afa3de">
      Sync Status
    </text>
    <path
      d="M438 214C438 202.954 446.954 194 458 194C464.126 194 469.616 196.752 473.286 201.084C475.437 199.784 477.958 199 480.667 199C488.583 199 495 205.417 495 213.333C495 213.558 494.995 213.782 494.985 214.004H501C505.418 214.004 509 217.586 509 222.004C509 226.423 505.418 230.004 501 230.004H438.5C434.358 230.004 431 226.646 431 222.504C431 218.362 434.358 215.004 438.5 215.004H438.713C438.24 214.712 438 214.358 438 214Z"
      fill="rgb(115, 98, 184)"
    />
    <path
      d="M456 216L462 210L468 216"
      stroke="#34d399"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={styles.illuArrowUp}
    />
    <path
      d="M462 210V223"
      stroke="#34d399"
      strokeWidth="2"
      strokeLinecap="round"
      className={styles.illuArrowUp}
    />
    <path
      d="M486 208L480 214L474 208"
      stroke="#06b6d4"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={styles.illuArrowDown}
    />
    <path
      d="M480 214V201"
      stroke="#06b6d4"
      strokeWidth="2"
      strokeLinecap="round"
      className={styles.illuArrowDown}
    />
    <rect x="430" y="240" width="90" height="6" rx="3" fill="#5b4a90" />
    <rect x="430" y="252" width="62" height="6" rx="3" fill="#5b4a90" />

    <circle
      cx="517"
      cy="56"
      r="15"
      fill="#7c3aed"
      opacity="0.2"
      filter="url(#npSoft)"
      className={styles.illuOrbOne}
    />
    <circle
      cx="34"
      cy="310"
      r="18"
      fill="#06b6d4"
      opacity="0.16"
      filter="url(#npSoft)"
      className={styles.illuOrbTwo}
    />

    <text
      x="415"
      y="293"
      fontFamily="monospace"
      fontSize="15"
      fill="#8f84c1"
      className={styles.illuStatusText}
    >
      auto-save on 
    </text>
    <text
      x="415"
      y="313"
      fontFamily="monospace"
      fontSize="15"
      fill="#8f84c1"
      className={styles.illuStatusText}
    >
      drive linked
    </text>

    <line x1="22" y1="20" x2="52" y2="20" stroke="url(#npAccent)" strokeWidth="2" opacity="0.7" />
    <line x1="22" y1="20" x2="22" y2="50" stroke="url(#npAccent)" strokeWidth="2" opacity="0.7" />
    <line
      x1="538"
      y1="340"
      x2="506"
      y2="340"
      stroke="url(#npAccent)"
      strokeWidth="2"
      opacity="0.7"
    />
    <line
      x1="538"
      y1="340"
      x2="538"
      y2="308"
      stroke="url(#npAccent)"
      strokeWidth="2"
      opacity="0.7"
    />
  </svg>
);

/* AbhayDarji logo SVG */
const AbhayLogo = () => (
  <svg viewBox="0 0 401 61" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M4.11932 35.0795V26.5568L30.5398 15.9744V24.9233L13.7074 30.7472L13.9915 30.321V31.3153L13.7074 30.8892L30.5398 36.7131V45.6619L4.11932 35.0795ZM365.527 10.9318L353.809 54.4688H345.499L357.218 10.9318H365.527ZM396.36 38.4886L369.94 49.071V40.1222L386.772 34.2983L386.488 34.7244V33.7301L386.772 34.1562L369.94 28.3324V19.3835L396.36 29.9659V38.4886Z"
      fill="#8B5CF6"
    />
    <path
      d="M56.4187 49H45.7653L57.7681 12.6364H71.2624L83.2653 49H72.6119L64.6573 22.6506H64.3732L56.4187 49ZM54.43 34.6534H74.4585V42.0398H54.43V34.6534ZM86.7676 49V12.6364H96.5687V26.4858H96.7108C97.0659 25.5625 97.5867 24.7161 98.2733 23.9467C98.9598 23.1655 99.8121 22.544 100.83 22.0824C101.848 21.6089 103.032 21.3722 104.381 21.3722C106.18 21.3722 107.891 21.8516 109.513 22.8104C111.146 23.7692 112.472 25.2784 113.49 27.3381C114.52 29.3977 115.035 32.0729 115.035 35.3636C115.035 38.5123 114.543 41.1224 113.561 43.1939C112.59 45.2654 111.288 46.8101 109.655 47.8281C108.033 48.8461 106.251 49.3551 104.31 49.3551C103.032 49.3551 101.89 49.148 100.883 48.7337C99.889 48.3075 99.0368 47.7334 98.3265 47.0114C97.6281 46.2775 97.0895 45.4489 96.7108 44.5256H96.4977V49H86.7676ZM96.3556 35.3636C96.3556 36.6894 96.5273 37.8376 96.8706 38.8082C97.2257 39.767 97.7228 40.5128 98.362 41.0455C99.0131 41.5663 99.7884 41.8267 100.688 41.8267C101.588 41.8267 102.351 41.5722 102.979 41.0632C103.618 40.5424 104.103 39.8026 104.434 38.8438C104.778 37.8731 104.949 36.7131 104.949 35.3636C104.949 34.0142 104.778 32.8601 104.434 31.9013C104.103 30.9306 103.618 30.1908 102.979 29.6818C102.351 29.161 101.588 28.9006 100.688 28.9006C99.7884 28.9006 99.0131 29.161 98.362 29.6818C97.7228 30.1908 97.2257 30.9306 96.8706 31.9013C96.5273 32.8601 96.3556 34.0142 96.3556 35.3636ZM128.937 33.6591V49H119.136V12.6364H128.582V26.9119H128.866C129.482 25.1719 130.506 23.8165 131.938 22.8459C133.37 21.8634 135.093 21.3722 137.105 21.3722C139.034 21.3722 140.709 21.8101 142.13 22.6861C143.562 23.562 144.669 24.7694 145.45 26.3082C146.243 27.8471 146.634 29.6108 146.622 31.5994V49H136.821V33.6591C136.833 32.3097 136.495 31.2502 135.809 30.4808C135.134 29.7114 134.169 29.3267 132.915 29.3267C132.122 29.3267 131.423 29.5043 130.819 29.8594C130.228 30.2027 129.766 30.6998 129.434 31.3509C129.115 31.9901 128.949 32.7595 128.937 33.6591ZM159.06 49.4261C157.32 49.4261 155.781 49.142 154.443 48.5739C153.118 47.9938 152.076 47.1179 151.318 45.946C150.561 44.7741 150.182 43.2827 150.182 41.4716C150.182 39.9801 150.436 38.7076 150.945 37.6541C151.454 36.5888 152.165 35.7188 153.076 35.044C153.988 34.3693 155.047 33.8544 156.254 33.4993C157.474 33.1442 158.788 32.9134 160.196 32.8068C161.723 32.6884 162.948 32.5464 163.872 32.3807C164.807 32.2031 165.481 31.9605 165.896 31.6527C166.31 31.3331 166.517 30.9129 166.517 30.392V30.321C166.517 29.6108 166.245 29.0663 165.7 28.6875C165.156 28.3087 164.458 28.1193 163.605 28.1193C162.67 28.1193 161.907 28.3265 161.315 28.7408C160.735 29.1432 160.386 29.7647 160.267 30.6051H151.247C151.366 28.9479 151.892 27.4209 152.828 26.0241C153.775 24.6155 155.154 23.491 156.965 22.6506C158.776 21.7983 161.037 21.3722 163.747 21.3722C165.7 21.3722 167.452 21.603 169.003 22.0646C170.554 22.5144 171.874 23.1477 172.963 23.9645C174.052 24.7694 174.88 25.7164 175.448 26.8054C176.028 27.8826 176.318 29.0545 176.318 30.321V49H167.156V45.1648H166.943C166.399 46.1828 165.736 47.0054 164.955 47.6328C164.185 48.2602 163.303 48.7159 162.309 49C161.327 49.2841 160.244 49.4261 159.06 49.4261ZM162.256 43.2472C163.002 43.2472 163.7 43.0933 164.351 42.7855C165.014 42.4777 165.552 42.0339 165.967 41.4538C166.381 40.8738 166.588 40.1695 166.588 39.3409V37.0682C166.328 37.1747 166.05 37.2753 165.754 37.37C165.47 37.4647 165.162 37.5535 164.83 37.6364C164.511 37.7192 164.168 37.7962 163.801 37.8672C163.445 37.9382 163.073 38.0033 162.682 38.0625C161.924 38.1809 161.303 38.3762 160.818 38.6484C160.344 38.9089 159.989 39.2344 159.752 39.625C159.527 40.0038 159.415 40.4299 159.415 40.9034C159.415 41.661 159.681 42.241 160.214 42.6435C160.747 43.0459 161.427 43.2472 162.256 43.2472ZM185.991 59.2273C184.866 59.2273 183.795 59.1385 182.777 58.9609C181.759 58.7952 180.865 58.5644 180.096 58.2685L182.227 51.3082C183.031 51.5923 183.765 51.7758 184.428 51.8587C185.103 51.9415 185.677 51.8942 186.151 51.7166C186.636 51.5391 186.985 51.2017 187.198 50.7045L187.411 50.2074L177.823 21.7273H188.05L192.454 40.6193H192.738L197.212 21.7273H207.511L197.567 51.2727C197.07 52.776 196.348 54.1255 195.401 55.321C194.466 56.5284 193.235 57.4813 191.708 58.1797C190.181 58.8781 188.275 59.2273 185.991 59.2273ZM234.109 49H220.117V12.6364H233.967C237.707 12.6364 240.939 13.3643 243.661 14.8203C246.396 16.2644 248.503 18.3478 249.982 21.0703C251.474 23.781 252.219 27.0303 252.219 30.8182C252.219 34.6061 251.48 37.8613 250 40.5838C248.52 43.2945 246.425 45.3778 243.714 46.8338C241.004 48.2779 237.802 49 234.109 49ZM229.989 40.6193H233.754C235.553 40.6193 237.086 40.3293 238.352 39.7493C239.631 39.1693 240.601 38.169 241.264 36.7486C241.939 35.3281 242.276 33.3513 242.276 30.8182C242.276 28.285 241.933 26.3082 241.246 24.8878C240.572 23.4673 239.577 22.4671 238.263 21.8871C236.961 21.3071 235.363 21.017 233.469 21.017H229.989V40.6193ZM264.529 49.4261C262.789 49.4261 261.25 49.142 259.912 48.5739C258.586 47.9938 257.545 47.1179 256.787 45.946C256.03 44.7741 255.651 43.2827 255.651 41.4716C255.651 39.9801 255.905 38.7076 256.414 37.6541C256.923 36.5888 257.633 35.7188 258.545 35.044C259.456 34.3693 260.516 33.8544 261.723 33.4993C262.942 33.1442 264.256 32.9134 265.665 32.8068C267.192 32.6884 268.417 32.5464 269.34 32.3807C270.276 32.2031 270.95 31.9605 271.365 31.6527C271.779 31.3331 271.986 30.9129 271.986 30.392V30.321C271.986 29.6108 271.714 29.0663 271.169 28.6875C270.625 28.3087 269.926 28.1193 269.074 28.1193C268.139 28.1193 267.375 28.3265 266.784 28.7408C266.204 29.1432 265.854 29.7647 265.736 30.6051H256.716C256.834 28.9479 257.361 27.4209 258.296 26.0241C259.243 24.6155 260.622 23.491 262.433 22.6506C264.244 21.7983 266.505 21.3722 269.216 21.3722C271.169 21.3722 272.921 21.603 274.472 22.0646C276.022 22.5144 277.342 23.1477 278.431 23.9645C279.52 24.7694 280.349 25.7164 280.917 26.8054C281.497 27.8826 281.787 29.0545 281.787 30.321V49H272.625V45.1648H272.412C271.868 46.1828 271.205 47.0054 270.423 47.6328C269.654 48.2602 268.772 48.7159 267.778 49C266.795 49.2841 265.712 49.4261 264.529 49.4261ZM267.725 43.2472C268.47 43.2472 269.169 43.0933 269.82 42.7855C270.483 42.4777 271.021 42.0339 271.436 41.4538C271.85 40.8738 272.057 40.1695 272.057 39.3409V37.0682C271.797 37.1747 271.518 37.2753 271.222 37.37C270.938 37.4647 270.631 37.5535 270.299 37.6364C269.98 37.7192 269.636 37.7962 269.269 37.8672C268.914 37.9382 268.541 38.0033 268.151 38.0625C267.393 38.1809 266.772 38.3762 266.286 38.6484C265.813 38.9089 265.458 39.2344 265.221 39.625C264.996 40.0038 264.884 40.4299 264.884 40.9034C264.884 41.661 265.15 42.241 265.683 42.6435C266.215 43.0459 266.896 43.2472 267.725 43.2472ZM286.47 49V21.7273H295.987V26.9119H296.271C296.768 24.9943 297.556 23.5916 298.633 22.7038C299.722 21.8161 300.994 21.3722 302.45 21.3722C302.876 21.3722 303.297 21.4077 303.711 21.4787C304.137 21.5379 304.545 21.6267 304.936 21.745V30.108C304.451 29.9422 303.853 29.8179 303.143 29.7351C302.433 29.6522 301.823 29.6108 301.314 29.6108C300.355 29.6108 299.491 29.8298 298.722 30.2678C297.964 30.6939 297.366 31.2976 296.928 32.0788C296.49 32.8482 296.271 33.7538 296.271 34.7955V49H286.47ZM308.15 21.7273H317.951V49.9233C317.951 52.3144 317.448 54.1847 316.442 55.5341C315.447 56.8835 314.051 57.8364 312.251 58.3928C310.452 58.9491 308.351 59.2273 305.948 59.2273C305.593 59.2273 305.268 59.2214 304.972 59.2095C304.664 59.1977 304.326 59.1799 303.96 59.1562V51.9119C304.196 51.9356 304.403 51.9534 304.581 51.9652C304.747 51.977 304.918 51.983 305.096 51.983C306.268 51.983 307.067 51.7995 307.493 51.4325C307.931 51.0774 308.15 50.5033 308.15 49.7102V21.7273ZM313.05 18.8864C311.725 18.8864 310.588 18.4484 309.641 17.5724C308.694 16.6965 308.221 15.643 308.221 14.4119C308.221 13.1809 308.694 12.1274 309.641 11.2514C310.588 10.3755 311.725 9.9375 313.05 9.9375C314.388 9.9375 315.524 10.3755 316.46 11.2514C317.406 12.1274 317.88 13.1809 317.88 14.4119C317.88 15.643 317.406 16.6965 316.46 17.5724C315.524 18.4484 314.388 18.8864 313.05 18.8864ZM322.945 49V21.7273H332.746V49H322.945ZM327.845 18.8864C326.52 18.8864 325.383 18.4484 324.436 17.5724C323.489 16.6965 323.016 15.643 323.016 14.4119C323.016 13.1809 323.489 12.1274 324.436 11.2514C325.383 10.3755 326.52 9.9375 327.845 9.9375C329.183 9.9375 330.319 10.3755 331.254 11.2514C332.201 12.1274 332.675 13.1809 332.675 14.4119C332.675 15.643 332.201 16.6965 331.254 17.5724C330.319 18.4484 329.183 18.8864 327.845 18.8864Z"
      fill="currentColor"
    />
  </svg>
);

const backgroundIcons = [
  { id: 'n1', type: 'Note', top: '8%', left: '4%', size: '56px', duration: '15s', delay: '-2.2s', drift: '22px', rotate: '-8deg' },
  { id: 'p1', type: 'Pen', top: '5%', left: '49%', size: '62px', duration: '13s', delay: '-6.3s', drift: '18px', rotate: '12deg' },
  { id: 'd1', type: 'Pad', top: '7%', left: '85%', size: '64px', duration: '17s', delay: '-4.7s', drift: '20px', rotate: '-6deg' },
  { id: 'd1', type: 'Pad', top: '22%', left: '10%', size: '64px', duration: '17s', delay: '-4.7s', drift: '20px', rotate: '-6deg' },
  { id: 'n2', type: 'Note', top: '16%', left: '76%', size: '52px', duration: '14s', delay: '-8.5s', drift: '19px', rotate: '10deg' },
  { id: 'p2', type: 'Pen', top: '24%', left: '90%', size: '58px', duration: '16s', delay: '-3.4s', drift: '24px', rotate: '-14deg' },
  { id: 'd2', type: 'Pad', top: '36%', left: '80%', size: '60px', duration: '18s', delay: '-10.6s', drift: '22px', rotate: '8deg' },
  { id: 'n3', type: 'Note', top: '44%', left: '31%', size: '54px', duration: '12s', delay: '-5.8s', drift: '17px', rotate: '-9deg' },
  { id: 'p3', type: 'Pen', top: '54%', left: '88%', size: '66px', duration: '15s', delay: '-1.8s', drift: '21px', rotate: '16deg' },
  { id: 'd3', type: 'Pad', top: '58%', left: '6%', size: '62px', duration: '17s', delay: '-7.9s', drift: '20px', rotate: '-10deg' },
  { id: 'n4', type: 'Note', top: '70%', left: '15%', size: '50px', duration: '13s', delay: '-9.1s', drift: '18px', rotate: '11deg' },
  { id: 'p4', type: 'Pen', top: '78%', left: '30%', size: '60px', duration: '16s', delay: '-2.9s', drift: '22px', rotate: '-13deg' },
  { id: 'd4', type: 'Pad', top: '78%', left: '80%', size: '58px', duration: '14s', delay: '-11.3s', drift: '19px', rotate: '9deg' },
  { id: 'n5', type: 'Note', top: '90%', left: '89%', size: '54px', duration: '18s', delay: '-4.5s', drift: '24px', rotate: '-7deg' },
  { id: 'n1', type: 'Note', top: '30%', left: '55%', size: '56px', duration: '15s', delay: '-2.2s', drift: '22px', rotate: '-8deg' },
  { id: 'p2', type: 'Pen', top: '35%', left: '12%', size: '58px', duration: '16s', delay: '-3.4s', drift: '24px', rotate: '-14deg' },
];

const HomePage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPermModal, setShowPermModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const googleSignup = useGoogleLogin({
    scope: GOOGLE_SCOPES,
    onSuccess: async tokenResponse => {
      setLoading(true);
      setError('');
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
        navigate('/editor');
      } catch (err) {
        setError('Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    onError: () => setError('Google sign-in failed. Please try again.'),
  });

  const handleSignup = () => {
    setShowPermModal(true);
  };

  const handleSkip = () => {
    navigate('/editor');
  };

  const socialLinks = [
    {
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="SVGRepo_bgCarrier" stroke-width="0" />
          <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" />
          <g id="SVGRepo_iconCarrier">
            <path
              d="M18 22V15C18 13.8954 17.1046 13 16 13C14.8954 13 14 13.8954 14 15V22H10"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />{' '}
            <path
              d="M10 22V15C10 11.6863 12.6863 9 16 9C19.3137 9 22 11.6863 22 15V22H18"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <rect
              x="3"
              y="9"
              width="4"
              height="13"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <circle
              cx="5"
              cy="4"
              r="2"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />{' '}
          </g>
        </svg>
      ),
      url: 'https://www.linkedin.com/in/abhay-darji-2405/',
      label: 'LinkedIn',
    },
    {
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M20 4C21.6569 4 23 5.34315 23 7V17C23 18.6569 21.6569 20 20 20H4C2.34315 20 1 18.6569 1 17V7C1 5.34315 2.34315 4 4 4H20ZM19.2529 6H4.74718L11.3804 11.2367C11.7437 11.5236 12.2563 11.5236 12.6197 11.2367L19.2529 6ZM3 7.1688V17C3 17.5523 3.44772 18 4 18H20C20.5523 18 21 17.5523 21 17V7.16882L13.8589 12.8065C12.769 13.667 11.231 13.667 10.1411 12.8065L3 7.1688Z"
            fill="currentColor"
          />
        </svg>
      ),
      url: 'mailto:abhaydarji24@gmail.com',
      label: 'Email',
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          className="bi bi-twitter-x"
          viewBox="0 0 16 16"
        >
          <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" />
        </svg>
      ),
      url: 'https://x.com/@abhay_darji',
      label: 'X',
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.bgDecor} aria-hidden="true">
        {backgroundIcons.map((item) => (
          <span
            key={item.id}
            className={`${styles.bgDecorItem} ${styles[`bg${item.type}`]}`}
            style={{
              top: item.top,
              left: item.left,
              '--size': item.size,
              '--duration': item.duration,
              '--delay': item.delay,
              '--drift': item.drift,
              '--base-rotate': item.rotate,
            }}
          />
        ))}
      </div>

      {/* Nav */}
      <nav className={styles.nav}>
        <NotePilotLogo width="clamp(6.8rem, 28vw, 10rem)" />
        <div className={styles.navRight}>
          <a href={MY_WEBSITE} target="_blank" rel="noopener noreferrer" className={styles.navLink}>
            abhaydarji.com
          </a>
          <ThemeToggle />
          <button className={`${styles.googleBtn} ${styles.navAuthBtn} ${styles.navLoginBtn}`} onClick={() => googleSignup()}>
            <img src={GoogleIcon} alt="" className={styles.googleIcon} />
            Login
          </button>
          <button className={`${styles.googleBtnPrimary} ${styles.navAuthBtn} ${styles.navSignupBtn}`} onClick={handleSignup}>
            <img src={GoogleIcon} alt="" className={styles.googleIcon} />
            Sign up
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>✦ Your notes, your drive</div>
          <h1 className={styles.heroTitle}>
            The notes editor that <span className={styles.heroAccent}>thinks like you</span>
          </h1>
          <p className={styles.heroSub}>
            Open multiple notes in tabs, keep everything stored securely in your own Google Drive,
            and access it anywhere - completely free of cost, forever.
          </p>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.heroActions}>
            <button className={styles.googleBtnLg} onClick={handleSignup} disabled={loading}>
              <img src={GoogleIcon} alt="" className={styles.googleIcon} />
              {loading ? 'Signing in…' : "Get started - it's free"}
            </button>
            <Button variant="ghost" size="lg" onClick={handleSkip}>
              Try without account
            </Button>
          </div>

          <p className={styles.heroNote}>Free forever · No credit card · Secured in your Drive</p>
        </div>

        <div className={styles.heroIllustration}>
          <Illustration />
        </div>
      </section>

      {/* Features - bento grid */}
      <section className={styles.bentoSection}>
        <div className={styles.bentoLabel}>Why NotePilot?</div>
        <div className={styles.bentoGrid}>
          {/* Big card */}
          <div className={`${styles.bentoCard} ${styles.bentoBig}`}>
            <div className={styles.bentoBigInner}>
              <span className={styles.bentoIconBig}>🗂️</span>
              <h3 className={styles.bentoBigTitle}>Multi-tab editing</h3>
              <p className={styles.bentoBigDesc}>
                Flip between notes as fast as you think. Open unlimited tabs, switch instantly, and
                never lose your place - exactly like your favourite code editor.
              </p>
            </div>
            <div className={styles.bentoTabsPreview}>
              {['meeting-notes', 'todo', 'ideas', '+ New'].map((t, i) => (
                <span
                  key={t}
                  className={`${styles.bentoTab} ${i === 0 ? styles.bentoTabActive : ''}`}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Drive card */}
          <div className={`${styles.bentoCard} ${styles.bentoDrive}`}>
            <span className={styles.bentoIconMd}>☁️</span>
            <h3 className={styles.bentoCardTitle}>Your Drive, your rules</h3>
            <p className={styles.bentoCardDesc}>
              Notes live in <em>your</em> Google Drive. We create one folder and nothing else - no
              servers, no middlemen.
            </p>
          </div>

          {/* Security card */}
          <div className={`${styles.bentoCard} ${styles.bentoSecurity}`}>
            <span className={styles.bentoIconMd}>🔒</span>
            <h3 className={styles.bentoCardTitle}>Private by design</h3>
            <p className={styles.bentoCardDesc}>
              Your notes are encrypted and protected by Google's security. Only you can read them -
              we never see your content.
            </p>
          </div>

          {/* Free card */}
          <div className={`${styles.bentoCard} ${styles.bentoFree}`}>
            <div className={styles.bentoFreeBadge}>FREE</div>
            <h3 className={styles.bentoCardTitle}>100% free of cost</h3>
            <p className={styles.bentoCardDesc}>
              No subscriptions, no hidden fees. NotePilot is completely free to use - today and
              always.
            </p>
          </div>

          {/* Theme card */}
          <div className={`${styles.bentoCard} ${styles.bentoTheme}`}>
            <div className={styles.bentoThemeToggleDemo}>
              <span>🌙</span>
              <span className={styles.bentoThemeDivider} />
              <span>☀️</span>
            </div>
            <h3 className={styles.bentoCardTitle}>Dark &amp; light mode</h3>
            <p className={styles.bentoCardDesc}>Switch anytime with one click.</p>
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section className={styles.cta}>
        <h2 className={styles.ctaTitle}>Start writing in seconds</h2>
        <p className={styles.ctaSub}>
          Join writers who keep their notes safe in their own Drive - free of cost.
        </p>
        <div className={styles.ctaActions}>
          <button className={styles.googleBtnLg} onClick={handleSignup}>
            <img src={GoogleIcon} alt="" className={styles.googleIcon} />
            Sign up with Google
          </button>
          <Button variant="ghost" size="lg" onClick={handleSkip}>
            Try without account
          </Button>
        </div>
      </section>

      {/* Footer - replicated from reference */}
      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          {/* Brand + desc */}
          <div className={styles.footerBrand}>
            <div className={styles.footerLogos}>
              <NotePilotLogo height={22} width={'8rem'} />
              <span className={styles.footerX}>×</span>
              <a
                href={MY_WEBSITE}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.footerAbhayLink}
              >
                <AbhayLogo />
              </a>
            </div>
            <p className={styles.footerDesc}>
              A fast and reliable notes editor - write, organise and access your notes anywhere,
              secured entirely in your own Google Drive.
            </p>
          </div>

          {/* Quick Links */}
          <div className={styles.footerCol}>
            <h4 className={styles.footerColHead}>QUICK LINKS</h4>
            <a href={MY_WEBSITE + '/about'} target="_blank" rel="noopener noreferrer">
              About
            </a>
            <a href={MY_WEBSITE + '/technologies'} target="_blank" rel="noopener noreferrer">
              Technologies
            </a>
            <a href={MY_WEBSITE + '/blogs'} target="_blank" rel="noopener noreferrer">
              Blogs
            </a>
            <a href={MY_WEBSITE + '/contact'} target="_blank" rel="noopener noreferrer">
              Contact
            </a>
          </div>

          {/* Get in Touch */}
          <div className={styles.footerCol}>
            <h4 className={styles.footerColHead}>GET IN TOUCH</h4>
            <div className={styles.footerSocials}>
              {socialLinks.map(link => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.footerSocialBtn}
                  aria-label={link.label}
                >
                  {link.icon}
                </a>
              ))}
              
            </div>
          </div>
        </div>

        <div className={styles.footerDivider} />
        <p className={styles.footerCopy}>
          © {new Date().getFullYear()} Abhay Darji. All rights reserved.
        </p>
      </footer>

      {/* Permission info modal before Google login */}
      <Modal
        isOpen={showPermModal}
        onClose={() => setShowPermModal(false)}
        title="Before we connect Google"
        width={560}
      >
        <div className={styles.permContent}>
          <p className={styles.permLead}>
            Your notes stay in your own Drive. We ask only for the minimum access needed to save
            and open files from a dedicated folder.
          </p>

          <div className={styles.permGrid}>
            <section className={`${styles.permCard} ${styles.permAllow}`}>
              <div className={styles.permCardHead}>
                <span className={styles.permIcon} aria-hidden="true">📁</span>
                <strong>We will only</strong>
              </div>
              <ul className={styles.permList}>
                <li>
                  Create one folder named <code>notepilot.abhaydarji.com</code>
                </li>
                <li>Read and write files only inside that folder</li>
                <li>Read your name and email for your profile</li>
              </ul>
            </section>

            <section className={`${styles.permCard} ${styles.permDeny}`}>
              <div className={styles.permCardHead}>
                <span className={styles.permIcon} aria-hidden="true">🛡️</span>
                <strong>We will never</strong>
              </div>
              <ul className={styles.permList}>
                <li>Access, read, or modify any other Drive files</li>
                <li>Share your data with third parties</li>
              </ul>
            </section>
          </div>

          <div className={styles.permTags}>
            <span className={styles.permTag}>Single app folder access</span>
            <span className={styles.permTag}>No full-drive permissions</span>
            <span className={styles.permTag}>You can disconnect anytime</span>
          </div>

          <div className={styles.permActions}>
            <button
              className={styles.permGoogleBtn}
              onClick={() => {
                setShowPermModal(false);
                googleSignup();
              }}
            >
              <img src={GoogleIcon} alt="" className={styles.googleIcon} />
              <span className={styles.permGoogleBtnText}>Continue with Google</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default HomePage;
