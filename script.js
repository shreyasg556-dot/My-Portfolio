/**
 * Portfolio Website Interactions:
 * - Vertical Sidebar Drawer & Accessibility
 * - Theme (Night Mode) Toggle with CSS Media Query Sync
 * - ScrollSpy Active Navigation Item Tracking
 * - Interactive 8-Bit Terminal Chat Simulator
 */

document.addEventListener('DOMContentLoaded', () => {
  // ========================================================
  // 1. THEME (NIGHT MODE) TOGGLE LOGIC
  // ========================================================
  const themeToggleBtn = document.getElementById('theme-toggle');
  const heroThemeToggleBtn = document.getElementById('hero-pixel-theme-toggle');
  const sidebarThemeToggleBtn = document.getElementById('sidebar-theme-toggle');
  const htmlRoot = document.documentElement;

  // Media query detecting default browser / OS theme
  const darkMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  const applyTheme = (theme, save = true) => {
    htmlRoot.setAttribute('data-theme', theme);
    if (save) {
      localStorage.setItem('portfolio-theme', theme);
    }
  };

  // Check saved preference or use media query detection
  const savedTheme = localStorage.getItem('portfolio-theme');
  if (savedTheme) {
    applyTheme(savedTheme, false);
  } else {
    applyTheme(darkMediaQuery.matches ? 'dark' : 'light', false);
  }

  // Listen to OS/Browser theme preference changes in real-time
  darkMediaQuery.addEventListener('change', (e) => {
    if (!localStorage.getItem('portfolio-theme')) {
      applyTheme(e.matches ? 'dark' : 'light', false);
    }
  });

  const toggleTheme = () => {
    const currentTheme = htmlRoot.getAttribute('data-theme') || (darkMediaQuery.matches ? 'dark' : 'light');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme, true);
  };

  // Bind clicks to all theme toggle buttons
  [themeToggleBtn, heroThemeToggleBtn, sidebarThemeToggleBtn].forEach(btn => {
    if (btn) {
      btn.addEventListener('click', toggleTheme);
    }
  });

  // ========================================================
  // 2. VERTICAL SIDEBAR DRAWER & ACCESSIBILITY (MOBILE)
  // ========================================================
  const mobileMenuBtn = document.getElementById('mobile-menu-toggle');
  const sidebar = document.getElementById('sidebar');
  const sidebarCloseBtn = document.getElementById('sidebar-close-btn');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');
  const sidebarNavLinks = document.querySelectorAll('.sidebar-nav-link');

  const openSidebar = () => {
    if (sidebar) {
      sidebar.classList.add('open');
      if (sidebarBackdrop) sidebarBackdrop.classList.add('active');
      if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'true');
    }
  };

  const closeSidebar = () => {
    if (sidebar) {
      sidebar.classList.remove('open');
      if (sidebarBackdrop) sidebarBackdrop.classList.remove('active');
      if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'false');
    }
  };

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = sidebar && sidebar.classList.contains('open');
      isOpen ? closeSidebar() : openSidebar();
    });
  }

  if (sidebarCloseBtn) {
    sidebarCloseBtn.addEventListener('click', closeSidebar);
  }

  if (sidebarBackdrop) {
    sidebarBackdrop.addEventListener('click', closeSidebar);
  }

  // Close sidebar on link click (mobile)
  sidebarNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 1024) {
        closeSidebar();
      }
    });
  });

  // Close drawer on Escape key for accessibility
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar && sidebar.classList.contains('open')) {
      closeSidebar();
      if (mobileMenuBtn) mobileMenuBtn.focus();
    }
  });

  // ========================================================
  // 3. SCROLLSPY / ACTIVE NAVIGATION ITEM TRACKING
  // ========================================================
  const sections = document.querySelectorAll('section[id]');

  const onScroll = () => {
    const scrollPos = window.scrollY + 160;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        sidebarNavLinks.forEach(item => {
          const isTarget = item.getAttribute('href') === `#${id}`;
          if (isTarget) {
            item.classList.add('active');
            item.setAttribute('aria-current', 'page');
          } else {
            item.classList.remove('active');
            item.removeAttribute('aria-current');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Run once on page load

  // ========================================================
  // 4. INTERACTIVE AI VERSION OF PORTFOLIO OWNER (NEURAL REPL)
  // ========================================================
  /**
   * =========================================================================
   * WHERE & HOW TO INTEGRATE AN EXTERNAL AI API (OpenAI / Gemini) LATER:
   * =========================================================================
   * 
   * Currently, this chat uses a high-speed local rule-based simulation engine
   * with keyword fallback. To hook this interface up to a live Large Language
   * Model (e.g., OpenAI gpt-4o / gpt-4o-mini or Google Gemini 1.5 Flash):
   * 
   * STEP 1: Set up a secure serverless backend endpoint or cloud function 
   * (e.g., Netlify Functions, Vercel API Route, Cloudflare Workers, or AWS Lambda).
   * NEVER store your raw OpenAI or Gemini API key in client-side front-end code!
   * 
   * STEP 2: Configure your backend endpoint (e.g. POST /api/chat) with a System Prompt:
   * `You are an AI assistant representing Shreyas H N, an aspiring software engineer
   * studying Computer Science and Data Science at AIT Chikkamagaluru. Respond in a friendly,
   * professional tone highlighting Shreyas's skills (C, Java, Python, DSA, SQL, Web)
   * and projects (Adaptive Headlights, Algorithmic Pathfinder, Student Database).`
   * 
   * STEP 3: Replace `handleBotQuery()` simulation with the following async fetch handler:
   * 
   * async function callOpenAIProxy(userMessage) {
   *   showTypingIndicator();
   *   try {
   *     const response = await fetch('/api/chat', {
   *       method: 'POST',
   *       headers: { 'Content-Type': 'application/json' },
   *       body: JSON.stringify({ message: userMessage })
   *     });
   *     const data = await response.json();
   *     hideTypingIndicator();
   *     appendChatMessage('AI_SHREYAS:', data.reply || "Sorry, I couldn't process that.", false);
   *   } catch (error) {
   *     hideTypingIndicator();
   *     // Fallback to local rule engine if API is unreachable:
   *     const fallbackReply = botKnowledge[queryKey] || botKnowledge.default;
   *     appendChatMessage('AI_SHREYAS:', fallbackReply, false);
   *   }
   * }
   * =========================================================================
   */

  const chatMessages = document.getElementById('chat-messages');
  const chatForm = document.getElementById('terminal-chat-form');
  const chatInput = document.getElementById('terminal-chat-input');
  const quickPromptBtns = document.querySelectorAll('.quick-prompt-btn');
  const chatTypingIndicator = document.getElementById('chat-typing-indicator');

  const botKnowledge = {
    skills: "Shreyas's core technical stack includes C, Java, Python, HTML5 Semantic, Vanilla CSS3, JavaScript ES6+, Node.js, MySQL (3NF), Data Structures & Algorithms, and Operating Systems! ⚡",
    projects: "Featured project: 'Adaptive Headlights Automotive System' — an intelligent vehicular safety prototype in C that dynamically swivels beams on curves and auto-dips high beams to prevent oncoming glare! 🚗",
    contact: "You can reach Shreyas directly at shreyasg556@gmail.com, call +91 8762975007, or connect on LinkedIn (shreyas-gowda-6ab006398)! ✉️",
    education: "Pursuing B.E. in Computer Science and Data Science (2025–2029) at Adichunchanagiri Institute of Technology, Chikkamagaluru (CGPA: 7.0)! 🎓",
    video: "Check out the Portfolio Highlight & Introduction video in the Highlight section! It showcases Shreyas's background, embedded IoT prototypes, and software development methodologies! 🎬",
    api: "This chat interface is architected for seamless OpenAI (GPT-4o) or Google Gemini integration! An async fetch hook can be plugged directly into the backend proxy outlined in the source comments. 🧠",
    default: "Thanks for inquiring! Shreyas is an aspiring software engineer specializing in core computer science, systems programming, and modern full-stack development. Feel free to explore the projects section or send a message via the Contact section below!"
  };

  const getFormattedTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const showTypingIndicator = () => {
    if (chatTypingIndicator) {
      chatTypingIndicator.classList.remove('hidden');
      if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }
    }
  };

  const hideTypingIndicator = () => {
    if (chatTypingIndicator) {
      chatTypingIndicator.classList.add('hidden');
    }
  };

  const appendChatMessage = (sender, message, isUser = false) => {
    if (!chatMessages) return;

    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${isUser ? 'user-bubble' : 'bot-bubble'}`;
    
    const headerDiv = document.createElement('div');
    headerDiv.className = 'bubble-header';

    const senderSpan = document.createElement('span');
    senderSpan.className = 'bubble-sender pixel-font';
    senderSpan.textContent = sender;
    
    const timeSpan = document.createElement('span');
    timeSpan.className = 'bubble-time pixel-font-sub';
    timeSpan.textContent = getFormattedTime();

    headerDiv.appendChild(senderSpan);
    headerDiv.appendChild(timeSpan);

    const messageP = document.createElement('p');
    messageP.textContent = message;

    bubble.appendChild(headerDiv);
    bubble.appendChild(messageP);
    chatMessages.appendChild(bubble);

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
  };

  const handleBotQuery = (queryText, queryKey) => {
    appendChatMessage('YOU:', queryText, true);

    // Simulate AI thinking and compiling response
    showTypingIndicator();

    setTimeout(() => {
      hideTypingIndicator();

      let reply = botKnowledge[queryKey];
      if (!reply) {
        const lower = queryText.toLowerCase();
        if (lower.includes('skill') || lower.includes('stack') || lower.includes('language') || lower.includes('tech')) {
          reply = botKnowledge.skills;
        } else if (lower.includes('project') || lower.includes('headlight') || lower.includes('car')) {
          reply = botKnowledge.projects;
        } else if (lower.includes('video') || lower.includes('highlight') || lower.includes('watch') || lower.includes('intro')) {
          reply = botKnowledge.video;
        } else if (lower.includes('contact') || lower.includes('email') || lower.includes('phone') || lower.includes('hire') || lower.includes('reach')) {
          reply = botKnowledge.contact;
        } else if (lower.includes('education') || lower.includes('college') || lower.includes('degree') || lower.includes('ait')) {
          reply = botKnowledge.education;
        } else if (lower.includes('api') || lower.includes('openai') || lower.includes('gpt') || lower.includes('gemini') || lower.includes('ai')) {
          reply = botKnowledge.api;
        } else {
          reply = botKnowledge.default;
        }
      }
      appendChatMessage('AI_SHREYAS:', reply, false);
    }, 600);
  };

  // Quick Prompt buttons click
  quickPromptBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-query');
      const text = btn.textContent.trim();
      handleBotQuery(text, key);
    });
  });

  // Terminal chat form submit
  if (chatForm && chatInput) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const userText = chatInput.value.trim();
      if (!userText) return;
      chatInput.value = '';
      handleBotQuery(userText, null);
    });
  }

  // ========================================================
  // 5. INTERACTIVE SKILLS FILTER & METER ANIMATIONS
  // ========================================================
  const skillsFilterBtns = document.querySelectorAll('.skills-filter-btn');
  const skillCards = document.querySelectorAll('.pixel-skill-card');
  const meterFills = document.querySelectorAll('.skills-hud-window .pixel-meter-fill');

  // Interactive Category Filtering
  skillsFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      skillsFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.classList.remove('dimmed');
        } else {
          card.classList.add('dimmed');
        }
      });
    });
  });

  // Animate progress meters when skills section enters viewport
  const skillsSection = document.getElementById('skills');
  if (skillsSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          meterFills.forEach(fill => {
            const targetWidth = fill.style.getPropertyValue('--skill-pct') || '85%';
            fill.style.width = '0%';
            requestAnimationFrame(() => {
              setTimeout(() => {
                fill.style.width = targetWidth;
              }, 120);
            });
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    observer.observe(skillsSection);
  }

  // ========================================================
  // 6. INTERACTIVE TIMELINE MILESTONES FILTER
  // ========================================================
  const timelineFilterBtns = document.querySelectorAll('.timeline-filter-btn');
  const timelineItems = document.querySelectorAll('.timeline-item');

  timelineFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      timelineFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-timeline-filter');

      timelineItems.forEach(item => {
        const cat = item.getAttribute('data-timeline-cat');
        if (filter === 'all' || cat === filter) {
          item.classList.remove('dimmed');
        } else {
          item.classList.add('dimmed');
        }
      });
    });
  });

  // ========================================================
  // 7. PROJECTS SECTION: THUMBNAIL-TO-DETAIL CONNECTIONS
  // ========================================================
  /**
   * EXPLANATION OF THUMBNAIL-TO-PROJECT-DETAIL CONNECTIONS:
   * 
   * 1. Data Attribute Mapping:
   *    Each project thumbnail button (.project-thumbnail-btn) and detail button (.project-btn-detail)
   *    is equipped with a `data-modal-target` attribute containing the unique ID of its corresponding
   *    detailed modal specification view:
   *    - Thumbnail 1 (Adaptive Headlights): data-modal-target="modal-headlights"
   *      -> Connects directly to DOM element: #modal-headlights
   *    - Thumbnail 2 (Algorithmic Pathfinding): data-modal-target="modal-pathfinder"
   *      -> Connects directly to DOM element: #modal-pathfinder
   *    - Thumbnail 3 (Relational DBMS): data-modal-target="modal-database"
   *      -> Connects directly to DOM element: #modal-database
   *    - Thumbnail 4 (Developer Platform): data-modal-target="modal-portfolio"
   *      -> Connects directly to DOM element: #modal-portfolio
   * 
   * 2. Event Binding:
   *    A click listener is attached to every element matching `[data-modal-target]`.
   *    When triggered, the handler reads the target ID, locates the matching modal element,
   *    and activates it by appending the `.active` class to the backdrop and `.modal-open`
   *    to the document body (locking background scroll).
   * 
   * 3. Accessibility & Dismissal:
   *    - Focus is automatically trapped and directed to the modal's close button.
   *    - Modals can be dismissed via:
   *      a) The titlebar close button or footer dismiss button ([data-modal-close])
   *      b) Clicking anywhere outside the modal content on the backdrop overlay
   *      c) Pressing the keyboard 'Escape' key
   *    - Upon closing, focus is seamlessly restored to the originating thumbnail button.
   */
  const modalTriggers = document.querySelectorAll('[data-modal-target]');
  const modalCloseBtns = document.querySelectorAll('[data-modal-close]');
  const modals = document.querySelectorAll('.project-modal-backdrop');
  const modalsContainer = document.getElementById('project-modals-container');
  let lastActiveThumbnailTrigger = null;

  // Open modal function connecting thumbnail to its target modal detail
  const openProjectModal = (modalId, triggerElement = null) => {
    const targetModal = document.getElementById(modalId);
    if (!targetModal) return;

    lastActiveThumbnailTrigger = triggerElement;

    // Activate modal backdrop and content
    targetModal.classList.add('active');
    document.body.classList.add('modal-open');

    if (modalsContainer) {
      modalsContainer.setAttribute('aria-hidden', 'false');
    }

    // Set accessibility focus to close button
    const closeBtn = targetModal.querySelector('.modal-close-btn');
    if (closeBtn) {
      setTimeout(() => closeBtn.focus(), 60);
    }
  };

  // Close active modal function
  const closeProjectModal = (modal) => {
    if (!modal) return;

    modal.classList.remove('active');

    // Check if any other modal remains open
    const hasOpenModal = document.querySelector('.project-modal-backdrop.active');
    if (!hasOpenModal) {
      document.body.classList.remove('modal-open');
      if (modalsContainer) {
        modalsContainer.setAttribute('aria-hidden', 'true');
      }
    }

    // Restore focus to thumbnail trigger for keyboard accessibility
    if (lastActiveThumbnailTrigger) {
      lastActiveThumbnailTrigger.focus();
      lastActiveThumbnailTrigger = null;
    }
  };

  // Bind click listeners to all clickable project thumbnails & detail buttons
  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = trigger.getAttribute('data-modal-target');
      if (modalId) {
        openProjectModal(modalId, trigger);
      }
    });
  });

  // Bind click listeners to all close buttons ([data-modal-close])
  modalCloseBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const parentModal = btn.closest('.project-modal-backdrop');
      closeProjectModal(parentModal);
    });
  });

  // Close modal when clicking directly on the backdrop outside the modal content box
  modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeProjectModal(modal);
      }
    });
  });

  // Close active modal on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activeModal = document.querySelector('.project-modal-backdrop.active');
      if (activeModal) {
        closeProjectModal(activeModal);
      }
    }
  });

  // ========================================================
  // 8. VIDEO SHOWCASE & PORTFOLIO HIGHLIGHT CONTROLS
  // ========================================================
  const videoPlayer = document.getElementById('portfolio-video');
  const videoPlayBtn = document.getElementById('video-play-btn');
  const videoMuteBtn = document.getElementById('video-mute-btn');
  const videoFullscreenBtn = document.getElementById('video-fullscreen-btn');
  const videoCurrentTime = document.getElementById('video-current-time');
  const videoDuration = document.getElementById('video-duration');

  const formatVideoTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  if (videoPlayer) {
    // Play / Pause toggle button
    if (videoPlayBtn) {
      videoPlayBtn.addEventListener('click', () => {
        if (videoPlayer.paused || videoPlayer.ended) {
          videoPlayer.play();
          videoPlayBtn.innerHTML = '<span class="deck-icon">&#10074;&#10074;</span> <span class="deck-text">PAUSE</span>';
        } else {
          videoPlayer.pause();
          videoPlayBtn.innerHTML = '<span class="deck-icon">&#9654;</span> <span class="deck-text">PLAY</span>';
        }
      });

      // Synchronize deck button with native video element state
      videoPlayer.addEventListener('play', () => {
        videoPlayBtn.innerHTML = '<span class="deck-icon">&#10074;&#10074;</span> <span class="deck-text">PAUSE</span>';
      });

      videoPlayer.addEventListener('pause', () => {
        videoPlayBtn.innerHTML = '<span class="deck-icon">&#9654;</span> <span class="deck-text">PLAY</span>';
      });

      videoPlayer.addEventListener('ended', () => {
        videoPlayBtn.innerHTML = '<span class="deck-icon">&#9654;</span> <span class="deck-text">REPLAY</span>';
      });
    }

    // Mute / Unmute toggle button
    if (videoMuteBtn) {
      videoMuteBtn.addEventListener('click', () => {
        videoPlayer.muted = !videoPlayer.muted;
        videoMuteBtn.innerHTML = videoPlayer.muted 
          ? '<span class="deck-icon">&#128263;</span> <span class="deck-text">UNMUTE</span>' 
          : '<span class="deck-icon">&#128266;</span> <span class="deck-text">MUTE</span>';
      });

      videoPlayer.addEventListener('volumechange', () => {
        videoMuteBtn.innerHTML = videoPlayer.muted || videoPlayer.volume === 0
          ? '<span class="deck-icon">&#128263;</span> <span class="deck-text">UNMUTE</span>' 
          : '<span class="deck-icon">&#128266;</span> <span class="deck-text">MUTE</span>';
      });
    }

    // Fullscreen toggle button
    if (videoFullscreenBtn) {
      videoFullscreenBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
          if (videoPlayer.requestFullscreen) {
            videoPlayer.requestFullscreen();
          } else if (videoPlayer.webkitRequestFullscreen) {
            videoPlayer.webkitRequestFullscreen();
          } else if (videoPlayer.msRequestFullscreen) {
            videoPlayer.msRequestFullscreen();
          }
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          }
        }
      });
    }

    // Real-time time tracker update
    videoPlayer.addEventListener('timeupdate', () => {
      if (videoCurrentTime) {
        videoCurrentTime.textContent = formatVideoTime(videoPlayer.currentTime);
      }
    });

    // Populate total duration once metadata is loaded
    videoPlayer.addEventListener('loadedmetadata', () => {
      if (videoDuration && !isNaN(videoPlayer.duration)) {
        videoDuration.textContent = formatVideoTime(videoPlayer.duration);
      }
    });
  }

  // ========================================================
  // 9. CONTACT FORM INTERACTION & DISPATCH SIMULATION
  // ========================================================
  /**
   * PRODUCTION EMAIL / FORM API INTEGRATION GUIDE:
   * To send actual emails directly from this contact form in production:
   * Option A (Formspree / Formbold):
   *   Update form attributes in index.html to:
   *   action="https://formspree.io/f/YOUR_FORM_ID" method="POST"
   * Option B (EmailJS Client SDK):
   *   Import EmailJS and invoke emailjs.sendForm('SERVICE_ID', 'TEMPLATE_ID', '#contact-form')
   * Option C (Serverless Function with Resend / Nodemailer):
   *   Fetch POST /api/contact with JSON payload { name, email, message }.
   */
  const contactForm = document.getElementById('contact-form');
  const contactFeedback = document.getElementById('contact-form-feedback');

  if (contactForm && contactFeedback) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('contact-name');
      const emailInput = document.getElementById('contact-email');
      const messageInput = document.getElementById('contact-message');

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const message = messageInput ? messageInput.value.trim() : '';

      if (!name || !email || !message) {
        contactFeedback.className = 'form-feedback-box error';
        contactFeedback.innerHTML = '⚠️ Please fill out all required fields before transmitting your message.';
        contactFeedback.classList.remove('hidden');
        return;
      }

      // Basic email regex validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        contactFeedback.className = 'form-feedback-box error';
        contactFeedback.innerHTML = '⚠️ Please provide a valid email address.';
        contactFeedback.classList.remove('hidden');
        return;
      }

      // Simulated successful dispatch
      contactFeedback.className = 'form-feedback-box success';
      contactFeedback.innerHTML = `✅ <strong>TRANSMISSION LOGGED:</strong> Thank you, <strong>${name}</strong>! Your inquiry has been simulated and stored. I will respond to <em>${email}</em> promptly.`;
      contactFeedback.classList.remove('hidden');

      // Reset form fields
      contactForm.reset();

      // Auto-hide feedback after 8 seconds
      setTimeout(() => {
        contactFeedback.classList.add('hidden');
      }, 8000);
    });
  }
});


