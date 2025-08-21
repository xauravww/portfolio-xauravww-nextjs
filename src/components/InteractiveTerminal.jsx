'use client';
import React, { useState, useEffect, useRef } from 'react';
import { PROJECT_DETAILS } from '../utils/data';

const InteractiveTerminal = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    { type: 'output', content: 'Welcome to Saurav\'s Portfolio Terminal!' },
    { type: 'output', content: 'Type "help" to see available commands.' },
  ]);
  const [currentPath, setCurrentPath] = useState('~/portfolio');
  const terminalRef = useRef(null);
  const inputRef = useRef(null);

  const commands = {
    help: () => [
      '╭─ Available Commands ─╮',
      '│                     │',
      '│  about      - About me & background',
      '│  skills     - Technical expertise',
      '│  projects   - Featured work',
      '│  contact    - Get in touch',
      '│  experience - Work history',
      '│  education  - Academic background',
      '│  clear      - Clear terminal',
      '│  whoami     - Current user',
      '│  ls         - List files',
      '│  cat <file> - Read file',
      '│  project-details <name> - Project info',
      '│  github     - GitHub profile',
      '│  neofetch   - System info',
      '│  exit       - Close terminal',
      '│                     │',
      '╰─────────────────────╯',
    ],
    about: () => [
      '╭─ About Saurav Maheshwari ─╮',
      '│                           │',
      '│  👨‍💻 Full Stack Developer    │',
      '│  🤖 AI/Automation Expert   │',
      '│  🎯 Telegram Bot Creator   │',
      '│  🚀 Innovation enthusiast   │',
      '│  💡 Problem solver          │',
      '│                           │',
      '╰───────────────────────────╯',
      '',
      'I specialize in creating AI-powered applications,',
      'automation tools, and interactive web experiences.',
      'From Telegram bots to full-stack web apps,',
      'I love building solutions that make life easier!',
      '',
      '🎓 Currently exploring: AI/ML, Automation, Web3',
    ],
    skills: () => [
      '╭─ Technical Skills ─╮',
      '│                   │',
      '├── 🎨 Frontend',
      '│   ├── React & Next.js',
      '│   ├── JavaScript/TypeScript',
      '│   ├── HTML5 & CSS3',
      '│   └── Tailwind CSS',
      '│',
      '├── ⚙️  Backend',
      '│   ├── Node.js & Express',
      '│   ├── Python',
      '│   ├── REST APIs',
      '│   └── Telegram Bot API',
      '│',
      '├── 🗄️  Database',
      '│   ├── MongoDB',
      '│   ├── Redis',
      '│   ├── Notion DB',
      '│   └── Sanity CMS',
      '│',
      '├── 🤖 AI/Automation',
      '│   ├── N8N Workflows',
      '│   ├── GramJS',
      '│   ├── AI Integration',
      '│   └── Bot Development',
      '│',
      '└── 🛠️  Tools & Others',
      '    ├── Git & GitHub',
      '    ├── Docker',
      '    ├── Cloudinary',
      '    └── Render/Netlify',
      '',
      '╰───────────────────╯',
    ],
    projects: () => {
      const featuredProjects = PROJECT_DETAILS.slice(0, 6); // Show top 6 projects
      const projectLines = [
        '╭─ Featured Projects ─╮',
        '│                    │',
      ];
      
      featuredProjects.forEach((project, index) => {
        const emoji = index === 0 ? '🤖' : index === 1 ? '🤖' : index === 2 ? '💬' : index === 3 ? '📱' : index === 4 ? '📝' : '💼';
        projectLines.push(`│  ${emoji} ${project.title}`);
        projectLines.push(`│     ${project.techStacks.slice(0, 2).join(', ')}`);
        projectLines.push(`│     Difficulty: ${project.difficulty}`);
        if (project.url?.live) {
          projectLines.push(`│     🌐 ${project.url.live.replace('https://', '')}`);
        }
        projectLines.push('│');
      });
      
      projectLines.push('│                    │');
      projectLines.push('╰────────────────────╯');
      projectLines.push('');
      projectLines.push(`Total Projects: ${PROJECT_DETAILS.length}`);
      projectLines.push('Use "cat projects.json" for detailed list!');
      
      return projectLines;
    },
    contact: () => [
      '╭─ Contact Information ─╮',
      '│                      │',
      '│  📧 Email            │',
      '│     saurav@example.com',
      '│                      │',
      '│  💼 LinkedIn         │',
      '│     /in/sauravmaheshwari',
      '│                      │',
      '│  🐙 GitHub           │',
      '│     github.com/xauravww',
      '│                      │',
      '│  🌐 Portfolio        │',
      '│     You\'re here! 😊   │',
      '│                      │',
      '│  🤖 Telegram Bot     │',
      '│     @funwalabot      │',
      '│                      │',
      '╰──────────────────────╯',
      '',
      'Always open for collaborations and opportunities!',
    ],
    experience: () => [
      '╭─ Work Experience ─╮',
      '│                  │',
      '│  🏢 Full Stack Developer',
      '│     Company Name',
      '│     📅 2022 - Present',
      '│',
      '│  🔧 Technologies:',
      '│     • React & Node.js',
      '│     • MongoDB & PostgreSQL',
      '│     • AWS & Docker',
      '│     • Agile Development',
      '│                  │',
      '╰──────────────────╯',
      '',
      'Check the Experience section for detailed timeline!',
    ],
    education: () => [
      '╭─ Education ─╮',
      '│             │',
      '│  🎓 Computer Science',
      '│     University Name',
      '│     📅 2018 - 2022',
      '│             │',
      '│  📚 Relevant Coursework:',
      '│     • Data Structures',
      '│     • Web Development',
      '│     • Database Systems',
      '│     • Software Engineering',
      '│             │',
      '╰─────────────╯',
    ],
    neofetch: () => [
      '                   -`                    saurav@portfolio',
      '                  .o+`                   ─────────────────',
      '                 `ooo/                   OS: Portfolio Linux',
      '                `+oooo:                  Host: Interactive Terminal',
      '               `+oooooo:                 Kernel: JavaScript v1.0',
      '               -+oooooo+:                Uptime: Always online',
      '             `/:-:++oooo+:               Shell: bash 5.0.17',
      '            `/++++/+++++++:              Resolution: Responsive',
      '           `/++++++++++++++:             Terminal: xterm-256color',
      '          `/+++ooooooooo+++/             CPU: React (8) @ 60fps',
      '         ./ooosssso++osssssso+`          Memory: Optimized',
      '        .oossssso-````/ossssss+`         ',
      '       -osssssso.      :ssssssso.        ████ ████ ████ ████',
      '      :osssssss/        osssso+++.       ████ ████ ████ ████',
      '     /ossssssss/        +ssssooo/-       ',
      '   `/ossssso+/:-        -:/+osssso+-     ',
      '  `+sso+:-`                 `.-/+oso:    ',
      ' `++:.                           `-/+/   ',
      ' .`                                 `/   ',
    ],
    whoami: () => ['saurav'],
    pwd: () => ['/home/saurav/portfolio'],
    ls: () => [
      'total 8',
      'drwxr-xr-x  2 saurav saurav 4096 Dec 15 10:30 .',
      'drwxr-xr-x  3 saurav saurav 4096 Dec 15 10:29 ..',
      '-rw-r--r--  1 saurav saurav  256 Dec 15 10:30 about.txt',
      '-rw-r--r--  1 saurav saurav  512 Dec 15 10:30 skills.json',
      '-rw-r--r--  1 saurav saurav 2048 Dec 15 10:30 projects.json',
      'drwxr-xr-x  2 saurav saurav 4096 Dec 15 10:30 bots/',
      '-rw-r--r--  1 saurav saurav  128 Dec 15 10:30 contact.md',
      '-rw-r--r--  1 saurav saurav 1024 Dec 15 10:30 resume.pdf',
    ],
    cat: (args) => {
      const file = args[0];
      if (!file) return ['cat: missing file operand', 'Try "cat <filename>" or "ls" to see available files'];
      
      const files = {
        'about.txt': [
          '╭─ about.txt ─╮',
          '│             │',
          '│ Full Stack Developer passionate about creating',
          '│ amazing web experiences and solving real-world',
          '│ problems with clean, efficient code.',
          '│             │',
          '│ Always learning, always building! 🚀',
          '│             │',
          '╰─────────────╯',
        ],
        'skills.json': [
          '{',
          '  "name": "Saurav Maheshwari",',
          '  "role": "Full Stack Developer & AI Enthusiast",',
          '  "frontend": [',
          '    "React", "Next.js", "JavaScript",',
          '    "TypeScript", "HTML5", "CSS3", "Tailwind"',
          '  ],',
          '  "backend": [',
          '    "Node.js", "Express", "Python",',
          '    "REST APIs", "Telegram Bot API"',
          '  ],',
          '  "database": ["MongoDB", "Redis", "Notion DB", "Sanity CMS"],',
          '  "aiAutomation": ["N8N", "GramJS", "AI Integration"],',
          '  "tools": ["Git", "Docker", "Cloudinary", "Render"],',
          '  "specialties": [',
          '    "Telegram Bot Development",',
          '    "AI-powered Applications",',
          '    "Automation Workflows",',
          '    "Full-stack Web Development"',
          '  ],',
          '  "passion": "Building AI-powered solutions that automate and simplify"',
          '}',
        ],
        'projects.json': (() => {
          const projectsJson = [
            '{',
            '  "totalProjects": ' + PROJECT_DETAILS.length + ',',
            '  "featured": [',
          ];
          
          PROJECT_DETAILS.slice(0, 5).forEach((project, index) => {
            projectsJson.push('    {');
            projectsJson.push(`      "title": "${project.title}",`);
            projectsJson.push(`      "tech": [${project.techStacks.map(tech => `"${tech}"`).join(', ')}],`);
            projectsJson.push(`      "difficulty": "${project.difficulty}",`);
            if (project.url?.live) {
              projectsJson.push(`      "live": "${project.url.live}",`);
            }
            if (project.url?.repo) {
              projectsJson.push(`      "repo": "${project.url.repo}"`);
            }
            projectsJson.push(index < 4 ? '    },' : '    }');
          });
          
          projectsJson.push('  ],');
          projectsJson.push('  "categories": {');
          projectsJson.push('    "AI/Automation": 2,');
          projectsJson.push('    "Web Apps": 6,');
          projectsJson.push('    "Mini Projects": 5');
          projectsJson.push('  }');
          projectsJson.push('}');
          
          return projectsJson;
        })(),
        'contact.md': [
          '# 📞 Contact Information',
          '',
          '## Get In Touch!',
          '',
          '- 📧 **Email**: saurav@example.com',
          '- 💼 **LinkedIn**: linkedin.com/in/sauravmaheshwari',
          '- 🐙 **GitHub**: github.com/xauravww',
          '- 🤖 **Telegram**: @funwalabot',
          '',
          '---',
          '',
          '💡 *Always open to new opportunities and collaborations!*',
          '',
          '## Recent Projects',
          '- 🤖 AI Resume Analyzer',
          '- 🤖 FunWala Telegram Bot',
          '- 💬 Detoxy Fusion Chat App',
        ],
        'resume.pdf': [
          '📄 Resume Preview:',
          '',
          '╭─ SAURAV MAHESHWARI ─╮',
          '│ Full Stack Developer │',
          '╰─────────────────────╯',
          '',
          '🎯 OBJECTIVE',
          'Passionate developer focused on creating',
          'exceptional user experiences...',
          '',
          '💼 EXPERIENCE',
          'Full Stack Developer (2022-Present)',
          '• Built scalable web applications',
          '• Improved performance by 40%',
          '',
          '🎓 EDUCATION',
          'Computer Science Degree',
          '',
          '📧 Contact: your.email@example.com',
          '',
          '[This is a preview. Download full resume from website]',
        ],
      };
      return files[file] || [`cat: ${file}: No such file or directory`];
    },
    'project-details': (args) => {
      const projectName = args.join(' ').toLowerCase();
      const project = PROJECT_DETAILS.find(p => 
        p.title.toLowerCase().includes(projectName) ||
        p.id === projectName
      );
      
      if (!project) {
        return [
          'Project not found! Available projects:',
          ...PROJECT_DETAILS.slice(0, 5).map(p => `  • ${p.title}`)
        ];
      }
      
      const details = [
        `╭─ ${project.title} ─╮`,
        '│',
        `│  📝 ${project.description}`,
        '│',
        `│  🛠️  Tech Stack: ${project.techStacks.join(', ')}`,
        `│  📊 Difficulty: ${project.difficulty}`,
        '│'
      ];
      
      if (project.url?.live) {
        details.push(`│  🌐 Live: ${project.url.live}`);
      }
      if (project.url?.repo) {
        details.push(`│  📂 Repo: ${project.url.repo}`);
      }
      
      details.push('│');
      details.push('╰' + '─'.repeat(project.title.length + 4) + '╯');
      
      return details;
    },
    github: () => [
      '🐙 Opening GitHub profile...',
      '',
      '╭─ GitHub Stats ─╮',
      '│               │',
      '│  📂 13+ Public Repos',
      '│  ⭐ Featured Projects:',
      '│     • AI Resume Analyzer',
      '│     • FunWala Telegram Bot',
      '│     • Detoxy Fusion',
      '│     • Portfolio Website',
      '│               │',
      '╰───────────────╯',
      '',
      'Visit: github.com/xauravww',
    ],
    exit: () => {
      // This will be handled in the parent component
      return ['Goodbye! 👋'];
    },
    clear: () => {
      setHistory([]);
      return [];
    },
  };

  const executeCommand = (cmd) => {
    const [command, ...args] = cmd.trim().toLowerCase().split(' ');
    
    if (commands[command]) {
      const output = commands[command](args);
      return output;
    } else if (cmd.trim() === '') {
      return [];
    } else {
      return [`Command not found: ${command}. Type "help" for available commands.`];
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      const command = input.trim().toLowerCase();
      const newHistory = [
        ...history,
        { type: 'input', content: `┌─[saurav@portfolio]─[${currentPath}]\n└─$ ${input}` },
      ];
      
      if (command === 'exit') {
        // Close terminal - this will be handled by parent component
        const output = executeCommand(input);
        setHistory([
          ...newHistory,
          ...output.map(line => ({ type: 'output', content: line })),
        ]);
        setTimeout(() => {
          // Trigger close from parent
          window.dispatchEvent(new CustomEvent('closeTerminal'));
        }, 1000);
      } else if (command === 'clear') {
        setHistory([]);
      } else {
        const output = executeCommand(input);
        setHistory([
          ...newHistory,
          ...output.map(line => ({ type: 'output', content: line })),
        ]);
      }
      
      setInput('');
    }
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="terminal-container bg-[#0c0c0c] p-6 font-mono text-sm w-full min-h-[500px] relative">
      {/* Terminal content with hidden scrollbar */}
      <div 
        ref={terminalRef}
        className="terminal-content h-96 overflow-y-auto cursor-text pr-4"
        onClick={focusInput}
        style={{
          scrollbarWidth: 'none', /* Firefox */
          msOverflowStyle: 'none', /* IE and Edge */
        }}
      >
        {/* Welcome message */}
        <div className="mb-4">
          <div className="text-[#00ff00] mb-1">
            ╭─ Welcome to Saurav's Portfolio Terminal
          </div>
          <div className="text-[#00ff00] mb-3">
            ╰─ Type 'help' to see available commands
          </div>
        </div>

        {history.map((line, index) => (
          <div key={index} className={`mb-1 leading-relaxed ${
            line.type === 'input' 
              ? 'text-[#00ff00] font-medium' 
              : line.content.startsWith('Command not found') 
                ? 'text-[#ff6b6b] font-medium'
                : line.content.startsWith('Available commands:') || 
                  line.content.startsWith('Technical Skills:') ||
                  line.content.startsWith('Featured Projects:') ||
                  line.content.startsWith('Contact Information:') ||
                  line.content.startsWith('Work Experience:')
                  ? 'text-[#ffd93d] font-semibold'
                : line.content.startsWith('├──') || line.content.startsWith('└──') || line.content.startsWith('│')
                  ? 'text-[#74c0fc]'
                : line.content.includes('📧') || line.content.includes('💼') || line.content.includes('🐙') || line.content.includes('🌐')
                  ? 'text-[#ff8cc8]'
                : line.content.includes('🏢') || line.content.includes('📅') || line.content.includes('🔧')
                  ? 'text-[#51cf66]'
                : 'text-[#e9ecef]'
          }`}>
            {line.content}
          </div>
        ))}
        
        {/* Current input line */}
        <div className="flex items-center mt-2">
          <span className="text-[#00ff00] mr-2 font-medium select-none">
            ┌─[saurav@portfolio]─[{currentPath}]
          </span>
        </div>
        <div className="flex items-center">
          <span className="text-[#00ff00] mr-2 font-medium select-none">└─$</span>
          <span className="text-[#e9ecef]">{input}</span>
          <span className="animate-pulse text-[#00ff00] ml-1">█</span>
        </div>
        
        {/* Hidden input for capturing keystrokes */}
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSubmit(e);
            }
          }}
          className="absolute opacity-0 pointer-events-none"
          autoFocus
          spellCheck={false}
        />
      </div>
      
      {/* Terminal status bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#1a1a1a] px-6 py-2 text-xs text-[#6c757d] border-t border-[#2d2d2d] flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 bg-[#00ff00] rounded-full animate-pulse"></div>
            Online
          </span>
          <span>Lines: {history.length + 2}</span>
        </div>
        <div className="flex items-center gap-4">
          <span>UTF-8</span>
          <span>Bash</span>
          <span className="text-[#00ff00]">Ready</span>
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .terminal-content::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default InteractiveTerminal;