// 视频压缩 Worker

import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

let ffmpeg = null;

self.onmessage = async (event) => {
  const { chunk, index } = event.data;

  try {
    if (!ffmpeg) {
      ffmpeg = new FFmpeg();
      await ffmpeg.load({
        simd: true,
      });
    }

    const inputFileName = `input_${index}.mp4`;
    const outputFileName = `output_${index}.mp4`;

    // 使用 fetchFile 来处理文件
    await ffmpeg.writeFile(inputFileName, await fetchFile(chunk));

    await ffmpeg.exec([
      '-i', inputFileName,
      '-c:v', 'libx264',
      '-preset', 'veryfast',
      '-crf', '30',
      '-vf', 'scale=480:-2',
      '-c:a', 'aac',
      '-b:a', '96k',
      '-movflags', '+faststart',
      outputFileName
    ]);

    const compressedData = await ffmpeg.readFile(outputFileName);
    const compressedChunk = new Uint8Array(compressedData);

    const compressionRatio = 1 - (compressedChunk.length / chunk.size);

    // 清理临时文件
    await ffmpeg.deleteFile(inputFileName);
    await ffmpeg.deleteFile(outputFileName);

    self.postMessage({
      compressedChunk: compressedChunk.buffer,
      index: index,
      compressionRatio: compressionRatio
    }, [compressedChunk.buffer]);

  } catch (error) {
    console.error('视频chunk处理失败:', error);
    self.postMessage({ error: `文件处理失败: ${error.message}`, index });
  }
};

self.onerror = (error) => {
  console.error('Worker错误:', error);
  self.postMessage({ error: 'Worker内部错误，请检查存储空间和文件系统权限' });
};
