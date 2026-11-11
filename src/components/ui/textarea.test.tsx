import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Textarea } from '@/components/ui/textarea';

describe('Textarea', () => {
  it('lets the user type and calls onChange', async () => {
    const onChange = vi.fn();
    render(<Textarea aria-label="Votre histoire" onChange={onChange} />);
    const textarea = screen.getByLabelText('Votre histoire');

    await userEvent.type(textarea, 'Bonjour');
    expect(textarea).toHaveValue('Bonjour');
    expect(onChange).toHaveBeenCalledTimes(7);
  });

  it('starts on one row by default', () => {
    render(<Textarea aria-label="Histoire" />);
    expect(screen.getByLabelText('Histoire')).toHaveAttribute('rows', '1');
  });

  it('marks the field invalid on error', () => {
    render(<Textarea aria-label="Histoire" error />);
    expect(screen.getByLabelText('Histoire')).toHaveAttribute('aria-invalid', 'true');
  });

  it('keeps an empty field empty after measuring its placeholder', () => {
    render(<Textarea aria-label="Histoire" placeholder="Racontez-nous…" />);
    expect(screen.getByLabelText('Histoire')).toHaveValue('');
  });

  it('renders extra content under the field', () => {
    render(
      <Textarea aria-label="Histoire">
        <button type="button">Dicter</button>
      </Textarea>
    );
    expect(screen.getByRole('button', { name: 'Dicter' })).toBeInTheDocument();
  });

  it('supports both callback and object refs', () => {
    const callbackRef = vi.fn();
    const { unmount } = render(<Textarea aria-label="A" ref={callbackRef} />);
    expect(callbackRef).toHaveBeenCalledWith(screen.getByLabelText('A'));
    unmount();

    const objectRef = { current: null as HTMLTextAreaElement | null };
    render(<Textarea aria-label="B" ref={objectRef} />);
    expect(objectRef.current).toBe(screen.getByLabelText('B'));
  });
});
