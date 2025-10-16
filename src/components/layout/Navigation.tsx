import { useState } from 'react';
import { Button } from '@components/ui/Button';
import { cn } from '@utils/cn';

export interface NavItem {
  label: string;
  href: string;
}

interface NavigationProps {
  navItems: readonly NavItem[];
  cta: {
    label: string;
    href: string;
  };
}

export const Navigation = ({ navItems, cta }: NavigationProps) => {
  const [open, setOpen] = useState(false);

  const toggleMenu = () => setOpen((prev) => !prev);
  const closeMenu = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-6 py-5">
        <a href="/" className="flex items-center gap-3 text-primary" aria-label="Meu Nome OK">
          <img src="/icons/logo.png" alt="Meu Nome OK" className="h-10 w-auto" />
          <span className="font-display text-lg font-semibold">Meu Nome OK</span>
        </a>
        <nav aria-label="Principal" className="hidden items-center gap-6 md:flex">
          <ul className="flex items-center gap-4 text-sm font-medium text-neutral-700">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="rounded-full px-4 py-2 transition hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="hidden md:block">
          <Button href={cta.href} variant="primary" size="sm">
            {cta.label}
          </Button>
        </div>
        <div className="md:hidden">
          <button
            type="button"
            aria-label="Abrir menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={toggleMenu}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-primary shadow-sm transition hover:border-primary/40 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <span className="sr-only">Menu</span>
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </div>
      <div
        id="mobile-menu"
        className={cn(
          'md:hidden',
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        )}
        aria-hidden={!open}
      >
        <div className="mx-6 mb-4 rounded-3xl border border-neutral-100 bg-white p-6 shadow-soft">
          <ul className="flex flex-col gap-4 text-base font-medium text-neutral-700">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={closeMenu}
                  className="flex items-center justify-between rounded-full px-4 py-3 transition hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  {item.label}
                  <svg
                    className="h-4 w-4 text-primary"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m9 5 7 7-7 7" />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
          <Button className="mt-6 w-full" size="md" onClick={closeMenu} href={cta.href}>
            {cta.label}
          </Button>
        </div>
      </div>
    </header>
  );
};
