// ../../../.gemini/antigravity/brain/cf2d3203-3520-4742-b236-845637dba62c/scratch/cf-edge-tts/src/lib/http.ts
var CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};
function buildHeaders(headers = {}, defaults = {}) {
  const merged = new Headers(defaults);
  new Headers(headers).forEach((value, key) => {
    merged.set(key, value);
  });
  return merged;
}
function json(data, init = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: buildHeaders(init.headers, {
      ...CORS_HEADERS,
      "Content-Type": "application/json; charset=utf-8"
    })
  });
}
function errorResponse(status, code, message) {
  return json(
    {
      error: { code, message }
    },
    { status }
  );
}
function noContent() {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS
  });
}
function withCors(response) {
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: buildHeaders(response.headers, CORS_HEADERS)
  });
}

// ../../../.gemini/antigravity/brain/cf2d3203-3520-4742-b236-845637dba62c/scratch/cf-edge-tts/src/handlers/health.ts
function handleHealth() {
  return json({ ok: true });
}

// ../../../.gemini/antigravity/brain/cf2d3203-3520-4742-b236-845637dba62c/scratch/cf-edge-tts/src/lib/sec-ms-gec.ts
var WIN_EPOCH_SECONDS = 11644473600;
var TOKEN_WINDOW_SECONDS = 300;
var SHA256_INITIAL = [
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
];
var SHA256_PREFIX_STATE = [
  4255104674,
  2435071207,
  3192492180,
  3442351626,
  1811967817,
  79508907,
  4272990180,
  66059218
];
var SHA256_PREFIX_SCHEDULE = [
  3945054110,
  358115615,
  2696978146,
  217723578,
  2787307148,
  3520959633,
  3235718560,
  4192668342,
  4039316851,
  1884868174,
  1904797190,
  15051571,
  3529027680,
  1920361828
];
var SHA256_ROUND_CONSTANTS = [
  1116352408,
  1899447441,
  3049323471,
  3921009573,
  961987163,
  1508970993,
  2453635748,
  2870763221,
  3624381080,
  310598401,
  607225278,
  1426881987,
  1925078388,
  2162078206,
  2614888103,
  3248222580,
  3835390401,
  4022224774,
  264347078,
  604807628,
  770255983,
  1249150122,
  1555081692,
  1996064986,
  2554220882,
  2821834349,
  2952996808,
  3210313671,
  3336571891,
  3584528711,
  113926993,
  338241895,
  666307205,
  773529912,
  1294757372,
  1396182291,
  1695183700,
  1986661051,
  2177026350,
  2456956037,
  2730485921,
  2820302411,
  3259730800,
  3345764771,
  3516065817,
  3600352804,
  4094571909,
  275423344,
  430227734,
  506948616,
  659060556,
  883997877,
  958139571,
  1322822218,
  1537002063,
  1747873779,
  1955562222,
  2024104815,
  2227730452,
  2361852424,
  2428436474,
  2756734187,
  3204031479,
  3329325298
];
var SHA256_ROUND_14_ADJUSTMENT = 3386640039;
var SHA256_PREFIX_BLOCK_CONSTANTS = SHA256_ROUND_CONSTANTS.map(
  (constant, index) => index === 14 ? SHA256_ROUND_14_ADJUSTMENT : constant
);
var SHA256_SIGMA0_ADJUSTMENT = 94112640;
var SHA256_SIGMA1_ADJUSTMENT = 758464;
var CS64_COEFFICIENTS = [
  [3895366065, 3005677776],
  [1155409094, 2296378653],
  [1005282748, 693190712],
  [3365689651, 3005795295],
  [2367603217, 3557143765],
  [827258325, 652566332],
  [3911487921, 1618477510],
  [4037392853, 2192753147],
  [101076211, 4199654362],
  [3665427040, 545047652],
  [3201434976, 1010595059],
  [2314848760, 3536931681],
  [905590982, 3137643201],
  [3410617286, 3311559015]
];
var CS64_FACTOR = 2190031155;
var CS64_ADJUSTMENT0 = 4076407578;
var CS64_ADJUSTMENT1 = 186253312;
function rotr(value, bits) {
  return (value >>> bits | value << 32 - bits) >>> 0;
}
function rol16(value) {
  return (value << 16 | value >>> 16) >>> 0;
}
function sigma0(value) {
  return (rotr(value, 7) ^ rotr(value, 18) ^ value >>> 3) >>> 0;
}
function sigma1(value) {
  return (rotr(value, 17) ^ rotr(value, 19) ^ value >>> 10) >>> 0;
}
function expandSchedule(words, firstWord = 16) {
  for (let index = firstWord; index < 64; index += 1) {
    words[index] = sigma1(words[index - 2]) + words[index - 7] + sigma0(words[index - 15]) + words[index - 16] >>> 0;
  }
}
function compress(state, words, firstRound = 0) {
  const constants = firstRound === 14 ? SHA256_PREFIX_BLOCK_CONSTANTS : SHA256_ROUND_CONSTANTS;
  let [a, b, c, d, e, f, g, h] = state;
  for (let index = firstRound; index < 64; index += 1) {
    const t1 = h + (rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25)) + (g ^ e & (f ^ g)) + constants[index] + words[index] >>> 0;
    const t2 = (rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22)) + (a & b | c & (a | b)) >>> 0;
    h = g;
    g = f;
    f = e;
    e = d + t1 >>> 0;
    d = c;
    c = b;
    b = a;
    a = t1 + t2 >>> 0;
  }
  return [a, b, c, d, e, f, g, h];
}
function prefixBlockState(payload) {
  const words = new Array(14).fill(0);
  words.push(payload[0] << 16 | payload[1] << 8 | payload[2]);
  words.push(
    (payload[3] << 24 | payload[4] << 16 | payload[5] << 8 | payload[6]) >>> 0
  );
  for (let index = 16; index < 30; index += 1) {
    let value = SHA256_PREFIX_SCHEDULE[index - 16] + (index === 16 ? (sigma1(words[14]) ^ SHA256_SIGMA1_ADJUSTMENT) >>> 0 : sigma1(words[index - 2]));
    if (index >= 21) {
      value += words[index - 7];
    }
    if (index === 29) {
      value += (sigma0(words[14]) ^ SHA256_SIGMA0_ADJUSTMENT) >>> 0;
    }
    words.push(value >>> 0);
  }
  words.push(
    sigma1(words[28]) + words[23] + sigma0(words[15]) + words[14] + SHA256_ROUND_14_ADJUSTMENT - SHA256_ROUND_CONSTANTS[14] >>> 0
  );
  expandSchedule(words, 31);
  const working = compress(SHA256_PREFIX_STATE, words, 14);
  return SHA256_INITIAL.map((value, index) => value + working[index] >>> 0);
}
function sha256Digest(payload) {
  if (payload.length < 7) {
    throw new Error("Sec-MS-GEC payload must contain at least seven bytes");
  }
  const messageLength = 57 + payload.length;
  const zeroPadding = ((55 - messageLength) % 64 + 64) % 64;
  const tail = new Uint8Array(payload.length - 7 + 1 + zeroPadding + 8);
  tail.set(payload.subarray(7));
  tail[payload.length - 7] = 128;
  const tailView = new DataView(tail.buffer);
  const bitLength = messageLength * 8;
  tailView.setUint32(tail.length - 8, Math.floor(bitLength / 2 ** 32));
  tailView.setUint32(tail.length - 4, bitLength >>> 0);
  let state = prefixBlockState(payload);
  for (let offset = 0; offset < tail.length; offset += 64) {
    const words = [];
    for (let index = 0; index < 16; index += 1) {
      words.push(tailView.getUint32(offset + index * 4));
    }
    expandSchedule(words);
    const working = compress(state, words);
    state = state.map((value, index) => value + working[index] >>> 0);
  }
  const digest = new Uint8Array(32);
  const digestView = new DataView(digest.buffer);
  state.forEach((value, index) => digestView.setUint32(index * 4, value));
  return digest;
}
function cs64Words(payload) {
  const byteLength = Math.ceil((payload.length + 1) / 8) * 8;
  const bytes = new Uint8Array(byteLength);
  bytes.set(payload, 1);
  const view = new DataView(bytes.buffer);
  const words = [];
  for (let offset = 0; offset < byteLength; offset += 4) {
    words.push(view.getUint32(offset, true));
  }
  return words;
}
function cs64Digest(payload, digest) {
  const digestView = new DataView(
    digest.buffer,
    digest.byteOffset,
    digest.byteLength
  );
  const keyA = (digestView.getUint32(0, true) | 1) >>> 0;
  const keyB = (digestView.getUint32(4, true) | 1) >>> 0;
  const factors = [
    Math.imul(keyA, CS64_FACTOR) >>> 0,
    Math.imul(keyB, CS64_FACTOR) >>> 0
  ];
  const terms = CS64_COEFFICIENTS.map(
    ([coefficient], index) => Math.imul(coefficient, factors[index % 2]) >>> 0
  );
  const offsets = CS64_COEFFICIENTS.map(([, offset]) => offset);
  cs64Words(payload).forEach((word, index) => {
    const even = index % 2 === 0;
    let term = Math.imul(word, even ? keyA : keyB);
    let offset = Math.imul(rol16(word), even ? 4010109435 : 3273069531);
    if (index === 0) {
      term += Math.imul(CS64_ADJUSTMENT0, factors[0]);
      offset += CS64_ADJUSTMENT1;
    }
    terms.push(term >>> 0);
    offsets.push(offset >>> 0);
  });
  let swapAcc = 0;
  let swapLast = 0;
  let state = 0;
  let acc = 0;
  for (let index = 0; index < terms.length; index += 2) {
    const x = terms[index];
    const y = terms[index + 1];
    let q = Math.imul(rol16(offsets[index] + x >>> 0), 1995771700) >>> 0;
    swapAcc = swapAcc + Math.imul(rol16(q), 3287280279) + q >>> 0;
    q = Math.imul(rol16(offsets[index + 1] + y >>> 0), 411160124) >>> 0;
    swapLast = Math.imul(rol16(q), 901586633) + q >>> 0;
    swapAcc = swapAcc + swapLast >>> 0;
    state = Math.imul(state, keyA) + x >>> 0;
    state = Math.imul(rol16(state), 3482890513) >>> 0;
    state = Math.imul(rol16(state), 2265471903) >>> 0;
    state = Math.imul(rol16(state), 315537773) >>> 0;
    state = Math.imul(rol16(state), 629022083) >>> 0;
    acc = acc + state >>> 0;
    let t = Math.imul(state, keyB) + y >>> 0;
    t = Math.imul(rol16(t), 2725517045) >>> 0;
    t = Math.imul(rol16(t), 3548616447) >>> 0;
    t = Math.imul(rol16(t), 2090019721) >>> 0;
    state = Math.imul(rol16(t), 3215236969) >>> 0;
    acc = acc + state >>> 0;
  }
  return [(swapLast ^ state) >>> 0, (swapAcc ^ acc) >>> 0];
}
function toHex(bytes) {
  return Array.from(bytes).map((byte) => byte.toString(16).padStart(2, "0")).join("").toUpperCase();
}
function hashSecMsGecPayload(payload) {
  const bytes = new TextEncoder().encode(payload);
  const digest = sha256Digest(bytes);
  const checksum = new Uint8Array(8);
  const checksumView = new DataView(checksum.buffer);
  cs64Digest(bytes, digest).forEach(
    (word, index) => checksumView.setUint32(index * 4, word, true)
  );
  return `${toHex(checksum)}-${toHex(digest)}`;
}
function generateSecMsGec(trustedClientToken, unixSeconds = Date.now() / 1e3) {
  let ticks = unixSeconds + WIN_EPOCH_SECONDS;
  ticks -= ticks % TOKEN_WINDOW_SECONDS;
  ticks *= 1e7;
  return hashSecMsGecPayload(`${ticks.toFixed(0)}${trustedClientToken}`);
}

// ../../../.gemini/antigravity/brain/cf2d3203-3520-4742-b236-845637dba62c/scratch/cf-edge-tts/src/lib/tts.ts
var DEFAULT_VOICE = "en-US-AvaMultilingualNeural";
var READALOUD_BASE = "speech.platform.bing.com/consumer/speech/synthesize/readaloud";
var TRUSTED_CLIENT_TOKEN = "6A5AA1D4EAFF4E9FB37E23D68491D6F4";
var VOICE_LIST_URL = `https://${READALOUD_BASE}/voices/list?trustedclienttoken=${TRUSTED_CLIENT_TOKEN}`;
var SYNTHESIS_URL = `https://${READALOUD_BASE}/edge/v1`;
var CHROMIUM_FULL_VERSION = "143.0.3650.75";
var CHROMIUM_MAJOR_VERSION = CHROMIUM_FULL_VERSION.split(".")[0];
var SEC_MS_GEC_VERSION = `2-${CHROMIUM_FULL_VERSION}`;
var BASE_HEADERS = {
  "User-Agent": `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${CHROMIUM_MAJOR_VERSION}.0.0.0 Safari/537.36 Edg/${CHROMIUM_MAJOR_VERSION}.0.0.0`,
  "Accept-Language": "en-US,en;q=0.9"
};
var UPGRADE_HEADERS = {
  ...BASE_HEADERS,
  "Accept-Encoding": "gzip, deflate, br, zstd",
  Pragma: "no-cache",
  "Cache-Control": "no-cache",
  "Sec-WebSocket-Version": "13",
  Upgrade: "websocket"
};
var VOICE_HEADERS = {
  ...BASE_HEADERS,
  Authority: "speech.platform.bing.com",
  "Sec-CH-UA": `" Not;A Brand";v="99", "Microsoft Edge";v="${CHROMIUM_MAJOR_VERSION}", "Chromium";v="${CHROMIUM_MAJOR_VERSION}"`,
  "Sec-CH-UA-Mobile": "?0",
  Accept: "*/*",
  "Sec-Fetch-Site": "none",
  "Sec-Fetch-Mode": "cors",
  "Sec-Fetch-Dest": "empty"
};
function defaultRuntime() {
  return {
    fetch: (input, init) => fetch(input, init),
    crypto: globalThis.crypto
  };
}
function normalizeVoiceName(voice) {
  const trimmed = voice.trim();
  const providerMatch = /^([a-z]{2,}-[A-Z]{2,})-([^:]+):.+Neural$/.exec(trimmed);
  if (providerMatch) {
    const [, locale, baseName] = providerMatch;
    return normalizeVoiceName(`${locale}-${baseName}Neural`);
  }
  const shortMatch = /^([a-z]{2,})-([A-Z]{2,})-(.+Neural)$/.exec(trimmed);
  if (!shortMatch) {
    return trimmed;
  }
  const [, lang] = shortMatch;
  let [, , region, name] = shortMatch;
  if (name.includes("-")) {
    const [regionSuffix, ...nameParts] = name.split("-");
    region += `-${regionSuffix}`;
    name = nameParts.join("-");
  }
  return `Microsoft Server Speech Text to Speech Voice (${lang}-${region}, ${name})`;
}
function escapeXml(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
function removeInvalidXmlCharacters(text) {
  return text.replace(
    /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g,
    " "
  );
}
function makeConnectionId(runtime) {
  return runtime.crypto.randomUUID().replace(/-/g, "");
}
function makeMuid(runtime) {
  const bytes = new Uint8Array(16);
  runtime.crypto.getRandomValues(bytes);
  return Array.from(bytes).map((byte) => byte.toString(16).padStart(2, "0")).join("").toUpperCase();
}
function buildSynthesisUrl(secMsGec, connectionId) {
  const url = new URL(SYNTHESIS_URL);
  url.searchParams.set("TrustedClientToken", TRUSTED_CLIENT_TOKEN);
  url.searchParams.set("Sec-MS-GEC", secMsGec);
  url.searchParams.set("Sec-MS-GEC-Version", SEC_MS_GEC_VERSION);
  url.searchParams.set("ConnectionId", connectionId);
  return url.toString();
}
function buildSpeechConfigMessage() {
  return `X-Timestamp:${timestamp()}\r
Content-Type:application/json; charset=utf-8\r
Path:speech.config\r
\r
{"context":{"synthesis":{"audio":{"metadataoptions":{"sentenceBoundaryEnabled":"false","wordBoundaryEnabled":"true"},"outputFormat":"audio-24khz-48kbitrate-mono-mp3"}}}}\r
`;
}
function buildSsmlMessage(requestId, voice, text) {
  const ssml = `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='en-US'><voice name='${voice}'><prosody pitch='+0Hz' rate='+0%' volume='+0%'>${escapeXml(
    removeInvalidXmlCharacters(text)
  )}</prosody></voice></speak>`;
  return `X-RequestId:${requestId}\r
Content-Type:application/ssml+xml\r
X-Timestamp:${timestamp()}Z\r
Path:ssml\r
\r
` + ssml;
}
function timestamp() {
  return (/* @__PURE__ */ new Date()).toISOString().replace(/[-:.]/g, "").slice(0, -1);
}
function parseTextHeaders(message) {
  const separator = message.indexOf("\r\n\r\n");
  const headerText = separator >= 0 ? message.slice(0, separator) : message;
  const headers = {};
  for (const line of headerText.split("\r\n")) {
    const colonIndex = line.indexOf(":");
    if (colonIndex <= 0) {
      continue;
    }
    const key = line.slice(0, colonIndex);
    const value = line.slice(colonIndex + 1).trim();
    headers[key] = value;
  }
  return headers;
}
function parseBinaryAudioFrame(data) {
  if (data.length < 2) {
    throw new Error("binary websocket frame missing header length");
  }
  const headerLength = data[0] << 8 | data[1];
  if (data.length < 2 + headerLength) {
    throw new Error("binary websocket frame truncated");
  }
  const headerText = new TextDecoder().decode(
    data.slice(2, 2 + headerLength)
  );
  const headers = {};
  for (const line of headerText.split("\r\n")) {
    const colonIndex = line.indexOf(":");
    if (colonIndex <= 0) {
      continue;
    }
    const key = line.slice(0, colonIndex);
    const value = line.slice(colonIndex + 1).trim();
    headers[key] = value;
  }
  return {
    headers,
    body: data.slice(2 + headerLength)
  };
}
function toUint8Array(data) {
  if (data instanceof Uint8Array) {
    return data;
  }
  if (data instanceof ArrayBuffer) {
    return new Uint8Array(data);
  }
  if (typeof Blob !== "undefined" && data instanceof Blob) {
    return data.arrayBuffer().then((buffer) => new Uint8Array(buffer));
  }
  return null;
}
function toError(error) {
  if (error instanceof Error) {
    return error;
  }
  if (typeof error === "object" && error !== null && "message" in error && typeof error.message === "string") {
    return new Error(error.message);
  }
  return new Error(String(error));
}
function createReadableAudioStream(socket, text, voice, requestId) {
  let controllerRef = null;
  let audioReceived = false;
  let settled = false;
  const cleanup = () => {
    socket.removeEventListener("message", onMessage);
    socket.removeEventListener("close", onClose);
    socket.removeEventListener("error", onError);
  };
  const finishWithError = (error) => {
    if (settled) {
      return;
    }
    settled = true;
    cleanup();
    controllerRef?.error(toError(error));
  };
  const finish = () => {
    if (settled) {
      return;
    }
    settled = true;
    cleanup();
    controllerRef?.close();
  };
  const onMessage = (event) => {
    if (settled) {
      return;
    }
    const data = event.data;
    if (typeof data === "string") {
      const headers = parseTextHeaders(data);
      const path = headers.Path;
      if (path === "turn.end") {
        try {
          socket.close();
        } catch {
          finish();
        }
        return;
      }
      if (path === "response" || path === "turn.start" || path === "audio.metadata") {
        return;
      }
      finishWithError(new Error(`unexpected websocket text path: ${path}`));
      return;
    }
    const maybeBinary = toUint8Array(data);
    if (!maybeBinary) {
      finishWithError(new Error("unsupported websocket message type"));
      return;
    }
    const handleBinary = (binary) => {
      if (settled) {
        return;
      }
      const { headers, body } = parseBinaryAudioFrame(binary);
      if (headers.Path !== "audio") {
        throw new Error(`unexpected websocket binary path: ${headers.Path}`);
      }
      if (headers["Content-Type"] !== "audio/mpeg") {
        if (body.length === 0) {
          return;
        }
        throw new Error(
          `unexpected websocket binary content type: ${headers["Content-Type"]}`
        );
      }
      audioReceived = true;
      controllerRef?.enqueue(body);
    };
    if (maybeBinary instanceof Promise) {
      maybeBinary.then(handleBinary).catch((error) => {
        finishWithError(error);
      });
      return;
    }
    try {
      handleBinary(maybeBinary);
    } catch (error) {
      finishWithError(error);
    }
  };
  const onClose = () => {
    if (!audioReceived) {
      finishWithError(new Error("no audio received"));
      return;
    }
    finish();
  };
  const onError = (event) => {
    finishWithError(event);
  };
  return new ReadableStream({
    start(controller) {
      controllerRef = controller;
      socket.addEventListener("message", onMessage);
      socket.addEventListener("close", onClose);
      socket.addEventListener("error", onError);
      socket.accept();
      socket.send(buildSpeechConfigMessage());
      socket.send(buildSsmlMessage(requestId, voice, text));
    },
    cancel(reason) {
      cleanup();
      settled = true;
      try {
        socket.close(1e3, typeof reason === "string" ? reason : "cancelled");
      } catch {
      }
    }
  });
}
async function createAudioStream({ text, voice }, runtime = defaultRuntime()) {
  const secMsGec = generateSecMsGec(TRUSTED_CLIENT_TOKEN);
  const connectionId = makeConnectionId(runtime);
  const websocketUrl = buildSynthesisUrl(secMsGec, connectionId);
  const response = await runtime.fetch(websocketUrl, {
    headers: {
      ...UPGRADE_HEADERS,
      Cookie: `muid=${makeMuid(runtime)};`
    }
  });
  if (response.status !== 101 || !response.webSocket) {
    throw new Error(`WebSocket upgrade failed with status ${response.status}`);
  }
  return createReadableAudioStream(
    response.webSocket,
    text,
    normalizeVoiceName(voice ?? DEFAULT_VOICE),
    makeConnectionId(runtime)
  );
}
async function getVoices(runtime = defaultRuntime()) {
  const secMsGec = generateSecMsGec(TRUSTED_CLIENT_TOKEN);
  const url = `${VOICE_LIST_URL}&Sec-MS-GEC=${secMsGec}&Sec-MS-GEC-Version=${SEC_MS_GEC_VERSION}`;
  let response;
  try {
    response = await runtime.fetch(url, {
      headers: VOICE_HEADERS
    });
  } catch (error) {
    throw error;
  }
  if (!response.ok) {
    throw new Error(`Voice list request failed with status ${response.status}`);
  }
  return await response.json();
}

// ../../../.gemini/antigravity/brain/cf2d3203-3520-4742-b236-845637dba62c/scratch/cf-edge-tts/src/handlers/tts.ts
function isJsonContentType(value) {
  const mediaType = value.split(";")[0]?.trim().toLowerCase();
  return mediaType === "application/json";
}
function parseBody(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new Error("request body must be an object");
  }
  const { text, voice } = body;
  if (typeof text !== "string" || text.trim().length === 0) {
    throw new Error("text is required");
  }
  if (voice !== void 0) {
    if (typeof voice !== "string") {
      throw new Error("voice must be a string");
    }
    if (voice.trim().length === 0) {
      throw new Error("voice must be a non-empty string");
    }
  }
  return {
    text: text.trim(),
    voice: typeof voice === "string" ? voice.trim() : voice
  };
}
async function primeAudioStream(stream) {
  const reader = stream.getReader();
  const firstChunk = await reader.read();
  let firstChunkConsumed = false;
  return new ReadableStream({
    async pull(controller) {
      try {
        if (!firstChunkConsumed) {
          firstChunkConsumed = true;
          if (firstChunk.done) {
            controller.close();
            return;
          }
          controller.enqueue(firstChunk.value);
          return;
        }
        const chunk = await reader.read();
        if (chunk.done) {
          controller.close();
          return;
        }
        controller.enqueue(chunk.value);
      } catch (error) {
        controller.error(error);
      }
    },
    async cancel(reason) {
      await reader.cancel(reason);
    }
  });
}
async function handleTts(request) {
  const contentType = request.headers.get("content-type") ?? "";
  if (!isJsonContentType(contentType)) {
    return errorResponse(
      400,
      "INVALID_CONTENT_TYPE",
      "content-type must be application/json"
    );
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return errorResponse(
      400,
      "INVALID_REQUEST",
      "request body must be valid json"
    );
  }
  let parsed;
  try {
    parsed = parseBody(body);
  } catch (error) {
    return errorResponse(
      400,
      "INVALID_REQUEST",
      error instanceof Error ? error.message : "request body must be valid json"
    );
  }
  let lastErr;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const stream = await createAudioStream(parsed);
      const primedStream = await primeAudioStream(stream);
      return new Response(primedStream, {
        status: 200,
        headers: {
          ...CORS_HEADERS,
          "Content-Type": "audio/mpeg"
        }
      });
    } catch (error) {
      lastErr = error;
      if (attempt < 2) {
        await new Promise((resolve) => setTimeout(resolve, 350 * (attempt + 1)));
      }
    }
  }
  console.error("tts synthesis failed after 3 attempts", lastErr);
  return errorResponse(502, "TTS_UPSTREAM_ERROR", lastErr instanceof Error ? lastErr.message : "failed to synthesize audio");
}

// ../../../.gemini/antigravity/brain/cf2d3203-3520-4742-b236-845637dba62c/scratch/cf-edge-tts/src/handlers/tts-health.ts
var DEFAULT_PROBES = [
  { voice: "en-US-AvaMultilingualNeural", text: "health check" },
  { voice: "zh-CN-XiaoxiaoNeural", text: "\u5065\u5EB7\u68C0\u67E5" }
];
var PROBE_TIMEOUT_MS = 15e3;
async function runProbe(url, { voice, text }, timeoutMs) {
  const startedAt = Date.now();
  const result = {
    voice,
    ok: false,
    status: 0,
    contentType: "",
    bytes: 0,
    durationMs: 0
  };
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(
      () => reject(new Error(`timed out after ${timeoutMs} ms`)),
      timeoutMs
    );
  });
  try {
    const response = await Promise.race([
      handleTts(
        new Request(new URL("/tts", url), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, voice })
        })
      ),
      timeout
    ]);
    result.status = response.status;
    result.contentType = response.headers.get("content-type") ?? "";
    result.bytes = (await Promise.race([response.arrayBuffer(), timeout])).byteLength;
    result.ok = result.status === 200 && result.contentType.startsWith("audio/mpeg") && result.bytes > 0;
  } catch (error) {
    result.error = error instanceof Error ? error.message : String(error);
  } finally {
    clearTimeout(timer);
  }
  result.durationMs = Date.now() - startedAt;
  if (!result.ok) {
    console.error("tts health probe failed", result);
  }
  return result;
}
async function handleTtsHealth(request, timeoutMs = PROBE_TIMEOUT_MS) {
  const url = new URL(request.url);
  const voice = url.searchParams.get("voice")?.trim();
  const probes = voice ? [{ voice, text: "health check" }] : DEFAULT_PROBES;
  const checks = await Promise.all(
    probes.map((probe) => runProbe(url, probe, timeoutMs))
  );
  const ok = checks.every((check) => check.ok);
  return json(
    { ok, checks },
    {
      status: ok ? 200 : 503,
      headers: { "Cache-Control": "no-store" }
    }
  );
}

// ../../../.gemini/antigravity/brain/cf2d3203-3520-4742-b236-845637dba62c/scratch/cf-edge-tts/src/handlers/voices.ts
async function handleVoices() {
  try {
    const voices = await getVoices();
    return json({ voices });
  } catch (error) {
    console.error("voice list fetch failed", error);
    return errorResponse(502, "TTS_UPSTREAM_ERROR", "failed to fetch voices");
  }
}

// ../../../.gemini/antigravity/brain/cf2d3203-3520-4742-b236-845637dba62c/scratch/cf-edge-tts/src/index.ts
async function routeRequest(request) {
  const url = new URL(request.url);
  const { pathname } = url;
  if (request.method === "OPTIONS") {
    return noContent();
  }

  // PayWay Proxy for ABA Payment
  if (pathname.startsWith("/api/")) {
    const targetUrl = "https://payway.jlastore.com" + pathname + url.search;
    const reqHeaders = new Headers(request.headers);
    reqHeaders.set("Host", "payway.jlastore.com");
    reqHeaders.set("Referer", "https://payway.jlastore.com/");
    reqHeaders.set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36");
    reqHeaders.delete("Origin");
    const body = (request.method !== "GET" && request.method !== "HEAD") ? await request.arrayBuffer() : undefined;
    return await fetch(targetUrl, {
      method: request.method,
      headers: reqHeaders,
      body: body
    });
  }

  // NISAY AI Gateway Proxy (for 4G mobile devices with DNS or carrier blocks)
  if (pathname.startsWith("/nisay/")) {
    const targetUrl = "https://api.nisay.store" + pathname.replace(/^\/nisay/, "") + url.search;
    const reqHeaders = new Headers(request.headers);
    reqHeaders.set("Host", "api.nisay.store");
    reqHeaders.delete("Origin");
    const body = (request.method !== "GET" && request.method !== "HEAD") ? await request.arrayBuffer() : undefined;
    return await fetch(targetUrl, {
      method: request.method,
      headers: reqHeaders,
      body: body
    });
  }

  if (pathname === "/ping" || pathname === "/health") {
    return json({ ok: true, voices: ["km-KH-SreymomNeural", "km-KH-PisethNeural"] });
  }
  if (request.method === "OPTIONS") {
    return noContent();
  }
  if (pathname === "/health") {
    if (request.method !== "GET") {
      return errorResponse(405, "METHOD_NOT_ALLOWED", "method not allowed");
    }
    return handleHealth();
  }
  if (pathname === "/health/tts") {
    if (request.method !== "GET") {
      return errorResponse(405, "METHOD_NOT_ALLOWED", "method not allowed");
    }
    return handleTtsHealth(request);
  }
  if (pathname === "/voices") {
    if (request.method !== "GET") {
      return errorResponse(405, "METHOD_NOT_ALLOWED", "method not allowed");
    }
    return handleVoices();
  }
  if (pathname === "/tts") {
    if (request.method !== "POST") {
      return errorResponse(405, "METHOD_NOT_ALLOWED", "method not allowed");
    }
    return handleTts(request);
  }
  return errorResponse(404, "NOT_FOUND", "route not found");
}
var index_default = {
  async fetch(request, _env, _ctx) {
    try {
      const response = await routeRequest(request);
      return withCors(response);
    } catch {
      return errorResponse(500, "INTERNAL_ERROR", "unexpected internal error");
    }
  }
};
export {
  index_default as default
};
