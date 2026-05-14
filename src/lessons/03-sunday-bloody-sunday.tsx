import { StrudelEditor } from '../components/StrudelEditor';
import { TryThis } from '../components/TryThis';
import { SongCard } from '../components/SongCard';
import { sundayBloodySunday } from '../tracks/sunday-bloody-sunday';
import { requireStage } from '../tracks';
import type { LessonMeta } from './index';

export const meta: LessonMeta = {
  slug: 'sunday-bloody-sunday',
  title: 'Subdividing time — Sunday Bloody Sunday',
  blurb: "Larry Mullen's machine-gun military beat. Subdivisions, repetition, brackets.",
  order: 3,
};

const drumsStage = requireStage(sundayBloodySunday, 'drums');

export function Lesson() {
  return (
    <div className="space-y-6 text-neutral-300">
      <p>
        U2's drummer Larry Mullen Jr opens <em>Sunday Bloody Sunday</em> with one of the most
        recognizable drum patterns in rock: a relentless &quot;machine-gun&quot; military beat.
        Mullen recorded it at the base of a stairwell in Windmill Lane Studios to capture natural
        reverb. The pattern is simple on paper — backbeat plus hi-hats — but the hi-hats are{' '}
        <em>16th notes</em>, four per beat, giving it that driving, almost-marching feel.
      </p>

      <SongCard track={sundayBloodySunday} />

      <h2 className="text-lg font-semibold text-neutral-100">Subdivisions</h2>
      <p>
        Billie Jean had hi-hats on every <em>8th</em> note — 8 hits per bar.{' '}
        <em>Sunday Bloody Sunday</em> has hi-hats on every <em>16th</em> note — 16 hits per bar.
        That single change is what gives the song its military rhythm.
      </p>
      <p>
        Doubling subdivisions is what <code>*N</code> does. Compare:
      </p>
      <StrudelEditor
        code={`setcpm(98/4)
sound("hh*8")`}
      />
      <p>vs.</p>
      <StrudelEditor
        code={`setcpm(98/4)
sound("hh*16")`}
      />
      <p>
        Same tempo, twice the density. The 16th-note version is what gives it the machine-gun sound.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">The full pattern</h2>
      <p>Stack the kick, snare, and the dense hi-hats:</p>
      <StrudelEditor code={drumsStage.code} />
      <p>
        Listen for the contrast: kicks and snares plodding through quarters, the hi-hat
        machine-gunning underneath. The drum part alone tells you this is a serious song before Bono
        opens his mouth.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">
        Grouping with <code>[ ]</code>
      </h2>
      <p>
        We've seen one way to subdivide (<code>*N</code>). There's another: square brackets. Any
        sequence inside <code>[ ]</code> occupies a single slot, splitting the slot's time evenly:
      </p>
      <StrudelEditor
        code={`setcpm(98/4)
sound("bd [sd sd] bd sd")`}
      />
      <p>
        The third slot — <code>[sd sd]</code> — is two snare hits in the time of one beat (eighth
        notes). That's a quick double snare hit on beat 2. Brackets let you put fast things inside
        slow patterns without disrupting the larger timing.
      </p>

      <p>You can nest brackets to go faster:</p>
      <StrudelEditor
        code={`setcpm(98/4)
sound("bd [sd [sd sd]] bd sd")`}
      />
      <p>
        Now on beat 2 you hear an 8th-note snare followed by two 16th-note snares. <em>Inside</em>{' '}
        the outer brackets, the inner brackets split that half-beat further.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">Build a fill</h2>
      <TryThis
        prompt='Take the Sunday Bloody Sunday beat and add a snare fill on beat 4. Replace the last "~ sd" with "~ [sd sd sd sd]" (4 snare hits jammed into beat 4 — a 16th-note roll).'
        code={drumsStage.code}
      />

      <p className="text-sm text-neutral-500">
        Three rhythm tools so far: <code>*N</code> repeats a sound N times in one slot;{' '}
        <code>[ ]</code> groups sounds together; <code>~</code> is silence. Combined, you can write
        almost any drum pattern. Next lesson we move from rhythm to <em>pitch</em> — single notes —
        with the most-air-bassed riff of the 2000s.
      </p>
    </div>
  );
}
