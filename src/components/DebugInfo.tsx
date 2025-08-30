import React from 'react';

interface DebugInfoProps {
  data: any;
  isVisible?: boolean;
}

const DebugInfo: React.FC<DebugInfoProps> = ({ data, isVisible = false }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-90 text-white p-4 rounded-lg text-xs max-w-md z-50">
      <h3 className="font-bold mb-2">Debug Info</h3>
      <pre className="whitespace-pre-wrap overflow-auto max-h-64">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
};

export default DebugInfo;
