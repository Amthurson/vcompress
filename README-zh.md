# 视频压缩

[打开使用](https://jayanderson-vcompress.deno.dev/)

[English](README.md) | [中文](README-zh.md)

## 项目描述

- 使用 ffmpeg.wasm 进行视频压缩
- 使用 browser-image-compression 进行图片压缩

## 项目仓库

- [Github](https://github.com/xingyuan-chen/video-compress)

## 功能特性

### 图片压缩
- 支持多种图片格式的压缩
- 可配置的压缩参数：
  - 最大文件大小（MB）
  - 最小文件大小（MB）
  - 最大宽度/高度
  - 初始压缩质量（0-1）
- 实时预览压缩结果
- 显示压缩比率和文件大小变化

### 视频压缩
- 基于 ffmpeg.wasm 实现
- 可配置压缩参数：
  - 预设模式(preset): ultrafast - veryslow
  - CRF 值: 控制视频质量
  - 分辨率缩放
  - 音频比特率
- 实时显示压缩进度
- 支持压缩前后预览对比

### 使用说明

1. 选择文件
- 点击"选择文件"按钮或拖拽文件到指定区域
- 支持图片格式: jpg、png、webp等
- 支持视频格式: mp4、webm等

2. 选择压缩模式
- 点击"图片压缩"或"视频压缩"标签切换模式
- 点击"压缩配置"按钮可调整压缩参数

3. 配置压缩参数
图片压缩参数:
- 最大文件大小: 设置压缩后的最大体积(MB)
- 最小文件大小: 设置压缩的下限(MB)
- 最大宽高: 限制图片的最大尺寸
- 压缩质量: 设置初始压缩质量(0-1)

视频压缩参数:
- 预设模式: 从ultrafast到veryslow,压缩速度由快到慢
- CRF值: 0-51,值越大压缩率越高,质量越低
- 分辨率: 设置输出视频的分辨率
- 音频比特率: 设置音频压缩质量

4. 开始压缩
- 点击"开始压缩"按钮执行压缩
- 界面实时显示压缩进度
- 压缩完成后可预览和下载压缩结果

5. 查看结果
- 支持压缩前后的预览对比
- 显示文件大小变化和压缩比率
- 点击"下载"按钮保存压缩后的文件

### 图片压缩用法代码示例
```js
import { compressImage } from './compress';

const file = new File([], 'example.jpg', { type: 'image/jpeg' });
const options = {
  maxSizeMB: 2,
  minSizeMB: 1,
  maxWidthOrHeight: 1280,
  initialQuality: 0.7,
};
const compressedFile = await compressImage(file, options);
```

### 视频压缩用法代码示例
```js
import { compressVideo } from './compress';

const file = new File([], 'example.mp4', { type: 'video/mp4' });
const options = {
  preset: 'ultrafast',
  crf: 23,
  resolution: '1280x720',
  audioBitrate: '128k',
};
const compressedFile = await compressVideo(file, options);
```
