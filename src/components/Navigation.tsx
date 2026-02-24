'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Activity, MessageSquare, Map, User } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/diseases', label: 'Diseases', icon: Activity },
  { href: '/chat', label: 'AI Chat', icon: MessageSquare },
  { href: '/map', label: 'Map', icon: Map },
  { href: '/profile', label: 'My Profile', icon: User },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all ${
              isActive
                ? 'bg-primary text-white shadow-md'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
