import { Metadata } from 'next';
import { LoginForm } from './_components/LoginForm';

export const metadata: Metadata = {
  title: 'Sign In | Healthify',
  description: 'Sign in to your Healthify account to continue tracking your wellness journey',
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <LoginForm />
    </main>
  );
}
