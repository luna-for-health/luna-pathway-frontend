import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('renders a type="button" by default, so it never submits a form by accident', () => {
    render(<Button>Continuer</Button>);
    expect(screen.getByRole('button', { name: 'Continuer' })).toHaveAttribute('type', 'button');
  });

  it('can be a submit button', () => {
    render(<Button type="submit">Envoyer</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  it('calls onClick', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Continuer</Button>);

    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled and not clickable while loading', async () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Continuer
      </Button>
    );
    const button = screen.getByRole('button');

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('data-loading', 'true');
    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('exposes its variant and size for styling', () => {
    render(
      <Button variant="outline" size="xl">
        Retour
      </Button>
    );
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-variant', 'outline');
    expect(button).toHaveAttribute('data-size', 'xl');
  });

  it('renders its child element instead of a button with asChild', () => {
    render(
      <Button asChild>
        <a href="/login">Se connecter</a>
      </Button>
    );
    const link = screen.getByRole('link', { name: 'Se connecter' });
    expect(link).toHaveAttribute('href', '/login');
    expect(link).not.toHaveAttribute('type');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
