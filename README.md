# Video Compress

[click and use](https://jayanderson-vcompress.deno.dev/)

[English](README.md) | [中文](README-zh.md)

## Project Description

- Using ffmpeg.wasm for video compression
- Using browser-image-compression for image compression

## Project Repository

- [Github](https://github.com/xingyuan-chen/video-compress)

## Features

### Image Compression
- Supports compression of multiple image formats
- Configurable compression parameters:
  - Maximum file size (MB)
  - Minimum file size (MB)
  - Maximum width/height
  - Initial compression quality (0-1)
- Real-time preview of compression results
- Display of compression ratio and file size changes

### Video Compression
- Based on ffmpeg.wasm implementation
- Configurable compression parameters:
  - Preset mode: ultrafast - veryslow
  - CRF value: controls video quality
  - Resolution scaling
  - Audio bitrate
- Real-time compression progress display
- Support for before/after compression preview comparison

### Usage Instructions

1. Select File
- Click "Select File" button or drag and drop files to designated area
- Supported image formats: jpg, png, webp, etc.
- Supported video formats: mp4, webm, etc.

2. Choose Compression Mode
- Click "Image Compression" or "Video Compression" tab to switch modes
- Click "Compression Settings" button to adjust compression parameters

3. Configure Compression Parameters
Image compression parameters:
- Maximum file size: Set maximum output size (MB)
- Minimum file size: Set compression lower limit (MB)
- Maximum dimensions: Limit maximum image dimensions
- Compression quality: Set initial compression quality (0-1)

Video compression parameters:
- Preset mode: From ultrafast to veryslow, compression speed from fast to slow
- CRF value: 0-51, higher value means higher compression ratio but lower quality
- Resolution: Set output video resolution
- Audio bitrate: Set audio compression quality

4. Start Compression
- Click "Start Compression" button to execute compression
- Interface displays compression progress in real-time
- Preview and download compressed results after completion

5. View Results
- Support before/after compression preview comparison
- Display file size changes and compression ratio
- Click "Download" button to save compressed file

### Image Compression Code Example
