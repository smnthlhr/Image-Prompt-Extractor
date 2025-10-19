
import React, { useState, useEffect } from 'react';
import { CopyIcon, CheckIcon } from './Icons';

interface PromptDisplayProps {
  prompt: string;
  isLoading: boolean;
}

export const PromptDisplay: React.FC<PromptDisplayProps> = ({ prompt, isLoading }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (prompt) {
      navigator.clipboard.writeText(prompt);
      setCopied(true);
    }
  };

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  useEffect(() => {
    // Reset copied state when a new prompt is generated
    if (prompt) {
      setCopied(false);
    }
  }, [prompt]);

  return (
    <div className="relative w-full h-full min-h-[300px] md:aspect-square flex flex-col bg-gray-900/70 rounded-lg border border-gray-700 p-4">
      <h2 className="text-lg font-semibold text-gray-300 mb-2">Generated Prompt</h2>
      <div className="flex-grow w-full h-full overflow-y-auto pr-2 custom-scrollbar">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center text-gray-400">
                <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-indigo-400"></div>
                <p className="mt-3">Analyzing image...</p>
            </div>
          </div>
        ) : prompt ? (
          <p className="text-gray-300 whitespace-pre-wrap">{prompt}</p>
        ) : (
          <div className="flex items-center justify-center h-full text-center text-gray-500">
            <p>Your generated prompt will appear here.</p>
          </div>
        )}
      </div>
      {prompt && !isLoading && (
        <button
          onClick={handleCopy}
          className="absolute top-4 right-4 p-2 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
          aria-label="Copy prompt"
        >
          {copied ? (
            <CheckIcon className="w-5 h-5 text-green-400" />
          ) : (
            <CopyIcon className="w-5 h-5 text-gray-400" />
          )}
        </button>
      )}
    </div>
  );
};
