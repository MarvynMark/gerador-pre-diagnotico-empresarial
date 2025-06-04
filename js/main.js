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

  tooltipFlow();
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

function tooltipFlow() {
  // Verifica se o tooltip já existe
  let tooltip = document.getElementById('customTooltip');
  if (!tooltip) {
    tooltip = document.createElement('div');
    tooltip.id = 'customTooltip';
    tooltip.className = 'tooltip-follow';
    document.body.appendChild(tooltip);
  }

  const alvos = document.getElementsByClassName('customTooltipAlvo');
  //const tooltip = document.getElementById('customTooltip');
  const textoTooltip = 'Este formulário ainda não está disponível. Por favor, volte mais tarde.';

  Array.from(alvos).forEach(alvo => {
    setupTooltip(alvo, tooltip, textoTooltip);
  });
}

function setupTooltip(alvo, tooltip, texto) {
  alvo.addEventListener('mouseenter', () => {
    tooltip.textContent = texto;
    tooltip.style.display = 'block';
  });

  alvo.addEventListener('mousemove', e => {
    tooltip.style.left = e.clientX + 10 + 'px';
    tooltip.style.top = e.clientY + 10 + 'px';
  });

  alvo.addEventListener('mouseleave', () => {
    tooltip.style.display = 'none';
  });
}