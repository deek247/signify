import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import { VideoIcon, PlayIcon, StopCircleIcon } from 'lucide-react';
export function SignToSpeech() {
  const [isCapturing, setIsCapturing] = useState(false);
  const [detectedText, setDetectedText] = useState('');
  const [detectedEmotion, setDetectedEmotion] = useState<
    'neutral' | 'happy' | 'sad' | 'angry'>(
    'neutral');
  const [isProcessing, setIsProcessing] = useState(false);
  const webcamRef = useRef<Webcam>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('ASL');
  const startCapture = () => {
    setIsCapturing(true);
    setIsProcessing(true);
    // Simulate gesture recognition
    setTimeout(() => {
      const demoSigns = [
      {
        text: 'Hello, nice to meet you',
        emotion: 'happy' as const
      },
      {
        text: 'Can you help me please?',
        emotion: 'neutral' as const
      },
      {
        text: 'I am not happy with this',
        emotion: 'angry' as const
      },
      {
        text: 'Thank you very much',
        emotion: 'happy' as const
      }];

      const demo = demoSigns[Math.floor(Math.random() * demoSigns.length)];
      setDetectedText(demo.text);
      setDetectedEmotion(demo.emotion);
      setIsProcessing(false);
      // Generate speech
      speakText(demo.text, demo.emotion);
    }, 2000);
  };
  const stopCapture = () => {
    setIsCapturing(false);
    setIsProcessing(false);
  };
  const speakText = (text: string, emotion: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      // Adjust speech parameters based on emotion
      switch (emotion) {
        case 'happy':
          utterance.pitch = 1.2;
          utterance.rate = 1.1;
          break;
        case 'sad':
          utterance.pitch = 0.8;
          utterance.rate = 0.9;
          break;
        case 'angry':
          utterance.pitch = 0.9;
          utterance.rate = 1.2;
          utterance.volume = 0.9;
          break;
        default:
          utterance.pitch = 1;
          utterance.rate = 1;
      }
      window.speechSynthesis.speak(utterance);
    }
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Sign to Speech
        </h1>
        <p className="text-gray-600">
          Sign in front of your camera and hear it spoken aloud
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Sign Language
            </label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              
              <option value="ASL">American Sign Language (ASL)</option>
              <option value="ISL">Indian Sign Language (ISL)</option>
              <option value="BSL">British Sign Language (BSL)</option>
              <option value="AUSLAN">Australian Sign Language (AUSLAN)</option>
            </select>
          </div>
          <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden mb-6">
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              className="w-full h-full object-cover"
              videoConstraints={{
                facingMode: 'user',
                width: 1280,
                height: 720
              }} />
            
            {isCapturing &&
            <div className="absolute top-4 right-4 flex items-center space-x-2 bg-red-500 text-white px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <span className="text-sm font-medium">Recording</span>
              </div>
            }
          </div>
          <div className="flex justify-center">
            <button
              onClick={isCapturing ? stopCapture : startCapture}
              disabled={isProcessing && !isCapturing}
              className={`px-8 py-4 rounded-lg font-semibold text-white transition-all duration-300 ${isCapturing ? 'bg-red-500 hover:bg-red-600' : 'bg-purple-600 hover:bg-purple-700'} ${isProcessing && !isCapturing ? 'opacity-50 cursor-not-allowed' : ''} shadow-lg`}>
              
              {isCapturing ?
              <div className="flex items-center space-x-2">
                  <StopCircleIcon className="w-5 h-5" />
                  <span>Stop Capture</span>
                </div> :

              <div className="flex items-center space-x-2">
                  <VideoIcon className="w-5 h-5" />
                  <span>Start Capture</span>
                </div>
              }
            </button>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Recognition Results
          </h2>
          {isProcessing && isCapturing &&
          <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mb-4" />
              <p className="text-gray-600">
                Analyzing sign language gestures...
              </p>
            </div>
          }
          {detectedText && !isProcessing &&
          <div className="space-y-6">
              <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Detected Text:
                </p>
                <p className="text-xl text-gray-900 font-semibold">
                  {detectedText}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-700">
                    Detected Emotion:
                  </span>
                  <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${detectedEmotion === 'happy' ? 'bg-green-100 text-green-800' : detectedEmotion === 'sad' ? 'bg-blue-100 text-blue-800' : detectedEmotion === 'angry' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                  
                    {detectedEmotion.charAt(0).toUpperCase() +
                  detectedEmotion.slice(1)}
                  </span>
                </div>
                <button
                onClick={() => speakText(detectedText, detectedEmotion)}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
                
                  <PlayIcon className="w-5 h-5" />
                  <span>Play Speech</span>
                </button>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> The speech is generated with emotional
                  tone matching the detected expression
                </p>
              </div>
            </div>
          }
          {!detectedText && !isProcessing &&
          <div className="flex items-center justify-center py-12 text-gray-400">
              <p>Start capturing to see results</p>
            </div>
          }
        </div>
      </div>
    </div>);

}