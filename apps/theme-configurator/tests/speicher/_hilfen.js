// Gemeinsame Hilfen fuer die Speicher-Tests: gefaelschtes fetch mit Protokoll.

/** Antwort-Attrappe (ohne happy-dom-Response, damit Header-Namen stabil sind). */
export function antwort(status, body, headers = {}) {
  const h = Object.fromEntries(Object.entries(headers).map(([k, v]) => [k.toLowerCase(), v]))
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: { get: (k) => h[k.toLowerCase()] ?? null },
    json: async () => { if (body === undefined) throw new SyntaxError('kein JSON'); return typeof body === 'string' ? JSON.parse(body) : body },
    text: async () => (typeof body === 'string' ? body : JSON.stringify(body)),
  }
}

/**
 * fetch-Attrappe: `regeln` ist eine Liste von [methode, url-Teil, antwort | (anfrage) => antwort].
 * Jede Anfrage landet in `aufrufe` ({ url, methode, headers, body }).
 */
export function fetchAttrappe(regeln) {
  const aufrufe = []
  const f = async (url, init = {}) => {
    const methode = init.method || 'GET'
    const anfrage = { url, methode, headers: init.headers || {}, body: init.body ? JSON.parse(init.body) : undefined, credentials: init.credentials }
    aufrufe.push(anfrage)
    const regel = regeln.find(([m, teil]) => m === methode && url.includes(teil))
    if (!regel) throw new Error(`Unerwartete Anfrage ${methode} ${url}`)
    const r = regel[2]
    return typeof r === 'function' ? r(anfrage) : r
  }
  f.aufrufe = aufrufe
  return f
}
