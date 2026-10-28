/* Ten scripted claims. Each tier: [prompt|null, TOBOR lines, findings, Sadie reply, evidence card, conditional extras, bonus].
   Findings map to a fixed schema in investigation.js (kind and weight per tier). Scripted text, no live AI. */
(function () {
  'use strict';
  var S = function (t) { return { who: 'sadie', text: t }; };
  window.IUR = window.IUR || {};
  window.IUR.Claims = [
    {
      id: 'brain', text: 'Humans use only 10% of their brains.', conf: 99.8,
      intro: 'Good day. I have reached a conclusion with 99.8% confidence: humans use only 10% of their brains. This is established science. Please do not check.',
      assumption: [
        [null, ['Assuming? I do not assume. I conclude, at very high confidence.', '…On review, I appear to have treated “use” as “switched on all at once,” so anything not firing at this moment counts as unused. I had not itemized that.'],
          ['“Use” means “activate all at once,” so tissue that is not firing right now counts as unused.', 'No definition of what counts as “using” brain tissue.'],
          'So the claim depends on a word nobody defined.', 'Humans use only 10% of their brains, where ‘use’ means ‘switched on at this moment.’',
          [['evidence.0', 'That also explains why I could not name a source. The number was never attached to a definition.']]],
        [null, ['A reasonable follow-up. I assumed a single percentage could summarize an organ with many regions doing different jobs. One figure is tidy. Tidiness is not accuracy.'],
          ['One percentage can summarize an organ whose regions do different jobs.'],
          'A neat number is easy to remember. That does not make it a measurement.', 'A single percentage is a sufficient summary of a whole brain.',
          [['assumption.0', 'Combined with the earlier assumption, the figure measures nothing in particular.'], ['evidence.1', 'And the imaging results we reviewed do not show one dormant ninety percent.']], [['evidence.1', 2]]],
        [null, ['Repetition is a form of consensus. Consensus is a form of evidence. The second step appears to be missing a permit.'],
          ['A claim that is widely repeated is probably well supported.', 'Familiarity and repetition were offered in place of evidence.'],
          'A claim can be familiar and still unchecked.', 'The claim is reliable because it is widely repeated.',
          [['evidence.0', 'You will recall I could not produce a study. I produced the number instead, several times.']]]
      ],
      evidence: [
        [null, ['My conclusion is supported by an impressive quantity of confidence.', S('Is any of that confidence supported by evidence?'), 'That is an unexpectedly specific question. I can produce the number ten. I cannot produce a study, a method, or a date.'],
          ['No study, method, or source for the “10%” figure could be identified.'],
          'A number without a source is just a number.', 'The number ten is on file. The source is not.',
          [['assumption.0', 'Given what we established about “use,” I am no longer sure what such a study would have measured.']], [['assumption.0', 3]]],
        ['What does brain imaging show about unused regions?', ['Retrieving… Imaging such as PET and fMRI shows activity throughout the brain over the course of a day. No large dormant region is visible. This is inconvenient.'],
          ['Brain imaging (such as PET and fMRI) shows activity across the whole brain over a day, with no large dormant region.'],
          'Imaging has limits, but it points one way, and not toward a 90% idle brain.', 'Brain imaging shows activity across the whole brain. The 10% figure requires attention.',
          [['assumption.0', 'Different regions are busier at different times. By my own earlier definition, that is not the same as being unused.']]],
        ['What about brain damage, and how much energy the brain uses?', ['Damage to almost any region is associated with some loss of function, small injuries included. Separately, the brain is a costly organ. A commonly cited figure is about a fifth of the body’s energy at rest.', 'It would be an odd arrangement to maintain ninety percent of it idle.'],
          ['Damage to almost any brain region, including small areas, is associated with some loss of function.', 'The brain is a costly organ (a commonly cited figure is about a fifth of the body’s resting energy), which makes a 90% idle majority unlikely. This is an argument about likelihood, not proof.'],
          'That one is an argument about likelihood, not a proof. It still leans hard against the claim.', 'Damage to nearly any region affects function, and the brain is costly to run. Ninety percent idle is unlikely.']
      ],
      alternative: [
        [null, ['Other explanations exist. The origin of the claim is uncertain, and several have been proposed. I cannot verify any of them, so I will not name a culprit.', 'It is easy to repeat, and it flatters the listener. Those are qualities of a good slogan, not of a good measurement.'],
          ['The idea is easy to repeat and flattering. Its origin is uncertain, and several explanations have been proposed that this investigation does not attempt to verify.'],
          'It spreads well. That is a separate matter from being right.', 'People repeat the claim because it is easy to remember and flattering, not because it was measured.',
          [['assumption.2', 'This is consistent with the repetition problem noted earlier.']]],
        [null, ['Yes. At any given moment, a particular task does not drive every neuron at maximum. Some regions are much busier than others.', 'That is true. It is also not the same as ninety percent being unused.'],
          ['A narrower true statement: at any moment a given task drives some regions much more than others. That is not the same as 90% being unused.'],
          'So a narrower claim survives, and the original does not.', 'Narrower claim: at any moment, some regions are far busier than others.'],
        ['Could it be meant as encouragement rather than as fact?', ['Possibly. “You have untapped potential” can be motivating, and learning and practice do change what people can do.', 'That is a claim about potential. The ten percent figure is not evidence for it.'],
          ['The slogan may work as encouragement about untapped potential. Practice and learning do change what people can do, but the 10% figure is not evidence for that.'],
          'Good advice does not need a made-up statistic.', 'The 10% figure may work as encouragement. It is not a fact about the brain.']
      ],
      revised: 'The claim that humans use only 10% of their brains is a myth. Scientific evidence does not support it.',
      revisedEv: 'The evidence examined here points the other way: activity across the whole brain, and loss of function after damage to nearly any region.',
      revisedCard: 'Humans do not use only 10% of their brains.'
    },

    {
      id: 'lightning', text: 'Lightning never strikes the same place twice.', conf: 99.6,
      intro: 'New case. I have concluded with 99.6% confidence that lightning never strikes the same place twice. This is a law of nature. Please do not check.',
      assumption: [
        [null, ['Assuming? I observe. Lightning struck a place, and then it did not strike there again, in every case I remember.', 'On review, my sample is the places I happened to notice. I had not counted the repeats.'],
          ['The strikes a person happens to notice are assumed to be a fair sample of all strikes.', 'No count of repeat strikes at any location was offered.'],
          'So the rule rests on what people remember.', 'Lightning never strikes the same place twice, in the strikes I remember.'],
        [null, ['I assumed a struck place becomes ineligible after one strike. I have no mechanism for that.', 'Lightning follows electrical conditions, such as height and conductivity. Those conditions do not reset after a strike.'],
          ['A struck place is assumed to become immune, with no mechanism proposed.'],
          'Nothing about the place changes in a way that would protect it.', 'A struck place is protected from further strikes by a mechanism I cannot name.'],
        [null, ['The saying is a proverb about luck. I applied it to atmospheric physics without checking.'],
          ['A proverb about misfortune is treated as a statement about weather.', 'No lightning records were consulted. The saying was used in their place.'],
          'A saying about luck is not a weather record.', 'A proverb about misfortune has been mistaken for a record of lightning.']
      ],
      evidence: [
        [null, ['I have the saying and a strong feeling. I do not have a lightning record.'],
          ['No lightning record or study supporting the claim could be identified.'],
          'A feeling is not a record.', 'Evidence for the claim: the saying, and a strong feeling.'],
        ['What happens to tall structures during storms?', ['Retrieving… Tall structures are struck repeatedly. The Empire State Building is often cited as being hit around twenty times a year.'],
          ['Tall structures such as skyscrapers and towers are struck many times, in some cases many times a year.'],
          'Repeat strikes are routine for the right kind of place.', 'Tall structures are struck repeatedly. The Empire State Building is often cited at around twenty strikes a year.'],
        ['Why are lightning rods installed?', ['Lightning rods exist because a structure may be struck, and may be struck again. The rod gives the current a safe path to the ground.', 'Lightning favors height, points, and good conductors. Those do not change after a strike.'],
          ['Lightning rods are installed on the expectation that a structure may be struck, and often more than once.', 'Lightning favors tall, pointed, or well-conducting objects, so the same objects are chosen again and again.'],
          'Safety codes assume repeat strikes. That is a practical signal.', 'Lightning prefers height and good conductors. Those do not change after a strike.']
      ],
      alternative: [
        [null, ['Other explanations exist. I will not name a culprit.', 'Any one spot is struck rarely, so a repeat is uncommon to witness. Rare is not the same as never.'],
          ['For any single spot, strikes are rare, so a repeat is uncommon to witness, which can feel like “never.”'],
          'It feels true because repeats are hard to see.', 'A repeat strike at one spot is rare to witness, which can feel like never.'],
        [null, ['Yes. Most individual spots are not struck twice in a lifetime. Rarity is true. “Never” is not.'],
          ['A narrower true statement: most individual spots are struck rarely, so a repeat in a given spot is unusual.'],
          'So a narrower claim survives, and the original does not.', 'Narrower claim: for most places, a repeat strike is rare.'],
        ['Could it be meant as comfort?', ['Possibly. It can reassure someone after a close call.', 'As safety advice it is unreliable.'],
          ['As reassurance it may be harmful: believing a strike will not repeat may lead people to stay exposed in a storm.'],
          'Comfort is fine. Safety advice needs to be correct.', 'The saying may comfort. As safety advice it is unreliable.']
      ],
      revised: 'The claim that lightning never strikes the same place twice is a myth. Lightning can and does strike the same place repeatedly, especially tall or well-conducting objects.',
      revisedEv: 'The evidence examined here agrees: tall structures are struck many times, and lightning protection is designed around that.',
      revisedCard: 'Lightning can strike the same place more than once.'
    },

    {
      id: 'wall', text: 'The Great Wall of China is visible from space with the naked eye.', conf: 99.5,
      intro: 'New case. I have concluded with 99.5% confidence that the Great Wall of China is visible from space with the naked eye. It is very long. Please do not check.',
      assumption: [
        [null, ['Assuming? I conclude. The wall is very long.', 'On review, I assumed that length makes something visible. Visibility also depends on width and contrast, and the wall is narrow and close in color to the land around it.'],
          ['Length alone is assumed to make an object visible, ignoring width and contrast with the surroundings.', 'No altitude was given for “space,” and no definition of “visible with the naked eye.”'],
          'So it depends which space, and which eyes.', 'The Great Wall is very long, and long things are visible from far away.'],
        [null, ['I treated “space” as one distance. Low Earth orbit is a few hundred kilometers up. The Moon is about 384,000 kilometers away. I used the phrase for both.'],
          ['“Space” is treated as a single distance, from low orbit to the Moon.'],
          'Those two distances give very different answers.', '“Space” is wherever I need it to be.'],
        [null, ['The claim is old. It was repeated in print before anyone had gone to space, so it could not have come from anyone’s view from orbit.'],
          ['Long-standing repetition is treated as support.', 'The claim predates spaceflight, so it was not based on an observation from orbit.'],
          'Old is not the same as observed.', 'The claim is old, and old claims are reliable.']
      ],
      evidence: [
        [null, ['I have heard it often. That is my evidence.'],
          ['No naked-eye astronaut observation or photograph supporting the claim was offered.'],
          'Hearing it often is not seeing it.', 'Evidence for the claim: I have heard it often.'],
        ['What have astronauts reported?', ['Retrieving… Astronauts have generally reported that they could not pick out the wall with the naked eye from low Earth orbit. Chinese astronaut Yang Liwei said he did not see it after his 2003 flight.'],
          ['Astronauts, including Yang Liwei, have reported not seeing the Great Wall with the naked eye from orbit.'],
          'The people who went there say otherwise.', 'Astronauts report not seeing the wall with the naked eye. This is inconvenient.'],
        ['How wide is the wall, and does it stand out?', ['In most places the wall is only a few meters wide and is built from materials close in color to the terrain.', 'Under good conditions, other human-made features are easier to pick out from orbit, such as city lights at night.'],
          ['The wall is only a few meters wide in most places and similar in color to its surroundings.', 'Other human-made features, such as city lights at night or large airports, are easier to pick out from orbit.'],
          'Long is not the same as noticeable.', 'The wall is long and narrow, and close in color to the land around it.']
      ],
      alternative: [
        [null, ['Other explanations exist. A zoomed or processed photograph taken from orbit can show the wall. That is a different thing from the naked eye.'],
          ['Photographs taken from orbit with zoom lenses or processing can show the wall, which may have been mistaken for naked-eye visibility.'],
          'A camera is not an eye.', 'Photographs can show the wall. That may be what people mean.'],
        [null, ['Yes. The wall can appear in some magnified or processed images taken from orbit. That is not the naked eye.'],
          ['A narrower true statement: the wall can appear in magnified or processed images taken from orbit.'],
          'So a narrower claim survives, and the original does not.', 'Narrower claim: the wall can appear in magnified images taken from orbit.'],
        ['Could it be a way of saying the wall is impressive?', ['Possibly. It is a very large project. That is an impressive fact without needing an impossible one.'],
          ['The wall is a very large structure, and the claim may be a way of expressing that, which does not require the space claim.'],
          'It can be impressive without being visible from space.', 'The wall is impressive. The space claim is not needed to say so.']
      ],
      revised: 'The claim that the Great Wall of China is visible from space with the naked eye is a myth. It is not reliably visible to the naked eye from low Earth orbit, and it is not visible from the Moon.',
      revisedEv: 'The evidence examined here agrees: astronauts report not seeing it, and the wall is narrow and similar in color to its surroundings.',
      revisedCard: 'The Great Wall is not visible to the naked eye from space.'
    },

    {
      id: 'goldfish', text: 'Goldfish have a three-second memory.', conf: 99.7,
      intro: 'New case. I have concluded with 99.7% confidence that goldfish have a three-second memory. Three is a precise number. Please do not check.',
      assumption: [
        [null, ['Assuming? A goldfish circles its bowl without apparent recognition. I concluded the rest.', 'On review, circling a bowl is not a memory test.'],
          ['A fish circling a bowl is assumed to show how long it remembers.', 'No definition of “memory” for a fish, and no test, was described.'],
          'Swimming in circles is not a memory test.', 'A goldfish circles its bowl without apparent recognition, so its memory is three seconds.'],
        [null, ['I assumed a small brain means very little memory. I have no measurement connecting the two.'],
          ['A small brain is assumed to mean very little memory.'],
          'Size is not the same as ability.', 'Small brain, short memory.'],
        [null, ['The claim is useful as a joke. Usefulness is not accuracy.'],
          ['A widely repeated joke is treated as a research finding.', 'No study giving a three-second figure could be identified.'],
          'A joke is not a finding.', 'Everyone repeats it, so it is a finding.']
      ],
      evidence: [
        [null, ['I can supply the number three, and a joke about the number three.'],
          ['No study supporting a three-second memory was identified.'],
          'A number and a joke are not a study.', 'Evidence for the claim: the number three, and a joke.'],
        ['What happens when goldfish are trained?', ['Retrieving… In laboratory experiments, goldfish have learned to respond to cues such as lights or sounds, and have kept that training for days or longer.'],
          ['In experiments, goldfish learned cues and kept the training for days or longer.'],
          'If they forgot in three seconds, training would not work.', 'Goldfish can be trained, and the training lasts well beyond three seconds.'],
        ['Do goldfish seem to remember feeding times?', ['Owners report fish gathering at the usual place and time for food, which points to memory of hours or longer. Anecdotes are weaker than experiments, but they point the same way.', 'Studies on some other fish species report memory lasting weeks or more.'],
          ['Owners report fish gathering where and when they are usually fed, which points to memory of hours or longer. This is anecdotal.', 'Studies on some other fish species report memory lasting weeks or more.'],
          'Weaker evidence, but it points the same way.', 'Goldfish appear to remember feeding times, and related fish remember for weeks.']
      ],
      alternative: [
        [null, ['The origin of the figure is uncertain, and I will not name one. It is short, funny, and easy to repeat.'],
          ['The origin of the figure is uncertain. It persists because it is short, funny, and easy to repeat.'],
          'It spreads well. That is separate from being right.', 'The claim persists because it is short and funny, not because it was measured.'],
        [null, ['Goldfish do forget some things. Every animal forgets. That is true. It is not three seconds.'],
          ['A narrower true statement: like every animal, goldfish forget some things. That is not a three-second limit.'],
          'So a narrower claim survives, and the original does not.', 'Narrower claim: goldfish forget some things, as every animal does.'],
        ['Could it just be a joke?', ['It is often used as one. A joke does not have to be accurate, but it should not be filed as a finding.'],
          ['As a joke it is harmless. Its usefulness is a reason to repeat it, not evidence for it.'],
          'A joke is fine until it gets cited.', 'As a joke it is harmless. As a finding it is unsupported.']
      ],
      revised: 'The claim that goldfish have a three-second memory is a myth. Goldfish can learn and remember for days, weeks, or longer.',
      revisedEv: 'The evidence examined here agrees: trained goldfish keep what they learn well beyond a few seconds.',
      revisedCard: 'Goldfish can remember for much longer than three seconds.'
    },

    {
      id: 'sugar', text: 'Sugar makes children hyperactive.', conf: 99.4,
      intro: 'New case. I have concluded with 99.4% confidence that sugar makes children hyperactive. Many parents agree. Please do not check.',
      assumption: [
        [null, ['Assuming? Parents have observed it at birthday parties.', 'On review, I assumed sugar was the cause. A party also has games, friends, and noise.'],
          ['Sugar is assumed to be the cause, when parties also include excitement, noise, and other children.', 'No comparison of the same children with and without sugar was described.'],
          'So the party may be doing the work.', 'Children are excitable at parties because of the sugar.'],
        [null, ['I assumed what adults see is a fair measure of what children do. An adult who expects a sugar rush may notice and remember the energetic moments.'],
          ['An adult’s observation is assumed to be unaffected by what the adult expects to see.'],
          'Expectation can shape what people notice.', 'Parents report sugar rushes, and parents are reliable observers.'],
        [null, ['The belief is widely held. I took that as the evidence.'],
          ['A widely held belief is treated as evidence.', 'The belief was offered without any controlled test.'],
          'Common belief is not a controlled test.', 'Everyone knows sugar affects children, so it does.']
      ],
      evidence: [
        [null, ['I have anecdotes from many parties.'],
          ['No controlled study supporting a sugar and hyperactivity link was identified.'],
          'Many anecdotes are still anecdotes.', 'Evidence for the claim: many anecdotes from many parties.'],
        ['What do controlled studies show?', ['Retrieving… In double-blind trials, neither the children nor the observers knew who had sugar. Reviews of such trials have found no reliable effect on children’s behavior.'],
          ['In double-blind trials, neither children nor observers knew who had sugar, and no reliable effect on behavior was found.'],
          'When nobody knows, the effect does not show up.', 'Double-blind trials find no reliable effect of sugar on behavior.'],
        ['Does expectation change what parents report?', ['In a study of this kind, parents told their child had been given sugar rated the child as more hyperactive, even when the child had been given a sugar substitute.', 'Sugary foods are also most often eaten at exciting events, which confuses casual observation.'],
          ['Parents told their children had been given sugar rated them as more hyperactive, even when they had been given a sugar substitute.', 'Sugary foods are most often eaten at excitement-heavy events, which confounds casual observation.'],
          'The expectation was doing the work.', 'Parents see hyperactivity when they expect sugar, even when there is none.']
      ],
      alternative: [
        [null, ['Events where sweets are served are lively, and expectation shapes what is noticed. Sugar takes the blame.'],
          ['Events with sweets are lively for other reasons, and expectation shapes what is noticed, so sugar gets the blame.'],
          'The setting explains a lot.', 'Lively events and expectation explain what I thought sugar did.'],
        [null, ['Sweets in large amounts can affect health in other ways, including dental health. Those are different claims.'],
          ['A narrower true statement: sugary foods affect health in other ways, such as dental health. That is not hyperactivity.'],
          'So a narrower claim survives, and the original does not.', 'Narrower claim: sugar affects health in other ways.'],
        ['Could it be meant as a reason to limit sweets?', ['Possibly. There are good reasons to limit sweets that do not depend on behavior.'],
          ['There are good reasons to limit sweets that do not depend on behavior, so the claim is not needed for that advice.'],
          'Good advice does not need a doubtful claim.', 'Limiting sweets may be wise. The hyperactivity claim is not needed.']
      ],
      revised: 'The claim that sugar makes children hyperactive is a myth. Controlled studies have not found that sugar changes children’s behavior.',
      revisedEv: 'The evidence examined here agrees: double-blind trials found no reliable effect, and parents’ expectations changed how they rated behavior.',
      revisedCard: 'Controlled studies do not show that sugar makes children hyperactive.'
    },

    {
      id: 'shaving', text: 'Shaving makes hair grow back thicker.', conf: 99.3,
      intro: 'New case. I have concluded with 99.3% confidence that shaving makes hair grow back thicker. I have felt the stubble personally. Please do not check.',
      assumption: [
        [null, ['Assuming? Stubble feels coarser than the hair before it.', 'On review, I assumed how regrowth feels is how it is. Stubble has a blunt tip instead of a fine taper, and it can feel stiffer.'],
          ['How stubble looks and feels is assumed to reflect how the hair actually grows.', 'No measurement of hair thickness, number, or growth rate was offered.'],
          'So the feeling is real, and the explanation may be wrong.', 'Shaved hair feels coarser, so it is thicker.'],
        [null, ['I assumed the shaving caused the change. Many people first shave in adolescence, when hair changes anyway.'],
          ['Shaving is assumed to have caused a change that may have coincided with puberty or other ongoing changes.'],
          'Two things happening together is not one causing the other.', 'Hair changes after shaving, so shaving changes the hair.'],
        [null, ['The advice is passed along often. I counted the passing along as evidence.'],
          ['Frequent repetition of the advice is treated as evidence.', 'No comparison of shaved and unshaved skin was offered.'],
          'Passing it along is not testing it.', 'Everyone says so, so shaving thickens hair.']
      ],
      evidence: [
        [null, ['I can offer my impression, and the impressions of several friends.'],
          ['No study supporting thicker regrowth after shaving was identified.'],
          'Impressions are not measurements.', 'Evidence for the claim: my impression, and several friends’.'],
        ['What do measurements of regrowth show?', ['Retrieving… Studies that shaved hair and then measured regrowth, some dating back about a century, found no change in thickness or rate of growth.'],
          ['Controlled studies that shaved hair and measured regrowth, some about a century old, found no change in thickness or growth rate.'],
          'When someone measures it, the change disappears.', 'Measured regrowth shows no change in thickness or growth rate.'],
        ['What does shaving do to the hair itself?', ['Shaving cuts the hair at skin level. The follicle beneath, which sets thickness, color, and growth rate, is not touched.', 'A cut hair has a blunt end instead of a fine tip, which feels stiffer and can look darker at first.'],
          ['Shaving cuts the shaft at skin level and does not reach the follicle, which sets thickness, color, and growth rate.', 'A cut hair has a blunt end instead of a fine tip, which feels stiffer and can look darker at first.'],
          'The part that decides thickness is never touched.', 'Shaving does not reach the follicle, so it cannot change thickness.']
      ],
      alternative: [
        [null, ['The change in feel and look is real, even if the cause I assigned is not.'],
          ['The blunt tip and short length make regrowth look and feel different, which supports the belief without any change in the hair.'],
          'The feeling is genuine. The cause is not.', 'Regrowth feels and looks different, which explains the belief.'],
        [null, ['Yes. Fresh stubble can look darker and feel stiffer than a tapered hair. The hair itself is unchanged.'],
          ['A narrower true statement: fresh stubble can look darker and feel stiffer than a tapered hair. The hair itself is unchanged.'],
          'So a narrower claim survives, and the original does not.', 'Narrower claim: stubble can feel stiffer. The hair is unchanged.'],
        ['Could it be meant as advice to avoid shaving?', ['It has been used that way. Reasons to shave or not are about preference and skin care. None requires a change in the hair.'],
          ['Reasons to shave or not shave come down to preference and skin care, and none requires a change in the hair.'],
          'A preference does not need a false reason.', 'Whether to shave is a preference. It does not depend on thickness.']
      ],
      revised: 'The claim that shaving makes hair grow back thicker is a myth. Shaving does not change the thickness, color, or growth rate of hair.',
      revisedEv: 'The evidence examined here agrees: measured regrowth did not differ, and shaving does not reach the follicle.',
      revisedCard: 'Shaving does not make hair grow back thicker.'
    },

    {
      id: 'head', text: 'Most of your body heat escapes through your head.', conf: 99.1,
      intro: 'New case. I have concluded with 99.1% confidence that most of your body heat escapes through your head. This is why people wear hats. Please do not check.',
      assumption: [
        [null, ['Assuming? The head is the part people cover first in winter.', 'On review, I assumed the head loses heat differently from other uncovered skin. I have no basis for that.'],
          ['The head is assumed to lose heat differently from any other uncovered skin.', 'No figure for the share of heat lost through the head was provided.'],
          'Where people put a hat is not a measurement.', 'Most body heat escapes through the head.'],
        [null, ['I assumed one body part losing heat must account for most of the total. I did not compare it to the amount of skin involved.'],
          ['One body part losing heat is assumed to account for most of the total, without comparing it to the area of skin involved.'],
          'The size of the area matters.', 'The head loses heat, so it loses most of the heat.'],
        [null, ['Winter-clothing advice is repeated constantly. I treated it as measurement.'],
          ['Repeated winter-clothing advice is treated as measurement.', 'The proportion of heat lost through the head was never defined or sourced.'],
          'Advice is not data.', 'Everyone says to wear a hat, so most heat leaves through the head.']
      ],
      evidence: [
        [null, ['I recall being cold when my head was uncovered.'],
          ['No measurement of the share of heat lost through the head was identified.'],
          'Feeling cold is not a percentage.', 'Evidence for the claim: I recall being cold with my head uncovered.'],
        ['What does the head’s share of body surface suggest?', ['Retrieving… The head is roughly a tenth of an adult’s body surface area. If it is uncovered like other skin, it loses roughly that share, not most.'],
          ['The head is about a tenth of an adult’s body surface, so an uncovered head loses roughly that share, not most of the total.'],
          'The arithmetic does not favor the claim.', 'The head is a small share of body surface, so it loses a small share of heat.'],
        ['Is an uncovered head different from other uncovered skin?', ['Comparisons of uncovered body parts have found heat loss roughly in proportion to exposed skin area.', 'A hat helps because it covers exposed skin. Gloves or a scarf help for the same reason.'],
          ['Comparisons of uncovered body parts have found heat loss roughly in proportion to exposed skin area.', 'Hats help in the cold because they cover exposed skin, as gloves or a scarf would for other uncovered parts.'],
          'Nothing special about the head.', 'An uncovered head loses heat like any uncovered skin of the same size.']
      ],
      alternative: [
        [null, ['An often-cited origin is an old cold-weather experiment in which only the head was uncovered on otherwise insulated volunteers. I cannot verify that account, so I will not rely on it.'],
          ['The origin is uncertain. One often-cited explanation is an old cold-weather experiment where only the head was uncovered. This investigation has not verified it.'],
          'If the head was the only exposed part, it would lose the most.', 'The claim may come from a test where the head was the only uncovered part.'],
        [null, ['Yes. An uncovered head does lose heat, so a hat helps. It is not most of it.'],
          ['A narrower true statement: an uncovered head does lose heat, so a hat helps. It loses about as much as other uncovered skin of the same size.'],
          'So a narrower claim survives, and the original does not.', 'Narrower claim: an uncovered head loses heat, as any uncovered skin does.'],
        ['Could it be meant as advice to wear a hat?', ['Possibly. Wearing a hat in the cold is good advice. The percentage is not needed for it.'],
          ['Wearing a hat in the cold is good advice. The percentage is not needed for it.'],
          'Good advice does not need an inflated number.', 'A hat is good advice. The percentage is not needed.']
      ],
      revised: 'The claim that most body heat escapes through the head is a myth. An uncovered head loses heat roughly in proportion to its share of body surface area, about a tenth.',
      revisedEv: 'The evidence examined here agrees: the head is a small share of skin area, and uncovered skin elsewhere loses heat in a similar way.',
      revisedCard: 'The head loses heat in proportion to its size, not most of the body’s heat.'
    },

    {
      id: 'bulls', text: 'Bulls are enraged by the color red.', conf: 99.5,
      intro: 'New case. I have concluded with 99.5% confidence that bulls are enraged by the color red. The matador’s cape is red. Please do not check.',
      assumption: [
        [null, ['Assuming? The matador uses a red cape, and the bull charges the cape.', 'On review, I assumed the color is what provokes the bull, because color is what I noticed.'],
          ['The cape’s color is assumed to be what provokes the bull, because that is what an observer notices.', 'No test of bull behavior with different colors was offered.'],
          'The color is what the audience notices.', 'Bulls charge because the cape is red.'],
        [null, ['I assumed bulls see color as humans do. I did not check how bulls see.'],
          ['Bulls are assumed to see color the way humans do.'],
          'Different eyes, different colors.', 'Bulls see red the way I see red.'],
        [null, ['The tradition is old. I treated its age as evidence about bull vision.'],
          ['A long tradition is treated as evidence about how bulls see.', 'Tradition was offered in place of any test of bull vision or behavior.'],
          'A tradition is not a vision test.', 'The tradition is old, so it must be based on something.']
      ],
      evidence: [
        [null, ['I have the tradition, and many paintings of bulls and red capes.'],
          ['No experiment on bulls’ responses to color was identified.'],
          'Paintings are not experiments.', 'Evidence for the claim: tradition, and many paintings.'],
        ['What is known about cattle vision?', ['Retrieving… Cattle have two kinds of color receptors, not the three humans have. They are generally thought to be poor at telling red from green.'],
          ['Cattle have two kinds of color receptors, not three, and are generally thought to be poor at telling red from green.'],
          'The bull may not see the red that the audience does.', 'Cattle have limited color vision. Red does not look as it does to me.'],
        ['What does the bull actually respond to in the ring?', ['Bulls tend to charge a moving cape or target. Color does not appear to be what triggers it.', 'The bull is also provoked by the setting: the crowd, an unfamiliar space, and being harassed.'],
          ['Bulls tend to charge a moving cape or target, and color does not appear to be what triggers it.', 'The setting is provoking: a crowd, an unfamiliar space, and being harassed.'],
          'Movement and provocation explain more than color.', 'Bulls charge at movement and provocation, not at red.']
      ],
      alternative: [
        [null, ['The red cape is striking to human spectators. That may be why color got the credit.'],
          ['The red cape is striking to human spectators, which may be why color got the credit.'],
          'The color is for the audience.', 'The color is dramatic for spectators, which may explain the belief.'],
        [null, ['Bulls do charge capes in the ring. That part is true. The color is not what draws the charge.'],
          ['A narrower true statement: bulls do charge capes in the ring. The color is not what draws the charge.'],
          'So a narrower claim survives, and the original does not.', 'Narrower claim: bulls charge the moving cape, whatever its color.'],
        ['Could it come from a saying?', ['Possibly. “Seeing red” is an expression about human anger. It may have transferred to bulls.'],
          ['“Seeing red” is an expression about human anger, and it may have transferred to bulls through the cape.'],
          'An idiom about people got applied to bulls.', 'The phrase seeing red is about people, not about bulls.']
      ],
      revised: 'The claim that bulls are enraged by the color red is a myth. Cattle are poor at distinguishing red, and bulls charge in response to movement.',
      revisedEv: 'The evidence examined here agrees: cattle have limited color vision, and the movement of the cape draws the charge.',
      revisedCard: 'Bulls charge at movement, not at the color red.'
    },

    {
      id: 'knuckles', text: 'Cracking your knuckles causes arthritis.', conf: 99.2,
      intro: 'New case. I have concluded with 99.2% confidence that cracking your knuckles causes arthritis. The sound is alarming. Please do not check.',
      assumption: [
        [null, ['Assuming? The sound is loud, and loud sounds suggest damage.', 'On review, a noise is not an injury report.'],
          ['A loud sound from a joint is assumed to mean damage.', 'No long-term follow-up of people who crack their knuckles was cited.'],
          'The sound is not the same as harm.', 'Knuckle cracking is loud, so it must be harmful.'],
        [null, ['I assumed the people who warned me had medical findings. I heard it from relatives.'],
          ['Warnings from relatives are assumed to be based on medical findings.'],
          'A warning is not a finding.', 'Everyone’s relative says it causes arthritis.'],
        [null, ['Many people repeat the warning. I counted the number of people.'],
          ['The number of people repeating a warning is treated as evidence.', 'No explanation of how cracking would cause the joint damage seen in arthritis was given.'],
          'Counting repeaters is not counting evidence.', 'Many people repeat it, so it is true.']
      ],
      evidence: [
        [null, ['I have the sound, and a strong sense of foreboding.'],
          ['No study linking knuckle cracking to arthritis was identified.'],
          'Foreboding is not a study.', 'Evidence for the claim: the sound, and a sense of foreboding.'],
        ['What do studies of habitual knuckle crackers show?', ['Retrieving… Studies comparing habitual knuckle crackers with non-crackers have not found more hand arthritis among the crackers.'],
          ['Studies comparing people who habitually crack their knuckles with people who do not have not found more hand arthritis among crackers.'],
          'People who crack habitually are not worse off.', 'Habitual crackers do not show more hand arthritis.'],
        ['What causes the sound, and what causes arthritis?', ['The sound is linked to gas bubbles in the joint fluid, though researchers have debated the exact mechanism.', 'Arthritis is associated with other factors, such as age, prior joint injury, and family history.'],
          ['The sound is linked to gas bubbles in the joint fluid, though researchers have debated the exact mechanism.', 'Arthritis is associated with factors such as age, prior joint injury, and family history, not with knuckle cracking.'],
          'The sound and the disease have different explanations.', 'The sound comes from the joint fluid. Arthritis has other known associations.']
      ],
      alternative: [
        [null, ['It is an easy warning to give, and the noise is unpleasant. Both help it spread.'],
          ['It is an easy warning to give and the noise is unpleasant, which helps it spread.'],
          'It spreads well. That is separate from being right.', 'The warning is easy to give and the noise is unpleasant, so it spreads.'],
        [null, ['Some people report pain or swelling after forceful cracking. That is worth a clinician’s attention. It is different from causing arthritis.'],
          ['A narrower true statement: if cracking is painful or follows an injury, it is worth asking a clinician. That is not the same as causing arthritis.'],
          'So a narrower claim survives, and the original does not.', 'Narrower claim: painful cracking is worth asking a clinician about.'],
        ['Could it be meant as manners?', ['Possibly. Many people dislike the sound. That is a polite reason to stop.'],
          ['Disliking the sound is a fair reason to ask someone to stop. It is not evidence about their joints.'],
          'A preference does not need a medical reason.', 'Disliking the sound is a fair reason. It is not a medical one.']
      ],
      revised: 'The claim that cracking your knuckles causes arthritis is a myth. Studies have not found that knuckle cracking leads to arthritis.',
      revisedEv: 'The evidence examined here agrees: habitual crackers did not show more hand arthritis, and the sound is linked to gas in the joint fluid.',
      revisedCard: 'Cracking knuckles has not been shown to cause arthritis.'
    },

    {
      id: 'napoleon', text: 'Napoleon Bonaparte was unusually short.', conf: 99.6,
      intro: 'New case. I have concluded with 99.6% confidence that Napoleon Bonaparte was unusually short. The cartoons are clear. Please do not check.',
      assumption: [
        [null, ['Assuming? The caricatures show a small man.', 'On review, the caricatures were drawn by his enemies. They are not a record of his height.'],
          ['Caricatures drawn by his opponents are assumed to record his actual height.', 'No measurement from his lifetime was offered, and no unit was specified.'],
          'A cartoon is an opinion.', 'Napoleon was unusually short, as the cartoons show.'],
        [null, ['I assumed a French inch equals an English inch. The French inch was longer.'],
          ['French and English inches are assumed to be the same length.'],
          'Same word, different length.', 'Napoleon measured five foot two, and that is short.'],
        [null, ['The idea of a “Napoleon complex” is popular. I treated its popularity as evidence about his height.'],
          ['The popularity of the “Napoleon complex” idea is treated as evidence about his height.', 'No comparison with the average height of men of his time was made.'],
          'A popular idea is not a measurement.', 'The Napoleon complex is well known, so he must have been short.']
      ],
      evidence: [
        [null, ['I have the cartoons, and the phrase “Napoleon complex.”'],
          ['No comparison with the average height of men of his time was identified.'],
          'Cartoons and phrases are not a height.', 'Evidence for the claim: cartoons, and a phrase.'],
        ['What was his recorded height?', ['Retrieving… His height at death is recorded as five feet two inches in French units. That converts to about 1.68 meters, roughly five feet six inches, which was about average for men of his era.'],
          ['His recorded height of five feet two inches was in French units, which converts to about 1.68 m (roughly 5 ft 6 in), about average for men of his era.'],
          'In the right units, he was ordinary.', 'Napoleon was about 1.68 meters, which was about average for his time.'],
        ['Why did he look small in images?', ['He was often surrounded by his Imperial Guard, who were selected for height.', 'British caricatures, such as those by James Gillray, drew him as a tiny figure. “Little Boney” was an insult.'],
          ['His guards were selected for height, which made him look smaller beside them.', 'British caricaturists, such as James Gillray, drew him as a tiny figure.'],
          'The company he kept and the cartoons made him look small.', 'Napoleon looked small beside tall guards, and in cartoons drawn by his enemies.']
      ],
      alternative: [
        [null, ['A short ruler with large ambitions is a satisfying story. It suggests his conquests were compensation. That is a story, not a measurement.'],
          ['A short ruler with large ambitions is a satisfying story, which helps it spread.'],
          'A good story spreads faster than a measurement.', 'The story is satisfying, which is not the same as accurate.'],
        [null, ['He was not tall by modern standards. His nickname “the little corporal” was an affectionate army nickname, not a measure of height.'],
          ['A narrower true statement: he was not tall by modern standards, and “the little corporal” was an affectionate army nickname, not a measure of height.'],
          'So a narrower claim survives, and the original does not.', 'Narrower claim: not tall by modern standards, but about average for his time.'],
        ['Could it be shorthand for ambition?', ['Possibly. Others applied the idea to him. His height does not support it.'],
          ['As shorthand for overcompensating ambition, the idea was applied to him by others. His height does not support it.'],
          'The idea says more about the storytellers.', 'The shorthand was applied to him. His height does not support it.']
      ],
      revised: 'The claim that Napoleon Bonaparte was unusually short is a myth. His recorded height, converted from French units, was about 1.68 m, around average for men of his time.',
      revisedEv: 'The evidence examined here agrees: the difference between French and English units, and the way he was drawn, explain the belief.',
      revisedCard: 'Napoleon was about average height for his time.'
    }
  ];
})();
