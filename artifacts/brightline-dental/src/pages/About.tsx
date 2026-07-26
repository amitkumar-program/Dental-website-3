import { PageLayout } from '../components/PageLayout';
import { PageHero } from '../components/PageHero';
import { About } from '../components/sections/About';
import { Team } from '../components/sections/Team';

export default function AboutPage() {
  return (
    <PageLayout>
      <PageHero
        eyebrow="About Brightline"
        title="Care That Goes"
        titleAccent="Beyond the Chair."
        subtitle="We believe that a visit to the dentist shouldn't be something you dread. Brightline was founded to reimagine dental care as warm, human, and deeply reassuring."
      />
      <About />
      <Team />
    </PageLayout>
  );
}
