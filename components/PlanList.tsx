import React from 'react';
import { PlanTask } from '../types';
import { Trash2, FileJson } from 'lucide-react';

interface PlanListProps {
  tasks: PlanTask[];
  onDelete: (id: string) => void;
  onClear: () => void;
  onExport: () => void;
}

export const PlanList: React.FC<PlanListProps> = ({ tasks, onDelete, onClear, onExport }) => {
  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center flex flex-col items-center justify-center h-64">
        <div className="bg-gray-100 p-4 rounded-full mb-4">
          <FileJson className="text-gray-400" size={32} />
        </div>
        <h3 className="text-lg font-medium text-gray-900">No Plans Added Yet</h3>
        <p className="mt-1 text-sm text-gray-500">Use the form above to add tasks to your monthly plan.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50">
        <div>
          <h3 className="text-lg leading-6 font-bold text-gray-900">
            Review Queue ({tasks.length})
          </h3>
          <p className="text-sm text-gray-500 mt-1">Ready for export to n8n/Google Sheets</p>
        </div>
        <div className="flex gap-2">
           <button
            onClick={onClear}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
          >
            Clear All
          </button>
          <button
            onClick={onExport}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
          >
            Download CSV
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hotel (Related To)</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tasks.map((task) => (
              <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  {task.ownerName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {task.whatName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${task.subject === 'Site Visit' ? 'bg-purple-100 text-purple-800' : 
                      task.subject === 'Negotiation' ? 'bg-orange-100 text-orange-800' :
                      task.subject === 'Meeting' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'}`}>
                    {task.subject}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={task.description}>
                  {task.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                  {task.dueDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onDelete(task.id)}
                    className="text-red-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
