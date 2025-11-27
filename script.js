// Combined site script for public usage (Production)
// Canonical file: This is the script that the server serves from /script.js
// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

function showNotification(message, type) {
  console.log(`[${type.toUpperCase()}] ${message}`);
  // You can enhance this with a toast notification library if needed
}

document.addEventListener('DOMContentLoaded', initAbsentForm);

function initAbsentForm() {
  const absentForm = document.getElementById('absenForm');
  if (!absentForm) return;
  absentForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const fullname = this.querySelector('#fullname')?.value.trim();
    const phone = this.querySelector('#phone')?.value.trim();
    const address = this.querySelector('#address')?.value.trim();
    const pekerjaan = this.querySelector('#pekerjaan')?.value.trim();


    if (!fullname) { showNotification('Nama lengkap harus diisi', 'error'); return; }
    if (!phone) { showNotification('Nomor telepon harus diisi', 'error'); return; }
    if (!address) { showNotification('Alamat harus diisi', 'error'); return; }
    if (!pekerjaan) { showNotification('Pekerjaan harus diisi', 'error'); return; }

    

    // In a real app, send absent data to server here (POST /absent)
    const payload = { fullname, phone, address, pekerjaan };
    const submitBtn = absentForm.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;
    fetch('/absen', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      .then(response => response.json())
      .then(json => {
        if (json && json.success) {
          showNotification(json.message || 'Absensi Berhasil!', 'success');
          absentForm.reset();
          // After 1.2s redirect to the thank you page with encoded parameters
          setTimeout(() => {
            // Redirect to WhatsApp number (Indonesia) - 085330745126 => 6285330745126
            const waPhone = '6283862276293';
            const msg = `Panti Asuhan Muhammadiyah KH Achmad Dahlan\nBuku Tamu\nBazzar Milad Ke 113 Muhammadiyah\n\nNama : ${fullname}\nPekerjaan : ${pekerjaan}\nAlamat : ${address}\nNo. WA : ${phone}`;
            const waUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(msg)}`;
            // Redirect to WhatsApp (same tab)
            window.location.href = waUrl;
          }, 1200);
        } else {
          showNotification(json.message || 'Terjadi masalah saat memproses absen', 'error');
        }
      })
      .catch(err => {
        console.error('Absent submit error', err);
        showNotification('Gagal mengirim absen. Silakan coba lagi.', 'error');
      })
      .finally(() => { if (submitBtn) submitBtn.disabled = false; });
  });
}