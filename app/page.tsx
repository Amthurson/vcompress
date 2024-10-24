"use client";

import TypingAnimation from "@/components/ui/typing-animation";
import { useState, useEffect } from "react";
import { compressImage, compressVideo } from "./compress";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [compressedFile, setCompressedFile] = useState<File | null>(null);
  const [compressionProgress, setCompressionProgress] = useState<number>(0);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [compressedImageUrl, setCompressedImageUrl] = useState<string | null>(null);
  const [compressedVideoUrl, setCompressedVideoUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'image' | 'video'>('image');
  const [error, setError] = useState<string | null>(null);
  const [timer, setTimer] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [showConfigPanel, setShowConfigPanel] = useState<boolean>(false);
  const [imageConfig, setImageConfig] = useState({
    maxSizeMB: 2,
    minSizeMB: 1,
    maxWidthOrHeight: 1280,
    initialQuality: 0.7,
  });
  const [videoConfig, setVideoConfig] = useState({
    preset: 'ultrafast',
    crf: '35',
    scale: '-2:1280',
    audioBitrate: '128k'
  });

  const presetOptions = [
    'ultrafast', 'superfast', 'veryfast', 'faster', 'fast', 'medium', 'slow', 'slower', 'veryslow'
  ];

  useEffect(() => {
    return () => {
      if (originalImageUrl) URL.revokeObjectURL(originalImageUrl);
      if (compressedImageUrl) URL.revokeObjectURL(compressedImageUrl);
      if (compressedVideoUrl) URL.revokeObjectURL(compressedVideoUrl);
    };
  }, [originalImageUrl, compressedImageUrl, compressedVideoUrl]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const onProgress = (progress: number) => {
    setCompressionProgress(progress);
  };

  const [loading, setLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type.startsWith('image/') || file.type.startsWith('video/'))) {
      setSelectedFile(file);
      setCompressionProgress(0);
      setCompressedFile(null);
      setOriginalImageUrl(null);
      setCompressedImageUrl(null);
      setCompressedVideoUrl(null);
      setError(null);
      setTimer(0);
      
      if (file.type.startsWith('image/')) {
        setActiveTab('image');
        const reader = new FileReader();
        reader.onload = (e) => {
          setOriginalImageUrl(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else if (file.type.startsWith('video/')) {
        setActiveTab('video');
      }
    } else {
      setError('请选择图片或视频文件');
    }
  };

  const handleCompression = async () => {
    if (!selectedFile) {
      setError('请先选择文件');
      return;
    }

    setLoading(true);
    setIsTimerRunning(true);
    setError(null);

    try {
      if (selectedFile.type.startsWith('image/')) {
        const compressed = await compressImage(selectedFile, {
          ...imageConfig,
          onProgress: (progress: number) => setCompressionProgress(progress),
        });
        setCompressedFile(compressed);
        const compressedUrl = URL.createObjectURL(compressed);
        setCompressedImageUrl(compressedUrl);
      } else if (selectedFile.type.startsWith('video/')) {
        const compressed = await compressVideo(selectedFile, onProgress, videoConfig);
        const compressedVideoUrl = URL.createObjectURL(compressed);
        setCompressedFile(new File([compressed], selectedFile.name, { type: 'video/mp4' }));
        setCompressedVideoUrl(compressedVideoUrl);
      }
    } catch (error) {
      console.error('压缩失败:', error);
      setError('文件压缩失败，可能是由于FS错误。请确保您有足够的存储空间，并且文件系统权限正确。');
    } finally {
      setLoading(false);
      setIsTimerRunning(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if(!bytes) return '0 Bytes';
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleImageConfigChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setImageConfig(prev => ({ ...prev, [name]: parseFloat(value) }));
  };

  const handleVideoConfigChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setVideoConfig(prev => ({ ...prev, [name]: value }));
  };

  const handleConfigSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfigPanel(false);
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <TypingAnimation text="文件压缩" className="text-4xl font-bold" />
        <div className="flex gap-4 mb-4">
          <button
            className={`px-4 py-2 rounded ${activeTab === 'image' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('image')}
          >
            图片压缩
          </button>
          <button
            className={`px-4 py-2 rounded ${activeTab === 'video' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('video')}
          >
            视频压缩
          </button>
          <button
            className="px-4 py-2 rounded bg-green-500 text-white"
            onClick={() => setShowConfigPanel(!showConfigPanel)}
          >
            压缩配置
          </button>
        </div>
        {showConfigPanel && (
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="text-lg font-bold mb-2">{activeTab === 'image' ? '图片' : '视频'}压缩配置</h3>
            <form onSubmit={handleConfigSubmit}>
              {activeTab === 'image' ? (
                <>
                  <div className="mb-2">
                    <label className="block">最大大小 (MB)：</label>
                    <input type="number" name="maxSizeMB" value={imageConfig.maxSizeMB} onChange={handleImageConfigChange} className="border rounded px-2 py-1" />
                  </div>
                  <div className="mb-2">
                    <label className="block">最小大小 (MB)：</label>
                    <input type="number" name="minSizeMB" value={imageConfig.minSizeMB} onChange={handleImageConfigChange} className="border rounded px-2 py-1" />
                  </div>
                  <div className="mb-2">
                    <label className="block">最大宽度或高度：</label>
                    <input type="number" name="maxWidthOrHeight" value={imageConfig.maxWidthOrHeight} onChange={handleImageConfigChange} className="border rounded px-2 py-1" />
                  </div>
                  <div className="mb-2">
                    <label className="block">初始质量：</label>
                    <input type="number" name="initialQuality" value={imageConfig.initialQuality} onChange={handleImageConfigChange} step="0.1" min="0" max="1" className="border rounded px-2 py-1" />
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-2">
                    <label className="block">预设：</label>
                    <select name="preset" value={videoConfig.preset} onChange={handleVideoConfigChange} className="border rounded px-2 py-1">
                      {presetOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-2">
                    <label className="block">CRF：</label>
                    <input type="text" name="crf" value={videoConfig.crf} onChange={handleVideoConfigChange} className="border rounded px-2 py-1" />
                  </div>
                  <div className="mb-2">
                    <label className="block">缩放：</label>
                    <input type="text" name="scale" value={videoConfig.scale} onChange={handleVideoConfigChange} className="border rounded px-2 py-1" />
                  </div>
                  <div className="mb-2">
                    <label className="block">音频比特率：</label>
                    <input type="text" name="audioBitrate" value={videoConfig.audioBitrate} onChange={handleVideoConfigChange} className="border rounded px-2 py-1" />
                  </div>
                </>
              )}
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">确定</button>
            </form>
          </div>
        )}
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">选择{activeTab === 'image' ? '图片' : '视频'}文件</li>
          <li>点击开始压缩按钮</li>
          <li>等待压缩完成并查看结果</li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <label className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44 cursor-pointer">
            选择文件
            <input
              type="file"
              accept={activeTab === 'image' ? "image/*" : "video/*"}
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          <button
            onClick={handleCompression}
            disabled={!selectedFile || loading}
            className={`rounded-full border border-solid transition-colors flex items-center justify-center text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44 ${
              !selectedFile || loading
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            开始压缩
          </button>
        </div>
        {loading && <p className="text-blue-500">压缩中...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <p className="text-blue-500">压缩时间: {formatTime(timer)}</p>
        {selectedFile && (
          <div className="mt-4 text-sm w-full">
            <p>原始文件: {selectedFile.name} ({formatFileSize(selectedFile.size)})</p>
            {compressionProgress > 0 && compressionProgress < 100 && (
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full relative" 
                  style={{width: `${compressionProgress}%`}}
                >
                  <span className="absolute top-2.5 left-1/2 transform -translate-x-1/2 text-xs text-blue-600">
                    {compressionProgress.toFixed(2)}%
                  </span>
                </div>
              </div>
            )}
            {compressedFile && (
              <p>
                压缩后文件大小: {formatFileSize(compressedFile.size)}
                (压缩率: {((1 - (compressedFile.size) / selectedFile.size) * 100).toFixed(2)}%)
              </p>
            )}
          </div>
        )}
        {activeTab === 'image' && originalImageUrl && compressedImageUrl && (
          <div className="mt-4 w-full flex justify-center gap-4 flex-wrap">
            <div className="flex flex-col items-center">
              <p className="mb-2">原始图片</p>
              <img src={originalImageUrl} alt="原始图片" className="max-h-[60vh] object-contain" />
            </div>
            <div className="flex flex-col items-center">
              <p className="mb-2">压缩后图片</p>
              <img src={compressedImageUrl} alt="压缩后的图片" className="max-h-[60vh] object-contain" />
            </div>
          </div>
        )}
        {activeTab === 'video' && compressedVideoUrl && (
          <div className="mt-4 w-full flex justify-center">
            <div className="flex flex-col items-center">
              <p className="mb-2">压缩后视频</p>
              <video src={compressedVideoUrl} controls className="max-h-[60vh] max-w-full" />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
