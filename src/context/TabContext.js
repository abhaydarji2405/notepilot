import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { LS_TABS, LS_ACTIVE_TAB } from '../constants';
import { generateUntitledName, saveToLocalStorage, loadFromLocalStorage, removeFromLocalStorage } from '../utils';

const TabContext = createContext();

const loadTabs = () => {
  try {
    const raw = localStorage.getItem(LS_TABS);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return [{ id: 'tab_1', name: 'untitled-1', driveFileId: null, isSaved: false }];
};

const loadActiveTab = () => localStorage.getItem(LS_ACTIVE_TAB) || 'tab_1';

export const TabProvider = ({ children }) => {
  const [tabs, setTabs] = useState(loadTabs);
  const [activeTabId, setActiveTabId] = useState(loadActiveTab);

  useEffect(() => {
    localStorage.setItem(LS_TABS, JSON.stringify(tabs));
  }, [tabs]);

  useEffect(() => {
    localStorage.setItem(LS_ACTIVE_TAB, activeTabId);
  }, [activeTabId]);

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  const addTab = useCallback((tabData) => {
    setTabs((prev) => {
      const newTab = tabData || {
        id: `tab_${Date.now()}`,
        name: generateUntitledName(prev),
        driveFileId: null,
        isSaved: false,
      };
      setActiveTabId(newTab.id);
      return [...prev, newTab];
    });
  }, []);

  const closeTab = useCallback(
    (tabId) => {
      setTabs((prev) => {
        if (prev.length === 1) return prev; // keep at least one tab
        const idx = prev.findIndex((t) => t.id === tabId);
        const next = prev.filter((t) => t.id !== tabId);
        removeFromLocalStorage(tabId);
        if (activeTabId === tabId) {
          setActiveTabId(next[Math.max(0, idx - 1)].id);
        }
        return next;
      });
    },
    [activeTabId]
  );

  const updateTabName = useCallback((tabId, name) => {
    setTabs((prev) => prev.map((t) => (t.id === tabId ? { ...t, name } : t)));
  }, []);

  const markTabSaved = useCallback((tabId, driveFileId) => {
    setTabs((prev) =>
      prev.map((t) => (t.id === tabId ? { ...t, driveFileId, isSaved: true } : t))
    );
  }, []);

  const getTabContent = useCallback((tabId) => loadFromLocalStorage(tabId), []);

  const setTabContent = useCallback((tabId, content) => {
    saveToLocalStorage(tabId, content);
  }, []);

  return (
    <TabContext.Provider
      value={{
        tabs,
        activeTabId,
        activeTab,
        setActiveTabId,
        addTab,
        closeTab,
        updateTabName,
        markTabSaved,
        getTabContent,
        setTabContent,
      }}
    >
      {children}
    </TabContext.Provider>
  );
};

export const useTabs = () => useContext(TabContext);
