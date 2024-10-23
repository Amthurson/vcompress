// Worker 文件代码（compressWorker.js）
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const compressVideoWorker = (inputFile) => {
  return new Promise((resolve, reject) => {
    const worker = new Worker('worker.js');
    worker.postMessage(inputFile);

    worker.onmessage = (event) => {
      resolve(event.data);
    };

    worker.onerror = (error) => {
      reject(error);
    };
  });
};

export default compressVideoWorker;