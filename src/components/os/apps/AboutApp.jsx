'use client';
import { Page, Card, List, Row, SectionLabel, Button, Tag, Avatar } from './ui';

const GitHubIcon = <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.6 0-12 5.4-12 12 0 5.3 3.4 9.8 8.2 11.4.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.5-1.4-1.3-1.8-1.3-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2 1-.3 2-.4 3-.4s2 .1 3 .4c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.8-1.6 8.2-6.1 8.2-11.4 0-6.6-5.4-12-12-12z"/></svg>;
const LinkIcon = <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 010 5.656l-3 3a4 4 0 01-5.656-5.656l1.5-1.5M10.172 13.828a4 4 0 010-5.656l3-3a4 4 0 015.656 5.656l-1.5 1.5"/></svg>;

const TAGS = ['React', 'Node.js', 'Next.js', 'TypeScript', 'AI/ML', 'MongoDB'];

const AboutApp = () => (
  <Page>
    {/* Header: avatar + identity */}
    <div className="flex items-center gap-4 mb-4">
      <Avatar src="/images/author.jpeg" alt="Saurav Maheshwari" size={76} radius={18} />
      <div className="min-w-0">
        <h2 className="text-[17px] font-bold text-white leading-tight">Saurav Maheshwari</h2>
        <p className="text-[12.5px] text-[#0A84FF] font-medium mt-0.5">Full-Stack Developer</p>
        <div className="flex gap-2 mt-2.5">
          <Button href="https://github.com/xauravww" variant="default" icon={GitHubIcon}>GitHub</Button>
          <Button href="https://xauravww.hashnode.dev" variant="default" icon={LinkIcon}>Blog</Button>
        </div>
      </div>
    </div>

    {/* Bio card */}
    <Card className="mb-4">
      <div className="p-3.5 space-y-2.5">
        <p className="text-[13px] text-white/75 leading-relaxed">
          I&apos;m a Full-Stack Developer with a strong problem-solving mindset and a focus on automation, web scraping, and AI agents. I work daily with React, Node.js, TypeScript, and modern database designs, building everything from custom social media automations and live data agents to secure legal systems, e-commerce platforms, and international community portals.
        </p>
        <p className="text-[13px] text-white/75 leading-relaxed">
          I believe in shipping clean, simple, and high-performance code that works smoothly. Beyond development, I write about practical programming on my blog and contribute to open-source tools.
        </p>
      </div>
    </Card>

    {/* Focus Areas */}
    <SectionLabel>Focus Areas</SectionLabel>
    <Card>
      <List>
        <Row
          left={
            <div className="flex flex-col py-0.5">
              <span className="text-[12.5px] font-semibold text-white/90">🤖 AI Agents & Data Scraping</span>
              <span className="text-[11px] text-white/35 mt-0.5">Building custom AI agents, LangChain workflows, and live scraping scripts</span>
            </div>
          }
        />
        <Row
          left={
            <div className="flex flex-col py-0.5">
              <span className="text-[12.5px] font-semibold text-white/90">⚙️ Workflow & Social Automation</span>
              <span className="text-[11px] text-white/35 mt-0.5">Orchestrating Telegram bots, social media automations, and cron pipelines</span>
            </div>
          }
        />
        <Row
          left={
            <div className="flex flex-col py-0.5">
              <span className="text-[12.5px] font-semibold text-white/90">💼 E-Commerce & Enterprise Tools</span>
              <span className="text-[11px] text-white/35 mt-0.5">Developing secure legal systems, project managers, and shopping platforms</span>
            </div>
          }
        />
        <Row
          left={
            <div className="flex flex-col py-0.5">
              <span className="text-[12.5px] font-semibold text-white/90">🌐 Communities & Visually Rich Sites</span>
              <span className="text-[11px] text-white/35 mt-0.5">Crafting international portal hubs and responsive, stunning landing pages</span>
            </div>
          }
        />
      </List>
    </Card>
  </Page>
);

export default AboutApp;
