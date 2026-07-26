import { useState } from "react";

import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const formSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Valid phone number is required'),
  service: z.string().min(1, 'Please select a service'),
  date: z.string().min(1, 'Please select a preferred date'),
  message: z.string().optional(),
});

export function Contact() {
  const { toast } = useToast();
  const { session } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      service: '',
      date: '',
      message: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      // Attach auth token if signed in so the appointment links to the user's account
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          phone: values.phone,
          service: values.service,
          preferred_date: values.date,
          message: values.message,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Something went wrong');
      }

      toast({
        title: "Request Received!",
        description: "We'll be in touch shortly to confirm your appointment time.",
      });
      form.reset();
    } catch (err: any) {
      toast({
        title: "Submission Failed",
        description: err.message ?? 'Please try again or call us directly.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-white relative">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <h2 className="text-4xl font-serif text-foreground mb-8">
              Ready for Your <br/>
              <span className="text-primary italic">Best Smile?</span>
            </h2>
            
            <div className="space-y-8 bg-secondary/30 p-8 rounded-3xl border border-border">
              <div className="flex gap-4">
                <div className="text-primary mt-1"><MapPin className="w-5 h-5" /></div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Address</h4>
                  <p className="text-muted-foreground text-sm">214 Maple Grove Avenue<br/>Suite 3B<br/>Ashford Heights</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="text-primary mt-1"><Phone className="w-5 h-5" /></div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Phone</h4>
                  <p className="text-muted-foreground text-sm">(555) 023-8890</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="text-primary mt-1"><Mail className="w-5 h-5" /></div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Email</h4>
                  <p className="text-muted-foreground text-sm">hello@brightlinedental.com</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="text-primary mt-1"><Clock className="w-5 h-5" /></div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Hours</h4>
                  <p className="text-muted-foreground text-sm">Mon–Fri: 8am – 6pm<br/>Saturday: 9am – 3pm<br/>Sunday: Closed</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Jane Smith" {...field} className="bg-secondary/20" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="jane@example.com" {...field} className="bg-secondary/20" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="(555) 000-0000" {...field} className="bg-secondary/20" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="service"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-secondary/20">
                            <SelectValue placeholder="Select a service" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="general-checkup">General Check-up & Cleaning</SelectItem>
                          <SelectItem value="teeth-whitening">Teeth Whitening</SelectItem>
                          <SelectItem value="cosmetic-veneers">Cosmetic Veneers</SelectItem>
                          <SelectItem value="dental-implants">Dental Implants</SelectItem>
                          <SelectItem value="orthodontics">Orthodontics / Braces</SelectItem>
                          <SelectItem value="emergency">Emergency Care</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} className="bg-secondary/20" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Any specific concerns?" {...field} className="bg-secondary/20 resize-none" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-primary text-white py-3.5 rounded-xl font-medium hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                >
                  {isSubmitting ? 'Sending Request...' : 'Request Appointment'}
                </button>
              </form>
            </Form>
          </motion.div>

          {/* Map Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1 rounded-3xl overflow-hidden bg-secondary relative min-h-[300px] border border-border group"
          >
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: `radial-gradient(circle at center, rgba(0,0,161,0.6) 2px, transparent 2px)`,
              backgroundSize: '24px 24px'
            }} />
            <div className="absolute inset-0 flex items-center justify-center flex-col gap-4 group-hover:scale-105 transition-transform duration-500">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white shadow-xl shadow-primary/30 relative">
                <MapPin className="w-8 h-8" />
                <div className="absolute inset-0 rounded-full border-4 border-white opacity-20 animate-ping" />
              </div>
              <div className="bg-white px-4 py-2 rounded-lg shadow-md border border-border text-center">
                <span className="block font-medium text-foreground">Brightline Dental Studio</span>
                <span className="block text-xs text-muted-foreground mt-0.5">214 Maple Grove Ave</span>
              </div>
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
