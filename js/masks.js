/**
 * Masks for input fields
 */

function maskCPF_CNPJ(input) {
  if (input.classList.contains('cnpj')) {
    return maskCNPJ(input);
  }

  if (input.classList.contains('cpf')) {
    return maskCPF(input);
  }
}

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

// CPF mask (format: XXX.XXX.XXX-XX)
function maskCPF(input) {
  let value = input.value.replace(/\D/g, '');
  
  if (value.length > 11) {
    value = value.slice(0, 11);
  }

  if (value.length > 3) {
    value = value.replace(/^(\d{3})(\d)/, '$1.$2');
  }
  if (value.length > 6) {
    value = value.replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
  }
  if (value.length > 9) {
    value = value.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
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
  // Remove tudo que não for número
  let valor = input.value.replace(/[^\d]/g, '');

  // Se estiver vazio ou não for número, retorna valor mínimo
  if (!valor || isNaN(valor)) {
    input.value = 'R$ 0,00';
    return;
  }

  // Converte para centavos e formata
  valor = (parseInt(valor, 10) / 100).toFixed(2);
  let [inteiro, decimal] = valor.split('.');

  // Adiciona separadores de milhar
  inteiro = inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  input.value = `R$ ${inteiro},${decimal}`;
}


// Apply masks to specific inputs
function setupMasks() {

  // Seleciona todos os tipos
  const allInputs = $('.cnpj, .cpf, .cpfCnpj');
  // Remove eventos antigos e adiciona novos
  allInputs.off('input focus').on('input focus', function (e) {
    const el = this;
    if (e.type === 'focus') {
      setTimeout(() => applyDynamicMaskCpfCnpj(el), 0);
    } else {
      applyDynamicMaskCpfCnpj(el);
    }
  });
  
  // Phone mask
  const phoneInput = document.getElementById('telefone');
  if (phoneInput) {
    phoneInput.addEventListener('input', () => maskPhone(phoneInput));
    phoneInput.addEventListener('focus', () => {
      setTimeout(() => maskPhone(phoneInput), 0);
    });
  }
  
  const inputsMoney = $('.money');
  inputsMoney.off('input focus').on('input focus blur', function (e) {
    const el = this;
    if (e.type === 'input') {
      maskMoney(el);
    } else if (e.type === 'focus') {
      $(el).removeClass('error');
      el.nextElementSibling.classList.remove('visible')
    }
  });
}

function applyDynamicMaskCpfCnpj(input) {
  const $input = $(input);
  $input.removeClass('error');
  input.nextElementSibling.classList.remove('visible')

  if ($input.hasClass('cpf')) {
    $input.val(maskCPF(input));
  } else if ($input.hasClass('cnpj')) {
    $input.val(maskCNPJ(input));
  } else if ($input.hasClass('cpfCnpj')) {
    $input.val(maskCPF(input));
  }
}