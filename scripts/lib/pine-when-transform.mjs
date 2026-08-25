/**
 * Pine `when=` → `if` block transformer.
 *
 * PineTS v0.9.32 does not implement the `when=` parameter on strategy order
 * primitives (`strategy.entry/close/exit/order/cancel`). When a script passes
 * `when=cond`, PineTS ignores the condition and places the order every bar —
 * producing degenerate backtests.
 *
 * Pine semantics: `strategy.entry(id, dir, when=cond)` is exactly equivalent to
 * `if cond` / `strategy.entry(id, dir)`. This module performs that mechanical
 * rewrite on a COPY of the source (in-memory only; committed files untouched)
 * so backtests reflect the strategy's real entry/exit logic.
 *
 * The rewrite is conservative: it only touches strategy order calls that
 * contain a top-level `when=` argument, and leaves everything else verbatim.
 */

const ORDER_FNS = ['entry', 'close', 'exit', 'order', 'cancel', 'close_all', 'cancel_all'];

/**
 * Find the index of the closing paren matching the open paren at `openIdx`,
 * respecting nested parens, brackets, and string literals.
 */
function matchParen(src, openIdx) {
  let depth = 0;
  let inStr = null;
  for (let i = openIdx; i < src.length; i++) {
    const c = src[i];
    if (inStr) {
      if (c === inStr && src[i - 1] !== '\\') inStr = null;
      continue;
    }
    if (c === '"' || c === "'") { inStr = c; continue; }
    if (c === '(') depth++;
    else if (c === ')') { depth--; if (depth === 0) return i; }
  }
  return -1;
}

/**
 * Split the argument list text into top-level arguments (split on commas at
 * paren-depth 0, respecting strings). Returns array of {text, start} relative
 * to the args string.
 */
function splitTopLevelArgs(argsText) {
  const args = [];
  let depth = 0;
  let inStr = null;
  let cur = '';
  for (let i = 0; i < argsText.length; i++) {
    const c = argsText[i];
    if (inStr) {
      cur += c;
      if (c === inStr && argsText[i - 1] !== '\\') inStr = null;
      continue;
    }
    if (c === '"' || c === "'") { inStr = c; cur += c; continue; }
    if (c === '(' || c === '[') { depth++; cur += c; continue; }
    if (c === ')' || c === ']') { depth--; cur += c; continue; }
    if (c === ',' && depth === 0) { args.push(cur); cur = ''; continue; }
    cur += c;
  }
  if (cur.trim() !== '') args.push(cur);
  return args;
}

/**
 * Transform all `strategy.<fn>(... when=COND ...)` calls into
 * `if COND\n    strategy.<fn>(...rest...)`.
 * Returns { code, changed }.
 */
export function transformWhen(src) {
  const re = new RegExp(`\\bstrategy\\.(${ORDER_FNS.join('|')})\\s*\\(`, 'g');
  let out = '';
  let last = 0;
  let changed = false;
  let m;
  while ((m = re.exec(src)) !== null) {
    // Skip matches that appear inside a `//` line comment.
    const lineStart = src.lastIndexOf('\n', m.index) + 1;
    const lineUpToMatch = src.slice(lineStart, m.index);
    if (/\/\//.test(lineUpToMatch)) continue;

    const fn = m[1];
    const openIdx = src.indexOf('(', m.index);
    const closeIdx = matchParen(src, openIdx);
    if (closeIdx === -1) continue; // malformed; leave as-is
    const argsText = src.slice(openIdx + 1, closeIdx);
    const args = splitTopLevelArgs(argsText);

    const whenIdx = args.findIndex((a) => /^\s*when\s*=/.test(a));
    if (whenIdx === -1) continue; // no when= — leave untouched

    const whenArg = args[whenIdx];
    const cond = whenArg.replace(/^\s*when\s*=\s*/, '').trim();
    const restArgs = args.filter((_, i) => i !== whenIdx).map((a) => a.trim()).join(', ');

    // Emit everything up to the start of this call, then the rewritten call.
    out += src.slice(last, m.index);
    const indent = /^[ \t]*/.exec(src.slice(0, m.index).split('\n').pop())[0];
    out += `if ${cond}\n${indent}    strategy.${fn}(${restArgs})`;
    last = closeIdx + 1;
    changed = true;
  }
  out += src.slice(last);
  return { code: out, changed };
}
