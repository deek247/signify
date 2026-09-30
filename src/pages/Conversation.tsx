import React, { useState, useRef } from 'react';
import {
  MicIcon,
  StopCircleIcon,
  VideoIcon,
  PlayIcon,
  ArrowRightIcon,
  ArrowLeftIcon } from
'lucide-react';
import Webcam from 'react-webcam';
import { Avatar } from '../components/Avatar';
export function Conversation() {
  const [mode, setMode] = useState<'speech-to-sign' | 'sign-to-speech'>(
    'speech-to-sign'
  );
  const [isRecording, setIsRecording] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [detectedText, setDetectedText] = useState('');
  const [emotion, setEmotion] = useState<'neutral' | 'happy' | 'sad' | 'angry'>(
    'neutral'
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('ASL');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const webcamRef = useRef<Webcam>(null);
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
  const startCapture = () => {
    setIsCapturing(true);
    setIsProcessing(true);
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
      setEmotion(demo.emotion);
      setIsProcessing(false);
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
        <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
          Start a Conversation
        </h1>
        <p className="text-gray-300 text-lg">
          Choose your communication mode and start translating
        </p>
      </div>

      <div className="flex justify-center mb-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-2 border border-gray-700 inline-flex space-x-2">
          <button
            onClick={() => setMode('speech-to-sign')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2 ${mode === 'speech-to-sign' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}>
            
            <MicIcon className="w-5 h-5" />
            <span>Speech to Sign</span>
            <ArrowRightIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMode('sign-to-speech')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2 ${mode === 'sign-to-speech' ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/50' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}>
            
            <ArrowLeftIcon className="w-4 h-4" />
            <span>Sign to Speech</span>
            <VideoIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {mode === 'speech-to-sign' ?
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl p-8 border border-gray-700 hover:border-purple-500/50 transition-all duration-300">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select Sign Language
              </label>
              <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white transition-all duration-300">
              
                <option value="ASL">American Sign Language (ASL)</option>
                <option value="ISL">Indian Sign Language (ISL)</option>
                <option value="BSL">British Sign Language (BSL)</option>
                <option value="AUSLAN">
                  Australian Sign Language (AUSLAN)
                </option>
                <option value="ESL">Emirati Sign Language (ESL)</option>
              </select>
            </div>

            <div className="flex flex-col items-center space-y-6">
              <button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isProcessing}
              className={`w-36 h-36 rounded-full flex items-center justify-center transition-all duration-300 ${isRecording ? 'bg-gradient-to-br from-red-500 to-red-700 animate-pulse shadow-2xl shadow-red-500/50' : 'bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-xl shadow-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/70 hover:scale-110'} ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}>
              
                {isRecording ?
              <StopCircleIcon className="w-20 h-20 text-white" /> :

              <MicIcon className="w-20 h-20 text-white" />
              }
              </button>

              <div className="text-center">
                <p className="text-xl font-semibold text-white">
                  {isRecording ?
                'Recording...' :
                isProcessing ?
                'Processing...' :
                'Tap to Start Speaking'}
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  {isRecording ?
                'Tap again to stop' :
                'Your speech will be converted to sign language'}
                </p>
              </div>

              {transcript &&
            <div className="w-full bg-gray-900/50 rounded-lg p-6 border border-purple-500/30 backdrop-blur-sm">
                  <p className="text-sm font-medium text-gray-400 mb-2">
                    Transcript:
                  </p>
                  <p className="text-lg text-white mb-4">{transcript}</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-400">
                      Detected Emotion:
                    </span>
                    <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${emotion === 'happy' ? 'bg-green-500/20 text-green-400 border border-green-500/50' : emotion === 'sad' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50' : emotion === 'angry' ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'bg-gray-500/20 text-gray-400 border border-gray-500/50'}`}>
                  
                      {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
                    </span>
                  </div>
                </div>
            }
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl p-8 border border-gray-700 hover:border-pink-500/50 transition-all duration-300">
            <h2 className="text-2xl font-bold text-white mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              AI Avatar
            </h2>
            <Avatar
            emotion={emotion}
            isActive={transcript !== ''}
            language={selectedLanguage} />
          
            {transcript &&
          <div className="mt-6 text-center bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg p-4 border border-purple-500/30">
                <p className="text-sm text-gray-300">
                  The avatar is signing with{' '}
                  <span className="text-purple-400 font-semibold">
                    {emotion}
                  </span>{' '}
                  expression in{' '}
                  <span className="text-pink-400 font-semibold">
                    {selectedLanguage}
                  </span>
                </p>
              </div>
          }
          </div>
        </div> :

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl p-8 border border-gray-700 hover:border-blue-500/50 transition-all duration-300">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select Sign Language
              </label>
              <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white transition-all duration-300">
              
                <option value="ASL">American Sign Language (ASL)</option>
                <option value="ISL">Indian Sign Language (ISL)</option>
                <option value="BSL">British Sign Language (BSL)</option>
                <option value="AUSLAN">
                  Australian Sign Language (AUSLAN)
                </option>
                <option value="ESL">Emirati Sign Language (ESL)</option>
              </select>
            </div>

            <div className="relative aspect-video bg-gray-950 rounded-lg overflow-hidden mb-6 border border-gray-700 shadow-xl">
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
            <div className="absolute top-4 right-4 flex items-center space-x-2 bg-red-500 text-white px-3 py-2 rounded-full shadow-lg shadow-red-500/50 animate-pulse">
                  <div className="w-2 h-2 bg-white rounded-full" />
                  <span className="text-sm font-medium">Recording</span>
                </div>
            }
            </div>

            <div className="flex justify-center">
              <button
              onClick={isCapturing ? stopCapture : startCapture}
              disabled={isProcessing && !isCapturing}
              className={`px-8 py-4 rounded-lg font-semibold text-white transition-all duration-300 ${isCapturing ? 'bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 shadow-lg shadow-red-500/50' : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-500/70 hover:scale-105'} ${isProcessing && !isCapturing ? 'opacity-50 cursor-not-allowed' : ''}`}>
              
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

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl p-8 border border-gray-700 hover:border-cyan-500/50 transition-all duration-300">
            <h2 className="text-2xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Recognition Results
            </h2>

            {isProcessing && isCapturing &&
          <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-t-2 border-blue-500 mb-4 shadow-lg shadow-blue-500/50" />
                <p className="text-gray-300">
                  Analyzing sign language gestures...
                </p>
              </div>
          }

            {detectedText && !isProcessing &&
          <div className="space-y-6">
                <div className="bg-blue-900/30 rounded-lg p-6 border border-blue-500/30 backdrop-blur-sm">
                  <p className="text-sm font-medium text-gray-400 mb-2">
                    Detected Text:
                  </p>
                  <p className="text-xl text-white font-semibold">
                    {detectedText}
                  </p>
                </div>

                <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-gray-400">
                      Detected Emotion:
                    </span>
                    <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${emotion === 'happy' ? 'bg-green-500/20 text-green-400 border border-green-500/50' : emotion === 'sad' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50' : emotion === 'angry' ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'bg-gray-500/20 text-gray-400 border border-gray-500/50'}`}>
                  
                      {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
                    </span>
                  </div>

                  <button
                onClick={() => speakText(detectedText, emotion)}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-4 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-500/70 hover:scale-105">
                
                    <PlayIcon className="w-5 h-5" />
                    <span>Play Speech</span>
                  </button>
                </div>

                <div className="bg-cyan-900/20 rounded-lg p-4 border border-cyan-500/30">
                  <p className="text-sm text-cyan-300">
                    <strong>Note:</strong> The speech is generated with
                    emotional tone matching the detected expression
                  </p>
                </div>
              </div>
          }

            {!detectedText && !isProcessing &&
          <div className="flex items-center justify-center py-12 text-gray-500">
                <p>Start capturing to see results</p>
              </div>
          }
          </div>
        </div>
      }
    </div>);

}