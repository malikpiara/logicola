'use client';
import React, { useState } from 'react';

function AccordionItem({ title, content, initiallyOpen = false }: any) {
  const [isOpen, setIsOpen] = useState(initiallyOpen);

  return (
    <div className='accordion-item'>
      <h2>
        <button
          type='button'
          className='flex w-full items-center justify-between gap-3 border border-b-0 border-gray-200 p-5 font-medium text-gray-500 first:rounded-t-xl hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 rtl:text-right'
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls={`accordion-body-${title
            .toLowerCase()
            .replace(' ', '-')}`}
        >
          <span className='flex items-center'>{title}</span>
          <svg
            data-accordion-icon
            className={`h-3 w-3 shrink-0 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
            aria-hidden='true'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 10 6'
          >
            <path
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M9 5 5 1 1 5'
            />
          </svg>
        </button>
      </h2>
      <div
        className={`mb-2 max-w-[1280px] border border-b-0 border-gray-200 p-5 text-gray-500 ${
          isOpen ? '' : 'hidden'
        }`}
      >
        {content}
      </div>
    </div>
  );
}

export default AccordionItem;
