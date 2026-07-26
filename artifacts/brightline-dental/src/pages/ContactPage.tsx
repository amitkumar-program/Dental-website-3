import { PageLayout } from '../components/PageLayout';
import { PageHero } from '../components/PageHero';
import { Contact } from '../components/sections/Contact';

export default function ContactPage() {
  return (
    <PageLayout>
      <PageHero
        eyebrow="Get In Touch"
        title="Ready for Your"
        titleAccent="Best Smile?"
        subtitle="Book an appointment, ask a question, or just say hello. We're here Mon–Fri 8am–6pm and Saturday 9am–2pm."
      />
      <Contact />
    </PageLayout>
  );
}
