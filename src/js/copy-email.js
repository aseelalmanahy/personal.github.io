const SUCCESS = 'Copied!';
const FAILURE = "Couldn't copy — please select the address above";
const CLEAR_MS = 4000;

/**
 * Writes text to the clipboard.
 * @param {string} text
 * @param {Clipboard} [clipboard] Defaults to `navigator.clipboard`.
 * @returns {Promise<'success' | 'error'>}
 */
export async function copyText(text, clipboard = globalThis.navigator?.clipboard) {
  try {
    await clipboard.writeText(text);
    return 'success';
  } catch {
    return 'error';
  }
}

/**
 * The status text announced after a copy attempt.
 * @param {'success' | 'error'} result
 * @returns {string}
 */
export function statusMessage(result) {
  return result === 'success' ? SUCCESS : FAILURE;
}

/**
 * Reveals the "Copy email" button when the Clipboard API exists and announces the result in
 * the adjacent status region (FR-021a). The address is read from the mailto link, so the page
 * has a single source of truth.
 * @param {Document} [doc]
 */
export function initCopyEmail(doc = globalThis.document) {
  const button = doc.querySelector('[data-js="copy-email"]');
  const status = doc.querySelector('[data-js="copy-email-status"]');
  const link = doc.querySelector('.contact__email-link');
  const view = doc.defaultView;
  const clipboard = view.navigator.clipboard;
  if (!button || !status || !link || typeof clipboard?.writeText !== 'function') return;

  let clearTimer;
  button.addEventListener('click', async () => {
    const address = link.getAttribute('href').replace(/^mailto:/, '');
    status.textContent = statusMessage(await copyText(address, clipboard));
    view.clearTimeout(clearTimer);
    clearTimer = view.setTimeout(() => {
      status.textContent = '';
    }, CLEAR_MS);
  });
  button.hidden = false;
}
