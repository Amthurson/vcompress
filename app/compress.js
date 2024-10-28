// 图片压缩封装 (使用 browser-image-compression)
import imageCompression from 'browser-image-compression';
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile } from '@ffmpeg/util'

/**
 * 压缩图片文件
 * @param {File} file - 需要压缩的图片文件
 * @param {Object} options - 压缩选项参数
 * @returns {Promise<File>} - 压缩后的图片文件
 */
export async function compressImage(file, options = {}) {
  const defaultOptions = {
    maxSizeMB: 2,
    minSizeMB: 1,
    maxWidthOrHeight: 1280,
    useWebWorker: true,
    initialQuality: 0.7,
  };

  const compressOptions = { ...defaultOptions, ...options };

  try {
    const compressedFile = await imageCompression(file, compressOptions);
    return compressedFile;
  } catch (error) {
    console.error('图片压缩失败:', error);
    throw new Error('图片压缩失败：请确保有足够的存储空间，并且文件系统权限正确。详细错误：' + error.message);
  }
}

// 视频压缩封装 (使用 ffmpeg.wasm)
let ffmpeg = null;
/**
 * 压缩视频文件
 * @param {File} file - 需要压缩的视频文件
 * @param {Function} onProgress - 进度回调函数
 * @param {Object} options - 压缩选项参数
 * @returns {Promise<Blob>} - 压缩后的二进制视频 Blob
 */
export async function compressVideo(file, onProgress, options = {}) {
    if (!ffmpeg) {
      try {
        ffmpeg = new FFmpeg();
        ffmpeg.on('progress', (progressState) => {
          if (onProgress) {
            const { progress } = progressState
            onProgress(Math.min(progress * 100, 100));
          }
        });
        await ffmpeg.load({
          simd: true,
        });
      } catch (error) {
        console.error('FFmpeg 加载失败:', error);
        throw new Error('视频压缩初始化失败：请确保有足够的存储空间，并且文件系统权限正确。详细错误：' + error.message);
      }
    }
  
    const defaultOptions = {
      preset: 'ultrafast',
      crf: '35',
      scale: '-2:1280',
      audioBitrate: '128k'
    };

    const compressOptions = { ...defaultOptions, ...options };

    try {
      const fileName = file.name;
      await ffmpeg.writeFile(fileName, await fetchFile(file));
      
      const ffmpegArgs = ['-i', fileName, '-c:v', 'libx264', '-movflags', '+faststart'];

      if (compressOptions.preset) {
        ffmpegArgs.push('-preset', compressOptions.preset);
      }
      if (compressOptions.crf) {
        ffmpegArgs.push('-crf', compressOptions.crf);
      }
      if (compressOptions.scale) {
        ffmpegArgs.push('-vf', `scale=${compressOptions.scale}`);
      }
      if (compressOptions.audioBitrate) {
        ffmpegArgs.push('-c:a', 'aac', '-b:a', compressOptions.audioBitrate);
      }

      ffmpegArgs.push('output.mp4');

      await ffmpeg.exec(ffmpegArgs);
    
      const data = await ffmpeg.readFile('output.mp4');
      return new Blob([data], { type: 'video/mp4' });
    } catch (error) {
      console.error('视频压缩失败:', error);
      throw new Error('视频压缩失败：请确保有足够的存储空间，并且文件系统权限正确。详细错误：' + error.message);
    } finally {
      try {
        await ffmpeg.deleteFile(file.name);
        await ffmpeg.deleteFile('output.mp4');
      } catch (cleanupError) {
        console.warn('清理临时文件失败:', cleanupError);
      }
    }
  }

