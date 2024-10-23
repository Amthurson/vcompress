// 实际的 Worker 代码（worker.js）
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

self.onmessage = async (event) => {
  const inputFile = event.data;
  const ffmpeg = createFFmpeg({ log: true });
  await ffmpeg.load();

  // 将输入文件加载到 ffmpeg 的虚拟文件系统中
  ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(inputFile));

  // 使用 H.264 编码器并设定较低的比特率来压缩视频
  await ffmpeg.run('-i', 'input.mp4', '-b:v', '500k', '-vf', 'scale=-2:480', '-preset', 'veryfast', 'output.mp4');

  // 从虚拟文件系统中获取压缩后的视频文件
  const data = ffmpeg.FS('readFile', 'output.mp4');

  // 将输出转换为 Blob 并发送回主线程
  const videoBlob = new Blob([data.buffer], { type: 'video/mp4' });
  postMessage(videoBlob);
};