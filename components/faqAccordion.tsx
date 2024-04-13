'use client';
import React, { useState } from 'react';

function AccordionItem({ title, content, initiallyOpen = false }: any) {
  const [isOpen, setIsOpen] = useState(initiallyOpen);

  return (
    <div className='accordion-item'>
      <h2 id={`accordion-heading-${title.toLowerCase().replace(' ', '-')}`}>
        <button
          type='button'
          className='flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border border-b-0 border-gray-200 rounded-t-xl focus:ring-4 focus:ring-gray-200 hover:bg-gray-100 gap-3'
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls={`accordion-body-${title
            .toLowerCase()
            .replace(' ', '-')}`}
        >
          <span className='flex items-center'>
            <svg
              className='w-5 h-5 me-2 shrink-0'
              fill='currentColor'
              viewBox='0 0 20 20'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                fillRule='evenodd'
                d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z'
                clipRule='evenodd'
              />
            </svg>
            {title}
          </span>
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
        id={`accordion-body-${title.toLowerCase().replace(' ', '-')}`}
        className={`p-5 border border-b-0 border-gray-200 max-w-[1280px] mb-2 text-gray-500 ${
          isOpen ? '' : 'hidden'
        }`}
        aria-labelledby={`accordion-heading-${title
          .toLowerCase()
          .replace(' ', '-')}`}
      >
        {content}
      </div>
    </div>
  );
}

export default AccordionItem;
