'use client';
import { GithubLogo, Link } from '@phosphor-icons/react';
import { Page, Card, List, Row, SectionLabel, Button, Tag, Avatar } from './ui';

const GitHubIcon = <GithubLogo size={14} weight="fill" />;
const LinkIcon = <Link size={14} weight="bold" />;

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
