// Mock Tesseract.js
jest.mock('tesseract.js', () => ({
  createWorker: () => ({
    loadLanguage: () => Promise.resolve(),
    initialize: () => Promise.resolve(),
    recognize: () => Promise.resolve({ data: { text: 'Test extracted text' } }),
    terminate: () => Promise.resolve(),
  }),
}));

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ImageToSpeech from '../components/ImageToSpeech';

// Mock URL.createObjectURL
const mockCreateObjectURL = jest.fn();
window.URL.createObjectURL = mockCreateObjectURL;

// Mock window.speechSynthesis
const mockSpeak = jest.fn();
window.speechSynthesis = {
  speak: mockSpeak,
} as any;

// Mock SpeechSynthesisUtterance
class MockSpeechSynthesisUtterance {
  text: string;
  constructor(text?: string) {
    this.text = text || '';
  }
}
// @ts-ignore
window.SpeechSynthesisUtterance = MockSpeechSynthesisUtterance;

describe('ImageToSpeech Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCreateObjectURL.mockReturnValue('mock-url');
  });

  test('renders without crashing', () => {
    render(<ImageToSpeech />);
  });

  test('displays file input', () => {
    render(<ImageToSpeech />);
    const fileInput = screen.getByLabelText(/upload image/i);
    expect(fileInput).toBeInTheDocument();
  });

  test('displays text area for extracted text', () => {
    render(<ImageToSpeech />);
    const textArea = screen.getByRole('textbox');
    expect(textArea).toBeInTheDocument();
  });

  test('displays audio player', () => {
    render(<ImageToSpeech />);
    const audioPlayer = screen.getByTestId('audio-player');
    expect(audioPlayer).toBeInTheDocument();
  });

  test('handles image upload and text extraction', async () => {
    render(<ImageToSpeech />);
    
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const fileInput = screen.getByLabelText(/upload image/i);
    
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    await waitFor(() => {
      const textArea = screen.getByRole('textbox');
      expect(textArea).toHaveValue('Test extracted text');
    });
  });

  test('converts text to speech when button is clicked', async () => {
    render(<ImageToSpeech />);
    
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const fileInput = screen.getByLabelText(/upload image/i);
    
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    await waitFor(() => {
      const convertButton = screen.getByText('Convert to Speech');
      expect(convertButton).not.toBeDisabled();
      fireEvent.click(convertButton);
      expect(mockSpeak).toHaveBeenCalled();
    });
  });
}); 