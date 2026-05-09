import React, { useState } from 'react';
import { useTabs } from '../../context/TabContext';
import Modal from '../common/Modal';
import Button from '../common/Button';
import styles from './TabBar.module.css';

const TabBar = () => {
  const { tabs, activeTabId, setActiveTabId, addTab, closeTab } = useTabs();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleAddTab = () => {
    addTab();
  };

  const handleCloseTab = (e, tabId) => {
    e.stopPropagation();
    closeTab(tabId);
  };

  return (
    <>
      <div className={styles.tabBar}>
        <div className={styles.tabs}>
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`${styles.tab} ${tab.id === activeTabId ? styles.active : ''}`}
              onClick={() => setActiveTabId(tab.id)}
              title={tab.name}
            >
              <span className={styles.tabName}>{tab.name}</span>
              {!tab.isSaved && <span className={styles.unsavedDot} title="Unsaved" />}
              {tabs.length > 1 && (
                <button
                  className={styles.closeBtn}
                  onClick={(e) => handleCloseTab(e, tab.id)}
                  aria-label="Close tab"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          className={styles.addBtn}
          onClick={handleAddTab}
          aria-label="New tab"
          title="New tab"
        >
          +
        </button>
      </div>

      <Modal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} title="Sign in required">
        <p style={{ color: 'var(--text-secondary)', marginBottom: 20, fontSize: 14 }}>
          Please sign in or create an account to manage multiple tabs and save your notes.
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="primary" onClick={() => setShowAuthModal(false)}>
            Sign up with Google
          </Button>
          <Button variant="ghost" onClick={() => setShowAuthModal(false)}>
            Login
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default TabBar;
