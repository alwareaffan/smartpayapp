const appState = {
  currentScreen: "splash",
  onboardingStep: "mobile",
  darkMode: false,
  biometricEnabled: true,
  notificationsEnabled: true,
  balanceVisible: false,
  authRequest: null,
  user: {
    name: "Affan",
    phone: "",
    bank: "",
    accountNumber: "",
    upiPin: "",
    balance: 48250.75,
  },
  selectedMerchant: null,
  pendingAmount: "",
  selectedBillCategory: null,
  transactions: [
    { id: 1, title: "Cafe Bloom", subtitle: "Today, 09:12 AM", amount: -850, type: "debit", icon: "shop" },
    { id: 2, title: "Salary Credit", subtitle: "Today, 08:00 AM", amount: 125000, type: "credit", icon: "bank" },
    { id: 3, title: "Zuri Electricity", subtitle: "Yesterday", amount: -18400, type: "debit", icon: "bolt" },
    { id: 4, title: "Mobile Recharge", subtitle: "18 Apr 2026", amount: -3000, type: "debit", icon: "phone" },
    { id: 5, title: "Amina Yusuf", subtitle: "17 Apr 2026", amount: -12500, type: "debit", icon: "person" },
  ],
  notifications: [
    { id: 1, title: "Cashback unlocked", body: "You earned TZS 1,500 on your electricity bill.", time: "2m ago", unread: true },
    { id: 2, title: "Bank linked successfully", body: "CRDB account ending 2048 is ready for SmartPay.", time: "1h ago", unread: false },
    { id: 3, title: "Security tip", body: "Change your UPI PIN regularly to keep payments secure.", time: "Yesterday", unread: false },
  ],
  rewards: [
    { id: 1, title: "Pay 3 bills this week", reward: "TZS 2,000 cashback" },
    { id: 2, title: "First QR payment", reward: "Scratch card unlocked" },
    { id: 3, title: "Invite a friend", reward: "Earn TZS 5,000 each" },
  ],
  banks: ["CRDB Bank", "NMB Bank", "Stanbic Bank", "Equity Bank", "Absa Bank"],
  merchants: [
    { id: "merchant-1", name: "Mambo Grocers", upiId: "mambo@smartpay" },
    { id: "merchant-2", name: "Urban Fuel Station", upiId: "urbanfuel@smartpay" },
    { id: "merchant-3", name: "Bluebird Pharmacy", upiId: "bluebird@smartpay" },
  ],
  billCategories: [
    { id: "electricity", label: "Electricity", field: "Consumer Number", hint: "Enter meter or account number", icon: "bolt" },
    { id: "recharge", label: "Mobile Recharge", field: "Mobile Number", hint: "Enter phone number", icon: "phone" },
    { id: "dth", label: "DTH", field: "Subscriber ID", hint: "Enter DTH subscriber number", icon: "tv" },
    { id: "water", label: "Water", field: "Consumer Number", hint: "Enter water account number", icon: "drop" },
  ],
  fetchedBill: null,
};

const screenMount = document.getElementById("screenMount");
const body = document.body;

const icons = {
  home: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 11.5 12 4l9 7.5"></path><path d="M5 10.5V20h14v-9.5"></path></svg>`,
  wallet: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H19a1 1 0 0 1 1 1v2.5"></path><path d="M4 8h16a1 1 0 0 1 1 1v9a2 2 0 0 1-2 2H6.5A2.5 2.5 0 0 1 4 17.5V8Z"></path><path d="M15 13h6"></path></svg>`,
  bill: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M7 3h10v18l-2.5-1.8L12 21l-2.5-1.8L7 21V3Z"></path><path d="M9.5 8h5"></path><path d="M9.5 12h5"></path></svg>`,
  profile: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"></path><path d="M4 20a8 8 0 0 1 16 0"></path></svg>`,
  arrowLeft: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m14.5 5-7 7 7 7"></path></svg>`,
  bell: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 9a6 6 0 1 1 12 0c0 7 2 8 2 8H4s2-1 2-8"></path><path d="M10 20a2 2 0 0 0 4 0"></path></svg>`,
  qr: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 4h6v6H4z"></path><path d="M14 4h6v6h-6z"></path><path d="M4 14h6v6H4z"></path><path d="M14 14h2"></path><path d="M18 14h2v2"></path><path d="M16 18h4"></path><path d="M18 16v4"></path></svg>`,
  contact: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
  transfer: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M17 3h4v4"></path><path d="m21 3-7 7"></path><path d="M7 21H3v-4"></path><path d="m3 21 7-7"></path><path d="M14 14H7V7"></path></svg>`,
  phone: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M22 16.92V20a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3.09a2 2 0 0 1 2 1.72l.35 2.82a2 2 0 0 1-.57 1.72l-1.4 1.4a16 16 0 0 0 6 6l1.4-1.4a2 2 0 0 1 1.72-.57l2.82.35A2 2 0 0 1 22 16.92Z"></path></svg>`,
  bolt: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z"></path></svg>`,
  tv: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="6" width="18" height="13" rx="2"></rect><path d="m9 3 3 3 3-3"></path></svg>`,
  drop: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2s6 7 6 12a6 6 0 0 1-12 0C6 9 12 2 12 2Z"></path></svg>`,
  moon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z"></path></svg>`,
  face: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"></circle><path d="M9 10h.01"></path><path d="M15 10h.01"></path><path d="M8.5 15a5 5 0 0 0 7 0"></path></svg>`,
  person: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="4"></circle><path d="M5 20a7 7 0 0 1 14 0"></path></svg>`,
  bank: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m3 10 9-6 9 6"></path><path d="M4 10h16"></path><path d="M6 10v8"></path><path d="M10 10v8"></path><path d="M14 10v8"></path><path d="M18 10v8"></path><path d="M3 20h18"></path></svg>`,
  shield: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3 5 6v6c0 5 3.5 8.74 7 10 3.5-1.26 7-5 7-10V6l-7-3Z"></path></svg>`,
  shop: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 8h16l-1 12H5L4 8Z"></path><path d="M9 8V6a3 3 0 0 1 6 0v2"></path></svg>`,
};

function currency(amount) {
  return new Intl.NumberFormat("en-TZ", {
    style: "currency",
    currency: "TZS",
    maximumFractionDigits: 0,
  }).format(amount);
}

function setScreen(screen, options = {}) {
  appState.currentScreen = screen;
  Object.assign(appState, options);
  renderApp();
}

function goBack() {
  const routeMap = {
    otp: () => setScreen("mobile"),
    bankLink: () => setScreen("otp"),
    home: () => setScreen("bankLink"),
    scan: () => setScreen("home"),
    amountEntry: () => setScreen("scan"),
    paymentConfirm: () => setScreen("amountEntry"),
    paymentSuccess: () => setScreen("home"),
    payments: () => setScreen("home"),
    bills: () => setScreen("home"),
    utilityForm: () => setScreen("bills"),
    utilitySuccess: () => setScreen("bills"),
    history: () => setScreen("payments"),
    rewards: () => setScreen("profile"),
    notifications: () => setScreen("home"),
    profile: () => setScreen("home"),
    settings: () => setScreen("profile"),
    security: () => setScreen("settings"),
  };

  const action = routeMap[appState.currentScreen];
  if (action) {
    action();
  }
}

function renderApp() {
  body.classList.toggle("dark-mode", appState.darkMode);
  screenMount.innerHTML = `${getScreenMarkup()}${renderAuthModal()}`;
  bindEvents();
}

function renderAuthModal() {
  if (!appState.authRequest) {
    return "";
  }

  const copy = {
    balance: {
      title: "Show balance",
      description: "Enter your UPI PIN to reveal the available balance.",
      cta: "Verify and show",
    },
    payment: {
      title: "Authorize payment",
      description: "Enter your UPI PIN to continue with this payment.",
      cta: "Authorize payment",
    },
    bill: {
      title: "Authorize bill payment",
      description: "Enter your UPI PIN to pay this bill securely.",
      cta: "Authorize bill payment",
    },
  }[appState.authRequest.type];

  return `
    <div class="modal-backdrop">
      <div class="modal-sheet stack">
        <div>
          <h2>${copy.title}</h2>
          <p>${copy.description}</p>
        </div>
        <div class="field">
          <label for="authUpiPin">UPI PIN</label>
          <input id="authUpiPin" class="input" type="password" inputmode="numeric" maxlength="4" placeholder="Enter 4-digit PIN">
        </div>
        <div class="split">
          <button class="secondary-btn" data-action="cancel-auth">Cancel</button>
          <button class="cta" data-action="submit-auth">${copy.cta}</button>
        </div>
      </div>
    </div>
  `;
}

function layout({ title, subtitle = "", content, showBack = false, nav = true, headerAction = "" }) {
  return `
    <section class="screen">
      <header class="screen-header">
        ${showBack ? `<button class="icon-btn" data-action="back" aria-label="Go back">${icons.arrowLeft}</button>` : `<div></div>`}
        <div style="flex:1; min-width:0;">
          ${title ? `<h1 class="screen-title">${title}</h1>` : ""}
          ${subtitle ? `<p class="screen-subtitle">${subtitle}</p>` : ""}
        </div>
        ${headerAction || `<div style="width:42px;"></div>`}
      </header>
      <div class="screen-body">${content}</div>
      ${nav ? bottomNav() : ""}
    </section>
  `;
}

function bottomNav() {
  const tabs = [
    { id: "home", label: "Home", icon: icons.home },
    { id: "payments", label: "Payments", icon: icons.wallet },
    { id: "bills", label: "Bills", icon: icons.bill },
    { id: "profile", label: "Profile", icon: icons.profile },
  ];

  const rootScreen = ["history", "scan", "amountEntry", "paymentConfirm", "paymentSuccess"].includes(appState.currentScreen)
    ? "payments"
    : ["utilityForm", "utilitySuccess"].includes(appState.currentScreen)
      ? "bills"
      : ["settings", "security", "rewards"].includes(appState.currentScreen)
        ? "profile"
        : appState.currentScreen;

  return `
    <nav class="bottom-nav" aria-label="Primary">
      ${tabs.map((tab) => `
        <button class="nav-item ${rootScreen === tab.id ? "active" : ""}" data-nav="${tab.id}">
          ${tab.icon}
          <span>${tab.label}</span>
        </button>
      `).join("")}
    </nav>
  `;
}

function renderTransactions(limit = appState.transactions.length) {
  return `
    <div class="list">
      ${appState.transactions.slice(0, limit).map((item) => `
        <article class="list-item">
          <div class="icon-wrap">${icons[item.icon] || icons.wallet}</div>
          <div class="list-copy">
            <h3>${item.title}</h3>
            <p>${item.subtitle}</p>
          </div>
          <div class="amount ${item.type}">
            ${item.type === "credit" ? "+" : "-"} ${currency(Math.abs(item.amount))}
          </div>
        </article>
      `).join("")}
    </div>
  `;
}

function renderUtilities() {
  return `
    <div class="utility-grid">
      ${appState.billCategories.map((category) => `
        <button class="utility-item" data-bill-category="${category.id}">
          <div class="icon-wrap">${icons[category.icon]}</div>
          <strong>${category.label}</strong>
          <span class="muted">${category.hint}</span>
        </button>
      `).join("")}
    </div>
  `;
}

function getScreenMarkup() {
  switch (appState.currentScreen) {
    case "splash":
      return renderSplash();
    case "mobile":
      return renderMobileInput();
    case "otp":
      return renderOtp();
    case "bankLink":
      return renderBankLink();
    case "home":
      return renderHome();
    case "payments":
      return renderPayments();
    case "scan":
      return renderScan();
    case "amountEntry":
      return renderAmountEntry();
    case "paymentConfirm":
      return renderPaymentConfirm();
    case "paymentSuccess":
      return renderPaymentSuccess();
    case "bills":
      return renderBills();
    case "utilityForm":
      return renderUtilityForm();
    case "utilitySuccess":
      return renderUtilitySuccess();
    case "history":
      return renderHistory();
    case "rewards":
      return renderRewards();
    case "notifications":
      return renderNotifications();
    case "profile":
      return renderProfile();
    case "settings":
      return renderSettings();
    case "security":
      return renderSecurity();
    default:
      return renderHome();
  }
}

function renderSplash() {
  return `
    <section class="screen">
      <div class="brand-block">
        <div class="logo-mark">S</div>
        <p class="hero-chip">Unified Payments</p>
        <h1 class="brand-title">SmartPay</h1>
        <p class="brand-tagline">Fast, secure, and beautifully simple money movement for everyday payments.</p>
        <div class="hero-panel stack">
          <div>
            <h2 style="margin:0 0 8px; font-size:1.2rem;">Everything in one payment app</h2>
            <p class="muted" style="margin:0;">Scan merchants, pay contacts, settle bills, and track rewards with a single wallet experience.</p>
          </div>
          <button class="cta" data-action="start-onboarding">Get Started</button>
          <button class="secondary-btn" data-action="biometric-login">${icons.face} Use biometric preview</button>
        </div>
      </div>
    </section>
  `;
}

function renderMobileInput() {
  return layout({
    title: "Register your number",
    subtitle: "We will send a one-time password to verify your SmartPay account.",
    nav: false,
    content: `
      <div class="stack">
        <div class="form-card stack">
          <div class="field">
            <label for="mobileNumber">Mobile number</label>
            <input id="mobileNumber" class="input" type="tel" inputmode="numeric" placeholder="+255 7XX XXX XXX" value="${appState.user.phone}">
          </div>
          <p class="muted" style="margin:0;">Use any dummy Tanzanian mobile number for this prototype.</p>
        </div>
        <button class="cta" data-action="submit-mobile">Send OTP</button>
      </div>
    `,
  });
}

function renderOtp() {
  return layout({
    title: "Verify OTP",
    subtitle: `A simulated OTP has been sent to ${appState.user.phone || "+255 700 000 000"}. Use 123456 to continue.`,
    showBack: true,
    nav: false,
    content: `
      <div class="stack">
        <div class="form-card stack">
          <div class="field">
            <label for="otpInput">One-time password</label>
            <input id="otpInput" class="input" type="tel" inputmode="numeric" maxlength="6" placeholder="123456">
          </div>
          <div class="tag">Mock validation enabled</div>
        </div>
        <button class="cta" data-action="submit-otp">Verify and continue</button>
      </div>
    `,
  });
}

function renderBankLink() {
  return layout({
    title: "Link your bank",
    subtitle: "Connect an account and set a UPI PIN to enable payments.",
    showBack: true,
    nav: false,
    content: `
      <div class="stack">
        <div class="form-card stack">
          <div class="field">
            <label for="bankSelect">Select bank</label>
            <select id="bankSelect" class="select">
              <option value="">Choose a bank</option>
              ${appState.banks.map((bank) => `<option value="${bank}" ${appState.user.bank === bank ? "selected" : ""}>${bank}</option>`).join("")}
            </select>
          </div>
          <div class="field">
            <label for="accountNumber">Account number</label>
            <input id="accountNumber" class="input" type="text" inputmode="numeric" placeholder="Enter 8-12 digits" value="${appState.user.accountNumber}">
          </div>
          <div class="field">
            <label for="upiPin">Set UPI PIN</label>
            <input id="upiPin" class="input" type="password" inputmode="numeric" maxlength="4" placeholder="4-digit PIN">
          </div>
          <p class="muted" style="margin:0;">This is a mock setup flow with frontend-only validation.</p>
        </div>
        <button class="cta" data-action="link-bank">Finish Setup</button>
      </div>
    `,
  });
}

function renderHome() {
  return layout({
    title: "",
    subtitle: "",
    headerAction: `<button class="icon-btn" data-nav="notifications" aria-label="Notifications">${icons.bell}</button>`,
    content: `
      <div class="topbar">
        <div class="profile-block">
          <div class="avatar">${appState.user.name.slice(0, 1)}</div>
          <div>
            <div class="muted" style="font-size:0.8rem;">Hello</div>
            <h1 class="screen-title" style="margin-top:2px;">${appState.user.name}</h1>
          </div>
        </div>
        <div class="tag">${icons.shield} Secure mode</div>
      </div>

      <section class="balance-card">
        <div class="balance-label">Total balance</div>
        <div class="balance-row">
          <div class="balance-value">${appState.balanceVisible ? currency(appState.user.balance) : "TZS ••••••"}</div>
          <button class="balance-toggle" data-action="${appState.balanceVisible ? "hide-balance" : "request-balance-visibility"}">
            ${appState.balanceVisible ? "Hide" : "Show"}
          </button>
        </div>
        <div class="balance-meta">
          <span>${appState.user.bank || "Primary bank"} linked</span>
          <span>UPI ready</span>
        </div>
      </section>

      <div class="section-head">
        <h2>Quick actions</h2>
        <span class="muted">Pay faster</span>
      </div>
      <div class="quick-grid">
        <button class="quick-action" data-nav="scan">
          <div class="icon-wrap">${icons.qr}</div>
          <strong>Scan QR</strong>
          <span class="muted">Merchant payment</span>
        </button>
        <button class="quick-action" data-action="contact-payment">
          <div class="icon-wrap">${icons.contact}</div>
          <strong>Pay Contacts</strong>
          <span class="muted">Transfer instantly</span>
        </button>
        <button class="quick-action" data-action="bank-transfer">
          <div class="icon-wrap">${icons.transfer}</div>
          <strong>Bank Transfer</strong>
          <span class="muted">To any account</span>
        </button>
        <button class="quick-action" data-bill-category="recharge">
          <div class="icon-wrap">${icons.phone}</div>
          <strong>Mobile Recharge</strong>
          <span class="muted">Top up now</span>
        </button>
      </div>

      <div class="section-head">
        <h2>Recent transactions</h2>
        <button class="muted" data-nav="history">View all</button>
      </div>
      ${renderTransactions(4)}
    `,
  });
}

function renderPayments() {
  return layout({
    title: "Payments",
    subtitle: "Choose how you want to send money.",
    content: `
      <div class="payments-grid">
        <button class="payments-tile" data-nav="scan">
          <div class="icon-wrap">${icons.qr}</div>
          <strong>Scan QR</strong>
          <span class="muted">Pay merchants instantly</span>
        </button>
        <button class="payments-tile" data-action="contact-payment">
          <div class="icon-wrap">${icons.contact}</div>
          <strong>Pay Contacts</strong>
          <span class="muted">Send to saved contacts</span>
        </button>
        <button class="payments-tile" data-action="bank-transfer">
          <div class="icon-wrap">${icons.transfer}</div>
          <strong>Bank Transfer</strong>
          <span class="muted">Move funds to bank</span>
        </button>
        <button class="payments-tile" data-nav="history">
          <div class="icon-wrap">${icons.wallet}</div>
          <strong>History</strong>
          <span class="muted">Review all activity</span>
        </button>
      </div>
      <div class="section-head">
        <h2>Suggested merchants</h2>
      </div>
      <div class="list">
        ${appState.merchants.map((merchant) => `
          <button class="list-item" data-merchant="${merchant.id}">
            <div class="icon-wrap">${icons.shop}</div>
            <div class="list-copy">
              <h3>${merchant.name}</h3>
              <p>${merchant.upiId}</p>
            </div>
            <div class="tag">Pay</div>
          </button>
        `).join("")}
      </div>
    `,
  });
}

function renderScan() {
  return layout({
    title: "Scan QR",
    subtitle: "Camera simulation for merchant payments.",
    showBack: true,
    content: `
      <div class="stack">
        <section class="qr-stage">
          <div class="scan-line"></div>
          <div class="scanner-copy">
            <h3 style="margin:0 0 8px;">Align QR inside the frame</h3>
            <p style="margin:0;">Tap simulate scan to read a nearby SmartPay merchant code.</p>
          </div>
        </section>
        <div class="split">
          <button class="secondary-btn" data-action="fake-qr">Generate fake QR</button>
          <button class="cta" data-action="simulate-scan">Simulate scan</button>
        </div>
      </div>
    `,
  });
}

function renderAmountEntry() {
  const merchant = appState.selectedMerchant || appState.merchants[0];
  return layout({
    title: "Enter amount",
    subtitle: "Merchant detected successfully.",
    showBack: true,
    content: `
      <div class="stack">
        <div class="merchant-card">
          <div class="row">
            <div class="icon-wrap">${icons.shop}</div>
            <div>
              <h3 style="margin:0;">${merchant.name}</h3>
              <p class="muted" style="margin:6px 0 0;">${merchant.upiId}</p>
            </div>
          </div>
        </div>
        <div class="form-card">
          <label for="paymentAmount" class="muted" style="display:block; margin-bottom:8px;">Amount</label>
          <div class="amount-shell">
            <span class="amount-currency">TZS</span>
            <input id="paymentAmount" class="amount-input" type="number" inputmode="decimal" placeholder="0" value="${appState.pendingAmount}">
          </div>
        </div>
        <button class="cta" data-action="confirm-amount">Review payment</button>
      </div>
    `,
  });
}

function renderPaymentConfirm() {
  const merchant = appState.selectedMerchant || appState.merchants[0];
  return layout({
    title: "Confirm payment",
    subtitle: "Review the payment details below.",
    showBack: true,
    content: `
      <div class="stack">
        <div class="form-card stack">
          <div class="row space-between">
            <span class="muted">To</span>
            <strong>${merchant.name}</strong>
          </div>
          <div class="row space-between">
            <span class="muted">UPI ID</span>
            <strong>${merchant.upiId}</strong>
          </div>
          <div class="row space-between">
            <span class="muted">Amount</span>
            <strong>${currency(Number(appState.pendingAmount || 0))}</strong>
          </div>
          <div class="row space-between">
            <span class="muted">From</span>
            <strong>${appState.user.bank || "SmartPay Wallet"}</strong>
          </div>
        </div>
        <button class="cta" data-action="make-payment">Pay now</button>
      </div>
    `,
  });
}

function renderPaymentSuccess() {
  const merchant = appState.selectedMerchant || appState.merchants[0];
  return layout({
    title: "Payment complete",
    subtitle: "Your transaction has been processed successfully.",
    nav: false,
    content: `
      <div class="success-card stack">
        <div class="success-ring">
          <div class="checkmark"></div>
        </div>
        <div>
          <h2 style="margin:0;">Paid ${currency(Number(appState.pendingAmount || 0))}</h2>
          <p class="muted" style="margin:8px 0 0;">Sent to ${merchant.name}</p>
        </div>
        <div class="tag" style="margin:0 auto;">Reference: SP${Date.now().toString().slice(-6)}</div>
        <button class="cta" data-nav="home">Back to home</button>
      </div>
    `,
  });
}

function renderBills() {
  return layout({
    title: "Bill payments",
    subtitle: "Pay utilities and services from one place.",
    content: `
      <div class="stack">
        ${renderUtilities()}
      </div>
    `,
  });
}

function renderUtilityForm() {
  const category = appState.billCategories.find((item) => item.id === appState.selectedBillCategory) || appState.billCategories[0];
  return layout({
    title: category.label,
    subtitle: "Fetch and pay a mock bill instantly.",
    showBack: true,
    content: `
      <div class="stack">
        <div class="form-card stack">
          <div class="field">
            <label for="utilityRef">${category.field}</label>
            <input id="utilityRef" class="input" type="text" placeholder="${category.hint}">
          </div>
          <button class="secondary-btn" data-action="fetch-bill">Fetch bill</button>
          ${appState.fetchedBill ? `
            <div class="merchant-card">
              <div class="row space-between">
                <span class="muted">Account</span>
                <strong>${appState.fetchedBill.reference}</strong>
              </div>
              <div class="row space-between" style="margin-top:10px;">
                <span class="muted">Bill amount</span>
                <strong>${currency(appState.fetchedBill.amount)}</strong>
              </div>
              <div class="row space-between" style="margin-top:10px;">
                <span class="muted">Due</span>
                <strong>${appState.fetchedBill.dueDate}</strong>
              </div>
            </div>
          ` : ""}
        </div>
        <button class="cta ${appState.fetchedBill ? "" : "hidden"}" data-action="pay-bill">Pay bill</button>
      </div>
    `,
  });
}

function renderUtilitySuccess() {
  const category = appState.billCategories.find((item) => item.id === appState.selectedBillCategory) || appState.billCategories[0];
  return layout({
    title: "Bill paid",
    subtitle: `${category.label} payment completed successfully.`,
    nav: false,
    content: `
      <div class="success-card stack">
        <div class="success-ring">
          <div class="checkmark"></div>
        </div>
        <div>
          <h2 style="margin:0;">${currency(appState.fetchedBill?.amount || 0)} paid</h2>
          <p class="muted" style="margin:8px 0 0;">${category.label} bill settled for ${appState.fetchedBill?.reference || "your account"}.</p>
        </div>
        <button class="cta" data-nav="bills">Pay another bill</button>
      </div>
    `,
  });
}

function renderHistory() {
  return layout({
    title: "Transaction history",
    subtitle: "All recent activity across SmartPay.",
    showBack: true,
    content: renderTransactions(),
  });
}

function renderRewards() {
  return layout({
    title: "Rewards",
    subtitle: "Cashback and offers curated for you.",
    showBack: true,
    content: `
      <div class="stack">
        <section class="reward-card">
          <div class="hero-chip" style="background:rgba(255,255,255,0.16); color:#fff;">Cashback wallet</div>
          <div class="reward-points">TZS 6,500</div>
          <p style="margin:0; opacity:0.82;">Available rewards balance for your next eligible payment.</p>
        </section>
        <div class="list">
          ${appState.rewards.map((reward) => `
            <article class="list-item">
              <div class="icon-wrap">${icons.wallet}</div>
              <div class="list-copy">
                <h3>${reward.title}</h3>
                <p>${reward.reward}</p>
              </div>
            </article>
          `).join("")}
        </div>
      </div>
    `,
  });
}

function renderNotifications() {
  return layout({
    title: "Notifications",
    subtitle: "Stay updated on payments, rewards, and security.",
    showBack: true,
    content: `
      <div class="list">
        ${appState.notifications.map((item) => `
          <article class="list-item">
            <div class="icon-wrap">${icons.bell}</div>
            <div class="list-copy">
              <div class="row space-between">
                <h3>${item.title}</h3>
                ${item.unread ? `<span class="notification-dot"></span>` : ""}
              </div>
              <p>${item.body}</p>
              <p>${item.time}</p>
            </div>
          </article>
        `).join("")}
      </div>
    `,
  });
}

function renderProfile() {
  return layout({
    title: "Profile",
    subtitle: "Your SmartPay account and preferences.",
    content: `
      <div class="stack">
        <div class="form-card">
          <div class="profile-block">
            <div class="avatar" style="width:58px; height:58px;">${appState.user.name.slice(0, 1)}</div>
            <div>
              <h2 style="margin:0;">${appState.user.name}</h2>
              <p class="muted" style="margin:6px 0 0;">${appState.user.phone || "+255 700 000 000"}</p>
            </div>
          </div>
          <div class="chip-row" style="margin-top:16px;">
            <button class="tag" data-nav="rewards">View rewards</button>
            <button class="tag" data-nav="settings">Open settings</button>
          </div>
        </div>
        <div class="settings-list list">
          <button class="list-item" data-nav="settings">
            <div class="row">
              <div class="icon-wrap">${icons.profile}</div>
              <div class="list-copy">
                <h3>Profile & preferences</h3>
                <p>Manage your account details</p>
              </div>
            </div>
            <span class="muted">Open</span>
          </button>
          <button class="list-item" data-nav="rewards">
            <div class="row">
              <div class="icon-wrap">${icons.wallet}</div>
              <div class="list-copy">
                <h3>Rewards & cashback</h3>
                <p>See offers and loyalty value</p>
              </div>
            </div>
            <span class="muted">View</span>
          </button>
        </div>
      </div>
    `,
  });
}

function renderSettings() {
  return layout({
    title: "Settings",
    subtitle: "Profile, bank accounts, and security controls.",
    showBack: true,
    content: `
      <div class="list settings-list">
        <article class="list-item">
          <div class="row">
            <div class="icon-wrap">${icons.profile}</div>
            <div class="list-copy">
              <h3>Profile</h3>
              <p>${appState.user.name} • ${appState.user.phone || "Not added"}</p>
            </div>
          </div>
          <span class="muted">Editable</span>
        </article>
        <article class="list-item">
          <div class="row">
            <div class="icon-wrap">${icons.bank}</div>
            <div class="list-copy">
              <h3>Bank accounts</h3>
              <p>${appState.user.bank || "No bank linked"}</p>
            </div>
          </div>
          <span class="muted">Primary</span>
        </article>
        <button class="list-item" data-nav="security">
          <div class="row">
            <div class="icon-wrap">${icons.shield}</div>
            <div class="list-copy">
              <h3>Security</h3>
              <p>Change UPI PIN and biometric settings</p>
            </div>
          </div>
          <span class="muted">Open</span>
        </button>
        <button class="list-item" data-action="toggle-dark">
          <div class="row">
            <div class="icon-wrap">${icons.moon}</div>
            <div class="list-copy">
              <h3>Dark mode</h3>
              <p>Switch the app theme</p>
            </div>
          </div>
          <span class="pill-toggle ${appState.darkMode ? "active" : ""}"></span>
        </button>
      </div>
    `,
  });
}

function renderSecurity() {
  return layout({
    title: "Security",
    subtitle: "Manage UPI PIN and authentication options.",
    showBack: true,
    content: `
      <div class="stack">
        <div class="form-card stack">
          <div class="field">
            <label for="newPin">Change UPI PIN</label>
            <input id="newPin" class="input" type="password" inputmode="numeric" maxlength="4" placeholder="Enter new 4-digit PIN">
          </div>
          <button class="secondary-btn" data-action="update-pin">Update PIN</button>
        </div>
        <article class="list-item">
          <div class="row">
            <div class="icon-wrap">${icons.face}</div>
            <div class="list-copy">
              <h3>Biometric login</h3>
              <p>Use your fingerprint or face to unlock SmartPay</p>
            </div>
          </div>
          <button class="pill-toggle ${appState.biometricEnabled ? "active" : ""}" data-action="toggle-biometric" aria-label="Toggle biometric login"></button>
        </article>
        <article class="list-item">
          <div class="row">
            <div class="icon-wrap">${icons.bell}</div>
            <div class="list-copy">
              <h3>Payment alerts</h3>
              <p>Receive notifications for account activity</p>
            </div>
          </div>
          <button class="pill-toggle ${appState.notificationsEnabled ? "active" : ""}" data-action="toggle-alerts" aria-label="Toggle payment alerts"></button>
        </article>
      </div>
    `,
  });
}

function bindEvents() {
  document.querySelectorAll("[data-action]").forEach((element) => {
    element.addEventListener("click", handleAction);
  });

  document.querySelectorAll("[data-nav]").forEach((element) => {
    element.addEventListener("click", () => setScreen(element.dataset.nav));
  });

  document.querySelectorAll("[data-merchant]").forEach((element) => {
    element.addEventListener("click", () => {
      appState.selectedMerchant = appState.merchants.find((merchant) => merchant.id === element.dataset.merchant) || appState.merchants[0];
      setScreen("amountEntry");
    });
  });

  document.querySelectorAll("[data-bill-category]").forEach((element) => {
    element.addEventListener("click", () => {
      appState.selectedBillCategory = element.dataset.billCategory;
      appState.fetchedBill = null;
      setScreen("utilityForm");
    });
  });
}

function handleAction(event) {
  const action = event.currentTarget.dataset.action;

  switch (action) {
    case "start-onboarding":
      setScreen("mobile");
      break;
    case "biometric-login":
      setScreen("home");
      break;
    case "submit-mobile":
      submitMobile();
      break;
    case "submit-otp":
      submitOtp();
      break;
    case "link-bank":
      submitBankLink();
      break;
    case "back":
      goBack();
      break;
    case "simulate-scan":
      appState.selectedMerchant = appState.merchants[Math.floor(Math.random() * appState.merchants.length)];
      setScreen("amountEntry");
      break;
    case "fake-qr":
      appState.selectedMerchant = appState.merchants[1];
      setScreen("amountEntry");
      break;
    case "confirm-amount":
      confirmAmount();
      break;
    case "make-payment":
      makePayment();
      break;
    case "fetch-bill":
      fetchBill();
      break;
    case "pay-bill":
      payBill();
      break;
    case "contact-payment":
      appState.selectedMerchant = { id: "contact", name: "Amina Yusuf", upiId: "amina@smartpay" };
      setScreen("amountEntry");
      break;
    case "bank-transfer":
      appState.selectedMerchant = { id: "banktransfer", name: "Bank Transfer", upiId: "transfer@smartpay" };
      setScreen("amountEntry");
      break;
    case "toggle-dark":
      appState.darkMode = !appState.darkMode;
      renderApp();
      break;
    case "update-pin":
      updatePin();
      break;
    case "toggle-biometric":
      appState.biometricEnabled = !appState.biometricEnabled;
      renderApp();
      break;
    case "toggle-alerts":
      appState.notificationsEnabled = !appState.notificationsEnabled;
      renderApp();
      break;
    case "request-balance-visibility":
      openAuthModal("balance");
      break;
    case "hide-balance":
      appState.balanceVisible = false;
      renderApp();
      break;
    case "submit-auth":
      submitAuth();
      break;
    case "cancel-auth":
      appState.authRequest = null;
      renderApp();
      break;
    default:
      break;
  }
}

function openAuthModal(type) {
  appState.authRequest = { type };
  renderApp();
}

function submitAuth() {
  const pin = document.getElementById("authUpiPin")?.value.trim() || "";
  if (pin !== appState.user.upiPin) {
    window.alert("Incorrect UPI PIN.");
    return;
  }

  const authType = appState.authRequest?.type;
  appState.authRequest = null;

  if (authType === "balance") {
    appState.balanceVisible = true;
    renderApp();
    return;
  }

  if (authType === "payment") {
    finalizePayment();
    return;
  }

  if (authType === "bill") {
    finalizeBillPayment();
  }
}

function submitMobile() {
  const input = document.getElementById("mobileNumber");
  const digits = (input?.value || "").replace(/\D/g, "");
  if (digits.length < 10) {
    window.alert("Please enter a valid mobile number.");
    return;
  }

  appState.user.phone = input.value.trim();
  setScreen("otp");
}

function submitOtp() {
  const otp = document.getElementById("otpInput")?.value.trim();
  if (otp !== "123456") {
    window.alert("Use the demo OTP: 123456");
    return;
  }
  setScreen("bankLink");
}

function submitBankLink() {
  const bank = document.getElementById("bankSelect")?.value || "";
  const accountNumber = document.getElementById("accountNumber")?.value.trim() || "";
  const upiPin = document.getElementById("upiPin")?.value.trim() || "";
  if (!bank) {
    window.alert("Please select a bank.");
    return;
  }
  if (!/^\d{8,12}$/.test(accountNumber)) {
    window.alert("Enter a valid 8 to 12 digit account number.");
    return;
  }
  if (!/^\d{4}$/.test(upiPin)) {
    window.alert("Set a 4-digit UPI PIN.");
    return;
  }

  appState.user.bank = bank;
  appState.user.accountNumber = accountNumber;
  appState.user.upiPin = upiPin;
  setScreen("home");
}

function confirmAmount() {
  const amount = document.getElementById("paymentAmount")?.value || "";
  if (Number(amount) <= 0) {
    window.alert("Please enter a valid amount.");
    return;
  }
  appState.pendingAmount = amount;
  setScreen("paymentConfirm");
}

function makePayment() {
  const amount = Number(appState.pendingAmount || 0);
  if (amount <= 0) {
    window.alert("Payment amount is invalid.");
    return;
  }

  openAuthModal("payment");
}

function finalizePayment() {
  const amount = Number(appState.pendingAmount || 0);
  if (amount <= 0) {
    window.alert("Payment amount is invalid.");
    return;
  }

  appState.user.balance -= amount;
  appState.transactions.unshift({
    id: Date.now(),
    title: appState.selectedMerchant?.name || "New Payment",
    subtitle: "Just now",
    amount: -amount,
    type: "debit",
    icon: appState.selectedMerchant?.id === "contact" ? "contact" : "shop",
  });

  setScreen("paymentSuccess");
}

function fetchBill() {
  const ref = document.getElementById("utilityRef")?.value.trim() || "";
  if (ref.length < 6) {
    window.alert("Please enter a valid reference number.");
    return;
  }

  appState.fetchedBill = {
    reference: ref,
    amount: Math.floor(Math.random() * 25000) + 5000,
    dueDate: "24 Apr 2026",
  };
  renderApp();
}

function payBill() {
  if (!appState.fetchedBill) {
    window.alert("Fetch a bill first.");
    return;
  }

  openAuthModal("bill");
}

function finalizeBillPayment() {
  if (!appState.fetchedBill) {
    window.alert("Fetch a bill first.");
    return;
  }

  appState.user.balance -= appState.fetchedBill.amount;
  appState.transactions.unshift({
    id: Date.now(),
    title: `${(appState.billCategories.find((item) => item.id === appState.selectedBillCategory) || {}).label || "Bill"} Payment`,
    subtitle: "Just now",
    amount: -appState.fetchedBill.amount,
    type: "debit",
    icon: "bill",
  });
  setScreen("utilitySuccess");
}

function updatePin() {
  const newPin = document.getElementById("newPin")?.value.trim() || "";
  if (!/^\d{4}$/.test(newPin)) {
    window.alert("Enter a valid 4-digit PIN.");
    return;
  }

  appState.user.upiPin = newPin;
  window.alert("UPI PIN updated successfully.");
  setScreen("settings");
}

renderApp();
