'use client';

import { useLanguage } from '@/hooks/useLanguage';
import { getDebtsTexts } from '@/libs/i18n';

export function DebtsTableHeader() {
  const { language } = useLanguage();
  const texts = getDebtsTexts(language);

  return (
    <thead>
      <tr className="border-b border-black/5 dark:border-white/10">
        <HeaderCell>{texts.amount}</HeaderCell>
        <HeaderCell>{texts.status}</HeaderCell>
        <HeaderCell>{texts.createdAt}</HeaderCell>
        <th />
      </tr>
    </thead>
  );
}

function HeaderCell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <th className="px-6 py-5 text-left text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
      {children}
    </th>
  );
}
