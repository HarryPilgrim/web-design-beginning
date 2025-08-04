// Portfolio scroll animations
document.addEventListener('DOMContentLoaded', function() {
  const portfolioSections = document.querySelectorAll('.portfolio-project');
  
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);
  
  portfolioSections.forEach(section => {
    observer.observe(section);
  });
});