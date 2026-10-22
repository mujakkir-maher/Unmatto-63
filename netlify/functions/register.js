"use strict";

const MOBILE = /^01[3-9]\d{8}$/;
const GENDERS = ["Male", "Female"];
const SIZES = ["S", "M", "L", "XL", "XXL"];
const RELATIONS = ["Father", "Mother", "Sibling", "Other"];

const hits = new Map();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = parseInt(process.env.RATE_MAX || "40", 10);

function rateLimited(ip) {
  const now = Date.now();
  if (hits.size > 5000) hits.clear();
  const arr = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  arr.push(now);
  hits.set(ip, arr);
  return arr.length > MAX_HITS;
}

function reply(status, body) {
  return {
    statusCode: status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
    body: JSON.stringify(body),
  };
}

function clean(s, max) {
  return String(s == null ? "" : s)
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

function validate(b) {
  const idMin = parseInt(process.env.ID_MIN || "16", 10);
  const idMax = parseInt(process.env.ID_MAX || "16", 10);
  const sections = (process.env.SECTIONS || "").split(",").map((s) => s.trim()).filter(Boolean);

  const d = {
    name: clean(b.name, 80),
    studentId: clean(b.studentId, 24),
    section: clean(b.section, 20),
    tshirt: clean(b.tshirt, 4),
    mobile: clean(b.mobile, 14),
    whatsappSame: b.whatsappSame === true,
    gender: clean(b.gender, 10),
    bringGuardian: clean(b.bringGuardian, 3),
    guardianName: clean(b.guardianName, 80),
    guardianRelation: clean(b.guardianRelation, 10),
    guardianMobile: clean(b.guardianMobile, 14),
  };

  if (d.name.length < 3) return { error: "name" };
  if (!new RegExp("^\\d{" + idMin + "," + idMax + "}$").test(d.studentId)) return { error: "studentId" };
  if (process.env.ID_PREFIX && !d.studentId.startsWith(process.env.ID_PREFIX)) return { error: "studentId" };
  if (sections.length ? !sections.includes(d.section) : !/^[\w\- ]{1,20}$/.test(d.section)) return { error: "section" };
  if (!SIZES.includes(d.tshirt)) return { error: "tshirt" };
  if (!MOBILE.test(d.mobile)) return { error: "mobile" };
  if (!GENDERS.includes(d.gender)) return { error: "gender" };
  if (d.gender === "Female") { if (!["Yes", "No"].includes(d.bringGuardian)) return { error: "bringGuardian" }; }
  else d.bringGuardian = "";
  if (d.guardianName.length < 3) return { error: "guardianName" };
  if (!RELATIONS.includes(d.guardianRelation)) return { error: "guardianRelation" };
  if (!MOBILE.test(d.guardianMobile)) return { error: "guardianMobile" };
  if (d.guardianMobile === d.mobile) return { error: "guardianMobile" };
  if (b.consent !== true) return { error: "consent" };
  return { data: d };
}

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") return reply(405, { ok: false, error: "method" });

  const allowed = (process.env.ALLOWED_ORIGINS || "").split(",").map((s) => s.trim()).filter(Boolean);
  const origin = event.headers.origin || event.headers.Origin || "";
  if (allowed.length && origin && !allowed.includes(origin)) return reply(403, { ok: false, error: "origin" });

  if ((event.body || "").length > 4096) return reply(413, { ok: false, error: "size" });

  const ip =
    event.headers["x-nf-client-connection-ip"] ||
    (event.headers["x-forwarded-for"] || "").split(",")[0].trim() ||
    "unknown";
  if (rateLimited(ip)) return reply(429, { ok: false, error: "rate" });

  let body;
  try { body = JSON.parse(event.body || "{}"); } catch (e) { return reply(400, { ok: false, error: "json" }); }
  if (!body || typeof body !== "object") return reply(400, { ok: false, error: "json" });

  if (body.website) return reply(200, { ok: true });

  if (process.env.OPENS) {
    const op = new Date(process.env.OPENS).getTime();
    if (!isNaN(op) && Date.now() < op) return reply(425, { ok: false, error: "notopen" });
  }

  if (process.env.DEADLINE) {
    const dl = new Date(process.env.DEADLINE).getTime();
    if (!isNaN(dl) && Date.now() > dl) return reply(410, { ok: false, error: "closed" });
  }

  const v = validate(body);
  if (v.error) return reply(400, { ok: false, error: "invalid", field: v.error });

  const url = process.env.APPS_SCRIPT_URL;
  const secret = process.env.APPS_SCRIPT_SECRET;
  if (!url || !secret) {
    console.error("Missing APPS_SCRIPT_URL or APPS_SCRIPT_SECRET");
    return reply(500, { ok: false, error: "config" });
  }

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 9000);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(Object.assign({ secret }, v.data)),
      redirect: "follow",
      signal: ctrl.signal,
    });
    const text = await res.text();
    let out;
    try { out = JSON.parse(text); } catch (e) { out = null; }
    if (!out) { console.error("Apps Script returned non-JSON, status", res.status); return reply(502, { ok: false, error: "upstream" }); }
    if (out.ok) return reply(200, { ok: true });
    if (out.error === "duplicate") return reply(409, { ok: false, error: "duplicate" });
    console.error("Apps Script error:", out.error);
    return reply(502, { ok: false, error: "upstream" });
  } catch (e) {
    console.error("Forward failed:", e && e.name);
    return reply(502, { ok: false, error: "upstream" });
  } finally {
    clearTimeout(timer);
  }
};