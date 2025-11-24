import React from 'react';
import { FileSpreadsheet, Upload } from 'lucide-react';

export const HeroHeader: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-8 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-2">
          <FileSpreadsheet size={32} />
          <h1 className="text-3xl font-bold">SFDC Monthly Plan Uploader</h1>
        </div>
        <p className="text-blue-100 flex items-center gap-2">
          <Upload size={16} />
          Create and export Salesforce task plans for bulk upload
        </p>
      </div>
    </header>
  );
};
