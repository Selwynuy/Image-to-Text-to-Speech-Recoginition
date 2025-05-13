# Image to Speech Converter

A modern web app to extract text from images and convert it to speech, built with React, TypeScript, Tailwind CSS, and Tesseract.js.

## Features
- Upload an image and extract text using OCR (Tesseract.js)
- Convert extracted text to speech using your browser's voices
- Modern, responsive UI with voice selection and speech controls
- Built with best practices and a clean, accessible design

## Getting Started

1. **Clone the repo:**
   ```bash
   git clone https://github.com/yourusername/image-to-speech.git
   cd image-to-speech
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the app:**
   ```bash
   npm start
   ```

4. **Open in your browser:**
   - Go to [http://localhost:3000](http://localhost:3000)

## How This Code Works

### Architecture & Main Components
- **App.tsx**: The main entry point. Renders the header and the `ImageToSpeech` component.
- **ImageToSpeech.tsx**: Handles all core functionality:
  - **Image Upload**: Lets users upload an image. Shows a preview in a styled box.
  - **OCR (Text Extraction)**: Uses Tesseract.js to extract text from the uploaded image asynchronously.
  - **Text Display**: Shows the extracted text in a static, styled box next to the image.
  - **Text-to-Speech**: Uses the Web Speech API to convert the extracted text to speech. Users can select a voice, and control playback (play, pause, resume, stop).
  - **Modern UI**: Uses Tailwind CSS for a responsive, accessible, and visually appealing layout.

### Flow
1. User uploads an image (or drags and drops).
2. The app shows a preview and starts OCR processing.
3. Extracted text appears in the right box.
4. User selects a voice and clicks "Convert to Speech" to hear the text spoken aloud.
5. Playback controls allow pausing, resuming, or stopping the speech.

## Tech Stack
- React + TypeScript
- Tailwind CSS
- Tesseract.js
- Web Speech API

---

