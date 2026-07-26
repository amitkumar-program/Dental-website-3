
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  FileText, 
  Sparkles, 
  X, 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Printer, 
  Award, 
  FileCheck2,
  ChevronDown
} from 'lucide-react';

// Types for patient form registration
interface PatientFormData {
  firstName: string;
  lastName: string;
  dob: string;
  email: string;
  phone: string;
  gender: string;
  reason: string;
  lastVisit: string;
  allergies: string;
  conditions: string[];
  consent: boolean;
  signature: string;
}

// Types for wellness plan subscription
interface WellnessFormData {
  firstName: string;
  lastName: string;
  dob: string;
  email: string;
  phone: string;
  billingInterval: 'monthly' | 'annually';
}

const HEALTH_CONDITIONS = [
  { id: 'heart', label: 'Heart Disease / Condition' },
  { id: 'bp', label: 'High / Low Blood Pressure' },
  { id: 'diabetes', label: 'Diabetes' },
  { id: 'bleeding', label: 'Abnormal Bleeding / Hemophilia' },
  { id: 'pregnancy', label: 'Currently Pregnant' },
  { id: 'allergies_med', label: 'Allergies to Medications (e.g. Penicillin)' },
  { id: 'asthma', label: 'Asthma / Respiratory Conditions' },
  { id: 'joint', label: 'Artificial Joints / Valves' }
];

const PLAN_TIERS = [
  {
    id: 'adult' as const,
    name: 'Adult Wellness Plan',
    priceMonthly: 29,
    priceAnnually: 299,
    target: 'For adults (ages 13+)',
    description: 'Perfect for regular preventive maintenance and healthy smiles.',
    benefits: [
      '2 professional dental cleanings per year',
      '2 clinical examinations per year',
      '1 set of routine digital X-rays',
      '1 emergency exam with X-ray (if needed)',
      '15% off all additional treatments'
    ]
  },
  {
    id: 'child' as const,
    name: 'Child Wellness Plan',
    priceMonthly: 19,
    priceAnnually: 189,
    target: 'For children (ages 12 & under)',
    description: 'An affordable way to build strong, healthy habits for life.',
    benefits: [
      '2 professional dental cleanings per year',
      '2 clinical examinations per year',
      '2 professional fluoride applications',
      'Routine dental X-rays as needed',
      '15% off all additional treatments'
    ]
  },
  {
    id: 'perio' as const,
    name: 'Perio Maintenance Plan',
    priceMonthly: 49,
    priceAnnually: 499,
    target: 'For periodontal care members',
    description: 'Enhanced maintenance for members managing periodontal disease.',
    benefits: [
      '3 to 4 professional perio cleanings per year',
      '2 clinical examinations per year',
      '1 set of routine digital X-rays',
      '1 emergency exam with X-ray',
      '15% off periodontal therapy & other care'
    ]
  }
];

export function Insurance() {
  const { session } = useAuth();
  const { toast } = useToast();
  const [activeModal, setActiveModal] = useState<'forms' | 'wellness' | null>(null);

  // New Patient Form state
  const [formsStep, setFormsStep] = useState<1 | 2 | 3 | 'success'>(1);
  const [formsErrors, setFormsErrors] = useState<Record<string, string>>({});
  const [formsSubmitting, setFormsSubmitting] = useState(false);
  const [genderDropdownOpen, setGenderDropdownOpen] = useState(false);
  const [patientData, setPatientData] = useState<PatientFormData>({
    firstName: '',
    lastName: '',
    dob: '',
    email: '',
    phone: '',
    gender: 'Prefer not to say',
    reason: '',
    lastVisit: 'Within last 6 months',
    allergies: '',
    conditions: [],
    consent: false,
    signature: ''
  });

  // Wellness Plan checkout state
  const [wellnessStep, setWellnessStep] = useState<'tiers' | 'checkout' | 'success'>('tiers');
  const [selectedTierId, setSelectedTierId] = useState<'adult' | 'child' | 'perio' | null>(null);
  const [wellnessErrors, setWellnessErrors] = useState<Record<string, string>>({});
  const [wellnessSubmitting, setWellnessSubmitting] = useState(false);
  const [wellnessData, setWellnessData] = useState<WellnessFormData>({
    firstName: '',
    lastName: '',
    dob: '',
    email: '',
    phone: '',
    billingInterval: 'monthly'
  });

  // Registration form validation and next step
  const handleFormsNext = () => {
    const errors: Record<string, string> = {};
    if (formsStep === 1) {
      if (!patientData.firstName.trim()) errors.firstName = 'First name is required';
      if (!patientData.lastName.trim()) errors.lastName = 'Last name is required';
      if (!patientData.dob) errors.dob = 'Date of birth is required';
      if (!patientData.email.trim() || !/\S+@\S+\.\S+/.test(patientData.email)) {
        errors.email = 'Valid email is required';
      }
      if (!patientData.phone.trim() || patientData.phone.replace(/\D/g, '').length < 10) {
        errors.phone = 'Valid 10-digit phone number is required';
      }
    } else if (formsStep === 2) {
      if (!patientData.reason.trim()) {
        errors.reason = 'Please state your primary reason for visiting';
      }
    }
    
    if (Object.keys(errors).length > 0) {
      setFormsErrors(errors);
      return;
    }

    setFormsErrors({});
    if (formsStep === 1) setFormsStep(2);
    else if (formsStep === 2) setFormsStep(3);
  };

  const handleFormsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formsSubmitting) return;

    const errors: Record<string, string> = {};
    if (!patientData.consent) {
      errors.consent = 'You must acknowledge the consent and accuracy statement';
    }
    if (!patientData.signature.trim()) {
      errors.signature = 'Please write your signature to authorize the submission';
    }

    if (Object.keys(errors).length > 0) {
      setFormsErrors(errors);
      return;
    }

    setFormsErrors({});
    setFormsSubmitting(true);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const res = await fetch('/api/patient-forms', {
        method: 'POST',
        headers,
        body: JSON.stringify(patientData),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ? JSON.stringify(data.error) : 'Failed to submit form');
      }

      toast({
        title: 'Success!',
        description: 'Your patient intake forms have been submitted securely.',
      });
      setFormsStep('success');
    } catch (err: any) {
      toast({
        title: 'Submission Error',
        description: err.message || 'Something went wrong submitting your forms. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setFormsSubmitting(false);
    }
  };

  const handleConditionToggle = (id: string) => {
    setPatientData(prev => {
      const isSelected = prev.conditions.includes(id);
      return {
        ...prev,
        conditions: isSelected 
          ? prev.conditions.filter(c => c !== id) 
          : [...prev.conditions, id]
      };
    });
  };

  // Wellness Plan Validation
  const handleWellnessNext = () => {
    if (!selectedTierId) return;
    setWellnessStep('checkout');
  };

  const handleWellnessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (wellnessSubmitting) return;

    const errors: Record<string, string> = {};
    if (!wellnessData.firstName.trim()) errors.firstName = 'First name is required';
    if (!wellnessData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!wellnessData.dob) errors.dob = 'Date of birth is required';
    if (!wellnessData.email.trim() || !/\S+@\S+\.\S+/.test(wellnessData.email)) {
      errors.email = 'Valid email is required';
    }
    if (!wellnessData.phone.trim() || wellnessData.phone.replace(/\D/g, '').length < 10) {
      errors.phone = 'Valid phone is required';
    }

    if (Object.keys(errors).length > 0) {
      setWellnessErrors(errors);
      return;
    }

    setWellnessErrors({});
    setWellnessSubmitting(true);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const res = await fetch('/api/wellness-subscriptions', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          ...wellnessData,
          planId: selectedTierId,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ? JSON.stringify(data.error) : 'Failed to process subscription booking');
      }

      toast({
        title: 'Booking Registered!',
        description: 'Your membership booking has been registered. We will contact you soon.',
      });
      setWellnessStep('success');
    } catch (err: any) {
      toast({
        title: 'Booking Error',
        description: err.message || 'Failed to register your booking. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setWellnessSubmitting(false);
    }
  };

  const handleDownloadPDF = () => {
    // Generate a simple print layout for patient records
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const conditionsString = patientData.conditions
      .map(id => HEALTH_CONDITIONS.find(hc => hc.id === id)?.label)
      .filter(Boolean)
      .join(', ') || 'None declared';

    printWindow.document.write(`
      <html>
        <head>
          <title>Brightline Dental Studio - Patient Registration Form</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #1e293b; padding: 40px; }
            .header { border-bottom: 2px solid #0284c7; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #0284c7; }
            .title { font-size: 20px; margin-top: 10px; color: #334155; }
            .section { margin-bottom: 24px; }
            .section-title { font-size: 16px; font-weight: bold; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 12px; color: #0f172a; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
            .field { margin-bottom: 10px; }
            .label { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 600; }
            .val { font-size: 14px; font-weight: 500; color: #0f172a; margin-top: 2px; }
            .signature-box { border: 1px solid #cbd5e1; padding: 16px; background-color: #f8fafc; border-radius: 6px; margin-top: 20px; }
            .footer { margin-top: 40px; font-size: 12px; text-align: center; color: #94a3b8; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">Brightline Dental Studio</div>
            <div class="title">New Patient Intake & Registration Records</div>
          </div>
          
          <div class="section">
            <div class="section-title">Personal Patient Demographics</div>
            <div class="grid">
              <div class="field"><div class="label">Patient Name</div><div class="val">${patientData.firstName || 'Not specified'} ${patientData.lastName || 'Not specified'}</div></div>
              <div class="field"><div class="label">Date of Birth</div><div class="val">${patientData.dob || 'Not specified'}</div></div>
              <div class="field"><div class="label">Phone Number</div><div class="val">${patientData.phone || 'Not specified'}</div></div>
              <div class="field"><div class="label">Email Address</div><div class="val">${patientData.email || 'Not specified'}</div></div>
              <div class="field"><div class="label">Gender Identification</div><div class="val">${patientData.gender}</div></div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Clinical Intent & Dental Profile</div>
            <div class="grid">
              <div class="field"><div class="label">Primary Reason for Visit</div><div class="val">${patientData.reason || 'Not specified'}</div></div>
              <div class="field"><div class="label">Last Dental Care Visit</div><div class="val">${patientData.lastVisit}</div></div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Active Medical / Dental History</div>
            <div class="field"><div class="label">Current Chronic Health Conditions</div><div class="val">${conditionsString}</div></div>
            <div class="field" style="margin-top: 12px;"><div class="label">Allergies & Drug Sensitivities</div><div class="val">${patientData.allergies || 'None reported'}</div></div>
          </div>

          <div class="section">
            <div class="section-title">Authorized Consents & Terms</div>
            <p style="font-size: 12px; line-height: 1.5; color: #475569;">
              By signing below, I certify that all of the above health profile and medical history records are correct, truthful, and complete to the best of my knowledge. I hereby authorize the clinical associates of Brightline Dental Studio to conduct comprehensive evaluations, diagnostic X-rays, and recommended preventive procedures.
            </p>
            <div class="signature-box">
              <div class="grid">
                <div><div class="label">Digital Signature Statement</div><div class="val" style="font-family: 'Georgia', serif; font-style: italic; font-size: 18px; margin-top: 6px;">${patientData.signature || 'Unsigned'}</div></div>
                <div><div class="label">Authorized Date</div><div class="val">${new Date().toLocaleDateString()}</div></div>
              </div>
            </div>
          </div>

          <div class="footer">
            Brightline Dental Studio • High-quality dental wellness for a healthy, confident smile.
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handlePrintReceipt = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    const tier = PLAN_TIERS.find(p => p.id === selectedTierId);
    if (!tier) return;

    const billingText = wellnessData.billingInterval === 'monthly' 
      ? `$${tier.priceMonthly} / month` 
      : `$${tier.priceAnnually} / year`;

    printWindow.document.write(`
      <html>
        <head>
          <title>Brightline Wellness Plan Confirmation</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #1e293b; padding: 40px; max-width: 600px; margin: auto; }
            .border-box { border: 2px dashed #0284c7; padding: 30px; border-radius: 12px; }
            .logo { font-size: 22px; font-weight: bold; color: #0284c7; text-align: center; margin-bottom: 6px; }
            .subtitle { font-size: 14px; text-align: center; color: #64748b; margin-bottom: 24px; text-transform: uppercase; letter-spacing: 1px; }
            .member-card { background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); color: white; padding: 20px; border-radius: 12px; margin-bottom: 24px; box-shadow: 0 4px 10px rgba(2, 132, 199, 0.15); }
            .card-title { font-size: 18px; font-weight: bold; margin-bottom: 12px; display: flex; justify-content: space-between; }
            .card-no { font-family: monospace; font-size: 16px; margin: 16px 0; letter-spacing: 2px; }
            .card-details { display: grid; grid-template-columns: 1fr 1fr; font-size: 12px; }
            .detail-label { color: #bae6fd; font-weight: 500; text-transform: uppercase; font-size: 10px; }
            .receipt-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
            .receipt-row.total { font-weight: bold; border-top: 2px solid #e2e8f0; border-bottom: none; font-size: 16px; padding-top: 12px; }
            .benefits-title { font-weight: bold; font-size: 13px; margin-top: 20px; margin-bottom: 8px; color: #0f172a; }
            .benefits-list { font-size: 12px; color: #475569; padding-left: 20px; line-height: 1.6; }
            .footer { text-align: center; margin-top: 30px; font-size: 11px; color: #94a3b8; }
          </style>
        </head>
        <body>
          <div class="border-box">
            <div class="logo">Brightline Dental Studio</div>
            <div class="subtitle">Wellness Plan Booking</div>
            
            <div class="member-card">
              <div class="card-title">
                <span>Brightline Member</span>
                <span>Pending Activation</span>
              </div>
              <div class="card-no">BLWP-PENDING</div>
              <div class="card-details">
                <div>
                  <div class="detail-label">Primary Member</div>
                  <div style="font-weight: 600;">${wellnessData.firstName} ${wellnessData.lastName}</div>
                </div>
                <div>
                  <div class="detail-label">Plan Tier</div>
                  <div style="font-weight: 600;">${tier.name}</div>
                </div>
              </div>
            </div>

            <h4 style="margin: 0 0 12px 0; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px;">Booking & Enrollment Request</h4>
            <div class="receipt-row">
              <span>Member Name</span>
              <span>${wellnessData.firstName} ${wellnessData.lastName}</span>
            </div>
            <div class="receipt-row">
              <span>Plan Selected</span>
              <span>${tier.name}</span>
            </div>
            <div class="receipt-row">
              <span>Billing Cadence</span>
              <span>${wellnessData.billingInterval === 'monthly' ? 'Monthly' : 'Annual'}</span>
            </div>
            <div class="receipt-row">
              <span>Booking Status</span>
              <span>Pending Owner/Practice Finalization</span>
            </div>
            <div class="receipt-row total">
              <span>Subscription Price</span>
              <span>${billingText}</span>
            </div>

            <div class="benefits-title">Your Enrolled Benefits Will Include:</div>
            <ul class="benefits-list">
              ${tier.benefits.map(b => `<li>${b}</li>`).join('')}
            </ul>

            <div class="footer">
              Brightline Dental Studio • Welcoming you to dental wellness. Our owner will contact you to activate this plan.
            </div>
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const resetFormsState = () => {
    setFormsStep(1);
    setFormsErrors({});
    setGenderDropdownOpen(false);
    setPatientData({
      firstName: '',
      lastName: '',
      dob: '',
      email: '',
      phone: '',
      gender: 'Prefer not to say',
      reason: '',
      lastVisit: 'Within last 6 months',
      allergies: '',
      conditions: [],
      consent: false,
      signature: ''
    });
    setActiveModal(null);
  };

  const resetWellnessState = () => {
    setWellnessStep('tiers');
    setSelectedTierId(null);
    setWellnessErrors({});
    setWellnessData({
      firstName: '',
      lastName: '',
      dob: '',
      email: '',
      phone: '',
      billingInterval: 'monthly'
    });
    setActiveModal(null);
  };

  return (
    <section className="py-24 bg-white relative">
      <div className="container mx-auto px-6 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-4">
            Making It Easy to <span className="text-primary italic">Get Started</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            We believe excellent care should be accessible and straightforward.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* New Patient Forms Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-secondary/50 rounded-3xl p-8 border border-secondary flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary mb-6 shadow-sm">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-serif font-medium text-foreground mb-4">
                New Patient Forms
              </h3>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Save time during your first visit by filling out your forms ahead of time. You can complete them fully online or download a custom print record.
              </p>
            </div>
            <div>
              <button 
                id="btn-fill-forms-online"
                onClick={() => setActiveModal('forms')}
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-medium px-6 py-3 rounded-xl transition-all shadow-sm group"
              >
                Fill Out Forms Online
                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>
          </motion.div>

          {/* Wellness Plan Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-secondary/50 rounded-3xl p-8 border border-secondary flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary mb-6 shadow-sm">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-serif font-medium text-foreground mb-4">
                Brightline Wellness Plan
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                No insurance? No problem. Our in-house dental membership plan is designed to make high-quality preventive care affordable and straightforward for everyone.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Includes 2 professional cleanings & exams per year',
                  'All necessary routine digital X-rays included',
                  '15% off all additional dental treatments',
                  'No deductibles, waiting periods, or annual maximums'
                ].map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3 text-foreground font-medium text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <button 
                id="btn-explore-wellness-plans"
                onClick={() => setActiveModal('wellness')}
                className="inline-flex items-center gap-2 bg-foreground text-background font-medium hover:bg-foreground/90 px-6 py-3 rounded-xl transition-all group shadow-sm"
              >
                Explore Membership Plans
                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* --- NEW PATIENT FORMS MODAL --- */}
      <AnimatePresence>
        {activeModal === 'forms' && (
          <div 
            id="modal-patient-forms"
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-100"
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 text-primary rounded-xl">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-semibold text-slate-900">
                      New Patient Registration
                    </h3>
                    <p className="text-xs text-slate-500">
                      Step {formsStep === 'success' ? 3 : formsStep} of 3
                    </p>
                  </div>
                </div>
                <button 
                  onClick={resetFormsState}
                  className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Progress Bar */}
              {formsStep !== 'success' && (
                <div className="w-full bg-slate-100 h-1">
                  <div 
                    className="bg-primary h-full transition-all duration-300"
                    style={{ width: `${(formsStep / 3) * 100}%` }}
                  />
                </div>
              )}

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto flex-1">
                {formsStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-serif font-medium text-slate-900 mb-1">
                        Personal Patient Details
                      </h4>
                      <p className="text-sm text-slate-500">
                        Please enter your accurate demographic and contact details.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">First Name *</label>
                        <input 
                          type="text" 
                          required
                          value={patientData.firstName}
                          onChange={(e) => setPatientData(p => ({ ...p, firstName: e.target.value }))}
                          placeholder="e.g. Sarah"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                        {formsErrors.firstName && <span className="text-xs text-red-500 mt-1 block">{formsErrors.firstName}</span>}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Last Name *</label>
                        <input 
                          type="text" 
                          required
                          value={patientData.lastName}
                          onChange={(e) => setPatientData(p => ({ ...p, lastName: e.target.value }))}
                          placeholder="e.g. Jenkins"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                        {formsErrors.lastName && <span className="text-xs text-red-500 mt-1 block">{formsErrors.lastName}</span>}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Date of Birth *</label>
                        <input 
                          type="date" 
                          required
                          value={patientData.dob}
                          onChange={(e) => setPatientData(p => ({ ...p, dob: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                        {formsErrors.dob && <span className="text-xs text-red-500 mt-1 block">{formsErrors.dob}</span>}
                      </div>
                      <div className="relative">
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Gender Identification</label>
                        <button
                          type="button"
                          onClick={() => setGenderDropdownOpen(!genderDropdownOpen)}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-left focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white flex justify-between items-center"
                        >
                          <span className="text-slate-800 font-medium">{patientData.gender}</span>
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        </button>
                        
                        {genderDropdownOpen && (
                          <>
                            <div 
                              className="fixed inset-0 z-10" 
                              onClick={() => setGenderDropdownOpen(false)} 
                            />
                            <div className="absolute left-0 right-0 mt-1.5 bg-white border border-slate-100 rounded-xl shadow-lg z-20 overflow-hidden py-1">
                              {['Female', 'Male', 'Non-binary', 'Prefer not to say'].map((option) => (
                                <button
                                  key={option}
                                  type="button"
                                  onClick={() => {
                                    setPatientData(p => ({ ...p, gender: option }));
                                    setGenderDropdownOpen(false);
                                  }}
                                  className={`w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 transition-colors block ${
                                    patientData.gender === option ? 'text-primary font-medium bg-primary/5' : 'text-slate-700'
                                  }`}
                                >
                                  {option}
                                </button>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Email Address *</label>
                        <input 
                          type="email" 
                          required
                          value={patientData.email}
                          onChange={(e) => setPatientData(p => ({ ...p, email: e.target.value }))}
                          placeholder="sarah@example.com"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                        {formsErrors.email && <span className="text-xs text-red-500 mt-1 block">{formsErrors.email}</span>}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Phone Number *</label>
                        <input 
                          type="tel" 
                          required
                          value={patientData.phone}
                          onChange={(e) => setPatientData(p => ({ ...p, phone: e.target.value }))}
                          placeholder="(555) 000-0000"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                        {formsErrors.phone && <span className="text-xs text-red-500 mt-1 block">{formsErrors.phone}</span>}
                      </div>
                    </div>
                  </div>
                )}

                {formsStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-serif font-medium text-slate-900 mb-1">
                        Clinical & Health History
                      </h4>
                      <p className="text-sm text-slate-500">
                        Help our dentists prepare safely by disclosing your medical profile.
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Primary Reason for Visit *</label>
                      <textarea 
                        rows={2}
                        value={patientData.reason}
                        onChange={(e) => setPatientData(p => ({ ...p, reason: e.target.value }))}
                        placeholder="e.g. Routine cleaning, crown evaluation, minor tooth sensitivity..."
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                      />
                      {formsErrors.reason && <span className="text-xs text-red-500 mt-1 block">{formsErrors.reason}</span>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">When was your last dental visit?</label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          'Within last 6 months',
                          '6 to 12 months ago',
                          '1 to 2 years ago',
                          'More than 2 years ago'
                        ].map((time) => (
                          <label 
                            key={time}
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border text-sm font-medium cursor-pointer transition-all ${
                              patientData.lastVisit === time 
                                ? 'bg-primary/5 border-primary text-primary' 
                                : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <input 
                              type="radio" 
                              name="lastVisit"
                              value={time}
                              checked={patientData.lastVisit === time}
                              onChange={() => setPatientData(p => ({ ...p, lastVisit: time }))}
                              className="sr-only"
                            />
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              patientData.lastVisit === time ? 'border-primary' : 'border-slate-300'
                            }`}>
                              {patientData.lastVisit === time && <div className="w-2 h-2 rounded-full bg-primary" />}
                            </div>
                            <span>{time}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Check any conditions that apply to you:</label>
                      <div className="grid grid-cols-2 gap-2">
                        {HEALTH_CONDITIONS.map((cond) => {
                          const isChecked = patientData.conditions.includes(cond.id);
                          return (
                            <label 
                              key={cond.id}
                              className={`flex items-start gap-3 px-3 py-2 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                                isChecked 
                                  ? 'bg-slate-50 border-primary text-slate-900' 
                                  : 'border-slate-200 hover:bg-slate-50/50 text-slate-600'
                              }`}
                            >
                              <input 
                                type="checkbox" 
                                checked={isChecked}
                                onChange={() => handleConditionToggle(cond.id)}
                                className="sr-only"
                              />
                              <div className={`w-4 h-4 rounded-md border mt-0.5 flex items-center justify-center transition-colors ${
                                isChecked ? 'bg-primary border-primary text-white' : 'border-slate-300'
                              }`}>
                                {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                              <span className="leading-tight">{cond.label}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Known Allergies / Medication Sensitivities</label>
                      <input 
                        type="text" 
                        value={patientData.allergies}
                        onChange={(e) => setPatientData(p => ({ ...p, allergies: e.target.value }))}
                        placeholder="e.g. Latex, Penicillin, Codeine, or 'None'"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>
                  </div>
                )}

                {formsStep === 3 && (
                  <form onSubmit={formsFormSubmit => handleFormsSubmit(formsFormSubmit)} className="space-y-6">
                    <div>
                      <h4 className="text-lg font-serif font-medium text-slate-900 mb-1">
                        Consents & Digital Authorization
                      </h4>
                      <p className="text-sm text-slate-500">
                        Please authorize the accuracy of the record and confirm intake submission.
                      </p>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs text-slate-600 leading-relaxed space-y-3">
                      <p>
                        <strong>1. Accuracy Certification:</strong> I hereby certify that the medical, clinical, and biographical details filled out in this application are correct, current, and complete to the absolute best of my knowledge.
                      </p>
                      <p>
                        <strong>2. Consent to Routine Diagnostics:</strong> I consent to basic dental evaluations, clinical screening, and diagnostic routine digital X-rays recommended by the clinic’s general practitioners to diagnose decay, fractures, or joint irregularities.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={patientData.consent}
                          onChange={(e) => setPatientData(p => ({ ...p, consent: e.target.checked }))}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 rounded-md border mt-0.5 flex items-center justify-center flex-shrink-0 transition-colors ${
                          patientData.consent ? 'bg-primary border-primary text-white' : 'border-slate-300'
                        }`}>
                          {patientData.consent && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <span className="text-xs text-slate-700 leading-normal">
                          I agree and sign electronically that all clinical records presented here are correct and I consent to dental screenings and policies. *
                        </span>
                      </label>
                      {formsErrors.consent && <span className="text-xs text-red-500 block">{formsErrors.consent}</span>}

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Signature (Type Full Name to Sign) *</label>
                        <input 
                          type="text" 
                          required
                          value={patientData.signature}
                          onChange={(e) => setPatientData(p => ({ ...p, signature: e.target.value }))}
                          placeholder="e.g. Sarah Jenkins"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-serif italic text-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-amber-50/10"
                        />
                        {formsErrors.signature && <span className="text-xs text-red-500 mt-1 block">{formsErrors.signature}</span>}
                      </div>
                    </div>
                  </form>
                )}

                {formsStep === 'success' && (
                  <div className="text-center py-8 px-4 space-y-6">
                    <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto shadow-sm">
                      <Check className="w-8 h-8 stroke-[2.5]" />
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-2xl font-serif font-semibold text-slate-900">
                        Intake Record Submitted!
                      </h4>
                      <p className="text-sm text-slate-500 max-w-md mx-auto">
                        Thank you, <span className="font-semibold text-slate-800">{patientData.firstName}</span>. Your details have been transmitted securely. We have added these to your chart.
                      </p>
                    </div>

                    {/* Patient confirmation summary card */}
                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 max-w-md mx-auto text-left space-y-3">
                      <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Patient Card</span>
                        <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded">Intake Received</span>
                      </div>
                      <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
                        <div>
                          <span className="text-slate-400">Full Name</span>
                          <p className="font-medium text-slate-800">{patientData.firstName} {patientData.lastName}</p>
                        </div>
                        <div>
                          <span className="text-slate-400">Date of Birth</span>
                          <p className="font-medium text-slate-800">{patientData.dob}</p>
                        </div>
                        <div>
                          <span className="text-slate-400">Confirmation No.</span>
                          <p className="font-medium font-mono text-slate-800">BLI-{Math.floor(100000 + Math.random() * 900000)}</p>
                        </div>
                        <div>
                          <span className="text-slate-400">Auth Signature</span>
                          <p className="font-serif italic text-slate-800">{patientData.signature}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto pt-4">
                      <button 
                        onClick={handleDownloadPDF}
                        className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-medium px-5 py-2.5 rounded-xl transition-all shadow-sm text-sm"
                      >
                        <Printer className="w-4 h-4" />
                        Print / View Full PDF Record
                      </button>
                      <button 
                        onClick={resetFormsState}
                        className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-5 py-2.5 rounded-xl transition-all text-sm"
                      >
                        Finish & Close
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {formsStep !== 'success' && (
                <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                  {formsStep > 1 ? (
                    <button 
                      onClick={() => setFormsStep(prev => (typeof prev === 'number' && prev > 1 ? (prev - 1) as any : 1))}
                      className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-700 font-medium text-sm py-2 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Back
                    </button>
                  ) : (
                    <div />
                  )}

                  {formsStep < 3 ? (
                    <button 
                      onClick={handleFormsNext}
                      className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-white font-medium px-5 py-2.5 rounded-xl transition-all shadow-sm text-sm"
                    >
                      Continue
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button 
                      onClick={(e) => handleFormsSubmit(e)}
                      disabled={formsSubmitting}
                      className="inline-flex items-center gap-1.5 bg-green-600 hover:bg-green-700 disabled:bg-green-600/60 disabled:cursor-not-allowed text-white font-medium px-6 py-2.5 rounded-xl transition-all shadow-sm text-sm"
                    >
                      <FileCheck2 className="w-4 h-4" />
                      {formsSubmitting ? 'Submitting...' : 'Submit Signature & Sign Up'}
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- WELLNESS PLANS EXPLORER & SIGN UP MODAL --- */}
      <AnimatePresence>
        {activeModal === 'wellness' && (
          <div 
            id="modal-wellness-plans"
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-100"
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 text-primary rounded-xl">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-semibold text-slate-900">
                      Brightline Wellness Plan Membership
                    </h3>
                    <p className="text-xs text-slate-500">
                      Choose a customized tier to unlock premium in-house general care.
                    </p>
                  </div>
                </div>
                <button 
                  onClick={resetWellnessState}
                  className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto flex-1">
                {wellnessStep === 'tiers' && (
                  <div className="space-y-6">
                    <div className="text-center max-w-lg mx-auto">
                      <h4 className="text-lg font-serif font-medium text-slate-900 mb-1">
                        Affordable In-house Preventive Dental Care
                      </h4>
                      <p className="text-sm text-slate-500">
                        Select from one of our popular membership plans below. No yearly caps, no waiting limits, and instant activation.
                      </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 pt-2">
                      {PLAN_TIERS.map((tier) => {
                        const isSelected = selectedTierId === tier.id;
                        return (
                          <div 
                            key={tier.id}
                            onClick={() => setSelectedTierId(tier.id)}
                            className={`rounded-2xl p-5 border-2 flex flex-col justify-between cursor-pointer transition-all duration-200 ${
                              isSelected 
                                ? 'border-primary bg-primary/5 shadow-md scale-[1.02]' 
                                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 bg-white'
                            }`}
                          >
                            <div className="space-y-4">
                              <div className="flex items-start justify-between">
                                <span className="text-xs font-bold text-primary tracking-wider uppercase bg-primary/10 px-2 py-0.5 rounded-full">
                                  {tier.target}
                                </span>
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                  isSelected ? 'border-primary bg-primary text-white' : 'border-slate-300'
                                }`}>
                                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                </div>
                              </div>

                              <div>
                                <h5 className="font-serif font-semibold text-lg text-slate-900">
                                  {tier.name}
                                </h5>
                                <p className="text-xs text-slate-500 mt-1 leading-normal">
                                  {tier.description}
                                </p>
                              </div>

                              <div className="pt-2 border-t border-slate-100">
                                <div className="flex items-baseline">
                                  <span className="text-3xl font-bold text-slate-950 font-serif">${tier.priceMonthly}</span>
                                  <span className="text-slate-400 text-xs ml-1">/ month</span>
                                </div>
                                <p className="text-[10px] text-slate-400 mt-0.5">
                                  or billed annually at ${tier.priceAnnually}/yr
                                </p>
                              </div>

                              <ul className="space-y-2 pt-2 border-t border-slate-100">
                                {tier.benefits.map((ben, i) => (
                                  <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                                    <Check className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span>{ben}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {wellnessStep === 'checkout' && (
                  <form onSubmit={handleWellnessSubmit} className="grid md:grid-cols-5 gap-8">
                    {/* Left Column: Form Info */}
                    <div className="md:col-span-3 space-y-6">
                      <div>
                        <h4 className="text-lg font-serif font-medium text-slate-900 mb-1">
                          Billing & Enrollment Details
                        </h4>
                        <p className="text-sm text-slate-500">
                          Please fill out your personal and contact details. No credit card is required. Once registered, our owner will reach out to you to activate your plan benefits!
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">First Name *</label>
                            <input 
                              type="text" 
                              required
                              value={wellnessData.firstName}
                              onChange={(e) => setWellnessData(w => ({ ...w, firstName: e.target.value }))}
                              placeholder="Sarah"
                              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                            {wellnessErrors.firstName && <span className="text-xs text-red-500 mt-1 block">{wellnessErrors.firstName}</span>}
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Last Name *</label>
                            <input 
                              type="text" 
                              required
                              value={wellnessData.lastName}
                              onChange={(e) => setWellnessData(w => ({ ...w, lastName: e.target.value }))}
                              placeholder="Jenkins"
                              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                            {wellnessErrors.lastName && <span className="text-xs text-red-500 mt-1 block">{wellnessErrors.lastName}</span>}
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div className="col-span-1">
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Date of Birth *</label>
                            <input 
                              type="date" 
                              required
                              value={wellnessData.dob}
                              onChange={(e) => setWellnessData(w => ({ ...w, dob: e.target.value }))}
                              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                            {wellnessErrors.dob && <span className="text-xs text-red-500 mt-1 block">{wellnessErrors.dob}</span>}
                          </div>
                          <div className="col-span-1">
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Email Address *</label>
                            <input 
                              type="email" 
                              required
                              value={wellnessData.email}
                              onChange={(e) => setWellnessData(w => ({ ...w, email: e.target.value }))}
                              placeholder="sarah@example.com"
                              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                            {wellnessErrors.email && <span className="text-xs text-red-500 mt-1 block">{wellnessErrors.email}</span>}
                          </div>
                          <div className="col-span-1">
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Phone Number *</label>
                            <input 
                              type="tel" 
                              required
                              value={wellnessData.phone}
                              onChange={(e) => setWellnessData(w => ({ ...w, phone: e.target.value }))}
                              placeholder="(555) 000-0000"
                              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                            {wellnessErrors.phone && <span className="text-xs text-red-500 mt-1 block">{wellnessErrors.phone}</span>}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Cart Summary */}
                    <div className="md:col-span-2 bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col justify-between h-fit">
                      <div className="space-y-4">
                        <h5 className="font-semibold text-sm text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-200">
                          Plan Summary
                        </h5>

                        {(() => {
                          const tier = PLAN_TIERS.find(p => p.id === selectedTierId);
                          if (!tier) return null;
                          const currentPrice = wellnessData.billingInterval === 'monthly' ? tier.priceMonthly : tier.priceAnnually;
                          return (
                            <div className="space-y-4 text-sm">
                              <div>
                                <p className="font-serif font-semibold text-slate-900 text-base">{tier.name}</p>
                                <p className="text-xs text-slate-500 mt-0.5">{tier.target}</p>
                              </div>

                              {/* Toggle intervals */}
                              <div className="flex rounded-xl bg-slate-200 p-1">
                                <button
                                  type="button"
                                  onClick={() => setWellnessData(w => ({ ...w, billingInterval: 'monthly' }))}
                                  className={`flex-1 text-center py-1.5 text-xs font-semibold rounded-lg transition-all ${
                                    wellnessData.billingInterval === 'monthly' 
                                      ? 'bg-white text-slate-900 shadow-sm' 
                                      : 'text-slate-500 hover:text-slate-700'
                                  }`}
                                >
                                  Monthly
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setWellnessData(w => ({ ...w, billingInterval: 'annually' }))}
                                  className={`flex-1 text-center py-1.5 text-xs font-semibold rounded-lg transition-all ${
                                    wellnessData.billingInterval === 'annually' 
                                      ? 'bg-white text-slate-900 shadow-sm' 
                                      : 'text-slate-500 hover:text-slate-700'
                                  }`}
                                >
                                  Annual (Save 15%)
                                </button>
                              </div>

                              <div className="space-y-2 pt-2">
                                <div className="flex justify-between text-xs text-slate-500">
                                  <span>Enrollment fee</span>
                                  <span className="text-green-500 font-semibold">Waived ($0)</span>
                                </div>
                                <div className="flex justify-between text-xs text-slate-500">
                                  <span>Subscription plan</span>
                                  <span>${currentPrice} / {wellnessData.billingInterval === 'monthly' ? 'mo' : 'yr'}</span>
                                </div>
                                <div className="flex justify-between pt-2 border-t border-slate-200 text-slate-900 font-bold">
                                  <span>Initial Total</span>
                                  <span>${currentPrice}.00</span>
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>

                      <div className="pt-6">
                        <button
                          type="submit"
                          disabled={wellnessSubmitting}
                          className="w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 disabled:bg-primary/60 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition-all shadow-sm text-sm"
                        >
                          <Award className="w-4 h-4" />
                          {wellnessSubmitting ? 'Submitting Booking...' : 'Submit Membership Booking'}
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                {wellnessStep === 'success' && (
                  <div className="text-center py-8 px-4 space-y-6">
                    <div className="w-16 h-16 bg-blue-50 text-primary rounded-full flex items-center justify-center mx-auto shadow-sm">
                      <Award className="w-8 h-8 stroke-[2.2]" />
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-2xl font-serif font-semibold text-slate-900">
                        Membership Booking Registered!
                      </h4>
                      <p className="text-sm text-slate-500 max-w-md mx-auto">
                        Thank you, <span className="font-semibold text-slate-800">{wellnessData.firstName}</span>. Your membership booking request has been registered securely. Our team/owner will reach out to you shortly at <span className="font-semibold text-slate-800">{wellnessData.phone}</span> or <span className="font-semibold text-slate-800">{wellnessData.email}</span> to finalize your plan enrollment and activate your dental benefits!
                      </p>
                    </div>

                    {/* Digital Membership Card Layout */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-850 rounded-2xl p-6 text-white text-left max-w-md mx-auto shadow-xl border border-slate-800">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -mr-12 -mt-12" />
                      
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <p className="text-xs font-bold text-primary uppercase tracking-widest">Brightline Dental</p>
                          <p className="text-[10px] text-slate-400 mt-0.5 uppercase tracking-widest">Wellness Card</p>
                        </div>
                        <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                      </div>

                      <div className="space-y-4">
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase tracking-wider">Membership Number (Pending)</p>
                          <p className="text-lg font-mono font-medium tracking-widest text-slate-300">BLWP-{Math.floor(100000 + Math.random() * 900000)}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-800">
                          <div>
                            <p className="text-[9px] text-slate-400 uppercase tracking-wider">Member Name</p>
                            <p className="text-xs font-semibold text-slate-200">{wellnessData.firstName} {wellnessData.lastName}</p>
                          </div>
                          <div>
                            <p className="text-[9px] text-slate-400 uppercase tracking-wider">Selected Plan</p>
                            <p className="text-xs font-semibold text-slate-200">
                              {PLAN_TIERS.find(t => t.id === selectedTierId)?.name || 'Wellness Plan'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto pt-4">
                      <button 
                        onClick={handlePrintReceipt}
                        className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-medium px-5 py-2.5 rounded-xl transition-all shadow-sm text-sm"
                      >
                        <Printer className="w-4 h-4" />
                        Print Booking Receipt & Terms
                      </button>
                      <button 
                        onClick={resetWellnessState}
                        className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-5 py-2.5 rounded-xl transition-all text-sm"
                      >
                        Finish & Close
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer navigation */}
              {wellnessStep !== 'success' && (
                <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                  {wellnessStep === 'checkout' ? (
                    <button 
                      onClick={() => setWellnessStep('tiers')}
                      className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-700 font-medium text-sm py-2 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Back to Tiers
                    </button>
                  ) : (
                    <div />
                  )}

                  {wellnessStep === 'tiers' ? (
                    <button 
                      onClick={handleWellnessNext}
                      disabled={!selectedTierId}
                      className={`inline-flex items-center gap-1.5 font-medium px-6 py-2.5 rounded-xl transition-all shadow-sm text-sm ${
                        selectedTierId 
                          ? 'bg-primary hover:bg-primary/90 text-white cursor-pointer' 
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      Enroll in Selection
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : null}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

