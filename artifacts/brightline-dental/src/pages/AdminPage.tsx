import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Users, Calendar, CheckCircle2, Clock, XCircle, AlertCircle, Award, Phone, Mail, FileText, Eye, X, Search, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { PageLayout } from '@/components/PageLayout';
import { PageHero } from '@/components/PageHero';
import { useToast } from '@/hooks/use-toast';

interface Appointment {
  id: number;
  user_id?: string;
  name: string;
  email: string;
  phone?: string;
  service: string;
  preferred_date: string;
  message?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
}

interface Patient {
  id: string;
  email?: string;
  is_admin: boolean;
  created_at: string;
}

interface WellnessBooking {
  id: string | number;
  first_name: string;
  last_name: string;
  dob: string;
  email: string;
  phone: string;
  billing_interval: 'monthly' | 'annually';
  plan_id: string;
  created_at?: string;
}

const statusBadge = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  confirmed: 'bg-green-50 text-green-700 border-green-200',
  cancelled: 'bg-red-50 text-red-600 border-red-200',
};

const StatusIcon = ({ status }: { status: Appointment['status'] }) => {
  if (status === 'confirmed') return <CheckCircle2 className="w-3.5 h-3.5" />;
  if (status === 'cancelled') return <XCircle className="w-3.5 h-3.5" />;
  return <Clock className="w-3.5 h-3.5" />;
};

export default function AdminPage() {
  const { user, session, isLoading, isAdmin } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'appointments' | 'bookings' | 'patients'>('appointments');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [bookings, setBookings] = useState<WellnessBooking[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<WellnessBooking | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const token = session?.access_token;

  useEffect(() => {
    if (!token || !isAdmin) return;

    async function fetchAll() {
      setDataLoading(true);
      try {
        const [apptsRes, patientsRes, bookingsRes] = await Promise.all([
          fetch('/api/admin/appointments', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/admin/patients', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/admin/wellness-subscriptions', { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        if (apptsRes.ok) {
          const d = await apptsRes.json();
          setAppointments(d.appointments ?? []);
        }
        if (patientsRes.ok) {
          const d = await patientsRes.json();
          setPatients(d.patients ?? []);
        }
        if (bookingsRes.ok) {
          const d = await bookingsRes.json();
          setBookings(d.subscriptions ?? []);
        }
      } catch (err) {
        console.error('Failed to load admin data:', err);
      } finally {
        setDataLoading(false);
      }
    }

    fetchAll();
  }, [token, isAdmin]);

  const handleUpdateStatus = async (id: number, status: 'confirmed' | 'cancelled' | 'pending') => {
    try {
      const res = await fetch(`/api/admin/appointments/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to update appointment status');
      }

      toast({
        title: `Appointment Status Updated`,
        description: `Successfully marked appointment as ${status}.`,
      });

      setAppointments((prev) =>
        prev.map((appt) => (appt.id === id ? { ...appt, status } : appt))
      );
      if (selectedAppt && selectedAppt.id === id) {
        setSelectedAppt((prev) => prev ? { ...prev, status } : null);
      }
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Could not update status.',
        variant: 'destructive',
      });
    }
  };

  const filteredAppointments = appointments.filter((a) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      a.name.toLowerCase().includes(term) ||
      a.email.toLowerCase().includes(term) ||
      (a.phone && a.phone.toLowerCase().includes(term)) ||
      a.service.toLowerCase().includes(term)
    );
  });

  const filteredBookings = bookings.filter((b) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      `${b.first_name} ${b.last_name}`.toLowerCase().includes(term) ||
      b.email.toLowerCase().includes(term) ||
      b.phone.toLowerCase().includes(term) ||
      b.plan_id.toLowerCase().includes(term)
    );
  });

  const filteredPatients = patients.filter((p) => {
    if (!searchTerm) return true;
    return p.email?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Not logged in
  if (!isLoading && !user) {
    return (
      <PageLayout>
        <div className="py-32 container mx-auto px-6 text-center max-w-md">
          <ShieldAlert className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-serif text-foreground mb-2">Access Restricted</h2>
          <p className="text-muted-foreground mb-6">You must be signed in to access the practice management admin portal.</p>
          <Link href="/login" className="inline-block px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-all">
            Sign In
          </Link>
        </div>
      </PageLayout>
    );
  }

  // Logged in but not admin
  if (!isLoading && user && !isAdmin) {
    return (
      <PageLayout>
        <div className="py-32 container mx-auto px-6 text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-serif text-foreground mb-2">Admin Clearance Required</h2>
          <p className="text-muted-foreground mb-6">
            Signed in as <span className="font-mono text-xs font-semibold">{user.email}</span>. This account does not have administrative permissions.
          </p>
          <Link href="/portal" className="inline-block px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-all">
            Go to Patient Portal
          </Link>
        </div>
      </PageLayout>
    );
  }

  const stats = [
    { label: 'Total Appts', value: appointments.length, color: 'text-primary' },
    { label: 'Pending Appts', value: appointments.filter(a => a.status === 'pending').length, color: 'text-amber-600' },
    { label: 'Confirmed Appts', value: appointments.filter(a => a.status === 'confirmed').length, color: 'text-green-600' },
    { label: 'Wellness Members', value: bookings.length, color: 'text-indigo-600' },
  ];

  return (
    <PageLayout>
      <PageHero
        eyebrow="Admin Dashboard"
        title="Practice Overview"
        subtitle="Manage appointments, view patient details, and monitor wellness memberships."
      />

      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {stats.map((s) => (
              <div key={s.label} className="bg-secondary/30 rounded-2xl p-5 text-center border border-border">
                <p className={`text-3xl font-serif font-semibold ${s.color}`}>{dataLoading ? '—' : s.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Controls: Tabs & Search */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex bg-secondary/40 rounded-xl p-1 max-w-md w-full">
              {(['appointments', 'bookings', 'patients'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                    activeTab === t ? 'bg-white text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t === 'appointments' ? <span className="flex items-center justify-center gap-1.5"><Calendar className="w-4 h-4" />Appointments ({appointments.length})</span>
                    : t === 'bookings' ? <span className="flex items-center justify-center gap-1.5"><Award className="w-4 h-4" />Bookings ({bookings.length})</span>
                    : <span className="flex items-center justify-center gap-1.5"><Users className="w-4 h-4" />Patients ({patients.length})</span>}
                </button>
              ))}
            </div>

            <div className="relative max-w-xs w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search patient, phone, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-secondary/20 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Table */}
          {dataLoading || isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-16 bg-secondary/30 rounded-xl animate-pulse" />)}
            </div>
          ) : activeTab === 'appointments' ? (
            filteredAppointments.length === 0 ? (
              <p className="text-muted-foreground text-center py-12 bg-secondary/10 rounded-2xl border border-dashed border-border">
                {searchTerm ? 'No matching appointments found.' : 'No appointments yet.'}
              </p>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-border bg-white shadow-sm">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-secondary/30">
                      {['Patient Details', 'Phone Number', 'Service', 'Preferred Date', 'Notes / Message', 'Status', 'Actions'].map((h) => (
                        <th key={h} className="text-left px-4 py-3 font-medium text-muted-foreground">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAppointments.map((appt, i) => (
                      <motion.tr
                        key={appt.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.02 }}
                        className="border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <p className="font-semibold text-foreground flex items-center gap-1.5">
                            {appt.name}
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Mail className="w-3 h-3 text-muted-foreground/70" />
                            {appt.email}
                          </p>
                        </td>
                        <td className="px-4 py-3 text-xs font-mono">
                          {appt.phone ? (
                            <a href={`tel:${appt.phone}`} className="text-primary hover:underline flex items-center gap-1">
                              <Phone className="w-3 h-3 text-primary/70" />
                              {appt.phone}
                            </a>
                          ) : (
                            <span className="text-muted-foreground italic">Not provided</span>
                          )}
                        </td>
                        <td className="px-4 py-3 font-medium text-foreground">{appt.service}</td>
                        <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">{appt.preferred_date}</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground max-w-xs truncate">
                          {appt.message ? appt.message : <span className="italic text-muted-foreground/60">No notes</span>}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${statusBadge[appt.status]}`}>
                            <StatusIcon status={appt.status} />
                            {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedAppt(appt)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors cursor-pointer"
                              title="View Full Details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              Details
                            </button>

                            {appt.status !== 'confirmed' && (
                              <button
                                onClick={() => handleUpdateStatus(appt.id, 'confirmed')}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-colors cursor-pointer"
                                title="Confirm Appointment"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Confirm
                              </button>
                            )}
                            {appt.status !== 'cancelled' && (
                              <button
                                onClick={() => handleUpdateStatus(appt.id, 'cancelled')}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors cursor-pointer"
                                title="Cancel Appointment"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                Cancel
                              </button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : activeTab === 'bookings' ? (
            filteredBookings.length === 0 ? (
              <p className="text-muted-foreground text-center py-12 bg-secondary/10 rounded-2xl border border-dashed border-border">
                {searchTerm ? 'No matching wellness bookings.' : 'No wellness bookings yet.'}
              </p>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-border bg-white shadow-sm">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-secondary/30">
                      {['Patient Name', 'Contact Info', 'Date of Birth', 'Plan Details', 'Billing', 'Submitted', 'Action'].map((h) => (
                        <th key={h} className="text-left px-4 py-3 font-medium text-muted-foreground">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((book, i) => (
                      <motion.tr
                        key={book.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.02 }}
                        className="border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors"
                      >
                        <td className="px-4 py-3 font-semibold text-foreground">
                          {book.first_name} {book.last_name}
                        </td>
                        <td className="px-4 py-3 text-xs">
                          <p className="text-foreground flex items-center gap-1">
                            <Mail className="w-3 h-3 text-muted-foreground" />
                            {book.email}
                          </p>
                          <p className="text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3 text-muted-foreground" />
                            {book.phone}
                          </p>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">{book.dob}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary uppercase">
                            {book.plan_id} Plan
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-xs capitalize">
                          {book.billing_interval}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
                          {book.created_at ? new Date(book.created_at).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => setSelectedBooking(book)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Details
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : (
            filteredPatients.length === 0 ? (
              <p className="text-muted-foreground text-center py-12 bg-secondary/10 rounded-2xl border border-dashed border-border">
                {searchTerm ? 'No matching patients.' : 'No registered patients yet.'}
              </p>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-border bg-white shadow-sm">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-secondary/30">
                      {['Email Address', 'Account ID', 'Role', 'Registration Date'].map((h) => (
                        <th key={h} className="text-left px-4 py-3 font-medium text-muted-foreground">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPatients.map((p, i) => (
                      <motion.tr
                        key={p.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.02 }}
                        className="border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors"
                      >
                        <td className="px-4 py-3 text-foreground font-medium">{p.email ?? <span className="text-muted-foreground italic">No email</span>}</td>
                        <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{p.id}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${p.is_admin ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground'}`}>
                            {p.is_admin ? 'Administrator' : 'Patient'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
                          {new Date(p.created_at).toLocaleDateString()}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}
        </div>
      </section>

      {/* Appointment Details Modal */}
      <AnimatePresence>
        {selectedAppt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-border relative overflow-hidden"
            >
              <button
                onClick={() => setSelectedAppt(null)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-secondary transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-6 pr-8">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-serif text-lg font-semibold">
                  {selectedAppt.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-serif text-foreground font-semibold">{selectedAppt.name}</h3>
                  <p className="text-xs text-muted-foreground">Appointment Record #{selectedAppt.id}</p>
                </div>
              </div>

              <div className="space-y-4 text-sm mb-6">
                <div className="grid grid-cols-2 gap-3 bg-secondary/30 p-4 rounded-xl border border-border">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Status</p>
                    <span className={`inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusBadge[selectedAppt.status]}`}>
                      <StatusIcon status={selectedAppt.status} />
                      {selectedAppt.status.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Submitted On</p>
                    <p className="text-foreground font-medium mt-1">
                      {new Date(selectedAppt.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-start gap-3">
                    <User className="w-4 h-4 text-primary mt-1 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Patient Name</p>
                      <p className="font-medium text-foreground">{selectedAppt.name}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-primary mt-1 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Email Address</p>
                      <a href={`mailto:${selectedAppt.email}`} className="font-medium text-primary hover:underline">
                        {selectedAppt.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-primary mt-1 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Phone Number</p>
                      {selectedAppt.phone ? (
                        <a href={`tel:${selectedAppt.phone}`} className="font-medium text-primary hover:underline">
                          {selectedAppt.phone}
                        </a>
                      ) : (
                        <p className="text-muted-foreground italic">No phone provided</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="w-4 h-4 text-primary mt-1 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Requested Service & Preferred Date</p>
                      <p className="font-medium text-foreground">{selectedAppt.service}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Preferred Date: <span className="font-medium text-foreground">{selectedAppt.preferred_date}</span></p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <FileText className="w-4 h-4 text-primary mt-1 shrink-0" />
                    <div className="w-full">
                      <p className="text-xs text-muted-foreground mb-1">Patient Notes / Message</p>
                      <div className="bg-secondary/40 p-3 rounded-xl border border-border text-foreground text-xs leading-relaxed">
                        {selectedAppt.message || <span className="italic text-muted-foreground">No notes or special instructions submitted.</span>}
                      </div>
                    </div>
                  </div>

                  {selectedAppt.user_id && (
                    <div className="text-xs text-muted-foreground pt-2 border-t border-border flex justify-between">
                      <span>Linked Patient User ID:</span>
                      <span className="font-mono text-foreground">{selectedAppt.user_id}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="pt-4 border-t border-border flex items-center justify-end gap-2">
                {selectedAppt.status !== 'confirmed' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedAppt.id, 'confirmed')}
                    className="px-4 py-2 bg-green-600 text-white text-xs font-semibold rounded-xl hover:bg-green-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Confirm Appointment
                  </button>
                )}
                {selectedAppt.status !== 'cancelled' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedAppt.id, 'cancelled')}
                    className="px-4 py-2 bg-red-600 text-white text-xs font-semibold rounded-xl hover:bg-red-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <XCircle className="w-4 h-4" />
                    Cancel Appointment
                  </button>
                )}
                {selectedAppt.status !== 'pending' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedAppt.id, 'pending')}
                    className="px-4 py-2 bg-amber-500 text-white text-xs font-semibold rounded-xl hover:bg-amber-600 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Clock className="w-4 h-4" />
                    Mark Pending
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Wellness Booking Details Modal */}
      <AnimatePresence>
        {selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-border relative overflow-hidden"
            >
              <button
                onClick={() => setSelectedBooking(null)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-secondary transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-6 pr-8">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-serif text-lg font-semibold">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-serif text-foreground font-semibold">{selectedBooking.first_name} {selectedBooking.last_name}</h3>
                  <p className="text-xs text-muted-foreground">Wellness Subscription Details</p>
                </div>
              </div>

              <div className="space-y-4 text-sm mb-6">
                <div className="grid grid-cols-2 gap-3 bg-secondary/30 p-4 rounded-xl border border-border">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Plan</p>
                    <span className="inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary uppercase">
                      {selectedBooking.plan_id}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Billing Interval</p>
                    <p className="text-foreground font-medium mt-1 capitalize">{selectedBooking.billing_interval}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <User className="w-4 h-4 text-primary mt-1 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Full Name</p>
                      <p className="font-medium text-foreground">{selectedBooking.first_name} {selectedBooking.last_name}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="w-4 h-4 text-primary mt-1 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Date of Birth</p>
                      <p className="font-medium text-foreground">{selectedBooking.dob}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-primary mt-1 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Email Address</p>
                      <a href={`mailto:${selectedBooking.email}`} className="font-medium text-primary hover:underline">
                        {selectedBooking.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-primary mt-1 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Phone Number</p>
                      <a href={`tel:${selectedBooking.phone}`} className="font-medium text-primary hover:underline">
                        {selectedBooking.phone}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border flex justify-end">
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="px-4 py-2 bg-secondary text-secondary-foreground text-xs font-semibold rounded-xl hover:bg-secondary/80 transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageLayout>
  );
}
