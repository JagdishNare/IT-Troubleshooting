// IT troubleshooting guides
const troubleshooting = [
  {
    id: "wifi-not-connecting",
    category: "Network",
    title: "Wi-Fi not connecting",
    symptoms: [
      "Laptop shows 'No internet, secured'",
      "Wi-Fi icon has an exclamation mark",
      "Pages won't load even though connected"
    ],
    steps: [
      "Toggle Wi-Fi off and on from the system tray.",
      "Forget the network, then reconnect using your company password.",
      "Restart the laptop.",
      "If on a guest or hotel network, open a browser to trigger the login page.",
      "Try a different network (e.g. phone hotspot) to isolate the issue."
    ],
    tip: "If only your machine has this problem on the office Wi-Fi, the issue is likely your device. If multiple people are affected, contact IT."
  },
  {
    id: "vpn-disconnect",
    category: "Network",
    title: "VPN keeps disconnecting",
    symptoms: [
      "VPN drops every few minutes",
      "Can't access internal sites or shared drives"
    ],
    steps: [
      "Check your internet connection without the VPN first.",
      "Quit the VPN client fully and reopen it.",
      "Switch to a different VPN gateway if your client offers one.",
      "Update the VPN client to the latest version.",
      "Restart your machine and reconnect."
    ],
    tip: "Avoid running personal VPNs and the corporate VPN at the same time — they conflict."
  },
  {
    id: "slow-computer",
    category: "Performance",
    title: "Computer is running slow",
    symptoms: [
      "Apps take a long time to open",
      "Fan is loud / device is hot",
      "Typing feels laggy"
    ],
    steps: [
      "Save your work and restart — most slowdowns clear up.",
      "Close browser tabs you aren't using (each tab eats memory).",
      "Open Task Manager (Ctrl+Shift+Esc) or Activity Monitor and look for processes using >80% CPU or RAM.",
      "Check available disk space — keep at least 10% free.",
      "Install pending OS and app updates."
    ],
    tip: "If your laptop is more than 4 years old and slow even after a clean restart, request a hardware review from IT."
  },
  {
    id: "password-reset",
    category: "Accounts",
    title: "Forgot password / locked out",
    symptoms: [
      "'Incorrect password' even when you're sure it's right",
      "Account temporarily locked message"
    ],
    steps: [
      "Wait 15 minutes — most lockouts clear automatically.",
      "Use the self-service password reset portal (sso.company.com/reset).",
      "Have your MFA device (phone) ready before starting.",
      "If you no longer have access to your MFA device, contact IT in person with photo ID."
    ],
    tip: "Never share your password — IT will never ask for it, even during a real support call."
  },
  {
    id: "ad-password-reset",
    category: "Accounts",
    title: "Reset domain / AD password (Self-Service Portal)",
    symptoms: [
      "Need to reset your domain (Active Directory) password",
      "Password expired notification at login",
      "Want to change your password without calling IT"
    ],
    steps: [
      "Step 1 — Access the Self-Service Portal: Open your web browser and go to https://adss.bigtree.biz, then click 'Reset Password' on the home page.",
      "Step 2 — Enter your User Information: Enter your Domain User Name in firstName.lastName format, all lowercase (e.g. John Doe → john.doe).",
      "Enter the captcha security characters shown on screen and click Continue.",
      "Follow the on-screen prompts to verify your identity (security questions / OTP).",
      "Set your new password following the password policy (14+ characters, mix of cases, numbers, and symbols)."
    ],
    tip: "Bookmark https://adss.bigtree.biz so you can find it quickly next time. If the portal doesn't recognize your username, contact the Help Desk on ext. 5000."
  },
  {
    id: "email-not-sending",
    category: "Email",
    title: "Email won't send or receive",
    symptoms: [
      "Mail stuck in Outbox",
      "Outlook shows 'Disconnected'",
      "Bounced delivery errors"
    ],
    steps: [
      "Check your internet connection.",
      "Quit and reopen your mail client.",
      "Verify the recipient's address is spelled correctly.",
      "If the message has a large attachment (>25 MB), upload to shared drive and send a link instead.",
      "Send a test email to yourself to confirm sending works."
    ],
    tip: "Bounce-back messages contain the actual error — read them before contacting IT."
  },
  {
    id: "printer-not-printing",
    category: "Hardware",
    title: "Printer not working",
    symptoms: [
      "Job stuck in queue",
      "Printer offline",
      "Pages come out blank or smeared"
    ],
    steps: [
      "Check the printer is on and has paper / toner.",
      "Clear the print queue and resend the job.",
      "Restart the printer (power cycle for 30 seconds).",
      "Remove and re-add the printer from your system settings.",
      "Try printing a test page directly from the printer's control panel."
    ],
    tip: "If multiple people can't print, the printer itself is likely the problem — log a ticket rather than each person troubleshooting separately."
  },
  {
    id: "external-monitor",
    category: "Hardware",
    title: "External monitor not detected",
    symptoms: [
      "Second screen shows 'No signal'",
      "Display flickers or has wrong resolution"
    ],
    steps: [
      "Unplug the cable from both ends and reconnect firmly.",
      "Try a different cable or port (HDMI vs USB-C/DisplayPort).",
      "Press Win+P (Windows) or use Display preferences (Mac) to detect displays.",
      "Restart the laptop with the monitor connected.",
      "Update your graphics driver."
    ],
    tip: "If using a docking station, unplug it for 30 seconds and reconnect — docks often need a reset."
  },
  {
    id: "software-install",
    category: "Software",
    title: "Need to install software",
    symptoms: [
      "App not available in self-service portal",
      "Installation blocked by admin rights"
    ],
    steps: [
      "Check the Company Self-Service / Software Center first — most approved apps are there.",
      "If not listed, submit a software request ticket with business justification.",
      "Do not download installers from random websites; only use official vendor pages or the self-service portal.",
      "Allow up to 2 business days for review of new software requests."
    ],
    tip: "Installing unapproved software is a policy violation, even if it 'just helps you do your job faster'. Request it properly."
  },
  {
    id: "phishing",
    category: "Security",
    title: "Suspicious email / possible phishing",
    symptoms: [
      "Unexpected attachment or link",
      "Urgent or threatening tone",
      "Sender domain looks slightly off"
    ],
    steps: [
      "Do NOT click links or open attachments.",
      "Do NOT reply, even to ask if it's real.",
      "Use the 'Report Phishing' button in your email client.",
      "If no button is available, forward the email as an attachment to security@bookmyshow.com.",
      "Delete the email after reporting."
    ],
    tip: "If you already clicked a link or entered credentials, disconnect from the network and call IT immediately. Speed matters."
  },
  {
    id: "lost-device",
    category: "Security",
    title: "Lost or stolen device",
    symptoms: [
      "Company laptop, phone, or YubiKey missing"
    ],
    steps: [
      "Report immediately to IT and your manager — don't wait until you've searched everywhere.",
      "Provide last known location, time, and circumstances.",
      "Change your password from another trusted device.",
      "IT will remote-wipe the device if it's a managed laptop or phone.",
      "File a police report if you suspect theft."
    ],
    tip: "Reporting a lost device is never punished. Hiding it can cause a data-breach incident — please be upfront."
  }
];

// IT policies
const policies = [
  {
    id: "acceptable-use",
    title: "Acceptable Use Policy",
    summary:
      "How company devices, accounts, and networks may be used.",
    body: `
      <h4>Permitted use</h4>
      <ul>
        <li>Company devices are primarily for work purposes.</li>
        <li>Limited personal use is allowed if it doesn't interfere with work, consume excessive resources, or violate other policies.</li>
      </ul>
      <h4>Prohibited</h4>
      <ul>
        <li>Accessing illegal, offensive, or discriminatory content.</li>
        <li>Storing personal media libraries on company devices.</li>
        <li>Using company resources to run a personal business.</li>
        <li>Disabling security software or modifying system configurations.</li>
      </ul>
      <h4>Monitoring</h4>
      <p>Company devices and traffic may be logged and audited. You should have no expectation of privacy when using company-owned equipment.</p>
    `
  },
  {
    id: "password-policy",
    title: "Password & Authentication Policy",
    summary: "Password requirements and MFA usage.",
    body: `
      <h4>Requirements</h4>
      <ul>
        <li>Minimum 14 characters.</li>
        <li>Mix of upper, lower, numbers, and symbols (or passphrase of 4+ random words).</li>
        <li>No reuse of your last 10 passwords.</li>
        <li>No reusing passwords from other sites.</li>
      </ul>
      <h4>Multi-factor authentication</h4>
      <ul>
        <li>MFA is required on all corporate accounts.</li>
        <li>Approved methods: authenticator app, hardware token (YubiKey). SMS is not approved.</li>
        <li>Never approve a push notification you didn't initiate — report it instead.</li>
      </ul>
      <p class="tip"><strong>Tip:</strong> Use the company-approved password manager. Don't store passwords in browsers, sticky notes, or text files.</p>
    `
  },
  {
    id: "data-classification",
    title: "Data Classification & Handling",
    summary: "How to label and protect data based on sensitivity.",
    body: `
      <h4>Classification tiers</h4>
      <ul>
        <li><strong>Public</strong> — marketing materials, published docs.</li>
        <li><strong>Internal</strong> — most day-to-day work.</li>
        <li><strong>Confidential</strong> — financials, customer data, contracts.</li>
        <li><strong>Restricted</strong> — credentials, PII, source code for sensitive systems.</li>
      </ul>
      <h4>Handling rules</h4>
      <ul>
        <li>Confidential and Restricted data must stay on approved systems — no personal cloud storage or email.</li>
        <li>Encrypt files before sharing externally; share via the secure file-transfer portal.</li>
        <li>Print only when necessary; shred when discarding.</li>
      </ul>
    `
  },
  {
    id: "remote-work",
    title: "Remote Work & BYOD",
    summary: "Working from home or personal devices.",
    body: `
      <h4>Remote work</h4>
      <ul>
        <li>Always connect through the corporate VPN when handling internal or confidential data.</li>
        <li>Use a private, password-protected Wi-Fi network. Public Wi-Fi only with VPN active.</li>
        <li>Lock your screen when stepping away, even at home.</li>
      </ul>
      <h4>Bring Your Own Device (BYOD)</h4>
      <ul>
        <li>Personal devices may access email and approved SaaS apps only after enrollment in MDM.</li>
        <li>You cannot store Confidential or Restricted data locally on a personal device.</li>
        <li>The company may remote-wipe company data from a BYOD device when you leave or if it's lost.</li>
      </ul>
    `
  },
  {
    id: "incident-reporting",
    title: "Security Incident Reporting",
    summary: "What counts as an incident and how to report it.",
    body: `
      <h4>What to report</h4>
      <ul>
        <li>Lost or stolen devices.</li>
        <li>Suspected phishing, malware, or unauthorized access.</li>
        <li>Accidentally sharing confidential data with the wrong recipient.</li>
        <li>Unusual account activity (logins from unfamiliar locations, MFA prompts you didn't initiate).</li>
      </ul>
      <h4>How to report</h4>
      <ol>
        <li>Call the IT helpdesk for anything urgent: ext. 5000.</li>
        <li>For non-urgent incidents, email security@company.com.</li>
        <li>Include: what happened, when, what data/system is affected, and what you've done so far.</li>
      </ol>
      <p class="tip"><strong>No-blame rule:</strong> Reporting a mistake quickly is always treated more favorably than hiding it.</p>
    `
  },
  {
    id: "software-policy",
    title: "Software Installation Policy",
    summary: "Approved sources and the request process.",
    body: `
      <h4>Approved software</h4>
      <ul>
        <li>Use the Company Self-Service portal for one-click installs.</li>
        <li>Browser extensions must be reviewed before install — they have broad data access.</li>
      </ul>
      <h4>Requesting new software</h4>
      <ol>
        <li>Search the self-service catalog first.</li>
        <li>If not available, submit a request with: name, vendor, purpose, and whether it handles confidential data.</li>
        <li>IT reviews for security, license, and compatibility (typically 2 business days).</li>
      </ol>
      <h4>AI tools</h4>
      <p>Generative AI tools require approval. Never paste Confidential or Restricted data into unapproved AI services.</p>
    `
  },
  {
    id: "email-policy",
    title: "Email & Communication Policy",
    summary: "Using corporate email responsibly.",
    body: `
      <h4>Use company email for</h4>
      <ul>
        <li>Business communication and account signups for work tools only.</li>
      </ul>
      <h4>Do not use company email for</h4>
      <ul>
        <li>Personal subscriptions, online shopping, or social media accounts.</li>
        <li>Forwarding company information to personal accounts.</li>
      </ul>
      <h4>External communications</h4>
      <ul>
        <li>Verify the recipient before sending Confidential data.</li>
        <li>Use BCC for mass external sends to protect recipient privacy.</li>
        <li>Add a confidentiality footer to sensitive threads.</li>
      </ul>
    `
  },
  {
    id: "offboarding",
    title: "Departure & Asset Return",
    summary: "What happens to your access and devices when you leave.",
    body: `
      <h4>Before your last day</h4>
      <ul>
        <li>Hand off ownership of shared files, calendars, and shared mailboxes to your manager.</li>
        <li>Remove personal files from company devices (don't delete work artifacts).</li>
        <li>Return company assets: laptop, phone, YubiKey, badge, and any accessories.</li>
      </ul>
      <h4>Access</h4>
      <ul>
        <li>All accounts are disabled at end of your last working day.</li>
        <li>Email is forwarded to your manager for 30 days, then deleted.</li>
        <li>You remain bound by confidentiality and IP terms after leaving.</li>
      </ul>
    `
  }
];
