import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/context/AuthContext';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PageLayout } from '@/components/PageLayout';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');
  const [serverError, setServerError] = useState<string | null>(null);
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  const { user, isAdmin, signIn, signUp, isLoading } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!isLoading && user) {
      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/portal');
      }
    }
  }, [user, isAdmin, isLoading, navigate]);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: FormData) => {
    setServerError(null);
    if (tab === 'signin') {
      const { error } = await signIn(data.email, data.password);
      if (error) {
        setServerError(error);
      } else {
        navigate('/portal');
      }
    } else {
      const { error } = await signUp(data.email, data.password);
      if (error) {
        setServerError(error);
      } else {
        setSignUpSuccess(true);
        form.reset();
      }
    }
  };

  const switchTab = (t: 'signin' | 'signup') => {
    setTab(t);
    setServerError(null);
    setSignUpSuccess(false);
    form.reset();
  };

  return (
    <PageLayout>
      <div className="min-h-screen flex items-center justify-center pt-20 pb-16 px-4 bg-secondary/20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Card */}
          <div className="bg-white rounded-3xl shadow-xl border border-border p-8">
            {/* Logo */}
            <div className="text-center mb-8">
              <span className="font-serif text-3xl text-primary">Brightline</span>
              <p className="text-muted-foreground text-sm mt-1">Patient Portal</p>
            </div>

            {/* Tabs */}
            <div className="flex bg-secondary/40 rounded-xl p-1 mb-8">
              {(['signin', 'signup'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => switchTab(t)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    tab === t
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t === 'signin' ? 'Sign In' : 'Create Account'}
                </button>
              ))}
            </div>

            {/* Sign-up success banner */}
            {signUpSuccess && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-800 text-sm text-center">
                Account created! Check your email to confirm, then sign in.
              </div>
            )}

            {/* Error */}
            {serverError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                {serverError}
              </div>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="you@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <button
                  type="submit"
                  disabled={form.formState.isSubmitting || isLoading}
                  className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                >
                  {form.formState.isSubmitting
                    ? 'Please wait…'
                    : tab === 'signin'
                      ? 'Sign In'
                      : 'Create Account'}
                </button>
              </form>
            </Form>

            <p className="text-center text-xs text-muted-foreground mt-6">
              Your data is protected and never shared.
            </p>
          </div>
        </motion.div>
      </div>
    </PageLayout>
  );
}
