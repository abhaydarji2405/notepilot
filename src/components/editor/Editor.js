import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useTabs } from '../../context/TabContext';
import { useAuth } from '../../context/AuthContext';
import { AUTO_SAVE_INTERVAL } from '../../constants';
import { updateDriveFile, createDriveFile, getOrCreateDriveFolder } from '../../services/driveService';
import styles from './Editor.module.css';

const Editor = () => {
  const { activeTab, activeTabId, getTabContent, setTabContent, markTabSaved } = useTabs();
  const { isLoggedIn, driveToken } = useAuth();
  const textareaRef = useRef(null);
  const lineNumRef = useRef(null);
  const [content, setContent] = useState(() => getTabContent(activeTabId));
  const [lineCount, setLineCount] = useState(1);
  const autoSaveTimer = useRef(null);

  // Load content when active tab changes
  useEffect(() => {
    const saved = getTabContent(activeTabId);
    setContent(saved);
    const lines = saved ? saved.split('\n').length : 1;
    setLineCount(Math.max(1, lines));
  }, [activeTabId, getTabContent]);

  // Focus editor on mount / tab switch
  useEffect(() => {
    textareaRef.current?.focus();
  }, [activeTabId]);

  // Sync line numbers scroll with textarea scroll
  const handleScroll = useCallback(() => {
    if (lineNumRef.current && textareaRef.current) {
      lineNumRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  }, []);

  const handleChange = useCallback(
    (e) => {
      const val = e.target.value;
      setContent(val);
      setTabContent(activeTabId, val);
      const lines = val ? val.split('\n').length : 1;
      setLineCount(Math.max(1, lines));
    },
    [activeTabId, setTabContent]
  );

  // Ctrl+S save
  useEffect(() => {
    const onKeyDown = async (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (!isLoggedIn || !driveToken) return;
        try {
          if (activeTab?.driveFileId) {
            await updateDriveFile(driveToken, activeTab.driveFileId, content);
          } else {
            const folderId = await getOrCreateDriveFolder(driveToken);
            const file = await createDriveFile(driveToken, folderId, activeTab?.name || 'untitled-1', content);
            markTabSaved(activeTabId, file.id);
          }
        } catch (err) {
          console.error('Save error:', err);
        }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isLoggedIn, driveToken, activeTab, activeTabId, content, markTabSaved]);

  // Auto-save every 2 min if logged in
  useEffect(() => {
    if (!isLoggedIn || !driveToken) return;
    clearInterval(autoSaveTimer.current);
    autoSaveTimer.current = setInterval(async () => {
      if (!content || !activeTab) return;
      try {
        if (activeTab.driveFileId) {
          await updateDriveFile(driveToken, activeTab.driveFileId, content);
        } else {
          const folderId = await getOrCreateDriveFolder(driveToken);
          const file = await createDriveFile(driveToken, folderId, activeTab.name, content);
          markTabSaved(activeTabId, file.id);
        }
      } catch (err) {
        console.error('Auto-save error:', err);
      }
    }, AUTO_SAVE_INTERVAL);

    return () => clearInterval(autoSaveTimer.current);
  }, [isLoggedIn, driveToken, activeTab, activeTabId, content, markTabSaved]);

  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  return (
    <div className={styles.editorWrapper}>
      <div className={styles.lineNumbers} ref={lineNumRef} aria-hidden="true">
        {lineNumbers.map((n) => (
          <span key={n} className={styles.lineNum}>
            {n}
          </span>
        ))}
      </div>
      <textarea
        ref={textareaRef}
        className={styles.textarea}
        value={content}
        onChange={handleChange}
        onScroll={handleScroll}
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        placeholder=""
        aria-label="Note editor"
      />
    </div>
  );
};

export default Editor;
