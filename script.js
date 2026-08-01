// --- SILENT TELEGRAM LEAD CAPTURE ---
// Replace these with your actual bot credentials from BotFather
const TELEGRAM_BOT_TOKEN = '8733683992:AAFN4nrOSqgBosp58Sns9nry6YN0-dQZFoo';
const TELEGRAM_CHAT_ID = '@urhidu_dmp_bot';

const form = document.getElementById('leadForm');
const submitBtn = document.getElementById('submitBtn');
const formContainer = document.getElementById('formContainer');
const successContainer = document.getElementById('successContainer');

// Check if the form exists before adding listener (good practice for separated JS)
if (form) {
  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Securing Spot...';
    submitBtn.disabled = true;

    const restName = document.getElementById('restaurantName').value.trim();
    const ownerName = document.getElementById('ownerName').value.trim();
    const phone = document.getElementById('phone').value.trim();

    const message =
      `🚨 *NEW BETA PARTNER LEAD* 🚨\n\n` +
      `🏢 *Restaurant:* ${restName}\n` +
      `👤 *Manager:* ${ownerName}\n` +
      `📞 *Phone:* ${phone}\n\n` +
      `_Source: URHIDU Digital Menu Program Landing Page_`;

    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    try {
      const response = await fetch(telegramUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message, parse_mode: 'Markdown' })
      });

      if (response.ok) {
        formContainer.style.display = 'none';
        successContainer.style.display = 'block';
        successContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        alert('Something went wrong. Please try again.');
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
      }
    } catch (error) {
      alert('Network error. Please check your connection.');
      submitBtn.innerHTML = originalBtnText;
      submitBtn.disabled = false;
    }
  });
  
  
  // --- SCROLL REVEAL ANIMATION (For Founder's Note) ---
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.2 // Triggers when 20% of the element is visible
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target); // Only animate once
    }
  });
}, observerOptions);

const elementsToAnimate = document.querySelectorAll('.scroll-animate');
elementsToAnimate.forEach(el => {
  observer.observe(el);
});




// --- CUSTOM VIDEO PLAYER LOGIC ---
const videoContainer = document.getElementById('demoVideoContainer');
const video = document.getElementById('demoVideo');

if (videoContainer && video) {
  videoContainer.addEventListener('click', () => {
    if (video.paused) {
      video.play();
      video.setAttribute('controls', 'controls'); // Show native controls (volume, fullscreen)
      videoContainer.classList.add('is-playing'); // Hides the big custom play button
    } else {
      video.pause();
      videoContainer.classList.remove('is-playing');
    }
  });

  // When the 7-second ad finishes, bring the big play button back
  video.addEventListener('ended', () => {
    videoContainer.classList.remove('is-playing');
    video.removeAttribute('controls'); // Hide native controls again
  });
}
  
  
  
  
}