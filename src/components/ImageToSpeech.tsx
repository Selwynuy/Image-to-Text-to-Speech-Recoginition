import React, { useState, useRef, useEffect } from 'react';
import { createWorker } from 'tesseract.js';
import { FaPause, FaPlay, FaStop } from 'react-icons/fa';

const ImageToSpeech: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const textBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const populateVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0 && !selectedVoice) {
        setSelectedVoice(availableVoices[0].name);
      }
    };
    populateVoices();
    window.speechSynthesis.onvoiceschanged = populateVoices;
    // Cleanup
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [selectedVoice]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Create a preview URL for the image
    const imageUrl = URL.createObjectURL(file);
    setImage(imageUrl);
    setIsProcessing(true);

    try {
      const worker = await createWorker();
      await worker.load();
      const { data: { text } } = await worker.recognize(file);
      setExtractedText(text);
      console.log('Extracted text:', text);
      setTimeout(() => {
        if (textBoxRef.current) {
          textBoxRef.current.scrollTop = 0;
        }
      }, 0);
      await worker.terminate();
    } catch (error) {
      console.error('Error processing image:', error);
      setExtractedText('Error processing image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVoiceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVoice(event.target.value);
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  };

  const handleTextToSpeech = () => {
    if (!extractedText) return;

    // Clean up the text for better speech flow
    const cleanedText = extractedText
      .replace(/\s+/g, ' ')   // Replace all whitespace (including newlines) with a single space
      .replace(/\n/g, ' ')    // Remove explicit newlines
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanedText);
    const voice = voices.find(v => v.name === selectedVoice);
    if (voice) utterance.voice = voice;
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    window.speechSynthesis.pause();
    setIsPaused(true);
  };

  const handleResume = () => {
    window.speechSynthesis.resume();
    setIsPaused(false);
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  return (
    <div className="container mx-auto p-8 bg-white rounded-2xl shadow-xl mt-8 max-w-7xl">
      <div className="space-y-8">
        <div className="mt-4 flex flex-col md:flex-row md:space-x-12 w-full max-w-7xl mx-auto" style={{ width: '90%' }}>
          {/* Left: Image or Placeholder with centered upload button */}
          <div className="relative md:w-1/2 flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-lg min-h-[500px] min-w-[500px] max-w-[700px] max-h-[700px] w-full aspect-square border-2 border-dashed border-blue-200">
            {image ? (
              <img src={image} alt="Uploaded" className="object-contain w-full h-full rounded-2xl shadow-md" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center w-full h-full">
                <div>
                  <label htmlFor="image-upload" className="block text-base font-semibold text-blue-700 text-center mb-2 cursor-pointer bg-white bg-opacity-90 px-6 py-3 rounded-xl shadow-md transition hover:bg-blue-100">
                    Upload Image
                  </label>
                  <input
                    ref={fileInputRef}
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    aria-label="upload image"
                    onChange={handleImageUpload}
                  />
                </div>
              </div>
            )}
          </div>
          {/* Right: Static Text Box */}
          <div
            ref={textBoxRef}
            className="w-full h-full min-h-[500px] min-w-[500px] max-w-[700px] max-h-[700px] p-6 border-2 border-blue-200 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg overflow-y-auto text-gray-800 text-lg whitespace-pre-wrap aspect-square text-left"
          >
            {extractedText || <span className="text-gray-400">Extracted text will appear here...</span>}
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0 justify-center mt-8">
          <select
            className="border-2 border-blue-200 rounded-xl p-2 bg-white shadow-sm focus:ring-2 focus:ring-blue-300 transition"
            value={selectedVoice}
            onChange={handleVoiceChange}
            aria-label="Select voice"
          >
            {voices.map((voice) => (
              <option key={voice.name} value={voice.name}>
                {voice.name} ({voice.lang})
              </option>
            ))}
          </select>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-md disabled:opacity-50 transition flex items-center justify-center"
            onClick={handleTextToSpeech}
            disabled={!extractedText || isProcessing}
            title="Convert to Speech"
          >
            {isProcessing ? 'Processing...' : 'Convert to Speech'}
          </button>
          <button
            className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-3 px-6 rounded-xl shadow-md disabled:opacity-50 transition flex items-center justify-center"
            onClick={handlePause}
            disabled={!isSpeaking || isPaused}
            title="Pause"
          >
            Pause
          </button>
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl shadow-md disabled:opacity-50 transition flex items-center justify-center"
            onClick={handleResume}
            disabled={!isSpeaking || !isPaused}
            title="Resume"
          >
            Play
          </button>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl shadow-md disabled:opacity-50 transition flex items-center justify-center"
            onClick={handleStop}
            disabled={!isSpeaking}
            title="Stop"
          >
            Stop
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageToSpeech; 
