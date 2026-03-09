import { use } from 'react';
import QuranView from './QuranView';
import type { Lang } from './useQuran';

export default function QuranPage({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = use(params);
  return <QuranView lang={lang} />;
}