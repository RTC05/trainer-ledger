/* Type chart interactions: open/close, offense/defense mode, text filter */
'use strict';

window.toggleTypeChart = function toggleTypeChart() {
  const body = document.getElementById('type-chart-body');
  const chevron = document.getElementById('type-chart-chevron');
  const btn = document.querySelector('.type-chart-toggle');
  if (!body || !chevron || !btn) return;
  const isOpen = !body.hidden;
  body.hidden = isOpen;
  chevron.innerHTML = isOpen ? '&#9660;' : '&#9650;';
  btn.setAttribute('aria-expanded', String(!isOpen));
};

window.setTypeChartMode = function setTypeChartMode(mode) {
  const grid = document.getElementById('type-chart-grid');
  const offBtn = document.getElementById('type-chart-mode-offense');
  const defBtn = document.getElementById('type-chart-mode-defense');
  if (!grid || !offBtn || !defBtn) return;

  const isDefense = mode === 'defense';
  grid.classList.toggle('type-chart-defense-mode', isDefense);
  offBtn.classList.toggle('active', !isDefense);
  defBtn.classList.toggle('active', isDefense);
};

window.filterTypeChartRows = function filterTypeChartRows(rawQuery) {
  const q = (rawQuery || '').trim().toLowerCase();
  document.querySelectorAll('#type-chart-grid .type-chart-row').forEach((row) => {
    const blob = (row.dataset.searchText || row.dataset.typeName || '').toLowerCase();
    row.style.display = (!q || blob.includes(q)) ? '' : 'none';
  });
};
