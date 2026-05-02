import ExerciseNavbar from '@/components/mobile/exerciseNavbar';

export default function QuizLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ExerciseNavbar />
      {children}
    </>
  );
}
