'use client';
import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Button from './button';

const supabase = createClient();

export function EmailForm() {
  const [email, setEmail] = useState('');
  const [formIsSubmitted, setFormIsSubmitted] = useState(false);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setEmail(value);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    try {
      const { error } = await supabase
        .from('email_subscriptions')
        .insert({ email });

      if (error) {
        // Handle potential errors (e.g., duplicate)
        console.error('Subscription error:', error);
        // You might want to display an error message to the user here
      } else {
        console.log('Subscription successful');
        setEmail('');
        setFormIsSubmitted(true);
      }
    } catch (error) {
      console.error('Subscription error:', error);
      // Handle general errors
    }
  };
  return (
    <>
      {!formIsSubmitted ? (
        <form onSubmit={handleSubmit}>
          <div className='items-center mx-auto mb-3 mt-8 space-y-4 max-w-screen-sm sm:flex sm:space-y-0 transition-all'>
            <div className='relative w-full'>
              <label
                htmlFor='email'
                className='hidden mb-2 text-sm font-medium text-gray-900'
              >
                Email address
              </label>
              <div className='flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none'>
                <svg
                  className='w-5 h-5 text-gray-500'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path d='M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z'></path>
                  <path d='M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z'></path>
                </svg>
              </div>
              <input
                className='block p-3 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primaryColor focus:border-primaryColor'
                id='email'
                placeholder={'Enter your email'}
                type='email'
                onChange={handleEmailChange}
                value={email}
                required
              />
            </div>
            <div className='sm:w-80 flex m-0'>
              <button className='sm:ml-2 py-3 px-5 w-full text-sm font-semibold text-center text-white rounded-lg border cursor-pointer bg-primaryColor border-primaryColor hover:bg-primaryColor focus:ring-4 focus:ring-primaryColor'>
                Send me updates
              </button>
              {/* <Button label='Send me updates' /> */}
            </div>
          </div>
          <div className='mx-auto max-w-screen-sm text-sm text-left text-gray-500 newsletter-form-footer'>
            We&apos;ll never share your data or send you SPAM.
          </div>
        </form>
      ) : (
        <>{successState()}</>
      )}
    </>
  );
}

function successState() {
  return (
    <>
      <div className='mx-auto mb-3 mt-8 space-y-4 max-w-screen-sm sm:flex sm:space-y-0 text-gray-900 font-normal text-xl'>
        Success! Thank you for subscribing! 🎉
      </div>
    </>
  );
}
