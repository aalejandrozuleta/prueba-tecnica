'use client';

export function EmptyRow({
  colSpan,
  children,
}: {
  colSpan: number;
  children: React.ReactNode;
}) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className="py-32 text-center text-neutral-500 dark:text-neutral-400"
      >
        {children}
      </td>
    </tr>
  );
}
