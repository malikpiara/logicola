'use client';
import { useState } from 'react';
import useSupabaseBrowser from '@/lib/supabase-browser';

export function EmailForm() {
  const supabase = useSupabaseBrowser();
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
          <div className='mx-auto mb-3 mt-8 max-w-screen-sm items-center space-y-4 transition-all sm:flex sm:space-y-0'>
            <div className='relative w-full'>
              <label
                htmlFor='email'
                className='mb-2 hidden text-sm font-medium text-gray-900'
              >
                Email address
              </label>
              <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                <svg
                  className='h-5 w-5 text-gray-500'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path d='M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z'></path>
                  <path d='M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z'></path>
                </svg>
              </div>
              <input
                className='focus:ring-primary-500 focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 pl-10 text-sm text-gray-900'
                id='email'
                placeholder={'Enter your email'}
                type='email'
                onChange={handleEmailChange}
                value={email}
                required
              />
            </div>
            <div className='m-0 flex sm:w-80'>
              <button className='w-full cursor-pointer rounded-lg border border-primary bg-primary px-5 py-3 text-center text-sm font-semibold text-white hover:bg-primary focus:ring-4 focus:ring-primary sm:ml-2'>
                Send me updates
              </button>
              {/* <Button label='Send me updates' /> */}
            </div>
          </div>
          <div className='newsletter-form-footer mx-auto max-w-screen-sm text-left text-sm text-gray-500'>
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
      <div className='mx-auto mb-3 mt-8 max-w-screen-sm space-y-4 text-xl font-normal text-gray-900 sm:flex sm:space-y-0'>
        Success! Thank you for subscribing! 🎉
      </div>
    </>
  );
}
