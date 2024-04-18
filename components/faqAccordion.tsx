'use client';
import React, { useState } from 'react';

function AccordionItem({ title, content, initiallyOpen = false }: any) {
  const [isOpen, setIsOpen] = useState(initiallyOpen);

  return (
    <div className='accordion-item'>
      <h2>
        <button
          type='button'
          className='flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border border-b-0 border-gray-200 first:rounded-t-xl focus:ring-4 focus:ring-gray-200 hover:bg-gray-100 gap-3'
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls={`accordion-body-${title
            .toLowerCase()
            .replace(' ', '-')}`}
        >
          <span className='flex items-center'>{title}</span>
          <svg
            data-accordion-icon
            className={`w-3 h-3 shrink-0 transition-transform ${
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
        className={`p-5 border border-b-0 border-gray-200 max-w-[1280px] mb-2 text-gray-500 ${
          isOpen ? '' : 'hidden'
        }`}
      >
        {content}
      </div>
    </div>
  );
}

export default AccordionItem;
