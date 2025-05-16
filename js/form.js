/**
 * Form handling functionality
 */

// Form validation
function validateForm(form) {
  const formData = new FormData(form);
  let isValid = true;
  
  // Clear previous error messages
  document.querySelectorAll('.error-message').forEach(el => {
    el.textContent = '';
    el.classList.remove('visible');
  });
  
  document.querySelectorAll('input, select').forEach(el => {
    el.classList.remove('error');
  });
  
  // Validate each field
  for (const [key, value] of formData.entries()) {
    const field = form.elements[key];
    const errorElement = document.getElementById(`${key}-error`);
    
    if (!value.trim()) {
      isValid = false;
      field.classList.add('error');
      
      if (errorElement) {
        errorElement.textContent = 'Este campo é obrigatório';
        errorElement.classList.add('visible');
      }
    } else {
      // Additional validation for specific fields
      switch (key) {
        case 'cnpj':
          // CNPJ validation
          const cnpjClean = value.replace(/\D/g, '');
          if (cnpjClean.length !== 14) {
            isValid = false;
            field.classList.add('error');
            if (errorElement) {
              errorElement.textContent = 'CNPJ inválido';
              errorElement.classList.add('visible');
            }
          }
          break;
          
        case 'telefone':
          // Phone validation
          const phoneClean = value.replace(/\D/g, '');
          if (phoneClean.length < 10 || phoneClean.length > 11) {
            isValid = false;
            field.classList.add('error');
            if (errorElement) {
              errorElement.textContent = 'Telefone inválido';
              errorElement.classList.add('visible');
            }
          }
          break;
          
        case 'faturamentoAnual':
        case 'vendaCartaoAnual':
          // Money validation (should be greater than zero)
          const moneyValue = value.replace(/\D/g, '');
          if (parseInt(moneyValue) <= 0) {
            isValid = false;
            field.classList.add('error');
            if (errorElement) {
              errorElement.textContent = 'Valor deve ser maior que zero';
              errorElement.classList.add('visible');
            }
          }
          break;
      }
    }
  }
  
  return isValid;
}

// Handle form submission
async function handleFormSubmit(event) {
  event.preventDefault();
  
  const form = event.target;
  const submitButton = form.querySelector('button[type="submit"]');
  const buttonText = submitButton.querySelector('.btn-text');
  const spinner = submitButton.querySelector('.spinner');
  
  // Validate form
  if (!validateForm(form)) {
    return;
  }
  
  try {
    // Show loading state
    buttonText.textContent = 'Processando...';
    spinner.classList.remove('hidden');
    submitButton.disabled = true;
    
    // Get form data
    const formData = new FormData(form);
    
    // Submit data to API
    await submitFormData(formData);
    
    // Show success modal
    document.getElementById('successModal').classList.add('visible');
    
  } catch (error) {
    console.error('Form submission error:', error);
    
    // Show error modal
    document.getElementById('errorModal').classList.add('visible');
    
  } finally {
    // Reset button state
    buttonText.textContent = 'Calcular resultados';
    spinner.classList.add('hidden');
    submitButton.disabled = false;
  }
}

// Reset form and UI state
function resetForm() {
  const form = document.getElementById('diagnosticForm');
  form.reset();
  
  // Hide modals
  document.getElementById('successModal').classList.remove('visible');
  document.getElementById('errorModal').classList.remove('visible');
  
  // Clear validations
  document.querySelectorAll('.error-message').forEach(el => {
    el.textContent = '';
    el.classList.remove('visible');
  });
  
  document.querySelectorAll('input, select').forEach(el => {
    el.classList.remove('error');
  });
}

// Setup form event listeners
function setupFormListeners() {
  const form = document.getElementById('diagnosticForm');
  if (form) {
    form.addEventListener('submit', handleFormSubmit);
  }
  
  // Download button
  const downloadButton = document.getElementById('downloadButton');
  if (downloadButton) {
    downloadButton.addEventListener('click', downloadPdf);
  }
  
  // New diagnostic button
  const newDiagnosticButton = document.getElementById('newDiagnosticButton');
  if (newDiagnosticButton) {
    newDiagnosticButton.addEventListener('click', resetForm);
  }
  
  // Try again button
  const tryAgainButton = document.getElementById('tryAgainButton');
  if (tryAgainButton) {
    tryAgainButton.addEventListener('click', resetForm);
  }
}