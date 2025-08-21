import React from 'react';
import { Client } from '../types';

interface Props {
  clients: Client[];
  loading: boolean;
}

const statusBadge = (status: boolean) => (
  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${status ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
    <span className={`h-2 w-2 rounded-full ${status ? 'bg-green-500' : 'bg-gray-400'}`}></span>
    {status ? 'Active' : 'Inactive'}
  </span>
);

const formatDate = (date: string) => new Date(date).toLocaleDateString();

const ClientTable: React.FC<Props> = ({ clients, loading }) => {
  if (loading) return <div className="py-8 text-center">Loading...</div>;
  if (!clients.length) return <div className="py-8 text-center">No clients found.</div>;
  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left font-semibold text-gray-700">Client ID</th>
            <th className="px-6 py-3 text-left font-semibold text-gray-700">Client Name</th>
            <th className="px-6 py-3 text-left font-semibold text-gray-700">Client Type</th>
            <th className="px-6 py-3 text-left font-semibold text-gray-700">Email</th>
            <th className="px-6 py-3 text-left font-semibold text-gray-700">Status</th>
            <th className="px-6 py-3 text-left font-semibold text-gray-700">Created At</th>
            <th className="px-6 py-3 text-left font-semibold text-gray-700">Updated At</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {clients.map(client => (
            <tr key={client._id} className="hover:bg-gray-50 group">
              <td className="px-6 py-3 text-blue-600 font-medium cursor-pointer group-hover:underline">{client.clientId}</td>
              <td className="px-6 py-3 font-semibold text-gray-900">{client.name}</td>
              <td className="px-6 py-3">{client.type}</td>
              <td className="px-6 py-3">{client.email}</td>
              <td className="px-6 py-3">{statusBadge(client.status)}</td>
              <td className="px-6 py-3">{formatDate(client.createdAt)}</td>
              <td className="px-6 py-3">{formatDate(client.updatedAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClientTable;
