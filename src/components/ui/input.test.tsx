import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Input } from '@/components/ui/input';

describe('Input', () => {
  it('links the label to the field', () => {
    render(<Input label="E-mail" />);
    expect(screen.getByLabelText('E-mail')).toBeInTheDocument();
  });

  it('calls onChange as the user types', async () => {
    const onChange = vi.fn();
    render(<Input label="E-mail" onChange={onChange} />);

    await userEvent.type(screen.getByLabelText('E-mail'), 'abc');
    expect(onChange).toHaveBeenCalledTimes(3);
    expect(screen.getByLabelText('E-mail')).toHaveValue('abc');
  });

  it('shows a clear button once there is a value, and clears the field', async () => {
    render(<Input label="E-mail" />);
    const input = screen.getByLabelText('E-mail');
    expect(screen.queryByRole('button', { name: 'Effacer' })).not.toBeInTheDocument();

    await userEvent.type(input, 'abc');
    await userEvent.click(screen.getByRole('button', { name: 'Effacer' }));

    expect(input).toHaveValue('');
    expect(input).toHaveFocus();
    expect(screen.queryByRole('button', { name: 'Effacer' })).not.toBeInTheDocument();
  });

  it('notifies onChange when cleared, so forms stay in sync', async () => {
    const onChange = vi.fn();
    render(<Input label="E-mail" defaultValue="abc" onChange={onChange} />);

    await userEvent.click(screen.getByRole('button', { name: 'Effacer' }));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0].target.value).toBe('');
  });

  it('shows the error message and marks the field invalid', () => {
    render(<Input label="E-mail" error="E-mail invalide" defaultValue="x" />);

    expect(screen.getByText('E-mail invalide')).toBeInTheDocument();
    expect(screen.getByLabelText('E-mail')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.queryByRole('button', { name: 'Effacer' })).not.toBeInTheDocument();
  });

  it('marks the field invalid without a message when error is true', () => {
    render(<Input label="E-mail" error />);
    expect(screen.getByLabelText('E-mail')).toHaveAttribute('aria-invalid', 'true');
  });

  it('toggles password visibility', async () => {
    render(<Input label="Mot de passe" type="password" />);
    const input = screen.getByLabelText('Mot de passe');
    expect(input).toHaveAttribute('type', 'password');

    await userEvent.click(screen.getByRole('button', { name: 'Afficher le mot de passe' }));
    expect(input).toHaveAttribute('type', 'text');

    await userEvent.click(screen.getByRole('button', { name: 'Masquer le mot de passe' }));
    expect(input).toHaveAttribute('type', 'password');
  });

  it('hides the clear and password buttons when disabled', () => {
    render(<Input label="Mot de passe" type="password" defaultValue="secret" disabled />);

    expect(screen.getByLabelText('Mot de passe')).toBeDisabled();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('follows a controlled value', () => {
    const { rerender } = render(<Input label="E-mail" value="" onChange={() => {}} />);
    expect(screen.queryByRole('button', { name: 'Effacer' })).not.toBeInTheDocument();

    rerender(<Input label="E-mail" value="abc" onChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'Effacer' })).toBeInTheDocument();
  });

  it('exposes the native input through its ref', () => {
    const ref = { current: null as HTMLInputElement | null };
    render(<Input label="E-mail" ref={ref} />);
    expect(ref.current).toBe(screen.getByLabelText('E-mail'));
  });
});
