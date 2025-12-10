// Simple Live Calculator + copy, share, pdf export (client-side)
const $ = id => document.getElementById(id);
const priceInput = $('price');
const discountInput = $('discount');
const vatInput = $('vat');
const resultDiv = $('result');
const copyBtn = $('copyBtn');
const shareBtn = $('shareBtn');
const exportPdfBtn = $('exportPdfBtn');

function calculateAndShow() {
  const p = parseFloat(priceInput.value);
  if (isNaN(p)) {
    resultDiv.textContent = 'Result: —';
    return;
  }
  const d = parseFloat(discountInput.value) || 0;
  const v = parseFloat(vatInput.value) || 0;

  const afterDiscount = p - (p * (d/100));
  const finalPrice = afterDiscount + (afterDiscount * (v/100));
  resultDiv.textContent = 'Result: ' + finalPrice.toFixed(2);
  animateResult();
}

function animateResult(){
  resultDiv.style.opacity = 0;
  resultDiv.style.transform = 'scale(0.96)';
  requestAnimationFrame(()=> {
    resultDiv.style.transition = 'all 320ms cubic-bezier(.2,.9,.3,1)';
    resultDiv.style.opacity = 1;
    resultDiv.style.transform = 'scale(1)';
  });
}

[priceInput, discountInput, vatInput].forEach(inp => {
  inp.addEventListener('input', calculateAndShow);
});

// copy
copyBtn.addEventListener('click', async () => {
  const text = resultDiv.textContent;
  try {
    await navigator.clipboard.writeText(text);
    copyBtn.textContent = 'Copied!';
    setTimeout(()=> copyBtn.textContent = 'Copy Result', 1200);
  } catch(e){
    alert('Clipboard not available');
  }
});

// share
shareBtn.addEventListener('click', async () => {
  const text = resultDiv.textContent;
  if (navigator.share) {
    try {
      await navigator.share({title:'Calculator result', text});
    } catch(e){}
  } else {
    prompt('Copy and share result', text);
  }
});

// export PDF (basic via window.print to a printable doc opened in new tab)
exportPdfBtn.addEventListener('click', () => {
  const html = `
    <html>
      <head><meta charset="utf-8"><title>Calc Result</title></head>
      <body style="font-family:Arial;padding:40px;color:#111">
        <h2>Calculator Result</h2>
        <p>${resultDiv.textContent}</p>
        <p>Generated: ${new Date().toLocaleString()}</p>
      </body>
    </html>
  `;
  const w = window.open('', '_blank');
  w.document.write(html);
  w.document.close();
  w.print();
});
