// @ts-expect-error — @strudel/transpiler ships without type definitions.
import { transpiler } from '@strudel/transpiler';

/**
 * The minimal slice of Strudel's Pattern / Hap shapes we need to compare two
 * patterns. The full types live in @strudel/core; we only depend on a couple
 * of methods/properties so we avoid pulling in the whole package.
 */
interface Hap {
  part: { begin: { valueOf(): number }; end: { valueOf(): number } };
  whole?: { begin: { valueOf(): number }; end: { valueOf(): number } } | undefined;
  value: unknown;
  hasOnset(): boolean;
}

interface Pattern {
  queryArc(begin: number, end: number, controls?: unknown): Hap[];
}

const noop = () => undefined;

/**
 * Globals that have side effects we want to neutralise during quiz eval:
 *   - setcpm / setcps would change the playback tempo for the currently-
 *     playing editor on the page.
 *   - hush would silence active audio.
 *   - samples kicks off network loads we don't need for a structural check.
 * Passing them as Function parameters shadows the matching window globals
 * inside the eval'd code without touching the real ones.
 */
const SANDBOX_NAMES = ['setcpm', 'setcps', 'hush', 'samples'] as const;
const SANDBOX_VALUES = SANDBOX_NAMES.map(() => noop);

export class QuizEvalError extends Error {
  constructor(
    message: string,
    public original?: unknown,
  ) {
    super(message);
    this.name = 'QuizEvalError';
  }
}

/**
 * Transpile Strudel source (so mini-notation strings are parsed) and execute
 * it, returning the resulting Pattern. Throws QuizEvalError on failure.
 */
export function evaluatePattern(code: string): Pattern {
  let transpiled: string;
  try {
    const result = transpiler(code, { wrapAsync: false, addReturn: true }) as { output: string };
    transpiled = result.output;
  } catch (e) {
    throw new QuizEvalError('Could not parse your code.', e);
  }

  let pattern: unknown;
  try {
    const fn = new Function(...SANDBOX_NAMES, `"use strict"; ${transpiled}`);
    pattern = (fn as (...args: unknown[]) => unknown)(...SANDBOX_VALUES);
  } catch (e) {
    throw new QuizEvalError('Your code threw an error when run.', e);
  }

  if (!pattern || typeof (pattern as Pattern).queryArc !== 'function') {
    throw new QuizEvalError('Your code did not produce a pattern.');
  }

  return pattern as Pattern;
}

export interface CompareResult {
  match: boolean;
  reason?: string;
}

/**
 * Decide whether the user's pattern produces the same events as the target
 * pattern over a few cycles. Equivalence is checked at the *event* level —
 * so two source strings that produce the same haps (e.g. `bd*2` and `bd bd`)
 * are considered equal regardless of how they're written.
 */
export function comparePatterns(userCode: string, targetCode: string, cycles = 2): CompareResult {
  let userPattern: Pattern;
  try {
    userPattern = evaluatePattern(userCode);
  } catch (e) {
    if (e instanceof QuizEvalError) return { match: false, reason: e.message };
    return { match: false, reason: 'Your code could not be evaluated.' };
  }

  let targetPattern: Pattern;
  try {
    targetPattern = evaluatePattern(targetCode);
  } catch {
    return { match: false, reason: 'Internal: target pattern failed to parse.' };
  }

  const userHaps = onsetHaps(userPattern, cycles);
  const targetHaps = onsetHaps(targetPattern, cycles);

  if (userHaps.length !== targetHaps.length) {
    return {
      match: false,
      reason: `Your pattern triggers ${userHaps.length} event${
        userHaps.length === 1 ? '' : 's'
      } per ${cycles} cycle${cycles === 1 ? '' : 's'}, but the target triggers ${targetHaps.length}.`,
    };
  }

  const u = userHaps.map(serialiseHap).sort();
  const t = targetHaps.map(serialiseHap).sort();

  for (let i = 0; i < u.length; i++) {
    if (u[i] !== t[i]) {
      return {
        match: false,
        reason:
          'Same number of events, but they happen at different times or with different values.',
      };
    }
  }

  return { match: true };
}

function onsetHaps(pattern: Pattern, cycles: number): Hap[] {
  return pattern.queryArc(0, cycles).filter((h) => h.hasOnset());
}

function serialiseHap(h: Hap): string {
  const begin = Number(h.part.begin);
  const end = Number(h.part.end);
  return `${begin.toFixed(6)}-${end.toFixed(6)}@${stableStringify(h.value)}`;
}

/** Deterministic stringify that sorts object keys so equivalent objects match. */
function stableStringify(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value) ?? 'undefined';
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  const obj = value as Record<string, unknown>;
  const keys = Object.keys(obj).sort();
  const inner = keys.map((k) => `${JSON.stringify(k)}:${stableStringify(obj[k])}`).join(',');
  return `{${inner}}`;
}
