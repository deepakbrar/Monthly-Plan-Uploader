import React, { useState } from 'react';
import { Hotel, SalesPerson, TaskSubject, PlanTask } from '../types';
import { SUBJECT_OPTIONS } from '../constants';
import { Plus } from 'lucide-react';

interface QuickAddProps {
  selectedUser: SalesPerson | null;
  selectedHotel: Hotel | null;
  onAddTasks: (tasks: PlanTask[]) => void;
}

export const QuickAdd: React.FC<QuickAddProps> = ({ selectedUser, selectedHotel, onAddTasks }) => {
  // Manual State
  const [subject, setSubject] = useState<TaskSubject>(TaskSubject.Call);
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  const canAddManual = selectedUser && selectedHotel && description && dueDate;

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canAddManual || !selectedUser || !selectedHotel) return;

    const newTask: PlanTask = {
      id: crypto.randomUUID(),
      ownerId: selectedUser.id,
      ownerName: selectedUser.name,
      whatId: selectedHotel.id,
      whatName: selectedHotel.name,
      subject,
      description,
      dueDate,
      taskType: 'Monthly Plan',
      status: 'Not Started'
    };

    onAddTasks([newTask]);
    setDescription('');
    // Keep date and subject for quick repeated entry
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden mb-8">
      <div className="p-6">
        {!selectedUser || !selectedHotel ? (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Please select a <strong>Sales Person</strong> and a <strong>Hotel</strong> from the top bar before adding tasks.
                </p>
              </div>
            </div>
          </div>
        ) : null}

        <form onSubmit={handleManualSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value as TaskSubject)}
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border"
            >
              {SUBJECT_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description / Comments</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Discuss summer rates with GM"
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border"
            />
          </div>

          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border"
            />
          </div>

          <div className="md:col-span-1">
            <button
              type="submit"
              disabled={!canAddManual}
              className="w-full flex justify-center items-center p-2.5 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Plus size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};