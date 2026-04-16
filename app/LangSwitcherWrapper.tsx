'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function LangSwitcher() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const currentLang = segments[0] || 'ar';
  const subpath = segments.slice(1).join('/');

  const langs = [
    { code: 'ar', label: 'AR' },
    { code: 'en', label: 'EN' },
    { code: 'ur', label: 'UR' }
  ];

  return (
    <div className="flex gap-2 bg-gray-100 px-3 py-1 rounded-full border shadow-sm shadow-black/50">
      {langs.map(({ code, label }) => (
        <Link
          key={code}
          href={`/${code}${subpath ? '/' + subpath : ''}`}
          className={`px-3 py-1 rounded-full text-sm text-[#222] transition-all ${
            currentLang === code 
              ? 'bg-amber-100 border-amber-300 font-medium' 
              : 'hover:bg-gray-100 hover:shadow-md'
          }`}
        >
          {label}
        </Link>
      ))}
    </div>
  );
}
