// Vorlage: otp-input — Markup aus data/markup/otp-input.html.
// Zustand filled fuellt alle Stellen, disabled deaktiviert sie; separator per
// slotConfig (content=with-separator) nach der dritten Stelle.
export default (zelle, m) => {
  const werte = m.hat('filled') ? ['7', '3', '9', '1', '4', '2'] : ['7', '3', '', '', '', '']
  const aus = m.deaktiviert ? ' disabled' : ''
  const zellen = werte.map((w, i) => {
    const feld = `<input class="nc-otp-input__cell${w ? ' nc-otp-input__cell--filled' : ''}" type="text" maxlength="1" inputmode="numeric" pattern="[0-9]*" aria-label="Stelle ${i + 1}"${w ? ` value="${w}"` : ''}${aus}>`
    return i === 3 && m.slot('separator') ? `<span class="nc-otp-input__separator" aria-hidden="true">–</span>${feld}` : feld
  })
  return `
<div class="${m.klasse}" role="group" aria-label="Bestätigungscode"${m.attrs}>
${zellen.join('\n')}
</div>`
}
