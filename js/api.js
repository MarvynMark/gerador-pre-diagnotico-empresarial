// Mock API endpoint (replace with your actual backend endpoint)
const API_ENDPOINT = 'https://wn8n.starksolucoes.site/webhook/gerar-pre-diagnostico';

let pdfData = null;
const formDataObject = {};
let tipoFormulario = '';

/**
 * Submit form data to the API
 * @param {FormData} formData - Form data to be submitted
 * @returns {Promise} - Promise with the API response
 */
async function submitFormData(formData) {
  try {
    formData.forEach((value, key) => {
      formDataObject[key] = value;
    });

    tipoFormulario = formDataObject.tipoFormulario;

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formDataObject)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const blob = await response.blob();
    pdfData = blob; 
    return blob;
    
  } catch (error) {
    console.error('Error submitting form:', error);
    throw error;
  }
}

/**
 * Download the PDF data as a file
 */
function downloadPdf() {
  if (!pdfData) {
    console.error('No PDF data available');
    return;
  }
  
  // Create a URL for the blob
  const url = URL.createObjectURL(pdfData);
  


  // Create a link element
  const link = document.createElement('a');
  link.href = url;
  link.download = pdfName();
  
  // Append to the document
  document.body.appendChild(link);
  
  // Click the link
  link.click();
  
  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function pdfName() {
  if (tipoFormulario == "vendasCartao") {
    let razaoSocial = formDataObject.razaoSocial;
    razaoSocial = razaoSocial.replace(/[^a-zA-Z0-9\s]/g, '');
    return `Pré-Diagnóstico – Recuperação em Vendas por Cartão - ${razaoSocial}.pdf`;

  } else if (tipoFormulario == "veiculo") {
    let nome = formDataObject.nome;
    nome = nome.replace(/[^a-zA-Z0-9\s]/g, '');
    return `Pré-diagnóstico - Financiamento de Veículo - ${nome}.pdf`;

  } else if (tipoFormulario == "medico") {
    let nome = formDataObject.nome;
    nome = nome.replace(/[^a-zA-Z0-9\s]/g, '');
    return `Pré-diagnóstico - Plano de Saúde - ${nome}.pdf`;

  } else if (tipoFormulario == "superendividamento") {
    let nome = formDataObject.nome;
    nome = nome.replace(/[^a-zA-Z0-9\s]/g, '');
    return `Pré-diagnóstico - Superindividamento - ${nome}.pdf`;
  }
}