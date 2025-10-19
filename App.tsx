
import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { PromptDisplay } from './components/PromptDisplay';
import { generatePromptFromImage } from './services/geminiService';
import { ArrowPathIcon, SparklesIcon } from './components/Icons';

// Helper to convert file to base64
const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        resolve('');
      }
    };
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (file: File) => {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setGeneratedPrompt('');
    setError(null);
  };

  const handleGeneratePrompt = useCallback(async () => {
    if (!imageFile) {
      setError('Please upload an image first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedPrompt('');

    try {
      const imagePart = await fileToGenerativePart(imageFile);
      const prompt = await generatePromptFromImage(imagePart.inlineData.data, imagePart.inlineData.mimeType);
      setGeneratedPrompt(prompt);
    } catch (err) {
      console.error(err);
      setError('Failed to generate prompt. Please check the console for details and try again.');
    } finally {
      setIsLoading(false);
    }
  }, [imageFile]);

  const handleReset = () => {
    setImageFile(null);
    setImagePreview(null);
    setGeneratedPrompt('');
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">
            Image Prompt Extractor
          </h1>
          <p className="mt-2 text-lg text-gray-400">
            Turn any image into a detailed, descriptive AI prompt.
          </p>
        </header>

        <main className="bg-gray-800/50 rounded-2xl shadow-2xl p-6 backdrop-blur-sm border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              {!imagePreview ? (
                <ImageUploader onImageUpload={handleImageUpload} />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
                  <div className="relative w-full aspect-square rounded-lg overflow-hidden border-2 border-dashed border-gray-600">
                    <img
                      src={imagePreview}
                      alt="Uploaded preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex space-x-4">
                    <button
                      onClick={handleGeneratePrompt}
                      disabled={isLoading}
                      className="flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-all duration-300"
                    >
                      {isLoading ? (
                        <>
                          <ArrowPathIcon className="animate-spin h-5 w-5 mr-2" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <SparklesIcon className="h-5 w-5 mr-2" />
                          Generate Prompt
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleReset}
                      className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 transition-all duration-300"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <PromptDisplay prompt={generatedPrompt} isLoading={isLoading} />
            </div>
          </div>
          {error && <p className="text-center text-red-400 mt-4">{error}</p>}
        </main>
        <footer className="text-center mt-8 text-gray-500">
            <p>Powered by Gemini</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
