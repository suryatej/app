import { Metadata } from 'next';
import { RegisterForm } from './_components/RegisterForm';

export const metadata: Metadata = {
  title: 'Create Account | Healthify',
  description: 'Create a new Healthify account to start tracking your wellness journey',
};

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <RegisterForm />
    </main>
  );
}
