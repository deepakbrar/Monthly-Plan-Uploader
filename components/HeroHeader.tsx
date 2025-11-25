import React from 'react';
import aticaLogo from '../assets/atica-logo.png';

export const HeroHeader = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-8 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-2">
          <img 
            src={aticaLogo} 
            alt="Atica Logo" 
            className="h-12 w-auto bg-white rounded p-1"
          />
          <h1 className="text-3xl font-bold">Sales Monthly Plan Uploader</h1>
        </div>
        <p className="text-blue-100 ml-16">
          Create and export Salesforce Monthly Plan tasks
        </p>
      </div>
    </header>
  );
};
