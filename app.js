(() => {
"use strict";
const _0x1000 = 'https://t.me/toladubberprov1';
const $ = id => document.getElementById(id);
const v = $('v');
let _bl = '';
const blog = (m, cls) => {
const b = $('blogbody'), near = b.scrollHeight - b.scrollTop - b.clientHeight < 40, key = String(m).replace(/\d+/g, '#');
const t = new Date().toLocaleTimeString([], { hour12: false });
let d = key === _bl && b.lastChild && !cls ? b.lastChild : null;
if (!d) { d = document.createElement('div'); b.append(d); while (b.children.length > 300) b.firstChild.remove() }
_bl = key; d.innerHTML = ''; const s = document.createElement('span'); s.className = 't'; s.textContent = t + '  '; d.append(s, document.createTextNode(m)); if (cls) d.className = cls;
if (near || b.children.length < 3) b.scrollTop = b.scrollHeight;
};
const log = m => { $('log').textContent = m; if (m) blog(m, /^⚠/.test(m) ? 'w' : /^✓|^Done/.test(m) ? 'k' : '') };
$('blogclear').onclick = () => { $('blogbody').innerHTML = ''; _bl = ''; };
let curFile, segs = [], spoken = new Set(), dubbing = false, kmVoice = null;
let _idbP = null;
function _0x1396() {
if (_idbP) return _idbP;
return _idbP = new Promise((res, rej) => {
try {
const req = indexedDB.open('kd_persist_v1', 1);
req.onupgradeneeded = () => { if (!req.result.objectStoreNames.contains('kv')) req.result.createObjectStore('kv') };
req.onsuccess = () => res(req.result);
req.onerror = () => rej(req.error);
} catch (e) { rej(e) }
});
}
async function _0x13a7(k) {
try {
const db = await _0x1396();
return await new Promise((res, rej) => {
const r = db.transaction('kv', 'readonly').objectStore('kv').get(k);
r.onsuccess = () => res(r.result);
r.onerror = () => rej(r.error);
});
} catch (_) { return undefined }
}
async function _0x13b8(k, val) {
try {
const db = await _0x1396();
await new Promise((res, rej) => {
const tx = db.transaction('kv', 'readwrite');
tx.objectStore('kv').put(val, k);
tx.oncomplete = () => res();
tx.onerror = () => rej(tx.error);
});
} catch (_) { }
}
async function _0x13c9(k) {
try {
const db = await _0x1396();
await new Promise((res, rej) => {
const tx = db.transaction('kv', 'readwrite');
tx.objectStore('kv').delete(k);
tx.oncomplete = () => res();
tx.onerror = () => rej(tx.error);
});
} catch (_) { }
}
async function _0x13da() {
try {
const db = await _0x1396();
await new Promise((res, rej) => {
const tx = db.transaction('kv', 'readwrite'), st = tx.objectStore('kv'), req = st.openCursor();
req.onsuccess = e => {
const cur = e.target.result;
if (cur) { if (String(cur.key).startsWith('audio_')) cur.delete(); cur.continue() }
};
tx.oncomplete = () => res();
tx.onerror = () => rej(tx.error);
});
} catch (_) { }
}
async function _0x13eb() {
await _0x13da();
for (let i = 0; i < segs.length; i++) {
if (segs[i].audio) {
try {
const r = await fetch(segs[i].audio);
if (r.ok) {
const b = await r.blob();
if (b && b.size > 100) await _0x13b8('audio_' + i, b);
}
} catch (_) { }
}
}
}
const _0x13fc = arr => (arr || []).map(s => ({ t: s.t, e: s.e, text: s.text || '', km: s.km || '', g: s.g === 'f' ? 'f' : 'm', skip: !!s.skip, dur: s.dur || 0 }));
let _0x14fb = 'all';
try { const m = localStorage.getItem('kd_dubMode'); if (m === 'translate' || m === 'all') _0x14fb = m; } catch (_) { }
let _dubState = { status: 'idle', step: 0, pasted: '', listenChunkIdx: 0, listenSegs: [], segs: [], voiceSel: '', _0x14fb: 'all' };
async function _0x140d(patch) {
_dubState = Object.assign({}, _dubState, patch);
await _0x13b8('dubState', _dubState);
}
async function _0x141e(i, blob) {
if (!segs[i] || !blob) return;
segs[i].audio = URL.createObjectURL(blob);
await _0x13b8('audio_' + i, blob);
}
async function _0x142f() {
for (let i = 0; i < segs.length; i++) {
if (!segs[i].audio) {
const b = await _0x13a7('audio_' + i);
if (b instanceof Blob && b.size > 100) segs[i].audio = URL.createObjectURL(b);
}
}
}
function _0x14b7(opts) {
const o = opts || {}, wrap = $('goWrap'), go = $('go'), mb = $('goModeBtn'), mn = $('goMenu');
if ('hidden' in o) {
if (wrap) wrap.hidden = !!o.hidden;
if (go) go.hidden = !!o.hidden;
if (o.hidden && mn) mn.hidden = true;
}
if ('disabled' in o) {
if (go) go.disabled = !!o.disabled;
if (mb) mb.disabled = !!o.disabled;
if (o.disabled && mn) mn.hidden = true;
}
}
function _0x14c8() {
const lbl = $('goModeLbl'), go = $('go'), mn = $('goMenu');
if (lbl) lbl.textContent = _0x14fb === 'translate' ? 'Translate Only' : 'Full Dub';
if (go) go.textContent = _0x14fb === 'translate' ? '📝 Translate to Khmer' : '✨ Dub to Khmer';
if (mn) mn.querySelectorAll('[data-mode]').forEach(b => b.classList.toggle('on', b.dataset.mode === _0x14fb));
}
_0x14c8();
if ($('goModeBtn')) {
$('goModeBtn').onclick = e => {
e.stopPropagation();
if (!$('goMenu')) return;
$('goMenu').hidden = !$('goMenu').hidden;
};
}
if ($('goMenu')) {
$('goMenu').querySelectorAll('[data-mode]').forEach(btn => {
btn.onclick = e => {
e.stopPropagation();
_0x14fb = btn.dataset.mode === 'translate' ? 'translate' : 'all';
try { localStorage.setItem('kd_dubMode', _0x14fb); } catch (_) { }
_0x14c8();
$('goMenu').hidden = true;
};
});
}
document.addEventListener('click', e => {
if ($('goMenu') && !$('goMenu').hidden && $('goWrap') && !$('goWrap').contains(e.target)) $('goMenu').hidden = true;
});
$('drop').onclick = () => $('file').click();
$('drop').ondragover = e => { e.preventDefault(); $('drop').classList.add('over') }; $('drop').ondragleave = () => $('drop').classList.remove('over');
$('drop').ondrop = e => { e.preventDefault(); load(e.dataTransfer.files[0]) };
$('file').onchange = e => load(e.target.files[0]);
function load(f, isRestore) {
if (!f || !((f.type || '').startsWith('video/') || /\.(mp4|mov|m4v|webm|mkv|3gp|avi)$/i.test(f.name || ''))) return log('Please choose a video file.');
_0x12b9(); dubbing = false; plan = []; played = new Set(); spoken = new Set(); _0x1473++;
curFile = f; ENV = null; v.src = URL.createObjectURL(f); v.muted = ($('vol').value === '0'); v.volume = $('vol').value / 100; $('stage').hidden = false; $('dropTxt').textContent = '✓ ' + (f.name || 'Saved video') + ' · click to change';
_0x14b7({ hidden: false, disabled: false }); segs = []; $('resCard').hidden = true; if ($('editHint')) $('editHint').hidden = true; $('cap').textContent = ''; log('');
['s1', 's2', 's3'].forEach(i => $(i).className = 's'); $('bar').style.width = '0%';
if (!isRestore) {
_0x13da();
_0x13b8('videoFile', f);
_0x140d({ status: 'idle', step: 0, pasted: '', listenChunkIdx: 0, listenSegs: [], segs: [], voiceSel: '', _0x14fb });
}
}
function _0x14a6(raw) {
const s = String(raw || '').trim();
let g = '';
const clean = s
.replace(/^(?:\[(F|Female|Woman|Girl|Sreymom)\]|\((F|Female|Woman|Girl|Sreymom)\)|(?:F|Female|Sreymom)\s*:|[♀👩]\s*)+/i, () => { g = 'f'; return ''; })
.replace(/^(?:\[(M|Male|Man|Boy|Piseth)\]|\((M|Male|Man|Boy|Piseth)\)|(?:M|Male|Piseth)\s*:|[♂👨]\s*)+/i, () => { if (!g) g = 'm'; return ''; })
.trim();
return { g, text: clean };
}
function ts(s) { const m = s.match(/(?:(\d+):)?(\d+):(\d+)[.,](\d+)/); return m ? (+(m[1] || 0)) * 3600 + (+m[2]) * 60 + (+m[3]) + (+m[4]) / 1000 : 0 }
function _0x1099(t) {
return t.replace(/\r/g, '').split(/\n\s*\n/).map(b => {
const L = b.trim().split('\n'); const i = L.findIndex(l => l.includes('-->')); if (i < 0) return null;
const [a, e] = L[i].split('-->');
const p = _0x14a6(L.slice(i + 1).join(' ').replace(/<[^>]+>/g, '').trim());
return { t: ts(a), e: ts(e), text: p.text, g: p.g };
}).filter(x => x && x.text);
}
function _0x1088() {
const duration = Number(v.duration);
if (!Number.isFinite(duration) || duration <= 0 || !segs.length) return false;
let adjusted = 0;
segs.forEach(s => {
if (s.t < duration && Number.isFinite(s.e) && s.e > duration) {
s.e = duration;
adjusted++;
}
});
if (adjusted) blog('Adjusted ' + adjusted + ' subtitle(s) extending past the video end (' + fmt(duration).slice(3, 8) + ').', 'k');
return true;
}
function _0x10aa(t) {
const L = t.replace(/([.!?。！？])\s+/g, '$1\n').split(/\n+/).map(x => x.trim()).filter(Boolean);
const tot = L.reduce((a, x) => a + x.length, 0) || 1, d = v.duration || L.length * 4; let acc = 0;
return L.map(x => { const p = _0x14a6(x), o = { t: acc / tot * d, text: p.text, g: p.g }; acc += x.length; o.e = acc / tot * d; return o });
}
$('srt').onchange = async e => { $('srtText').value = await e.target.files[0].text() };
const fmt = s => { const h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), x = s % 60; return [h, m].map(n => String(n).padStart(2, '0')).join(':') + ':' + x.toFixed(3).padStart(6, '0').replace('.', ',') };
const KEY = () => $('key').value.trim();
try {
if (localStorage.getItem('kd_defv') !== '3') {
localStorage.setItem('kd_vol', '0');
localStorage.setItem('kd_voice', 'edge');
localStorage.setItem('kd_evoice', 'auto');
localStorage.setItem('kd_defv', '3');
}
} catch (_) { }
document.querySelectorAll('[data-save]').forEach(el => { const k = 'kd_' + el.id, c = el.type === 'checkbox'; try { const x = localStorage.getItem(k); if (x !== null) c ? el.checked = x === '1' : el.value = x } catch (_) { } el.addEventListener('input', () => { try { localStorage.setItem(k, c ? (el.checked ? '1' : '0') : el.value) } catch (_) { } }) });
const lines = el => el.value.split(/[\s,]+/).filter(Boolean);
const providers = () => keyList().length && $('en-gemini').checked ? ['gemini'] : [];
const _0x1011 = [
'gemini-3.6-flash',
'gemini-3.5-flash',
'gemini-3.5-flash-lite',
'gemini-3-flash',
'gemini-3.1-pro',
'gemini-3.8-flash',
'gemini-3-flash-preview',
'gemini-3.1-pro-preview',
'gemini-3.1-flash-lite-preview',
'gemini-2.5-flash',
'gemini-2.5-flash-lite',
'gemini-2.5-pro',
'gemini-2.5-flash-preview-05-20',
'gemini-2.5-flash-lite-preview-06-17',
'gemini-2.0-flash',
'gemini-2.0-flash-001',
'gemini-2.0-flash-lite',
'gemini-2.0-flash-lite-001',
'gemini-2.0-flash-exp',
'gemini-flash-latest',
'gemini-flash-lite-latest',
'gemini-pro-latest',
'gemini-1.5-flash',
'gemini-1.5-flash-latest',
'gemini-1.5-flash-8b',
'gemini-1.5-pro',
'gemini-1.5-pro-latest'
];
const _0x1022 = [
'gemini-3.6-flash',
'gemini-3.5-flash',
'gemini-3.5-flash-lite',
'gemini-3-flash',
'gemini-3.8-flash',
'gemini-2.5-flash-preview-tts',
'gemini-2.5-pro-preview-tts',
'gemini-2.5-flash',
'gemini-2.5-flash-lite',
'gemini-2.0-flash',
'gemini-2.0-flash-exp'
];
try {
if (localStorage.getItem('kd_modelv') !== '11') {
['model', 'ttsmodel'].forEach(id => {
const def = (id === 'model') ? _0x1011 : _0x1022;
$(id).value = def.join('\n');
localStorage.setItem('kd_' + id, $(id).value);
});
localStorage.setItem('kd_modelv', '11');
} else {
['model', 'ttsmodel'].forEach(id => {
const stored = localStorage.getItem('kd_' + id) || $(id).value || '';
const cleaned = stored.split(/[\s,]+/).map(s => s.trim()).filter(Boolean);
const def = (id === 'model') ? _0x1011 : _0x1022;
const finalVal = cleaned.length ? cleaned.join('\n') : def.join('\n');
$(id).value = finalVal;
localStorage.setItem('kd_' + id, finalVal);
});
}
} catch (_) { }
const sleep = ms => new Promise(r => setTimeout(r, ms));
const keyList = () => [...new Set($('key').value.split(/[\s,]+/).filter(Boolean))];
const modelList = () => {
const list = $('model').value.split(/[\s,]+/).map(s => s.trim()).filter(Boolean);
return list.length ? list : _0x1011;
};
const ttsModels = () => {
const list = $('ttsmodel').value.split(/[\s,]+/).map(s => s.trim()).filter(Boolean);
return list.length ? list : _0x1022;
};
const cool = {}, dly = {}, keyBad = {}; window.paintKeys = () => { };
try { const o = JSON.parse(localStorage.getItem('kd_cool') || '{}'); for (const id in o) if (o[id].u > Date.now()) { cool[id] = o[id].u; if (o[id].d) dly[id] = 1 } } catch (_) { }
const setCool = (id, until, daily) => {
cool[id] = until; if (daily) dly[id] = 1; else delete dly[id];
try { const o = {}; for (const k in cool) if (cool[k] > Date.now() && cool[k] < Infinity) o[k] = { u: cool[k], d: dly[k] ? 1 : 0 }; localStorage.setItem('kd_cool', JSON.stringify(o)) } catch (_) { }
};
const nextReset = () => { const pt = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })), m = new Date(pt); m.setHours(24, 0, 0, 0); return Date.now() + (m - pt) };
const classify = j => { const t = JSON.stringify((j && j.error) || {}), d = t.match(/"retryDelay"\s*:\s*"(\d+)/); return { daily: /PerDay|per day|daily/i.test(t), wait: d ? +d[1] * 1000 : 0 } };
const dur = ms => { const s = Math.ceil(ms / 1000); return s >= 3600 ? Math.floor(s / 3600) + 'h ' + Math.floor(s % 3600 / 60) + 'm' : s >= 60 ? Math.floor(s / 60) + 'm ' + (s % 60) + 's' : s + 's' };
function keyInfo(k) {
if (!k) return null; if (keyBad[k]) return { t: 'Invalid key', c: 'bad', title: keyBad[k] };
const allM = modelList(), M = allM.filter(m => cool[m + '|' + k] !== Infinity), now = Date.now(), lim = M.filter(m => (cool[m + '|' + k] || 0) > now);
if (!allM.length) return { t: '—', c: '' };
if (!M.length || !lim.length) return { t: 'Ready', c: 'ok', title: 'This key is verified and ready' };
const left = Math.min(...lim.map(m => cool[m + '|' + k]));
if (lim.length < M.length) return { t: 'Ready · ' + lim.length + '/' + M.length + ' resting', c: 'warn', title: 'Some models are resting for this key' };
if (lim.every(m => dly[m + '|' + k])) return { t: 'Limit today · ' + dur(left - now), c: 'bad', title: 'Daily quota used up. Skipped until it resets.' };
return { t: 'Resting ' + dur(left - now), c: 'warn', title: 'Rate-limited right now. Retried after cooldown.' };
}
const _0x1077 = {};
async function _0x1066(model, key, bodyObj) {
const k = String(key || '').trim();
const isAq = /^AQ\./i.test(k);
const glUrl = 'https://generativelanguage.googleapis.com/v1beta/models/' + model + ':generateContent?key=' + encodeURIComponent(k);
const vxUrl = 'https://aiplatform.googleapis.com/v1/publishers/google/models/' + model + ':generateContent?key=' + encodeURIComponent(k);
const body = JSON.stringify(bodyObj);
const pref = _0x1077[k];
const urls = pref === 'vx' ? [vxUrl, glUrl] : isAq ? [glUrl, vxUrl] : [glUrl];
let lastRes = null, lastJson = {};
for (const u of urls) {
const r = await fetch(u, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body });
const j = await r.json().catch(() => ({}));
lastRes = r; lastJson = j;
if (r.ok || r.status === 429 || r.status === 404) {
_0x1077[k] = u === vxUrl ? 'vx' : 'gl';
return { r, j };
}
}
return { r: lastRes, j: lastJson };
}
async function _0x1055(key) {
const k = String(key || '').trim();
if (!k) return { ok: false, msg: 'Empty API key' };
const isAiza = /^AIzaSy[A-Za-z0-9_-]{33}$/.test(k);
const isAq = /^AQ\.[A-Za-z0-9_.-]{20,}$/i.test(k);
if (!isAiza && !isAq) {
return { ok: false, msg: 'Invalid format. Google Gemini keys start with AIzaSy… or AQ.…' };
}
try {
let res = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=' + encodeURIComponent(k) + '&pageSize=1');
if (!res.ok) {
res = await fetch('https://generativelanguage.googleapis.com/v1beta/models?pageSize=1', {
headers: { 'x-goog-api-key': k }
});
}
if (res.ok) { _0x1077[k] = 'gl'; return { ok: true, msg: 'Valid Gemini key' }; }
if (res.status === 429 || res.status >= 500) {
return { ok: true, msg: 'Valid key (currently limited)', warn: true };
}
if (isAq) {
const testModels = [...new Set([...modelList(), 'gemini-2.5-flash', 'gemini-2.0-flash'])];
for (const tm of testModels.slice(0, 3)) {
const vxRes = await fetch('https://aiplatform.googleapis.com/v1/publishers/google/models/' + tm + ':generateContent?key=' + encodeURIComponent(k), {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: 'hi' }] }], generationConfig: { maxOutputTokens: 1 } })
});
if (vxRes.ok) { _0x1077[k] = 'vx'; return { ok: true, msg: 'Valid Vertex / Gemini AQ key' }; }
if (vxRes.status === 429 || vxRes.status >= 500) {
_0x1077[k] = 'vx';
return { ok: true, msg: 'Valid AQ key (currently limited)', warn: true };
}
if (vxRes.status === 404) {
_0x1077[k] = 'vx';
return { ok: true, msg: 'Valid AQ key' };
}
}
}
const j = await res.json().catch(() => ({}));
const m = (j.error && j.error.message) || String(res.status);
if (res.status === 400 || res.status === 401 || res.status === 403 || /api key/i.test(m)) {
return { ok: false, msg: 'Not a valid Gemini key: ' + m.slice(0, 70) };
}
return { ok: false, msg: 'Validation failed: ' + m.slice(0, 70) };
} catch (_) {
return { ok: true, msg: 'Format valid (offline check)', warn: true };
}
}
function _0x10bb(t) {
t = String(t).replace(/```json|```/g, '').trim();
try { return JSON.parse(t) } catch (_) { }
const out = []; let depth = 0, st = -1, str = false, esc = false;
for (let i = 0; i < t.length; i++) {
const c = t[i];
if (str) { if (esc) esc = false; else if (c === '\\') esc = true; else if (c === '"') str = false; continue }
if (c === '"') str = true;
else if (c === '{') { if (depth++ === 0) st = i }
else if (c === '}' && depth > 0 && --depth === 0) { try { out.push(JSON.parse(t.slice(st, i + 1))) } catch (_) { } }
}
if (!out.length) throw new Error('bad json');
return out;
}
const tsAny = v => {
if (typeof v === 'number') return isFinite(v) ? (v > 10000 ? v / 1000 : v) : NaN;
if (typeof v !== 'string') return NaN;
const s = v.trim().replace(',', '.').replace(/s$/i, '');
if (/^\d+(\.\d+)?$/.test(s)) {
const n = parseFloat(s);
return n > 10000 ? n / 1000 : n;
}
const m = s.match(/^(?:(\d+):)?(\d+):(\d+(?:\.\d+)?)$/);
return m ? (+(m[1] || 0)) * 3600 + (+m[2]) * 60 + parseFloat(m[3]) : NaN;
};
function _0x10cc(res, off, dur) {
const arr = Array.isArray(res) ? res : (res && Object.values(res).find(Array.isArray)) || [];
let L = arr.filter(x => x && typeof x === 'object').map(x => {
const rawG = String(x.g ?? x.gender ?? x.speaker ?? '').trim().toLowerCase();
let g = (rawG.startsWith('f') || rawG.includes('female') || rawG.includes('woman') || rawG.includes('sreymom') || rawG === '♀') ? 'f'
: (rawG.startsWith('m') || rawG.includes('male') || rawG.includes('man') || rawG.includes('piseth') || rawG === '♂') ? 'm' : '';
const pTxt = _0x14a6(x.text ?? x.original ?? '');
const pKm = _0x14a6(x.km ?? x.khmer ?? '');
if (!g && (x.text || x.km)) {
const s0 = String(x.text ?? x.original ?? '').trim();
const k0 = String(x.km ?? x.khmer ?? '').trim();
if (pTxt.text !== s0) g = pTxt.g;
else if (pKm.text !== k0) g = pKm.g;
}
return {
s: tsAny(x.s ?? x.start ?? x.t), e: tsAny(x.e ?? x.end),
text: pTxt.text, km: pKm.text, g: g || 'm'
};
}).filter(x => x.text || x.km);
if (off > 0 && L.length && L.every(x => isFinite(x.s) && x.s >= off - 2 && x.s <= off + dur + 5)) {
L.forEach(x => { x.s -= off; if (isFinite(x.e)) x.e -= off });
}
const bad = L.filter((x, i) => !isFinite(x.s) || x.s < 0 || x.s > dur + 2 || (i && x.s < L[i - 1].s - 0.5)).length;
if (L.length > 1 && bad > L.length * 0.45) {
const tot = L.reduce((a, x) => a + (x.km || x.text).length, 0) || 1; let acc = 0;
L.forEach(x => { x.s = acc / tot * dur; acc += (x.km || x.text).length; x.e = acc / tot * dur });
} else L.forEach((x, i) => {
if (!isFinite(x.s) || x.s < 0) x.s = i ? L[i - 1].e : 0;
if (i && x.s < L[i - 1].s) x.s = L[i - 1].s + 0.3;
x.s = Math.min(x.s, Math.max(0, dur - 0.2));
const est = Math.max(1.4, Math.min(10, (x.km || x.text).length * 0.085));
if (!isFinite(x.e) || x.e <= x.s || x.e - x.s > Math.max(10, est * 2.2)) x.e = Math.min(dur, x.s + est);
});
return L.map(x => ({ t: off + x.s, e: off + Math.min(x.e, dur), text: x.text, km: x.km, g: x.g || 'm' }));
}
function _0x10dd(L) {
L = L.slice().sort((a, b) => a.t - b.t); const o = [];
L.forEach(x => {
const p = o[o.length - 1];
if (p && ((x.km && x.km === p.km) || (x.text && x.text === p.text)) && Math.abs(x.t - p.t) < 2.0) return;
if (p) {
if (x.t < p.t + 0.35) {
const shift = p.t + Math.min(1.0, Math.max(0.35, (p.e - p.t) * 0.5)) - x.t;
x.t += shift;
x.e = Math.max(x.t + 0.8, x.e + shift);
}
if (p.e > x.t) p.e = Math.max(p.t + 0.35, x.t);
}
o.push(x);
});
return o;
}
function _0x10ee(pcm, L, off) {
const n = Math.floor(pcm.length / 16000); if (n < 2) return [];
const v = [];
for (let i = 0; i < n; i++) { let s = 0; for (let j = i * 16000; j < (i + 1) * 16000; j += 4) s += pcm[j] * pcm[j]; v.push(Math.sqrt(s / 4000)) }
const floor = [...v].sort((a, b) => a - b)[Math.floor(n * 0.2)] || 0, thr = Math.max(0.01, floor * 2.6);
const cov = new Array(n).fill(false);
L.forEach(x => {
const maxSpan = Math.max(2.5, Math.min(10, (x.km || x.text || '').length * 0.11));
const eCap = Math.min(x.e, x.t + maxSpan);
for (let i = Math.floor(x.t - off - 0.3); i <= Math.ceil(eCap - off + 0.3); i++) if (i >= 0 && i < n) cov[i] = true;
});
const miss = []; v.forEach((a, i) => { if (a > thr && !cov[i]) miss.push(i) });
const groups = []; miss.forEach(i => { const g = groups[groups.length - 1]; if (g && i - g[g.length - 1] <= 2) g.push(i); else groups.push([i]) });
return groups.filter(g => g.length >= 2).map(g => [Math.max(0, g[0] - 1), Math.min(n, g[g.length - 1] + 2)]);
}
const _0x1033 = 'You are a professional subtitler. Transcribe EVERY spoken sentence in this audio clip, from the first second to the last, without skipping, merging or summarising anything, and translate each one into natural conversational Khmer (ភាសាខ្មែរ) for video dubbing. Also detect the speaker\'s voice gender for each segment ("m" for male speaker or "f" for female speaker). Return ONLY a JSON array of objects {"s":start,"e":end,"g":"m"|"f","text":"original speech","km":"Khmer translation"}. s and e are plain numbers of seconds (like 12.5, NOT mm:ss) counted from the start of THIS clip. Use sentence-sized segments of 1.5-8 seconds, in order, without overlaps. Every object MUST have a non-empty "km" and "g" ("m" or "f"). If there is truly no speech return [].';
async function _0x10ff(pcm, off) {
const res = await gem([{ inlineData: { mimeType: 'audio/wav', data: await b64(wav(pcm)) } }, { text: _0x1033 }],
{ gen: { responseMimeType: 'application/json', temperature: 0, maxOutputTokens: 8192 } });
return _0x10cc(res, off, pcm.length / 16000);
}
async function gem(parts, opt = {}) {
const K = keyList(), M = opt.models || modelList();
if (!K.length || !M.length) throw new Error('Add at least one API key and one model.');
const bodyObj = { contents: [{ role: 'user', parts }], generationConfig: opt.gen || { responseMimeType: 'application/json', temperature: 0.2, maxOutputTokens: 8192 } };
let lastErr = '';
{ const st = K.map(k => keyInfo(k)), c = f => st.filter(f).length; blog('Keys: ' + c(x => x.c === 'ok') + ' ready, ' + c(x => x.c === 'warn') + ' resting, ' + c(x => x.t.startsWith('Limit today')) + ' limited today, ' + c(x => x.t === 'Invalid key') + ' invalid' + (K.length ? ' (limited/invalid keys are skipped)' : '')); }
for (let round = 0; round < (opt.rounds || 8); round++) {
for (const m of M) for (let ki = 0; ki < K.length; ki++) {
const id = m + '|' + K[ki];
if (keyBad[K[ki]]) continue;
if ((cool[id] || 0) > Date.now()) continue;
const who = m + ' · key ' + (ki + 1) + '/' + K.length;
let r, j; const t0 = performance.now(), el = () => ((performance.now() - t0) / 1000).toFixed(1) + 's';
blog('→ Gemini request: ' + who);
try {
const resp = await _0x1066(m, K[ki], bodyObj);
r = resp.r; j = resp.j;
} catch (e) { lastErr = 'Network error'; setCool(id, Date.now() + 30000); blog('✕ ' + who + ' network error (' + el() + ') → resting 30s', 'w'); continue }
if (r.ok) {
blog('← ' + r.status + ' OK from ' + who + ' (' + el() + ')', 'k');
if (opt.raw) { const p = ((j.candidates && j.candidates[0] && j.candidates[0].content && j.candidates[0].content.parts) || []).find(x => x.inlineData || x.inline_data); if (p) { $('used').textContent = 'Last request: ' + who; return p.inlineData || p.inline_data } lastErr = 'No audio returned by ' + m; setCool(id, Date.now() + 45000); blog('✕ ' + who + ' returned no audio → resting 45s', 'w'); continue }
const t = ((j.candidates && j.candidates[0] && j.candidates[0].content && j.candidates[0].content.parts) || []).map(p => p.text || '').join('');
try { const out = _0x10bb(t); $('used').textContent = 'Last request: ' + who; return out }
catch (_) { lastErr = 'Unreadable answer from ' + m; setCool(id, Date.now() + 30000); blog('✕ ' + who + ' gave an unreadable answer → resting 30s', 'w'); continue }
}
const msg = (j.error && j.error.message) || String(r.status); lastErr = msg;
blog('← ' + r.status + ' ' + who + ' (' + el() + '): ' + msg.slice(0, 160), 'w');
let note;
if (r.status === 404 || (r.status === 400 && /not supported|modality|model/i.test(msg))) { setCool(id, Infinity); note = 'model not supported, skipped' }
else if (r.status === 403 || (r.status === 400 && /api key/i.test(msg))) { keyBad[K[ki]] = msg.slice(0, 100); note = 'invalid/blocked key, skipped' }
else if (r.status === 429 || r.status >= 500 || r.status === 400 || /overload|demand|quota|unavailable/i.test(msg)) {
const c = classify(j);
if (c.daily) { setCool(id, nextReset(), true); note = 'daily limit reached, skipped until reset (~' + dur(nextReset() - Date.now()) + ')' }
else { setCool(id, Date.now() + Math.max(45000, c.wait)); note = 'resting ' + dur(Math.max(45000, c.wait)) }
}
else throw new Error('Gemini error: ' + msg);
log('⚠ ' + who + ' unavailable (' + r.status + '): ' + note + ' — switching to the next key/model…');
paintKeys();
}
const live = []; let allDaily = true; M.forEach(m => K.forEach(k => { if (keyBad[k]) return; const id2 = m + '|' + k, c = cool[id2] || 0; if (c < Infinity) { live.push(c); if (!(dly[id2] && c > Date.now())) allDaily = false } }));
if (!live.length) throw new Error('All keys/models failed. Last error: ' + lastErr);
if (allDaily) throw new Error('Every key has reached today’s Gemini limit (resets in about ' + dur(Math.min(...live) - Date.now()) + '). Add another key or try again later.');
if (round + 1 >= (opt.rounds || 8)) throw new Error('Gemini busy: ' + lastErr);
const wait = Math.min(60000, Math.max(0, Math.min(...live) - Date.now()));
if (wait > 0) { for (let t = Math.ceil(wait / 1000); t > 0; t--) { log('All keys/models are busy or rate-limited. Retrying in ' + t + 's…'); await sleep(1000) } }
}
throw new Error('Gemini is still busy. Last error: ' + lastErr);
}
const b64 = buf => new Promise(r => { const f = new FileReader(); f.onload = () => r(f.result.split(',')[1]); f.readAsDataURL(new Blob([buf])) });
function wav(pcm) {
const n = pcm.length, o = new DataView(new ArrayBuffer(44 + n * 2)), w = (p, t) => [...t].forEach((c, i) => o.setUint8(p + i, c.charCodeAt(0)));
w(0, 'RIFF'); o.setUint32(4, 36 + n * 2, true); w(8, 'WAVEfmt '); o.setUint32(16, 16, true); o.setUint16(20, 1, true); o.setUint16(22, 1, true);
o.setUint32(24, 16000, true); o.setUint32(28, 32000, true); o.setUint16(32, 2, true); o.setUint16(34, 16, true); w(36, 'data'); o.setUint32(40, n * 2, true);
for (let i = 0; i < n; i++) { const x = Math.max(-1, Math.min(1, pcm[i])); o.setInt16(44 + i * 2, x < 0 ? x * 32768 : x * 32767, true) }
return o.buffer;
}
async function _0x1110(file) {
const u64 = (d, o) => d.getUint32(o) * 4294967296 + d.getUint32(o + 4);
const tt = (d, o) => String.fromCharCode(d.getUint8(o), d.getUint8(o + 1), d.getUint8(o + 2), d.getUint8(o + 3));
let pos = 0, moov = null; const size = file.size;
while (pos + 8 <= size) {
const h = new DataView(await file.slice(pos, pos + 16).arrayBuffer()); let len = h.getUint32(0), hd = 8; const type = tt(h, 4);
if (len === 1) { len = u64(h, 8); hd = 16 } else if (len === 0) len = size - pos;
if (len < 8) break;
if (type === 'moov') { moov = await file.slice(pos + hd, pos + len).arrayBuffer(); break }
pos += len;
}
if (!moov) throw 0;
const dv = new DataView(moov), U = new Uint8Array(moov);
const kids = (s0, e0) => { const r = []; let q = s0; while (q + 8 <= e0) { let l = dv.getUint32(q), hd = 8; if (l === 1) { l = u64(dv, q + 8); hd = 16 } else if (l === 0) l = e0 - q; if (l < 8) break; r.push({ t: tt(dv, q + 4), s: q + hd, e: Math.min(e0, q + l) }); q += l } return r };
const find = (b, t) => b && kids(b.s, b.e).find(k => k.t === t);
let trak = null;
for (const k of kids(0, moov.byteLength)) if (k.t === 'trak') { const hl = find(find(k, 'mdia'), 'hdlr'); if (hl && tt(dv, hl.s + 8) === 'soun') { trak = k; break } }
if (!trak) throw 0;
const mdia = find(trak, 'mdia'), mdhd = find(mdia, 'mdhd'), stbl = find(find(mdia, 'minf'), 'stbl');
const timescale = dv.getUint32(mdhd.s + (dv.getUint8(mdhd.s) === 1 ? 20 : 12));
const stsd = find(stbl, 'stsd'), es = stsd.s + 8, esz = dv.getUint32(es);
if (tt(dv, es + 4) !== 'mp4a') throw 0;
let p = -1; for (let i = es + 8; i < es + esz - 8; i++) if (tt(dv, i) === 'esds') { p = i + 8; break }
if (p < 0) throw 0;
const tag = () => { const t = U[p++]; let l = 0, b; do { b = U[p++]; l = (l << 7) | (b & 127) } while (b & 128); return [t, l] };
let [t0] = tag(); if (t0 !== 3) throw 0; p += 2; const fl = U[p++]; if (fl & 0x80) p += 2; if (fl & 0x40) p += 1 + U[p]; if (fl & 0x20) p += 2;
[t0] = tag(); if (t0 !== 4) throw 0; p += 13;
let [t5, l5] = tag(); if (t5 !== 5) throw 0; const asc = U.slice(p, p + l5);
let bp = 0; const bits = n => { let v = 0; while (n--) { v = (v << 1) | ((asc[bp >> 3] >> (7 - (bp & 7))) & 1); bp++ } return v };
let aot = bits(5); if (aot === 31) aot = 32 + bits(6); const fi = bits(4); if (fi === 15) bits(24); const ch = bits(4);
if (aot === 5 || aot === 29) { if (bits(4) === 15) bits(24); aot = bits(5) }
if (aot < 1 || aot > 4 || !ch || ch > 7 || fi > 12) throw 0;
const stts = find(stbl, 'stts'), sttsN = dv.getUint32(stts.s + 4); let ticks = 0;
for (let i = 0; i < sttsN; i++) ticks += dv.getUint32(stts.s + 8 + i * 8) * dv.getUint32(stts.s + 12 + i * 8);
const stsz = find(stbl, 'stsz'), fixed = dv.getUint32(stsz.s + 4), n = dv.getUint32(stsz.s + 8);
const sz = i => fixed || dv.getUint32(stsz.s + 12 + i * 4);
const stsc = find(stbl, 'stsc'), scN = dv.getUint32(stsc.s + 4), sc = [];
for (let i = 0; i < scN; i++) sc.push({ f: dv.getUint32(stsc.s + 8 + i * 12), n: dv.getUint32(stsc.s + 12 + i * 12) });
const stco = find(stbl, 'stco'), co64 = find(stbl, 'co64'), cN = dv.getUint32((stco || co64).s + 4);
const off = i => stco ? dv.getUint32(stco.s + 8 + i * 4) : u64(dv, co64.s + 8 + i * 8);
const chunks = []; let si = 0, ci = 0;
for (let c = 0; c < cN; c++) {
while (ci + 1 < sc.length && sc[ci + 1].f <= c + 1) ci++;
const sizes = []; let tot = 0; for (let k = 0; k < sc[ci].n && si < n; k++) { const z = sz(si++); sizes.push(z); tot += z }
chunks.push({ off: off(c), sizes, tot, first: si - sizes.length });
}
const sd = ticks / timescale / n, prof = aot - 1;
async function adts(a, b) {
const need = chunks.filter(c => c.first < b && c.first + c.sizes.length > a), got = [];
for (let i = 0; i < need.length; i += 12) got.push(...await Promise.all(need.slice(i, i + 12).map(c => file.slice(c.off, c.off + c.tot).arrayBuffer())));
let total = 0; need.forEach(c => c.sizes.forEach((z, k) => { const g = c.first + k; if (g >= a && g < b) total += z + 7 }));
const out = new Uint8Array(total); let o = 0;
need.forEach((c, ix) => { let q = 0; const src = new Uint8Array(got[ix]); c.sizes.forEach((z, k) => { const g = c.first + k; if (g >= a && g < b) { const L = z + 7; out[o] = 0xFF; out[o + 1] = 0xF1; out[o + 2] = (prof << 6) | (fi << 2) | (ch >> 2); out[o + 3] = ((ch & 3) << 6) | (L >> 11); out[o + 4] = (L >> 3) & 255; out[o + 5] = ((L & 7) << 5) | 0x1F; out[o + 6] = 0xFC; out.set(src.subarray(q, q + z), o + 7); o += L } q += z }) });
return out.buffer;
}
return { dur: ticks / timescale, n, sd, adts };
}
let ENV = null;
function addEnv(pcm, off) {
if (!ENV) ENV = [];
const base = Math.round(off * 100), n = Math.floor(pcm.length / 160);
for (let i = 0; i < n; i++) { let s = 0; for (let j = i * 160; j < i * 160 + 160; j += 2) s += pcm[j] * pcm[j]; ENV[base + i] = Math.sqrt(s / 80) }
}
function _0x1121() {
if (!ENV || ENV.length < 50) return null;
const n = ENV.length, v = Array.from({ length: n }, (_, i) => ENV[i] || 0), srt = v.slice().sort((a, b) => a - b);
const floor = srt[Math.floor(n * 0.2)], peak = srt[Math.floor(n * 0.95)], thr = Math.max(floor * 2.5, peak * 0.08, 0.004), runs = [];
let a = -1;
for (let i = 0; i <= n; i++) {
const on = i < n && v[i] > thr;
if (on && a < 0) a = i;
else if (!on && a >= 0) { const l = runs[runs.length - 1]; if (l && a - l[1] < 15) l[1] = i; else runs.push([a, i]); a = -1 }
}
return runs.filter(r => r[1] - r[0] >= 8).map(r => [r[0] / 100, r[1] / 100]);
}
function _0x1132(L) {
const R = _0x1121(); if (!R || !R.length || !L.length) return 0;
const near = x => { let best = null, bd = 1e9; for (const r of R) { const d = x < r[0] ? r[0] - x : x > r[1] ? x - r[1] : 0; if (d < bd) { bd = d; best = r } } return bd <= 0.2 ? best : null };
const o = L.map(s => ({ t: Number(s.t) || 0, e: Number(s.e) > s.t ? Number(s.e) : s.t + 2 })), used = new Set(), t2 = [], e2 = []; let moved = 0;
o.forEach((s, i) => {
let t = s.t; const r = near(t), pe = i ? e2[i - 1] || o[i - 1].e : 0;
if (r && !used.has(r) && r[0] >= pe - 0.05 && Math.abs(t - r[0]) <= 0.2) { t = r[0]; used.add(r) }
t2.push(t); e2.push(s.e);
});
o.forEach((s, i) => {
let e = s.e; const r = near(e - 0.02), nx = i + 1 < o.length ? t2[i + 1] : 1e9;
if (r && r[1] > t2[i] + 0.3 && nx >= r[1] - 0.15 && Math.abs(e - r[1]) <= 0.25) e = r[1];
e = Math.max(t2[i] + 0.3, Math.min(e, nx - 0.02));
e2[i] = e;
});
L.forEach((s, i) => { if (Math.abs(s.t - t2[i]) > 0.04 || Math.abs((Number(s.e) || 0) - e2[i]) > 0.04) moved++; s.t = t2[i]; s.e = e2[i] });
return moved;
}
function _0x1143(x, lo, hi, minT) {
const floor = Math.max(lo, minT) + 0.35, ceil = hi - 0.35;
if (!ENV || ceil <= floor) return Math.max(Math.max(lo, minT) + 0.25, Math.min(hi - 0.2, x));
const a = Math.max(Math.round((x - 0.6) * 100), Math.round(floor * 100)), b = Math.min(Math.round((x + 0.6) * 100), Math.round(ceil * 100));
if (b <= a) return Math.max(floor, Math.min(ceil, x));
let best = a, bv = Infinity;
for (let f = a; f <= b; f++) { let m = 0; for (let j = -3; j <= 3; j++) m += ENV[f + j] || 0; if (m < bv) { bv = m; best = f } }
return best / 100;
}
async function _0x1154() {
try {
if (!ENV) { log('Matching the timing to the original audio…'); const a = await _0x1165(); for (let k = 0; k < a.total; k++) addEnv(await a.getPcm(k), k * a.CHs) }
const n = _0x1132(segs); blog('Timing matched to the original speech: ' + n + ' of ' + segs.length + ' lines moved onto the real speech start/end.', 'k');
} catch (e) { blog('⚠ Could not read the original audio to match timing; using the subtitle timestamps as they are.', 'w') }
}
async function _0x1165() {
log('Reading audio from your video…');
const CHs = 60, CH = CHs * 16000; let ma = null, getPcm, total;
const ac = _mac();
try {
ma = await _0x1110(curFile); total = Math.ceil(ma.dur / CHs);
const pcmAt = async (k, verify) => {
const t0 = k * CHs, t1 = Math.min(ma.dur, (k + 1) * CHs), out = new Float32Array(Math.max(1, Math.round((t1 - t0) * 16000)));
for (let u = t0; u < t1; u += 30) {
const a = Math.floor(u / ma.sd), b = Math.min(ma.n, Math.floor(Math.min(u + 30, t1) / ma.sd)); if (b <= a) continue;
const pre = a > 0 ? 1 : 0, a0 = a - pre;
const buf = await decode(ac, await ma.adts(a0, b));
const expDur = (b - a0) * ma.sd;
if (verify && Math.abs(buf.duration - expDur) > Math.max(1.2, expDur * 0.15)) throw 0;
const skipSmp = Math.round(pre * (buf.length / Math.max(1, b - a0)));
const avail = Math.max(1, buf.length - skipSmp);
const targetLen = Math.max(1, Math.round((b - a) * ma.sd * 16000));
const r = avail / targetLen, base = Math.round((a * ma.sd - t0) * 16000), nCh = buf.numberOfChannels;
const chs = []; for (let c = 0; c < nCh; c++) chs.push(buf.getChannelData(c));
for (let i = 0; i < targetLen; i++) {
const o = base + i; if (o < 0 || o >= out.length) continue;
const s0 = Math.min(buf.length - 1, skipSmp + Math.floor(i * r));
const s1 = Math.min(buf.length, Math.max(s0 + 1, skipSmp + Math.floor((i + 1) * r)));
let sum = 0; for (let c = 0; c < nCh; c++) for (let j = s0; j < s1; j++) sum += chs[c][j];
out[o] = sum / (nCh * (s1 - s0));
}
}
return out;
};
const first = await pcmAt(0, true); getPcm = async k => k === 0 ? first : pcmAt(k, false);
} catch (_) { ma = null }
if (!ma) {
let dec;
try { dec = await decode(ac, await curFile.arrayBuffer()) }
catch (_) { throw new Error('This phone/browser couldn’t read the audio of that video (try an MP4 with AAC audio, a shorter clip, or paste your Khmer subtitles in the Subtitles tab).') }
const oc = new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(1, Math.ceil(dec.duration * 16000), 16000), src = oc.createBufferSource();
src.buffer = dec; src.connect(oc.destination); src.start();
const pcm = (await oc.startRendering()).getChannelData(0); total = Math.ceil(pcm.length / CH); getPcm = async k => pcm.subarray(k * CH, (k + 1) * CH);
}
return { total, CHs, getPcm };
}
async function listen(resumed) {
const { total, CHs, getPcm } = await _0x1165(); ENV = null;
const startK = resumed && Array.isArray(resumed.listenSegs) && resumed.listenChunkIdx > 0 ? resumed.listenChunkIdx : 0;
const out = startK > 0 ? resumed.listenSegs.slice() : [];
for (let k = 0; k < total; k++) {
const pcm = await getPcm(k), off = k * CHs; addEnv(pcm, off);
if (k < startK) {
blog('✓ Restored part ' + (k + 1) + '/' + total + ' from saved session.', 'k');
continue;
}
log('Gemini is listening & translating… part ' + (k + 1) + '/' + total);
let L = [];
try { L = _0x10dd(await _0x10ff(pcm, off)) } catch (e) { blog('⚠ Part ' + (k + 1) + ' initial pass hiccup (' + (e.message || e) + '), retrying in halves…', 'w') }
if (!L.length && pcm.length > 32000 && _0x10ee(pcm, [], off).length) {
const mid = Math.floor(pcm.length / 32000) * 16000;
const p1 = await _0x10ff(pcm.subarray(0, mid), off).catch(() => []);
const p2 = await _0x10ff(pcm.subarray(mid), off + mid / 16000).catch(() => []);
L = _0x10dd([...p1, ...p2]);
}
for (let pass = 0; pass < 3; pass++) {
const gaps = _0x10ee(pcm, L, off).slice(0, 8); if (!gaps.length) break;
log('Part ' + (k + 1) + '/' + total + ': filling ' + gaps.length + ' missing stretch(es)…');
for (const [a, b] of gaps) {
try { L = L.concat(await _0x10ff(pcm.subarray(Math.floor(a * 16000), Math.floor(b * 16000)), off + a)) }
catch (_) { }
}
L = _0x10dd(L);
}
out.push(...L);
await _0x140d({ status: 'running', step: 1, listenChunkIdx: k + 1, listenSegs: _0x13fc(out) });
}
return _0x10dd(out);
}
async function translate() {
const need = segs.map((s, i) => i).filter(i => !segs[i].km);
for (let pass = 0; pass < 4; pass++) {
const todo = need.filter(i => !segs[i].km); if (!todo.length) break;
const stepSz = pass < 2 ? 15 : 5;
for (let p = 0; p < todo.length; p += stepSz) {
const ids = todo.slice(p, p + stepSz);
const prompt = 'Translate each line into natural, spoken Khmer (ភាសាខ្មែរ) for video dubbing: concise, conversational, keep names. Also infer speaker gender ("m" for male or "f" for female) when clear from dialogue/context. Return ONLY a JSON array with exactly one object {"i":id,"g":"m"|"f","km":"Khmer text"} per input line, using the same i. Never skip a line.\n' + JSON.stringify(ids.map(i => ({ i, g: segs[i].g || '', text: segs[i].text })));
try {
const a = await gem([{ text: prompt }], { rounds: 6 });
(Array.isArray(a) ? a : []).forEach(o => {
if (o && ids.includes(+o.i) && String(o.km || '').trim()) {
const s = segs[+o.i];
s.km = String(o.km).trim();
if (!s.g && (o.g === 'f' || o.g === 'm')) s.g = o.g;
if (!s.g) s.g = 'm';
}
});
await _0x140d({ status: 'running', step: 2, segs: _0x13fc(segs) });
} catch (e) { if (pass === 3) throw e; log('⚠ translation hiccup, retrying…') }
log('Translating… ' + need.filter(i => segs[i].km).length + '/' + need.length);
}
}
segs.forEach(s => { if (s.g !== 'f') s.g = 'm'; });
const miss = need.filter(i => !segs[i].km || !segs[i].km.trim());
if (miss.length) {
log('⚠ ' + miss.length + ' line(s) incomplete in translation — skipped and not stored into video.', 'w');
}
segs = segs.filter(s => s.km && s.km.trim() && (s.km !== s.text || /[\u1780-\u17FF]/.test(s.km)));
if (!segs.length) throw new Error('Translation incomplete. No translated Khmer speech to store into video.');
}
function rawWav(bin, rate) {
const o = new DataView(new ArrayBuffer(44)), w = (p, t) => [...t].forEach((c, i) => o.setUint8(p + i, c.charCodeAt(0)));
w(0, 'RIFF'); o.setUint32(4, 36 + bin.length, true); w(8, 'WAVEfmt '); o.setUint32(16, 16, true); o.setUint16(20, 1, true); o.setUint16(22, 1, true);
o.setUint32(24, rate, true); o.setUint32(28, rate * 2, true); o.setUint16(32, 2, true); o.setUint16(34, 16, true); w(36, 'data'); o.setUint32(40, bin.length, true);
return new Blob([o, bin], { type: 'audio/wav' })
}
const _0x1176 = t => String(t).replace(/[。｡]/g, '។').replace(/！/g, '!').replace(/？/g, '?').replace(/[<>&]/g, ' ').replace(/[\u2E80-\u9FFF\uAC00-\uD7AF\uFF00-\uFFEF]/g, '').replace(/[\u0000-\u001F\u007F\u200B-\u200D\uFEFF]/g, ' ').replace(/\s+/g, ' ').trim();
const _0x1187 = t => /[\u1780-\u17FFa-zA-Z0-9\u17E0-\u17E9]/.test(t);
function _0x1198(t, max = 150) {
const sent = t.match(/[^។!?]+[។!?]*/g) || [t], out = []; let cur = '';
const push = s => { s = s.trim(); if (!s || !_0x1187(s)) return; if (cur && (cur + ' ' + s).length > max) { out.push(cur); cur = s } else cur = cur ? cur + ' ' + s : s };
sent.forEach(s => { if (s.length <= max) push(s); else { let p = ''; s.split(' ').forEach(w => { if (p && (p + ' ' + w).length > max) { push(p); p = w } else p = p ? p + ' ' + w : w }); push(p) } });
if (cur && _0x1187(cur)) out.push(cur);
return out.length ? out : (_0x1187(t) ? [t.trim()] : []);
}
function _0x11a9(L, max = 120) {
const out = [];
L.forEach((s, i) => {
const km = _0x1176(s.km) || s.km, g = s.g === 'f' ? 'f' : 'm';
if (!_0x1187(km)) return;
const parts = km.length > max ? _0x1198(km, max) : [km];
if (parts.length < 2) { s.km = km; s.g = g; out.push(s); return }
const t0 = s.t, e0 = Math.max(t0 + parts.length * 0.6, s.e || (L[i + 1] ? L[i + 1].t : t0 + 4)), tot = parts.reduce((a, x) => a + x.length, 0) || 1; let acc = 0; const bt = [t0];
for (let k = 0; k < parts.length - 1; k++) { acc += parts[k].length; bt.push(_0x1143(t0 + (e0 - t0) * acc / tot, t0, e0, bt[bt.length - 1])) }
bt.push(e0);
parts.forEach((pt, k) => out.push({ t: bt[k], e: bt[k + 1], text: pt, km: pt, g }));
});
return out;
}
function wavAt(pcm, sr) {
const n = pcm.length, o = new DataView(new ArrayBuffer(44 + n * 2)), w = (p, t) => [...t].forEach((c, i) => o.setUint8(p + i, c.charCodeAt(0)));
w(0, 'RIFF'); o.setUint32(4, 36 + n * 2, true); w(8, 'WAVEfmt '); o.setUint32(16, 16, true); o.setUint16(20, 1, true); o.setUint16(22, 1, true);
o.setUint32(24, sr, true); o.setUint32(28, sr * 2, true); o.setUint16(32, 2, true); o.setUint16(34, 16, true); w(36, 'data'); o.setUint32(40, n * 2, true);
for (let i = 0; i < n; i++) { const x = Math.max(-1, Math.min(1, pcm[i])); o.setInt16(44 + i * 2, x < 0 ? x * 32768 : x * 32767, true) }
return new Blob([o.buffer], { type: 'audio/wav' });
}
async function _0x11ba(base, text, voice, rate) {
let err;
for (let t = 0; t < 4; t++) {
const ac = new AbortController(), to = setTimeout(() => ac.abort(), 25000);
try {
const r = await fetch(base + '/tts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(rate ? { text, voice, rate } : { text, voice }), signal: ac.signal });
if (!r.ok) throw new Error('HTTP ' + r.status + ' ' + (await r.text()).slice(0, 80));
const b = await r.blob(); if (b.size < 200) throw new Error('empty audio returned');
return b;
} catch (e) { err = e; if (t < 3) await sleep(Math.min(5000, 350 * (t + 1) * (t + 1))) }
finally { clearTimeout(to) }
}
throw err;
}
async function _0x11cb(base, text, voice, rate, maxChunk = 140) {
const chunks = _0x1198(text, maxChunk);
if (!chunks.length) throw new Error('no speakable text');
const bl = await Promise.all(chunks.map(c => _0x11ba(base, c, voice, rate)));
if (bl.length === 1) return bl[0];
const bufs = await Promise.all(bl.map(async b => decode(_mac(), await b.arrayBuffer())));
const sr = bufs[0].sampleRate, gap = Math.round(sr * 0.12), total = bufs.reduce((a, b, i) => a + b.length + (i < bufs.length - 1 ? gap : 0), 0), pcm = new Float32Array(total); let o = 0;
bufs.forEach((b, i) => { pcm.set(b.getChannelData(0), o); o += b.length + (i < bufs.length - 1 ? gap : 0) });
return wavAt(pcm, sr);
}
function _0x14ea(seg) {
const ev = $('evoice').value;
if (ev === 'auto') return seg && seg.g === 'f' ? 'km-KH-SreymomNeural' : 'km-KH-PisethNeural';
return ev;
}
async function _0x11dc() {
const base = $('eurl').value.trim().replace(/\/$/, ''), ev = $('evoice').value;
segs.forEach(x => { const cl = _0x1176(x.km); x.skip = !_0x1187(cl) });
const q = segs.map((x, i) => i).filter(i => !segs[i].audio && !segs[i].skip && _0x1187(_0x1176(segs[i].km))), total = q.length, failed = []; let done = 0;
if (q.length) {
log('Waking up the voice server… (the first request can take up to a minute)');
let up = false;
for (let t = 0; t < 16 && !up; t++) {
const ac = new AbortController(), to = setTimeout(() => ac.abort(), 4500);
try { up = (await fetch(base + '/ping', { signal: ac.signal })).ok } catch (_) { }
finally { clearTimeout(to) }
if (!up) await sleep(2000);
}
if (!up) throw new Error('Edge voice server is not reachable (check your internet and try again).');
}
const gen = async i => {
const txt = _0x1176(segs[i].km), voice = _0x14ea(segs[i]);
for (const sz of [140, 60, 28]) {
try {
await _0x141e(i, await _0x11cb(base, txt, voice, '+0%', sz));
return;
} catch (e) {
if (sz === 28) throw e;
blog('Retrying line ' + (i + 1) + ' (' + (segs[i].g === 'f' ? 'Sreymom' : 'Piseth') + ') with shorter Khmer chunks (' + sz + ')…', 'w');
await sleep(250);
}
}
};
const CONC = Math.min(6, Math.max(1, q.length));
await Promise.all(Array.from({ length: CONC }, async () => {
while (q.length) {
const i = q.shift();
try { await gen(i) } catch (e) { failed.push(i); blog('✕ line ' + (i + 1) + ' failed: ' + (e.message || e), 'w') }
const pctV = 75 + Math.round(((++done) / Math.max(1, total)) * 23); setProgress(pctV, 'Generating Khmer voice with Edge (' + done + '/' + total + ')...', 'Khmer Voice'); log('Generating Khmer voice with Edge… ' + done + '/' + total + (failed.length ? ' (' + failed.length + ' failed)' : ''));
}
}));
for (let pass = 0; pass < 3 && failed.length; pass++) {
await sleep(1500 * (pass + 1));
try { await fetch(base + '/ping') } catch (_) { }
const retryList = failed.slice();
for (const i of retryList) {
log('Retrying line ' + (i + 1) + ' (pass ' + (pass + 1) + ')…');
try { await gen(i); failed.splice(failed.indexOf(i), 1) }
catch (e) { blog('✕ line ' + (i + 1) + ' failed again: ' + (e.message || e), 'w'); await sleep(600) }
}
}
if (failed.length && keyList().length) {
blog('Switching to Gemini voice fallback for ' + failed.length + ' remaining line(s)…', 'k');
for (const i of failed.slice()) {
try {
const vName = ev === 'auto' ? (segs[i].g === 'f' ? 'Zephyr' : 'Puck') : $('vname').value;
const genCfg = { responseModalities: ['AUDIO'], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: vName } } } };
const txt = _0x1176(segs[i].km) || segs[i].km;
const d = await gem([{ text: txt }], { models: ttsModels(), raw: true, gen: genCfg, rounds: 3 });
const mt = d.mimeType || d.mime_type || '', bin = Uint8Array.from(atob(d.data), c => c.charCodeAt(0));
const isWav = /wav/i.test(mt) || String.fromCharCode(bin[0], bin[1], bin[2], bin[3]) === 'RIFF';
await _0x141e(i, isWav ? new Blob([bin], { type: 'audio/wav' }) : rawWav(bin, +((mt.match(/rate=(\d+)/) || [])[1] || 24000)));
failed.splice(failed.indexOf(i), 1);
} catch (_) { }
}
}
await _0x1286();
$('used').textContent = 'Voice: ' + (ev === 'auto' ? 'Auto (Piseth ♂ / Sreymom ♀)' : ev) + ' via local helper';
if (failed.length) throw new Error(failed.length + ' of ' + total + ' lines failed (line ' + failed.map(i => i + 1).sort((a, b) => a - b).join(', ') + '). Press 🔊 Voice to retry only those.');
}
async function _0x11ed() {
if (!keyList().length) throw new Error('no Gemini key added');
const gen = { responseModalities: ['AUDIO'], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: $('vname').value } } } };
segs.forEach(x => { x.skip = false; x.grp = undefined });
const todo = segs.map((s, i) => ({ s, i })).filter(x => x.s.km && x.s.km.trim() && !x.s.audio);
let n = 0; const failed = [];
for (const { s, i } of todo) {
n++;
log('Generating Khmer voice with Gemini… ' + n + '/' + todo.length + (failed.length ? ' (' + failed.length + ' failed)' : ''));
const txt = _0x1176(s.km) || s.km;
try {
const d = await gem([{ text: txt }], { models: ttsModels(), raw: true, gen, rounds: 3 });
const mt = d.mimeType || d.mime_type || '', bin = Uint8Array.from(atob(d.data), c => c.charCodeAt(0));
const isWav = /wav/i.test(mt) || String.fromCharCode(bin[0], bin[1], bin[2], bin[3]) === 'RIFF';
await _0x141e(i, isWav ? new Blob([bin], { type: 'audio/wav' }) : rawWav(bin, +((mt.match(/rate=(\d+)/) || [])[1] || 24000)));
} catch (e) { failed.push(i); blog('✕ line ' + (i + 1) + ' failed: ' + (e.message || e), 'w') }
}
await _0x1286();
if (failed.length) throw new Error(failed.length + ' of ' + todo.length + ' lines failed (line ' + failed.map(i => i + 1).sort((a, b) => a - b).join(', ') + '). Press 🔊 Voice to retry only those.');
}
async function _0x11fe() {
const sel = $('voice').value, order = [sel === 'edge' ? 'edge' : 'gemini'], errs = []; let first = true;
for (const m of order) {
if (!first) segs.forEach(x => { x.audio = null; x.skip = false; x.dur = 0; x.buf = null; x.fit = null });
first = false;
try { m === 'edge' ? await _0x11dc() : await _0x11ed(); return m }
catch (e) { errs.push((m === 'edge' ? 'Edge helper: ' : 'Gemini voice: ') + (e.message || e)); log('⚠ ' + errs[errs.length - 1]) }
}
throw new Error(errs.join(' | '));
}
let voiceErr = '', voiceSel = '', _0x150c = '';
async function _0x120f() {
if ($('voice').value === 'device') return;
const curEv = $('evoice').value;
if ((voiceSel && voiceSel !== $('voice').value) || (_0x150c && _0x150c !== curEv)) {
segs.forEach(x => { x.audio = null; x.skip = false; x.dur = 0; x.buf = null; x.fit = null });
await _0x13da();
}
voiceSel = $('voice').value; _0x150c = curEv; voiceErr = ''; $('genv').disabled = true;
try { const m = await _0x11fe(); await _0x1286(); log('✓ Khmer voice ready (' + m + ').') }
catch (e) { voiceErr = e.message || String(e); throw e }
finally { $('genv').disabled = false; _0x12ca() }
}
let plan = [], active = new Set(), played = new Set();
const _mac = () => (_mac.c = _mac.c || new (window.AudioContext || window.webkitAudioContext)());
const decode = (c, ab) => new Promise((ok, no) => { const p = c.decodeAudioData(ab, ok, no); if (p && p.catch) p.catch(no) });
function _0x1220() { try { const c = _mac(); if (c.state !== 'running') c.resume(); const s = c.createBufferSource(); s.buffer = c.createBuffer(1, 1, 22050); s.connect(c.destination); s.start(0) } catch (_) { } }
function _0x1231(buf) {
const x = buf.getChannelData(0), n = x.length, sr = buf.sampleRate; let peak = 0;
for (let i = 0; i < n; i += 8) { const a = Math.abs(x[i]); if (a > peak) peak = a }
const thr = Math.max(0.004, peak * 0.03), pad = Math.round(sr * 0.03);
let a = 0, b = n - 1; while (a < n && Math.abs(x[a]) < thr) a++; while (b > a && Math.abs(x[b]) < thr) b--;
if (a >= b) return buf;
a = Math.max(0, pad ? a - pad : a); b = Math.min(n, b + pad);
if (b - a >= n - 2) return buf;
const o = _mac().createBuffer(1, b - a, sr); o.getChannelData(0).set(x.subarray(a, b)); return o;
}
function _0x1242(x, speed, sr) {
const N = Math.round(sr * 0.016) * 2, Hs = N / 2, Ha = Hs * speed, D = Math.round(sr * 0.01), len = x.length;
const outLen = Math.max(1, Math.ceil(len / speed)), out = new Float32Array(outLen + N), ws = new Float32Array(outLen + N), win = new Float32Array(N);
for (let j = 0; j < N; j++) win[j] = 0.5 - 0.5 * Math.cos(2 * Math.PI * (j + 0.5) / N);
let prev = 0;
for (let k = 0; k * Hs < outLen; k++) {
let a = Math.round(k * Ha);
if (k > 0) {
const tgt = prev + Hs; let best = a, bc = -Infinity;
if (tgt + N <= len) for (let off = -D; off <= D; off += 2) {
const s = a + off; if (s < 0 || s + N > len) continue;
let c = 0; for (let j = 0; j < N; j += 4) c += x[s + j] * x[tgt + j];
if (c > bc) { bc = c; best = s }
}
a = best;
}
prev = a; const o0 = k * Hs;
for (let j = 0; j < N; j++) { const idx = a + j, val = idx < len ? x[idx] : 0; out[o0 + j] += val * win[j]; ws[o0 + j] += win[j] }
}
for (let i = 0; i < outLen; i++) out[i] /= Math.max(ws[i], 0.5);
return out.subarray(0, outLen);
}
function _0x1253(buf, speed) {
const d = _0x1242(buf.getChannelData(0), speed, buf.sampleRate), o = _mac().createBuffer(1, d.length, buf.sampleRate);
o.getChannelData(0).set(d);
const f = Math.min(d.length >> 1, Math.round(buf.sampleRate * 0.012)), c = o.getChannelData(0);
for (let i = 0; i < f; i++) { c[i] *= i / f; c[d.length - 1 - i] *= i / f }
return o;
}
const ev0dur = () => (Number.isFinite(v.duration) && v.duration > 0 ? v.duration : 1);
async function _0x1264(pl, total, sr = 44100) {
let maxEnd = total || 1;
for (const p of pl) if (p && p.b) maxEnd = Math.max(maxEnd, (p.st || 0) + p.b.duration);
const len = Math.max(1, Math.ceil(maxEnd * sr));
const out = _mac().createBuffer(1, len, sr), d = out.getChannelData(0);
for (const p of pl) {
if (!p || !p.b) continue;
const src = p.b.getChannelData(0), sLen = src.length, sSr = p.b.sampleRate;
if (!sLen) continue;
const startIdx = Math.max(0, Math.round(Math.max(0, p.st) * sr));
if (sSr === sr) {
const end = Math.min(len, startIdx + sLen);
for (let i = startIdx, j = 0; i < end; i++, j++) d[i] += src[j] * 1.3;
} else {
const ratio = sSr / sr, outCount = Math.ceil(sLen / ratio), end = Math.min(len, startIdx + outCount);
for (let i = startIdx, j = 0; i < end; i++, j++) {
const pos = j * ratio, idx = pos | 0, frac = pos - idx;
const s0 = src[idx] || 0, s1 = idx + 1 < sLen ? src[idx + 1] : s0;
d[i] += (s0 + (s1 - s0) * frac) * 1.3;
}
}
}
let pk = 0;
for (let i = 0; i < len; i += 4) pk = Math.max(pk, Math.abs(d[i]));
if (pk > 0.98) { const k = 0.98 / pk; for (let i = 0; i < len; i++) d[i] *= k }
return out;
}
function _0x1275(buf, sec) {
const n = Math.max(1, Math.floor(sec * buf.sampleRate)), o = _mac().createBuffer(1, n, buf.sampleRate), c = o.getChannelData(0);
c.set(buf.getChannelData(0).subarray(0, n)); const f = Math.min(n, Math.round(buf.sampleRate * 0.04));
for (let i = 0; i < f; i++) c[n - 1 - i] *= i / f;
return o;
}
async function _0x1286() {
const need = segs.filter(s => s.audio && !s.dur);
for (let i = 0; i < need.length; i += 8) {
await Promise.all(need.slice(i, i + 8).map(async s => {
try { const raw = await decode(_mac(), await (await fetch(s.audio)).arrayBuffer()); s.buf = _0x1231(raw); s.dur = s.buf.duration; s.fit = null }
catch (_) { s.dur = 0; s.buf = null; s.fit = null }
}));
}
}
async function _0x1297() {
await _0x1286();
const cl = segs.map((s, i) => ({ s, i })).filter(x => x.s.audio && x.s.dur), vd = Number.isFinite(v.duration) && v.duration > 0 ? v.duration : 1e9, out = [];
let fitted = 0, cursor = 0, stretched = 0;
for (let k = 0; k < cl.length; k++) {
const { s, i } = cl[k], nx = cl[k + 1];
const st = Math.max(0, s.t, cursor);
const cueEnd = Math.max(st + 0.4, Number(s.e) > s.t ? Number(s.e) : s.t + 2.5);
const nextSt = nx ? nx.s.t : vd;
const base = Math.max(0.4, Math.min(cueEnd - st, vd - st));
const untilNext = nx ? Math.max(0.35, nextSt - st - 0.03) : Math.max(0.4, vd - st);
const slot = Math.max(base, untilNext);
let b = s.buf;
let sp = 1;
if (s.dur <= base + 0.15) {
sp = 1;
} else if (s.dur <= slot) {
const ratio = s.dur / base;
sp = ratio > 1.15 ? Math.min(1.12, ratio) : 1;
} else {
// Balanced natural pace: never rushed (max 1.16x) and never dragged (min 0.98x)
sp = Math.min(1.16, Math.max(0.98, s.dur / Math.max(0.45, untilNext)));
}
if (sp > 1.03) {
const key = sp.toFixed(3);
if (!s.fit || s.fit.k !== key || s.fit.src !== s.buf) {
s.fit = { k: key, src: s.buf, b: _0x1253(s.buf, sp) };
if (++stretched % 10 === 0) await sleep(0);
}
b = s.fit.b; fitted++;
}
const maxRemain = Math.max(0.4, vd + 0.5 - st);
if (b.duration > maxRemain) b = _0x1275(b, maxRemain);
out.push({ i, st, b });
cursor = st + b.duration + 0.02;
}
blog('Timeline fit: ' + out.length + ' clips scheduled, ' + fitted + ' adjusted to match video timing.', 'k');
return out;
}
function _0x12a8(ctx, dest, p, delay, gain) {
const off = delay < 0 ? -delay : 0; if (off >= p.b.duration - 0.02) return 0;
const n = ctx.createBufferSource(), g = ctx.createGain(); n.buffer = p.b; g.gain.value = gain; n.connect(g); g.connect(dest);
active.add(n); n.onended = () => active.delete(n);
const when = ctx.currentTime + Math.max(0, delay);
try { n.start(when, off) } catch (_) { active.delete(n); return 0 }
return when + p.b.duration - off;
}
function _0x12b9() { active.forEach(a => { a.onended = null; try { a.stop() } catch (_) { } }); active.clear(); try { speechSynthesis.cancel() } catch (_) { } }
function _0x12ca() {
const vs = speechSynthesis.getVoices();
kmVoice = vs.find(x => /^km/i.test(x.lang)) || vs.find(x => /khmer/i.test(x.name)) || null;
$('voiceNote').textContent = voiceErr ? '⚠ Voice failed: ' + voiceErr + ' — press 🔊 Voice to retry, or change the voice in the Pipeline tab.' : kmVoice ? 'Voice: ' + kmVoice.name : 'No Khmer voice installed on this device, so “Gemini voice” is the way to hear Khmer here (or add the Khmer language pack in Windows/Edge, or Google Speech Services on Android).';
}
speechSynthesis.onvoiceschanged = _0x12ca; _0x12ca();
function say(text, i) {
if (!kmVoice || (segs[i] && (segs[i].audio || segs[i].skip))) return;
const u = new SpeechSynthesisUtterance(text); u.lang = 'km-KH'; if (kmVoice) u.voice = kmVoice; u.rate = 1.05;
speechSynthesis.speak(u);
}
let _0x1473 = 0, _0x1484 = '';
async function _0x12db() {
const gen = ++_0x1473;
_0x1220(); _0x12b9(); spoken = new Set(); played = new Set();
if (v.playbackRate !== 1) v.playbackRate = 1;
if (!v.paused) v.pause();
dubbing = false;
if ((v.error || v.readyState === 0) && curFile) {
v.src = URL.createObjectURL(curFile);
v.load();
}
plan = await _0x1297();
if (gen !== _0x1473) return;
const have = segs.filter(x => x.km && x.km.trim() && !x.skip).length;
blog('Voice plan: ' + plan.length + ' of ' + have + ' lines have audio' + (plan.length < have ? ' (press 🔊 Voice to fill the missing ones)' : ''), plan.length < have ? 'w' : 'k');
v.muted = ($('vol').value === '0'); v.volume = $('vol').value / 100;
if (Math.abs(v.currentTime) > 0.05 || v.ended) {
await new Promise(res => {
let done = false;
const fin = () => { if (!done) { done = true; v.removeEventListener('seeked', fin); res() } };
v.addEventListener('seeked', fin, { once: true });
try { v.currentTime = 0 } catch (_) { fin() }
setTimeout(fin, 500);
});
if (gen !== _0x1473) return;
}
if (v.readyState < 2) {
await Promise.race([
new Promise(r => v.addEventListener('canplay', r, { once: true })),
sleep(1500)
]);
if (gen !== _0x1473) return;
}
_0x12b9(); spoken = new Set(); played = new Set(); _0x1484 = '';
dubbing = true;
try {
const c = _mac();
if (c.state === 'suspended') {
await Promise.race([c.resume().catch(() => { }), sleep(200)]);
if (c.state === 'suspended') {
const wake = () => { try { c.resume() } catch (_) { } document.removeEventListener('pointerdown', wake, true); document.removeEventListener('keydown', wake, true) };
document.addEventListener('pointerdown', wake, true);
document.addEventListener('keydown', wake, true);
}
}
await v.play();
} catch (_) {
log('✓ Khmer dub is ready! Press ▶ Replay to play with sound.');
}
}
function tick() {
if (!dubbing || !segs.length || !segs[0].km || v.paused || v.seeking || v.ended) return;
const c = v.currentTime; let cur = '';
for (let i = 0; i < segs.length; i++) {
const s = segs[i], end = Number(s.e) > s.t ? s.e : s.t + 4;
if (c >= s.t && c < end) cur = s.km;
if (!s.audio && c >= s.t && c < s.t + 1.5 && !spoken.has(i)) { spoken.add(i); say(s.km, i) }
}
if (_0x1484 !== cur) { _0x1484 = cur; $('cap').textContent = cur }
const ctx = _mac();
if (ctx.state === 'suspended') {
try { ctx.resume() } catch (_) { }
if (ctx.state !== 'running') return;
}
for (let k = 0; k < plan.length; k++) {
const p = plan[k];
if (played.has(p.i)) continue;
if (c >= p.st + p.b.duration - 0.02) { played.add(p.i); continue }
if (p.st - c <= 0.22 && c >= p.st - 0.3) { played.add(p.i); _0x12a8(ctx, ctx.destination, p, p.st - c, 1.3) }
}
}
setInterval(tick, 25); v.addEventListener('timeupdate', tick);
v.addEventListener('seeked', () => { if (dubbing) { _0x12b9(); played = new Set(); spoken = new Set(segs.map((s, i) => s.t < v.currentTime - 1 ? i : -1).filter(i => i >= 0)) } });
v.addEventListener('waiting', () => { if (dubbing) { _0x12b9(); played = new Set() } });
v.addEventListener('playing', () => { if (dubbing) { played = new Set(); tick() } });
v.addEventListener('pause', () => { try { speechSynthesis.pause() } catch (_) { } _0x12b9(); played = new Set() });
v.addEventListener('play', () => {
try { speechSynthesis.resume() } catch (_) { }
_0x1220();
if (segs.length && segs[0].km && !$('resCard').hidden) {
dubbing = true;
if (v.currentTime < 0.05) spoken = new Set();
}
played = new Set();
});
v.addEventListener('ended', () => { if (segs.length && segs[0].km) { _0x12b9(); v.playbackRate = 1 } });

$('vol').oninput = () => {
  const val = +$('vol').value;
  v.muted = (val === 0);
  v.volume = val / 100;
  const lbl = $('volLabel');
  if (lbl) {
    if (val === 0) {
      lbl.textContent = 'Muted (បិទសំឡេងដើម 0%)';
      lbl.style.color = '#f87171';
    } else {
      lbl.textContent = val + '%';
      lbl.style.color = 'var(--acc)';
    }
  }
};

let _mb = null;
const _0x12ec = () => _mb || (_mb = (async () => {
const urls = [
'https://cdn.jsdelivr.net/npm/mediabunny@1.65.0/+esm',
'https://cdn.jsdelivr.net/npm/mediabunny/+esm',
'https://esm.sh/mediabunny@1.65.0'
];
for (const u of urls) {
try { return await import(u) } catch (_) { }
}
_mb = null;
throw new Error('could not load the video encoder library — check your internet connection');
})());
async function _0x12fd(voice, dur, sr = 48000) {
log('Decoding and mixing audio tracks…');
const vGain = $('vol').value / 100;
const totalDur = Math.max(dur || 0, ev0dur(), voice ? voice.duration : 0, 1);
const len = Math.max(1, Math.ceil(totalDur * sr));
if (vGain <= 0.001 && voice && voice.sampleRate === sr) {
const out = _mac().createBuffer(2, len, sr);
const vData = voice.getChannelData(0), c0 = out.getChannelData(0), c1 = out.getChannelData(1);
const copyLen = Math.min(len, vData.length);
c0.set(vData.subarray(0, copyLen));
c1.set(vData.subarray(0, copyLen));
return out;
}
let orig = null;
if (vGain > 0.001) {
try { orig = await decode(_mac(), await curFile.arrayBuffer()) } catch (_) { blog('⚠ Original audio could not be decoded; exporting with the Khmer voice only.', 'w') }
}
const oc = new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(2, len, sr);
if (orig && vGain > 0.001) { const n = oc.createBufferSource(), g = oc.createGain(); n.buffer = orig; g.gain.value = vGain; n.connect(g); g.connect(oc.destination); n.start(0) }
if (voice) { const vs = oc.createBufferSource(); vs.buffer = voice; vs.connect(oc.destination); vs.start(0) }
return await oc.startRendering();
}
async function _0x130e(m, cfg, mixed) {
const input = new m.Input({ source: new m.BlobSource(curFile), formats: m.ALL_FORMATS });
try {
const track = await input.getPrimaryVideoTrack();
if (!track) throw new Error('no video track found in this file');
let dur = 0;
try { dur = await track.computeDuration() } catch (_) { }
if (!Number.isFinite(dur) || dur <= 0) dur = ev0dur() || mixed.duration || 1;
const t0 = performance.now();
if (m.EncodedPacketSink && m.EncodedVideoPacketSource && track.codec) {
try {
const fmt = cfg.fmt === 'mp4' ? new m.Mp4OutputFormat() : new m.WebMOutputFormat();
const supV = typeof fmt.getSupportedVideoCodecs === 'function' ? fmt.getSupportedVideoCodecs() : (cfg.fmt === 'mp4' ? ['avc', 'hevc', 'vp9', 'av1'] : ['vp8', 'vp9', 'av1']);
if (supV.includes(track.codec)) {
const decCfg = await track.getDecoderConfig();
if (decCfg) {
log('Exporting dubbed video (fast lossless stream copy)…');
const out = new m.Output({ format: fmt, target: new m.BufferTarget() });
const vsrc = new m.EncodedVideoPacketSource(track.codec);
out.addVideoTrack(vsrc, { rotation: track.rotation || 0 });
const asrc = new m.AudioBufferSource({ codec: cfg.acodec, bitrate: cfg.abitrate || 128000 });
out.addAudioTrack(asrc);
await out.start();
const psink = new m.EncodedPacketSink(track);
const meta = { decoderConfig: decCfg };
let pkts = 0, shift = 0, lastPct = -1;
for await (const pkt of psink.packets()) {
if (pkts === 0 && pkt.timestamp < 0) shift = -pkt.timestamp;
const ts = Math.max(0, pkt.timestamp + shift);
const d = Number.isFinite(pkt.duration) && pkt.duration >= 0 ? pkt.duration : 0;
const p2 = (shift !== 0 && pkt.clone) ? pkt.clone({ timestamp: ts, duration: d }) : pkt;
await vsrc.add(p2, pkts === 0 ? meta : undefined);
pkts++;
const pct = Math.min(92, Math.max(25, Math.round(25 + (ts / dur) * 67)));
if (pct !== lastPct) { lastPct = pct; _0x1495(pct) }
}
if (pkts > 0) {
vsrc.close();
_0x1495(94);
await asrc.add(mixed);
asrc.close();
_0x1495(98);
await out.finalize();
_0x1495(100);
blog('Fast lossless export: ' + pkts + ' video packets remuxed in ' + ((performance.now() - t0) / 1000).toFixed(1) + 's, duration ' + dur.toFixed(2) + 's.', 'k');
return { blob: new Blob([out.target.buffer], { type: cfg.mime }), dur, ext: cfg.fmt };
}
}
}
} catch (remuxErr) {
blog('Fast stream copy skipped (' + (remuxErr.message || remuxErr) + ') — encoding video frames instead…');
}
}
const dw = track.displayWidth || v.videoWidth || 1280, dh = track.displayHeight || v.videoHeight || 720;
let W = 1280, H = 720;
for (const maxD of [1920, 1280, 960, 640]) {
const sc = Math.min(1, maxD / Math.max(dw, dh));
const tw = Math.max(2, Math.round(dw * sc / 2) * 2), th = Math.max(2, Math.round(dh * sc / 2) * 2);
W = tw; H = th;
if (!window.VideoEncoder) break;
try {
const sup = await VideoEncoder.isConfigSupported({ codec: cfg.vcodecFull || 'avc1.42002A', width: tw, height: th, bitrate: Math.round(Math.min(8e6, Math.max(2e6, tw * th * 3))), framerate: 30 });
if (sup && sup.supported) break;
} catch (_) { }
}
const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const g2 = cv.getContext('2d', { alpha: false });
const out = new m.Output({ format: cfg.fmt === 'mp4' ? new m.Mp4OutputFormat() : new m.WebMOutputFormat(), target: new m.BufferTarget() });
const vsrc = new m.CanvasSource(cv, { codec: cfg.codec, bitrate: Math.round(Math.min(8e6, Math.max(2e6, W * H * 3))), keyFrameInterval: 2 });
out.addVideoTrack(vsrc);
const asrc = new m.AudioBufferSource({ codec: cfg.acodec, bitrate: cfg.abitrate || 128000 });
out.addAudioTrack(asrc);
await out.start();
const sink = new m.VideoSampleSink(track);
let frames = 0, lastLog = -1, lastTs = 0;
for await (const s of sink.samples()) {
try {
const rawTs = Number.isFinite(s.timestamp) ? Math.max(0, s.timestamp) : lastTs;
const ts = frames === 0 ? rawTs : Math.max(lastTs + 0.0005, rawTs);
const d = Number.isFinite(s.duration) && s.duration > 0 ? s.duration : (1 / 30);
lastTs = ts;
s.draw(g2, 0, 0, W, H);
await vsrc.add(ts, d);
} finally { s.close() }
frames++;
const sec = Math.floor(lastTs);
if (sec !== lastLog) { lastLog = sec; const ep = Math.min(96, Math.round(lastTs / dur * 100)); _0x1495(Math.max(25, ep)); log('Exporting dubbed video… ' + ep + '% (' + frames + ' frames · frame-accurate, no need to keep this tab in front)') }
}
if (!frames) throw new Error('no video frames could be decoded from this file');
vsrc.close();
_0x1495(97);
await asrc.add(mixed);
asrc.close();
_0x1495(99);
await out.finalize();
_0x1495(100);
blog('Frame-accurate export: ' + frames + ' frames encoded in ' + ((performance.now() - t0) / 1000).toFixed(1) + 's, duration ' + dur.toFixed(2) + 's (same as the original).', 'k');
return { blob: new Blob([out.target.buffer], { type: cfg.mime }), dur, ext: cfg.fmt };
} finally { try { input.dispose() } catch (_) { } }
}
async function _0x131f(blob, ext, handle) {
let where, name = 'khmer-dubbed.' + ext, usedHandle = false;
if (handle && handle.name.toLowerCase().endsWith('.' + ext)) {
try {
name = handle.name;
const w = await handle.createWritable();
await w.write(blob);
await w.close();
where = 'saved as “' + name + '” in the folder you chose';
usedHandle = true;
} catch (e) {
blog('⚠ Could not write directly to chosen file (' + (e.message || e) + '); saving to Downloads folder instead.', 'w');
usedHandle = false;
}
}
if (!usedHandle) {
const a = document.createElement('a');
a.href = URL.createObjectURL(blob);
a.download = name;
document.body.append(a);
a.click();
a.remove();
where = 'saved as “' + name + '” in your browser’s Downloads folder';
}
return { blob, name, where, handle: usedHandle };
}
async function _0x1330() {
if (!window.VideoEncoder || !window.AudioEncoder) return null;
const ok = (p, c) => p.isConfigSupported(c).then(x => !!(x && x.supported)).catch(() => false);
const vAvc = await ok(VideoEncoder, { codec: 'avc1.42002A', width: 1280, height: 720, bitrate: 4e6, framerate: 30 }) ? 'avc1.42002A'
: await ok(VideoEncoder, { codec: 'avc1.42E01E', width: 640, height: 360, bitrate: 2e6, framerate: 30 }) ? 'avc1.42E01E' : null;
const vVp9 = await ok(VideoEncoder, { codec: 'vp09.00.10.08', width: 1280, height: 720, bitrate: 4e6, framerate: 30 }) ? 'vp09.00.10.08' : null;
const vVp8 = await ok(VideoEncoder, { codec: 'vp8', width: 1280, height: 720, bitrate: 4e6, framerate: 30 }) ? 'vp8' : null;
for (const sr of [48000, 44100]) {
for (const br of [128000, 96000, 192000]) {
if (vAvc && await ok(AudioEncoder, { codec: 'mp4a.40.2', sampleRate: sr, numberOfChannels: 2, bitrate: br })) {
return { codec: 'avc', vcodecFull: vAvc, acodec: 'aac', asr: sr, abitrate: br, fmt: 'mp4', mime: 'video/mp4' };
}
}
}
if (await ok(AudioEncoder, { codec: 'opus', sampleRate: 48000, numberOfChannels: 2, bitrate: 128000 })) {
if (vAvc) return { codec: 'avc', vcodecFull: vAvc, acodec: 'opus', asr: 48000, abitrate: 128000, fmt: 'mp4', mime: 'video/mp4' };
if (vVp9) return { codec: 'vp9', vcodecFull: vVp9, acodec: 'opus', asr: 48000, abitrate: 128000, fmt: 'webm', mime: 'video/webm' };
if (vVp8) return { codec: 'vp8', vcodecFull: vVp8, acodec: 'opus', asr: 48000, abitrate: 128000, fmt: 'webm', mime: 'video/webm' };
}
return null;
}
async function _0x1341() {
segs = segs.filter(x => x.km && x.km.trim());
if (!segs.length) return log('⚠ No translated Khmer speech available to store into video.');
const mime0 = window.MediaRecorder && ['video/mp4;codecs=avc1.42E01E,mp4a.40.2', 'video/mp4;codecs=avc1.42E01E,opus', 'video/mp4', 'video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm'].find(t => { try { return MediaRecorder.isTypeSupported(t) } catch (_) { return false } });
const offCfg = await _0x1330();
if (!offCfg && (!mime0 || !HTMLCanvasElement.prototype.captureStream)) return log('⚠ This browser can’t export video (iPhone/Safari can’t). Use Chrome or Edge on a computer or on Android, or use ▶ Replay and ⬇ .srt here.');
const ext0 = offCfg ? offCfg.fmt : mime0.includes('mp4') ? 'mp4' : 'webm';
if ($('genv').disabled) { log('Waiting for the running voice generation to finish before exporting…'); while ($('genv').disabled) await sleep(500) }
const missing = () => segs.map((x, i) => ({ x, i })).filter(o => !o.x.audio && !o.x.skip && _0x1176(o.x.km));
if (missing().length) {
if ($('voice').value === 'device') return log('⚠ ' + missing().length + ' line(s) have no recorded voice (line ' + missing().map(o => o.i + 1).join(', ') + '). Device voices can’t be recorded, so the exported video would be silent there. Choose Edge or Gemini voice in the Pipeline tab, then export.');
$('exp').disabled = true;
log('Generating voice for ' + missing().length + ' line(s) that would be silent in the export…');
try { await _0x120f() } catch (e) { blog('⚠ Voice generation reported: ' + (e.message || e), 'w') }
$('exp').disabled = false; await _0x1286();
const left = segs.map((x, i) => ({ x, i })).filter(o => (!o.x.audio || !o.x.dur) && !o.x.skip && _0x1176(o.x.km));
if (left.length && !segs.some(x => x.audio && x.dur)) return log('⚠ Export stopped: no voice audio could be generated. Press 🔊 Voice to retry, or switch to Edge voice, then export again.');
if (left.length) blog('⚠ ' + left.length + ' line(s) have no voice audio (line ' + left.map(o => o.i + 1).join(', ') + ') and will be silent in the exported video.', 'w');
}
await _0x1286();
const clips = segs.map(x => ({ t: x.t, u: x.audio })).filter(c => c.u);
if (!clips.length) return log('⚠ No voice audio was produced.');
let handle = null;
if (window.showSaveFilePicker) { try { handle = await showSaveFilePicker({ suggestedName: 'khmer-dubbed.' + ext0, types: [{ description: ext0.toUpperCase() + ' video', accept: { [offCfg ? offCfg.mime : mime0.split(';')[0]]: ['.' + ext0] } }] }) } catch (e) { if (e && e.name === 'AbortError') return log('Export cancelled.'); handle = null } }
const btn = $('exp'); busy(true, 'export'); btn.disabled = true; $('replay').disabled = true; $('go').disabled = true;
v.pause(); _0x12b9(); dubbing = false;
let ac = null, ev, drv, drw, rec, result = null;
try {
log('Preparing audio…'); _0x1495(10);
const targetSr = (offCfg && offCfg.asr) || 48000;
const voice = await _0x1264(await _0x1297(), ev0dur(), targetSr); _0x1495(18);
const mixed = await _0x12fd(voice, ev0dur(), targetSr); _0x1495(24);
blog('Export: ' + clips.length + ' voice clips ready, video ' + (v.duration || 0).toFixed(1) + 's, format ' + (offCfg ? offCfg.mime + ' (frame-accurate)' : mime0.split(';')[0] + ' (real-time)'));
let rawExport = null;
if (offCfg) {
try {
log('Loading the frame-accurate exporter…');
rawExport = await _0x130e(await _0x12ec(), offCfg, mixed);
} catch (e) { blog('⚠ Frame-accurate export unavailable (' + (e.message || e) + ') — using real-time recording instead.', 'w'); rawExport = null }
}
if (rawExport) {
_0x1495(100);
result = await _0x131f(rawExport.blob, rawExport.ext, handle);
result.dur = rawExport.dur;
} else {
if (!mime0 || !HTMLCanvasElement.prototype.captureStream) throw new Error('this browser can’t record video');
ac = new (window.AudioContext || window.webkitAudioContext)();
ev = document.createElement('video'); ev.src = v.src; ev.playsInline = true; ev.muted = true;
ev.style.cssText = 'position:fixed;right:14px;bottom:calc(14px + env(safe-area-inset-bottom,0px));width:200px;max-height:200px;border-radius:12px;z-index:45;box-shadow:0 8px 30px rgba(0,0,0,.4);pointer-events:none;background:#000'; document.body.append(ev);
await new Promise((r, j) => { ev.onloadedmetadata = r; ev.onerror = () => j(new Error('Could not open the video for export.')); ev.load() });
const W0 = ev.videoWidth || 1280, H0 = ev.videoHeight || 720, sc = Math.min(1, 1280 / Math.max(W0, H0)), W = Math.max(2, Math.round(W0 * sc / 2) * 2), H = Math.max(2, Math.round(H0 * sc / 2) * 2);
const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const g2 = cv.getContext('2d', { alpha: false });
const paint = () => { try { g2.drawImage(ev, 0, 0, W, H) } catch (_) { } };
paint();
const dest = ac.createMediaStreamDestination();
const mbuf = ac.createBuffer(mixed.numberOfChannels, mixed.length, mixed.sampleRate);
for (let ch = 0; ch < mixed.numberOfChannels; ch++) mbuf.getChannelData(ch).set(mixed.getChannelData(ch));
const cs = cv.captureStream(30), vt = cs.getVideoTracks()[0];
let lastP = 0; const frame = () => { paint(); lastP = performance.now(); if (vt && typeof vt.requestFrame === 'function') try { vt.requestFrame() } catch (_) { } };
const stream = new MediaStream([vt, ...dest.stream.getAudioTracks()]);
try {
rec = new MediaRecorder(stream, { mimeType: mime0, videoBitsPerSecond: 5e6, audioBitsPerSecond: 128000 });
} catch (_) {
rec = new MediaRecorder(stream, { mimeType: mime0 });
}
const chunks = [];
rec.ondataavailable = e => e.data && e.data.size && chunks.push(e.data);
const stopped = new Promise(r => rec.onstop = r);
await ac.resume(); ev.currentTime = 0; frame();
rec.start(500);
await ev.play();
drw = setInterval(() => { if (performance.now() - lastP >= 28) frame() }, 16);
if (ev.requestVideoFrameCallback) { const cb = () => { frame(); try { ev.requestVideoFrameCallback(cb) } catch (_) { } }; ev.requestVideoFrameCallback(cb) }
const vs = ac.createBufferSource(); vs.buffer = mbuf; vs.connect(dest); active.add(vs);
vs.start(0, Math.min(ev.currentTime, Math.max(0, mbuf.duration - 0.01)));
ev.ontimeupdate = () => { const rp = ev.duration ? Math.min(98, Math.round(ev.currentTime / ev.duration * 100)) : 25; _0x1495(Math.max(25, rp)); log('Exporting dubbed video… ' + Math.round(ev.currentTime) + 's / ' + Math.round(ev.duration) + 's (real time, keep this tab open and in front)') };
await new Promise((res, rej) => {
let lastT = -1, lastChange = Date.now();
const watch = setInterval(() => {
if (ev.currentTime !== lastT) { lastT = ev.currentTime; lastChange = Date.now() }
else if (Date.now() - lastChange > 10000) { clearInterval(watch); rej(new Error('The video stopped playing during export. Keep this tab visible and try again.')) }
}, 1000);
const done = fn => (...a) => { clearInterval(watch); fn(...a) };
ev.onended = done(res);
ev.onerror = done(() => rej(new Error('The video could not be decoded during export.')));
rec.onerror = done(e => rej(new Error('Recorder error: ' + ((e.error && e.error.message) || e.error || 'unknown'))));
});
clearInterval(drv); clearInterval(drw);
active.forEach(a => { a.onended = null; try { a.stop() } catch (_) { } }); active.clear();
rec.stop(); await stopped;
const blob = new Blob(chunks, { type: mime0.split(';')[0] });
if (blob.size < 1024) throw new Error('The browser recorded no video frames. Keep this tab visible and in front, then try again (Chrome or Edge on a computer work best).');
result = await _0x131f(blob, mime0.includes('mp4') ? 'mp4' : 'webm', handle); result.dur = ev.duration || ev0dur();
}
} catch (e) { log('⚠ Export failed: ' + (e && e.name ? e.name + ' – ' : '') + (e.message || e)); try { blog(String(e && e.stack || e).split('\n').slice(0, 4).join(' | '), 'w') } catch (_) { } }
active.forEach(a => { a.onended = null; try { a.stop() } catch (_) { } }); active.clear();
try { if (rec && rec.state !== 'inactive') rec.stop() } catch (_) { }
clearInterval(drv); clearInterval(drw); busy(false); if (ev) ev.remove(); try { if (ac) ac.close() } catch (_) { } btn.disabled = false; $('replay').disabled = false; if ($('goWrap') && !$('goWrap').hidden) _0x14b7({ disabled: false });
if (result) _0x1352(result);
}
$('exp').onclick = _0x1341;
$('dlaudio').onclick = async () => {
const b = $('dlaudio'); if (!segs.some(x => x.audio)) return log('⚠ No Khmer voice yet. Press 🔊 Voice first.');
b.disabled = true;
try {
log('Merging all voice lines into one audio file…');
const out = await _0x1264(await _0x1297(), ev0dur()), blob = wavAt(out.getChannelData(0), out.sampleRate);
if (window.showSaveFilePicker) { try { const h = await showSaveFilePicker({ suggestedName: 'khmer-dub-audio.wav', types: [{ description: 'WAV audio', accept: { 'audio/wav': ['.wav'] } }] }); const w = await h.createWritable(); await w.write(blob); await w.close(); b.disabled = false; return log('✓ Saved “' + h.name + '” (one merged Khmer track, ' + out.duration.toFixed(1) + 's, same length as the video).') } catch (e) { if (e && e.name === 'AbortError') { b.disabled = false; return } } }
const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'khmer-dub-audio.wav'; a.click();
log('✓ Merged Khmer audio downloaded (' + out.duration.toFixed(1) + 's, same length as the video).');
} catch (e) { log('⚠ Merge failed: ' + (e.message || e)) }
b.disabled = false;
};
let xUrl = '';
function _0x1352(r) {
if (xUrl) URL.revokeObjectURL(xUrl); xUrl = URL.createObjectURL(r.blob);
log('✓ Exported ' + r.name + ' (' + (r.blob.size / 1048576).toFixed(1) + ' MB).');
$('xinfo').textContent = r.name + ' · ' + (r.blob.size / 1048576).toFixed(1) + ' MB · ' + Math.floor(r.dur / 60) + ':' + String(Math.floor(r.dur % 60)).padStart(2, '0');
$('xopen').href = xUrl; $('xopen').dataset.n = r.name;
$('xwhere').textContent = 'Your video was ' + r.where + '. ' + (r.handle ? '' : 'Websites can’t open folders for you: in Chrome or Edge press Ctrl+J (⌘+Shift+J on Mac) and click “Show in folder”.');
$('xmod').classList.add('on'); confetti(); setTimeout(confetti, 700); setTimeout(confetti, 1400);
}
$('xsave').onclick = () => { const a = document.createElement('a'); a.href = xUrl; a.download = $('xopen').dataset.n || 'khmer-dubbed'; a.click(); toast('Saving another copy…') };
$('xclose').onclick = () => $('xmod').classList.remove('on');
$('xmod').onclick = e => { if (e.target === $('xmod')) $('xmod').classList.remove('on') };
let _saveListTimer;
function _0x14d9(i, rowEl) {
const s = segs[i];
if (!s) return;
if (s.audio) { try { URL.revokeObjectURL(s.audio) } catch (_) { } }
s.audio = null; s.dur = 0; s.buf = null; s.fit = null; s.skip = false;
_0x13c9('audio_' + i);
if (rowEl) rowEl.classList.add('dirty');
clearTimeout(_saveListTimer);
_saveListTimer = setTimeout(() => _0x140d({ segs: _0x13fc(segs) }), 250);
}
const _0x1440 = () => {
const box = $('list');
box.innerHTML = '';

// Update Character Roles Bar
const spkBar = $('speakerBar');
const spkList = $('speakerList');
if (spkBar && spkList) {
  const speakers = {};
  segs.forEach(s => {
    const spk = s.speaker || 'S0';
    if (!speakers[spk]) speakers[spk] = { count: 0, m: 0, f: 0 };
    speakers[spk].count++;
    if (s.g === 'f') speakers[spk].f++; else speakers[spk].m++;
  });

  const spkKeys = Object.keys(speakers);
  if (spkKeys.length > 0) {
    spkBar.style.display = 'block';
    spkList.innerHTML = '';
    spkKeys.forEach(spk => {
      const data = speakers[spk];
      const isFemale = data.f >= data.m;
      const pill = document.createElement('div');
      pill.style.cssText = 'display:inline-flex;align-items:center;gap:6px;background:var(--card);padding:5px 12px;border-radius:99px;border:1px solid var(--line);font-size:12px;';
      pill.innerHTML = '<b>' + spk + ' (' + data.count + ' ប្រយោគ):</b>';
      
      const sel = document.createElement('select');
      sel.style.cssText = 'padding:2px 8px;border-radius:8px;border:1px solid var(--line);background:var(--card2);color:var(--ink);font-size:12px;cursor:pointer;';
      sel.innerHTML = '<option value="m"' + (!isFemale ? ' selected' : '') + '>♂ Piseth (ពិសិដ្ឋ)</option><option value="f"' + (isFemale ? ' selected' : '') + '>♀ Sreymom (ស្រីមុំ)</option>';
      
      sel.onchange = () => {
        const newG = sel.value;
        segs.forEach(s => {
          if ((s.speaker || 'S0') === spk) {
            s.g = newG;
            s.audio = null;
          }
        });
        _0x1440();
        toast('Updated ' + spk + ' to ' + (newG === 'f' ? '♀ Sreymom' : '♂ Piseth'));
      };

      pill.appendChild(sel);
      spkList.appendChild(pill);
    });

    const swapBtn = $('swapGendersBtn');
    if (swapBtn) {
      swapBtn.onclick = () => {
        segs.forEach(s => {
          s.g = (s.g === 'f') ? 'm' : 'f';
          s.audio = null;
        });
        _0x1440();
        toast('🔄 Swapped all character voices (Piseth ↔ Sreymom)');
      };
    }
  } else {
    spkBar.style.display = 'none';
  }
}

segs.forEach((s, i) => {
if (s.g !== 'f') s.g = 'm';
const row = document.createElement('div');
row.className = 'srow' + (!s.audio && _dubState.status === 'done' ? ' dirty' : '');
const spkTag = document.createElement('span');
spkTag.className = 'tag';
spkTag.style.cssText = 'font-size:10.5px;padding:2px 7px;font-weight:700;color:var(--acc);background:var(--soft);border-radius:6px;flex:none;';
spkTag.textContent = s.speaker || 'S0';
const ts = document.createElement('button');
ts.type = 'button'; ts.className = 'tsbtn';
ts.textContent = fmt(s.t).slice(3, 8);
ts.title = 'Jump video to ' + fmt(s.t).slice(3, 8);
ts.onclick = () => { v.currentTime = s.t };
const gb = document.createElement('button');
gb.type = 'button'; gb.className = 'gbtn ' + (s.g === 'f' ? 'f' : 'm');
const paintG = () => {
gb.className = 'gbtn ' + (s.g === 'f' ? 'f' : 'm');
gb.textContent = s.g === 'f' ? '♀ Sreymom' : '♂ Piseth';
gb.title = 'Click to switch voice between ♂ Piseth and ♀ Sreymom';
};
paintG();
gb.onclick = () => {
s.g = s.g === 'f' ? 'm' : 'f';
paintG();
_0x14d9(i, row);
};
const ed = document.createElement('textarea');
ed.className = 'km-ed';
ed.rows = 1;
ed.spellcheck = false;
ed.value = s.km || '';
const resize = () => { ed.style.height = 'auto'; ed.style.height = Math.max(28, ed.scrollHeight) + 'px' };
ed.oninput = () => {
s.km = ed.value;
resize();
_0x14d9(i, row);
};
const del = document.createElement('button');
del.type = 'button'; del.className = 'delbtn'; del.textContent = '✕';
del.title = 'Delete this subtitle line';
del.onclick = async () => {
if (segs.length <= 1) return toast('Keep at least one subtitle line.');
if (s.audio) { try { URL.revokeObjectURL(s.audio) } catch (_) { } }
segs.splice(i, 1);
_0x1440();
await _0x13eb();
await _0x140d({ segs: _0x13fc(segs) });
};
row.append(spkTag, ts, gb, ed, del);
box.append(row);
requestAnimationFrame(resize);
});
};

function getNisayKey() {
  const el = $('nisayKey');
  const k = el ? el.value.trim() : '';
  return k || 'nisay-int-shop-0d71b16d46264a65bd38b8c298cc09c7';
}

function isNisayActive() {
  const en = $('en-nisay');
  return en ? en.checked : true;
}

function setProgress(pct, label, stageText) {
  pct = Math.max(0, Math.min(100, Math.round(pct)));
  const bar = $('bar');
  if (bar) bar.style.width = pct + '%';
  const pctEl = $('progPct');
  if (pctEl) pctEl.textContent = pct + '%';
  const lbl = $('progLabel');
  if (lbl && label) lbl.textContent = label;
  if (stageText && $('bt')) $('bt').textContent = stageText + ' (' + pct + '%)';
  if ($('bs') && label) $('bs').textContent = label;
}

const step = (n, st) => {
  if (st === 'on') window.__stage = +n;
  $('s' + n).className = 's ' + st;
  if (st === 'done') {
    const p = Math.round(n / 3 * 100);
    setProgress(p, 'Step ' + n + ' completed', 'Step ' + n + ' Done');
  } else if (st === 'on') {
    const p = Math.round(Math.max(4, (n - 1) / 3 * 100 + 4));
    setProgress(p, 'Step ' + n + ' in progress...', 'Step ' + n);
  }
};


let _cachedPcm = null;

function detectPitchF0(pcmSlice, sampleRate = 16000) {
  if (!pcmSlice || pcmSlice.length < 512) return 0;
  const minLag = Math.floor(sampleRate / 340);
  const maxLag = Math.floor(sampleRate / 75);
  const pitches = [];
  const winSize = Math.min(pcmSlice.length - maxLag - 1, 1024);
  if (winSize < maxLag * 2) return 0;
  const step = Math.floor((pcmSlice.length - winSize - maxLag) / 4);
  for (let w = 1; w <= 3; w++) {
    const start = w * step;
    let bestCorr = 0;
    let bestLag = 0;
    let energy = 0;
    for (let i = 0; i < winSize; i++) {
      energy += pcmSlice[start + i] * pcmSlice[start + i];
    }
    if (energy < 0.0001) continue;
    for (let lag = minLag; lag <= maxLag; lag++) {
      let corr = 0;
      for (let i = 0; i < winSize; i++) {
        corr += pcmSlice[start + i] * pcmSlice[start + i + lag];
      }
      if (corr > bestCorr) {
        bestCorr = corr;
        bestLag = lag;
      }
    }
    if (bestLag > 0 && (bestCorr / energy) > 0.35) {
      pitches.push(sampleRate / bestLag);
    }
  }
  if (!pitches.length) return 0;
  return pitches.reduce((a, b) => a + b, 0) / pitches.length;
}

async function listenNisay(resumed) {
  const nisayKey = getNisayKey();
  if (!nisayKey) throw new Error('Please enter your NISAY API Key in the Providers tab.');

  setProgress(10, 'Preparing media for NISAY Transcriber...', 'Analyzing Media');
  log('Preparing audio for NISAY Transcribe engine…');

  let mediaFile = curFile;
  // If file is large (> 60MB), extract 16kHz WAV to ensure fast network upload
  if (!mediaFile || mediaFile.size > 60 * 1024 * 1024) {
    try {
      setProgress(12, 'Extracting 16kHz audio track from video...', 'Extracting Audio');
      const a = await _0x1165();
      const pcmList = [];
      for (let k = 0; k < a.total; k++) {
        pcmList.push(await a.getPcm(k));
        setProgress(12 + Math.round(((k + 1) / a.total) * 12), 'Extracting audio: ' + Math.round(((k + 1) / a.total) * 100) + '%', 'Extracting Audio');
      }
      const totalLen = pcmList.reduce((acc, c) => acc + c.length, 0);
      const merged = new Float32Array(totalLen);
      let offset = 0;
      for (const p of pcmList) {
        merged.set(p, offset);
        offset += p.length;
      }
      _cachedPcm = merged;
      mediaFile = new Blob([wav(merged)], { type: 'audio/wav' });
      blog('✓ Audio extracted: ' + (mediaFile.size / 1024 / 1024).toFixed(2) + ' MB WAV (16kHz mono)', 'k');
    } catch (err) {
      blog('⚠ Media fallback: using video directly (' + (err.message || err) + ')', 'w');
      mediaFile = curFile;
    }
  }

  setProgress(25, 'Sending media to NISAY Gateway (model: nisay-transcribe)...', 'NISAY Transcribing');
  log('NISAY Transcribe is extracting exact millisecond timestamps and speech cues…');

  const form = new FormData();
  form.append('file', mediaFile, (mediaFile.name || 'audio.wav'));
  form.append('model', 'nisay-transcribe');
  form.append('language', 'auto');
  form.append('response_format', 'verbose_json');
  form.append('prompt', 'Transcribe verbatim with millisecond timestamps and neutral speaker IDs.');

  const t0 = performance.now();
  const resp = await fetch('https://api.nisay.store/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + nisayKey
    },
    body: form
  });

  const elapsed = ((performance.now() - t0) / 1000).toFixed(1);
  if (resp.status === 403) throw new Error('NISAY 403 Forbidden: API Key expired or invalid. Please check https://api.nisay.store');
  if (!resp.ok) {
    const errData = await resp.json().catch(() => ({}));
    const msg = (errData.error && errData.error.message) || resp.statusText;
    if (resp.status === 422 && /no timestamped speech/i.test(msg)) {
      throw new Error('No speech detected in the audio of this video.');
    }
    throw new Error('NISAY Transcribe failed (' + resp.status + '): ' + msg);
  }

  const data = await resp.json();
  const cues = data.segments || [];
  blog('← NISAY Transcribe 200 OK (' + elapsed + 's) · ' + cues.length + ' cues detected with exact millisecond timestamps', 'k');

  if (!cues.length) {
    if (data.text && data.text.trim()) {
      return [{ t: 0, s: 0, e: v.duration || 5, text: data.text.trim(), km: '', g: 'm' }];
    }
    throw new Error('No speech was found in the video audio.');
  }

  // CRITICAL: Map both 't' (used by player, scheduler, srt, subtitles) and 's'
  const out = cues.map((seg, idx) => {
    const spk = seg.speaker || seg.speaker_id || ('S' + (idx % 2));
    const startSec = typeof seg.start === 'number' ? seg.start : parseFloat(seg.start) || 0;
    const endSec = typeof seg.end === 'number' ? seg.end : parseFloat(seg.end) || (startSec + 2.2);
    
    let pitch = 0;
    if (_cachedPcm && _cachedPcm.length) {
      const sIdx = Math.max(0, Math.floor(startSec * 16000));
      const eIdx = Math.min(_cachedPcm.length, Math.floor(endSec * 16000));
      if (eIdx > sIdx + 512) {
        pitch = detectPitchF0(_cachedPcm.subarray(sIdx, eIdx));
      }
    }

    return {
      t: Math.max(0, startSec),
      s: Math.max(0, startSec),
      e: Math.max(startSec + 0.4, endSec),
      text: String(seg.text || '').trim(),
      km: '',
      speaker: spk,
      pitch: Math.round(pitch),
      g: 'm'
    };
  }).filter(s => s.text);

  // Clean overlaps, sort strictly by timestamp t
  const cleanOut = _0x10dd(out);

  setProgress(45, 'NISAY Transcribed ' + cleanOut.length + ' cues with frame-accurate timing', 'Transcribe Complete');
  log('✓ NISAY Transcribe complete: ' + cleanOut.length + ' lines with frame-accurate timestamps.');
  return cleanOut;
}

async function translateNisay() {
  const nisayKey = getNisayKey();
  if (!nisayKey) throw new Error('Please enter your NISAY API Key in the Providers tab.');

  const catEl = $('nisayCategory');
  const category = catEl ? catEl.value : 'chinese_general';

  const need = segs.map((s, i) => i).filter(i => !segs[i].km);
  const total = need.length;
  if (!total) return;

  log('NISAY Translate (gpt-5.6-luna) starting for ' + total + ' lines...');
  const batchSize = 15;
  let done = 0;

  for (let p = 0; p < total; p += batchSize) {
    const ids = need.slice(p, p + batchSize);
    const batchTexts = ids.map(i => segs[i].text);

    const pct = 45 + Math.round((done / total) * 30);
    setProgress(pct, 'Translating with NISAY gpt-5.6-luna (' + done + '/' + total + ')...', 'NISAY Translating');
    log('Translating with NISAY gpt-5.6-luna [' + category + ']… ' + done + '/' + total);

    let success = false;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const resp = await fetch('https://api.nisay.store/v1/translate', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + nisayKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            text: batchTexts,
            source_lang: 'auto',
            target_lang: 'km',
            model: 'gpt-5.6-luna',
            category: category,
            context: 'Story genre: ' + category + '. Video dubbing lip-sync mode: Keep Khmer translations concise, natural, and punchy so speech duration fits actor mouth movements. Avoid wordy bloated expressions.'
          })
        });

        if (resp.status === 429 || resp.status >= 500) {
          blog('⚠ NISAY server busy (' + resp.status + '), retry ' + attempt + '/3...', 'w');
          await sleep(2000 * attempt);
          continue;
        }
        if (resp.status === 403) throw new Error('NISAY 403 Forbidden: API key expired or invalid.');
        if (!resp.ok) {
          const t = await resp.text();
          throw new Error('NISAY Translate error (' + resp.status + '): ' + t.slice(0, 100));
        }

        const data = await resp.json();
        const trList = data.translations || [];
        trList.forEach((item, idx) => {
          const segIdx = ids[idx];
          if (segIdx !== undefined && segs[segIdx]) {
            segs[segIdx].km = String(item.text || '').trim();
          }
        });
        success = true;
        break;
      } catch (err) {
        if (attempt === 3) throw err;
        await sleep(2000 * attempt);
      }
    }

    if (!success) {
      log('⚠ Translation batch hiccup at line ' + done);
    }

    done += ids.length;
    await _0x140d({ status: 'running', step: 2, segs: _0x13fc(segs) });
  }

  setProgress(75, 'All ' + total + ' lines translated to Khmer', 'Translate Complete');
  log('✓ NISAY Translation complete: ' + total + ' lines translated.');

  // --- Smart Character Gender Detection Engine ---
  function scoreGender(orig, km, pitch = 0) {
    orig = String(orig || '');
    km = String(km || '');
    let f = 0, m = 0;
    // Acoustic Vocal Pitch F0 Analysis (Natural Human Pitch Range)
    if (pitch >= 168) f += 6;       // Clear Female Vocal Range (168Hz - 300Hz)
    else if (pitch > 0 && pitch <= 152) m += 6; // Clear Male Vocal Range (75Hz - 152Hz)
    else if (pitch > 152 && pitch < 168) { f += 1; m += 1; } // Borderline
    // Chinese female character indicators
    if (/她|姑娘|姐姐|妹妹|妈妈|母亲|夫人|皇后|公主|娘娘|贵妃|丫鬟|丫头|臣妾|本宫|贱妾|小女|妾身|媳妇|婆婆|姑姑|阿姨|婶婶|女侠|小姐/.test(orig)) f += 3;
    if (/夫君|相公|哥哥|表哥|师兄|公子|少爷|王爷|陛下|殿下|皇上/.test(orig) && !/本王|朕|微臣/.test(orig)) f += 2;
    // Chinese male character indicators
    if (/他|爹|爸|哥|弟|皇上|陛下|王爷|老子|本王|朕|微臣|贫僧|兄弟|儿子|老公|岳父|老爹|丈夫|将军|师兄|大侠|大人|官人|小的/.test(orig)) m += 3;
    if (/娘子|夫人|爱妃|妹妹|表妹|师妹|丫头/.test(orig) && !/本宫|臣妾/.test(orig)) m += 2;
    // Khmer dialogue indicators
    if (/នាង|អ្នកនាង|ម៉ាក់|ម្ដាយ|បងស្រី|ប្អូនស្រី|អ្នកស្រី|លោកស្រី|ព្រះនាង|មហេសី|ម៉ែ|យាយ|កញ្ញា|នារី|ស្រី/.test(km)) f += 3;
    if (/លោក|គាត់|បងប្រុស|ប្អូនប្រុស|ប៉ា|ឪពុក|ព្រះអង្គ|ស្ដេច|លោកម្ចាស់|តា|ប្ដី|ប្រុស|មេទ័ព|ក្សត្រ|ចៅហ្វាយ/.test(km)) m += 3;
    return { f, m };
  }

  // Aggregate speaker character clusters (S0, S1, S2...)
  const speakerScores = {};
  segs.forEach(s => {
    const spk = s.speaker || 'S0';
    if (!speakerScores[spk]) speakerScores[spk] = { f: 0, m: 0 };
    const sc = scoreGender(s.text, s.km, s.pitch || 0);
    speakerScores[spk].f += sc.f;
    speakerScores[spk].m += sc.m;
  });

  // Assign accurate character voice (Piseth vs Sreymom)
  let fCount = 0, mCount = 0;
  segs.forEach(s => {
    const spk = s.speaker || 'S0';
    const cluster = speakerScores[spk] || { f: 0, m: 0 };
    const sc = scoreGender(s.text, s.km, s.pitch || 0);
    if (sc.f > sc.m + 1) {
      s.g = 'f';
    } else if (sc.m > sc.f + 1) {
      s.g = 'm';
    } else if (cluster.f > cluster.m) {
      s.g = 'f';
    } else if (cluster.m > cluster.f) {
      s.g = 'm';
    } else {
      s.g = (spk === 'S1' || spk === 'S3') ? 'f' : 'm';
    }
    if (s.g === 'f') fCount++; else mCount++;
  });

  blog('Character voice detection: ' + mCount + ' Piseth (♂ Male) cues, ' + fCount + ' Sreymom (♀ Female) cues.', 'k');
  segs = segs.filter(s => s.km && s.km.trim());
}

async function _0x1451(resumed) {
_0x1220();
const isResume = !!(resumed && resumed.status === 'running');
const startStep = isResume && resumed.step >= 1 ? resumed.step : 1;
const mode = isResume && (resumed._0x14fb === 'translate' || resumed._0x14fb === 'all') ? resumed._0x14fb : _0x14fb;
_0x14b7({ disabled: true }); $('resCard').hidden = true; if ($('editHint')) $('editHint').hidden = true; busy(true);
['s1', 's2', 's3'].forEach((id, idx) => step(idx + 1, idx + 1 < startStep ? 'done' : ''));
if (startStep === 1) $('bar').style.width = '0%';
try {
const pasted = isResume && typeof resumed.pasted === 'string' ? resumed.pasted : $('srtText').value.trim();
if (!pasted && !isNisayActive() && !keyList().length) throw new Error('Please enter your NISAY API key or Gemini API key in the Providers tab, or paste subtitles.');
if (v.readyState < 1) await new Promise((resolve, reject) => {
const ok = () => { cleanup(); resolve() }, bad = () => { cleanup(); reject(new Error('Could not read the video duration.')) };
const cleanup = () => { v.removeEventListener('loadedmetadata', ok); v.removeEventListener('error', bad) };
v.addEventListener('loadedmetadata', ok, { once: true }); v.addEventListener('error', bad, { once: true });
});
if (startStep <= 1) {
step(1, 'on');
if (!isResume) {
await _0x13da();
await _0x140d({ status: 'running', step: 1, pasted, listenChunkIdx: 0, listenSegs: [], segs: [], voiceSel: $('voice').value, _0x14fb: mode });
} else {
blog('↻ Resuming Step 1 (speech recognition) from saved progress…', 'k');
}
if (pasted) {
segs = _0x1099(pasted);
if (!segs.length) segs = _0x10aa(pasted);
else _0x1088();
segs.forEach(x => x.km = x.text);
} else {
if (isNisayActive()) { segs = await listenNisay(isResume ? resumed : null); } else { segs = await listen(isResume ? resumed : null); }
}
if (!segs.length) throw new Error('No speech was found in the audio.');
await _0x140d({ status: 'running', step: 2, pasted, listenChunkIdx: 0, listenSegs: [], segs: _0x13fc(segs), _0x14fb: mode });
} else {
segs = Array.isArray(resumed.segs) ? resumed.segs : [];
}
step(1, 'done');
if (startStep <= 2) {
step(2, 'on');
if (isResume && startStep === 2) blog('↻ Resuming Step 2 (Khmer translation) from saved progress…', 'k');
if (segs.some(x => !x.km)) { if (isNisayActive()) { await translateNisay(); } else { await translate(); } }
segs = segs.filter(s => s.km && s.km.trim() && (pasted || s.km !== s.text || /[\u1780-\u17FF]/.test(s.km)));
if (!segs.length) throw new Error('Translation incomplete. No translated Khmer speech to store into video.');
if (!pasted) await _0x1154();
{ const n0 = segs.length; segs = _0x11a9(segs); if (segs.length !== n0) blog('Split long lines: ' + n0 + ' → ' + segs.length + ' lines (each short enough for the voice)', 'k') }
await _0x140d({ status: 'running', step: 3, pasted, listenChunkIdx: 0, listenSegs: [], segs: _0x13fc(segs), voiceSel: $('voice').value, _0x14fb: mode });
}
step(2, 'done');
if (mode === 'translate' && (!isResume || startStep <= 2)) {
await _0x140d({ status: 'awaiting_voice', step: 2, pasted, listenChunkIdx: 0, listenSegs: [], segs: _0x13fc(segs), voiceSel: $('voice').value, _0x14fb: mode });
_0x1440();
$('resCard').hidden = false;
if ($('editHint')) $('editHint').hidden = false;
$('genv').textContent = '🔊 Generate Audio';
$('genv').classList.add('p');
_0x12ca();
busy(false);
_0x14b7({ hidden: false, disabled: false });
log('✓ Subtitles & speaker genders ready! Edit text or toggle ♂ Piseth / ♀ Sreymom, then click 🔊 Generate Audio.');
try { $('resCard').scrollIntoView({ behavior: 'smooth', block: 'nearest' }) } catch (_) { }
return;
}
step(3, 'on');
if (isResume && startStep === 3) {
blog('↻ Resuming Step 3 (Khmer voice synthesis) from saved audio clips…', 'k');
voiceSel = resumed.voiceSel || $('voice').value;
await _0x142f();
}
let vnote = '';
if ($('voice').value !== 'device') { try { await _0x120f() } catch (e) { vnote = ' (no voice audio — see the note under the script, then press 🔊 Voice to retry)' } }
_0x1440();
$('resCard').hidden = false; if ($('editHint')) $('editHint').hidden = true;
$('genv').textContent = '🔊 Voice'; $('genv').classList.remove('p');
_0x12ca();
_0x14b7({ hidden: true, disabled: false });
await _0x140d({ status: 'done', step: 3, pasted, listenChunkIdx: 0, listenSegs: [], segs: _0x13fc(segs), voiceSel: $('voice').value, _0x14fb: 'all' });
step(3, 'done'); busy(false); confetti();
plan = await _0x1297();
dubbing = true;
v.pause();
try { v.currentTime = 0; } catch (_) {}
setProgress(100, '✓ Dubbing complete! Click ▶ Play to watch with sound.', 'Completed');
log('✓ Dubbing complete! Click ▶ Play on the video or "▶ Replay" to watch with Khmer dubbing.' + vnote);
toast('✓ Dubbing complete! Click Play to watch');
} catch (e) { log('⚠ ' + (e.message || 'Something went wrong.')); dubbing = false }
busy(false);
if ($('goWrap') && !$('goWrap').hidden) _0x14b7({ disabled: false });
}
$('go').onclick = () => _0x1451(null);
async function _0x1462() {
try {
const [f, st] = await Promise.all([_0x13a7('videoFile'), _0x13a7('dubState')]);
if (!f || !(f instanceof Blob)) return;
load(f, true);
if (!st || !st.status || st.status === 'idle') return;
_dubState = st;
if (st._0x14fb === 'translate' || st._0x14fb === 'all') { _0x14fb = st._0x14fb; _0x14c8(); }
if (v.readyState < 1) await Promise.race([
new Promise(r => v.addEventListener('loadedmetadata', r, { once: true })),
sleep(2500)
]);
if (st.status === 'done' && Array.isArray(st.segs) && st.segs.length) {
segs = st.segs;
voiceSel = st.voiceSel || $('voice').value;
await _0x142f();
await _0x1286();
['s1', 's2', 's3'].forEach(i => step(i.slice(1), 'done'));
$('bar').style.width = '100%';
_0x1440();
$('resCard').hidden = false;
if ($('editHint')) $('editHint').hidden = true;
$('genv').textContent = '🔊 Voice'; $('genv').classList.remove('p');
_0x14b7({ hidden: true, disabled: false });
_0x12ca();
plan = await _0x1297();
v.volume = $('vol').value / 100;
dubbing = true;
log('✓ Restored your dubbed video session. Press ▶ Replay or 🎞 Export dubbed video.');
} else if (st.status === 'awaiting_voice' && Array.isArray(st.segs) && st.segs.length) {
segs = st.segs;
['s1', 's2'].forEach(i => step(i.slice(1), 'done'));
step(3, '');
_0x1440();
$('resCard').hidden = false;
if ($('editHint')) $('editHint').hidden = false;
$('genv').textContent = '🔊 Generate Audio';
$('genv').classList.add('p');
_0x14b7({ hidden: false, disabled: false });
_0x12ca();
log('✓ Restored translated subtitles. Edit text/genders and press 🔊 Generate Audio when ready.');
} else if (st.status === 'running') {
toast('↻ Resuming dubbing process…');
await _0x1451(st);
}
} catch (_) { }
}
setTimeout(_0x1462, 80);
$('replay').onclick = () => { _0x1220(); _0x12db() };
$('dl').onclick = async () => {
const srt = segs.map((x, i) => (i + 1) + '\n' + fmt(x.t) + ' --> ' + fmt(x.e || (segs[i + 1] ? segs[i + 1].t - .1 : x.t + 4)) + '\n' + (x.g === 'f' ? '[F] ' : '[M] ') + x.km + '\n').join('\n'), blob = new Blob([srt], { type: 'text/plain' });
if (window.showSaveFilePicker) { try { const h = await showSaveFilePicker({ suggestedName: 'khmer-dub.srt', types: [{ description: 'Subtitles', accept: { 'text/plain': ['.srt'] } }] }); const w = await h.createWritable(); await w.write(blob); await w.close(); return log('✓ Saved “' + h.name + '”.') } catch (e) { if (e && e.name === 'AbortError') return } }
const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'khmer-dub.srt'; a.click();
};
document.querySelectorAll('[data-tab]').forEach(b => b.onclick = () => { document.querySelectorAll('[data-tab]').forEach(x => x.classList.toggle('on', x === b)); document.querySelectorAll('.panel').forEach(p => p.hidden = p.id !== 'tab-' + b.dataset.tab) });
try { const t = localStorage.getItem('kd_theme'); if (t === 'light' || t === 'dark') document.documentElement.dataset.theme = t } catch (_) { }
$('theme').onclick = () => { const r = document.documentElement, dark = r.dataset.theme !== 'light'; r.dataset.theme = dark ? 'light' : 'dark'; try { localStorage.setItem('kd_theme', r.dataset.theme) } catch (_) { } };
const setList = (id, arr) => { if (arr.length) { $(id).value = arr.join('\n'); $(id).dispatchEvent(new Event('input')) } };
document.querySelectorAll('[data-refresh]').forEach(b => b.onclick = async () => {
const w = b.dataset.refresh, old = b.textContent; b.textContent = '…';
try {
const keys = keyList();
if (!keys.length) throw 0;
let j = null;
for (const k of keys) {
try {
let res = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=' + encodeURIComponent(k) + '&pageSize=100');
if (!res.ok) {
res = await fetch('https://generativelanguage.googleapis.com/v1beta/models?pageSize=100', { headers: { 'x-goog-api-key': k } });
}
if (res.ok) {
const data = await res.json();
if (data && data.models && data.models.length) { j = data; break; }
}
} catch (_) { }
}
if (!j || !j.models) throw new Error('Failed to load models. Check your API key and connection.');
const all = (j.models || []).filter(m => (m.supportedGenerationMethods || []).includes('generateContent')).map(m => m.name.replace('models/', ''));
const freeGen = all.filter(i => /^gemini-/i.test(i) && !/embedding|imagen|veo|aqa|vision|image|robotics|computer-use/i.test(i));
const mergedModels = [...new Set([..._0x1011, ...freeGen.filter(i => !/tts/i.test(i))])];
const mergedVoice = [...new Set([..._0x1022, ...freeGen.filter(i => /tts|2\.5-flash|2\.0-flash/i.test(i))])];
setList('model', mergedModels);
setList('ttsmodel', mergedVoice);
b.textContent = '✓ Loaded (' + mergedModels.length + ')';
toast('✓ Loaded ' + mergedModels.length + ' free models');
} catch (e) {
b.textContent = e === 0 ? 'Add a key first' : '⚠ Failed';
toast(e === 0 ? 'Add a Gemini key first' : (e.message || 'Failed to load models'));
}
setTimeout(() => b.textContent = old, 2500);
});
$('etest').onclick = async () => {
const m = $('etestmsg'); m.textContent = 'Checking…';
try { const j = await (await fetch($('eurl').value.trim().replace(/\/$/, '') + '/ping')).json(); m.textContent = j.ok ? '✓ Helper is running' : 'Unexpected answer' }
catch (_) { m.textContent = '⚠ Not reachable. Check the Worker link (https://…workers.dev) and try again.' }
};
$('genv').onclick = async () => {
_0x1220();
if ($('voice').value === 'device') {
if (_dubState.status === 'awaiting_voice') {
if ($('editHint')) $('editHint').hidden = true;
$('genv').textContent = '🔊 Voice'; $('genv').classList.remove('p');
_0x14b7({ hidden: true, disabled: false });
await _0x140d({ status: 'done', step: 3, segs: _0x13fc(segs), voiceSel: $('voice').value, _0x14fb: 'all' });
step(3, 'done'); confetti();
plan = await _0x1297();
dubbing = true;
v.pause();
try { v.currentTime = 0; } catch (_) {}
log('✓ Khmer voice ready! Click ▶ Play on the video to watch.');
toast('✓ Khmer voice ready! Click Play to watch');
return;
}
return log('The device voice needs no generation.');
}
_0x14b7({ disabled: true });
step(3, 'on');
busy(true);
window.__stage = 3;
if ($('bstage')) $('bstage').textContent = _0x1044[3];
try {
segs = segs.filter(x => x.km && _0x1187(_0x1176(x.km) || x.km));
if (!segs.length) throw new Error('No speakable Khmer subtitles found.');
await _0x120f();
_0x1440();
if ($('editHint')) $('editHint').hidden = true;
$('genv').textContent = '🔊 Voice'; $('genv').classList.remove('p');
_0x14b7({ hidden: true, disabled: false });
await _0x140d({ status: 'done', step: 3, segs: _0x13fc(segs), voiceSel: $('voice').value, _0x14fb: 'all' });
step(3, 'done'); busy(false); confetti();
plan = await _0x1297();
dubbing = true;
v.pause();
try { v.currentTime = 0; } catch (_) {}
log('✓ Khmer voice ready! Click ▶ Play on the video or "▶ Replay" to watch.');
toast('✓ Khmer voice ready! Click Play to watch');
} catch (e) {
busy(false);
if ($('goWrap') && !$('goWrap').hidden) _0x14b7({ disabled: false });
log('⚠ ' + (e.message || e));
}
};
function _0x1363(id) {
const ta = $(id), ph = ta.placeholder || 'API key'; ta.style.display = 'none';
const box = document.createElement('div'), ctl = document.createElement('div'), add = document.createElement('button'), eye = document.createElement('button'), chk = document.createElement('button'), cnt = document.createElement('span');
box.className = 'keys'; ctl.className = 'kctl'; ta.after(box); box.after(ctl);
add.className = eye.className = chk.className = 'b'; add.type = eye.type = chk.type = 'button'; add.textContent = '＋ Add key'; eye.textContent = '👁 Show'; chk.textContent = '✓ Check keys'; chk.title = 'Test every key now to see if it is ready or rate-limited'; cnt.className = 'note'; cnt.style.margin = '0 0 0 auto'; ctl.append(add, eye, chk, cnt);
let show = false; const inputs = () => [...box.querySelectorAll('input')];
const paint = () => inputs().forEach(i => { const sp = i.parentNode.querySelector('.ks'), f = keyInfo(i.value.trim()); if (!sp) return; sp.hidden = !f; if (f) { sp.textContent = f.t; sp.className = 'ks ' + f.c; sp.title = f.title || '' } });
window.paintKeys = paint; setInterval(paint, 1000);
chk.onclick = async () => {
const K = keyList(), M = modelList(); if (!K.length) return log('⚠ Add a Gemini key first.'); if (!M.length) return log('⚠ Add a model first.');
chk.disabled = true; blog('Checking ' + K.length + ' key(s)…');
for (let ki = 0; ki < K.length; ki++) {
const who = 'key ' + (ki + 1) + '/' + K.length, t0 = performance.now(); let r, j, usedM = M[0];
for (const m of M) {
if (cool[m + '|' + K[ki]] === Infinity) continue;
usedM = m;
try { const resp = await _0x1066(m, K[ki], { contents: [{ role: 'user', parts: [{ text: 'hi' }] }], generationConfig: { maxOutputTokens: 5 } }); r = resp.r; j = resp.j }
catch (_) { r = null; break }
if (r && r.status === 404) { setCool(m + '|' + K[ki], Infinity); continue }
break;
}
const id = usedM + '|' + K[ki];
if (!r) { setCool(id, Date.now() + 60000); blog('✕ ' + who + ': network error → resting 1 min', 'w'); paint(); continue }
const el = ((performance.now() - t0) / 1000).toFixed(1) + 's', msg = (j.error && j.error.message) || String(r.status);
if (r.ok) { delete cool[id]; delete dly[id]; delete keyBad[K[ki]]; setCool(id, 0); blog('✓ ' + who + ': ready with ' + usedM + ' (' + el + ')', 'k') }
else if (r.status === 403 || (r.status === 400 && /api key/i.test(msg))) { keyBad[K[ki]] = msg.slice(0, 100); blog('✕ ' + who + ': invalid or blocked key — ' + msg.slice(0, 120), 'w') }
else if (r.status === 404) { setCool(id, Infinity); blog('✕ ' + who + ': no active model found in list', 'w') }
else if (r.status === 429) { const c = classify(j); if (c.daily) { setCool(id, nextReset(), true); blog('✕ ' + who + ': limit reached for today on ' + usedM + ' (resets in ~' + dur(nextReset() - Date.now()) + ')', 'w') } else { setCool(id, Date.now() + Math.max(60000, c.wait)); blog('✕ ' + who + ': rate-limited right now → resting ' + dur(Math.max(60000, c.wait)), 'w') } }
else { setCool(id, Date.now() + 60000); blog('✕ ' + who + ': error ' + r.status + ' — ' + msg.slice(0, 120) + ' → resting 1 min', 'w') }
paint();
}
chk.disabled = false; paint();
};
const sync = () => {
const seen = new Set(), v = [];
inputs().forEach(inp => {
const val = inp.value.trim();
if (val) {
if (seen.has(val)) {
inp.value = '';
toast('Duplicate key removed');
} else {
seen.add(val);
v.push(val);
}
}
});
ta.value = v.join('\n');
ta.dispatchEvent(new Event('input'));
cnt.textContent = v.length + (v.length === 1 ? ' key' : ' keys');
[...box.children].forEach((r, i) => r.firstChild.textContent = i + 1);
};
async function _0x1374(inputEl, val, rowEl) {
val = String(val || '').trim();
if (!val) { inputEl.value = ''; sync(); paint(); return false }
const isDup = inputs().some(inp => inp !== inputEl && inp.value.trim() === val);
if (isDup) {
inputEl.value = '';
toast('Duplicate key is not allowed');
sync(); paint();
return false;
}
const ks = rowEl.querySelector('.ks');
if (ks) { ks.hidden = false; ks.textContent = 'Verifying…'; ks.className = 'ks warn'; }
inputEl.disabled = true;
const res = await _0x1055(val);
inputEl.disabled = false;
if (!res.ok) {
inputEl.value = '';
if (ks) { ks.hidden = false; ks.textContent = 'Invalid'; ks.className = 'ks bad'; ks.title = res.msg; }
toast('⚠ ' + res.msg);
sync(); paint();
return false;
}
inputEl.value = val;
if (ks) {
ks.hidden = false;
ks.textContent = res.warn ? 'Valid (busy)' : 'Ready';
ks.className = 'ks ' + (res.warn ? 'warn' : 'ok');
ks.title = res.msg;
}
toast('✓ Gemini key verified and added');
sync(); paint();
return true;
}
function row(v, after) {
const r = document.createElement('div'), n = document.createElement('span'), i = document.createElement('input'), x = document.createElement('button');
r.className = 'kr'; i.type = 'text'; i.className = show ? '' : 'mask'; i.value = v || ''; i.placeholder = ph; i.autocomplete = 'off'; i.spellcheck = false;
x.type = 'button'; x.className = 'kx'; x.textContent = '✕'; x.title = 'Remove this key'; const ks = document.createElement('span'); ks.className = 'ks'; ks.hidden = true;
i.onchange = async () => {
if (i.value.trim()) {
await _0x1374(i, i.value.trim(), r);
} else {
sync(); paint();
}
};
i.oninput = () => {
const val = i.value.trim();
if (val && inputs().some(inp => inp !== i && inp.value.trim() === val)) {
i.value = '';
toast('Duplicate key is not allowed');
sync(); paint();
}
};
i.onpaste = async e => {
e.preventDefault();
const raw = (e.clipboardData || window.clipboardData).getData('text') || '';
const p = raw.split(/[\s,]+/).map(s => s.trim()).filter(Boolean);
if (!p.length) return;
const existing = new Set(inputs().filter(inp => inp !== i).map(inp => inp.value.trim()).filter(Boolean));
const unique = [];
for (const k of p) {
if (!existing.has(k) && !unique.includes(k)) unique.push(k);
}
if (!unique.length) {
toast('Duplicate key is not allowed');
return;
}
toast('Verifying key(s)…');
await _0x1374(i, unique[0], r);
let last = r;
for (let idx = 1; idx < unique.length; idx++) {
const newRow = row('', last);
const newInp = newRow.querySelector('input');
const ok = await _0x1374(newInp, unique[idx], newRow);
if (ok) { last = newRow } else { newRow.remove() }
}
};
x.onclick = () => { if (box.children.length > 1) r.remove(); else i.value = ''; sync() };
r.append(n, i, ks, x); after ? after.after(r) : box.append(r); return r;
}
add.onclick = () => {
const empty = inputs().find(inp => !inp.value.trim());
if (empty) { empty.focus(); return; }
const r = row(''); sync(); r.querySelector('input').focus();
};
eye.onclick = () => { show = !show; inputs().forEach(i => i.classList.toggle('mask', !show)); eye.textContent = show ? '🙈 Hide' : '👁 Show' };
const init = [...new Set(ta.value.split(/[\s,]+/).filter(Boolean))]; (init.length ? init : ['']).forEach(v => row(v)); sync();
}
['key'].forEach(_0x1363);
const voiceVis = () => { const v = $('voice').value; $('v-edge').hidden = v !== 'edge'; $('v-gemini').hidden = v !== 'gemini' };
$('voice').addEventListener('change', voiceVis); voiceVis();
const MSG = {
1: ['Listening to every sentence 🎧', 'Detecting speech rhythm and pauses', 'Filtering background noise and breaths', 'Finalizing speech segment boundaries'],
2: ['Translating into natural spoken Khmer 🇰🇭', 'Polishing conversational flow and nuances', 'Matching natural speech phrasing', 'Translating remaining dialogues'],
3: ['Synthesizing natural Khmer voiceover 🎙', 'Fine-tuning voice rhythm & pitch', 'Aligning Khmer voice onto video slots', 'Applying acoustic timeline compression ✨'],
export: ['Encoding high-definition video 🎞', 'Muxing frame-accurate Khmer dub', 'Rendering master audio track', 'Saving finished video file']
};
const _0x1044 = {
1: 'AI Speech Recognition 🎧',
2: 'AI Khmer Translation 🇰🇭',
3: 'AI Khmer Voice Synthesis 🎙️',
export: 'Video Encoder Pipeline 🎞️'
};
let bTimer, bI = 0, bT0 = 0;
function _0x1495(pct) {
const bar = $('expbar'), tx = $('exppct'), p = Math.max(0, Math.min(100, Math.round(pct || 0)));
if (bar) bar.style.width = Math.max(6, p) + '%';
if (tx) tx.textContent = p + '%';
}
function busy(on, mode) {
const b = $('busy'), t = $('bt'), sub = $('bs'), st = $('bstage'), sg = $('stage'), ov = $('expOv'), exT = $('expbt'), exSub = $('expbs'), exSt = $('expstage');
clearInterval(bTimer);
const isExp = !!on && mode === 'export';
b.classList.toggle('on', !!on && !isExp);
b.classList.toggle('exporting', isExp);
document.body.classList.toggle('exporting', isExp);
if (ov) ov.classList.toggle('on', isExp);
if (sg) sg.classList.toggle('export-active', isExp);
if (!on) return;
if (isExp) _0x1495(4);
window.__stage = 1; bI = 0; bT0 = Date.now();
const currentMode = mode || window.__stage;
if (st) st.textContent = _0x1044[currentMode] || 'AI Dubbing Engine';
if (exSt && isExp) exSt.textContent = _0x1044.export;
const show = () => {
if (st) st.textContent = _0x1044[mode || window.__stage] || 'AI Dubbing Engine';
const L = MSG[mode || window.__stage] || MSG[1]; t.classList.add('sw');
if (isExp && exT) exT.classList.add('sw');
setTimeout(() => {
const msg = L[bI++ % L.length];
t.textContent = msg; t.classList.remove('sw');
if (isExp && exT) { exT.textContent = msg; exT.classList.remove('sw') }
}, 280);
};
const tickT = () => {
const s = Math.floor((Date.now() - bT0) / 1000);
const msg = (isExp ? 'Rendering video: ' : 'Processing: ') + Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0') + ' · please keep this tab active';
sub.textContent = msg;
if (isExp && exSub) exSub.textContent = msg;
};
show(); tickT(); let n = 0; bTimer = setInterval(() => { tickT(); if (++n % 3 === 0) show() }, 1000);
}
function confetti() {
const c = ['#4f46e5', '#9333ea', '#f59e0b', '#10b981', '#ef4444', '#06b6d4'];
for (let i = 0; i < 46; i++) { const e = document.createElement('i'); e.className = 'cf'; e.style.cssText = 'left:' + Math.random() * 100 + 'vw;background:' + c[i % 6] + ';animation-duration:' + (2 + Math.random() * 2.2) + 's;animation-delay:' + Math.random() * .5 + 's'; document.body.append(e); setTimeout(() => e.remove(), 5200) }
}
const toast = m => { const t = $('toast'); t.textContent = m; t.classList.add('on'); setTimeout(() => t.classList.remove('on'), 2600) };
const tgOk = u => /^https:\/\/(t\.me|telegram\.me)\/[A-Za-z0-9_+\/-]{3,}$/i.test(u) && !/YOUR_USERNAME/i.test(u);
function _0x1385() {
const e = $('merr'), a = $('tg'), ok = tgOk(_0x1000);
e.classList.remove('on');
if (ok) { a.href = _0x1000; a.style.display = '' }
else { a.removeAttribute('href'); a.style.display = 'none'; void e.offsetWidth; e.textContent = '⚠ Telegram link is not set or invalid. Open the file and set _0x1000 to a link like https://t.me/yourname'; e.classList.add('on') }
$('mod').classList.add('on');
}
$('donateBtn').onclick = _0x1385;
$('donateLink').onclick = (e) => { window.open('https://t.me/toladubberprov1', '_blank'); e.preventDefault(); };
$('mclose').onclick = () => $('mod').classList.remove('on');
$('mod').onclick = e => { if (e.target === $('mod')) $('mod').classList.remove('on') };

document.addEventListener('keydown', e => { if (e.key === 'Escape') { $('mod').classList.remove('on'); $('xmod').classList.remove('on') } });

if ($('nisayTestBtn')) {
  $('nisayTestBtn').onclick = async () => {
    const k = getNisayKey();
    const st = $('nisayKeyStatus');
    if (!k) {
      if (st) { st.textContent = '⚠ Please enter a NISAY API Key'; st.style.color = '#f87171'; }
      return;
    }
    if (st) { st.textContent = 'Checking key with Nisay Gateway...'; st.style.color = 'var(--mute)'; }
    try {
      const r = await fetch('https://api.nisay.store/v1/translate', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + k,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: 'hello',
          source_lang: 'auto',
          target_lang: 'km',
          model: 'gpt-5.6-luna',
          category: 'chinese_general'
        })
      });
      if (r.ok) {
        if (st) { st.textContent = '✓ NISAY API Key is ACTIVE & Valid!'; st.style.color = 'var(--ok)'; }
        toast('✓ NISAY API Key verified successfully');
      } else if (r.status === 403) {
        if (st) { st.textContent = '✕ 403 Forbidden: Key is invalid or expired'; st.style.color = '#f87171'; }
      } else {
        if (st) { st.textContent = '⚠ HTTP ' + r.status + ' response'; st.style.color = '#f59e0b'; }
      }
    } catch (err) {
      if (st) { st.textContent = '✕ Connection error: ' + (err.message || err); st.style.color = '#f87171'; }
    }
  };
}



async function clearAllSavedSession() {
  try {
    const db = await _0x1396();
    const tx = db.transaction('kv', 'readwrite');
    const st = tx.objectStore('kv');
    st.delete('dubState');
    st.delete('videoFile');
    const req = st.openCursor();
    req.onsuccess = e => {
      const cur = e.target.result;
      if (cur) {
        if (String(cur.key).startsWith('audio_')) cur.delete();
        cur.continue();
      }
    };
  } catch (_) {}
  segs = [];
  dubbing = false;
  plan = [];
  played = new Set();
  spoken = new Set();
  $('resCard').hidden = true;
  if ($('speakerBar')) $('speakerBar').style.display = 'none';
  if ($('editHint')) $('editHint').hidden = true;
  _0x14b7({ hidden: false, disabled: false });
  ['s1', 's2', 's3'].forEach(i => $(i).className = 's');
  setProgress(0, 'Cache cleared. Ready for fresh dubbing!', 'Ready');
  log('✓ Session cache cleared. You can now start a fresh dub!');
  toast('✓ Cleared saved session cache');
}

if ($('resetBtn')) $('resetBtn').onclick = clearAllSavedSession;
if ($('clearCacheBtn')) $('clearCacheBtn').onclick = clearAllSavedSession;

})();
