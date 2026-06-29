// Navbar scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// Hamburger
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));
document.addEventListener('click', e => { if (!navbar.contains(e.target)) navLinks.classList.remove('open'); });

// Counter
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const step = target / (1800 / 16);
  let cur = 0;
  const t = setInterval(() => {
    cur += step;
    if (cur >= target) { cur = target; clearInterval(t); }
    el.textContent = Math.floor(cur);
  }, 16);
}
const cObs = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { animateCounter(e.target); cObs.unobserve(e.target); } }), {threshold:0.5});
document.querySelectorAll('.stat-num[data-target]').forEach(el => cObs.observe(el));

// Products tabs
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const tab = btn.dataset.tab;
    document.getElementById('tab-electric').style.display = tab === 'electric' ? 'grid' : 'none';
    document.getElementById('tab-plumbing').style.display = tab === 'plumbing' ? 'grid' : 'none';
  });
});

// Time slots
document.querySelectorAll('.time-slot').forEach(slot => {
  slot.addEventListener('click', () => {
    document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
    slot.classList.add('selected');
    document.getElementById('selectedTime').value = slot.dataset.time;
  });
});

// Set min date for booking
const dateInput = document.getElementById('bookingDate');
if (dateInput) {
  const today = new Date().toISOString().split('T')[0];
  dateInput.min = today;
}

// Forms
['quoteForm','bookingForm','contactForm'].forEach(id => {
  const form = document.getElementById(id);
  if (!form) return;
  const successId = id.replace('Form','Success');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type=submit]');
    btn.textContent = 'جاري الإرسال...';
    btn.disabled = true;
    setTimeout(() => {
      document.getElementById(successId).style.display = 'block';
      form.reset();
      btn.textContent = btn.textContent.includes('حجز') ? 'تأكيد الحجز 📅' : btn.textContent.includes('سعر') ? 'إرسال طلب عرض السعر ⚡' : 'إرسال الطلب ⚡';
      btn.disabled = false;
      setTimeout(() => { document.getElementById(successId).style.display = 'none'; }, 5000);
    }, 1200);
  });
});

// FAQ
document.querySelectorAll('.faq-question').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.parentElement;
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); window.scrollTo({top: target.getBoundingClientRect().top + window.scrollY - 80, behavior:'smooth'}); }
  });
});

// Active nav
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) current = s.id; });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.style.color = a.getAttribute('href') === '#'+current ? 'var(--gold)' : '';
  });
});

// Bell Notification
const notiBell = document.getElementById('notiBell');
const notiContent = document.getElementById('notiContent');
const bellBadge = document.querySelector('.bell-badge');

if (bellBadge) {
  const count = document.querySelectorAll('.bell-item').length;
  bellBadge.textContent = count;
}

if (notiBell && notiContent) {
  notiBell.addEventListener('click', function(e) {
    e.stopPropagation();
    notiContent.classList.toggle('show');
  });

  document.addEventListener('click', function(e) {
    if (!notiBell.contains(e.target) && !notiContent.contains(e.target)) {
      notiContent.classList.remove('show');
    }
  });
}
// Loyalty Diamond
const loyaltyBtn = document.getElementById('loyaltyBtn');
const loyaltyForm = document.getElementById('loyaltyForm');

if (loyaltyBtn && loyaltyForm) {
  loyaltyBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    loyaltyForm.classList.toggle('show');
    if (notiContent) notiContent.classList.remove('show');
  });

  document.addEventListener('click', function(e) {
    if (!loyaltyBtn.contains(e.target) && !loyaltyForm.contains(e.target)) {
      loyaltyForm.classList.remove('show');
    }
  });
}
// ══ لقاء — القائمة المنسدلة ══
const liqaaBtn      = document.getElementById('liqaaBtn');
const liqaaDropdown = document.getElementById('liqaaDropdown');

liqaaBtn.addEventListener('click', function(e) {
  e.stopPropagation();
  liqaaDropdown.classList.toggle('open');
});
document.addEventListener('click', function() {
  liqaaDropdown.classList.remove('open');
});

// ══ النوافذ ══
const panels = {
  register: {
    title: '🔗 ربط رقم العميل',
    html: `
      <p class="liqaa-hint">أدخل رقم جوال العميل لربطه بحساب النقاط</p>
      <input class="liqaa-input" id="lq-phone" type="tel" placeholder="05XXXXXXXX">
      <div class="liqaa-err" id="lq-err"></div>
      <div class="liqaa-code-box" id="lq-codebox" style="display:none">
        <div class="liqaa-code-lbl">💎 كود العميل — أعطِه للمشرف</div>
        <div class="liqaa-code-val" id="lq-code"></div>
      </div>
      <input class="liqaa-input" id="lq-verify" placeholder="كود التفعيل من المشرف" style="display:none">
      <button class="liqaa-btn-gold" id="lq-main-btn" onclick="lqStep()">إرسال الطلب</button>
    `
  },
  collect: {
    title: '⭐ تحصيل النقاط',
    html: `
      <p class="liqaa-hint">أدخل رقم العميل وقيمة الفاتورة لاحتساب النقاط</p>
      <input class="liqaa-input" id="lq-col-phone" type="tel" placeholder="رقم جوال العميل">
      <input class="liqaa-input" id="lq-col-amount" type="number" placeholder="قيمة الفاتورة (ريال)">
      <div class="liqaa-code-box" id="lq-col-result" style="display:none">
        <div class="liqaa-code-lbl">✅ النقاط المضافة</div>
        <div class="liqaa-code-val" id="lq-col-pts"></div>
      </div>
      <button class="liqaa-btn-gold" onclick="lqCollect()">احتساب النقاط</button>
    `
  },
  redeem: {
    title: '🎁 استبدال النقاط',
    html: `
      <p class="liqaa-hint">أدخل رقم العميل وعدد النقاط المراد استبدالها</p>
      <input class="liqaa-input" id="lq-red-phone" type="tel" placeholder="رقم جوال العميل">
      <input class="liqaa-input" id="lq-red-pts" type="number" placeholder="عدد النقاط">
      <div class="liqaa-code-box" id="lq-red-result" style="display:none">
        <div class="liqaa-code-lbl">💰 قيمة الاستبدال</div>
        <div class="liqaa-code-val" id="lq-red-val"></div>
      </div>
      <button class="liqaa-btn-gold" onclick="lqRedeem()">استبدال</button>
    `
  },
  admin: {
    title: '⚙ لوحة الإدارة',
    html: `
      <p class="liqaa-hint">أدخل كلمة المرور للدخول</p>
      <input class="liqaa-input" id="lq-admin-pass" type="password" placeholder="كلمة المرور">
      <div class="liqaa-err" id="lq-admin-err"></div>
      <button class="liqaa-btn-gold" onclick="lqAdminLogin()">دخول</button>
    `
  }
};

let lqCurrentCode = '';
let lqCurrentStep = 1;
const ADMIN_PASS = '1234'; // غيّرها
const POINTS_RATE = 10;    // 10 نقاط لكل ريال

function openPanel(type) {
  liqaaDropdown.classList.remove('open');
  lqCurrentStep = 1;
  const p = panels[type];
  document.getElementById('lq-panel-title').textContent = p.title;
  document.getElementById('lq-panel-body').innerHTML = p.html;
  document.getElementById('liqaa-overlay').classList.add('open');
}

function closePanel() {
  document.getElementById('liqaa-overlay').classList.remove('open');
}

// ربط العميل - خطوتان
function lqStep() {
  if (lqCurrentStep === 1) {
    const phone = document.getElementById('lq-phone').value;
    if (phone.length < 9) {
      const err = document.getElementById('lq-err');
      err.textContent = 'أدخل رقم جوال صحيح';
      err.style.display = 'block'; return;
    }
    lqCurrentCode = 'FV-' + Math.floor(1000 + Math.random() * 9000);
    document.getElementById('lq-code').textContent = lqCurrentCode;
    document.getElementById('lq-codebox').style.display = 'block';
    document.getElementById('lq-verify').style.display  = 'block';
    document.getElementById('lq-main-btn').textContent  = 'تفعيل العضوية';
    lqCurrentStep = 2;
  } else {
    const input = document.getElementById('lq-verify').value.trim().toUpperCase();
    if (input === lqCurrentCode) {
      document.getElementById('lq-panel-body').innerHTML =
        `<div style="text-align:center;padding:16px 0">
          <div style="font-size:48px;margin-bottom:12px">💎</div>
          <div style="color:#C9A84C;font-size:18px;font-weight:700;margin-bottom:8px">تم التسجيل بنجاح!</div>
          <p class="liqaa-hint">مرحباً بك في برنامج لقاء</p>
          <button class="liqaa-btn-gold" style="margin-top:8px" onclick="closePanel()">إغلاق</button>
        </div>`;
    } else {
      const err = document.getElementById('lq-err');
      err.textContent = 'الكود غير صحيح، راجع المشرف';
      err.style.display = 'block';
    }
  }
}

// تحصيل النقاط
function lqCollect() {
  const phone  = document.getElementById('lq-col-phone').value;
  const amount = parseFloat(document.getElementById('lq-col-amount').value);
  if (!phone || !amount) return;
  const pts = Math.floor(amount * POINTS_RATE);
  document.getElementById('lq-col-pts').textContent = pts + ' نقطة';
  document.getElementById('lq-col-result').style.display = 'block';
}

// استبدال النقاط
function lqRedeem() {
  const phone = document.getElementById('lq-red-phone').value;
  const pts   = parseInt(document.getElementById('lq-red-pts').value);
  if (!phone || !pts) return;
  const val = (pts / POINTS_RATE).toFixed(2);
  document.getElementById('lq-red-val').textContent = val + ' ريال';
  document.getElementById('lq-red-result').style.display = 'block';
}

// دخول الإدارة
function lqAdminLogin() {
  const pass = document.getElementById('lq-admin-pass').value;
  if (pass === ADMIN_PASS) {
    document.getElementById('lq-panel-body').innerHTML =
      `<p class="liqaa-hint" style="color:#C9A84C">✅ تم الدخول — لوحة الإدارة الكاملة قيد التطوير</p>
       <button class="liqaa-btn-gold" onclick="closePanel()">إغلاق</button>`;
  } else {
    const err = document.getElementById('lq-admin-err');
    err.textContent = 'كلمة المرور غير صحيحة';
    err.style.display = 'block';
  }
}
