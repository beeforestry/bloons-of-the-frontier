Balloons of the Frontier — Next Layer Design Proposal

Document: "docs/DESIGN_next_layer.md"
Status: Phase 1 implemented on main (Threat Brief + one-wave contracts, Overload Routing, Isla de Cabras waves 16–21 smoothing). Features B/D and the new towers/enemies are not built.
Review date: November 23, 2026
Maps: El Morro and Isla de Cabras

0. Evidence, assumptions, and design goal

Access limitation. I inspected the repository's "main" branch, its source, README, recent "PROGRESS_*.md" notes, and archived balance and browser-test reports. I attempted to open the published GitHub Pages build but could not obtain an interactive browser session. Consequently, the following are ranked source-backed playtest findings, not claims of personally playing the live build.

The next layer should introduce decisions with costs and counterplay, not just another universal damage multiplier.

Design principles:

1. Reveal threats before demanding a specialized counter.
2. Introduce reversible strategic decisions while preserving permanent tower branches and fusion choices.
3. Preserve El Morro and Isla de Cabras without changing their geography.
4. Avoid mandatory micromanagement on mobile.
5. Give 2D and first-person players equally viable ways to counter threats.
6. Make new features optional rather than required to complete existing difficulties.

1. Five ranked weak spots

Rank| Frustration| Evidence| Design response
1| Isla de Cabras' wave-16–21 difficulty cliff| Recorded Medium runs lose around waves 16–21, while El Morro regularly clears wave 60. The t103 notes identify the wave-19 Sky Colossus cluster. Hard Cabras bots lose around wave 18.| Telegraph threats and test a Cabras-specific spawn adjustment.
2| Wave previews may understate actual enemy counts| The HUD displays authored group counts, but WaveManager applies additional scaling. Wave 19 authors three Sky Colossi, which currently scale to five total spawns.| Preview post-scaling counts, threat classes, and lane distribution.
3| Late-game HP growth makes power progression harder to understand| Compounding HP ramps produce approximately ×11.50 authored HP on Hard at wave 60 and ×23.81 at wave 80, including map ease. Hard El Morro bots commonly fail around waves 67–79.| Show effective enemy strength and add tactical specialization.
4| Too many mechanics compete for attention| Six targeting modes, specialization, fusion, element combos, proximity, Rage, Overload, salvage, farms, and squads require coordinating multiple UI panels.| Introduce one concise tactical brief and clear explanations of tradeoffs.
5| Mobile and first-person strategy handoff needs greater clarity| Possess has separate controls and resets game speed to 1×. A synthetic heavy-load performance test measured 25.9 FPS on a touch-sized viewport using headless software GL—not a real device.| Preserve strategic context between views and prioritize readable combat.

Sources: "t103 balance" (https://github.com/beeforestry/bloons-of-the-frontier/blob/main/balance/t103_elements.md), "t105 balance" (https://github.com/beeforestry/bloons-of-the-frontier/blob/main/balance/t105_specs.md), "t106 balance" (https://github.com/beeforestry/bloons-of-the-frontier/blob/main/balance/t106_capa4.md), "WaveManager" (https://github.com/beeforestry/bloons-of-the-frontier/blob/main/src/systems/WaveManager.ts), "HUD" (https://github.com/beeforestry/bloons-of-the-frontier/blob/main/src/ui/Hud.ts), "t107 performance" (https://github.com/beeforestry/bloons-of-the-frontier/blob/main/PROGRESS_t107.md).

2. Proposed next layer — four features

The following are unshipped design specifications. Numbers are initial balance targets requiring testing.

Feature A — Threat Brief + One-Wave Contracts

Size: M

Player pitch: “Know what's coming. Commit to a counter, accept its weakness, or defend normally.”

Rules:

Beginning at wave 11, show the next two waves using the actual post-scaling enemy quantities. Display the three most dangerous enemy groups with their counts, effective HP, armor/shield traits, air/ground classification, and lane distribution.

Beginning at wave 21, allow players to select one voluntary contract per wave:

Contract| Advantage| Tradeoff
Sky Watch| ×1.25 tower damage to flying/air enemies| ×0.90 against ground enemies
Plate Watch| ×1.20 tower damage to armored, shielded, and boss enemies| ×0.90 against other enemies
Supply Run| +20% wave-clear bonus and +15% farm income during the wave| ×0.88 tower damage
Neutral| No modifier| No modifier

Contracts last for one wave, cannot stack, and close for selection when the wave begins. There is no credit price and no carryover.

In co-op, the host confirms one team-wide choice. Neutral is selected automatically if nobody makes a choice.

Integration: Uses the existing deterministic wave generator, WaveManager scaling, faction-neutral tower damage, farms, and HUD preview. Does not change tower tiers, recipes, or maps.

Counters: Sky Watch is vulnerable to ground swarms; Plate Watch struggles against fast unarmored enemies; Supply Run sacrifices immediate survival for later credits.

Risks: Information overload, co-op indecision, and misleading arrival-time estimates. Use compact previews, optional expansion, and no forced waiting period.

Feature B — Command Sectors

Size: L

Player pitch: “Your fort has two fronts. Tell a group of guns how to fight this particular wave.”

Rules:

Unlock one command sector at wave 25 and a second at wave 45.

Each sector has a 170px radius and affects at most six nearest allied combat towers within its circle. Fused and recipe towers count as one.

Players select one stance per sector:

Stance| Benefits| Costs
Interception| ×1.15 effective attack range| ×0.88 fire rate
Containment| ×1.20 existing element duration and +1 projectile pierce| ×0.88 direct-hit damage
Last Wall| ×1.25 damage when enemies enter the final 30% of their route| ×0.85 damage outside that zone; ×0.90 range

Repositioning or changing stances is free between waves. Once per wave, a mid-wave change costs ¢250, has a 20-second cooldown, and activates after one second.

Overlapping sectors never stack. Towers use whichever sector center is closer.

Sectors cannot grant anti-air capabilities, new elements, or line-of-sight exemptions.

Integration: Existing targeting modes determine individual targets; sectors modify how a group of towers fights. Existing Rage, Overload, cover, proximity effects, and fusion remain functional.

Counters: Interception struggles against rushes, Containment sacrifices boss damage, and Last Wall loses efficiency when enemies remain near entrances.

Risks: UI density, accidental sector overlap, multiplayer ownership conflicts, and excessive buff stacking. Only display outlines when managing sectors, and provide a clear Disable Sector control.

Feature C — Overload Routing

Size: M

Player pitch: “Overload isn't just more power: decide where that power goes before the next fight.”

Unlock at wave 31 with Overload Core level 4 or higher.

The default Balanced mode preserves the current +5% damage per Overload level.

In Routed mode, the first "min(Overload level, 6)" levels provide:

- +9% damage per routed level against the selected target class.
- +1% damage per routed level against all other classes.
- Remaining nonrouted levels retain +5% globally.

At Overload level 8:

Setting| Selected class bonus| Other class bonus
Balanced| +40%| +40%
Routed| +64%| +16%

Available target classes are mutually exclusive:

1. Sky: Flying or aircraft enemies, including flying bosses.
2. Plated: Nonflying heavy, armored, shielded, or boss enemies.
3. Rush: Every other enemy.

Routing can be changed free between waves, but never during an active wave.

Integration: Extends existing Overload investment, shared co-op state, saving, and global damage calculations. No additional currency.

Counters: Routing away from a class creates a significant weakness. Bosses and mixed waves punish incorrect preparation.

Risks: Combining routing with crits, Rage, Shatter, and fusion could create burst-damage spikes. Compare all configurations using identical waves and builds before release.

Feature D — Salvage Dispatches

Size: M

Player pitch: “Spend valuable scrap on emergency equipment now—or save it for permanent upgrades.”

Available from wave 26. Players can purchase at most one dispatch every three waves, between waves only.

Dispatch| Cost| Effect
Repair Crew| 35 scrap| Restore 20% maximum HP to the five closest owned towers within 180px; reduce remaining offline duration by 4 seconds
Harbor Net| 40 scrap| Place a marker on an existing lane; the first 12 flying enemies crossing a 120px segment receive 25 energy damage and 20% slow for 2 seconds
Plate Purge| 45 scrap| First 12 nonboss heavy/armored/shielded enemies crossing a marked lane segment lose 80 shield HP and 0.15 armor fraction for 6 seconds

Additional limitations:

- Repair Crew cannot revive towers or repair the HQ.
- Harbor Net deals at most 10 damage and slows for 0.5 seconds against bosses.
- Plate Purge has one-third effectiveness against bosses and cannot erase phase armor outright.
- Each dispatch expires after its assigned wave.
- All markers are visible on the tactical map and first-person minimap.

Integration: Scrap already buys permanent Salvage Armory upgrades at 40, 60, and 90 scrap, plus certain vehicles. Dispatches create a direct short-term versus long-term investment choice.

Counters: Repair Crew doesn't stop balloons, Harbor Net is wasted against ground waves, and Plate Purge underperforms against unarmored enemies.

Risks: Hoarding, repetitive emergency purchases, and trivializing attrition. The three-wave lockout and no-HQ-repair restriction preserve difficulty.

Recommended implementation order: A → C → B → D. Test each feature independently before combining balance effects.

3. Two original Puerto Rico/Caribbean tower concepts

All statistics are proposed base values before difficulty multipliers or global effects.

T0 is purchase, T1 is the first upgrade, and T2A/T2B are alternative final specializations. Costs are incremental.

Every final branch is stronger than T1 in all existing numeric combat parameters, with increasing visual level and model scale.

Tower 1 — Trenza de Mangle

Faction: Flora
Role: Brackish control / Soaked status
Placement: Land

A fictional defensive structure formed from braided mangrove-inspired prop roots that launches wet seed capsules.

Visual evolution:

- T0 Root Bowl: Compact cluster of woven roots holding a shallow brackish seed reservoir.
- T1 Brackish Loom: Taller braided aqueduct with reinforced root supports and a luminous reservoir.
- T2A Canopy Sluice: Towering leafy canopy with three sluice spouts and suspended water channels.
- T2B Saltroot Lance: Reinforced spiral root cannon with hardened ceramic salt plates and heavier bracing.

Stat| T0| T1| T2A| T2B
Incremental cost| 480| 510| 1,190| 1,290
Max HP| 160| 220| 315| 330
Damage| 2.4| 3.8| 5.7| 6.4
Fire rate/s| 1.20| 1.40| 1.65| 1.80
Range, px| 160| 180| 210| 205
Pierce| 2| 3| 4| 5
Splash radius, px| 26| 35| 48| 44
Projectile speed, px/s| 440| 500| 590| 610
Soaked duration| 1.5s| 2.0s| 3.0s| 2.5s
Slow fraction| 0.12| 0.16| 0.21| 0.18
Armor shred/hit| 0| 0| 0| 0.15
Visual level| 0| 1| 2| 2
Model scale| 1.00| 1.06| 1.14| 1.16

Attack: Original magical brackish-seed projectile. Can damage ordinary balloons and ground bugs, but not aircraft-class enemies.

Existing system synergy: Soaked feeds Conduct with electricity, Freeze with cold, and Steam with fire. Pairing it with Tesla or Frost Bastion should be powerful but require investment.

Counterplay: Aircraft-only enemies, spread-out targets, and high-HP bosses are unfavorable matchups.

Balance risk: Too much wet coverage could cause Conduct to trigger excessively. Retain existing reaction cooldowns and measure Conduct damage share.

Tower 2 — Atalaya del Alisio

Faction: Frontier
Role: Mixed anti-air/ground acoustic defense
Placement: Land

An original coastal lookout fitted with invented mechanical resonators inspired by the winds and historic defensive architecture of Puerto Rico.

Visual evolution:

- T0 Signal Post: Small stone-and-bronze tripod with a single vibrating diaphragm.
- T1 Trade-Wind Array: Elevated lookout with a rotating wind vane, larger horn, and mechanical counterweights.
- T2A Barlovento Chorus: Tall double-ring wind harp with six outward-facing resonance horns.
- T2B Resonant Bastion: Reinforced bell chamber, focused resonant lens, and illuminated shield-disruption coils.

Stat| T0| T1| T2A| T2B
Incremental cost| 650| 620| 1,400| 1,450
Max HP| 190| 260| 360| 375
Damage| 3.3| 5.1| 7.1| 8.2
Fire rate/s| 1.15| 1.40| 1.70| 1.65
Range, px| 195| 215| 245| 245
Pierce| 2| 3| 5| 5
Splash radius, px| 28| 38| 58| 50
Pulse speed, px/s| 650| 710| 790| 800
Slow fraction| 0.08| 0.12| 0.20| 0.16
Shield-break factor| 1.0| 1.0| 1.0| 1.8
Visual level| 0| 1| 2| 2
Model scale| 1.00| 1.07| 1.15| 1.17

Attack: Original expanding energy pulse with a distinct acoustic sound. Hits both ground and aircraft.

Specializations:

Barlovento Chorus emphasizes area control, stronger slowing, and crowd management.

Resonant Bastion emphasizes concentrated damage and breaking energy shields.

Existing system synergy: Complements Flak AA Battery, Marksman, Tesla, and Harbor Beacon without replacing their specialist roles.

Counterplay: Expensive relative to dedicated low-cost anti-air; weaker single-target efficiency than high-damage heavy weapons.

Balance risk: Strong aerial slowing could trivialize existing aircraft waves. Keep resistance rules intact and validate its DPS against Flak.

Tower integration requirements

Both towers should support existing targeting modes, tier-3 specialization, same-branch fusion, save/load, co-op replication, 70% invested-cost refunds, 2D effects, and original first-person models.

Do not add new hidden cross-type fusion recipes in the initial release. Validate monotonic upgrades through the existing tower validation system.

4. Three original Caribbean enemy types

Each family has three increasingly threatening grades. Grades are separate spawn variants rather than mid-wave upgrades.

Enemy A — Cangrejo de Salitre

Type: Ground / heavy / armored

A fictional salt-encrusted shore-crab-like hive scavenger with asymmetrical claws.

Visual progression: Grade I has a compact chalky shell; Grade II gains layered coral-like armor and a glowing seam; Grade III becomes a towering multi-plated walker with an articulated anchor-shaped claw.

Stat| Grade I| Grade II| Grade III
First eligible wave| 24| 41| 61
HP| 90| 165| 320
Speed, px/s| 45| 50| 56
Armor fraction| 0.30| 0.40| 0.52
Shield| 0| 0| 0
Melee DPS| 8| 14| 24
Shell Brace interval| 10s| 8s| 6s
Brace duration| 2.0s| 2.5s| 3.0s
Extra sharp/ballistic resistance while braced| 20%| 25%| 30%
Bounty| 12| 20| 35
Scrap| 6| 10| 18
Leak penalty| 4| 6| 9
Sprite size, px| 56| 66| 82
Collision radius, px| 18| 21| 26

Unique mechanic — Shell Brace: Periodically closes its plates for additional protection against non-armor-piercing sharp and ballistic attacks. AP and explosives bypass that additional protection.

Counters: Armor-shredding attacks, AP, explosives, Steam, and concentrated damage.

Risk: Resistance layers must never create unexplained invulnerability. Display a clear shell-closing animation.

Enemy B — Polilla del Alisio

Type: Flying / aircraft-class

An invented moth-like hive organism with salt-crystal sail wings. It is not intended as a realistic wildlife depiction.

Visual progression: Grade I has one triangular pale sail; Grade II develops twin translucent vanes and a luminous center; Grade III has a four-winged crescent profile and a rotating particle wake.

Stat| Grade I| Grade II| Grade III
First eligible wave| 26| 46| 66
HP| 32| 65| 125
Speed, px/s| 82| 96| 112
Shield HP| 0| 16| 36
Bounty| 9| 17| 29
Scrap| 0| 2| 4
Leak penalty| 2| 4| 6
Tailwind radius| 90px| 110px| 130px
Speed bonus to other nonboss flyers| +10%| +15%| +20%
Tailwind duration| 3s| 3.5s| 4s
Tailwind interval| 10s| 9s| 8s
Sprite size, px| 48| 60| 75
Collision radius, px| 15| 18| 22

Unique mechanic — Tailwind: Temporarily accelerates nearby nonboss flying enemies. Multiple Tailwind effects do not stack, and the moth does not accelerate itself.

Counters: Flak, Atalaya del Alisio, Apex Laser Scout, Marksman, Tidebreaker, and shield-breaking abilities.

Risk: Multiplying flying-boss speed would create unfair pressure; bosses are explicitly immune to Tailwind.

Enemy C — Sargazo Errante

Type: Ground / support

An invented moving mass of sargassum-like ribbons on thin root legs.

Visual progression: Grade I is a loose tangled knot; Grade II has a glowing core and foam-shell outriggers; Grade III has thick woven ribbons, a tide-battered wooden core, and four illuminated seed pods.

Stat| Grade I| Grade II| Grade III
First eligible wave| 28| 48| 68
HP| 75| 150| 300
Speed, px/s| 36| 42| 50
Shield HP| 0| 15| 35
Melee DPS| 5| 9| 15
Healing other ground bugs/s| 2 HP| 4 HP| 6 HP
Healing radius| 60px| 80px| 100px
Scavengers released on death| 1| 2| 3
Bounty| 11| 20| 38
Scrap| 2| 5| 10
Leak penalty| 4| 7| 11
Sprite size, px| 62| 78| 96
Collision radius, px| 20| 25| 30

Unique mechanic — Driftweed Support: Heals other nearby nonboss ground bugs, never itself. Multiple healing auras take the highest value rather than stacking.

Counters: Focus fire using Strongest/Closest targeting, burst attacks, Flame Melon, and Wildfire on clustered enemies.

Risk: Its death-spawned Scavengers must not pay additional bounty or scrap, preventing reward-farming loops.

Enemy rollout restrictions

Do not introduce these families into waves 1–20.

On first appearances, limit groups to three Saltclaws, four Moths, or two Carriers. Increase counts only after proving the counters are accessible.

All grades need completely original sprites, animations, sounds, and first-person models.

5. Difficulty and balance review — waves 1–80

5.1 Existing difficulty structure

Easy finishes at wave 40, Medium at 60, and Hard at 100.

Waves beyond the normal Easy and Medium endpoints occur only after the player wins and selects Freeplay.

Current economy:

Difficulty| Starting credits| Tower cost multiplier| HQ HP| Enemy speed multiplier
Easy| 900| 0.90| 280| 0.92
Medium| 750| 1.00| 200| 1.00
Hard| 750| 1.05| 200| 1.08

Both active maps use a 0.8 enemy-HP map-ease multiplier. Difficulty and wave-based HP multipliers then apply.

Examples of calculated total HP multipliers relative to authored enemy HP:

Wave| Easy| Medium| Hard
1| ×0.64| ×0.80| ×0.83
10| ×0.93| ×1.16| ×1.26
19| ×1.31| ×1.77| ×2.10
30| ×1.76| ×2.78| ×3.52
40| ×2.18 — finale| ×3.74| ×5.02
50| ×3.17 — Freeplay| ×5.68| ×8.03
60| ×4.16 — Freeplay| ×7.78 — finale| ×11.50
70| ×5.16 — Freeplay| ×10.54 — Freeplay| ×17.02
80| ×6.15 — Freeplay| ×13.72 — Freeplay| ×23.81

These calculations include wave scaling, difficulty ramps, and map ease, but exclude shields, armor, and damage modifiers.

5.2 Wave bands

Waves| Threats| Difficulty concern| Recommendation
1–5| Early balloons, Scavengers, Hunters, first armored and shielded enemies| Introduces multiple counter requirements early| Counter hints for armor and shields without reducing opening difficulty
6–10| Gargoyles, Lead, Ceramics, Bile Titan| Early anti-air and Lead counters become mandatory| Visible counter explanations and boss telegraphs
11–15| Scarab and initial Sky Colossus| Transition into serious specialization| Introduce accurate Threat Brief
16–20| Zeppelin, multiple Sky Colossi, Dreadnought, Chargers| Major Cabras spike, particularly w18–21| A/B test spawn timing and heavy quantity
21–30| Procedural waves and regular heavy milestones| Builds must start adapting| Unlock contracts, first sector, and scrap dispatches
31–40| Higher enemy counts and boss milestones| HP starts outgrowing uncoordinated builds| Overload Routing and readable boss warnings
41–50| Post-wave-40 HP ramp; dual bosses at 50| Mixed defenses become essential| Second sector later in the band; mobile FX limits
51–60| More elite enemies; Medium ends with three bosses at 60| Long-term specialization should pay off| Verify branch/fusion parity and finale preparation
61–70| More Colossi, Titans, and heavy procedural groups| Hard El Morro losses historically cluster here| Measure damage saturation and armor/shield stalls
71–80| Heavy air/ground composition; wave-80 boss pair| The late-game challenge must remain adaptable| Test routing, dispatches, fusion and performance

Wave 80 Hard: The current procedural boss rotation produces Zombie Dreadnought and Heavy Scarab Walker, alongside a wave-five Sky Colossus pack and the procedural enemy groups.

5.3 Isla de Cabras wave-19 intervention

The existing balance reports describe the Cabras wave-19 fight as a dangerous combination of two simultaneously threatening Sky Colossi, ceramics, Chargers, and Ironbacks.

Current authored wave 19 contains three Sky Colossi; after current count scaling, the group produces five total spawns.

First intervention: Correct the wave preview before changing difficulty.

Then A/B test:

Variant A — Spawn reduction: On Cabras only, reduce the authored Sky Colossus group from three to two, resulting in two actual spawns under the current scaling rule, with ten-second spacing.

Variant B — Timing adjustment: Preserve authored quantity but increase spacing to eight seconds and add a six-second incoming warning.

Do not change the global Sky Colossus HP or make both changes at once.

Measure wave-16–21 failure rate, wave-21 survival, and HQ health through wave 30 across the same seeds and build strategies.

5.4 Acceptance testing

Run at least 216 simulated games:

12 deterministic seeds × 2 active maps × 3 difficulties × 3 bot strategies.

Strategies should include a beginner mixed build without fusion, a competent build using specialization and some fusion, and an experienced build using elements, Overload Routing, and the new temporary systems.

For each wave, track actual enemy count, enemy classes, effective HP, tower investment, available credits/scrap, Rage uptime, leaks by class, HQ losses, and timing.

Proposed targets:

Metric| Target
Easy wave-40 completion| ≥90% for an informed beginner build on each map
Medium wave-60 completion| 60–80% for an informed mixed build
Hard reaching wave 80| 35–55% for the experienced bot
Cabras versus Morro Medium wave-21 survival gap| ≤15 percentage points
Hard pre-wave-25 single-wave wipe probability| ≤40% for the experienced bot

These are design acceptance targets, not measurements of existing player behavior. Hard's final wave-100 success rate requires separate testing.

Performance targets: Median ≥45 FPS on a representative midrange mobile device during a demanding 2D wave, 95th-percentile frame time below 45ms, and no persistent memory growth from effects or previews.

Sources: "Difficulty definitions" (https://github.com/beeforestry/bloons-of-the-frontier/blob/main/src/data/difficulty.ts), "Wave definitions" (https://github.com/beeforestry/bloons-of-the-frontier/blob/main/src/data/waves.ts), "WaveManager" (https://github.com/beeforestry/bloons-of-the-frontier/blob/main/src/systems/WaveManager.ts), "Boosts" (https://github.com/beeforestry/bloons-of-the-frontier/blob/main/src/systems/Boosts.ts), "t106 Cabras balance" (https://github.com/beeforestry/bloons-of-the-frontier/blob/main/balance/t106r2_med_trop.md).

6. Mobile and first-person usability

Mobile 2D

- Use a single collapsed Threat Brief chip directly above the Start control. Expand only when tapped.
- Keep all critical tap targets at least 44×44 CSS pixels, including confirmation and cancellation.
- Never require hover, Shift, right-click, or small precise object selection.
- Show real tradeoff text, such as “Air +25% / Ground −10%,” rather than unexplained icons.
- With Auto Waves enabled, default to Neutral, keep the existing sector stance, and purchase no dispatch unless instructed.
- Add an optional Pause Auto After This Wave control before major encounters.
- Preserve mechanical indicators at low quality while reducing cosmetic debris, glow, and shake.
- Provide a Reduce Flashes / Shake option independently of audio mute.

First-person Possess

- Briefly show current wave, contract, Overload route, sector stance, and Rage status on entry.
- Let players retrieve that status from one simple pause/action control.
- Keep a large Tactical Map return button on touch devices and preserve the last selected tower and targeting state.
- Display meaningful target classifications: AIR, PLATED, or RUSH.
- Give short, throttled feedback when shots fail because of anti-air requirements, armor, shields, or Lead resistance.
- Do not require first-person aiming to defeat any new enemy. Every critical counter must also work through ordinary 2D tower defense.
- Expose aim sensitivity and optional hold/toggle firing controls on phones.
- Keep FIRE clear of the right-hand touch-look area.
- Benchmark sustained Possess combat on physical midrange Android devices, not just headless Chrome.
- In co-op, distinguish owner-only actions from team-shared effects; clients should display confirmed host state.

Usability target: An uncoached player should be able to inspect an incoming wave, select a tower, understand both specialization branches, choose a contract, and return from first-person without a keyboard in under 45 seconds after the relevant tutorial.

7. Originality and asset licensing

All new tower and enemy names, mechanics, silhouettes, animations, projectiles, audio cues, and first-person models must be original.

Do not copy distinctive names, looks, UI, characters, vehicles, sounds, or art direction associated with BTD, Plants vs. Zombies, Halo, or other commercial games.

Puerto Rican ecological and architectural references should inspire materials, shapes, and environmental context rather than reproduce existing character designs.

Use original procedural art and audio wherever practical. Any external asset must be:

- CC0, or
- Verifiably public domain, or
- CC-BY, with creator, asset title, license version, and source URL credited.

Do not use Google Earth or Google Maps imagery. Government reference material does not automatically mean every photograph on its website is reusable.

Reliable geographic and ecological references:

- "USGS — Caribbean Coastal Mangrove" (https://pubs.usgs.gov/of/2016/1073/ofr20161073.pdf)
- "USGS — Wetland Resources: Puerto Rico" (https://pubs.usgs.gov/wsp/2425-spanish/report.pdf)
- "National Park Service — San Juan City Walls and Garitas" (https://www.nps.gov/saju/learn/historyculture/citywalls.htm)

These support the environmental inspiration, not the invented fictional combat mechanics or stats.

8. Release plan and non-goals

Prototype 1 — Threat Brief and Contracts (M): Correct the preview and test temporary contracts without changing enemy HP.

Prototype 2 — Overload Routing (M): Add specialization while keeping Balanced mode unchanged.

Prototype 3 — Command Sectors (L): Start with one sector, verify clarity and host synchronization, then enable the second.

Prototype 4 — Salvage Dispatches (M): Introduce temporary scrap expenditures after validating the existing salvage economy.

Content phase: Introduce new towers and enemy families in small groups, checking counters, progression, model readability, mobile performance, and co-op state.

Explicit non-goals: New maps, changed map geometry, altered vehicle boarding, Overrun/versus rewrites, additional currencies, new hidden fusion recipes, third-party audio, or unlicensed assets.

Ready-for-coding criteria: Each feature needs a 2D wireframe and touch interaction sketch; the wave-19 preview must match actual spawns; every new enemy requires an existing-counter matrix; and the balance changes must be reproducible on identical seeds.

---

Source index

Primary repository sources reviewed: "README" (https://github.com/beeforestry/bloons-of-the-frontier/blob/main/README.md), "design architecture" (https://github.com/beeforestry/bloons-of-the-frontier/blob/main/docs/DESIGN.md), "t103" (https://github.com/beeforestry/bloons-of-the-frontier/blob/main/PROGRESS_t103.md), "t104" (https://github.com/beeforestry/bloons-of-the-frontier/blob/main/PROGRESS_t104.md), "t105" (https://github.com/beeforestry/bloons-of-the-frontier/blob/main/PROGRESS_t105.md), "t106" (https://github.com/beeforestry/bloons-of-the-frontier/blob/main/PROGRESS_t106.md), "t107" (https://github.com/beeforestry/bloons-of-the-frontier/blob/main/PROGRESS_t107.md), "towers" (https://github.com/beeforestry/bloons-of-the-frontier/blob/main/src/data/towers.ts), "enemies" (https://github.com/beeforestry/bloons-of-the-frontier/blob/main/src/data/enemies.ts), "targeting" (https://github.com/beeforestry/bloons-of-the-frontier/blob/main/src/systems/TargetingSystem.ts), "elements" (https://github.com/beeforestry/bloons-of-the-frontier/blob/main/src/systems/Elements.ts), "recipes" (https://github.com/beeforestry/bloons-of-the-frontier/blob/main/src/data/recipes.ts), "armory" (https://github.com/beeforestry/bloons-of-the-frontier/blob/main/src/data/armory.ts), and "resources" (https://github.com/beeforestry/bloons-of-the-frontier/blob/main/src/systems/ResourceManager.ts).