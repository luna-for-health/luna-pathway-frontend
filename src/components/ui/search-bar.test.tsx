import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { SearchBar } from '@/components/ui/search-bar';

describe('SearchBar', () => {
  it('uses "Rechercher" as the default placeholder', () => {
    render(<SearchBar />);
    expect(screen.getByPlaceholderText('Rechercher')).toHaveAttribute('type', 'search');
  });

  it('calls onChange and shows a clear button while typing', async () => {
    const onChange = vi.fn();
    render(<SearchBar aria-label="Rechercher une patiente" onChange={onChange} />);
    const input = screen.getByLabelText('Rechercher une patiente');

    await userEvent.type(input, 'emi');
    expect(onChange).toHaveBeenCalledTimes(3);
    expect(screen.getByRole('button', { name: 'Effacer la recherche' })).toBeInTheDocument();
  });

  it('clears the search and notifies onChange', async () => {
    const onChange = vi.fn();
    render(<SearchBar aria-label="Recherche" defaultValue="emi" onChange={onChange} />);
    const input = screen.getByLabelText('Recherche');

    await userEvent.click(screen.getByRole('button', { name: 'Effacer la recherche' }));

    expect(input).toHaveValue('');
    expect(input).toHaveFocus();
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('button', { name: 'Effacer la recherche' })).not.toBeInTheDocument();
  });

  it('has no clear button when disabled', () => {
    render(<SearchBar aria-label="Recherche" defaultValue="emi" disabled />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('follows a controlled value', () => {
    const { rerender } = render(<SearchBar aria-label="Recherche" value="" onChange={() => {}} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();

    rerender(<SearchBar aria-label="Recherche" value="emi" onChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'Effacer la recherche' })).toBeInTheDocument();
  });
});
