import React, { useState, useCallback, useEffect } from 'react';
import { HeroHeader } from './components/HeroHeader';
import { QuickAdd } from './components/QuickAdd';
import { PlanList } from './components/PlanList';
import { fetchGoogleSheetData } from './services/googleSheetsService';
import { MOCK_USERS, MOCK_HOTELS, CSV_HEADERS } from './constants';
import { SalesPerson, Hotel, PlanTask } from './types';
import { Users, Building2, Loader2, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<SalesPerson | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [taskList, setTaskList] = useState<PlanTask[]>([]);
  
  // Data state
  const [users, setUsers] = useState<SalesPerson[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingMockData, setUsingMockData] = useState(false);

  // Load data from Google Sheets on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await fetchGoogleSheetData();
        
        // Set data from Google Sheets
        setUsers(data.users || []);
        setHotels(data.hotels || []);
        setSubjects(data.subjects || []);
        setUsingMockData(false);
        
        console.log('✅ Loaded data from Google Sheets:', {
          users: data.users.length,
          hotels: data.hotels.length,
          subjects: data.subjects.length,
        });
        
      } catch (err) {
        console.error('❌ Failed to load Google Sheets data:', err);
        
        // Use mock data as fallback
        setUsers(MOCK_USERS || []);
        setHotels(MOCK_HOTELS || []);
        setSubjects([]);
        setUsingMockData(true);
        
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
        
      } finally {
        setLoading(false);
      }
    };

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
          <p className="text-gray-500 text-sm mt-2">This may take a few seconds</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-20">
      <HeroHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Error/Warning Banner */}
        {error && (
          <div className={`rounded-lg p-4 mb-6 border ${
            usingMockData 
              ? 'bg-yellow-50 border-yellow-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-start gap-3">
              <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                usingMockData ? 'text-yellow-600' : 'text-red-600'
              }`} />
              <div className="flex-1">
                <h3 className={`font-semibold ${
                  usingMockData ? 'text-yellow-800' : 'text-red-800'
                }`}>
                  {usingMockData ? '⚠️ Using Mock Data' : '❌ Google Sheets Error'}
                </h3>
                <p className={`text-sm mt-1 ${
                  usingMockData ? 'text-yellow-700' : 'text-red-700'
                }`}>
                  {error}
                </p>
                {usingMockData && (
                  <p className="text-xs text-yellow-600 mt-2">
                    Configure Google Sheets API in your .env.local file to load real data.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Success Banner */}
        {!error && !usingMockData && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-green-800 text-sm font-medium">
                ✅ Connected to Google Sheets ({users.length} users, {hotels.length} hotels, {subjects.length} subjects)
              </p>
            </div>
          </div>
        )}

        {/* Context Selectors */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            1. Select Context
            <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">Required</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Sales Person Select */}
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
              {users.length === 0 && (
                <p className="text-xs text-red-600 mt-1">⚠️ No users available</p>
              )}
            </div>

            {/* Hotel Select */}
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
              {hotels.length === 0 && (
                <p className="text-xs text-red-600 mt-1">⚠️ No hotels available</p>
              )}
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
