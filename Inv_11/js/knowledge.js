/* Investigation 11 — Rabbit Hole: curated knowledge structure.
   Static, deterministic content. No network calls. Schema:
   questions[]: {id, title, blurb, root}
   nodes[id]:   {q, level, title, body, src:[sourceKey], next:[[nodeId, label, connectionText]]}
   sources[key]: citation string
   Each edge's connectionText is the bridge shown on arrival and stored in the Research Trail.
   A future live provider can replace RH.provider.getNode(id, trail) without UI changes. */
(function () {
  const RH = (window.RH = {});
  RH.questions = [
    { id: 'dream', title: 'Why do we dream?', blurb: 'Sleep, memory and the brain at night', root: 'd1' },
    { id: 'time', title: 'How did people decide what time it is?', blurb: 'Shadows, bells, railways and atoms', root: 't1' },
    { id: 'build', title: 'Why do some buildings make us uncomfortable?', blurb: 'Space, pattern and the senses', root: 'b1' },
    { id: 'sacred', title: 'How did ordinary objects become sacred?', blurb: 'Status, ritual and history', root: 's1' },
    { id: 'collect', title: 'Why do humans collect things?', blurb: 'Cabinets, selves and sets', root: 'c1' }
  ];
  RH.levelNames = ['', 'Upper Gallery', 'Reading Floor', 'Lower Stacks', 'Lowest Floor'];
  RH.sources = {
    aser53: 'Aserinsky, E., & Kleitman, N. (1953). Regularly occurring periods of eye motility, and concomitant phenomena, during sleep. Science, 118(3062), 273–274.',
    dem57: 'Dement, W., & Kleitman, N. (1957). Cyclic variations in EEG during sleep and their relation to eye movements, body motility, and dreaming. Electroencephalography and Clinical Neurophysiology, 9(4), 673–690.',
    stick05: 'Stickgold, R. (2005). Sleep-dependent memory consolidation. Nature, 437, 1272–1278.',
    niel05: 'Nielsen, T. A., & Stenstrom, P. (2005). What are the memory sources of dreaming? Nature, 437, 1286–1289.',
    wams10: 'Wamsley, E. J., Tucker, M., Payne, J. D., Benavides, J. A., & Stickgold, R. (2010). Dreaming of a learning task is associated with enhanced sleep-dependent memory consolidation. Current Biology, 20(9), 850–855.',
    revo00: 'Revonsuo, A. (2000). The reinterpretation of dreams: An evolutionary hypothesis of the function of dreaming. Behavioral and Brain Sciences, 23(6), 877–901.',
    walk09: 'Walker, M. P., & van der Helm, E. (2009). Overnight therapy? The role of sleep in emotional brain processing. Psychological Bulletin, 135(5), 731–748.',
    hobs77: 'Hobson, J. A., & McCarley, R. W. (1977). The brain as a dream state generator: An activation-synthesis hypothesis of the dream process. American Journal of Psychiatry, 134(12), 1335–1348.',
    solms00: 'Solms, M. (2000). Dreaming and REM sleep are controlled by different brain mechanisms. Behavioral and Brain Sciences, 23(6), 843–850.',
    maqu96: 'Maquet, P., et al. (1996). Functional neuroanatomy of human rapid-eye-movement sleep and dreaming. Nature, 383, 163–166.',
    mah05: 'Mahowald, M. W., & Schenck, C. H. (2005). Insights from studying human sleep disorders. Nature, 437, 1279–1285.',
    sch86: 'Schenck, C. H., Bundlie, S. R., Ettinger, M. G., & Mahowald, M. W. (1986). Chronic behavioral disorders of human REM sleep: A new category of parasomnia. Sleep, 9(2), 293–308.',
    wils94: 'Wilson, M. A., & McNaughton, B. L. (1994). Reactivation of hippocampal ensemble memories during sleep. Science, 265(5172), 676–679.',
    labe81: 'LaBerge, S., Nagel, L., Dement, W., & Zarcone, V. (1981). Lucid dreaming verified by volitional communication during REM sleep. Perceptual and Motor Skills, 52, 727–732.',
    spoor06: 'Spoormaker, V. I., & van den Bout, J. (2006). Lucid dreaming treatment for nightmares: A pilot study. Psychotherapy and Psychosomatics, 75(6), 389–394.',
    freud00: 'Freud, S. (1900). Die Traumdeutung [The Interpretation of Dreams]. Leipzig and Vienna: Franz Deuticke.',
    dohrn96: 'Dohrn-van Rossum, G. (1996). History of the Hour: Clocks and Modern Temporal Orders. University of Chicago Press.',
    landes83: 'Landes, D. S. (1983). Revolution in Time: Clocks and the Making of the Modern World. Harvard University Press.',
    arist: 'Aristotle (attrib.). Athenaion Politeia [Constitution of the Athenians], ch. 67 (on the water clock in the law courts).',
    bened: 'The Rule of Saint Benedict (sixth century), chapters 8–19 (the Divine Office).',
    howse80: 'Howse, D. (1980). Greenwich Time and the Discovery of the Longitude. Oxford University Press.',
    bartky00: 'Bartky, I. R. (2000). Selling the True Time: Nineteenth-Century Timekeeping in America. Stanford University Press.',
    bipm: 'Bureau International des Poids et Mesures (BIPM). The International System of Units (SI Brochure): definition of the second.',
    cgpm22: 'General Conference on Weights and Measures (CGPM), 27th meeting (2022), Resolution 4: On the use and future development of UTC.',
    appl75: 'Appleton, J. (1975). The Experience of Landscape. London: Wiley.',
    kapl89: 'Kaplan, R., & Kaplan, S. (1989). The Experience of Nature: A Psychological Perspective. Cambridge University Press.',
    fern08: 'Fernandez, D., & Wilkins, A. J. (2008). Uncomfortable images in art and nature. Perception, 37(7), 1098–1113.',
    bene79: 'Benedikt, M. L. (1979). To take hold of space: Isovists and isovist fields. Environment and Planning B, 6(1), 47–65.',
    vart13: 'Vartanian, O., et al. (2013). Impact of contour on aesthetic judgments and approach-avoidance decisions in architecture. PNAS, 110(Suppl. 2), 10446–10453.',
    ulr84: 'Ulrich, R. S. (1984). View through a window may influence recovery from surgery. Science, 224(4647), 420–421.',
    ell15: 'Ellard, C. (2015). Places of the Heart: The Psychogeography of Everyday Life. Bellevue Literary Press.',
    eber09: 'Eberhard, J. P. (2009). Applying neuroscience to architecture. Neuron, 62(6), 753–756.',
    ulr91: 'Ulrich, R. S., et al. (1991). Stress recovery during exposure to natural and urban environments. Journal of Environmental Psychology, 11(3), 201–230.',
    tandy98: 'Tandy, V., & Lawrence, T. R. (1998). The ghost in the machine. Journal of the Society for Psychical Research, 62(851), 360–364.',
    durk12: 'Durkheim, É. (1912). Les formes élémentaires de la vie religieuse [The Elementary Forms of Religious Life].',
    brown81: 'Brown, P. (1981). The Cult of the Saints: Its Rise and Function in Latin Christianity. University of Chicago Press.',
    kopy86: 'Kopytoff, I. (1986). The cultural biography of things: Commoditization as process. In A. Appadurai (Ed.), The Social Life of Things (pp. 64–91). Cambridge University Press.',
    rozin86: 'Rozin, P., Millman, L., & Nemeroff, C. (1986). Operation of the laws of sympathetic magic in disgust and other domains. Journal of Personality and Social Psychology, 50(4), 703–712.',
    newm14: 'Newman, G. E., & Bloom, P. (2014). Physical contact influences how much people pay at celebrity auctions. PNAS, 111(10), 3705–3708.',
    ise: 'Jingu (Ise Grand Shrine) Shrine Office: information on Shikinen Sengu, the periodic rebuilding of the shrine; see also Coaldrake, W. H. (1996), Architecture and Authority in Japan, Routledge.',
    hes: 'Historic Environment Scotland: The Stone of Destiny (Stone of Scone), history and return to Scotland in 1996.',
    duch: 'Camfield, W. A. (1989). Marcel Duchamp: Fountain. Houston: Menil Foundation.',
    hood08: 'Hood, B. M., & Bloom, P. (2008). Children prefer certain individuals over perfect duplicates. Cognition, 106(1), 455–462.',
    mali22: 'Malinowski, B. (1922). Argonauts of the Western Pacific. London: Routledge.',
    unesco: 'UNESCO World Heritage Centre: Cultural Landscape and Archaeological Remains of the Bamiyan Valley (inscribed 2003).',
    pearce95: 'Pearce, S. M. (1995). On Collecting: An Investigation into Collecting in the European Tradition. London: Routledge.',
    belk95: 'Belk, R. W. (1995). Collecting in a Consumer Society. London: Routledge.',
    belk88: 'Belk, R. W. (1988). Possessions and the extended self. Journal of Consumer Research, 15(2), 139–168.',
    macg07: 'MacGregor, A. (2007). Curiosity and Enlightenment: Collectors and Collections from the Sixteenth to the Nineteenth Century. Yale University Press.',
    bm: 'The British Museum: history of the Museum and the Sloane bequest (British Museum Act, 1753).',
    benj31: 'Benjamin, W. (1931). Unpacking my library: A talk about book collecting. In Illuminations (1968), Harcourt, Brace & World.',
    dsm5: 'American Psychiatric Association (2013). Diagnostic and Statistical Manual of Mental Disorders (5th ed.): Hoarding Disorder.',
    borg85: 'Borgia, G. (1985). Bower quality, number of decorations and mating success of male satin bowerbirds. Animal Behaviour, 33(1), 266–271.',
    hicks20: 'Hicks, D. (2020). The Brutish Museums: The Benin Bronzes, Colonial Violence and Cultural Restitution. Pluto Press.',
    blphil: 'The British Library Philatelic Collections: history of the Penny Black (1840) and early stamp collecting.',
    kkt90: 'Kahneman, D., Knetsch, J. L., & Thaler, R. H. (1990). Experimental tests of the endowment effect and the Coase theorem. Journal of Political Economy, 98(6), 1325–1348.'
  };

  const nodes = (RH.nodes = {});
  function N(id, level, title, body, src, next) {
    nodes[id] = { id, q: { d: 'dream', t: 'time', b: 'build', s: 'sacred', c: 'collect' }[id[0]], level, title, body, src, next: next || [] };
  }
  const E = (to, label, why) => [to, label, why];

  /* ---------- DREAMS ---------- */
  N('d1', 1, 'Sleep has a dreaming phase',
    'Sleep is not one state. In 1953, Eugene Aserinsky and Nathaniel Kleitman reported periods of rapid eye movement during sleep, and volunteers woken from them often described vivid dreams. This REM phase recurs several times a night, roughly every ninety minutes. Dreaming also occurs outside REM, usually in plainer form. What dreaming is for remains unsettled: researchers hold several competing, partly overlapping accounts.',
    ['aser53', 'dem57'], [
      E('d2a', 'Is dreaming how the brain files memories?', 'The most studied proposal links dreaming to what sleep does for memory.'),
      E('d2b', 'Is it rehearsal for danger and feeling?', 'A second family of accounts treats dreams as practice for waking life.'),
      E('d2c', 'Why are dreams so strange?', 'Whatever dreams are for, their illogic needs explaining.')]);
  N('d2a', 2, 'Sleep as a filing room',
    'Experiments show that sleep after learning improves later recall and skill, which researchers call sleep-dependent memory consolidation. REM and deeper non-REM stages appear to contribute in different ways. Whether the dream itself does any of the work is a separate and harder question: the memory benefit may occur whether or not anything is dreamed.',
    ['stick05'], [
      E('d3a', 'Which memories turn up in dreams?', 'If dreams draw on memory, the timing of what they draw on is a clue.'),
      E('d3b', 'Does dreaming of a task help you learn it?', 'This asks whether dream content, and not only sleep, makes a difference.')]);
  N('d2b', 2, 'Rehearsal for danger and feeling',
    'Two proposals treat dreams as practice. Antti Revonsuo’s threat-simulation theory argues that dreaming evolved to rehearse responses to danger, and points to how often dream content is threatening. Matthew Walker and Els van der Helm propose that REM sleep reduces the emotional charge of memories while keeping their content. Both are hypotheses, and the evidence for each is mixed and contested.',
    ['revo00', 'walk09'], [
      E('d3b', 'Do dreams follow what concerns you?', 'Rehearsal accounts predict that dreams track waking concerns; one study tested a learned task.'),
      E('d3c', 'What is the sleeping brain’s emotional wiring?', 'Emotional processing implies some brain regions are busy while others are quiet.')]);
  N('d2c', 2, 'Why dreams break the rules',
    'Dreams combine impossible places, shifting identities and illogical events, yet feel real while they last. Hobson and McCarley’s activation-synthesis hypothesis (1977) proposed that the brain assembles a story from internally generated signals during REM. Later work, including Mark Solms’s, argued that dreaming and REM are controlled by different brain mechanisms, so REM alone cannot explain dreams.',
    ['hobs77', 'solms00'], [
      E('d3c', 'What do brain scans show?', 'Imaging gave the first direct look at which regions are active during REM.'),
      E('d3d', 'Why don’t we act out our dreams?', 'A story built from internal signals still has to be kept from the body.')]);
  N('d3a', 3, 'The dream-lag effect',
    'Tore Nielsen and Philippe Stenstrom reviewed studies in which people logged their days and their dreams. Dreams incorporate events from the previous day, and again events from about five to seven days earlier. Events from the days in between appear less often. The pattern suggests that memories are processed on more than one timescale, though the cause is still debated.',
    ['niel05'], [
      E('d4a', 'Do other animals replay their days?', 'Replay can be recorded directly in animals, which cannot report dreams.'),
      E('d4c', 'Did anyone notice this before the laboratory?', 'Freud named the previous-day material in dreams over a century earlier.')]);
  N('d3b', 3, 'Dreaming of a maze',
    'In a 2010 study led by Erin Wamsley, participants learned a virtual maze and then either napped or stayed awake. Among those who napped, a small group dreamed about the task, and they later improved markedly more than those who did not. The group was small, and the authors presented the result as an association, not proof that dreaming causes improvement.',
    ['wams10'], [
      E('d4a', 'Can replay be seen in a sleeping brain?', 'The sleeping brain’s replay of a maze has been recorded in rats.'),
      E('d4b', 'Can the dreamer steer the dream?', 'If learning shapes dream content, the next question is whether awareness can shape it back.')]);
  N('d3c', 3, 'An emotional brain with a quiet planner',
    'Imaging studies of REM sleep, including a 1996 PET study by Pierre Maquet and colleagues, found activity high in emotion-related regions such as the amygdala and low in parts of the prefrontal cortex tied to planning and self-monitoring. This pairing is often used to explain why dream events feel intense and why their illogic goes unquestioned. It remains an interpretation of correlations.',
    ['maqu96'], [
      E('d4c', 'What did earlier thinkers make of dream feeling?', 'Emotion in dreams was central to the first systematic theories.'),
      E('d4b', 'Can dreaming be made less frightening?', 'If emotion runs high and self-monitoring is low, restoring awareness might help.')]);
  N('d3d', 3, 'The body’s brake',
    'During REM, brainstem circuits ordinarily keep most muscles still. In REM sleep behaviour disorder, described by Carlos Schenck and colleagues in 1986, this paralysis fails and people physically act out their dreams. Related experiments in animals helped identify the mechanism. The disorder shows that the dreaming mind and the moving body are separable systems.',
    ['mah05', 'sch86'], [
      E('d4b', 'What does the spared eye movement allow?', 'The eyes are exempt from REM paralysis, which became a communication channel.'),
      E('d4a', 'What does animal sleep reveal?', 'Brainstem sleep circuits and brain replay have both been studied in animals.')]);
  N('d4a', 4, 'Do animals dream?',
    'Animals cannot report dreams, but their sleeping brains can be recorded. In 1994, Matthew Wilson and Bruce McNaughton found that hippocampal cells in rats that fired in sequence during a maze run fired in similar patterns during later sleep. This replay does not show that rats experience dreams. It shows that sleep reactivates recent experience, the strongest physical link yet recorded between memory and sleep.',
    ['wils94']);
  N('d4b', 4, 'Lucid dreaming',
    'In 1981 Stephen LaBerge and colleagues reported that practised lucid dreamers, aware they were dreaming, could signal with pre-arranged eye movements, which are spared during REM paralysis. It gave researchers an objective record from inside a dream. Lucid dreaming has since been studied as a possible treatment for recurring nightmares, with preliminary results.',
    ['labe81', 'spoor06']);
  N('d4c', 4, 'Reading dreams as messages',
    'Before laboratories, dreams were read for meaning. Sigmund Freud’s The Interpretation of Dreams (1900) treated them as disguised wishes and introduced the idea of “day residue”, the waking material dreams borrow. Few modern researchers accept the wish-fulfilment theory, but the claim that dreams connect to waking life still shapes the field.',
    ['freud00']);

  /* ---------- TIME ---------- */
  N('t1', 1, 'Sunlight, shadow and water',
    'For most of history the time of day was read from the sun: a shadow, a sundial, a glance upward. Where days were divided into hours, as in ancient Egypt, Greece and Rome, the span from sunrise to sunset was split into twelve parts, so an hour was longer in summer than in winter. Time was local, seasonal and visible.',
    ['dohrn96'], [
      E('t2a', 'Hours that stretched and shrank', 'If an hour changes length, someone had to build instruments to cope.'),
      E('t2b', 'Bells before dials', 'Equal hours arrived with the mechanical clock.'),
      E('t2c', 'The railway problem', 'Local time worked until people started travelling fast.')]);
  N('t2a', 2, 'Hours that changed length',
    'With daylight divided into twelve hours, a summer hour was noticeably longer than a winter one. Water clocks, which measure time by the flow of water, were adapted to this, and some ancient designs adjusted for the season. Equal hours of fixed length were used by astronomers long before everyday life adopted them.',
    ['dohrn96'], [
      E('t3a', 'Timing speeches with water', 'Water clocks served civic as well as astronomical purposes.'),
      E('t3b', 'Hours of prayer', 'Seasonal hours shaped one of the most disciplined daily schedules in history.')]);
  N('t2b', 2, 'Bells before dials',
    'The earliest mechanical clocks of the late thirteenth and fourteenth centuries in Europe often had no face. They struck a bell to mark the hours, which suited towns and religious houses. By the fourteenth century public clocks in town squares were announcing equal hours, which gradually replaced seasonal hours in civic life.',
    ['dohrn96', 'landes83'], [
      E('t3b', 'Who needed a clock first?', 'Religious communities had a scheduling reason to want striking clocks.'),
      E('t3c', 'How were clocks kept right?', 'A clock drifts, so it needs something to be set against.')]);
  N('t2c', 2, 'The railway problem',
    'Towns once kept their own local time, so noon in Bristol came minutes after noon in London. Railway timetables made the differences matter. Britain’s Great Western Railway adopted London time in 1840, and Greenwich Mean Time became legal time across Great Britain in 1880. In North America, railways introduced standard time zones on 18 November 1883.',
    ['bartky00', 'howse80'], [
      E('t3c', 'How did a single time reach every station?', 'A common time needed a common source and a way to send it.'),
      E('t3d', 'Who chose the world’s zero line?', 'Railway standard time soon led to talks on a worldwide reference.')]);
  N('t3a', 3, 'The courtroom water clock',
    'According to the Constitution of Athens attributed to Aristotle, Athenian law courts used a water clock to measure the time allotted to each speaker, and the flow could be stopped while documents were read. It is an early case of time as a fairness tool, with an equal amount for each side, rather than a way of knowing the hour.',
    ['arist'], [
      E('t4c', 'What made clocks steadier?', 'Fairness by the clock needs identical intervals, which rewards steadier devices.'),
      E('t4a', 'How is a second defined now?', 'Equal intervals are exactly what the modern second is defined to supply.')]);
  N('t3b', 3, 'Prayer sets the hours',
    'The Rule of Saint Benedict, written in the sixth century, set times for communal prayer through day and night. Because daylight changes with the seasons, the schedule had to be adjusted, and a community needed a reliable way to wake and gather. David Landes and others connect this demand for a timed routine to the rise of striking clocks, though the origin of the mechanical clock is not documented in detail.',
    ['bened', 'landes83'], [
      E('t4b', 'Is the sun’s day constant?', 'Prayer hours follow the sun, and the sun’s day is not perfectly regular.'),
      E('t4c', 'How accurate did clocks need to be?', 'Routines run by bells created demand for better clocks.')]);
  N('t3c', 3, 'Time sent from a centre',
    'A mechanical clock drifts, so it must be checked against something. Observatories set time by watching stars cross the meridian. In 1833 the Royal Observatory at Greenwich installed a time ball that dropped at 1 pm for ships on the Thames, and from the 1850s Greenwich time was distributed by telegraph wire. Accurate time became a service sent from a central source.',
    ['howse80', 'bartky00'], [
      E('t4c', 'What were the clocks being checked?', 'The best clocks of the period were pendulum clocks.'),
      E('t4a', 'What replaced the stars as the reference?', 'The reference later moved from astronomy to atoms.')]);
  N('t3d', 3, 'Choosing a prime meridian',
    'In October 1884, delegates from 25 nations met in Washington, DC for the International Meridian Conference. They voted to adopt the meridian through Greenwich as the world’s zero for longitude and as the basis for a universal day, by 22 votes in favour, one against and two abstentions. The resolutions were recommendations, and countries adopted standard time on their own schedules.',
    ['howse80'], [
      E('t4a', 'Who defines the second itself?', 'Defining the world’s time also needs a definition of the second.'),
      E('t4b', 'Why does the day not stay fixed?', 'A universal day depends on Earth’s rotation, which varies.')]);
  N('t4a', 4, 'Defining the second',
    'The second was long defined as a fraction of the day, then briefly of a particular year, and astronomers found both vary. After caesium atomic clocks were built in the 1950s, including Louis Essen and Jack Parry’s at the National Physical Laboratory in 1955, the second was redefined in 1967 as 9,192,631,770 periods of the radiation of the caesium-133 atom. Time stopped being read from the sky.',
    ['bipm']);
  N('t4b', 4, 'Leap seconds',
    'Earth’s rotation is slightly irregular and slows over long spans, so atomic time and astronomical time drift apart. Since 1972, Coordinated Universal Time has been kept close to Earth’s rotation by inserting leap seconds; 27 have been added, the last at the end of 2016. In 2022 the General Conference on Weights and Measures resolved to stop using them by or before 2035.',
    ['bipm', 'cgpm22']);
  N('t4c', 4, 'The pendulum',
    'Christiaan Huygens built the first pendulum clock in 1656 and patented it the next year. Because a pendulum swings at a steady rate, it cut typical clock error from minutes a day to seconds a day. More accurate clocks made small intervals measurable in experiment and astronomy, and made household time more reliable.',
    ['landes83', 'dohrn96']);

  /* ---------- BUILDINGS ---------- */
  N('b1', 1, 'Rooms are read before they are understood',
    'People judge a space within moments, using cues such as enclosure, light, proportion, pattern and whether an exit is visible. Environmental psychologists study these judgments, and discomfort is often traced less to ugliness than to a space that is hard to read, exposes the visitor, or hides what lies around a corner.',
    ['appl75', 'kapl89'], [
      E('b2a', 'Seeing without being seen', 'One long-standing idea concerns what a place lets you see and what it lets you hide from.'),
      E('b2b', 'Patterns that strain the eyes', 'Some discomfort starts in the visual system, not in meaning.'),
      E('b2c', 'Too little to read', 'A third view says unease comes from places that offer nothing to make sense of.')]);
  N('b2a', 2, 'Seeing without being seen',
    'Geographer Jay Appleton proposed in 1975 that people favour places offering prospect, a clear view, and refuge, a place to be unobserved. Spaces that offer exposure without cover, or enclosure with no view out, can feel uneasy. The theory comes from landscape, and its application to architecture is plausible but has been tested unevenly.',
    ['appl75'], [
      E('b3a', 'Measuring what you can see from a point', 'Prospect can be measured as geometry.'),
      E('b3b', 'Curves versus corners', 'Refuge and exposure may also depend on the shape of the surroundings.')]);
  N('b2b', 2, 'Patterns that strain the eyes',
    'Arnold Wilkins and colleagues have shown that high-contrast repeating stripes at spatial frequencies near three cycles per degree are uncomfortable to look at, and can provoke headaches and, in susceptible people, seizures. Fernandez and Wilkins (2008) found related image statistics in artworks and photographs rated as uncomfortable. A rhythmic facade of identical windows can approximate such stripes.',
    ['fern08'], [
      E('b3b', 'Does shape alone change preference?', 'Repetitive rectilinear geometry raises the question of whether shape affects preference by itself.'),
      E('b3c', 'What does a window give back?', 'A window can offset a harsh pattern with a view.')]);
  N('b2c', 2, 'Too little to read',
    'Rachel and Stephen Kaplan’s preference framework describes liked environments as coherent and legible, with enough complexity and a hint of mystery, the promise of more to see. Spaces that fail those tests, by being featureless, confusing or chaotic, tend to be rated lower. Discomfort, on this view, signals an environment that offers little to understand.',
    ['kapl89'], [
      E('b3c', 'How much do views out matter?', 'Legibility partly depends on orientation and a view outward.'),
      E('b3d', 'What about blank walls?', 'A featureless frontage is the street-level version of too little to read.')]);
  N('b3a', 3, 'The shape of what you can see',
    'Michael Benedikt’s 1979 “isovist” is the shape of everything visible from a single point. Plotting isovists across a plan shows where a viewer sees far, where views are cut, and where a view changes abruptly at a turning. Spatial analysts use these measures to model how exposed or enclosed a place feels; reported links to preference vary in strength.',
    ['bene79'], [
      E('b4a', 'What does brain imaging add?', 'Isovists describe geometry; neuroscience asks what viewers’ brains do with it.'),
      E('b4c', 'Is all unease visual?', 'Some rooms feel wrong for reasons that geometry does not explain.')]);
  N('b3b', 3, 'Curves versus corners',
    'In a 2013 study led by Oshin Vartanian, participants rated images of rooms, and rooms with curved contours were judged more beautiful than rectilinear ones. Brain imaging linked this to activity in the anterior cingulate cortex. The result concerns preference for images, not comfort in real buildings, and individual differences were large.',
    ['vart13'], [
      E('b4a', 'How do researchers test design with the brain?', 'This study is an example of a wider attempt to measure responses to architecture.'),
      E('b4b', 'Do natural forms calm us?', 'Curved, organic forms are often compared with natural settings, which have their own stress research.')]);
  N('b3c', 3, 'Windows and views',
    'Roger Ulrich’s 1984 study of patients recovering from gallbladder surgery found that those in rooms with a view of trees had shorter hospital stays and used fewer strong painkillers than matched patients facing a brick wall. It was a small study in one hospital, but it opened a line of research on views, daylight and recovery.',
    ['ulr84'], [
      E('b4b', 'Is nature restorative more broadly?', 'Later laboratory work tested whether nature scenes aid recovery from stress.'),
      E('b4a', 'How is this studied now?', 'The same question is asked with measurement of brain and body.')]);
  N('b3d', 3, 'Blank walls on the street',
    'Colin Ellard has measured pedestrians’ skin conductance and self-reported feelings along urban streets. In results he describes in Places of the Heart (2015), blocks with long blank frontages produced lower arousal and reported pleasure than blocks with varied, active frontages. Such field studies use small samples and show association with the environment, not a universal rule.',
    ['ell15'], [
      E('b4a', 'How do field studies fit the science?', 'Walking studies belong to a growing, still young, research area.'),
      E('b4b', 'What do restorative scenes look like?', 'The contrast with blank frontages is the restorative environment.')]);
  N('b4a', 4, 'Neuroarchitecture',
    'The Academy of Neuroscience for Architecture, founded in 2003 in San Diego, brought neuroscientists and architects together to test design assumptions with measurements of brain and body. John Eberhard (2009) argued the aim is not to dictate design but to ground it in how people respond. The field is young, and many findings come from small laboratory studies of images.',
    ['eber09']);
  N('b4b', 4, 'Restoration through nature',
    'Roger Ulrich and colleagues (1991) showed volunteers a stressful film, then videos of natural or urban scenes. Recovery on physiological measures and self-reported mood was faster and more complete after nature scenes. These results underpin efforts to bring plants, daylight and green views into buildings, though the size of the effect in real buildings is debated.',
    ['ulr91']);
  N('b4c', 4, 'A room that felt haunted',
    'In 1998 engineer Vic Tandy and Tony Lawrence reported that a Coventry laboratory where staff felt uneasy contained a standing wave of about 19 hertz, near the low end of infrasound, produced by a fan; removing the source ended the effect. The report is suggestive, and later experiments on infrasound and mood have been mixed.',
    ['tandy98']);

  /* ---------- SACRED OBJECTS ---------- */
  N('s1', 1, 'Sacred is a status, not a substance',
    'Émile Durkheim argued in 1912 that sacred things are not holy by nature. A community sets them apart and surrounds them with prohibitions, and what distinguishes them is how people behave toward them. On this view an ordinary object can become sacred without changing at all. Anthropologists have debated Durkheim’s broader claims but kept the idea of status conferred by social action.',
    ['durk12'], [
      E('s2a', 'Marked off and protected', 'If status is conferred, the marking itself becomes the thing to study.'),
      E('s2b', 'Relics', 'Christian relics are among the best-documented examples of conferred status.'),
      E('s2c', 'The life story of a thing', 'Status can change over time, so objects can be studied like lives.')]);
  N('s2a', 2, 'Marked off and protected',
    'Sacred objects are typically handled differently: wrapped, stored, kept at a distance, touched by few. Those habits create the distinction they appear to express. Many traditions mark such things with boundaries, special containers or restricted access, and the restriction teaches observers that the object matters.',
    ['durk12'], [
      E('s3a', 'Rebuilt to remain the same', 'One shrine renews its buildings on a fixed schedule.'),
      E('s3b', 'A stone that crowned kings', 'Ceremonial use can mark an object as strongly as fences do.')]);
  N('s2b', 2, 'Relics',
    'In medieval Christianity the bodies and belongings of saints were treated as channels of holy presence. Relics were kept in decorated containers, carried in processions and visited by pilgrims. Peter Brown’s The Cult of the Saints (1981) shows how the cult linked distant communities to specific people. Even a scrap of cloth could become precious once it was authenticated by its association.',
    ['brown81'], [
      E('s3b', 'Do objects gain status from ceremony?', 'Relics gain status through a person; other objects gain it through use in ritual.'),
      E('s3c', 'Does touch transfer something?', 'The logic of relics, that contact carries something over, is still found today.')]);
  N('s2c', 2, 'The life story of a thing',
    'Anthropologist Igor Kopytoff proposed in 1986 that objects, like people, have biographies: they are made, exchanged, used and reclassified, and in each phase may be ordinary or special. A thing may start as a commodity and end as a treasure, or the reverse. Asking what has happened to an object, rather than what it is, explains how its status changes.',
    ['kopy86'], [
      E('s3c', 'What does contact do to value?', 'A life story includes who has touched an object.'),
      E('s3d', 'Can a gallery change an object’s status?', 'Reclassification is easiest to see when an everyday object enters a museum.')]);
  N('s3a', 3, 'Rebuilt to remain the same',
    'At Ise Jingu in Japan the main shrine buildings are rebuilt on adjacent sites every twenty years in a ritual called Shikinen Sengu, traditionally dated to the seventh century. The sixty-second rebuilding was completed in 2013. The materials are replaced, yet the shrine is held to be the same. What is sacred is the continuity of the practice, not the original timber.',
    ['ise'], [
      E('s4a', 'Why does a perfect replica not count?', 'Ise treats a renewed building as the same one; elsewhere copies are rejected.'),
      E('s4c', 'What happens when sacred things are destroyed?', 'Renewal is the planned counterpart of destruction.')]);
  N('s3b', 3, 'A stone that crowned kings',
    'The Stone of Scone, a block of sandstone, was used in the inauguration of Scottish kings and was taken by Edward I to Westminster Abbey in 1296, where it was fitted into a coronation chair. It was returned to Scotland in 1996 and brought to London for the 2023 coronation. Its status rests on repeated use in ceremony and the stories attached to it, not on its appearance.',
    ['hes'], [
      E('s4b', 'Can value come from a chain of owners?', 'The stone’s worth lies in who has used and owned it, a principle that anthropologists documented in another exchange system.'),
      E('s4c', 'What happens when such objects are targeted?', 'Objects with public meaning can also become targets.')]);
  N('s3c', 3, 'Does touch transfer something?',
    'James Frazer called the belief that things once in contact stay connected “contagious magic”. Rozin, Millman and Nemeroff (1986) found the intuition persists in modern adults. Newman and Bloom (2014) showed it also affects value: people paid more for items they believed celebrities had owned, and less when the item was said to have been sterilised, suggesting people imagine an “essence” passing through contact.',
    ['rozin86', 'newm14'], [
      E('s4a', 'Why is the original preferred to a copy?', 'If essence passes through contact, a copy lacks it.'),
      E('s4b', 'Where do histories of owners matter most?', 'Some exchange systems are built on exactly this effect.')]);
  N('s3d', 3, 'Fountain, 1917',
    'In 1917 Marcel Duchamp submitted a factory-made urinal, signed “R. Mutt” and titled Fountain, to an exhibition in New York; it was rejected, and the original was lost. Replicas were made later and are now shown in major museums. Display in a gallery changed how audiences treated an unaltered object, an example of status moving by designation alone.',
    ['duch'], [
      E('s4a', 'Original or replica?', 'Fountain’s replicas raise the question of what the original had.'),
      E('s4b', 'Can histories alone make things valuable?', 'In Fountain the history of display, not the material, carries the value.')]);
  N('s4a', 4, 'Why we prefer the original',
    'In experiments by Bruce Hood and Paul Bloom (2008), young children preferred a particular item over an identical duplicate and rejected the copy. Bloom argues that people treat objects as having an invisible essence tied to their history. The same intuition appears in adult attitudes to heirlooms, relics and authentic artefacts.',
    ['hood08']);
  N('s4b', 4, 'The Kula ring',
    'In the Trobriand Islands region of Papua New Guinea, Bronisław Malinowski described in 1922 the Kula ring, in which shell armbands and necklaces circulate between islands in opposite directions. The valuables are not kept for long; their worth rises with the names, histories and prominent owners attached to them. The shell is ordinary. The chain of people makes it valuable.',
    ['mali22']);
  N('s4c', 4, 'When sacred things are destroyed',
    'In March 2001 the Taliban government of Afghanistan destroyed the two monumental Buddha statues carved into the cliffs at Bamiyan. The international response showed that such objects matter well beyond their believers. UNESCO inscribed the Bamiyan Valley on the World Heritage List in 2003. Attacks like this target an object’s meaning, which is why they draw such strong reactions.',
    ['unesco']);

  /* ---------- COLLECTING ---------- */
  N('c1', 1, 'An old and widespread habit',
    'People have gathered and kept objects for thousands of years; archaeologists have found shell beads tens of thousands of years old, and the Renaissance produced private museums. Scholars of collecting such as Susan Pearce and Russell Belk argue that it is not one motive but several: wanting knowledge, belonging, identity and the pleasure of completing and ordering. Researchers disagree on whether any single cause explains it.',
    ['pearce95', 'belk95'], [
      E('c2a', 'Cabinets of curiosities', 'The first organised European collections are a good place to see what collectors wanted.'),
      E('c2b', 'Collections as self', 'Another answer looks at what collections do for their owners.'),
      E('c2c', 'Collectors that aren’t human', 'Other species also gather and store things.')]);
  N('c2a', 2, 'Cabinets of curiosities',
    'In sixteenth- and seventeenth-century Europe, merchants, physicians and nobles kept rooms of natural specimens, artefacts and marvels, called cabinets of curiosities or Wunderkammern. They were also tools of study: owners compared specimens and published catalogues, such as Ole Worm’s Museum Wormianum (1655). Having a collection signalled education and access to the wider world.',
    ['macg07'], [
      E('c3a', 'How did private rooms become museums?', 'Several famous cabinets became public institutions.'),
      E('c3b', 'What did a collector feel?', 'The cabinet owners left catalogues; a later critic left an account of the feeling.')]);
  N('c2b', 2, 'Collections as self',
    'Russell Belk (1988) argued that possessions form part of the “extended self”: people use objects to remember who they were and to express who they are. A collection concentrates that, because it is chosen, arranged and curated. The view draws on interviews and surveys across many kinds of collector.',
    ['belk88'], [
      E('c3b', 'How does a collector describe it?', 'Walter Benjamin gave a well-known account from the inside.'),
      E('c3c', 'When does keeping become a burden?', 'If possessions extend the self, difficulty discarding them has a clinical form.')]);
  N('c2c', 2, 'Collectors that aren’t human',
    'Many animals hoard. Squirrels and jays cache food for later, and satin bowerbirds build and decorate display structures called bowers, often with blue objects. Gerald Borgia (1985) found that males with more decorations tended to mate more. These behaviours have functions of food storage or mate attraction, so they illuminate only some human motives, and no direct evolutionary link to human collecting is established.',
    ['borg85'], [
      E('c3c', 'What happens when saving exceeds need?', 'Storing resources for later is a biological behaviour; in people it can exceed need. This is a contrast, not a demonstrated link.'),
      E('c3d', 'What is a bower for?', 'Bower decorations are arranged for an audience.')]);
  N('c3a', 3, 'From private rooms to public museums',
    'The Tradescant family’s cabinet in London passed to Elias Ashmole, who gave it to the University of Oxford; the Ashmolean Museum opened in 1683. In 1753 Parliament founded the British Museum to house the collection of the physician Sir Hans Sloane, who had bequeathed it to the nation. Both show private enthusiasm becoming public holdings.',
    ['macg07', 'bm'], [
      E('c4a', 'How were the objects acquired?', 'Public collections carry the histories of how their contents were obtained.'),
      E('c4b', 'Is there collecting that stays orderly?', 'Systematic collecting also grew outside museums, in the form of organised sets.')]);
  N('c3b', 3, 'The collector’s own account',
    'In “Unpacking My Library” (1931), the critic Walter Benjamin describes the collector’s relationship with objects as one of memory and renewal: each book recalls where and when it was found. He treats collecting as giving things new life by removing them from their ordinary use. The essay is reflective, not empirical, and is best read as one collector’s account.',
    ['benj31'], [
      E('c4b', 'Collecting as completing a set', 'Benjamin’s collector prizes order and completeness.'),
      E('c4c', 'What does ownership do to value?', 'The attachment he describes has been studied in experiments.')]);
  N('c3c', 3, 'When keeping becomes a burden',
    'Hoarding disorder was recognised as a distinct diagnosis in the DSM-5 (2013), defined by persistent difficulty discarding possessions because of a perceived need to save them and distress at discarding them, resulting in cluttered living spaces. Clinicians distinguish it from collecting: collections are usually organised, selective and displayed, while hoarded items accumulate without those limits.',
    ['dsm5'], [
      E('c4c', 'Why is it hard to give things up?', 'Valuation after ownership is one measured factor in attachment.'),
      E('c4b', 'What do organised collections look like?', 'The contrast case is a collection with edges, catalogues and exchange.')]);
  N('c3d', 3, 'Arranged for an audience',
    'A satin bowerbird’s bower is a cleared court with a stick avenue, decorated with chosen objects. Females inspect bowers and choose among males, and Borgia’s observations linked decoration number to mating success. Collecting among humans, too, often involves display to others, although a bower’s function is mating, not museum-building, so the comparison is an analogy.',
    ['borg85'], [
      E('c4a', 'Display in human collections', 'Human collections are also arranged for viewers; here the analogy is only an analogy.'),
      E('c4b', 'Exhibition and competition among collectors', 'Collectors also compare and exhibit sets.')]);
  N('c4a', 4, 'Whose collection?',
    'In 1897 a British military expedition took thousands of works from the royal court of Benin, in present-day Nigeria, and many entered museum collections in Europe and North America. Museums and governments have since negotiated returns; in 2022 Germany began transferring ownership of its Benin Bronzes to Nigeria. The case shows that collections carry histories of how their objects were acquired.',
    ['hicks20']);
  N('c4b', 4, 'The numbered set',
    'The Penny Black, issued in Britain in May 1840, was the first adhesive postage stamp, and people began collecting stamps within a few years. A stamp series has a definite edge, a catalogue and a market for swaps, which gives the collector a visible goal of completion. Philately shows how organisation and rules turn gathering into a pursuit.',
    ['blphil']);
  N('c4c', 4, 'What ownership does to value',
    'In experiments by Daniel Kahneman, Jack Knetsch and Richard Thaler (1990), people given a coffee mug demanded substantially more to sell it than others were willing to pay for the same mug. This “endowment effect” suggests that possessing something raises its value to the owner. It is one tested mechanism behind attachment to what we keep, though not proof of a motive for collecting.',
    ['kkt90']);

  /* Provider interface. A future live-model provider can implement the same two methods,
     receiving the trail as context, without changes to the interface code. */
  RH.provider = {
    kind: 'static-curated',
    getRoot(qid) { return nodes[RH.questions.find((q) => q.id === qid).root]; },
    getNode(id /*, trail */) { return nodes[id]; }
  };

  /* Integrity check: every edge resolves, every non-terminal node has 2-3 edges, levels increase by one. */
  RH.validate = function () {
    const errs = []; const reach = new Set();
    RH.questions.forEach((q) => {
      const walk = (id) => { if (reach.has(id)) return; reach.add(id); (nodes[id].next || []).forEach((e) => walk(e[0])); };
      walk(q.root);
    });
    Object.values(nodes).forEach((n) => {
      if (!reach.has(n.id)) errs.push('unreachable ' + n.id);
      if (n.level < 4 && (n.next.length < 2 || n.next.length > 3)) errs.push('edge count ' + n.id);
      if (n.level === 4 && n.next.length) errs.push('L4 has edges ' + n.id);
      n.next.forEach((e) => { const t = nodes[e[0]]; if (!t) errs.push('broken ' + n.id + '→' + e[0]); else if (t.level !== n.level + 1 || t.q !== n.q) errs.push('level/question ' + n.id + '→' + e[0]); });
      n.src.forEach((s) => { if (!RH.sources[s]) errs.push('source ' + s); });
    });
    return { nodes: Object.keys(nodes).length, reachable: reach.size, errors: errs };
  };
})();
