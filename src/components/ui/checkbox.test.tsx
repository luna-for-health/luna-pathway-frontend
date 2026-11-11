import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Checkbox } from '@/components/ui/checkbox';

describe('Checkbox', () => {
  it('toggles when its label is clicked', async () => {
    const onChange = vi.fn();
    render(<Checkbox label="J’accepte" onChange={onChange} />);
    const checkbox = screen.getByRole('checkbox', { name: 'J’accepte' });

    expect(checkbox).not.toBeChecked();
    await userEvent.click(screen.getByText('J’accepte'));
    expect(checkbox).toBeChecked();
    expect(onChange).toHaveBeenCalledTimes(1);

    await userEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it('starts checked with defaultChecked', () => {
    render(<Checkbox label="J’accepte" defaultChecked />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('follows a controlled value', () => {
    const { rerender } = render(<Checkbox label="J’accepte" checked={false} onChange={() => {}} />);
    expect(screen.getByRole('checkbox')).not.toBeChecked();

    rerender(<Checkbox label="J’accepte" checked onChange={() => {}} />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('sets the native indeterminate state', () => {
    const { rerender } = render(<Checkbox label="Tout" indeterminate />);
    expect((screen.getByRole('checkbox') as HTMLInputElement).indeterminate).toBe(true);

    rerender(<Checkbox label="Tout" indeterminate={false} />);
    expect((screen.getByRole('checkbox') as HTMLInputElement).indeterminate).toBe(false);
  });

  it('cannot be toggled when disabled', async () => {
    const onChange = vi.fn();
    render(<Checkbox label="J’accepte" disabled onChange={onChange} />);

    await userEvent.click(screen.getByRole('checkbox'));
    expect(screen.getByRole('checkbox')).not.toBeChecked();
    expect(onChange).not.toHaveBeenCalled();
  });
});
