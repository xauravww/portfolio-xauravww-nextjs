import HomePage from '@/pages/Home';
import TechStack from '@/pages/TechStack';
import ProjectOverview from '@/pages/ProjectOverview';
import Experience from '@/pages/Experience';
import Blogs from '@/pages/Blogs';
import Education from '@/pages/Education';
import ContactMe from '@/pages/ContactMe';
import CursorGlow from '@/components/CursorGlow';
import Navbar from '@/components/Navbar';
// import GlobalTerminal from '@/components/GlobalTerminal';
import NavbarContextFunction from '@/context/navbarContext';

export default function Home() {
  return (
    <div className="App relative min-h-screen">
      <CursorGlow />
      {/* <GlobalTerminal /> */}
      <NavbarContextFunction>
        <Navbar />
        <main>
          <HomePage containerId="section1" />
          <TechStack containerId="section2" />
          <ProjectOverview containerId="section3" />
          <Experience containerId="section4" />
          <Blogs containerId="section5" />
          <Education containerId="section6" />
          <ContactMe containerId="section7" />
        </main>
      </NavbarContextFunction>
    </div>
  );
}
