import React from 'react';
import { ClientType } from '../types';

interface TabsProps {
  value: 'All' | ClientType;
  onChange: (val: 'All' | ClientType) => void;
}

const tabList: Array<{ label: string; value: 'All' | ClientType }> = [
  { label: 'All', value: 'All' },
  { label: 'Individual', value: 'Individual' },
  { label: 'Company', value: 'Company' },
];

const Tabs: React.FC<TabsProps> = ({ value, onChange }) => (
  <div className="flex items-center gap-2 border-b border-gray-200 bg-white px-6 pt-4">
    {tabList.map(tab => (
      <button
        key={tab.value}
        className={`px-3 py-1.5 rounded-t-lg font-medium text-sm focus:outline-none transition-colors duration-150 ${
          value === tab.value
            ? 'bg-white border-b-2 border-black text-black shadow-none' // active
            : 'bg-transparent text-gray-500 hover:text-black hover:bg-gray-100'
        }`}
        onClick={() => onChange(tab.value)}
      >
        {tab.label}
      </button>
    ))}
  </div>
);

export default Tabs;
