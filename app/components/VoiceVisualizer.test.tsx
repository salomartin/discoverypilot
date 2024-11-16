import { VoiceVisualizer } from './VoiceVisualizer';
import { expect, test } from 'bun:test';
import { render } from '@testing-library/react';
import { WavRecorder } from 'wavtools';
import { createRef } from 'react';

test('renders VoiceVisualizer component with quiet audio', () => {
  const wavRef = createRef<WavRecorder>();
  // Create ref with initial value instead of assigning to current
  const wavRecorder = new WavRecorder({ sampleRate: 24000 });
  const wavRefWithValue = { current: wavRecorder };

  const { container } = render(<VoiceVisualizer wavRef={wavRefWithValue} />);
    
  // Check that the bars are rendered
  const bars = container.querySelectorAll('.bar');
  expect(bars.length).toBeGreaterThan(0);

  // Check that each bar has a path with stroke-width and stroke-linecap
  bars.forEach((bar) => {
    expect(bar.getAttribute('stroke-width')).toBeDefined();
    expect(bar.getAttribute('stroke-linecap')).toBe('round');
  });
});