(function () {
  "use strict";
  var CFG = window.TOUR_CONFIG;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- very wide waves (no hard edges on big screens) ---------- */
  (function buildWaves() {
    var ys = { w1: 310, w2: 330, w3: 350 };
    Object.keys(ys).forEach(function (cls) {
      var y = ys[cls];
      var d = "M -2100 " + y + " Q -2000 " + (y - 10) + " -1900 " + y;
      for (var x = -1700; x <= 2900; x += 200) d += " T " + x + " " + y;
      d += " L 2900 500 L -2100 500 Z";
      var p = document.querySelector("." + cls);
      if (p) p.setAttribute("d", d);
    });
  })();

  /* ---------- storage helpers ---------- */
  function sget(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function sset(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  /* ---------- i18n ---------- */
  var T = {
    bn: {
      brand: "উন্মত্ত ৬৩", eyebrow: "CSE ৬৩তম ব্যাচ · লিডিং ইউনিভার্সিটি", title: "উন্মত্ত ৬৩",
      tagline: "স্বপ্নের খোঁজে ‘সীমানাহীন’", route: "কক্সবাজার ✦ সেন্ট মার্টিন · ১২–১৮ ডিসেম্বর", cta: "এখনই প্রি-রেজিস্ট্রেশন করুন",
      cdTitle: "প্রি-রেজিস্ট্রেশন শেষ হতে বাকি", d: "দিন", h: "ঘণ্টা", m: "মিনিট", s: "সেকেন্ড",
      i1t: "কোথায়", i1p: "কক্সবাজার সমুদ্রসৈকত আর সেন্ট মার্টিন দ্বীপ।",
      i2t: "কখন", i2p: "১২ ডিসেম্বর (রাত) থেকে ১৮ ডিসেম্বর (সকাল)। সম্ভাব্য শিডিউল নিচে দেখুন।",
      i3t: "যাচাই", i3p: "প্রি-রেজিস্ট্রেশন শুধু আগ্রহ জানানোর জন্য। অভিভাবকের সাথে ফোনে যাচাই করা হবে।",
      formTitle: "প্রি-রেজিস্ট্রেশন",
      formNote: "এটি শুধু প্রি-রেজিস্ট্রেশন। প্রথম ধাপের কনফার্মেশন ফি জমা দেওয়ার পরই আপনার সিট নিশ্চিত হবে। যাচাইয়ের জন্য আমরা আপনার অভিভাবককে কল করতে পারি।",
      st1: "আপনি", st2: "যোগাযোগ", st3: "অভিভাবক",
      fName: "পূর্ণ নাম (আইডি কার্ড অনুযায়ী)", fTshirt: "টি-শার্টের সাইজ", fId: "স্টুডেন্ট আইডি", fSection: "সেকশন",
      fMobile: "আপনার মোবাইল নম্বর", fWa: "এই নম্বরে হোয়াটসঅ্যাপ আছে", fGender: "জেন্ডার", gM: "ছেলে", gF: "মেয়ে",
      fGName: "অভিভাবকের নাম", fGRel: "সম্পর্ক", select: "নির্বাচন করুন", rF: "বাবা", rM: "মা", rB: "ভাই", rS: "বোন",
      fGMobile: "অভিভাবকের মোবাইল (যাচাইয়ের জন্য কল করা হবে)",
      fConsent: "আমি আমার অভিভাবককে এই ট্যুর সম্পর্কে জানিয়েছি এবং যাচাইয়ের জন্য তার নম্বর ব্যবহারে সম্মত।",
      back: "পিছনে", next: "পরের ধাপ", submit: "সাবমিট করুন",
      okTitle: "রেজিস্ট্রেশন পাওয়া গেছে!", okText: "আপনার রেজিস্ট্রেশন সফলভাবে সম্পন্ন হয়েছে। সব আপডেট ব্যাচের গ্রুপে জানানো হবে।",
      cTitle: "সাহায্য লাগবে?", footer: "CSE ৬৩তম ব্যাচ · লিডিং ইউনিভার্সিটি, সিলেট",
      dl: "শেষ সময়: ", closedTitle: "রেজিস্ট্রেশন বন্ধ হয়ে গেছে", closedMsg: "রেজিস্ট্রেশনের সময় শেষ। প্রয়োজনে যোগাযোগ করুন।",
      eReq: "এই ঘরটি পূরণ করুন", eName: "পূর্ণ নাম লিখুন (কমপক্ষে ৩ অক্ষর)", eId: "সঠিক ১৬ ডিজিটের স্টুডেন্ট আইডি দিন",
      eMob: "সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (01XXXXXXXXX)", eSame: "অভিভাবকের নম্বর আপনার নিজের নম্বর থেকে আলাদা হতে হবে", eConsent: "এগিয়ে যেতে সম্মতি দিন",
      sending: "পাঠানো হচ্ছে…",
      errDup: "এই আইডি দিয়ে আগেই রেজিস্ট্রেশন হয়েছে। আপনি যদি এইমাত্র সাবমিট করে থাকেন, তাহলে আপনার রেজিস্ট্রেশন সম্পন্ন।",
      errClosed: "রেজিস্ট্রেশন বন্ধ হয়ে গেছে।",
      errRate: "অনেকবার চেষ্টা হয়েছে, কিছুক্ষণ পর আবার চেষ্টা করুন।", errNet: "সংযোগে সমস্যা হয়েছে, আবার চেষ্টা করুন।", errGen: "কিছু একটা ভুল হয়েছে, আবার চেষ্টা করুন।",
      contactLine: "যোগাযোগ: ",
      scTitle: "সম্ভাব্য ট্যুর শিডিউল",
      sc1d: "১২ ডিসেম্বর (রাত)", sc1t: "সিলেট থেকে যাত্রা শুরু।",
      sc2d: "১৩ ডিসেম্বর", sc2t: "কক্সবাজারে পৌঁছানো এবং এক রাত অবস্থান (শিপ ধরার সুবিধার জন্য)।",
      sc3d: "১৪ ডিসেম্বর (ভোর)", sc3t: "শিপে সেন্ট মার্টিনের উদ্দেশ্যে যাত্রা। ১৪ ও ১৫ ডিসেম্বর সেন্ট মার্টিনে রাত্রিযাপন।",
      sc4d: "১৬ ডিসেম্বর (বিকেল)", sc4t: "ফিরতি শিপে সেন্ট মার্টিন থেকে কক্সবাজারে আগমন এবং কক্সবাজারে রাত্রিযাপন।",
      sc5d: "১৭ ডিসেম্বর (বিকেল/সন্ধ্যা)", sc5t: "কক্সবাজার থেকে সিলেটের উদ্দেশ্যে ফিরতি যাত্রা।",
      sc6d: "১৮ ডিসেম্বর (সকাল)", sc6t: "সিলেটে পৌঁছানো।",
      scNote: "আমরা আমাদের ট্যুরের জন্য স্পনসর খুঁজছি। ভালো স্পনসর ব্যবস্থা হলে ট্যুরের মোট ফি আরও কমতে পারে। সম্পূর্ণ বিষয়টি আমাদের স্পনসর এবং ইউনিভার্সিটি ফান্ডিং-এর ওপর নির্ভর করছে। চূড়ান্ত ফি পরে জানানো হবে।",
      feeTitle: "Fees & Payment Deadlines",
      feeTotal: "Total fee per person (approx.)",
      feeAmt: "BDT 10,000*",
      p1t: "Pre-registration",
      p1d: "18 Oct – 25 Oct",
      p1x: "Fill up the online form.",
      p2t: "1st Installment (Confirmation Fee)",
      p2a: "BDT 5,000",
      p2d: "25 Oct – 2 Nov",
      p2x: "Pay to confirm your seat, transport & ship booking.",
      p3t: "2nd Installment (Remaining Fee)",
      p3a: "BDT 5,000",
      p3d: "By 5 December",
      p3x: "Pay the remaining amount.",
      femTitle: "For Female Students",
      femText: "Female students may bring one verified guardian. An extra fee will be applicable (Amount will be announced later).",
      fBring: "Will a guardian travel with you?",
      yes: "হ্যাঁ", no: "না",
      cdOpenTitle: "রেজিস্ট্রেশন শুরু হতে বাকি", op: "শুরু: ",
      notOpenTitle: "রেজিস্ট্রেশন এখনো শুরু হয়নি", notOpenMsg: "কাউন্টডাউন শেষ হলে এই পাতাতেই ফর্ম খুলে যাবে।", errNotOpen: "রেজিস্ট্রেশন এখনো শুরু হয়নি।"
    },
    en: {
      brand: "Unmotto 63", eyebrow: "CSE 63rd Batch · Leading University", title: "Unmotto 63",
      tagline: "Searching for dreams, ‘Boundless’", route: "Cox's Bazar ✦ Saint Martin · 12–18 December", cta: "Pre-register now",
      cdTitle: "Pre-registration closes in", d: "Days", h: "Hours", m: "Min", s: "Sec",
      i1t: "Where", i1p: "Cox's Bazar sea beach and Saint Martin island.",
      i2t: "When", i2p: "Night of 12 December to morning of 18 December. See the tentative schedule below.",
      i3t: "Verification", i3p: "Pre-registration only shows interest. We will verify by calling your guardian.",
      formTitle: "Pre-registration",
      formNote: "This is only a pre-registration. Your seat is confirmed only after the 1st installment (confirmation fee) is paid. We may call your guardian to verify.",
      st1: "You", st2: "Contact", st3: "Guardian",
      fName: "Full name (as on ID card)", fTshirt: "T-shirt size", fId: "Student ID", fSection: "Section",
      fMobile: "Your mobile number", fWa: "This number is on WhatsApp", fGender: "Gender", gM: "Male", gF: "Female",
      fGName: "Guardian's name", fGRel: "Relation", select: "Select", rF: "Father", rM: "Mother", rB: "Brother", rS: "Sister",
      fGMobile: "Guardian's mobile (we will call to verify)",
      fConsent: "I have informed my guardian about this tour and agree to the use of their number for verification.",
      back: "Back", next: "Next", submit: "Submit",
      okTitle: "Registration received!", okText: "Your registration has been successfully completed. All updates will be shared in the batch group.",
      cTitle: "Need help?", footer: "CSE 63rd Batch · Leading University, Sylhet",
      dl: "Deadline: ", closedTitle: "Registration is closed", closedMsg: "The registration period has ended. Please contact us if needed.",
      eReq: "Please fill this in", eName: "Enter your full name (at least 3 characters)", eId: "Enter a valid 16-digit student ID",
      eMob: "Enter a valid 11-digit mobile number (01XXXXXXXXX)", eSame: "Guardian's number must differ from your own", eConsent: "Please agree to continue",
      sending: "Sending…",
      errDup: "This student ID is already registered. If you just submitted, you're all set.",
      errClosed: "Registration is closed.",
      errRate: "Too many attempts. Please try again in a while.", errNet: "Connection problem. Please try again.", errGen: "Something went wrong. Please try again.",
      contactLine: "Contact: ",
      scTitle: "Tentative tour schedule",
      sc1d: "12 December (night)", sc1t: "Departure from Sylhet.",
      sc2d: "13 December", sc2t: "Arrive in Cox's Bazar and stay one night (to catch the ship).",
      sc3d: "14 December (early morning)", sc3t: "Ship to Saint Martin. Overnight stays in Saint Martin on 14 and 15 December.",
      sc4d: "16 December (afternoon)", sc4t: "Return ship from Saint Martin to Cox's Bazar, then overnight stay in Cox's Bazar.",
      sc5d: "17 December (afternoon/evening)", sc5t: "Depart from Cox's Bazar for Sylhet.",
      sc6d: "18 December (morning)", sc6t: "Arrive in Sylhet.",
      scNote: "We are currently looking for sponsors for our tour. If we can manage good sponsors, the total fee may decrease further. The final amount depends entirely on our sponsors and university funding. The final amount will be announced later.",
      feeTitle: "Fees & Payment Deadlines",
      feeTotal: "Total fee per person (approx.)",
      feeAmt: "BDT 10,000*",
      p1t: "Pre-registration",
      p1d: "18 Oct – 25 Oct",
      p1x: "Fill up the online form.",
      p2t: "1st Installment (Confirmation Fee)",
      p2a: "BDT 5,000",
      p2d: "25 Oct – 2 Nov",
      p2x: "Pay to confirm your seat, transport & ship booking.",
      p3t: "2nd Installment (Remaining Fee)",
      p3a: "BDT 5,000",
      p3d: "By 5 December",
      p3x: "Pay the remaining amount.",
      femTitle: "For Female Students",
      femText: "Female students may bring one verified guardian. An extra fee will be applicable (Amount will be announced later).",
      fBring: "Will a guardian travel with you?",
      yes: "Yes", no: "No",
      cdOpenTitle: "Registration opens in", op: "Opens: ",
      notOpenTitle: "Registration has not started yet", notOpenMsg: "The form will open on this page when the countdown ends.", errNotOpen: "Registration has not started yet."
    }
  };
  var lang = sget("lang") === "en" ? "en" : "bn";
  function t(k) { return (T[lang] && T[lang][k]) || k; }

  function applyLang() {
    document.documentElement.lang = lang;
    $$("[data-i18n]").forEach(function (el) {
      var k = el.getAttribute("data-i18n");
      if (k === "cdTitle" && phase() === "before") k = "cdOpenTitle";
      if (k === "i2p" && CFG.tourDateText) { el.textContent = CFG.tourDateText; return; }
      el.textContent = t(k);
    });
    $("#langBtn").textContent = lang === "bn" ? "EN" : "বাং";
    renderDeadlineText();
    renderContacts();
    $$(".field.bad").forEach(function (f) { f.classList.remove("bad"); });
    $$(".err").forEach(function (e) { e.textContent = ""; });
  }

  var theme = sget("theme") || (window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  function applyTheme() {
    document.documentElement.setAttribute("data-theme", theme);
    $("#themeBtn").textContent = theme === "dark" ? "☀️" : "🌙";
  }
  $("#themeBtn").addEventListener("click", function () { theme = theme === "dark" ? "light" : "dark"; sset("theme", theme); applyTheme(); });
  $("#langBtn").addEventListener("click", function () { lang = lang === "bn" ? "en" : "bn"; sset("lang", lang); applyLang(); });

  var deadline = new Date(CFG.deadline).getTime();
  var opens = CFG.opens ? new Date(CFG.opens).getTime() : NaN;
  var closed = false, locked = false;
  function phase() {
    var n = Date.now();
    if (!isNaN(opens) && n < opens) return "before";
    if (!isNaN(deadline) && n >= deadline) return "closed";
    return "open";
  }
  function pad(n) { return n < 10 ? "0" + n : "" + n; }

  function renderDeadlineText() {
    var before = phase() === "before";
    var target = before ? opens : deadline;
    if (isNaN(target)) { $("#deadlineText").textContent = ""; return; }

    var d = new Date(target);

    if (lang === "bn") {
      var months = ["জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"];
      var dateStr = d.getDate();
      var monthStr = months[d.getMonth()];
      var yearStr = d.getFullYear();

      var bnDate = String(dateStr).replace(/\d/g, function(x) { return "০১২৩৪৫৬৭৮৯"[x]; });
      var bnYear = String(yearStr).replace(/\d/g, function(x) { return "০১২৩৪৫৬৭৮৯"[x]; });

      var hours = d.getHours();
      var minutes = d.getMinutes();
      var ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12;
      var strMinutes = minutes < 10 ? '0' + minutes : minutes;

      var bnHours = String(hours).replace(/\d/g, function(x) { return "০১২৩৪৫৬৭৮৯"[x]; });
      var bnMinutes = String(strMinutes).replace(/\d/g, function(x) { return "০১২৩৪৫৬৭৮৯"[x]; });

      $("#deadlineText").textContent = t(before ? "op" : "dl") + bnDate + " " + monthStr + ", " + bnYear + " | " + bnHours + ":" + bnMinutes + " " + ampm;
    } else {
      var opts = { dateStyle: "long", timeStyle: "short", timeZone: "Asia/Dhaka" };
      var f;
      try { f = new Intl.DateTimeFormat("en-GB", opts); }
      catch (e) { f = new Intl.DateTimeFormat("en-GB", opts); }
      $("#deadlineText").textContent = t(before ? "op" : "dl") + f.format(d);
    }
  }

  function tick() {
    var ph = phase();
    if (ph === "before" && !locked) lockForm("before");
    if (ph === "closed" && !closed) { closed = true; lockForm("closed"); }
    var target = ph === "before" ? opens : deadline;
    if (isNaN(target)) return;
    var diff = target - Date.now();
    if (diff <= 0) { diff = 0; if (ph === "before") { location.reload(); return; } }
    var s = Math.floor(diff / 1000);
    $("#cdD").textContent = pad(Math.floor(s / 86400));
    $("#cdH").textContent = pad(Math.floor(s % 86400 / 3600));
    $("#cdM").textContent = pad(Math.floor(s % 3600 / 60));
    $("#cdS").textContent = pad(s % 60);
  }
  function lockForm(kind) {
    locked = true;
    $("#regForm").hidden = true;
    $(".steps").hidden = true; $(".bar").hidden = true;
    var box = $("#success");
    box.hidden = false;
    $(".tick", box).textContent = "⏳";
    $(".tick", box).style.background = "var(--muted)";
    $("h3", box).setAttribute("data-i18n", kind === "before" ? "notOpenTitle" : "closedTitle");
    $("p", box).setAttribute("data-i18n", kind === "before" ? "notOpenMsg" : "closedMsg");
    applyLang();
  }

  function renderContacts() {
    var el = $("#contactText");
    el.textContent = "";
    (CFG.contacts || []).forEach(function (c, i) {
      if (i) el.appendChild(document.createTextNode(" · "));
      var a = document.createElement("a");
      a.href = "tel:" + String(c.phone).replace(/[^\d+]/g, "");
      a.textContent = c.name + " (" + c.phone + ")";
      a.style.color = "var(--sun)"; a.style.fontWeight = "600";
      el.appendChild(a);
    });
    if (!(CFG.contacts || []).length) $("#contactBox").hidden = true;
  }

  (function () {
    var sel = $("select[name=section]");
    var o = document.createElement("option"); o.value = ""; o.setAttribute("data-i18n", "select"); sel.appendChild(o);
    (CFG.sections || []).forEach(function (s) { var x = document.createElement("option"); x.value = s; x.textContent = s; sel.appendChild(x); });
  })();
  (function () { var o = $("select[name=guardianRelation] option[value='']"); if (o) o.setAttribute("data-i18n", "select"); })();

  var form = $("#regForm");
  function normMobile(v) {
    v = String(v || "").replace(/[\s\-()]/g, "");
    if (v.indexOf("+880") === 0) v = "0" + v.slice(4);
    else if (v.indexOf("880") === 0) v = "0" + v.slice(3);
    return v;
  }
  function toEnDigits(s) {
    return String(s || "").replace(/[০-৯]/g, function (d) { return "০১২৩৪৫৬৭৮৯".indexOf(d); });
  }
  var rules = {
    name: function (v) { return v.trim().length >= 3 ? "" : "eName"; },
    studentId: function (v) { v = toEnDigits(v).trim(); return /^\d{16}$/.test(v) ? "" : "eId"; },
    section: function (v) { return v ? "" : "eReq"; },
    mobile: function (v) { return /^01[3-9]\d{8}$/.test(normMobile(toEnDigits(v))) ? "" : "eMob"; },
    gender: function (v) { return v ? "" : "eReq"; },
    tshirt: function (v) { return v ? "" : "eReq"; },
    bringGuardian: function (v) { return fieldVal("gender") !== "Female" || v ? "" : "eReq"; },
    guardianName: function (v) { return v.trim().length >= 3 ? "" : "eName"; },
    guardianRelation: function (v) { return v ? "" : "eReq"; },
    guardianMobile: function (v) {
      var g = normMobile(toEnDigits(v));
      if (!/^01[3-9]\d{8}$/.test(g)) return "eMob";
      if (g === normMobile(toEnDigits(form.mobile.value))) return "eSame";
      return "";
    }
  };
  function fieldVal(name) {
    if (name === "gender" || name === "bringGuardian" || name === "tshirt") { var r = form.querySelector("input[name=" + name + "]:checked"); return r ? r.value : ""; }
    return form[name].value;
  }
  function showErr(name, key) {
    var holder = form.querySelector("[name=" + name + "]").closest(".field");
    holder.classList.toggle("bad", !!key);
    var small = $(".err", holder);
    if (small) small.textContent = key ? t(key) : "";
  }
  function validateStep(n) {
    var names = {1: ["name", "studentId", "section", "tshirt"], 2: ["mobile", "gender", "bringGuardian"], 3: ["guardianName", "guardianRelation", "guardianMobile"]}[n];
    var ok = true, first = null;
    names.forEach(function (nm) {
      var key = rules[nm](fieldVal(nm));
      showErr(nm, key);
      if (key) { ok = false; if (!first) first = nm; }
    });
    if (n === 3) {
      var c = form.consent.checked;
      $("#consentErr").textContent = c ? "" : t("eConsent");
      if (!c) ok = false;
    }
    if (!ok && first) { var el = form.querySelector("[name=" + first + "]"); try { el.focus({ preventScroll: false }); } catch (e) {} }
    return ok;
  }
  form.addEventListener("input", function (e) {
    var nm = e.target.name;
    if (rules[nm]) { var key = rules[nm](fieldVal(nm)); if (!key) showErr(nm, ""); }
    if (nm === "consent" && form.consent.checked) $("#consentErr").textContent = "";
  });

  $$("input[name=gender]").forEach(function (r) {
    r.addEventListener("change", function () {
      var fem = fieldVal("gender") === "Female";
      $("#femBlock").hidden = !fem;
      if (!fem) { $$("input[name=bringGuardian]").forEach(function (x) { x.checked = false; }); showErr("bringGuardian", ""); }
    });
  });

  var step = 1, TOTAL = 3;
  function showStep(n) {
    step = n;
    $$("fieldset.step").forEach(function (f) { f.classList.toggle("active", +f.dataset.step === n); });
    $$("#steps li").forEach(function (li, i) { li.classList.toggle("on", i + 1 === n); li.classList.toggle("done", i + 1 < n); });
    $("#bar").style.width = (n / TOTAL * 100) + "%";
    $("#prevBtn").style.display = n === 1 ? "none" : "";
    $("#nextBtn").style.display = n === TOTAL ? "none" : "";
    $("#submitBtn").style.display = n === TOTAL ? "" : "none";
    $("#status").textContent = "";
  }
  $("#nextBtn").addEventListener("click", function () { if (validateStep(step)) showStep(step + 1); });
  $("#prevBtn").addEventListener("click", function () { if (step > 1) showStep(step - 1); });
  form.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && e.target.tagName !== "BUTTON") { e.preventDefault(); if (step < TOTAL) $("#nextBtn").click(); else form.requestSubmit(); }
  });

  var sending = false;
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (sending || closed) return;
    for (var i = 1; i <= TOTAL; i++) { if (!validateStep(i)) { showStep(i); return; } }
    sending = true;
    var btn = $("#submitBtn"), st = $("#status");
    btn.disabled = true; st.className = "status"; st.textContent = t("sending");
    var payload = {
      name: form.elements.name.value.trim().replace(/\s+/g, " "),
      studentId: toEnDigits(form.studentId.value).trim(),
      section: form.section.value,
      tshirt: fieldVal("tshirt"),
      mobile: normMobile(toEnDigits(form.mobile.value)),
      whatsappSame: form.whatsappSame.checked,
      gender: fieldVal("gender"),
      bringGuardian: fieldVal("gender") === "Female" ? fieldVal("bringGuardian") : "",
      guardianName: form.guardianName.value.trim().replace(/\s+/g, " "),
      guardianRelation: form.guardianRelation.value,
      guardianMobile: normMobile(toEnDigits(form.guardianMobile.value)),
      consent: form.consent.checked,
      website: form.website.value
    };
    var ctrl = typeof AbortController !== "undefined" ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 20000);
    fetch(CFG.endpoint, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload), signal: ctrl ? ctrl.signal : undefined
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (j) { return { status: r.status, body: j }; });
    }).then(function (res) {
      if (res.status === 200 && res.body.ok) return success();
      var map = { 409: "errDup", 410: "errClosed", 425: "errNotOpen", 429: "errRate" };
      st.className = "status bad"; st.textContent = t(map[res.status] || "errGen");
      if (res.status === 410) { closed = true; lockForm(); }
    }).catch(function () {
      st.className = "status bad"; st.textContent = t("errNet");
    }).then(function () { clearTimeout(timer); sending = false; btn.disabled = false; });
  });

  function success() {
    form.hidden = true; $(".steps").hidden = true; $(".bar").hidden = true;
    $(".form-card > .muted").hidden = true;
    $("#success").hidden = false;
    $("#success").scrollIntoView({ behavior: "smooth", block: "center" });
    confetti();
  }

  function confetti() {
    if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var cv = $("#confetti"), ctx = cv.getContext("2d");
    function size() { cv.width = innerWidth; cv.height = innerHeight; }
    size();
    var colors = ["#f26a21", "#ffb81f", "#0a74b8", "#0e2a47", "#ffffff", "#1f9d63"];
    var P = [];
    for (var i = 0; i < 160; i++) P.push({
      x: Math.random() * cv.width, y: -20 - Math.random() * cv.height * .6,
      w: 6 + Math.random() * 6, h: 8 + Math.random() * 8, c: colors[i % colors.length],
      vx: -1.5 + Math.random() * 3, vy: 2 + Math.random() * 4, r: Math.random() * 6, vr: -.2 + Math.random() * .4
    });
    var start = performance.now();
    (function frame(now) {
      ctx.clearRect(0, 0, cv.width, cv.height);
      P.forEach(function (p) {
        p.x += p.vx; p.y += p.vy; p.r += p.vr; p.vy += .03;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.restore();
      });
      if (now - start < 4200) requestAnimationFrame(frame); else ctx.clearRect(0, 0, cv.width, cv.height);
    })(start);
  }

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }); }, { threshold: .12 });
    $$(".reveal").forEach(function (el) { io.observe(el); });
  } else { $$(".reveal").forEach(function (el) { el.classList.add("in"); }); }

  $$("img").forEach(function (img) {
    function hide() { img.style.display = "none"; }
    img.addEventListener("error", hide);
    if (img.complete && img.naturalWidth === 0) hide();
  });

  applyTheme(); applyLang(); showStep(1); tick(); setInterval(tick, 1000);
})();