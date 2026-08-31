'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TrendingUp } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Companies', path: '/companies' },
    { name: 'Compare', path: '/compare' },
    { name: 'About', path: '/about' },
  ];

  return (
    <header className="site-header">
      <div className="container">
        <nav className="nav-wrapper" aria-label="Main Navigation">
          <Link href="/" className="brand-logo" id="header-brand-logo">
            <div className="brand-icon">
              <TrendingUp size={22} />
            </div>
            <div>
              <span className="brand-title">
                Fin<span className="gradient-text">Scope</span>
              </span>
              <span className="brand-tagline-sm">Financial Data. Made Simple.</span>
            </div>
          </Link>

          <ul className="nav-links">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={`nav-link ${isActive ? 'active' : ''}`}
                    id={`nav-link-${item.name.toLowerCase()}`}
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
