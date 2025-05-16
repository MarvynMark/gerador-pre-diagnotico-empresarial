/**
 * Main application initialization
 */
document.addEventListener('DOMContentLoaded', () => {
  // Initialize input masks
  setupMasks();
  
  // Setup form event listeners
  setupFormListeners();
  
  // Add subtle animations to form elements
  animateFormElements();
});

// Add staggered animations to form elements
function animateFormElements() {
  const formGroups = document.querySelectorAll('.form-group');
  
  formGroups.forEach((group, index) => {
    group.style.opacity = '0';
    group.style.transform = 'translateY(20px)';
    group.style.transition = `opacity 0.3s ease-out ${index * 0.05}s, transform 0.3s ease-out ${index * 0.05}s`;
    
    setTimeout(() => {
      group.style.opacity = '1';
      group.style.transform = 'translateY(0)';
    }, 100);
  });
}