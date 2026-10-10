/* Quote form for inner pages. Uses the same EmailJS service, template and
   public key as the homepage form, so leads route exactly as before. */
(function () {
  var form = document.getElementById('quoteForm');
  if (!form) return;
  var status = document.getElementById('formStatus');
  var ready = false;
  function init() {
    if (ready || !window.emailjs) return ready;
    window.emailjs.init({ publicKey: 'alWutsHLG6c3h9P2j' });
    ready = true;
    return ready;
  }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var hp = form.querySelector('input[name="_honey"]');
    if (hp && hp.value) { return; }
    var zip = form.querySelector('input[name="user_zip"]');
    if (zip && !/^9\d{4}$/.test(zip.value.trim())) {
      status.textContent = 'Please enter a 5-digit California ZIP code (they start with 9).';
      status.className = 'formStatus err';
      zip.focus();
      return;
    }
    if (!init()) {
      status.textContent = 'The form could not load. Please call 1-888-779-2284 and we will help you by phone.';
      status.className = 'formStatus err';
      return;
    }
    status.textContent = 'Sending your request...';
    status.className = 'formStatus';
    var btn = form.querySelector('button[type="submit"]');
    if (btn) btn.disabled = true;
    window.emailjs.sendForm('service_usimtub', 'template_5n0cskt', form)
      .then(function () {
        status.textContent = 'Thank you. Your request was sent. A specialist will contact you, usually within one business day.';
        status.className = 'formStatus ok';
        form.reset();
      })
      .catch(function () {
        status.textContent = 'Something went wrong sending the form. Please call 1-888-779-2284.';
        status.className = 'formStatus err';
      })
      .then(function () { if (btn) btn.disabled = false; });
  });
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
