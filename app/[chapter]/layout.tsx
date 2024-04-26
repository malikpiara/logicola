import { Sidebar } from '@/components/sidebar';

export default function ChapterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Sidebar />
      <section className='flex-grow'>{children}</section>
    </>
  );
}
