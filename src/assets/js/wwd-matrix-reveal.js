// ============================================
// Wanderers Web Design - Matrix Reveal Effect
// ============================================

(function() {
  'use strict';

  class MatrixReveal {
    constructor() {
      this.hero = document.querySelector('.wwd-hero-interactive');
      if (!this.hero) return;

      // Initialize with safe defaults
      this.canvas = null;
      this.ctx = null;
      this.columns = 0;
      this.drops = [];
      this.fontSize = 16;
      
      // Wait for next frame to ensure layout is complete
      requestAnimationFrame(() => {
        this.init();
      });
    }

    init() {
      // Check if hero has dimensions
      const rect = this.hero.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        // Try again later
        setTimeout(() => this.init(), 100);
        return;
      }
      
      this.setup();
      this.bindEvents();
      this.animate();
    }

    setup() {
      // Get the background picture element first
      this.backgroundPicture = this.hero.querySelector('.cs-background');
      if (!this.backgroundPicture) {
        console.warn('Background picture not found');
        return;
      }

      // Create wrapper for matrix that will be masked
      this.matrixWrapper = document.createElement('div');
      this.matrixWrapper.className = 'wwd-matrix-wrapper';
      
      // Create matrix container
      this.matrixContainer = document.createElement('div');
      this.matrixContainer.className = 'wwd-matrix-container';
      
      // Create canvas for matrix rain
      this.canvas = document.createElement('canvas');
      this.canvas.className = 'wwd-matrix-canvas';
      this.ctx = this.canvas.getContext('2d');
      
      // Create soft glow
      this.glow = document.createElement('div');
      this.glow.className = 'wwd-matrix-glow';
      
      // Build structure
      this.matrixContainer.appendChild(this.canvas);
      this.matrixWrapper.appendChild(this.matrixContainer);
      this.matrixWrapper.appendChild(this.glow);
      
      // Insert AFTER background (on top of it)
      this.backgroundPicture.parentNode.insertBefore(this.matrixWrapper, this.backgroundPicture.nextSibling);
      
      // Characters to use
      this.matrixChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?';
      
      // Mouse position
      this.mouseX = -1000;
      this.mouseY = -1000;
      this.targetMouseX = -1000;
      this.targetMouseY = -1000;
      this.isMouseOver = false;
      
      // Reveal radius
      this.revealRadius = 0;
      this.targetRadius = 150;
      
      // Add class to hero
      this.hero.classList.add('wwd-matrix-active');
      
      // Set canvas sizes after adding to DOM
      this.resizeCanvas();
    }

    resizeCanvas() {
      const rect = this.hero.getBoundingClientRect();
      
      // Ensure we have valid dimensions
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));
      
      if (width <= 0 || height <= 0) {
        console.warn('Invalid dimensions for canvas');
        return;
      }
      
      // Set canvas sizes to full hero dimensions
      this.canvas.width = width;
      this.canvas.height = height;
      
      // Calculate columns safely
      const cols = Math.floor(width / this.fontSize);
      this.columns = Math.max(1, cols);
      
      // Initialize drops array with random starting positions
      this.drops = [];
      for (let i = 0; i < this.columns; i++) {
        this.drops.push(Math.floor(Math.random() * -100));
      }
    }

    bindEvents() {
      // Mouse move on the hero section
      this.hero.addEventListener('mousemove', (e) => {
        const rect = this.hero.getBoundingClientRect();
        this.targetMouseX = e.clientX - rect.left;
        this.targetMouseY = e.clientY - rect.top;
        
        if (!this.isMouseOver) {
          this.isMouseOver = true;
          this.glow.classList.add('active');
          this.hero.classList.add('wwd-hide-cursor');
        }
      });
      
      // Mouse leave
      this.hero.addEventListener('mouseleave', () => {
        this.isMouseOver = false;
        this.glow.classList.remove('active');
        this.hero.classList.remove('wwd-hide-cursor');
        this.targetMouseX = -1000;
        this.targetMouseY = -1000;
      });
      
      // Window resize with debounce
      let resizeTimeout;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          this.resizeCanvas();
        }, 250);
      });
    }

    updatePositionAndMask() {
      // Smooth mouse following with faster response
      const smoothing = 0.25; // Increased from 0.1 for faster response
      this.mouseX += (this.targetMouseX - this.mouseX) * smoothing;
      this.mouseY += (this.targetMouseY - this.mouseY) * smoothing;
      
      // Update glow position
      this.glow.style.left = this.mouseX + 'px';
      this.glow.style.top = this.mouseY + 'px';
      
      // Update reveal radius with faster animation
      if (this.isMouseOver) {
        this.revealRadius += (this.targetRadius - this.revealRadius) * 0.2; // Increased from 0.1
      } else {
        this.revealRadius += (0 - this.revealRadius) * 0.2;
      }
      
      if (this.revealRadius > 1) {
        // Apply circular reveal mask to matrix wrapper
        const maskImage = `radial-gradient(circle at ${this.mouseX}px ${this.mouseY}px, 
          black 0%, 
          black ${this.revealRadius * 0.5}px, 
          transparent ${this.revealRadius}px)`;
        
        this.matrixWrapper.style.maskImage = maskImage;
        this.matrixWrapper.style.webkitMaskImage = maskImage;
      } else {
        // Hide matrix when not hovering
        this.matrixWrapper.style.maskImage = 'radial-gradient(circle at 0 0, transparent 0%, transparent 100%)';
        this.matrixWrapper.style.webkitMaskImage = 'radial-gradient(circle at 0 0, transparent 0%, transparent 100%)';
      }
    }

    drawMatrix() {
      // Check if we're ready to draw
      if (!this.ctx || !this.canvas || this.canvas.width === 0 || this.canvas.height === 0 || this.drops.length === 0) {
        return;
      }
      
      // Semi-transparent black to create fade effect
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      
      // Green text
      this.ctx.fillStyle = '#0F0';
      this.ctx.font = this.fontSize + 'px Courier';
      
      // Draw characters across full width
      for (let i = 0; i < this.columns; i++) {
        // Random character
        const char = this.matrixChars[Math.floor(Math.random() * this.matrixChars.length)];
        
        // Draw character
        const x = i * this.fontSize;
        const y = this.drops[i] * this.fontSize;
        
        if (y > 0 && y < this.canvas.height + 100) {
          this.ctx.fillText(char, x, y);
        }
        
        // Move drop down (at half speed)
        if (this.drops[i] * this.fontSize > this.canvas.height && Math.random() > 0.975) {
          this.drops[i] = -10;
        }
        this.drops[i] += 0.5; // Half speed
      }
    }

    animate() {
      this.drawMatrix();
      this.updatePositionAndMask();
      requestAnimationFrame(() => this.animate());
    }
  }

  // Initialize when window is fully loaded
  window.addEventListener('load', () => {
    new MatrixReveal();
  });

})();

// // ============================================
// // Wanderers Web Design - Matrix Reveal Effect
// // ============================================

// (function() {
//   'use strict';

//   class MatrixReveal {
//     constructor() {
//       this.hero = document.querySelector('.wwd-hero-interactive');
//       if (!this.hero) return;

//       // Initialize with safe defaults
//       this.canvas = null;
//       this.ctx = null;
//       this.columns = 0;
//       this.drops = [];
//       this.fontSize = 16;
      
//       // Wait for next frame to ensure layout is complete
//       requestAnimationFrame(() => {
//         this.init();
//       });
//     }

//     init() {
//       // Check if hero has dimensions
//       const rect = this.hero.getBoundingClientRect();
//       if (rect.width === 0 || rect.height === 0) {
//         // Try again later
//         setTimeout(() => this.init(), 100);
//         return;
//       }
      
//       this.setup();
//       this.bindEvents();
//       this.animate();
//     }

//     setup() {
//       // Get the background picture element first
//       this.backgroundPicture = this.hero.querySelector('.cs-background');
//       if (!this.backgroundPicture) {
//         console.warn('Background picture not found');
//         return;
//       }

//       // Create wrapper for matrix that will be masked
//       this.matrixWrapper = document.createElement('div');
//       this.matrixWrapper.className = 'wwd-matrix-wrapper';
      
//       // Create matrix container
//       this.matrixContainer = document.createElement('div');
//       this.matrixContainer.className = 'wwd-matrix-container';
      
//       // Create canvas for matrix rain
//       this.canvas = document.createElement('canvas');
//       this.canvas.className = 'wwd-matrix-canvas';
//       this.ctx = this.canvas.getContext('2d');
      
//       // Create soft glow
//       this.glow = document.createElement('div');
//       this.glow.className = 'wwd-matrix-glow';
      
//       // Build structure
//       this.matrixContainer.appendChild(this.canvas);
//       this.matrixWrapper.appendChild(this.matrixContainer);
//       this.matrixWrapper.appendChild(this.glow);
      
//       // Insert AFTER background (on top of it)
//       this.backgroundPicture.parentNode.insertBefore(this.matrixWrapper, this.backgroundPicture.nextSibling);
      
//       // Characters to use
//       this.matrixChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?';
      
//       // Mouse position
//       this.mouseX = -1000;
//       this.mouseY = -1000;
//       this.isMouseOver = false;
      
//       // Reveal radius
//       this.revealRadius = 0;
//       this.targetRadius = 150;
      
//       // Add class to hero
//       this.hero.classList.add('wwd-matrix-active');
      
//       // Set canvas sizes after adding to DOM
//       this.resizeCanvas();
//     }

//     resizeCanvas() {
//       const rect = this.hero.getBoundingClientRect();
      
//       // Ensure we have valid dimensions
//       const width = Math.max(1, Math.floor(rect.width));
//       const height = Math.max(1, Math.floor(rect.height));
      
//       if (width <= 0 || height <= 0) {
//         console.warn('Invalid dimensions for canvas');
//         return;
//       }
      
//       // Set canvas sizes to full hero dimensions
//       this.canvas.width = width;
//       this.canvas.height = height;
      
//       // Calculate columns safely
//       const cols = Math.floor(width / this.fontSize);
//       this.columns = Math.max(1, cols);
      
//       // Initialize drops array with random starting positions
//       this.drops = [];
//       for (let i = 0; i < this.columns; i++) {
//         this.drops.push(Math.floor(Math.random() * -100));
//       }
//     }

//     bindEvents() {
//       // Mouse move on the hero section
//       this.hero.addEventListener('mousemove', (e) => {
//         const rect = this.hero.getBoundingClientRect();
//         this.mouseX = e.clientX - rect.left;
//         this.mouseY = e.clientY - rect.top;
        
//         // Update glow position
//         this.glow.style.left = this.mouseX + 'px';
//         this.glow.style.top = this.mouseY + 'px';
        
//         if (!this.isMouseOver) {
//           this.isMouseOver = true;
//           this.glow.classList.add('active');
//         }
        
//         this.updateRevealMask();
//       });
      
//       // Mouse leave
//       this.hero.addEventListener('mouseleave', () => {
//         this.isMouseOver = false;
//         this.glow.classList.remove('active');
//         this.mouseX = -1000;
//         this.mouseY = -1000;
//         this.updateRevealMask();
//       });
      
//       // Window resize with debounce
//       let resizeTimeout;
//       window.addEventListener('resize', () => {
//         clearTimeout(resizeTimeout);
//         resizeTimeout = setTimeout(() => {
//           this.resizeCanvas();
//         }, 250);
//       });
//     }

//     updateRevealMask() {
//       // Update reveal radius with smooth animation
//       if (this.isMouseOver) {
//         this.revealRadius += (this.targetRadius - this.revealRadius) * 0.1;
//       } else {
//         this.revealRadius += (0 - this.revealRadius) * 0.1;
//       }
      
//       if (this.revealRadius > 1) {
//         // Apply circular reveal mask to matrix wrapper
//         const maskImage = `radial-gradient(circle at ${this.mouseX}px ${this.mouseY}px, 
//           black 0%, 
//           black ${this.revealRadius * 0.5}px, 
//           transparent ${this.revealRadius}px)`;
        
//         this.matrixWrapper.style.maskImage = maskImage;
//         this.matrixWrapper.style.webkitMaskImage = maskImage;
//       } else {
//         // Hide matrix when not hovering
//         this.matrixWrapper.style.maskImage = 'radial-gradient(circle at 0 0, transparent 0%, transparent 100%)';
//         this.matrixWrapper.style.webkitMaskImage = 'radial-gradient(circle at 0 0, transparent 0%, transparent 100%)';
//       }
//     }

//     drawMatrix() {
//       // Check if we're ready to draw
//       if (!this.ctx || !this.canvas || this.canvas.width === 0 || this.canvas.height === 0 || this.drops.length === 0) {
//         return;
//       }
      
//       // Semi-transparent black to create fade effect
//       this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
//       this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      
//       // Green text
//       this.ctx.fillStyle = '#0F0';
//       this.ctx.font = this.fontSize + 'px Courier';
      
//       // Draw characters across full width
//       for (let i = 0; i < this.columns; i++) {
//         // Random character
//         const char = this.matrixChars[Math.floor(Math.random() * this.matrixChars.length)];
        
//         // Draw character
//         const x = i * this.fontSize;
//         const y = this.drops[i] * this.fontSize;
        
//         if (y > 0 && y < this.canvas.height + 100) {
//           this.ctx.fillText(char, x, y);
//         }
        
//         // Move drop down (at half speed)
//         if (this.drops[i] * this.fontSize > this.canvas.height && Math.random() > 0.975) {
//           this.drops[i] = -10;
//         }
//         this.drops[i] += 0.5; // Half speed
//       }
//     }

//     animate() {
//       this.drawMatrix();
//       requestAnimationFrame(() => this.animate());
//     }
//   }

//   // Initialize when window is fully loaded
//   window.addEventListener('load', () => {
//     new MatrixReveal();
//   });

// })();