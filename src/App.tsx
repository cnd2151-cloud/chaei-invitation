import { ToastProvider } from './lib/toast';
import { useRevealAll } from './lib/useReveal';
import Hero from './components/Hero';
import Invitation from './components/Invitation';
import Parents from './components/Parents';
import Story from './components/Story';
import Calendar from './components/Calendar';
import Gallery from './components/Gallery';
import Location from './components/Location';
import Accounts from './components/Accounts';
import Closing from './components/Closing';
import BgmButton from './components/BgmButton';

function Page() {
  useRevealAll();
  return (
    <main className="page">
      <Hero />
      <Invitation />
      <Parents />
      <Story />
      <Calendar />
      <Gallery />
      <Location />
      <Accounts />
      <Closing />
    </main>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <Page />
      <BgmButton />
    </ToastProvider>
  );
}
