import React, { useState, useCallback } from 'react';
import { HeroHeader } from './components/HeroHeader';
import { QuickAdd } from './components/QuickAdd';
import { PlanList } from './components/PlanList';
import { MOCK_USERS, MOCK_HOTELS, CSV_HEADERS } from './constants';
import { SalesPerson, Hotel, PlanTask } from './types';
import { Users, Building2 } from 'lucide-react';

const App: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<SalesPerson | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [taskList, setTaskList] = useState<PlanTask[]>([]);

  const handleAddTasks = useCallback((newTasks: PlanTask[]) => {
    setTaskList((prev) => [...prev, ...newTasks]);
  }, []);

  const handleDeleteTask = useCallback((id: string) => {
    setTaskList((prev) => prev.filter(task => task.id !== id));
  }, []);

  const handleClearAll = useCallback(() => {
    if (window.confirm("Are you sure you want to clear all tasks?")) {
      setTaskList([]);
    }
  }, []);

  const handleExportCSV = useCallback(() => {
    if (taskList.length === 0) return;

    // CSV Construction
    const csvRows = [
      CSV_HEADERS.join(','), // Header Row
      ...taskList.map(task => {
        // Escape quotes for CSV
        const safeDesc = `"${task.description.replace(/"/g, '""')}"`;
        return [
          task.ownerId,
          task.ownerName,
          task.whatId,
          task.whatName,
          task.subject,
          safeDesc,
          task.dueDate,
          task.taskType
        ].join(',');
      })
    ];

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `monthly_plan_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }, [taskList]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-20">
      <HeroHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Context Selectors */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            1. Select Context
            <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">Required</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Sales Person Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <Users size={16} />
                Task Owner (Sales Person)
              </label>
              <select
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
                onChange={(e) => {
                  const user = MOCK_USERS.find(u => u.id === e.target.value);
                  setSelectedUser(user || null);
                }}
                value={selectedUser?.id || ''}
              >
                <option value="">-- Select Owner --</option>
                {MOCK_USERS.map((user) => (
                  <option key={user.id} value={user.id}>{user.name}</option>
                ))}
              </select>
            </div>

            {/* Hotel Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <Building2 size={16} />
                Related Hotel (WhatId)
              </label>
              <select
                 className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
                 onChange={(e) => {
                   const hotel = MOCK_HOTELS.find(h => h.id === e.target.value);
                   setSelectedHotel(hotel || null);
                 }}
                 value={selectedHotel?.id || ''}
              >
                <option value="">-- Select Hotel --</option>
                {MOCK_HOTELS.map((hotel) => (
                  <option key={hotel.id} value={hotel.id}>{hotel.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">2. Add Plan Items</h2>
          <QuickAdd 
            selectedUser={selectedUser} 
            selectedHotel={selectedHotel} 
            onAddTasks={handleAddTasks} 
          />
        </div>

        {/* Review List */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">3. Review & Export</h2>
          <PlanList 
            tasks={taskList} 
            onDelete={handleDeleteTask} 
            onClear={handleClearAll}
            onExport={handleExportCSV}
          />
        </div>

      </main>
    </div>
  );
};

export default App;
