/**
 * Masks for input fields
 */

// CNPJ mask (format: XX.XXX.XXX/XXXX-XX)
function maskCNPJ(input) {
  let value = input.value.replace(/\D/g, '');
  
  if (value.length > 14) {
    value = value.slice(0, 14);
  }
  
  // Apply CNPJ mask
  if (value.length > 0) {
    value = value.replace(/^(\d{2})(\d)/, '$1.$2');
    value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
    value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
    value = value.replace(/(\d{4})(\d)/, '$1-$2');
  }
  
  input.value = value;
  return value;
}

// Phone mask (format: (XX) XXXXX-XXXX)
function maskPhone(input) {
  let value = input.value.replace(/\D/g, '');
  
  if (value.length > 11) {
    value = value.slice(0, 11);
  }
  
  // Apply phone mask
  if (value.length > 0) {
    value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
    value = value.replace(/(\d)(\d{4})$/, '$1-$2');
  }
  
  input.value = value;
  return value;
}

// Money mask (format: R$ X.XXX,XX)
function maskMoney(input) {
  let value = input.value.replace(/\D/g, '');
  
  // Convert to cents and format
  value = (parseInt(value) / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2
  });
  
  input.value = value;
  return value;
}

// Apply masks to specific inputs
function setupMasks() {
  // CNPJ mask
  const cnpjInput = document.getElementById('cnpj');
  if (cnpjInput) {
    cnpjInput.addEventListener('input', () => maskCNPJ(cnpjInput));
    cnpjInput.addEventListener('focus', () => {
      setTimeout(() => maskCNPJ(cnpjInput), 0);
    });
  }
  
  // Phone mask
  const phoneInput = document.getElementById('telefone');
  if (phoneInput) {
    phoneInput.addEventListener('input', () => maskPhone(phoneInput));
    phoneInput.addEventListener('focus', () => {
      setTimeout(() => maskPhone(phoneInput), 0);
    });
  }
  
  // Money masks
  const moneyInputs = [
    document.getElementById('faturamentoAnual'),
    document.getElementById('vendaCartaoAnual')
  ];
  
  moneyInputs.forEach(input => {
    if (input) {
      input.addEventListener('input', () => maskMoney(input));
      input.addEventListener('focus', () => {
        if (!input.value) {
          input.value = 'R$ 0,00';
        }
      });
      input.addEventListener('blur', () => {
        if (input.value === 'R$ 0,00') {
          input.value = '';
        }
      });
    }
  });
}