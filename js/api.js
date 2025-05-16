/**
 * API communication functions
 */

// Mock API endpoint (replace with your actual backend endpoint)
const API_ENDPOINT = 'https://wn8n.starksolucoes.site/webhook/gerar-pre-diagnostico-vendas-cartao';

// Store PDF data when received
let pdfData = null;
const formDataObject = {};

/**
 * Submit form data to the API
 * @param {FormData} formData - Form data to be submitted
 * @returns {Promise} - Promise with the API response
 */
async function submitFormData(formData) {
  try {
    
    // Convert FormData to JSON object
    //const formDataObject = {};
    formData.forEach((value, key) => {
      formDataObject[key] = value;
    });

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
    
    // For PDF response
    const blob = await response.blob();
    pdfData = blob; // Store the PDF data
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
  
  // Pdf name
  let razaoSocial = formDataObject.razaoSocial;
  razaoSocial = razaoSocial.replace(/\s+/g, '_');
  razaoSocial = razaoSocial.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const pdfName = `pre_diagnostico_recuperacao_em_vendas-${razaoSocial}.pdf`;

  // Create a link element
  const link = document.createElement('a');
  link.href = url;
  link.download = pdfName;
  
  // Append to the document
  document.body.appendChild(link);
  
  // Click the link
  link.click();
  
  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
