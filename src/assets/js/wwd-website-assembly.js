// ============================================
// Wanderers Web Design - Website Assembly Animation
// ============================================

(function() {
  'use strict';

  class WebsiteAssembly {
    constructor() {
      this.section = document.querySelector('.wwd-assembly-section');
      if (!this.section) return;

      this.canvas = this.section.querySelector('.wwd-assembly-matrix');
      this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
      this.parts = this.section.querySelectorAll('.wwd-part');
      this.hasAnimated = false;
      
      this.init();
    }

    init() {
      // Set up intersection observer for scroll animation
      this.setupIntersectionObserver();
      this.isMobile = window.innerWidth <= 768;
      // Initialize matrix effect
      if (this.canvas && this.ctx) {
        this.setupMatrixEffect();
      }
      
      // Typing effect for title
      this.setupTypingEffect();
    }

    setupIntersectionObserver() {
      const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.hasAnimated) {
            this.hasAnimated = true;
            this.animateWebsiteParts();
            this.startMatrixRain();
            this.startTyping();
          }
        });
      }, options);

      observer.observe(this.section);
    }

    setupMobileAnimation() {
      const mobileScreen = this.section.querySelector('.wwd-mobile-screen');
      if (!mobileScreen || !this.isMobile) return;
      
      // Show mobile screen on mobile
      mobileScreen.style.display = 'block';
      
      // Get mobile parts
      const mobileParts = mobileScreen.querySelectorAll('.wwd-mobile-part');
      
      // Animate mobile parts
      mobileParts.forEach((part, index) => {
        setTimeout(() => {
          part.classList.add('animate');
          this.createMobileParticles(part);
        }, index * 300);
      });
    }

    createMobileParticles(element) {
      const particlesContainer = this.section.querySelector('.wwd-mobile-particles');
      if (!particlesContainer) return;
      
      const rect = element.getBoundingClientRect();
      const containerRect = particlesContainer.getBoundingClientRect();
      
      // Create fewer, larger particles for mobile
      for (let i = 0; i < 3; i++) {
        const particle = document.createElement('div');
        particle.className = 'wwd-mobile-particle';
        particle.textContent = ['<', '/>', '{ }'][Math.floor(Math.random() * 3)];
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = (rect.top - containerRect.top) + 'px';
        particle.style.animationDelay = (i * 0.2) + 's';
        
        particlesContainer.appendChild(particle);
        
        setTimeout(() => particle.remove(), 2000);
      }
    }

    // Single animateWebsiteParts method that handles both mobile and desktop
    animateWebsiteParts() {
      if (this.isMobile) {
        this.setupMobileAnimation();
      } else {
        // Original desktop animation
        this.parts.forEach((part, index) => {
          setTimeout(() => {
            part.classList.add('animate');
            this.createParticles(part);
          }, index * 200);
        });
      }
    }

    createParticles(element) {
      const rect = element.getBoundingClientRect();
      const containerRect = this.section.getBoundingClientRect();
      
      for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.className = 'wwd-matrix-drop';
        particle.textContent = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        particle.style.left = (rect.left - containerRect.left + Math.random() * rect.width) + 'px';
        particle.style.top = (rect.top - containerRect.top) + 'px';
        particle.style.animationDelay = (i * 0.1) + 's';
        
        this.section.appendChild(particle);
        
        // Remove particle after animation
        setTimeout(() => particle.remove(), 3000);
      }
    }

    setupMatrixEffect() {
      const screen = this.section.querySelector('.wwd-computer-screen');
      if (!screen) return;
      
      // Wait for layout to stabilize
      setTimeout(() => {
        const rect = screen.getBoundingClientRect();
        this.canvas.width = rect.width - 40; // Account for border
        this.canvas.height = rect.height - 40;
        
        this.matrixChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
        this.fontSize = 14;
        this.columns = Math.floor(this.canvas.width / this.fontSize);
        this.drops = Array(this.columns).fill(0);
      }, 100);
    }

    startMatrixRain() {
      if (!this.ctx || !this.drops) return;
      
      let animationId;
      
      const animate = () => {
        // Fade effect
        this.ctx.fillStyle = 'rgba(250, 250, 250, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Green text
        this.ctx.fillStyle = '#0F0';
        this.ctx.font = this.fontSize + 'px Courier';
        
        // Draw characters
        for (let i = 0; i < this.drops.length; i++) {
          const char = this.matrixChars[Math.floor(Math.random() * this.matrixChars.length)];
          this.ctx.fillText(char, i * this.fontSize, this.drops[i] * this.fontSize);
          
          if (this.drops[i] * this.fontSize > this.canvas.height && Math.random() > 0.95) {
            this.drops[i] = 0;
          }
          
          this.drops[i]++;
        }
        
        animationId = requestAnimationFrame(animate);
      };
      
      animate();
      
      // Clean up on page unload
      window.addEventListener('beforeunload', () => {
        if (animationId) {
          cancelAnimationFrame(animationId);
        }
      });
    }

    setupTypingEffect() {
      this.typingText = this.section.querySelector('.wwd-typing-text');
      this.cursor = this.section.querySelector('.wwd-typing-cursor');
      if (!this.typingText) return;
      
      this.originalText = this.typingText.textContent;
      this.typingText.textContent = '';
    }

    startTyping() {
      if (!this.typingText || !this.originalText) return;
      
      let i = 0;
      const typeInterval = setInterval(() => {
        if (i < this.originalText.length) {
          this.typingText.textContent += this.originalText.charAt(i);
          i++;
        } else {
          clearInterval(typeInterval);
          // Keep cursor blinking
          if (this.cursor) {
            this.cursor.style.animation = 'blink 1s infinite';
          }
        }
      }, 100); // Type one character every 100ms
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      new WebsiteAssembly();
    });
  } else {
    // DOM already loaded
    new WebsiteAssembly();
  }

})();

// // ============================================
// // Wanderers Web Design - Website Assembly Animation
// // ============================================

// (function() {
//   'use strict';

//   class WebsiteAssembly {
//     constructor() {
//       this.section = document.querySelector('.wwd-assembly-section');
//       if (!this.section) return;

//       this.canvas = this.section.querySelector('.wwd-assembly-matrix');
//       this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
//       this.parts = this.section.querySelectorAll('.wwd-part');
//       this.hasAnimated = false;
      
//       this.init();
//     }

//     init() {
//       // Set up intersection observer for scroll animation
//       this.setupIntersectionObserver();
//       this.isMobile = window.innerWidth <= 768;
//       // Initialize matrix effect
//       if (this.canvas && this.ctx) {
//         this.setupMatrixEffect();
//       }
      
//       // Typing effect for title
//       this.setupTypingEffect();
//     }

//     setupIntersectionObserver() {
//       const options = {
//         root: null,
//         rootMargin: '0px',
//         threshold: 0.3
//       };

//       const observer = new IntersectionObserver((entries) => {
//         entries.forEach(entry => {
//           if (entry.isIntersecting && !this.hasAnimated) {
//             this.hasAnimated = true;
//             this.animateWebsiteParts();
//             this.startMatrixRain();
//             this.startTyping();
//           }
//         });
//       }, options);

//       observer.observe(this.section);
//     }


//         // Add this new method:
//     setupMobileAnimation() {
//     const mobileScreen = this.section.querySelector('.wwd-mobile-screen');
//     if (!mobileScreen || !this.isMobile) return;
    
//     // Show mobile screen on mobile
//     mobileScreen.style.display = 'block';
    
//     // Get mobile parts
//     const mobileParts = mobileScreen.querySelectorAll('.wwd-mobile-part');
    
//     // Animate mobile parts
//     mobileParts.forEach((part, index) => {
//         setTimeout(() => {
//         part.classList.add('animate');
//         this.createMobileParticles(part);
//         }, index * 300);
//     });
//     }

//     createMobileParticles(element) {
//     const particlesContainer = this.section.querySelector('.wwd-mobile-particles');
//     if (!particlesContainer) return;
    
//     const rect = element.getBoundingClientRect();
//     const containerRect = particlesContainer.getBoundingClientRect();
    
//     // Create fewer, larger particles for mobile
//     for (let i = 0; i < 3; i++) {
//         const particle = document.createElement('div');
//         particle.className = 'wwd-mobile-particle';
//         particle.textContent = ['<', '/>', '{ }'][Math.floor(Math.random() * 3)];
//         particle.style.left = Math.random() * 100 + '%';
//         particle.style.top = (rect.top - containerRect.top) + 'px';
//         particle.style.animationDelay = (i * 0.2) + 's';
        
//         particlesContainer.appendChild(particle);
        
//         setTimeout(() => particle.remove(), 2000);
//     }
//     }

//     // Update the animateWebsiteParts method:
//     animateWebsiteParts() {
//     if (this.isMobile) {
//         this.setupMobileAnimation();
//     } else {
//         // Original desktop animation
//         this.parts.forEach((part, index) => {
//         setTimeout(() => {
//             part.classList.add('animate');
//             this.createParticles(part);
//         }, index * 200);
//         });
//     }
//     }

//     animateWebsiteParts() {
//       // Stagger the animation of each part
//       this.parts.forEach((part, index) => {
//         setTimeout(() => {
//           part.classList.add('animate');
          
//           // Add particle effect on entry
//           this.createParticles(part);
//         }, index * 200);
//       });
//     }

//     createParticles(element) {
//       const rect = element.getBoundingClientRect();
//       const containerRect = this.section.getBoundingClientRect();
      
//       for (let i = 0; i < 5; i++) {
//         const particle = document.createElement('div');
//         particle.className = 'wwd-matrix-drop';
//         particle.textContent = String.fromCharCode(65 + Math.floor(Math.random() * 26));
//         particle.style.left = (rect.left - containerRect.left + Math.random() * rect.width) + 'px';
//         particle.style.top = (rect.top - containerRect.top) + 'px';
//         particle.style.animationDelay = (i * 0.1) + 's';
        
//         this.section.appendChild(particle);
        
//         // Remove particle after animation
//         setTimeout(() => particle.remove(), 3000);
//       }
//     }

//     setupMatrixEffect() {
//       const screen = this.section.querySelector('.wwd-computer-screen');
//       if (!screen) return;
      
//       // Wait for layout to stabilize
//       setTimeout(() => {
//         const rect = screen.getBoundingClientRect();
//         this.canvas.width = rect.width - 40; // Account for border
//         this.canvas.height = rect.height - 40;
        
//         this.matrixChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
//         this.fontSize = 14;
//         this.columns = Math.floor(this.canvas.width / this.fontSize);
//         this.drops = Array(this.columns).fill(0);
//       }, 100);
//     }

//     startMatrixRain() {
//       if (!this.ctx || !this.drops) return;
      
//       let animationId;
      
//       const animate = () => {
//         // Fade effect
//         this.ctx.fillStyle = 'rgba(250, 250, 250, 0.05)';
//         this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
//         // Green text
//         this.ctx.fillStyle = '#0F0';
//         this.ctx.font = this.fontSize + 'px Courier';
        
//         // Draw characters
//         for (let i = 0; i < this.drops.length; i++) {
//           const char = this.matrixChars[Math.floor(Math.random() * this.matrixChars.length)];
//           this.ctx.fillText(char, i * this.fontSize, this.drops[i] * this.fontSize);
          
//           if (this.drops[i] * this.fontSize > this.canvas.height && Math.random() > 0.95) {
//             this.drops[i] = 0;
//           }
          
//           this.drops[i]++;
//         }
        
//         animationId = requestAnimationFrame(animate);
//       };
      
//       animate();
      
//       // Clean up on page unload
//       window.addEventListener('beforeunload', () => {
//         if (animationId) {
//           cancelAnimationFrame(animationId);
//         }
//       });
//     }

//     setupTypingEffect() {
//       this.typingText = this.section.querySelector('.wwd-typing-text');
//       this.cursor = this.section.querySelector('.wwd-typing-cursor');
//       if (!this.typingText) return;
      
//       this.originalText = this.typingText.textContent;
//       this.typingText.textContent = '';
//     }

//     startTyping() {
//       if (!this.typingText || !this.originalText) return;
      
//       let i = 0;
//       const typeInterval = setInterval(() => {
//         if (i < this.originalText.length) {
//           this.typingText.textContent += this.originalText.charAt(i);
//           i++;
//         } else {
//           clearInterval(typeInterval);
//           // Keep cursor blinking
//           if (this.cursor) {
//             this.cursor.style.animation = 'blink 1s infinite';
//           }
//         }
//       }, 100); // Type one character every 100ms
//     }
//   }

//   // Initialize when DOM is ready
//   if (document.readyState === 'loading') {
//     document.addEventListener('DOMContentLoaded', () => {
//       new WebsiteAssembly();
//     });
//   } else {
//     // DOM already loaded
//     new WebsiteAssembly();
//   }

  

// })();


