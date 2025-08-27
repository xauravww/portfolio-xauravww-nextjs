'use client';
import React, { useState, useEffect, useRef } from 'react';

const InteractiveTerminal = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    { type: 'output', content: 'Welcome to Saurav\'s Portfolio Terminal!' },
    { type: 'output', content: 'Type "help" to see available commands.' },
  ]);
  const [currentPath, setCurrentPath] = useState('~/portfolio');
  const [apiData, setApiData] = useState({
    projects: [],
    experiences: [],
    educations: [],
    techstacks: [],
    blogs: []
  });
  const [loading, setLoading] = useState(false);
  const [showStatusBar, setShowStatusBar] = useState(true);
  const terminalRef = useRef(null);
  const inputRef = useRef(null);

  // Fetch real data from APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, experiencesRes, educationsRes, techstacksRes, blogsRes] = await Promise.all([
          fetch('/api/portfolio/projects').catch(() => ({ ok: false })),
          fetch('/api/portfolio/experiences').catch(() => ({ ok: false })),
          fetch('/api/portfolio/educations').catch(() => ({ ok: false })),
          fetch('/api/portfolio/techstacks').catch(() => ({ ok: false })),
          fetch('/api/portfolio/blogs').catch(() => ({ ok: false }))
        ]);

        const data = {
          projects: projectsRes.ok ? await projectsRes.json() : [],
          experiences: experiencesRes.ok ? await experiencesRes.json() : [],
          educations: educationsRes.ok ? await educationsRes.json() : [],
          techstacks: techstacksRes.ok ? await techstacksRes.json() : [],
          blogs: blogsRes.ok ? await blogsRes.json() : []
        };

        setApiData(data);
      } catch (error) {
        console.error('Error fetching terminal data:', error);
      }
    };

    fetchData();
  }, []);

  // Handle external events (like from terminal header buttons)
  useEffect(() => {
    const handleToggleStatusBar = () => {
      setShowStatusBar(prev => !prev);
    };

    window.addEventListener('toggleStatusBar', handleToggleStatusBar);

    return () => {
      window.removeEventListener('toggleStatusBar', handleToggleStatusBar);
    };
  }, []);

  const commands = {
    help: () => [
      '╭─ Available Commands ─╮',
      '│                     │',
      '│  about      - About me',
      '│  projects   - My projects',
      '│  blogs      - Blog posts',
      '│  experience - Work history',
      '│  education  - Education',
      '│  techstack  - Tech stack',
      '│  contact    - Contact info',
      '│  status     - System status',
      '│  refresh    - Refresh data',
      '│  clear      - Clear screen',
      '│  exit       - Close terminal',
      '│                     │',
      '╰─────────────────────╯',
    ],
    about: () => {
      if (apiData.projects.length === 0 && apiData.experiences.length === 0) {
        return [
          'Loading profile data...',
          'Use "refresh" to try again'
        ];
      }

      const aboutLines = [
        '╭─ About Saurav Maheshwari ─╮',
        '│                           │',
        '│  👨‍💻 Full Stack Developer    │',
      ];

      if (apiData.experiences.length > 0) {
        const latestExp = apiData.experiences[0];
        aboutLines.push(`│  💼 ${latestExp.position}`);
        aboutLines.push(`│  🏢 ${latestExp.company}`);
      }

      if (apiData.projects.length > 0) {
        aboutLines.push(`│  🚀 ${apiData.projects.length} Projects Built`);
      }

      if (apiData.blogs.length > 0) {
        aboutLines.push(`│  📝 ${apiData.blogs.length} Blog Posts`);
      }

      aboutLines.push('│                           │');
      aboutLines.push('╰───────────────────────────╯');

      return aboutLines;
    },
    skills: () => {
      const skillsLines = [
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
      ];

      if (apiData.techstacks.length > 0) {
        skillsLines.push('');
        skillsLines.push('🔥 Current Tech Stack:');
        apiData.techstacks.slice(0, 8).forEach(tech => {
          skillsLines.push(`   • ${tech.name}`);
        });
      }

      return skillsLines;
    },

    techstack: () => {
      if (apiData.techstacks.length === 0) {
        return [
          '╭─ Tech Stack ─╮',
          '│              │',
          '│  Loading tech stack...',
          '│  Use "refresh" to try again',
          '│              │',
          '╰──────────────╯'
        ];
      }

      const techLines = [
        '╭─ Technology Stack ─╮',
        '│                   │',
      ];

      // Group by category if available
      const categories = {};
      apiData.techstacks.forEach(tech => {
        const category = tech.category || 'Other';
        if (!categories[category]) categories[category] = [];
        categories[category].push(tech);
      });

      Object.entries(categories).forEach(([category, techs]) => {
        const emoji = category === 'Frontend' ? '🎨' :
          category === 'Backend' ? '⚙️' :
            category === 'Database' ? '🗄️' :
              category === 'DevOps' ? '🚀' : '🛠️';
        techLines.push(`├── ${emoji} ${category}`);
        techs.slice(0, 4).forEach(tech => {
          techLines.push(`│   ├── ${tech.name}`);
        });
        techLines.push('│');
      });

      techLines.push('│                   │');
      techLines.push('╰───────────────────╯');
      techLines.push('');
      techLines.push(`Total Technologies: ${apiData.techstacks.length}`);

      return techLines;
    },

    blogs: () => {
      if (apiData.blogs.length === 0) {
        return [
          '╭─ Blog Posts ─╮',
          '│              │',
          '│  Loading blog posts...',
          '│  Use "refresh" to try again',
          '│              │',
          '╰──────────────╯'
        ];
      }

      const blogLines = [
        '╭─ Latest Blog Posts ─╮',
        '│                    │',
      ];

      apiData.blogs.slice(0, 5).forEach((blog, index) => {
        const emoji = ['📝', '💡', '🚀', '🔥', '⚡'][index] || '📄';
        blogLines.push(`│  ${emoji} ${blog.title}`);
        if (blog.brief) {
          const brief = blog.brief.length > 40 ? blog.brief.substring(0, 40) + '...' : blog.brief;
          blogLines.push(`│     ${brief}`);
        }
        if (blog.readTimeInMinutes) {
          blogLines.push(`│     ⏱️  ${blog.readTimeInMinutes} min read`);
        }
        blogLines.push('│');
      });

      blogLines.push('│                    │');
      blogLines.push('╰────────────────────╯');
      blogLines.push('');
      blogLines.push(`Total Posts: ${apiData.blogs.length}`);
      blogLines.push('Visit: https://xauravww.hashnode.dev');

      return blogLines;
    },

    refresh: async () => {
      setLoading(true);
      try {
        const [projectsRes, experiencesRes, educationsRes, techstacksRes, blogsRes] = await Promise.all([
          fetch('/api/portfolio/projects').catch(() => ({ ok: false })),
          fetch('/api/portfolio/experiences').catch(() => ({ ok: false })),
          fetch('/api/portfolio/educations').catch(() => ({ ok: false })),
          fetch('/api/portfolio/techstacks').catch(() => ({ ok: false })),
          fetch('/api/portfolio/blogs').catch(() => ({ ok: false }))
        ]);

        const data = {
          projects: projectsRes.ok ? await projectsRes.json() : [],
          experiences: experiencesRes.ok ? await experiencesRes.json() : [],
          educations: educationsRes.ok ? await educationsRes.json() : [],
          techstacks: techstacksRes.ok ? await techstacksRes.json() : [],
          blogs: blogsRes.ok ? await blogsRes.json() : []
        };

        setApiData(data);
        return [
          '🔄 Refreshing data from APIs...',
          '',
          `✅ Projects: ${data.projects.length} loaded`,
          `✅ Experiences: ${data.experiences.length} loaded`,
          `✅ Education: ${data.educations.length} loaded`,
          `✅ Tech Stack: ${data.techstacks.length} loaded`,
          `✅ Blog Posts: ${data.blogs.length} loaded`,
          '',
          '🎉 All data refreshed successfully!'
        ];
      } catch (error) {
        return [
          '❌ Error refreshing data:',
          error.message,
          '',
          'Please check your internet connection and try again.'
        ];
      } finally {
        setLoading(false);
      }
    },

    status: () => {
      const statusLines = [
        '╭─ API Status ─╮',
        '│              │',
        `│  📊 Projects: ${apiData.projects.length} items`,
        `│  💼 Experience: ${apiData.experiences.length} items`,
        `│  🎓 Education: ${apiData.educations.length} items`,
        `│  🛠️  Tech Stack: ${apiData.techstacks.length} items`,
        `│  📝 Blog Posts: ${apiData.blogs.length} items`,
        '│              │',
        '├─ System Info ─┤',
        '│              │',
        `│  🌐 API: ${loading ? 'Loading...' : 'Connected'}`,
        `│  📡 Session: Active`,
        `│  ⏰ Uptime: ${Math.floor((Date.now() - performance.now()) / 1000)}s`,
        `│  💾 Cache: Live data`,
        '│              │',
        '╰──────────────╯'
      ];

      return statusLines;
    },
    projects: () => {
      if (apiData.projects.length === 0) {
        return [
          '╭─ Projects ─╮',
          '│            │',
          '│  Loading projects from API...',
          '│  Use "refresh" to try again',
          '│            │',
          '╰────────────╯'
        ];
      }

      const featuredProjects = apiData.projects.slice(0, 6);
      const projectLines = [
        '╭─ Featured Projects ─╮',
        '│                    │',
      ];

      featuredProjects.forEach((project, index) => {
        const emoji = ['🚀', '💻', '🤖', '📱', '🌐', '⚡'][index] || '💼';
        projectLines.push(`│  ${emoji} ${project.title}`);
        if (project.techStacks && project.techStacks.length > 0) {
          projectLines.push(`│     ${project.techStacks.slice(0, 2).map(t => t.name || t).join(', ')}`);
        }
        if (project.liveUrl) {
          projectLines.push(`│     🌐 ${project.liveUrl.replace('https://', '')}`);
        }
        projectLines.push('│');
      });

      projectLines.push('│                    │');
      projectLines.push('╰────────────────────╯');
      projectLines.push('');
      projectLines.push(`Total Projects: ${apiData.projects.length}`);
      projectLines.push('Use "cat projects.json" for detailed list!');

      return projectLines;
    },
    contact: () => [
      '╭─ Contact Information ─╮',
      '│                      │',
      '│  🌐 Portfolio        │',
      '│     You\'re here! 😊   │',
      '│                      │',
      '│  🐙 GitHub           │',
      '│     github.com/xauravww',
      '│                      │',
      '│  📧 Get in touch via  │',
      '│     Contact section   │',
      '│                      │',
      '╰──────────────────────╯',
      '',
      'Check the Contact section for more details!',
    ],
    experience: () => {
      if (apiData.experiences.length === 0) {
        return [
          '╭─ Experience ─╮',
          '│              │',
          '│  Loading experience data...',
          '│  Use "refresh" to try again',
          '│              │',
          '╰──────────────╯'
        ];
      }

      const expLines = [
        '╭─ Work Experience ─╮',
        '│                  │',
      ];

      apiData.experiences.slice(0, 3).forEach((exp, index) => {
        const emoji = ['🏢', '💼', '🚀'][index] || '💼';
        expLines.push(`│  ${emoji} ${exp.position}`);
        expLines.push(`│     ${exp.company}`);
        expLines.push(`│     📅 ${exp.startDate} - ${exp.endDate || 'Present'}`);
        if (exp.techStacks && exp.techStacks.length > 0) {
          expLines.push(`│     🔧 ${exp.techStacks.slice(0, 3).map(t => t.name || t).join(', ')}`);
        }
        expLines.push('│');
      });

      expLines.push('│                  │');
      expLines.push('╰──────────────────╯');
      expLines.push('');
      expLines.push(`Total Experience: ${apiData.experiences.length} positions`);

      return expLines;
    },
    education: () => {
      if (apiData.educations.length === 0) {
        return [
          '╭─ Education ─╮',
          '│             │',
          '│  Loading education data...',
          '│  Use "refresh" to try again',
          '│             │',
          '╰─────────────╯'
        ];
      }

      const eduLines = [
        '╭─ Education ─╮',
        '│             │',
      ];

      apiData.educations.forEach((edu, index) => {
        const emoji = ['🎓', '📚', '🏫'][index] || '🎓';
        eduLines.push(`│  ${emoji} ${edu.degree}`);
        eduLines.push(`│     ${edu.institution}`);
        eduLines.push(`│     📅 ${edu.startDate} - ${edu.endDate}`);
        if (edu.grade) {
          eduLines.push(`│     📊 Grade: ${edu.grade}`);
        }
        eduLines.push('│');
      });

      eduLines.push('│             │');
      eduLines.push('╰─────────────╯');

      return eduLines;
    },


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
          if (apiData.projects.length === 0) {
            return [
              '{',
              '  "error": "No projects loaded",',
              '  "message": "Use \'refresh\' command to load data",',
              '  "totalProjects": 0',
              '}'
            ];
          }

          const projectsJson = [
            '{',
            '  "totalProjects": ' + apiData.projects.length + ',',
            '  "featured": [',
          ];

          apiData.projects.slice(0, 5).forEach((project, index) => {
            projectsJson.push('    {');
            projectsJson.push(`      "title": "${project.title}",`);
            if (project.techStacks && project.techStacks.length > 0) {
              const techNames = project.techStacks.map(tech => `"${tech.name || tech}"`).join(', ');
              projectsJson.push(`      "tech": [${techNames}],`);
            }
            if (project.liveUrl) {
              projectsJson.push(`      "live": "${project.liveUrl}",`);
            }
            if (project.githubUrl) {
              projectsJson.push(`      "repo": "${project.githubUrl}"`);
            }
            projectsJson.push(index < 4 ? '    },' : '    }');
          });

          projectsJson.push('  ],');
          projectsJson.push('  "lastUpdated": "' + new Date().toISOString() + '"');
          projectsJson.push('}');

          return projectsJson;
        })(),

        'blogs.json': (() => {
          if (apiData.blogs.length === 0) {
            return [
              '{',
              '  "error": "No blog posts loaded",',
              '  "message": "Use \'refresh\' command to load data",',
              '  "totalPosts": 0',
              '}'
            ];
          }

          const blogsJson = [
            '{',
            '  "totalPosts": ' + apiData.blogs.length + ',',
            '  "recent": [',
          ];

          apiData.blogs.slice(0, 3).forEach((blog, index) => {
            blogsJson.push('    {');
            blogsJson.push(`      "title": "${blog.title}",`);
            if (blog.brief) {
              blogsJson.push(`      "brief": "${blog.brief.substring(0, 100)}...",`);
            }
            blogsJson.push(`      "url": "${blog.url}",`);
            if (blog.readTimeInMinutes) {
              blogsJson.push(`      "readTime": "${blog.readTimeInMinutes} min",`);
            }
            blogsJson.push(`      "publishedAt": "${blog.publishedAt}"`);
            blogsJson.push(index < 2 ? '    },' : '    }');
          });

          blogsJson.push('  ],');
          blogsJson.push('  "platform": "Hashnode",');
          blogsJson.push('  "profile": "https://xauravww.hashnode.dev"');
          blogsJson.push('}');

          return blogsJson;
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
      if (apiData.projects.length === 0) {
        return [
          'No projects loaded. Use "refresh" to load data.',
          'Or try "projects" to see available projects.'
        ];
      }

      const projectName = args.join(' ').toLowerCase();
      const project = apiData.projects.find(p =>
        p.title.toLowerCase().includes(projectName) ||
        p.id === projectName
      );

      if (!project) {
        return [
          'Project not found! Available projects:',
          ...apiData.projects.slice(0, 5).map(p => `  • ${p.title}`)
        ];
      }

      const details = [
        `╭─ ${project.title} ─╮`,
        '│',
        `│  📝 ${project.description || 'No description available'}`,
        '│'
      ];

      if (project.techStacks && project.techStacks.length > 0) {
        const techNames = project.techStacks.map(tech => tech.name || tech).join(', ');
        details.push(`│  🛠️  Tech Stack: ${techNames}`);
      }

      if (project.status) {
        details.push(`│  📊 Status: ${project.status}`);
      }

      details.push('│');

      if (project.liveUrl) {
        details.push(`│  🌐 Live: ${project.liveUrl}`);
      }
      if (project.githubUrl) {
        details.push(`│  📂 Repo: ${project.githubUrl}`);
      }

      details.push('│');
      details.push('╰' + '─'.repeat(Math.max(project.title.length + 4, 20)) + '╯');

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

  const executeCommand = async (cmd) => {
    const [command, ...args] = cmd.trim().toLowerCase().split(' ');

    if (commands[command]) {
      try {
        const output = await commands[command](args);
        return output;
      } catch (error) {
        return [`Error executing ${command}: ${error.message}`];
      }
    } else if (cmd.trim() === '') {
      return [];
    } else {
      return [`Command not found: ${command}. Type "help" for available commands.`];
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim()) {
      const command = input.trim().toLowerCase();
      const newHistory = [
        ...history,
        { type: 'input', content: `┌─[saurav@portfolio]─[${currentPath}]\n└─$ ${input}` },
      ];

      if (command === 'exit') {
        // Close terminal - this will be handled by parent component
        const output = await executeCommand(input);
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
        // Show loading for async commands
        if (['refresh', 'projects', 'blogs', 'experience', 'education', 'techstack'].includes(command)) {
          setHistory([
            ...newHistory,
            { type: 'output', content: '⏳ Loading...' }
          ]);
        }

        const output = await executeCommand(input);

        // Remove loading message and add actual output
        setHistory(prev => {
          const withoutLoading = prev.filter(item => item.content !== '⏳ Loading...');
          return [
            ...withoutLoading,
            ...output.map(line => ({ type: 'output', content: line })),
          ];
        });
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
    <div className="terminal-container bg-gradient-to-b from-[#0d1117] via-[#010409] to-[#0d1117] font-mono text-sm w-full h-full flex flex-col max-h-full overflow-hidden">
      {/* Terminal content with custom scrollbar */}
      <div
        ref={terminalRef}
        className="terminal-content overflow-y-auto cursor-text px-6 pt-6 custom-scrollbar flex-1 min-h-0"
        onClick={focusInput}
        style={{ maxHeight: 'calc(100% - 120px)' }}
      >
        {/* Welcome message */}
        <div className="mb-6 p-4 bg-gradient-to-r from-[#0d1117] to-[#161b22] rounded-lg border border-[#21262d] shadow-lg">
          <div className="text-[#58a6ff] mb-2 font-semibold text-lg flex items-center gap-2">
            <span className="text-2xl">🚀</span>
            Welcome to Saurav's Interactive Terminal
          </div>
          <div className="text-[#7c3aed] mb-2 flex items-center gap-2">
            <span className="text-lg">💡</span>
            Type <span className="bg-[#21262d] px-2 py-1 rounded text-[#58a6ff] font-semibold">'help'</span> to see available commands
          </div>
          <div className="text-[#8b949e] text-xs mt-3 space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#27ca3f] rounded-full animate-pulse"></div>
              System ready • Interactive mode enabled • Real API data
            </div>
            <div className="flex items-center gap-4 text-[#6b7280] flex-wrap">
              <span>⬆️ Arrow up: Previous command</span>
              <span>Tab: Autocomplete</span>
              <span>Ctrl+C: Cancel</span>
              <span>Ctrl+L: Clear</span>
              <span>Ctrl+B: Toggle status bar</span>
            </div>
          </div>
        </div>

        {history.map((line, index) => (
          <div key={index} className={`mb-2 leading-relaxed transition-all duration-200 ${line.type === 'input'
            ? 'text-[#58a6ff] font-semibold bg-[#0d1117]/50 p-2 rounded border-l-4 border-[#58a6ff]'
            : line.content.startsWith('Command not found')
              ? 'text-[#ff6b6b] font-medium bg-[#ff6b6b]/10 p-2 rounded border-l-4 border-[#ff6b6b]'
              : line.content.startsWith('╭─') || line.content.includes('─╮') || line.content.includes('─╯') || line.content.startsWith('╰─')
                ? 'text-[#7c3aed] font-bold'
                : line.content.startsWith('├──') || line.content.startsWith('└──') || line.content.startsWith('│')
                  ? 'text-[#06d6a0] font-medium'
                  : line.content.includes('📧') || line.content.includes('💼') || line.content.includes('🐙') || line.content.includes('🌐')
                    ? 'text-[#ff8cc8] font-medium'
                    : line.content.includes('🏢') || line.content.includes('📅') || line.content.includes('🔧')
                      ? 'text-[#51cf66] font-medium'
                      : line.content.includes('🚀') || line.content.includes('💡') || line.content.includes('🎯')
                        ? 'text-[#ffd93d] font-medium'
                        : 'text-[#e9ecef]'
            }`}>
            <span className="select-text">{line.content}</span>
          </div>
        ))}

      </div>

      {/* Fixed input area at bottom */}
      <div className="px-6 py-3 bg-gradient-to-b from-[#0d1117] via-[#010409] to-[#0d1117] border-t border-[#21262d]/30 flex-shrink-0">
        <div className="p-3 bg-gradient-to-r from-[#161b22] to-[#0d1117] rounded-lg border border-[#21262d] shadow-inner">
          <div className="flex items-center mb-1">
            <span className="text-[#58a6ff] mr-2 font-bold select-none flex items-center gap-2">
              <span className="w-2 h-2 bg-[#58a6ff] rounded-full animate-pulse"></span>
              ┌─[<span className="text-[#7c3aed]">saurav</span>@<span className="text-[#06d6a0]">portfolio</span>]─[<span className="text-[#ffd93d]">{currentPath}</span>]
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-[#58a6ff] mr-3 font-bold select-none">└─$</span>
            <span className="text-[#e9ecef] font-medium">{input}</span>
            <span className="animate-pulse text-[#58a6ff] ml-1 font-bold">▊</span>
          </div>
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
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              // Get last command from history
              const lastCommand = history.filter(h => h.type === 'input').pop();
              if (lastCommand) {
                const cmd = lastCommand.content.split('└─$ ')[1];
                if (cmd) setInput(cmd);
              }
            } else if (e.key === 'Tab') {
              e.preventDefault();
              // Simple autocomplete
              const availableCommands = Object.keys(commands);
              const matches = availableCommands.filter(cmd => cmd.startsWith(input.toLowerCase()));
              if (matches.length === 1) {
                setInput(matches[0]);
              } else if (matches.length > 1) {
                setHistory(prev => [
                  ...prev,
                  { type: 'output', content: `Available: ${matches.join(', ')}` }
                ]);
              }
            } else if (e.ctrlKey && e.key === 'c') {
              e.preventDefault();
              setInput('');
              setHistory(prev => [
                ...prev,
                { type: 'input', content: `┌─[saurav@portfolio]─[${currentPath}]\n└─$ ${input}^C` },
                { type: 'output', content: '' }
              ]);
            } else if (e.ctrlKey && e.key === 'l') {
              e.preventDefault();
              setHistory([]);
            } else if (e.ctrlKey && e.key === 'b') {
              e.preventDefault();
              setShowStatusBar(prev => !prev);
              setHistory(prev => [
                ...prev,
                { type: 'output', content: `Status bar ${showStatusBar ? 'hidden' : 'shown'}` }
              ]);
            }
          }}
          className="absolute opacity-0 pointer-events-none"
          autoFocus
          spellCheck={false}
        />
      </div>

      {/* Terminal status bar */}
      {showStatusBar && (
        <div className="bg-gradient-to-r from-[#161b22] to-[#21262d] px-6 py-2 text-xs text-[#8b949e] border-t border-[#30363d] flex justify-between items-center backdrop-blur-sm relative flex-shrink-0">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 text-[#27ca3f] font-medium">
              <div className={`w-2 h-2 rounded-full shadow-sm ${loading ? 'bg-[#ffd93d] animate-spin' : 'bg-[#27ca3f] animate-pulse'}`}></div>
              {loading ? 'Loading...' : 'Connected'}
            </span>
            <span className="flex items-center gap-2 text-xs">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
              {history.length} lines
            </span>
            <span className="flex items-center gap-2 text-xs">
              📊 {apiData.projects.length}P {apiData.blogs.length}B {apiData.experiences.length}E
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[#58a6ff] font-medium text-xs">API Live</span>
            <span className="text-[#7c3aed] font-medium text-xs">Interactive</span>
            <span className="text-[#27ca3f] font-semibold flex items-center gap-1 text-xs">
              <div className="w-2 h-2 bg-[#27ca3f] rounded-full"></div>
              Ready
            </span>

            {/* Status bar toggle button */}
            <button
              onClick={() => setShowStatusBar(false)}
              className="absolute -top-1 right-2 text-[#8b949e] hover:text-[#ff5f56] transition-colors p-1 rounded hover:bg-[#30363d]/50 group"
              title="Hide status bar"
            >
              <svg className="w-3 h-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Show status bar button when hidden */}
      {!showStatusBar && (
        <div className="bg-gradient-to-r from-[#161b22] to-[#21262d] px-6 py-1 border-t border-[#30363d] flex justify-center items-center backdrop-blur-sm flex-shrink-0">
          <button
            onClick={() => setShowStatusBar(true)}
            className="text-[#8b949e] hover:text-[#58a6ff] transition-colors p-1 rounded hover:bg-[#30363d]/50 group flex items-center gap-2 text-xs"
            title="Show status bar"
          >
            <svg className="w-3 h-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
            <span>Show Status</span>
          </button>
        </div>
      )}

      {/* Custom scrollbar and animation styles */}
      <style jsx>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #58a6ff #161b22;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 12px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #161b22;
          border-radius: 6px;
          margin: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #58a6ff, #1f6feb);
          border-radius: 6px;
          border: 2px solid #161b22;
          min-height: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #79c0ff, #58a6ff);
        }
        .custom-scrollbar::-webkit-scrollbar-corner {
          background: #161b22;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default InteractiveTerminal;