const inputText = document.getElementById('inputText');
const fileInput = document.getElementById('fileInput');

const analyzeBtn = document.getElementById('analyzeBtn');
const homeBtn = document.getElementById('homeBtn');
const errorReportBtn = document.getElementById('errorReportBtn');
const limpiarEditorBtn = document.getElementById('limpiarEditorBtn');
const guardarArchivoBtn = document.getElementById('guardarArchivoBtn');

const tokensTable = document.getElementById('tokensTable');
const errorsTable = document.getElementById('errorsTable');

analyzeBtn.addEventListener('click', () => {
  const content = inputText.value.trim();

  if (!content) {
    alert('Debes escribir texto o cargar un archivo .pklfp');
    return;
  }

  fetch('/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: content
  })
    .then(res => res.json())
    .then(data => {
      fillTable('tokensTable', data.tokens);
      fillTable('errorsTable', data.errors);
      tokensTable.style.display = '';
      errorsTable.style.display = '';
    });
});

fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  if (!file || !file.name.endsWith('.pklfp')) {
    alert('El archivo debe tener extensión .pklfp');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    inputText.value = e.target.result;
  };
  reader.readAsText(file);
});

homeBtn.addEventListener('click', () => {
  inputText.value = '';
  clearTable('tokensTable');
  clearTable('errorsTable');
  tokensTable.style.display = '';
  errorsTable.style.display = '';
});

errorReportBtn.addEventListener('click', () => {
  tokensTable.style.display = 'none';
  errorsTable.style.display = '';
});

limpiarEditorBtn.addEventListener('click', () => {
  inputText.value = '';
});

guardarArchivoBtn.addEventListener('click', () => {
  const content = inputText.value.trim();
  if (!content) {
    alert('No hay nada que guardar.');
    return;
  }

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'archivo.pklfp';
  a.click();
});

function fillTable(tableId, data) {
  const tbody = document.getElementById(tableId).querySelector('tbody');
  tbody.innerHTML = '';
  data.forEach(token => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${token.typeTokenString}</td>
      <td>${token.lexeme}</td>
      <td>${token.row}</td>
      <td>${token.column}</td>
    `;
    tbody.appendChild(tr);
  });
}

function clearTable(tableId) {
  const tbody = document.getElementById(tableId).querySelector('tbody');
  tbody.innerHTML = '';
}
