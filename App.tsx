import React, { useState, useCallback, useEffect } from 'react';
import { HeroHeader } from './components/HeroHeader';
import { QuickAdd } from './components/QuickAdd';
import { PlanList } from './components/PlanList';
import { fetchGoogleSheetData } from './services/googleSheetsService';
import { CSV_HEADERS } from './constants';
import { SalesPerson, Hotel, PlanTask } from './types';
import { Users, Building2, Loader2, AlertCircle, RefreshCw } from 'lucide-react';

const App: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<SalesPerson | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [taskList, setTaskList] = useState<PlanTask[]>([]);
  
  // Data from Google Sheets (mandatory)
  const [users, setUsers] = useState<SalesPerson[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data from Google Sheets
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await fetchGoogleSheetData();
      
      // Validate that we got data
      if (!data.users || data.users.length === 0) {
        throw new Error('No users found in Google Sheets. Please add data to the "Users" tab.');
      }
      if (!data.hotels || data.hotels.length === 0) {
        throw new Error('No hotels found in Google Sheets. Please add data to the "Hotels" tab.');
      }
      if (!data.subjects || data.subjects.length === 0) {
        throw new Error('No subjects found in Google Sheets. Please add data to the "Subjects" tab.');
      }
      
      setUsers(data.users);
      setHotels(data.hotels);
      setSubjects(data.subjects);
      
      console.log('✅ Successfully loaded from Google Sheets:', {
        users: data.users.length,
        hotels: data.hotels.length,
        subjects: data.subjects.length,
      });
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load data from Google Sheets';
      console.error('❌ Google Sheets Error:', err);
      setError(errorMessage);
      
      // Don't set any fallback data - keep arrays empty
      setUsers([]);
      setHotels([]);
      setSubjects([]);
      
    } finally {
      setLoading(false);
    }
  };

  // Load on mount
  useEffect(() => {
    loadData();
  }, []);

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
    if (taskList.length === 0) {
      alert('No tasks to export. Please add tasks first.');
      return;
    }

    const csvRows = [
      CSV_HEADERS.join(','),
      ...taskList.map(task => {
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
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `monthly_plan_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }, [taskList]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-700 font-medium text-lg">Loading data from Google Sheets...</p>
          <p className="text-gray-500 text-sm mt-2">Please wait...</p>
        </div>
      </div>
    );
  }

  // Error state - block app usage if Google Sheets fails
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-red-200">
            <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
              Unable to Load Data
            </h2>
            <p className="text-gray-600 text-center mb-6">
              {error}
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-sm text-gray-700">
              <p className="font-semibold mb-2">Please check:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Google Sheets API key is valid</li>
                <li>Spreadsheet is shared publicly (Anyone with link → Viewer)</li>
                <li>Spreadsheet has tabs: Users, Hotels, Subjects</li>
                <li>Each tab has data starting from row 2</li>
              </ul>
            </div>
            <button
              onClick={loadData}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <RefreshCw size={20} />
              Retry Connection
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-20">
      <HeroHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Success indicator */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-green-800 text-sm font-medium">
              ✅ Connected to Google Sheets ({users.length} users, {hotels.length} hotels, {subjects.length} subjects)
            </p>
          </div>
        </div>

        {/* Context Selectors */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            1. Select Context
            <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">Required</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Users size={16} />
                Task Owner (Sales Person)
              </label>
              <select
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
                onChange={(e) => {
                  const user = users.find(u => u.id === e.target.value);
                  setSelectedUser(user || null);
                }}
                value={selectedUser?.id || ''}
              >
                <option value="">-- Select Owner --</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Building2 size={16} />
                Related Hotel (WhatId)
              </label>
              <select
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
                onChange={(e) => {
                  const hotel = hotels.find(h => h.id === e.target.value);
                  setSelectedHotel(hotel || null);
                }}
                value={selectedHotel?.id || ''}
              >
                <option value="">-- Select Hotel --</option>
                {hotels.map((hotel) => (
                  <option key={hotel.id} value={hotel.id}>
                    {hotel.name}
                  </option>
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
            subjects={subjects}
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
