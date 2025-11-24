import React from 'react';
import { Cloud } from 'lucide-react';

export const HeroHeader: React.FC = () => {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="bg-[#00A1E0] p-2 rounded-lg text-white">
                <Cloud size={24} />
              </div>
              <span className="font-bold text-xl text-gray-800 tracking-tight">
                Monthly Plan Uploader
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};