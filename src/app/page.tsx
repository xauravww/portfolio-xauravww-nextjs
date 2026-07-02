import CursorGlow from '@/components/CursorGlow';
import Desktop from '@/components/os/Desktop';

export default function Home() {
  return (
    <div className="App relative h-screen overflow-hidden">
      <CursorGlow />
      <Desktop />
    </div>
  );
}
