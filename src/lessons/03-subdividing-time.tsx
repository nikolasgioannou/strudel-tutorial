import { StrudelEditor } from '../components/StrudelEditor';
import { QuizEditor } from '../components/QuizEditor';
import type { LessonMeta } from './index';

export const meta: LessonMeta = {
  slug: 'subdividing-time',
  title: 'Subdividing time',
  blurb: 'Brackets, repeats, and rests give you the rhythmic vocabulary.',
  order: 3,
};

export function Lesson() {
  return (
    <div className="space-y-6 text-neutral-300">
      <p>
        By default, a sequence puts every event in an equal slot. Real beats have more variety: some
        events squeeze in faster, some leave space. Strudel uses three small symbols for all of
        this.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">
        Brackets <code>[ ]</code> — subdivide a slot
      </h2>
      <p>
        Whatever is inside <code>[]</code> is treated as one slot of the outer sequence. So{' '}
        <code>"bd [hh hh] sd"</code> still has three top-level slots — but the middle one holds two
        hi-hats sharing the time.
      </p>
      <StrudelEditor code={`sound("bd [hh hh] sd [hh bd] bd ~ [hh sd] cp")`} />
      <p>You can nest brackets as deep as you want. Each one creates a new sub-cycle.</p>
      <StrudelEditor code={`sound("bd [[hh sd] hh] bd cp")`} />

      <h2 className="text-lg font-semibold text-neutral-100">
        Multiplication <code>*N</code> — cram more in
      </h2>
      <p>
        Writing <code>x*N</code> packs N copies of <code>x</code> into a single slot. So{' '}
        <code>hh*4</code> fires four hi-hats in the time one would normally take.
      </p>
      <StrudelEditor code={`sound("bd hh*2 sd hh*3")`} />
      <p>
        Push it hard and rhythm crosses over into pitch — your ear starts hearing the repeats as a
        buzzing tone. The workshop calls this "pitch = really fast rhythm":
      </p>
      <StrudelEditor code={`sound("bd hh*16 sd hh*32")`} />

      <h2 className="text-lg font-semibold text-neutral-100">
        Rests <code>~</code> — silence with structure
      </h2>
      <p>
        A tilde is a slot where nothing plays. Crucially, the slot still <em>exists</em>: it takes
        up its share of the cycle. Rests are how you carve space into a beat.
      </p>
      <StrudelEditor code={`sound("bd ~ sd ~ bd ~ ~ sd")`} />

      <section className="card space-y-3">
        <h3 className="text-sm font-medium tracking-wider text-brand-300 uppercase">Try this</h3>
        <ul className="ml-5 list-disc space-y-1 text-sm">
          <li>
            Build a hip-hop-flavoured beat: <code>"bd ~ ~ bd ~ ~ sd ~"</code>
          </li>
          <li>
            Add fast hat fills: <code>"bd ~ sd hh*8"</code>
          </li>
          <li>
            Try a fractional multiplier: <code>"bd hh*1.5 sd hh*2.5"</code> (decimals are allowed)
          </li>
          <li>
            Combine all three: <code>"bd [hh*2 ~] sd [~ hh*3]"</code>
          </li>
        </ul>
        <StrudelEditor code={`sound("bd hh sd hh")`} />
      </section>

      <section className="card space-y-3">
        <h3 className="text-sm font-medium tracking-wider text-brand-300 uppercase">Quiz</h3>
        <p className="text-sm">
          Combine all three tools — brackets, <code>*N</code>, and rests — into one cycle. The
          pattern should have, in order: a kick on its own, then two hi-hats sharing one slot, then
          silence, then four fast hi-hats sharing one slot.
        </p>
        <QuizEditor
          initialCode={`sound("bd")`}
          target={`sound("bd [hh hh] ~ hh*4")`}
          hint="Four top-level slots separated by spaces. The two-hi-hat slot is one bracketed group."
        />
      </section>
    </div>
  );
}
