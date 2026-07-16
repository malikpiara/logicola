import type { Metadata } from 'next';

/**
 * Metadata carrier for `/keyboard`, which is a client component and so can't
 * export `metadata` itself. Without this the page inherited the homepage's
 * title verbatim — two URLs competing on the same terms.
 */
export const metadata: Metadata = {
  title: 'Logic Symbol Keyboard',
  description:
    'Type logic symbols without hunting for them: build an expression from the on-screen keys and preview the formatted result.',
  alternates: { canonical: '/keyboard' },
};

export default function KeyboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
