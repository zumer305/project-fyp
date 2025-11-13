// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()


// Package planner and theme toggle logic
document.addEventListener('DOMContentLoaded', () => {
  const pkgBudget = document.getElementById('packageBudget');
  const pkgBudgetValue = document.getElementById('packageBudgetValue');
  if (pkgBudget && pkgBudgetValue) {
    const updateBudget = () => { pkgBudgetValue.textContent = pkgBudget.value; };
    pkgBudget.addEventListener('input', updateBudget);
    updateBudget();
  }

  const genBtn = document.getElementById('generatePackagesBtn');
  const countryInput = document.getElementById('countryInput');
  const daysSelect = document.getElementById('daysSelect');
  if (genBtn && countryInput && pkgBudget && daysSelect) {
    genBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const country = countryInput.value.trim();
      const budget = parseInt(pkgBudget.value) || 0;
      const days = parseInt(daysSelect.value) || 5;
      if (!country) {
        alert('Please enter a country');
        return;
      }
      const url = `/packages?country=${encodeURIComponent(country)}&budget=${budget}&days=${days}`;
      window.location.href = url;
    });
  }

});






