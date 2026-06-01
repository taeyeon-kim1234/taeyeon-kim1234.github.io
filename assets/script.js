/* =========================================================
   김태연 Portfolio · script.js
   ========================================================= */

(() => {
  document.documentElement.classList.add("js-ready");
  const body = document.body;

  /* ----- Today label (bottom-left corner) ----- */
  const todayEl = document.getElementById("todayLabel");
  if (todayEl) {
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const d = new Date();
    todayEl.textContent = `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  }

  /* ----- Active section detection + sticky nav reveal ----- */
  const stickyNav = document.getElementById("capsuleNavSticky");
  const splashEnter = document.getElementById("splashEnter");
  const contact = document.querySelector(".contact-bar");
  if (contact) contact.dataset.sectionId = "contact";
  const sections = ["home", "introduce", "skills", "projects"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  if (contact) sections.push(contact);
  const allTabs = document.querySelectorAll(".cap-tab");
  let splashTimer = null;

  const setActiveTab = (current) => {
    body.dataset.currentSection = current;
    allTabs.forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.section === current);
    });
  };

  const finishSplash = (targetId = "introduce") => {
    if (!body.classList.contains("splash-active") || body.classList.contains("splash-exiting")) return;

    body.classList.add("splash-exiting");
    clearTimeout(splashTimer);
    splashTimer = window.setTimeout(() => {
      body.classList.remove("splash-active", "splash-exiting");
      body.classList.add("splash-done");

      const target = document.getElementById(targetId) || document.getElementById("introduce");
      target?.scrollIntoView({ block: "start" });
      onScroll();
    }, 920);
  };

  const onScroll = () => {
    // Keep the top nav fixed from the first screen.
    if (stickyNav) stickyNav.classList.add("show");

    if (body.classList.contains("splash-active")) {
      setActiveTab("home");
      return;
    }

    // Active section detection — use middle of viewport as the cursor.
    const scrollCursor = window.scrollY + window.innerHeight * 0.35;
    const activeSections = body.classList.contains("splash-done")
      ? sections.filter((sec) => sec.id !== "home")
      : sections;
    let current = activeSections[0]?.id || "introduce";
    for (const sec of activeSections) {
      if (sec.offsetTop <= scrollCursor) {
        current = sec.id || sec.dataset.sectionId || current;
      }
    }
    setActiveTab(current);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  /* Cap-tab navigation — works in splash-active AND splash-done states.
     If splash is active, end it first, then jump to the requested section. */
  const scrollToSection = (id) => {
    const target = document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  document.querySelectorAll(".cap-tab").forEach((tab) => {
    tab.addEventListener("click", (event) => {
      const id = tab.dataset.section;
      if (!id) return;
      event.preventDefault();
      if (body.classList.contains("splash-active")) {
        finishSplash(id);
      } else {
        scrollToSection(id);
      }
    });
  });

  /* Splash dismissal: clicking the splash background / CTA / Enter / Space
     ends the splash and lands on introduce. Anchor clicks above are handled
     before reaching this. */
  document.addEventListener("click", (event) => {
    if (!body.classList.contains("splash-active")) return;
    if (event.target.closest(".cap-tab")) return;
    if (event.target.closest("a")) return;
    event.preventDefault();
    finishSplash("introduce");
  });

  splashEnter?.addEventListener("click", (event) => {
    event.preventDefault();
    finishSplash("introduce");
  });

  document.addEventListener("keydown", (event) => {
    if (!body.classList.contains("splash-active")) return;
    if (event.key !== "Enter" && event.key !== " ") return;

    event.preventDefault();
    finishSplash("introduce");
  });

  /* ----- Skills tabs ----- */
  const skillTabs = document.querySelectorAll(".skill-tab");
  const skillPanels = document.querySelectorAll(".skill-panel");
  skillTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.tab;
      skillTabs.forEach((t) => t.classList.toggle("active", t === tab));
      skillPanels.forEach((p) =>
        p.classList.toggle("active", p.dataset.panel === target)
      );
    });
  });

  /* ----- Reveal on scroll ----- */
  const revealEls = document.querySelectorAll(
    ".section-head, .intro-card, .skill-chip, .project-card, .contact-link, .stat-card, .stack-card, .feature-card, .trouble-card"
  );
  revealEls.forEach((el) => el.classList.add("reveal"));

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealEls.forEach((el) => io.observe(el));

  /* ----- Section-level transitions ----- */
  const pageSections = document.querySelectorAll(".cover, main > section");
  const sectionIo = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("section-visible", entry.isIntersecting);
      });
    },
    { threshold: 0.08, rootMargin: "-12% 0px -28% 0px" }
  );
  pageSections.forEach((section) => sectionIo.observe(section));
})();
