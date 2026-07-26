import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Calendar, Clock, CheckCircle2, XCircle, AlertCircle, Plus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { PageLayout } from '@/components/PageLayout';
import { PageHero } from '@/components/PageHero';
import { useToast } from '@/hooks/use-toast';

interface Appointment {
  id: number;
  service: string;
  preferred_date: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  name: string;
  email: string;
  phone?: string;
  message?: string;
  created_at: string;
}

const statusConfig = {
  pending: { icon: Clock, color: 'text-amber-600 bg-amber-50 border-amber-200', label: 'Pending' },
  confirmed: { icon: CheckCircle2, color: 'text-green-600 bg-green-50 border-green-200', label: 'Confirmed' },
  cancelled: { icon: XCircle, color: 'text-red-500 bg-red-50 border-red-200', label: 'Cancelled' },
};

export default function PortalPage() {
  const { user, session, isLoading } = useAuth();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  const token = session?.access_token;

  const fetchAppointments = async () => {
    if (!token) return;
    setFetchLoading(true);
    try {
      const res = await fetch('/api/appointments', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to load appointments');
      const data = await res.json();
      setAppointments(data.appointments ?? []);
    } catch {
      toast({ title: 'Error', description: 'Could not load your appointments.', variant: 'destructive' });
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading && token) fetchAppointments();
    if (!isLoading && !token) setFetchLoading(false);
  }, [isLoading, token]);

  const cancelAppointment = async (id: number) => {
    if (!token) return;
    setCancellingId(id);
    try {
      const res = await fetch(`/api/appointments/${id}/cancel`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to cancel');
      toast({ title: 'Cancelled', description: 'Your appointment has been cancelled.' });
      fetchAppointments();
    } catch {
      toast({ title: 'Error', description: 'Could not cancel that appointment.', variant: 'destructive' });
    } finally {
      setCancellingId(null);
    }
  };

  // Redirect to login if not authenticated
  if (!isLoading && !user) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center flex-col gap-6 pt-20">
          <AlertCircle className="w-12 h-12 text-primary/40" />
          <div className="text-center">
            <h2 className="text-2xl font-serif text-foreground mb-2">Sign in to view your portal</h2>
            <p className="text-muted-foreground mb-6">Your appointment history is saved to your account.</p>
            <Link href="/login" className="bg-primary text-white px-8 py-3 rounded-full font-medium hover:bg-primary/90 transition-all">
              Sign In
            </Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageHero
        eyebrow="Patient Portal"
        title="Your Appointments"
        subtitle={`Welcome back${user?.email ? ', ' + user.email : ''}. Manage your upcoming visits below.`}
      />

      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 max-w-4xl">

          {/* Book CTA */}
          <div className="flex justify-end mb-8">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-primary/90 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Book New Appointment
            </Link>
          </div>

          {/* Content */}
          {fetchLoading || isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-28 bg-secondary/30 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : appointments.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <Calendar className="w-12 h-12 text-primary/30 mx-auto mb-4" />
              <h3 className="text-xl font-serif text-foreground mb-2">No appointments yet</h3>
              <p className="text-muted-foreground">Book your first visit and it will appear here.</p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {appointments.map((appt, i) => {
                const cfg = statusConfig[appt.status];
                const Icon = cfg.icon;
                return (
                  <motion.div
                    key={appt.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white border border-border rounded-2xl p-6 flex items-center justify-between gap-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                        <Calendar className="w-5 h-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-foreground truncate">{appt.service}</p>
                        <p className="text-sm text-muted-foreground mt-0.5">{appt.preferred_date}</p>
                        {appt.message && (
                          <p className="text-xs text-muted-foreground/70 mt-1 truncate">{appt.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${cfg.color}`}>
                        <Icon className="w-3.5 h-3.5" />
                        {cfg.label}
                      </span>

                      {appt.status !== 'cancelled' && (
                        <button
                          onClick={() => cancelAppointment(appt.id)}
                          disabled={cancellingId === appt.id}
                          className="text-xs text-red-500 hover:text-red-700 font-medium disabled:opacity-50 transition-colors"
                        >
                          {cancellingId === appt.id ? 'Cancelling…' : 'Cancel'}
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
}
