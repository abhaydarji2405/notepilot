import React, { useEffect, useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { useTabs } from '../../context/TabContext';
import { listDriveFiles, readDriveFile, getOrCreateDriveFolder } from '../../services/driveService';
import { displayName } from '../../utils';
import styles from './OpenFileModal.module.css';

const OpenFileModal = ({ isOpen, onClose }) => {
  const { driveToken, isLoggedIn } = useAuth();
  const { addTab, setTabContent } = useTabs();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [opening, setOpening] = useState(null);

  useEffect(() => {
    if (!isOpen || !isLoggedIn) return;
    setLoading(true);
    setError('');
    getOrCreateDriveFolder(driveToken)
      .then((folderId) => listDriveFiles(driveToken, folderId))
      .then(setFiles)
      .catch(() => setError('Failed to load files. Please try again.'))
      .finally(() => setLoading(false));
  }, [isOpen, isLoggedIn, driveToken]);

  const handleOpen = async (file) => {
    setOpening(file.id);
    try {
      const content = await readDriveFile(driveToken, file.id);
      const tabId = `tab_drive_${file.id}`;
      const newTab = {
        id: tabId,
        name: displayName(file.name),
        driveFileId: file.id,
        isSaved: true,
      };
      setTabContent(tabId, content);
      addTab(newTab);
      onClose();
    } catch {
      setError('Failed to open file.');
    } finally {
      setOpening(null);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Open from Google Drive" width={520}>
      {!isLoggedIn ? (
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          Please log in to access your Drive files.
        </p>
      ) : loading ? (
        <p className={styles.info}>Loading files…</p>
      ) : error ? (
        <p className={styles.errorMsg}>{error}</p>
      ) : files.length === 0 ? (
        <p className={styles.info}>No files found in your NotePilot folder.</p>
      ) : (
        <ul className={styles.fileList}>
          {files.map((f) => (
            <li key={f.id} className={styles.fileItem}>
              <span className={styles.fileName}>
                <span className={styles.fileIcon}>📄</span>
                {displayName(f.name)}
              </span>
              <Button
                size="sm"
                variant="primary"
                onClick={() => handleOpen(f)}
                disabled={opening === f.id}
              >
                {opening === f.id ? '…' : 'Open'}
              </Button>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
};

export default OpenFileModal;
