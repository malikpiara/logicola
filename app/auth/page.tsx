/**
 * v0 by Vercel.
 * @see https://v0.dev/t/uexx6qKX6eE
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { login, signup } from './actions';

export default function Component() {
  return (
    <div className='mx-auto min-w-96 max-w-sm space-y-6'>
      <div className='space-y-2 text-center'>
        <h1 className='text-3xl font-bold'>Log In / Sign Up</h1>
        <p className='text-gray-500 dark:text-gray-400'>
          Please enter your information
        </p>
      </div>
      <form className='space-y-4'>
        <div className='space-y-2'>
          <Label htmlFor='email'>Email</Label>
          <Input
            id='email'
            name='email'
            placeholder='Enter your email'
            required
            title='Please enter a valid email address'
            type='email'
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='password'>Password</Label>
          <Input
            id='password'
            name='password'
            placeholder='Enter a password'
            required
            title='Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character'
            type='password'
          />
        </div>
        <Button className='w-full' formAction={login}>
          Log in
        </Button>
        <Button className='w-full' formAction={signup}>
          Sign Up
        </Button>
      </form>
    </div>
  );
}
