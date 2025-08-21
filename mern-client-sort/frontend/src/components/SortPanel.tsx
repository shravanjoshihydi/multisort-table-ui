import React from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SortCriterion, SortDirection } from '../types';

interface SortPanelProps {
  open: boolean;
  onClose: () => void;
  sortCriteria: SortCriterion[];
  setSortCriteria: (criteria: SortCriterion[]) => void;
  sortFields: Array<{ label: string; value: string }>;
}

const sortOptions = [
  { label: 'Client Name', value: 'name', icon: (
    <svg className="inline mr-1" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="7" r="4"/><path d="M5.5 21h13a2 2 0 0 0 2-2v-2a4 4 0 0 0-4-4h-5a4 4 0 0 0-4 4v2a2 2 0 0 0 2 2z"/></svg>
  ) },
  { label: 'Created At', value: 'createdAt', icon: (
    <svg className="inline mr-1" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
  ) },
  { label: 'Updated At', value: 'updatedAt', icon: (
    <svg className="inline mr-1" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
  ) },
  { label: 'Client ID', value: 'clientId', icon: (
    <svg className="inline mr-1" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 24 24"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 9h6v6H9z"/></svg>
  ) },
];

const SortPanel: React.FC<SortPanelProps> = ({ open, onClose, sortCriteria, setSortCriteria }) => {
  const sensors = useSensors(useSensor(PointerSensor));

  function handleDragEnd(event: any) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      const oldIndex = sortCriteria.findIndex(c => c.field === active.id);
      const newIndex = sortCriteria.findIndex(c => c.field === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        setSortCriteria(arrayMove(sortCriteria, oldIndex, newIndex));
      }
    }
  }

  // Only allow each sort option once
  const availableOptions = sortOptions.filter(opt => !sortCriteria.some(c => c.field === opt.value));

  // Add a new sort criterion (first available field not already used)
  const handleAdd = () => {
    if (availableOptions.length > 0) {
      setSortCriteria([
        ...sortCriteria,
        { field: availableOptions[0].value as 'clientId' | 'name' | 'type' | 'email' | 'status' | 'createdAt' | 'updatedAt', direction: 'asc' }
      ]);
    }
  };

  // Remove a sort criterion
  const handleRemove = (idx: number) => {
    if (sortCriteria.length === 1) return;
    const updated = [...sortCriteria];
    updated.splice(idx, 1);
    setSortCriteria(updated);
  };

  // Change field for a sort criterion
  const handleFieldChange = (idx: number, field: string) => {
    const updated = [...sortCriteria];
    updated[idx].field = field as any;
    setSortCriteria(updated);
  };

  // Toggle direction for a sort criterion
  const handleDirectionToggle = (idx: number, dir: 'asc' | 'desc') => {
    const updated = [...sortCriteria];
    // If already selected, unselect (remove this sort criterion)
    if (updated[idx].direction === dir) {
      if (sortCriteria.length > 1) {
        updated.splice(idx, 1);
        setSortCriteria(updated);
      }
      // If only one, reset to default
      else {
        setSortCriteria([{ field: 'name', direction: 'asc' }]);
      }
    } else {
      updated[idx].direction = dir;
      setSortCriteria(updated);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl p-8 relative border border-gray-200">
        <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl" onClick={onClose}>&times;</button>
        <h2 className="text-2xl font-bold mb-6">Sort By</h2>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={sortCriteria.map((c) => c.field)} strategy={verticalListSortingStrategy}>
            {sortCriteria.map((criterion, idx) => {
              const opt = sortOptions.find(o => o.value === criterion.field);
              return (
                <SortableSortCriterion
                  key={criterion.field}
                  id={criterion.field}
                  idx={idx}
                  criterion={criterion}
                  label={opt?.label || criterion.field}
                  icon={opt?.icon}
                  onDirectionToggle={handleDirectionToggle}
                  onRemove={handleRemove}
                  isLast={sortCriteria.length === 1}
                />
              );
            })}
          </SortableContext>
        </DndContext>
        {/* Show inactive sort options below */}
        <div className="mt-2">
          {sortOptions.filter(opt => !sortCriteria.some(c => c.field === opt.value)).map(opt => (
            <div key={opt.value} className="flex items-center gap-3 mb-2 px-2 py-2 rounded-lg bg-transparent text-gray-400">
              <span className="text-gray-300 text-lg mr-2 select-none">{opt.icon}</span>
              <span className="font-medium text-base">{opt.label}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center mt-8">
          <button
            className="text-sm text-gray-500 hover:underline"
            onClick={() => setSortCriteria([{ field: 'name', direction: 'asc' }])}
          >
            Clear all
          </button>
          <div className="flex gap-2">
            <button
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 text-base"
              onClick={handleAdd}
              disabled={availableOptions.length === 0}
            >
              + Add Sort
            </button>
            <button
              className="bg-black text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-900 text-base"
              onClick={onClose}
            >
              Apply Sort
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface SortableSortCriterionProps {
  id: string;
  idx: number;
  criterion: SortCriterion;
  label: string;
  icon?: React.ReactNode;
  onDirectionToggle: (idx: number, dir: 'asc' | 'desc') => void;
  onRemove: (idx: number) => void;
  isLast: boolean;
}

function SortableSortCriterion({ id, idx, criterion, label, icon, onDirectionToggle, onRemove, isLast }: SortableSortCriterionProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="flex items-center gap-3 mb-4 px-2 py-2 rounded-lg bg-white border border-gray-200 shadow-sm"
      {...attributes}
      {...listeners}
    >
      <span className="text-gray-400 text-lg mr-2 select-none">{icon}</span>
      <span className="font-medium text-base">{label}</span>
      <div className="flex gap-1 ml-2">
        <button
          type="button"
          className={`px-2 py-1 rounded text-xs font-semibold border ${criterion.direction === 'asc' ? 'bg-blue-100 text-blue-700 border-blue-400' : 'bg-white border-gray-300 text-gray-400'}`}
          onMouseDown={e => e.preventDefault()}
          onClick={() => onDirectionToggle(idx, 'asc')}
        >
          {criterion.field === 'createdAt' || criterion.field === 'updatedAt' ? 'Oldest to Newest' : 'A-Z'}
        </button>
        <button
          type="button"
          className={`px-2 py-1 rounded text-xs font-semibold border ${criterion.direction === 'desc' ? 'bg-blue-100 text-blue-700 border-blue-400' : 'bg-white border-gray-300 text-gray-400'}`}
          onMouseDown={e => e.preventDefault()}
          onClick={() => onDirectionToggle(idx, 'desc')}
        >
          {criterion.field === 'createdAt' || criterion.field === 'updatedAt' ? 'Newest to Oldest' : 'Z-A'}
        </button>
      </div>
      <button
        className="ml-2 text-gray-400 hover:text-red-600 text-lg"
        onClick={() => onRemove(idx)}
        disabled={isLast}
        title={isLast ? 'At least one sort criterion required' : 'Remove'}
      >
        &times;
      </button>
    </div>
  );
}

export default SortPanel;
