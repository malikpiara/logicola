'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  Book,
  Brain,
  Calculator,
  GitCommit,
  Library,
  MessageSquare,
} from 'lucide-react';

const logicSections = [
  {
    title: 'Syllogistic',
    icon: Brain,
    progress: 50,
    items: [
      { label: 'A. Translations', href: '#' },
      { label: 'B. Arguments', href: '#' },
    ],
  },
  {
    title: 'Propositional',
    icon: Calculator,
    progress: 10,
    items: [
      { label: 'C. Translations', href: '#' },
      { label: 'D. Truth Tables', href: '#' },
      { label: 'E. Arguments', href: '#' },
      { label: 'F. Inference Rules', href: '#' },
      { label: 'G. Proofs', href: '#' },
    ],
  },
  {
    title: 'Quantificational',
    icon: Library,
    progress: 0,
    items: [
      { label: 'H. Translations', href: '#' },
      { label: 'I. Proofs', href: '#' },
    ],
  },
  {
    title: 'Modal',
    icon: GitCommit,
    progress: 30,
    items: [
      { label: 'J. Translations', href: '#' },
      { label: 'K. Proofs', href: '#' },
    ],
  },
  {
    title: 'Deontic',
    icon: Book,
    progress: 0,
    items: [
      { label: 'L. Translations', href: '#' },
      { label: 'M. Proofs', href: '#' },
    ],
  },
  {
    title: 'Belief',
    icon: Brain,
    progress: 0,
    items: [
      { label: 'N. Translations', href: '#' },
      { label: 'O. Proofs', href: '#' },
    ],
  },
  {
    title: 'Informal',
    icon: MessageSquare,
    progress: 33,
    items: [
      { label: 'P. Probability', href: '#' },
      { label: 'Q. Definitions', href: '#' },
      { label: 'R. Fallacies', href: '#' },
    ],
  },
];

export default function LogicDashboard() {
  return (
    <div className='p-6 min-h-screen'>
      <div className='max-w-7xl mx-auto'>
        <h1 className='text-3xl font-bold text-green-900 mb-6'>
          Migraton to Logicola 3
        </h1>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {logicSections.map((section) => (
            <Card
              key={section.title}
              className='hover:shadow-lg transition-shadow'
            >
              <CardHeader className='pb-2'>
                <div className='flex items-center justify-between mb-2'>
                  <CardTitle className='text-xl text-green-800 flex items-center gap-2'>
                    <section.icon className='h-5 w-5' />
                    {section.title}
                  </CardTitle>
                  <span className='text-sm font-medium text-green-600'>
                    {section.progress}%
                  </span>
                </div>
                <Progress value={section.progress} className='h-2' />
              </CardHeader>
              <CardContent className='grid gap-2'>
                {section.items.map((item) => (
                  <Button
                    key={item.label}
                    variant='ghost'
                    className='w-full justify-start text-left hover:text-green-700 hover:bg-green-50'
                  >
                    {item.label}
                  </Button>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
