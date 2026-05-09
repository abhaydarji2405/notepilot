import React from 'react';
import Header from '../components/layout/Header';
import TabBar from '../components/layout/TabBar';
import Editor from '../components/editor/Editor';
import Footer from '../components/layout/Footer';
import styles from './EditorPage.module.css';

const EditorPage = () => (
  <div className={styles.page}>
    <Header />
    <TabBar />
    <main className={styles.main}>
      <Editor />
    </main>
    <Footer />
  </div>
);

export default EditorPage;
