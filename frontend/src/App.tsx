import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { Client, SortCriterion, SortDirection, ClientType } from './types';
import ClientTable from './components/ClientTable';
import SortPanel from './components/SortPanel';
import Tabs from './components/Tabs';

declare global {
  interface ImportMeta {
    env: {
      VITE_API_URL: string;
      [key: string]: string;
    };
  }
}

const SORT_STORAGE_KEY = 'client-sort-settings';

const sortFields: Array<{ label: string; value: keyof Omit<Client, '_id'> }> = [
  { label: 'Client ID', value: 'clientId' },
  { label: 'Name', value: 'name' },
  { label: 'Type', value: 'type' },
  { label: 'Email', value: 'email' },
  { label: 'Status', value: 'status' },
  { label: 'Created At', value: 'createdAt' },
  { label: 'Updated At', value: 'updatedAt' },
];

const App: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'All' | ClientType>('All');
  const [sortCriteria, setSortCriteria] = useState<SortCriterion[]>(() => {
    const saved = localStorage.getItem(SORT_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [{ field: 'name', direction: 'asc' }];
  });
  const [sortPanelOpen, setSortPanelOpen] = useState(false);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    axios.get<Client[]>(`${import.meta.env.VITE_API_URL}/api/clients`)
      .then(res => {
        if (!ignore) {
          setClients(res.data);
          setLoading(false);
        }
      })
      .catch(() => setLoading(false));
    return () => { ignore = true; };
  }, []);

  useEffect(() => {
    localStorage.setItem(SORT_STORAGE_KEY, JSON.stringify(sortCriteria));
  }, [sortCriteria]);

  const filteredClients = useMemo(() => {
    if (tab === 'All') return clients;
    return clients.filter(c => c.type === tab);
  }, [clients, tab]);

  const sortedClients = useMemo(() => {
    const arr = [...filteredClients];
    arr.sort((a, b) => {
      for (const { field, direction } of sortCriteria) {
        let v1 = a[field];
        let v2 = b[field];
        if (field === 'createdAt' || field === 'updatedAt') {
          v1 = new Date(v1 as string).getTime();
          v2 = new Date(v2 as string).getTime();
        } else if (field === 'status') {
          v1 = v1 ? 1 : 0;
          v2 = v2 ? 1 : 0;
        } else if (typeof v1 === 'string' && typeof v2 === 'string') {
          v1 = v1.toLowerCase();
          v2 = v2.toLowerCase();
        }
        if (v1 < v2) return direction === 'asc' ? -1 : 1;
        if (v1 > v2) return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    return arr;
  }, [filteredClients, sortCriteria]);

  return (
    <div className="min-h-screen bg-[#fafbfc]">
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold tracking-tight">Clients</h1>
        </div>
        <Tabs value={tab} onChange={setTab} />
        <div className="flex justify-between items-center mb-4 mt-2">
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-black"
                style={{ minWidth: 200 }}
                disabled
              />
              <span className="absolute left-3 top-2.5 text-gray-400">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-2-2"/></svg>
              </span>
            </div>
            <div className="flex items-center gap-2">
              {sortCriteria.map((c, i) => {
                let label = '';
                if (c.field === 'name') label = 'Client Name';
                else if (c.field === 'createdAt') label = 'Created At';
                else if (c.field === 'updatedAt') label = 'Updated At';
                else if (c.field === 'clientId') label = 'Client ID';
                else label = c.field;
                let dir = '';
                if (c.field === 'createdAt' || c.field === 'updatedAt') dir = c.direction === 'asc' ? '↓ Oldest' : '↑ Newest';
                else dir = c.direction === 'asc' ? '↑ A-Z' : '↓ Z-A';
                return (
                  <span key={c.field} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-100 text-xs text-gray-700 border border-gray-200">
                    {label}
                    <span className="font-semibold">{dir}</span>
                    {i < sortCriteria.length - 1 && <span className="mx-1 text-gray-300">|</span>}
                  </span>
                );
              })}
            </div>
          </div>
          <button className="relative text-gray-600 hover:text-black" onClick={() => setSortPanelOpen(true)}>
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 6h18M6 12h12M9 18h6"/></svg>
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5">{sortCriteria.length}</span>
          </button>
        </div>
        <ClientTable clients={sortedClients} loading={loading} />
        <SortPanel
          open={sortPanelOpen}
          onClose={() => setSortPanelOpen(false)}
          sortCriteria={sortCriteria}
          setSortCriteria={setSortCriteria}
          sortFields={sortFields}
        />
      </div>
    </div>
  );
};

export default App;
