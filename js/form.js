const formIds = [
  'diagnosticVendasCartaoForm',
  'diagnosticVeiculoForm',
  'diagnosticMedicoForm',
  'diagnosticSuperendividamentoForm'
];

let activeForm = null;

for (const id of formIds) {
  const formElement = document.getElementById(id);
  if (formElement) {
    activeForm = formElement;
    activeForm.addEventListener('submit', handleFormSubmit);
    break; 
  }
}

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
    
    if (!value.trim() && field.hasAttribute('required')) {
      isValid = false;
      field.classList.add('error');
      
      if (errorElement) {
        errorElement.textContent = 'Este campo é obrigatório';
        errorElement.classList.add('visible');
      }
    } else {
      // Additional validation for specific fields
      if (field.classList.contains('cpf')) {
          if (!isValidCPF(value)) {
            isValid = false;
            field.classList.add('error');
            if (errorElement) {
              errorElement.textContent = 'CPF inválido';
              errorElement.classList.add('visible');
            }
          }
      } else if (field.classList.contains('cnpj')) {
        if (!isValidCNPJ(value)) {
          isValid = false;
          field.classList.add('error');
          if (errorElement) {
            errorElement.textContent = 'CNPJ inválido';
            errorElement.classList.add('visible');
          }
        }
      }
      else if (field.classList.contains('telefone')) {
        if (!isValidTelefone(value)) {
          isValid = false;
          field.classList.add('error');
          if (errorElement) {
            errorElement.textContent = 'Telefone inválido';
            errorElement.classList.add('visible');
          }
        }
      } else if (field.classList.contains('money')) {
        const moneyValue = value.replace(/\D/g, '');
        if (parseInt(moneyValue) <= 0) {
          isValid = false;
          field.classList.add('error');
          if (errorElement) {
            errorElement.textContent = 'Valor deve ser maior que zero';
            errorElement.classList.add('visible');
          }
        }
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
  if (this.id === 'newDiagnosticButton') { 
    activeForm.reset();
  }
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
  
  const formVeiculo = document.getElementById('diagnosticVeiculoForm');
  if (formVeiculo) {
    setupFormListenersVeiculo();
  }
  const formSuperendividamento = document.getElementById('diagnosticSuperendividamentoForm');
  if (formSuperendividamento) {
    setupFormListenersSuperendividamento();
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

function setupFormListenersVeiculo() {
  // form elements
  const selectEhPessoaFisicaOuJuridica = document.getElementById('pessoaFisicaOuJuridica');
  const selectTemSeguroEmbutido = document.getElementById('temSeguroEmbutido');
  const selectSabeValorNoContrato = document.getElementById('sabeValorNoContrato');
  const inputValorQueConstaNoContrato = document.getElementById('valorQueConstaNoContrato')
  const divSabeValorNoContrato = document.getElementById('divSabeValorNoContrato');
  const inputSabeValorNoContrato = document.getElementById('sabeValorNoContrato');
  const divValorQueConstaNoContrato = document.getElementById('divValorQueConstaNoContrato')
  const inputsTelefone = document.getElementsByClassName('telefone');
  
  const lbNome = document.getElementById('lbNome');
  const lbCpfCnpj = document.getElementById('lbCpfCnpj');

  const inputNome = document.getElementById('nome');
  const inputCpfCnpj = document.getElementById('cpfCnpj');
 
  // listeners
  selectEhPessoaFisicaOuJuridica.addEventListener('change', function() {
    const isPessoaJuridica = this.value === 'juridica';

    if (isPessoaJuridica) {
      lbNome.textContent = 'Nome da empresa';
      lbCpfCnpj.textContent = 'CNPJ';
      inputNome.value = ''; 
      inputCpfCnpj.value = '';
      inputCpfCnpj.classList.add('cnpj');
      inputCpfCnpj.classList.remove('cpf');  
    } else {
      lbNome.textContent = 'Nome';
      inputNome.value = ''; 
      lbCpfCnpj.textContent = 'CPF';
      inputCpfCnpj.value = '';
      inputCpfCnpj.classList.add('cpf');
      inputCpfCnpj.classList.remove('cnpj');
    }
    setupMasks();
        
  });
 
  selectTemSeguroEmbutido.addEventListener('change', function() {
    const isSim = this.value === 'Sim';
    
    if (isSim) {
      divSabeValorNoContrato.style.display = 'block';
      inputSabeValorNoContrato.setAttribute('required', 'required');
    } else {
      selectSabeValorNoContrato.selectedIndex = 0;
      divSabeValorNoContrato.style.display = 'none';
      inputSabeValorNoContrato.removeAttribute('required');

      inputValorQueConstaNoContrato.value = '';
      divValorQueConstaNoContrato.style.display = 'none';  
      inputValorQueConstaNoContrato.removeAttribute('required');
    }

  });

  selectSabeValorNoContrato.addEventListener('change', function() {
    const isSim = this.value === 'Sim';
    
    if (isSim) {
      divValorQueConstaNoContrato.style.display = 'block';  
      inputValorQueConstaNoContrato.setAttribute('required', 'required');
    } else { 
      inputValorQueConstaNoContrato.value = '';
      divValorQueConstaNoContrato.style.display = 'none';  
      inputValorQueConstaNoContrato.removeAttribute('required');
    }
  });   
}

function setupFormListenersSuperendividamento() {
  // form elements
  const selectPossuiDependentes = document.getElementById('possuiDependentes');
  const inputValorQueConstaNoContrato = document.getElementById('algumDependenteComPatologia')
  const divAlgumDependenteComPatologia = document.getElementById('divAlgumDependenteComPatologia')
 
  selectPossuiDependentes.addEventListener('change', function() {
    const isSim = this.value === 'Sim';
    
    if (isSim) {
      divAlgumDependenteComPatologia.style.display = 'block';
      inputValorQueConstaNoContrato.setAttribute('required', 'required');
    } else {
      divAlgumDependenteComPatologia.style.display = 'none';
      inputValorQueConstaNoContrato.removeAttribute('required');
      inputValorQueConstaNoContrato.value = '';
    }
  });
}

function isValidCPF(cpf) {
  cpf = cpf.replace(/\D/g, '');

  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }

  let dig1 = 11 - (soma % 11);
  dig1 = dig1 >= 10 ? 0 : dig1;

  if (dig1 !== parseInt(cpf.charAt(9))) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }

  let dig2 = 11 - (soma % 11);
  dig2 = dig2 >= 10 ? 0 : dig2;

  return dig2 === parseInt(cpf.charAt(10));
}

function isValidCNPJ(cnpj) {
  cnpj = cnpj.replace(/\D/g, '');

  if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false;

  let soma = 0;
  let pesos = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  for (let i = 0; i < 12; i++) {
    soma += parseInt(cnpj.charAt(i)) * pesos[i];
  }

  let dig1 = soma % 11;
  dig1 = dig1 < 2 ? 0 : 11 - dig1;

  if (dig1 !== parseInt(cnpj.charAt(12))) return false;

  soma = 0;
  pesos.unshift(6); // adiciona 6 no começo

  for (let i = 0; i < 13; i++) {
    soma += parseInt(cnpj.charAt(i)) * pesos[i];
  }

  let dig2 = soma % 11;
  dig2 = dig2 < 2 ? 0 : 11 - dig2;

  return dig2 === parseInt(cnpj.charAt(13));
}

function isValidTelefone(telefone) {
  const tel = telefone.replace(/\D/g, '');

  if (tel.length === 10) {
    // Telefone fixo: (XX) XXXX-XXXX
    return /^[1-9]{2}[2-5][0-9]{7}$/.test(tel);
  }

  if (tel.length === 11) {
    // Celular: (XX) 9XXXX-XXXX
    return /^[1-9]{2}9[0-9]{8}$/.test(tel);
  }

  return false;
}
