// =========================================================
//   1. CONFIGURATION (TELEGRAM)
// =========================================================
const TELEGRAM_BOT_TOKEN = '8733683992:AAFN4nrOSqgBosp58Sns9nry6YN0-dQZFoo';
const TELEGRAM_CHAT_ID = '7155984961'; // Your personal Telegram ID

// Helper function to send messages silently or loudly
async function sendTelegramAlert(message, silent = true) {
  const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  try {
    await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        chat_id: TELEGRAM_CHAT_ID, 
        text: message, 
        parse_mode: 'HTML',
        disable_notification: silent // True for trackers, False for actual leads!
      })
    });
  } catch (e) {
    console.error("Telegram API Error:", e);
  }
}

// =========================================================
//   2. ULTIMATE SILENT TRACKER (VISITORS)
// =========================================================
async function getGeoData() {
  try {
    const geoResponse = await fetch('https://ipapi.co/json/');
    const geoData = await geoResponse.json();
    return geoData.city ? `${geoData.city}, ${geoData.country_name} (ISP: ${geoData.org})` : 'Hidden by Privacy Tools';
  } catch (error) {
    return 'Hidden by Ad-Blocker/Privacy tool';
  }
}

function getFormattedTime() {
  const d = new Date();
  const pad = (n) => (n < 10 ? '0' + n : n);
  const date = `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear().toString().slice(-2)}`;
  const time = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  return `${date} - ${time}`;
}

async function initTracker() {
  // Prevent spam if they just hit "refresh" on the same session
  if (sessionStorage.getItem('sessionActive')) return;
  sessionStorage.setItem('sessionActive', 'true');

  const fullTimeStr = getFormattedTime();
  
  // Get Device & Screen Info
  const userAgent = navigator.userAgent;
  let deviceType = "💻 Desktop";
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle/.test(userAgent)) deviceType = "📱 Mobile";
  else if (/iPad/.test(userAgent)) deviceType = "📱 Tablet";
  
  const screenSize = `${window.screen.width}x${window.screen.height}`;
  let referrer = document.referrer || "Direct Link/Hidden App (e.g. WhatsApp, IG)";

  // Check LocalStorage for Visitor Identity
  let visitorData = JSON.parse(localStorage.getItem('urhidu_visitor'));
  let isReturning = false;

  if (!visitorData) {
    // Brand new visitor! Assign an ID between 1 and 500
    visitorData = {
      id: Math.floor(Math.random() * 500) + 1,
      firstVisit: fullTimeStr
    };
    localStorage.setItem('urhidu_visitor', JSON.stringify(visitorData));
  } else {
    // Returning visitor!
    isReturning = true;
  }

  // Get Location
  const locationText = await getGeoData();

  // Construct Message
  let viewMessage = "";
  if (isReturning) {
    viewMessage = 
      `🔄 <b>RETURNING VISITOR (ID: #${visitorData.id})</b> 🔄\n\n` +
      `📅 <b>Returned At:</b> ${fullTimeStr}\n` +
      `⏪ <b>First Visit Was:</b> ${visitorData.firstVisit}\n\n` +
      `🖥️ <b>Device:</b> ${deviceType}\n` +
      `🌍 <b>Location:</b> ${locationText}`;
  } else {
    viewMessage = 
      `🆕 <b>NEW VISITOR (ID: #${visitorData.id})</b> 🆕\n\n` +
      `📅 <b>Time:</b> ${fullTimeStr}\n` +
      `🖥️ <b>Device:</b> ${deviceType}\n` +
      `📏 <b>Screen:</b> ${screenSize}\n` +
      `🔗 <b>Source:</b> ${referrer}\n` +
      `🌍 <b>Location:</b> ${locationText}`;
  }

  // Send the page view alert (Silent)
  sendTelegramAlert(viewMessage, true);

  // TRACK VIDEO PLAYS
  const myVideo = document.getElementById('demoVideoContainer');
  let videoTracked = false;
  if (myVideo) {
    myVideo.addEventListener('click', () => {
      if (!videoTracked) {
        sendTelegramAlert(`▶️ <b>Visitor #${visitorData.id}</b> just clicked PLAY on the Demo Video!`, true);
        videoTracked = true; 
      }
    });
  }

  // TRACK INTENT (SCROLLED TO FORM)
  const leadFormSection = document.getElementById('formContainer');
  let formScrolled = false;
  if (leadFormSection) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !formScrolled) {
        sendTelegramAlert(`🔥 <b>Visitor #${visitorData.id}</b> scrolled down to the Lead Form! High intent.`, true);
        formScrolled = true; 
      }
    }, { threshold: 0.5 }); // Triggers when 50% of the form is visible
    observer.observe(leadFormSection);
  }
}

// Start the tracker
initTracker();


// =========================================================
//   3. LEAD CAPTURE FORM SUBMISSION (LOUD NOTIFICATION)
// =========================================================
const form = document.getElementById('leadForm');
const submitBtn = document.getElementById('submitBtn');
const formContainer = document.getElementById('formContainer');
const successContainer = document.getElementById('successContainer');

if (form) {
  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Securing Spot...';
    submitBtn.disabled = true;

    const restName = document.getElementById('restaurantName').value.trim();
    const ownerName = document.getElementById('ownerName').value.trim();
    const phone = document.getElementById('phone').value.trim();

    // Grab Visitor ID to tie the lead to the tracked user
    let visitorIdText = "Unknown";
    try {
      const vData = JSON.parse(localStorage.getItem('urhidu_visitor'));
      if (vData && vData.id) visitorIdText = `#${vData.id}`;
    } catch(err) {}

    // Construct Lead Message
    const message =
      `🚨 <b>NEW BETA PARTNER LEAD</b> 🚨\n\n` +
      `🆔 <b>Visitor ID:</b> ${visitorIdText}\n` +
      `🏢 <b>Restaurant:</b> ${restName}\n` +
      `👤 <b>Manager:</b> ${ownerName}\n` +
      `📞 <b>Phone:</b> ${phone}\n\n` +
      `<i>Source: URHIDU Digital Menu Program Landing Page</i>`;

    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    try {
      // Send Lead (Notice we pass disable_notification: false so your phone RINGS for a lead!)
      const response = await fetch(telegramUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          chat_id: TELEGRAM_CHAT_ID, 
          text: message, 
          parse_mode: 'HTML',
          disable_notification: false 
        })
      });

      if (response.ok) {
        formContainer.style.display = 'none';
        successContainer.style.display = 'block';
        successContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        const errorData = await response.json();
        alert('Telegram Error: ' + (errorData.description || 'Unknown error'));
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
      }
    } catch (error) {
      alert('Network error. Please check your connection.');
      submitBtn.innerHTML = originalBtnText;
      submitBtn.disabled = false;
    }
  });
}


// =========================================================
//   4. SCROLL REVEAL ANIMATION (For Founder's Note)
// =========================================================
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.2 
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target); 
    }
  });
}, observerOptions);

const elementsToAnimate = document.querySelectorAll('.scroll-animate');
elementsToAnimate.forEach(el => {
  observer.observe(el);
});


// =========================================================
//   5. CUSTOM VIDEO PLAYER LOGIC
// =========================================================
const videoContainer = document.getElementById('demoVideoContainer');
const video = document.getElementById('demoVideo');

if (videoContainer && video) {
  videoContainer.addEventListener('click', () => {
    if (video.paused) {
      video.play();
      video.setAttribute('controls', 'controls'); 
      videoContainer.classList.add('is-playing'); 
    } else {
      video.pause();
      videoContainer.classList.remove('is-playing');
    }
  });

  video.addEventListener('ended', () => {
    videoContainer.classList.remove('is-playing');
    video.removeAttribute('controls'); 
  });
}