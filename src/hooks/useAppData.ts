import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Store } from 'tauri-plugin-store-api';
import type { AppItem } from '../types';

const store = new Store('app-launcher.dat');
const isTauri = '__TAURI__' in window;

export const useAppData = () => {
  const [apps, setApps] = useState<AppItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  

const loadApps = async () => {
  if (!isTauri) {
    console.error('Tauri API is not available. Are you running in a Tauri window?');
    setError('Application not running in Tauri environment.');
    setLoading(false);
    return;
  }
  try {
    setLoading(true);
    const freshApps: AppItem[] = await invoke('get_installed_apps');
    setApps(freshApps);
    setLoading(false);
  } catch (error) {
    setError('Failed to load applications');
    setLoading(false);
  }
};

  const launchApp = async (app: AppItem) => {
    try {
      await invoke('launch_app', { app_path: app.path });
    } catch (error) {
      console.error('Failed to launch app:', error);
    }
  };

  const refreshApps = async () => {
    try {
      setLoading(true);
      const refreshedApps: AppItem[] = await invoke('refresh_apps');
      const appCategories: string[] = await invoke('get_app_categories');
      
      setApps(refreshedApps);
      setCategories(appCategories);
      setError(null);
    } catch (err) {
      setError('Failed to refresh applications');
      console.error('Error refreshing apps:', err);
    } finally {
      setLoading(false);
    }
  };

  const searchApps = async (query: string): Promise<AppItem[]> => {
    try {
      const results: AppItem[] = await invoke('search_apps', { query });
      return results;
    } catch (err) {
      console.error('Error searching apps:', err);
      return apps;
    }
  };

  useEffect(() => {
    loadApps();
     const testConnection = async () => {
    try {
      const result = await invoke('ping');
      console.log('Backend connection:', result); // Should log "pong"
    } catch (error) {
      console.error('Backend connection failed:', error);
    }
  };
  testConnection();
  }, []);

  return {
    apps,
    categories,
    loading,
    error,
    refreshApps,
    searchApps,
    loadApps,
  };
};