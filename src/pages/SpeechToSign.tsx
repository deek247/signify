import React, { useEffect, useState, useRef } from 'react';
import { MicIcon, StopCircleIcon, PlayIcon } from 'lucide-react';
import { Avatar } from '../components/Avatar';
export function SpeechToSign() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [emotion, setEmotion] = useState<'neutral' | 'happy' | 'sad' | 'angry'>(
    'neutral'
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('ASL');
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true
      });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const audioChunks: Blob[] = [];
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, {
          type: 'audio/wav'
        });
        processAudio(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Please allow microphone access to use this feature');
    }
  };
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };
  const processAudio = (audioBlob: Blob) => {
    setIsProcessing(true);
    // Simulate audio processing and emotion detection
    setTimeout(() => {
      const demoTranscripts = [
      {
        text: 'Hello, how are you today?',
        emotion: 'happy' as const
      },
      {
        text: 'I need help with my account',
        emotion: 'neutral' as const
      },
      {
        text: 'This is very frustrating',
        emotion: 'angry' as const
      },
      {
        text: 'Thank you so much for your help',
        emotion: 'happy' as const
      }];

      const demo =
      demoTranscripts[Math.floor(Math.random() * demoTranscripts.length)];
      setTranscript(demo.text);
      setEmotion(demo.emotion);
      setIsProcessing(false);
    }, 1500);
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Speech to Sign Language
        </h1>
        <p className="text-gray-600">
          Speak into your microphone and see it translated to sign language
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
          <div className="flex flex-col items-center space-y-6">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isProcessing}
              className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${isRecording ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-blue-600 hover:bg-blue-700'} ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''} shadow-lg`}>
              
              {isRecording ?
              <StopCircleIcon className="w-16 h-16 text-white" /> :

              <MicIcon className="w-16 h-16 text-white" />
              }
            </button>
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-900">
                {isRecording ?
                'Recording...' :
                isProcessing ?
                'Processing...' :
                'Tap to Start Speaking'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {isRecording ?
                'Tap again to stop' :
                'Your speech will be converted to sign language'}
              </p>
            </div>
            {transcript &&
            <div className="w-full bg-gray-50 rounded-lg p-6 border border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Transcript:
                </p>
                <p className="text-lg text-gray-900">{transcript}</p>
                <div className="mt-4 flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">
                    Detected Emotion:
                  </span>
                  <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${emotion === 'happy' ? 'bg-green-100 text-green-800' : emotion === 'sad' ? 'bg-blue-100 text-blue-800' : emotion === 'angry' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                  
                    {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
                  </span>
                </div>
              </div>
            }
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">AI Avatar</h2>
          <Avatar
            emotion={emotion}
            isActive={transcript !== ''}
            language={selectedLanguage} />
          
          {transcript &&
          <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                The avatar is signing with {emotion} expression in{' '}
                {selectedLanguage}
              </p>
            </div>
          }
        </div>
      </div>
    </div>);

}