// public/js/main.js
document.addEventListener("DOMContentLoaded", () => {
  // Mobile Menu Toggle
  const menuBtn = document.getElementById("menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
      menuBtn.querySelector("i").classList.toggle("fa-bars");
      menuBtn.querySelector("i").classList.toggle("fa-times");
    });
  }

  // Back to Top Button
  const backToTop = document.getElementById("back-to-top");
  if (backToTop) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 100) {
        // Lowered from 300 to 100
        backToTop.classList.add("visible");
      } else {
        backToTop.classList.remove("visible");
      }
    });
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Scroll-Triggered Animations
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("slid");
        } else {
          // Reset animation when section leaves viewport
          entry.target.classList.remove("slid");
        }
      });
    },
    {
      threshold: 0.1, // Trigger when 10% of the element is visible
      rootMargin: "0px 0px -50px 0px", // Adjust to trigger slightly before fully in view
    }
  );

  // Observe sections with slide-content
  document.querySelectorAll(".slide-content").forEach((section) => {
    observer.observe(section);
  });

  // Smooth Scroll for Nav Links
  document.querySelectorAll(".nav-link").forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 64, // Adjust for fixed nav height
          behavior: "smooth",
        });
      }
      // Update active link
      document.querySelectorAll(".nav-link").forEach((link) => {
        link.classList.remove("active");
      });
      this.classList.add("active");
      // Close mobile menu if open
      if (mobileMenu && !mobileMenu.classList.contains("hidden")) {
        mobileMenu.classList.add("hidden");
        menuBtn.querySelector("i").classList.toggle("fa-bars");
        menuBtn.querySelector("i").classList.toggle("fa-times");
      }
    });
  });

  // Contact Form Submission
  const contactForm = document.getElementById("contact-form");
  const formMessage = document.getElementById("form-message");
  if (contactForm && formMessage) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      formMessage.textContent = "Sending...";
      formMessage.classList.remove("text-green-400", "text-red-400");

      // Collect form data
      const formData = new FormData(contactForm);

      try {
        const response = await fetch("/contact", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (response.ok && result.success) {
          formMessage.textContent = result.message;
          formMessage.classList.add("text-green-400");
          contactForm.reset();
        } else {
          throw new Error(result.message || "Failed to send message");
        }
      } catch (error) {
        formMessage.textContent =
          error.message || "Failed to send message. Please try again.";
        formMessage.classList.add("text-red-400");
      }
    });
  }
});
