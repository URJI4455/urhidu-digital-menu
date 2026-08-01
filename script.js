// --- SILENT TELEGRAM LEAD CAPTURE ---
const TELEGRAM_BOT_TOKEN = '8733683992:AAFN4nrOSqgBosp58Sns9nry6YN0-dQZFoo';

// ❌ OLD: const TELEGRAM_CHAT_ID = '8733683992'; (This was the bot's ID, not yours)
// ✅ NEW: Replace this string with YOUR personal ID from @userinfobot
const TELEGRAM_CHAT_ID = '7155984961'; 

const form = document.getElementById('leadForm');
const submitBtn = document.getElementById('submitBtn');
const formContainer = document.getElementById('formContainer');
const successContainer = document.getElementById('successContainer');

// Ensure form exists
if (form) {
  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Securing Spot...';
    submitBtn.disabled = true;

    const restName = document.getElementById('restaurantName').value.trim();
    const ownerName = document.getElementById('ownerName').value.trim();
    const phone = document.getElementById('phone').value.trim();

    // Changed to HTML formatting to prevent crashes if users type special characters like '_' or '*'
    const message =
      `🚨 <b>NEW BETA PARTNER LEAD</b> 🚨\n\n` +
      `🏢 <b>Restaurant:</b> ${restName}\n` +
      `👤 <b>Manager:</b> ${ownerName}\n` +
      `📞 <b>Phone:</b> ${phone}\n\n` +
      `<i>Source: URHIDU Digital Menu Program Landing Page</i>`;

    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    try {
      const response = await fetch(telegramUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          chat_id: TELEGRAM_CHAT_ID, 
          text: message, 
          parse_mode: 'HTML' // Safe parsing
        })
      });

      if (response.ok) {
        formContainer.style.display = 'none';
        successContainer.style.display = 'block';
        successContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        // Logs the exact error to your browser console so you can troubleshoot if it happens again
        const errorData = await response.json();
        console.error("Telegram API Error:", errorData);
        alert('Something went wrong. Please try again.');
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
      }
    } catch (error) {
      console.error("Network Error:", error);
      alert('Network error. Please check your connection.');
      submitBtn.innerHTML = originalBtnText;
      submitBtn.disabled = false;
    }
  });
} // <-- Closed the bracket here where it belongs!

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
      video.setAttribute('controls', 'controls'); // Show native controls
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
