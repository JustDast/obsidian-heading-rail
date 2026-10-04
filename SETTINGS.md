# Heading Rail — Every setting

📘 [Guide: How to use](GUIDE.md) · 🎨 [Looks and the catalog](GUIDE.md#looks-and-the-catalog) · 🆕 [What's new](README.md#whats-new) · 🏠 [README](README.md)

Every setting of the plugin, in the same order, groups and wording as in **Settings → Heading Rail** (version 10.5.1). The names, descriptions and default values below are taken straight from the plugin itself, not written by hand, so they match what you see. Where the phone has a different default, both are given.

> The plugin keeps two profiles, **Desktop** and **Mobile** (the tabs at the top of the settings). On the Mobile tab every setting has a chain button: linked — the phone takes the desktop value; unlinked — it has its own. *Desktop only* settings are about the mouse, Ctrl, the wheel, the keyboard or the editor scrollbar and do not appear on the Mobile tab; *Phone only* settings appear only there.

> Next to every adjustable setting (a slider, a number or a colour) there are two small buttons: **Back** — undo the last change of this setting (the memory survives restarts; the whole list is in the history window, section *Settings*), and **Reset** — the default value. For colours the reset is the arrow that returns the theme colour. A number can also be typed into the field next to a slider — even beyond the slider's range, where that makes sense.

> Some rows appear only when the setting above them allows it — for example, the floating button look appears only when the outline opens with the floating button, and animation time and strength only when there is an animation. They are all listed here.

> "Theme colour" means the colour is not fixed: it is taken from your Obsidian theme, so it works on light and dark themes alike. Every colour is also repeated in **All colours** at the end of the settings.

## Contents

1. [General](#settings-general)
2. [Ready-made presets](#settings-presets)
3. [Custom CSS, images and fonts](#settings-custom)
4. [Bars](#settings-bars)
5. [Wave](#settings-wave)
6. [Current bar and halo](#settings-glow)
7. [Note scrolling](#settings-scroll)
8. [Outline](#settings-list)
9. [Floating button](#settings-float)
10. [Search](#settings-search)
11. [Hover preview](#settings-preview)
12. [History and undo](#settings-history)

---

<a id="settings-general"></a>

## General

<a id="set-language"></a>**Language**

Interface language for this plugin. Auto follows Obsidian's own setting.

**Default:** English

<a id="set-where-settings-open"></a>**Where settings open**

In the sidebar — the same settings next to the note: change something and see the result at once. The tab can be dragged next to the note. On top — a strip of sections.

**Default:** In Obsidian’s settings window

<a id="set-where-the-history-opens"></a>**Where the history opens**

With the button in the note header — as a window, as before, or in the sidebar: there the history stays next to the note and updates by itself.

**Default:** As a window

<a id="set-guide"></a>**Guide**

The guide on GitHub: every feature and setting with pictures, and what the new version brings.

<a id="set-report-a-bug-or-suggest-an-idea"></a>**Report a bug or suggest an idea**

Opens your mail app with a letter to the author — for bugs and for ideas alike. The plugin version, Obsidian version, system and theme are filled in for you — you can read every line before sending.I'm not a programmer at all and never even opened the code of this plugin, it's written fully by AI from my ideas, because of that it's not perfect at all since there's just no normal professional person who could check it, so it can have all kinds of bugs depending on devices, on apple i didn't test at all, so if something doesn't work for you - interface moved somewhere or a setting doesn't work - the problem isn't you, it's the code, please write about every bug as detailed as possible and it will be fixed as fast as possible on your request, don't wait for it to go away by itself, unlikely, and while you don't write i most likely don't even know about itand one more thing, really important: write to me about literally everything — a feature you're missing, something you'd like to change, something inconvenient, something that doesn't work. i know everyone got used to writing to a developer and it goes nowhere, and that nobody will build anything for just one person — here it's different, i read everything, and if i like the idea or it's objectively useful for the plugin, in most cases it will be made (if it's technically possible at all). so don't be shy, even if it seems only you need it or it's some small thing — write

*On the Mobile tab:* *These settings apply on phones and tablets only. Use the link button next to a setting to take its value from the desktop profile instead.*

<a id="set-use-the-plugin-on-this-phone"></a>**Use the plugin on this phone**

Obsidian has its own swipe gesture near the edge of the screen, and it can get in the way of the rail. If that makes the phone more trouble than it's worth, switch the plugin off here — the desktop side keeps working exactly as before.

**Default:** On · *Phone only*

<a id="set-layoutmode"></a>**Bars**

The heading bars at the edge of the note. Turned off, only the outline is left. To switch quickly, assign a hotkey to the command “Show or hide the bars”.

**Default:** On

<a id="set-outlineon"></a>**Outline**

The expandable list of headings. Turned off, it does not open at all. To switch quickly, assign a hotkey to the command “Turn the outline on or off”.

**Default:** On

<a id="set-turning-the-plugin-off-in-a-note"></a>**Turning the plugin off in a note**

The eye button in the note header turns the whole plugin off in that note — bars, outline and floating button. The plugin can remember it itself, or write it into the note as a property — visible at the top, but it travels with the file to every device.

**Default:** The plugin remembers

<a id="set-minheadings"></a>**Only on notes with at least**

How many headings a note needs before the rail appears. Zero shows it everywhere.

**Default:** 0

<a id="set-ghostrails"></a>**Bars in the neighbouring notes**

When notes are open side by side, the inactive one keeps still bars. Clicking a bar makes that note active and goes to the section.

**Default:** On

<a id="set-mouse-wheel-over-numbers-the-other-way"></a>**Mouse wheel over numbers — the other way**

In the settings, the wheel over a number field changes it by one step per click. Normally wheel up means more.

**Default:** Off · *Desktop only*

<a id="set-touchpad-over-numbers-the-other-way"></a>**Touchpad over numbers — the other way**

The touchpad changes a number by one step for every 30 pixels of an up or down gesture. Normally a gesture up means more.

**Default:** Off · *Desktop only*

---

<a id="settings-presets"></a>

## Ready-made presets

<a id="set-catalog-of-presets-effects-and-css"></a>**Catalog of presets, effects and CSS**

Screenshots, descriptions and search. Download and apply with one button, on desktop and on phone.

<a id="set-preset"></a>**Preset**

Currently on: Standard.

<a id="settings-effects"></a>

### Applied now

<a id="set-no-effects-or-css-add-ons"></a>**No effects or CSS add-ons**

You can apply them from the catalog, on top of any preset.

<a id="set-follow-the-theme"></a>**Follow the theme**

Colours that come from a ready-made preset are adjusted so they never end up light on light or dark on dark: the author of the preset picked them for their own theme, not yours. Colours you set yourself are never touched — even if they end up close to the background.

**Default:** On

<a id="set-settings-file"></a>**Settings file**

Save all settings to a file, or paste them back — as text (for example from “Share…”) or from a file. For a backup or to move them to another vault.

<a id="set-share-your-own-preset"></a>**Share your own preset**

If you have arrived at something you like, you can send it in. Checked presets appear in the catalog — no plugin update needed.

---

<a id="settings-custom"></a>

## Custom CSS, images and fonts

<a id="settings-c-css"></a>

### Custom CSS

*Your own CSS, background images and any fonts. All of it goes into “Share…”, the settings file and themes — so you can share it. A theme, effect or CSS code can simply be pasted into the settings search bar at the top.*

<a id="set-customcsson"></a>**Custom CSS on**

Turn off to quickly see how it looks without it — the text is kept.

**Default:** On

<a id="set-customcss"></a>**Custom CSS**

Takes effect at once. Separate for desktop and phone. Like Obsidian’s CSS snippets, but it travels with the theme.

<a id="settings-c-img"></a>

### Your images

<a id="set-your-images"></a>**Your images**

For the background of the outline window, preview, search and floating button: pick “Your image” in their background settings. Large ones are scaled down to 1600 px.

<a id="set-gifanim"></a>**Animate GIFs**

GIF backgrounds move. Off — the first frame stays still: easier on the eyes and the battery (on the phone, say). Set separately for each device. A GIF is stored as a file in the plugin folder, up to 20 MB, without blur.

**Default:** On

<a id="settings-c-font"></a>

### Your fonts

<a id="set-your-fonts"></a>**Your fonts**

Font files .ttf, .otf, .woff, .woff2 from your device. Once added, the font is in every font list. Any installed font can be picked without uploading: “Other font…” in the list.

---

<a id="settings-bars"></a>

## Bars

<a id="settings-b-place"></a>

### Position of the bars

<a id="set-side"></a>**Side of the bars**

Which edge of the note the bars are docked to.

**Default:** Right

<a id="set-anchor"></a>**Vertical anchor**

Where the bars sit along the height of the note.

**Default:** Centre

<a id="set-railfrom"></a>**Rail starts at**

Top edge of the rail, as a percentage of the note height.

**Default:** 4.9 % of note height

<a id="set-railto"></a>**Rail ends at**

Bottom edge of the rail, as a percentage of the note height. Together with the setting above this carves out the band the bars live in — and the vertical anchor decides where inside that band they sit when there are too few of them to fill it.

**Default:** 95.1 % of note height

<a id="set-railedge"></a>**Distance from the window edge**

How far the whole rail is pulled away from the edge of the note, in pixels.

**Default:** 0.2% · on the phone: 6 pixels

<a id="settings-b-p-tasks"></a>

#### Tasks next to the bars

*Phone only.*

<a id="set-taskshift"></a>**Move tasks away from the bars**

Bars on the left lie over the start of the text, and checkboxes under them cannot be tapped. Lines with tasks move to the right; the rest of the text stays put. Works only when the bars are on the left. On the phone it is on from the start.

**Default:** On · *Phone only*

<a id="set-taskshiftmode"></a>**Task offset**

**Default:** From the bars: auto + value · *Phone only*

<a id="set-taskshiftedge"></a>**Distance from the left edge**

Where the checkboxes stand: distance from the left edge of the screen, the bars do not matter.

**Default:** 60 pixels · *Phone only*

<a id="set-taskshiftextra"></a>**Added to the bars**

**Default:** 6 pixels · *Phone only*

<a id="settings-b-spacing"></a>

### Spacing between bars

<a id="set-spacingmode"></a>**Spacing between bars**

Adaptive spreads the bars over the available height. Fixed keeps the same gap no matter how many headings there are.

**Default:** Adaptive

<a id="set-fixedspacing"></a>**Fixed spacing**

Gap between bars in pixels.

**Default:** 16

<a id="set-spacingmin"></a>**Minimum spacing**

The bars never get closer together than this.

**Default:** 10

<a id="set-spacingmax"></a>**Maximum spacing**

The bars never spread further apart than this, even in a short note.

**Default:** 20

<a id="set-raildepth"></a>**Deepest heading on the bars**

Headings below this level get no bar of their own.

**Default:** 4

<a id="set-raildepthfrom"></a>**Count the depth**

From H1 — “up to H4” means H1–H4. From the largest heading of the note — in a note that starts with H2, that is H2–H5. If the note has no heading within the depth at all (only H5 and H6), the depth always counts from the largest one — otherwise there would be no bars.

**Default:** From H1

<a id="settings-b-cols"></a>

#### Bar columns

<a id="set-railmaxcols"></a>**Maximum bar columns**

When there are too many headings for one column, the bars stand in several. On the desktop at most three, on the phone at most two (you can set fewer). If they still don't fit, there are no bars — only the outline works.

**Default:** 3 · on the phone: 2

<a id="set-colgap"></a>**Gap between columns**

Space between columns of bars on notes long enough to need more than one, in pixels.

**Default:** 1%

<a id="settings-b-len"></a>

### Length of the bars

<a id="set-barwidth"></a>**Bar length**

Resting length of the bars, as a percentage of the default for each heading level.

**Default:** 150

<a id="set-barpeakdup"></a>**Wave intensity**

One slider over all the others: it pulls length, brightness, opacity, thickness and — more gently — reach at the same time. Set it to zero and the bars stop reacting entirely; everything below still describes the character of the wave, this only says how loudly.

**Default:** 175

<a id="settings-b-thick"></a>

### Thickness of the bars

<a id="set-barthickness"></a>**Bar thickness**

How thick each bar is, in pixels.

**Default:** 3

<a id="set-tsmode"></a>**Thickness by the distance between bars**

Bar thickness follows the distance between bars in this note. By ranges — each “from – to” has its own multiplier (100 % — the thickness as is). Smoothly — by itself: as is at the densest spacing, as much as you set at the sparsest. Works only when the spacing adapts (not “Fixed”).

**Default:** Off

<a id="set-tssmoothatmax"></a>**Thickness at the sparsest spacing, %**

At the densest spacing between bars (the minimum of the adaptive spacing) the thickness is as is — 100 %; at the sparsest (the maximum) — this much; in between — smoothly, by itself.

**Default:** 200

<a id="set-tscount"></a>**Number of ranges**

**Default:** 3

<a id="settings-b-thick-1-thickness-range-1"></a>

#### Thickness range 1

<a id="set-tsfrom1"></a>**Distance from, px**

**Default:** 1

<a id="set-tsto1"></a>**Distance to, px**

**Default:** 7

<a id="set-tsmul1"></a>**Thickness multiplier, %**

100 % — the thickness as is, 150 % — one and a half times thicker.

**Default:** 120

<a id="settings-b-thick-2-thickness-range-2"></a>

#### Thickness range 2

<a id="set-tsfrom2"></a>**Distance from, px**

**Default:** 7

<a id="set-tsto2"></a>**Distance to, px**

**Default:** 14

<a id="set-tsmul2"></a>**Thickness multiplier, %**

**Default:** 170

<a id="settings-b-thick-3-thickness-range-3"></a>

#### Thickness range 3

<a id="set-tsfrom3"></a>**Distance from, px**

**Default:** 14

<a id="set-tsto3"></a>**Distance to, px**

**Default:** 40

<a id="set-tsmul3"></a>**Thickness multiplier, %**

**Default:** 200

<a id="settings-b-colour"></a>

### Colour of the bars

*Each colour sits on the same row as its own opacity, and the arrow on the right gives it back to your theme.*

<a id="set-barcolor"></a>**Bar colour**

Leave empty to follow the theme. Any CSS colour works.

**Default:** theme colour

<a id="set-bargrad"></a>**Gradient by place in the note**

Bars are coloured from the top colour to the bottom one by where their heading is in the note. On top of the level colours; the wave and the current bar stay as they are.

**Default:** Off

<a id="settings-b-shape"></a>

### Shape and glow of the bars

<a id="set-barradius"></a>**Rounding of the bar ends, px**

The arrow — as before: fully round ends. 0 — square ends.

**Default:** 

<a id="set-barfade"></a>**Fade towards the inner end, %**

How much of the bar length gently fades out towards the text. 0 — no fade.

**Default:** 0

<a id="set-barglow"></a>**Glow of the bars, px**

A soft glow around every bar — all of them, not only the current one. 0 — no glow.

**Default:** 0

<a id="set-barglowcolor"></a>**Colour of the bars glow**

The arrow — the colour of the bar itself (the current bar — its own colour).

**Default:** theme colour

<a id="set-barglowop"></a>**Brightness of the bars glow, %**

**Default:** 60

<a id="settings-b-levels"></a>

### Bars by heading level

<a id="settings-b-lv1"></a>

#### Bars of H1 headings

*Resting length of a bar, in pixels, before the overall multiplier above is applied.*

<a id="set-lvlw1"></a>**Heading level 1**

**Default:** 30 pixels

<a id="set-lvlt1"></a>**Level 1 — thickness**

**Default:** 100

<a id="set-lvlo1"></a>**Level 1 — opacity**

**Default:** 100

<a id="set-lvlc1"></a>**H1 — Colour**

**Default:** theme colour

<a id="settings-b-lv2"></a>

#### Bars of H2 headings

<a id="set-lvlw2"></a>**Heading level 2**

**Default:** 20 pixels

<a id="set-lvlt2"></a>**Level 2 — thickness**

**Default:** 100

<a id="set-lvlo2"></a>**Level 2 — opacity**

**Default:** 100

<a id="set-lvlc2"></a>**H2 — Colour**

**Default:** theme colour

<a id="settings-b-lv3"></a>

#### Bars of H3 headings

<a id="set-lvlw3"></a>**Heading level 3**

**Default:** 15 pixels

<a id="set-lvlt3"></a>**Level 3 — thickness**

**Default:** 100

<a id="set-lvlo3"></a>**Level 3 — opacity**

**Default:** 100

<a id="set-lvlc3"></a>**H3 — Colour**

**Default:** theme colour

<a id="settings-b-lv4"></a>

#### Bars of H4 headings

<a id="set-lvlw4"></a>**Heading level 4**

**Default:** 12 pixels

<a id="set-lvlt4"></a>**Level 4 — thickness**

**Default:** 100

<a id="set-lvlo4"></a>**Level 4 — opacity**

**Default:** 100

<a id="set-lvlc4"></a>**H4 — Colour**

**Default:** theme colour

<a id="settings-b-lv5"></a>

#### Bars of H5 headings

<a id="set-lvlw5"></a>**Heading level 5**

Not visible now: the bars show headings up to H4 (“Deepest heading on the bars” in “Spacing between bars”).

**Default:** 9 pixels

<a id="set-lvlt5"></a>**Level 5 — thickness**

**Default:** 100

<a id="set-lvlo5"></a>**Level 5 — opacity**

**Default:** 100

<a id="set-lvlc5"></a>**H5 — Colour**

**Default:** theme colour

<a id="settings-b-lv6"></a>

#### Bars of H6 headings

<a id="set-lvlw6"></a>**Heading level 6**

Not visible now: the bars show headings up to H4 (“Deepest heading on the bars” in “Spacing between bars”).

**Default:** 6 pixels

<a id="set-lvlt6"></a>**Level 6 — thickness**

**Default:** 100

<a id="set-lvlo6"></a>**Level 6 — opacity**

**Default:** 100

<a id="set-lvlc6"></a>**H6 — Colour**

**Default:** theme colour

<a id="settings-b-caps"></a>

### Ends of the bars

<a id="set-capsmode"></a>**End marks**

The two short bars for the start and the end of the note.

**Default:** Shown, and clickable

<a id="set-capwidth"></a>**Length of the ends**

Length of the two short bars marking the start and the end of the note.

**Default:** 40 pixels

<a id="set-capthick"></a>**End marks — thickness**

**Default:** 20

<a id="set-capopacity"></a>**End marks — opacity**

**Default:** 100

<a id="set-capgrow"></a>**End marks in the wave**

How much the two end marks grow in the wave, compared with heading bars: 100% — the same, 0 — not at all.

**Default:** 100

<a id="set-capzonehover"></a>**Empty zone above and below reacts to hover**

In a short note, all the space above and below the bars belongs to the end marks. When off, hovering there (further than one bar step from the end mark) shows no wave and no highlight. Clicking still takes you to the start or end.

**Default:** On · *Desktop only*

---

<a id="settings-wave"></a>

## Wave

<a id="settings-w-strength"></a>

### Wave strength and length

*Every bar gets one number each frame: how strongly the wave reaches it. Each property below then travels from its resting value to its peak value along that number, so you can have length without colour, colour without length, or both at once.*

<a id="set-waveintensity"></a>**Wave intensity**

One slider over all the others: it pulls length, brightness, opacity, thickness and — more gently — reach at the same time. Set it to zero and the bars stop reacting entirely; everything below still describes the character of the wave, this only says how loudly.

**Default:** 175

<a id="set-keepratio"></a>**Keep bar proportions**

Every bar grows by the same factor, so a first-level bar stays longer than a second-level one even at the peak.

**Default:** Off

<a id="set-ratiogrowth"></a>**Growth at the peak**

How much longer a bar gets at the centre of the wave, as a percentage of its own length.

**Default:** 100

<a id="set-peakmode"></a>**Length at the peak**

Shared length pulls every bar towards the same length, so the crest of the wave comes out even. Added length gives each bar the same increase on top of its own, so deeper headings stay shorter.

**Default:** Shared length

<a id="set-peakadd"></a>**Peak growth**

How many pixels are added to a bar at the very centre of the wave.

**Default:** 100 pixels

<a id="set-peaklength"></a>**Peak length**

How long a bar is at the very centre of the wave — in pixels or in percent of the bars' length at rest.

**Default:** 33 pixels

<a id="settings-w-shape"></a>

### Wave shape

<a id="set-wavecurve"></a>**Wave shape**

Standard — the usual wave, shaped by its length, reach and edge sharpness. Your own — the length of every bar set by hand.

**Default:** Standard

<a id="set-wavespan"></a>**Bars in the wave**

Always an odd number: one bar in the centre and 8 on each side. Currently 17.

**Default:** 17

<a id="set-waveedge"></a>**Edge sharpness**

How hard the edges of the wave are: higher — narrower and sharper. Up to 200 on the slider; type a larger number if you need it.

**Default:** 60

<a id="set-wavereach"></a>**Wave reach**

How far the wave spreads from the cursor, measured in bars.

**Default:** 2

<a id="set-centermode"></a>**Where the wave centres**

On a bar — the empty space between bars is split down the middle, so while the cursor stays over one bar nothing moves at all; cross the halfway line and the wave slides over to the next one, as smoothly as it would follow the cursor. Freely — the centre sits exactly under the cursor, so the two bars it sits between share the wave and both keep shifting with every small movement.

**Default:** On a bar · *Desktop only*

<a id="set-sharpcenter"></a>**Distinct centre**

The bar nearest the cursor always reaches full length and the rest stay strictly shorter. With this off the strength is shared between the two bars the cursor sits between, and a neighbour can end up longer than the one you are pointing at.

**Default:** On · *Desktop only*

<a id="settings-steps"></a>

#### Bar length at each step of the wave

*Each slider is the length of one bar in pixels at full wave strength. The centre is the bar under the cursor; the rest are mirrored above and below it.*

<a id="set-stepw0"></a>**Centre bar**

**Default:** 30

<a id="set-stepw1"></a>**Bar 1 away**

**Default:** 27

<a id="set-stepw2"></a>**Bar 2 away**

**Default:** 23

<a id="set-stepw3"></a>**Bar 3 away**

**Default:** 20

<a id="set-stepw4"></a>**Bar 4 away**

**Default:** 15

<a id="set-stepw5"></a>**Bar 5 away**

**Default:** 9

<a id="set-stepw6"></a>**Bar 6 away**

**Default:** 6

<a id="set-stepw7"></a>**Bar 7 away**

**Default:** 0

<a id="set-stepw8"></a>**Bar 8 away**

**Default:** 0

<a id="settings-w-thick"></a>

### Bar thickness in the wave

<a id="set-peakthick"></a>**Thickness at the peak**

Thickness of a bar at the centre of the wave, as a percentage of its resting thickness. Leave at 100 to keep the thickness steady.

**Default:** 110

<a id="set-wavethickmul"></a>**Wave thickness multiplier**

How many times the wave thickens the bars on top of “Thickness at the peak”: 1 — as set, 0 — the wave does not thicken them, 2 — twice as strong.

**Default:** 1

<a id="settings-w-colour"></a>

### Wave colour and brightness

<a id="set-wavecolor"></a>**Wave colour**

The colour mixed into the bars by the wave. By default it follows the text colour of your theme.

**Default:** theme colour

<a id="set-peakbright"></a>**Brightness at the peak**

How much of the wave colour is mixed into a bar at the centre of the wave. Zero leaves the colour alone and only the length changes.

**Default:** 100

<a id="set-restbright"></a>**Brightness at rest**

How much of the wave colour every bar carries while the wave is away.

**Default:** 5

<a id="set-peakopacity"></a>**Opacity at the peak**

How solid a bar is at the centre of the wave.

**Default:** 100

<a id="set-restopacity"></a>**Opacity at rest**

How solid the bars are while the wave is away.

**Default:** 100

<a id="settings-w-motion"></a>

### Wave movement

<a id="set-followtime"></a>**Catch-up time**

How long the wave takes to reach the cursor, in milliseconds. Zero pins it to the cursor exactly.

**Default:** 350

<a id="set-overshoot"></a>**Overshoot**

How far the wave swings past the cursor on a fast movement before coming back. Zero arrives and stops.

**Default:** 65

<a id="set-risetime"></a>**Build-up**

How long the wave takes to reach full strength when the cursor arrives.

**Default:** 310

<a id="set-falltime"></a>**Fade out**

How long the wave takes to die away after the cursor leaves. Zero snaps back instantly.

**Default:** 320

<a id="settings-w-react"></a>

### Where the wave reacts

*Desktop only.*

<a id="set-reactzone"></a>**Reaction zone**

How far from the rail the bars start responding, in pixels. The strength fades smoothly to nothing at the far edge of the zone, so the wave comes towards the cursor rather than snapping on. Zero means the bars only react once the cursor is over the rail itself.

**Default:** 105 pixels · *Desktop only*

<a id="settings-w-r-side"></a>

#### The wave when the cursor moves sideways

*Desktop only.*

<a id="set-horizontaldepth"></a>**React to horizontal movement**

The wave grows as the cursor moves across the bars away from the screen edge. Desktop only.

**Default:** Off · *Desktop only*

<a id="set-horizontalreach"></a>**Where the wave reaches full strength, % of the bars' width**

Measured from the screen edge inwards across the bars: at the edge the wave has the «strength at the very edge», by this point — full strength. Desktop only.

**Default:** 100 · *Desktop only*

<a id="set-horizontalmin"></a>**Strength at the very edge**

How strong the wave is when the cursor is pressed against the edge of the window, as a percentage of full. Lower values make the rail feel restrained until you move towards the text.

**Default:** 100 · *Desktop only*

<a id="settings-w-when"></a>

### When to animate the wave

*At the peak a bar is longer than the rail, so with the outline open it would lie across the list. These two switches say whether the bars stay still in that state; when they do move, the outline slides aside by exactly what the bars take.*

<a id="set-reducemotion"></a>**Follow the system "reduce motion" setting**

If motion is reduced in your system settings, the wave stays still and the highlight jumps instead of travelling.

**Default:** On

<a id="set-wavepinned"></a>**Animate while the outline is pinned**

Off keeps the bars at their resting length whenever the outline is pinned open.

**Default:** On

<a id="set-wavepeek"></a>**Animate while holding Ctrl (⌘ Cmd)**

Off keeps the bars still while the outline is being peeked at with Ctrl (⌘ Cmd).

**Default:** On · *Desktop only*

---

<a id="settings-glow"></a>

## Current bar and halo

<a id="settings-gl-active"></a>

### Current bar

*Two separate things, each switched on by itself: the current bar, and the halo around it. The halo is set the same way as bar lengths — how many bars it reaches and how bright each step is, mirrored above and below.*

<a id="set-activeglow"></a>**Highlight the current bar**

The bar for the heading you are in right now.

**Default:** Always

<a id="set-activecolor"></a>**Active bar colour**

Colour of the bar marking your current position. Empty follows the theme accent.

**Default:** theme colour

<a id="settings-gl-a-move"></a>

#### Current bar moving to a new one

<a id="set-activemove"></a>**When the current bar changes**

Jump — the highlight appears in the new place at once. Travel — it moves there, with a fading trail behind it. Jumping across half the rail is what makes the highlight feel abrupt when you click around the outline.

**Default:** Travel to the new place

<a id="set-activelight"></a>**Current bar lights up**

«Right away» — the new current bar lights up at once, and the halo catches up. «With the halo» — the light travels to it together with the halo as one whole, with the same time and overshoot.

**Default:** Right away

<a id="set-activetraveltime"></a>**Travel time**

How long the highlight takes to get there, in milliseconds.

**Default:** 510

<a id="set-activeovershoot"></a>**Overshoot on arrival**

How far it swings past the destination before settling.

**Default:** 50

<a id="set-activetrail"></a>**Trail along the way**

How brightly the bars it passes light up. Zero leaves a plain move with nothing behind it.

**Default:** 100

<a id="settings-gl-halo"></a>

### Halo around the current bar

<a id="set-halomode"></a>**Halo around it**

The neighbours of the current bar, fading away from it.

**Default:** Always

<a id="set-glowcolor"></a>**Halo colour**

Colour of the halo. By default it follows the colour of the current heading.

**Default:** theme colour

<a id="set-halospan"></a>**Bars in the halo**

Always an odd number: the current bar and 9 on each side. Currently 19.

**Default:** 19

<a id="set-glowlift"></a>**Highlight brings bars forward**

How far the highlight pulls a bar towards full opacity, as a percentage. Without this the highlight was multiplied by the overall opacity and all but vanished, which made it look as though only the current bar ever lit up.

**Default:** 100

<a id="settings-halosteps"></a>

#### Brightness of each halo step

*How bright a bar is at each distance from the current one, as a percentage. Step one is its immediate neighbour, and the same values are used above and below.*

<a id="set-halos0"></a>**Step 1**

**Default:** 80

<a id="set-halos1"></a>**Step 2**

**Default:** 60

<a id="set-halos2"></a>**Step 3**

**Default:** 40

<a id="set-halos3"></a>**Step 4**

**Default:** 20

<a id="set-halos4"></a>**Step 5**

**Default:** 15

<a id="set-halos5"></a>**Step 6**

**Default:** 10

<a id="set-halos6"></a>**Step 7**

**Default:** 7

<a id="set-halos7"></a>**Step 8**

**Default:** 4

<a id="set-halos8"></a>**Step 9**

**Default:** 2

---

<a id="settings-scroll"></a>

## Note scrolling

<a id="settings-sc-jump"></a>

### Going to a section

<a id="set-scrollto"></a>**Where the heading lands**

When you jump to a heading from the rail or the outline, this is where it ends up on screen.

**Default:** Your own height

<a id="set-scrolltopct"></a>**Height on the screen, %**

Where the heading stops, counted from the top of the window: 0 — at the very top, 50 — in the middle. Around 30 feels like the middle to the eye.

**Default:** 30 % of note height

<a id="set-notesmooth"></a>**Note scrolling smoothness, ms**

How gently the note moves when you run along the bars (or hold a finger on the phone), hover, press a bar or an entry, turn the wheel over the bars or move the slider. No overshoot: when moving fast it lags a little and catches up. 0 — at once, no smoothing.

**Default:** 120

<a id="settings-sc-mouse"></a>

### Scrolling with the mouse over the bars

*Desktop only.*

<a id="set-hoverscrolls"></a>**Scroll on hover**

Move the document as the cursor passes over the bars, without clicking.

**Default:** Off · *Desktop only*

<a id="set-wheelboost"></a>**Wheel speed over the rail**

How many times faster the wheel or trackpad scrolls the note while the cursor is over the bars.

**Default:** 3 · *Desktop only*

<a id="settings-sc-sb"></a>

### Editor scrollbar

*Desktop only.*

<a id="set-scrollbarmode"></a>**Editor scrollbar**

Hidden — no scrollbar, the bars do its job. Standard — the usual Obsidian scrollbar, with the bars just to the left of it. Own — a thin scrollbar of the plugin at the very edge, after the bars, with its own settings.

**Default:** Own, at the edge · *Desktop only*

<a id="set-sbwidth"></a>**Scrollbar thickness**

**Default:** 7 · *Desktop only*

<a id="set-sbradius"></a>**Scrollbar rounding, px**

**Default:**  · *Desktop only*

<a id="set-sbedge"></a>**Distance from the edge**

**Default:** 0 · *Desktop only*

<a id="set-sbautohide"></a>**Hide when idle**

The bar appears while the note is scrolling or the cursor is over it, and fades away otherwise.

**Default:** On · *Desktop only*

<a id="settings-sc-sb-rest"></a>

#### Editor scrollbar at rest

*Desktop only.*

<a id="set-sbcolor"></a>**Scrollbar colour**

**Default:** theme colour · *Desktop only*

<a id="set-sbrestopacity"></a>**Brightness at rest**

**Default:** 8 · *Desktop only*

<a id="settings-sc-sb-hover"></a>

#### Editor scrollbar on hover

*Desktop only.*

<a id="set-sbhovercolor"></a>**Colour on hover**

**Default:** theme colour · *Desktop only*

<a id="set-sbhoveropacity"></a>**Brightness on hover**

**Default:** 100 · *Desktop only*

---

<a id="settings-list"></a>

## Outline

<a id="settings-o-how"></a>

### How the outline opens

<a id="set-openbutton"></a>**Open the outline with**

Usual way: the button in the note header, a right-click on the bars or holding Ctrl (⌘ Cmd) — the outline opens next to the bars. Floating button: a round button over the note that you can drag anywhere; the outline then opens only from it and right beside it, not next to the bars.

**Default:** Header button, right-click, Ctrl (⌘ Cmd) · on the phone: Header button, holding a finger

<a id="set-floattrigger"></a>**Floating button opens on**

Hover: the outline opens while the cursor is on the button or the outline, and a click pins it. Click only: nothing happens until you press.

**Default:** Hover, click to pin · *Desktop only*

<a id="set-hovergrace"></a>**Safe zone around the plugin**

An invisible margin around the bars, outline and menu — in pixels or in percent of the bars' width. While the cursor is inside it, nothing folds up, so you can reach far buttons without moving in a straight line. 0 — off.

**Default:** 30 pixels · *Desktop only*

<a id="settings-o-where"></a>

### Where the outline stands

<a id="set-outlineside"></a>**Where the outline stands**

Next to the bars, as before, or at the left or right edge of the note — then the bars and the outline can stand on opposite sides.

**Default:** Next to the bars

<a id="settings-o-w-rail"></a>

#### Outline offset from the bars

<a id="set-panelgapmode"></a>**Outline offset**

From the bars — the outline stands past the longest bar of this note at the wave peak plus the margin below. From the screen edge — at its own distance from the edge on the bars’ side, however far they stretch.

**Default:** From the bars: auto + value

<a id="set-paneledgegap"></a>**Distance from the screen edge**

Distance from the screen edge where the bars are to the outline. The bars do not affect it.

**Default:** 100 pixels

<a id="set-panelgapextra"></a>**Margin beyond the wave peak**

How far the outline stays from the longest bar at the peak of the wave, in pixels.

**Default:** 30

<a id="settings-o-w-edges"></a>

#### Outline offsets at the top and bottom

<a id="set-paneledgetop"></a>**Outline: space from the top edge, px**

Type a number: the outline never opens closer than this to the edge of the note. 0 — as before (within the bars; next to the floating button — 6 px).

**Default:** % of window height

<a id="set-paneledgebottom"></a>**Outline: space from the bottom edge, px**

Type a number: the outline never opens closer than this to the edge of the note. 0 — as before (within the bars; next to the floating button — 6 px).

**Default:** % of window height

<a id="settings-o-w-phone"></a>

#### Where the outline stands on the phone

*Phone only.*

<a id="set-mpanelanchor"></a>**Outline position on the phone**

Near the top — hangs down from the top margin. Near the bottom — rises from the bottom margin, useful when the top of the screen is covered by Obsidian’s bar. At the middle of the bars — the middle of the outline lines up with the middle of the bars themselves (not of the screen), but never goes past the margins.

**Default:** Near the top · *Phone only*

<a id="set-mpaneltop"></a>**Top margin**

Distance from the top edge of the note, in pixels. Raise it if Obsidian’s bar covers the search box.

**Default:** 15% · *Phone only*

<a id="set-mpanelbottom"></a>**Bottom margin**

Distance from the bottom edge of the note, in pixels — room for Obsidian’s toolbar.

**Default:** 112 pixels · *Phone only*

<a id="settings-ol-size"></a>

### Outline size

<a id="set-panelwidthmode"></a>**Outline width**

Your own width, or automatic: worked out once per note so the longest heading fits in full, together with its nesting indent. It never jumps while you scroll.

**Default:** Automatic

<a id="set-panelwidth"></a>**Smallest width**

**Default:** 21.4% · on the phone: 250 pixels

<a id="set-panelmaxshare"></a>**Automatic width is at most**

The limit as a percentage of the note width.

**Default:** 40 % of note width

<a id="set-panelwrap"></a>**Wrap long entries**

Long headings continue on the next line instead of being cut off.

**Default:** On

<a id="set-panelwidthresize"></a>**Width handle on the outline**

On the outline next to the bars — a handle at its far edge: drag it to change the width. Double-click the handle to go back to the width from the settings.

**Default:** On · *Desktop only*

<a id="settings-ol-window"></a>

### Outline window

<a id="set-uiradius"></a>**Corner rounding**

One value for everything the plugin draws: the preview card, the outline list and the search box.

**Default:** 24

<a id="settings-ol-bg"></a>

#### Outline window background

<a id="set-panelbg"></a>**Outline background**

**Default:** theme colour

<a id="set-panelfill"></a>**Background fill**

**Default:** Colour

<a id="set-panelimg"></a>**Image**

One of your images (section “Custom CSS, images and fonts”) or a new one from the device.

**Default:** — none —

<a id="set-panelimgop"></a>**Image visibility**

100 — the image as is; lower — the background colour lies on top so text stays readable.

**Default:** 60

<a id="set-panelimgpos"></a>**Anchor the image to**

Which part of the image stays put when the window changes size (centre by default).

**Default:** Centre

<a id="set-panelimgblur"></a>**Image blur**

Blurs the background image itself (0 — sharp). The blurred copy is made once, so it doesn't slow anything down.

**Default:** 0

<a id="set-panelimgfit"></a>**Fit**

**Default:** Fill (crop edges)

<a id="set-panelbgopacity"></a>**Background opacity of the outline, search and menu**

100 — solid background, even if the theme makes it transparent. Lower — the note shows through; add blur so the text behind does not mix with the text on top.

**Default:** 100

<a id="set-panelblur"></a>**Blur behind the outline, search and menu**

How strongly whatever lies behind is blurred, in pixels. Visible when the background is not fully opaque (or the theme makes it see-through). 0 — no blur.

**Default:** 60

<a id="settings-ol-grad"></a>

##### Outline background gradient

<a id="set-panelbg2"></a>**Second gradient colour**

**Default:** theme colour

<a id="set-panelgradtype"></a>**Gradient type**

**Default:** Linear

<a id="set-panelgradpos"></a>**Transition midpoint, %**

Where the colours meet: lower — more of the second colour, higher — more of the first.

**Default:** 50

<a id="set-panelgradsoft"></a>**Transition softness, %**

0 — a sharp border between the colours, 100 — the transition spans the whole area.

**Default:** 100

<a id="settings-ol-grad-op"></a>

##### Opacity of the outline gradient colours

<a id="set-panelgradop1"></a>**First colour opacity, %**

**Default:** 100

<a id="set-panelgradop2"></a>**Second colour opacity, %**

**Default:** 100

<a id="settings-ol-grad-c"></a>

##### Centre of the outline gradient

<a id="set-panelgradx"></a>**Centre horizontally, %**

Where the centre of the radial gradient is: 0 — the left (top) edge, 100 — the right (bottom); it may go past the edges.

**Default:** 50

<a id="set-panelgrady"></a>**Centre vertically, %**

**Default:** 50

<a id="settings-ol-grad-dir"></a>

##### Direction of the outline gradient

<a id="set-panelgradangle"></a>**Gradient angle, °**

**Default:** 135

<a id="settings-ol-shadow"></a>

#### Outline window glow

<a id="set-panelshadow"></a>**Glow around the outline**

A glow around the panel: set by hand, or off. Its colour can be automatic — see below.

**Default:** Set by hand

<a id="set-panelshadowsize"></a>**Glow radius**

**Default:** 30

<a id="set-panelshadowstrength"></a>**Glow strength**

**Default:** 7

<a id="set-panelshadowcolor"></a>**Glow colour**

The arrow makes the colour automatic: a dark shadow on a light theme and a soft light glow on a dark one, so the edge is always visible.

**Default:** #000000

<a id="settings-ol-shadow-h"></a>

##### Outline window glow on hover

*Desktop only.*

<a id="set-panelshadowhover"></a>**Glow on hover**

**Default:** Same as at rest · *Desktop only*

<a id="set-panelshadowsizeh"></a>**Glow radius**

**Default:** 36 · *Desktop only*

<a id="set-panelshadowstrengthh"></a>**Glow strength**

**Default:** 30 · *Desktop only*

<a id="set-panelshadowcolorh"></a>**Glow colour**

**Default:** theme colour · *Desktop only*

<a id="settings-ol-border"></a>

#### Outline window border

<a id="set-panelborderw"></a>**Outline window border thickness, px**

0 — no border.

**Default:** 1

<a id="set-panelbordercolor"></a>**Outline window border colour**

**Default:** theme colour

<a id="set-panelborderop"></a>**Outline window border opacity, %**

**Default:** 100

<a id="settings-ol-items"></a>

### Outline items

<a id="set-outlinedepth"></a>**Deepest heading in the outline**

Headings below this level are not listed in the outline.

**Default:** 6

<a id="settings-ol-text"></a>

#### Text of the outline items

<a id="set-olfont"></a>**Font of the outline items**

**Default:** As in the theme

<a id="set-ollineh"></a>**Line spacing of the items, %**

**Default:** 

<a id="set-paneltext"></a>**Outline text**

**Default:** theme colour

<a id="set-paneltextopacity"></a>**Item text opacity, %**

**Default:** 100

<a id="set-panelactivetext"></a>**Current entry**

**Default:** theme colour

<a id="set-panelactivetextopacity"></a>**Current item text opacity, %**

**Default:** 100

<a id="settings-ol-shape"></a>

#### Size and shape of the outline items

<a id="set-olpady"></a>**Item padding above and below, px**

**Default:** 

<a id="set-olradius"></a>**Rounding of the item highlight, px**

**Default:** 

<a id="settings-ol-fill"></a>

#### Fill of the outline items

<a id="settings-ol-f-hover"></a>

##### Item fill on hover

<a id="set-itemhovercolor"></a>**Fill on hover**

**Default:** theme colour

<a id="set-itemhoveropacity"></a>**Its opacity, %**

**Default:** 100

<a id="set-olhovertext"></a>**Item text colour on hover**

**Default:** theme colour · *Desktop only*

<a id="settings-ol-f-cur"></a>

##### Fill of the current item

<a id="set-itemcurcolor"></a>**Fill of the current entry**

**Default:** theme colour

<a id="set-itemcuropacity"></a>**Its opacity, %**

**Default:** 0

<a id="settings-ol-f-sel"></a>

##### Fill of the selected item

<a id="set-itemselcolor"></a>**Fill of selected**

**Default:** theme colour

<a id="set-itemselopacity"></a>**Its opacity, %**

Sections selected with the right mouse button or with Shift. By default the colour is the same as on hover.

**Default:** 100

<a id="settings-ol-levels"></a>

#### Items by heading level

<a id="set-olbop"></a>**Brightness of the item backgrounds by level, %**

The item background is set for each level below; this brightness is shared by all of them.

**Default:** 15

<a id="settings-ol-lv1"></a>

##### Items of H1 headings

*Your own look for the headings of each level in the outline. Anything not set stays as it was: common colour, size and weight 0 — the usual ones.*

<a id="set-olc1"></a>**Colour**

**Default:** theme colour

<a id="set-olo1"></a>**Opacity, %**

**Default:** 100

<a id="set-ols1"></a>**Size, px**

0 — the usual size; weight 0 — the usual weight too.

**Default:** 0

<a id="set-olw1"></a>**Weight**

**Default:** 0

<a id="set-olb1"></a>**H1 — item background**

**Default:** theme colour

<a id="settings-ol-lv2"></a>

##### Items of H2 headings

<a id="set-olc2"></a>**Colour**

**Default:** theme colour

<a id="set-olo2"></a>**Opacity, %**

**Default:** 100

<a id="set-ols2"></a>**Size, px**

**Default:** 0

<a id="set-olw2"></a>**Weight**

**Default:** 0

<a id="set-olb2"></a>**H2 — item background**

**Default:** theme colour

<a id="settings-ol-lv3"></a>

##### Items of H3 headings

<a id="set-olc3"></a>**Colour**

**Default:** theme colour

<a id="set-olo3"></a>**Opacity, %**

**Default:** 100

<a id="set-ols3"></a>**Size, px**

**Default:** 0

<a id="set-olw3"></a>**Weight**

**Default:** 0

<a id="set-olb3"></a>**H3 — item background**

**Default:** theme colour

<a id="settings-ol-lv4"></a>

##### Items of H4 headings

<a id="set-olc4"></a>**Colour**

**Default:** theme colour

<a id="set-olo4"></a>**Opacity, %**

**Default:** 100

<a id="set-ols4"></a>**Size, px**

**Default:** 0

<a id="set-olw4"></a>**Weight**

**Default:** 0

<a id="set-olb4"></a>**H4 — item background**

**Default:** theme colour

<a id="settings-ol-lv5"></a>

##### Items of H5 headings

<a id="set-olc5"></a>**Colour**

**Default:** theme colour

<a id="set-olo5"></a>**Opacity, %**

**Default:** 100

<a id="set-ols5"></a>**Size, px**

**Default:** 0

<a id="set-olw5"></a>**Weight**

**Default:** 0

<a id="set-olb5"></a>**H5 — item background**

**Default:** theme colour

<a id="settings-ol-lv6"></a>

##### Items of H6 headings

<a id="set-olc6"></a>**Colour**

**Default:** theme colour

<a id="set-olo6"></a>**Opacity, %**

**Default:** 100

<a id="set-ols6"></a>**Size, px**

**Default:** 0

<a id="set-olw6"></a>**Weight**

**Default:** 0

<a id="set-olb6"></a>**H6 — item background**

**Default:** theme colour

<a id="settings-ol-guides"></a>

### Nesting lines in the outline

<a id="set-guides"></a>**Nesting lines**

Vertical lines showing which section each entry belongs to, as in code editors.

**Default:** On

<a id="set-guidecolor"></a>**Line colour**

**Default:** theme colour

<a id="set-guideopacity"></a>**Nesting line opacity, %**

**Default:** 20

<a id="set-guidethick"></a>**Line thickness**

**Default:** 0.5

<a id="set-guidegap"></a>**Indent between levels**

Also sets how far each level of the outline is indented.

**Default:** 20

<a id="set-guideperlevel"></a>**Set each level separately**

Its own thickness and indent for every heading level.

**Default:** Off

<a id="settings-guidelevels"></a>

#### Nesting lines of each level

<a id="set-guidet1"></a>**Level 1 — thickness**

**Default:** 1

<a id="set-guideg1"></a>**Level 1 — indent**

**Default:** 12

<a id="set-guideo1"></a>**Level 1 — opacity**

**Default:** 45

<a id="set-guidet2"></a>**Level 2 — thickness**

**Default:** 1

<a id="set-guideg2"></a>**Level 2 — indent**

**Default:** 12

<a id="set-guideo2"></a>**Level 2 — opacity**

**Default:** 35

<a id="set-guidet3"></a>**Level 3 — thickness**

**Default:** 1

<a id="set-guideg3"></a>**Level 3 — indent**

**Default:** 12

<a id="set-guideo3"></a>**Level 3 — opacity**

**Default:** 35

<a id="set-guidet4"></a>**Level 4 — thickness**

**Default:** 1

<a id="set-guideg4"></a>**Level 4 — indent**

**Default:** 12

<a id="set-guideo4"></a>**Level 4 — opacity**

**Default:** 35

<a id="set-guidet5"></a>**Level 5 — thickness**

**Default:** 1

<a id="set-guideg5"></a>**Level 5 — indent**

**Default:** 12

<a id="set-guideo5"></a>**Level 5 — opacity**

**Default:** 35

<a id="settings-ol-fold"></a>

### Folding sections in the outline

<a id="set-outlinefold"></a>**Fold sections in the outline**

Arrows beside entries that have subsections. The bars always show everything.

**Default:** On

<a id="set-foldsync"></a>**Fold together with the note**

Folding a section in the outline folds it in the note, and the other way round. Works in the editor; reading view has its own folding.

**Default:** On

<a id="set-foldjump"></a>**Jumping into a folded section**

When the section you jump to is hidden inside one folded in the note.

**Default:** Unfold it and go straight there

<a id="settings-ol-scroll"></a>

### Scrolling the outline list

<a id="set-outlinesmooth"></a>**Outline scrolling smoothness, ms**

How long the outline takes to glide to where it needs to be — when it follows the note, on the mouse wheel and on the “back to the current section” arrow. When scrolling fast it lags a little behind the centre, but the current entry never leaves the view and catches up once everything stops. No overshoot. 0 — instantly.

**Default:** 220

<a id="set-outlinefollowwheel"></a>**Outline follows the wheel**

While the outline is open and you turn the wheel over the bars, the outline scrolls too, keeping the current section in the middle.

**Default:** On · *Desktop only*

<a id="settings-ol-sb"></a>

#### Outline scrollbar

<a id="set-olsbmode"></a>**Outline scrollbar**

The scrollbar inside the outline list: a thin one of its own that brightens on hover, the theme’s standard one, or none.

**Default:** Thin, brighter on hover · *Desktop only*

<a id="set-olsbwidth"></a>**Scrollbar thickness**

**Default:** 2 · *Desktop only*

<a id="set-olsbradius"></a>**Outline scrollbar rounding, px**

**Default:** 

<a id="set-olsbautohide"></a>**Hide the scrollbar until the cursor is on the list**

**Default:** Off · *Desktop only*

<a id="settings-ol-sb-rest"></a>

##### Outline scrollbar at rest

*Desktop only.*

<a id="set-olsbcolor"></a>**Scrollbar colour**

**Default:** #c7c8e1 · *Desktop only*

<a id="set-olsbrestopacity"></a>**Brightness at rest**

**Default:** 12 · *Desktop only*

<a id="settings-ol-sb-hover"></a>

##### Outline scrollbar on hover

*Desktop only.*

<a id="set-olsbhovercolor"></a>**Colour on hover**

**Default:** theme colour · *Desktop only*

<a id="set-olsbhoveropacity"></a>**Brightness on hover**

**Default:** 42 · *Desktop only*

<a id="settings-m-marks"></a>

### Marks next to outline items

<a id="settings-m-all"></a>

#### Common to all marks

<a id="set-marksize"></a>**Mark size**

Height of every mark next to an outline item — tasks, pin, folded contents — in pixels. All marks are the same size.

**Default:** 18

<a id="set-taskradius"></a>**Mark rounding**

Rounding of all marks next to items, in pixels: 0 — square, half the mark size — round.

**Default:** 13

<a id="set-markinkopacity"></a>**Mark text, icon and border opacity, %**

Applies to every mark — tasks, pinned, folded section: everything except the fill, which has its own opacity.

**Default:** 100

<a id="settings-m-a-text"></a>

##### Mark text and glow

<a id="set-markfont"></a>**Mark font**

Numbers and signs in the task, pin and folded-section marks. “As the theme” — the same font as the outline.

**Default:** As in the theme

<a id="set-markweight"></a>**Mark text weight**

0 — as the theme sets it; 400 — regular, 600 — semi-bold, 700 — bold.

**Default:** 0

<a id="set-markglow"></a>**Mark glow**

**Default:** theme colour

<a id="set-markglowsize"></a>**Mark glow size, px**

**Default:** 0

<a id="settings-m-wc"></a>

#### Word count mark

<a id="set-wordcount"></a>**Word count**

Shows how many words each section has, subsections included — beside each entry and in the preview.

**Default:** On

<a id="set-wcsize"></a>**Word count size**

**Default:** 9

<a id="set-wcopacity"></a>**Word count brightness**

How visible the numbers next to the outline items are.

**Default:** 43

<a id="set-wccolor"></a>**Word count colour**

**Default:** theme colour

<a id="set-wcgap"></a>**Word count spacing**

Gap between the word count and the other marks, in pixels. The numbers stand in a column of equal width, so 1 and 1 000 never shift their neighbours.

**Default:** 6 pixels

<a id="settings-m-tasks"></a>

#### Tasks mark

<a id="set-taskmarks"></a>**Open tasks**

A small number next to outline items: how many unchecked tasks “- [ ]” the section has — in the section itself, or together with its subsections.

**Default:** With subsections

<a id="set-taskcount"></a>**What the task mark shows**

Open tasks only (“7”), done out of all (“4/11”), or open out of all (“7/11”). In the “out of all” modes a section with tasks always has a mark, even when everything is done.

**Default:** Done out of all

<a id="settings-m-t-look"></a>

##### Look of the tasks mark

<a id="set-taskfill"></a>**Fill colour**

**Default:** theme colour

<a id="set-taskfillopacity"></a>**Fill opacity**

0 — no fill at all, only the border and the number remain.

**Default:** 0

<a id="set-tasktext"></a>**Number colour**

**Default:** theme colour

<a id="set-taskborder"></a>**Border colour**

**Default:** theme colour

<a id="set-taskborderwidth"></a>**Border thickness**

**Default:** 0.1

<a id="settings-m-pins"></a>

#### Pin mark

<a id="set-bmlist"></a>**Pinned list**

Pinned sections are listed at the top of the outline — click one to jump there. The list appears only when the note has pinned sections. Sections are pinned from the actions menu. To unpin, hold the cursor on the pin icon or on its entry in the list — a bin and a red outline appear — and click. The commands “Go to the next / previous pinned section” can get hotkeys.

**Default:** On

<a id="set-unpinholdms"></a>**Hold to unpin, ms**

How long after pointing at a pin mark or a pinned entry the unpin button appears next to it. A click on the entry itself always takes you there; you can also unpin with the Delete key while the cursor is on the entry.

**Default:** 1000

<a id="settings-m-p-look"></a>

##### Look of the pin mark

<a id="set-bmcolor"></a>**Pin icon colour**

Colour of the pin icon next to an outline item. By default — the muted text colour of the theme.

**Default:** theme colour

<a id="set-bmstyle"></a>**Pin icon style**

**Default:** Outline only

<a id="set-bmfill"></a>**Fill colour**

**Default:** theme colour

<a id="set-bmfillopacity"></a>**Fill opacity**

**Default:** 0

<a id="set-bmborder"></a>**Border colour**

**Default:** theme colour

<a id="set-bmborderwidth"></a>**Border thickness**

**Default:** 1

<a id="settings-m-p-chips"></a>

##### Pinned at the top of the list

<a id="set-bmchipbg"></a>**Pinned entries background**

**Default:** theme colour

<a id="set-bmchipbgopacity"></a>**Pinned entries background opacity, %**

**Default:** 100

<a id="set-bmchiptext"></a>**Pinned entries text**

**Default:** theme colour

<a id="set-bmchipborder"></a>**Pinned entries border**

**Default:** theme colour

<a id="set-bmxcolor"></a>**Unpin cross**

**Default:** theme colour

<a id="settings-m-fold"></a>

#### Folded section mark

<a id="set-foldcount"></a>**What is inside a folded section**

Next to a folded section: how many headings of the highest level it has inside, for example “H3 × 4”.

**Default:** On

<a id="settings-m-f-look"></a>

##### Look of the folded section mark

<a id="set-foldfill"></a>**Fill colour**

**Default:** theme colour

<a id="set-foldfillopacity"></a>**Fill opacity**

0 — no fill at all, only the border and the number remain.

**Default:** 0

<a id="set-foldtext"></a>**Number colour**

**Default:** theme colour

<a id="set-foldborder"></a>**Border colour**

**Default:** theme colour

<a id="set-foldborderwidth"></a>**Border thickness**

**Default:** 1

*Small marks to the right of an outline item. The first part is shared by all of them; below — each mark separately.*

<a id="settings-a-actions"></a>

### Section actions

<a id="settings-a-menu"></a>

#### Actions menu

<a id="set-menuplace"></a>**Actions menu**

Where copy, delete and level buttons appear: beside the outline (where there is room), or as a separate block above or below it, like the search box — the outline makes room for it instead of being covered.

**Default:** Beside the outline · *Desktop only*

<a id="set-menusidemode"></a>**Menu beside the outline**

Main buttons plus a “⋯” button that opens a list of the rest — or one strip with every action that scrolls sideways (the main ones come first).

**Default:** Main + “⋯” list · *Desktop only*

<a id="set-menusideicons"></a>**Side menu buttons as icons**

Icons with a tooltip instead of words (“Copy”, “Delete”). The menu gets shorter and covers less text.

**Default:** Off · *Desktop only*

<a id="set-menusidewidth"></a>**Length of the side strip**

In pixels. 0 — the strip takes as much as fits next to the outline. It never grows wider than the free space.

**Default:** 0 pixels · *Desktop only*

<a id="set-menuscroll"></a>**Scrolling the strip**

How the side strip scrolls: with the mouse wheel (any wheel direction moves it sideways), with the ‹ › buttons at its ends, or both. The buttons appear only when not everything fits.

**Default:** Both · *Desktop only*

<a id="set-menucolmode"></a>**Menu above / below: look**

Rows — the main actions in one or two rows, and “⋯” opens the rest beside the outline. Icons — every action as a short icon button; hold the cursor on one to see its name.

**Default:** Icons only

<a id="settings-a-m-look"></a>

##### Look of the actions menu

<a id="set-menubg"></a>**Actions menu background**

**Default:** theme colour

<a id="set-menubgop"></a>**Actions menu background opacity, %**

**Default:** 100

<a id="set-menuradius"></a>**Actions menu rounding, px**

**Default:** 

<a id="settings-a-m-btns"></a>

##### Look of the actions menu buttons

<a id="set-menubtnbg"></a>**Actions menu button background**

**Default:** theme colour

<a id="set-menubtnbgop"></a>**Menu button background opacity, %**

**Default:** 100

<a id="set-menubtntext"></a>**Text and icon colour of the menu buttons**

**Default:** theme colour

<a id="set-menubtnradius"></a>**Menu button rounding, px**

**Default:** 

<a id="settings-a-m-btns-h"></a>

##### Menu buttons on hover

*Desktop only.*

<a id="set-menubtnbgh"></a>**Menu button background on hover**

**Default:** theme colour · *Desktop only*

<a id="set-menubtnbghop"></a>**Menu button background opacity on hover, %**

**Default:** 100 · *Desktop only*

<a id="set-menubtntexth"></a>**Menu button text and icon colour on hover**

**Default:** theme colour · *Desktop only*

<a id="settings-a-m-glow"></a>

##### Glow of the actions menu

<a id="set-menushadow"></a>**Glow of the actions menu**

A glow around the panel: set by hand, or off. Its colour can be automatic — see below.

**Default:** The usual menu shadow

<a id="settings-a-m-glow-h"></a>

##### Glow of the actions menu on hover

*Desktop only.*

<a id="set-menushadowhover"></a>**Glow on hover**

**Default:** Same as at rest · *Desktop only*

<a id="settings-a-m-anim"></a>

##### Appearance of the actions menu

<a id="set-colmenuanim"></a>**How the menu above / below appears**

For the actions menu above or below the outline. «Pushes the outline aside»: the border between the outline and the menu slides smoothly from the edge — the menu grows exactly as much as the outline shrinks, in one movement, only in height. Closing is the same movement in reverse.

**Default:** Pushes the outline aside

<a id="set-colmenuanimms"></a>**Appearance time, ms**

0 — the same time and smoothness as the outline itself appearing. Any other value — its own time.

**Default:** 1500

<a id="set-menuanim"></a>**How the actions strip appears**

For the actions beside the outline: slides out from behind the outline, from the top, from the bottom, grows out of the centre, or appears at once.

**Default:** From the centre · *Desktop only*

<a id="set-menuanimlevel"></a>**Effect strength**

How noticeable the appearance is: 0 — it simply fades in, 3 — calm (default), 10 — slides in from far away or grows from almost nothing. The time sets only the speed.

**Default:** 3 · *Desktop only*

<a id="set-menuanimms"></a>**Appearance time, ms**

**Default:** 140 · *Desktop only*

<a id="settings-actions"></a>

##### Actions menu buttons

*For each action: always visible, in the second row (the “⋯” list, or further along the side strip), or not shown at all. With the icon-only menu everything that is not hidden is shown. Cancel is always there.*

<a id="set-actlevel"></a>**Heading level arrows**

**Default:** Always visible

<a id="set-actrename"></a>**Rename**

**Default:** Second row (“⋯”)

<a id="set-actbookmark"></a>**Pin**

**Default:** Second row (“⋯”)

<a id="set-actlink"></a>**Copy link**

**Default:** Second row (“⋯”)

<a id="set-actcopy"></a>**Copy**

**Default:** Always visible

<a id="set-actduplicate"></a>**Duplicate**

**Default:** Second row (“⋯”)

<a id="set-actextract"></a>**To a new note**

**Default:** Second row (“⋯”)

<a id="set-actdelete"></a>**Delete**

**Default:** Always visible

<a id="settings-a-drag"></a>

#### Moving sections

<a id="set-dragsections"></a>**Drag sections**

Grab an outline item with the mouse and drop it elsewhere: the whole section moves with its text and subsections. A line shows where it will land.

**Default:** On

<a id="set-dropinto"></a>**Dropped onto an item**

Drop a section right onto an outline item and it becomes its subsection. Where exactly: at the start (right under its own text) or at the end.

**Default:** At the end

<a id="set-droplevel"></a>**Dropped between items**

Drop a section on the line between two items and it stands next to them: it never ends up inside the item above and never takes the item below as its own. The line is indented to the level the section will get. “Keep the level” changes it only when otherwise one of those two things would happen.

**Default:** Keep the level

<a id="set-kbmovekey"></a>**Key for moving a section with the arrows**

When a section is selected (its actions menu is open), ↑ and ↓ change its level. Hold this key together with the arrows to move the whole section up or down past its neighbour. At the edge of its parent section it moves on into the previous or next section; the level changes only if it has to.

**Default:** Alt (⌥ Option) or right Shift · *Desktop only*

<a id="settings-a-d-colour"></a>

##### Colour of moving and of the slider

<a id="set-movecolor"></a>**Colour**

One colour for everything related to moving sections: the line and frame while dragging, the flash of a section after it is moved or changed, and the Ctrl (⌘ Cmd) slider. Only the transparency differs.

**Default:** theme colour

<a id="set-flashopacity"></a>**Flash of a moved section, %**

After a section is moved or its level is changed, its entry in the outline briefly lights up in this colour, so you can see where it went. This is how bright that flash is.

**Default:** 20

<a id="set-dropintoopacity"></a>**Fill of the entry you drop into, %**

While you drag a section over another entry to put it inside, that entry is filled with this colour. This is how strong the fill is.

**Default:** 20

<a id="settings-sl-slide"></a>

### Slider inside a section (Ctrl (⌘ Cmd) + hover)

*Desktop only.*

<a id="set-ctrlslide"></a>**Slider inside a section**

Hold Ctrl (⌘ Cmd) and hover an outline item: instead of the whole item, only the part to the left of the cursor fills up, like a battery level. Move left and right to adjust; a click takes you to the same share of the section (a click in the middle — to the middle of the section, subsections included). Dots on the top edge are the scale. Hold the left button as well and move — the note follows smoothly.

**Default:** On · *Desktop only*

<a id="settings-sl-how"></a>

#### How the slider works

*Desktop only.*

*The colour and brightness are in “Colour of moving and of the slider”. Hold Ctrl (⌘ Cmd) and the left mouse button on an item and move left and right — the note follows smoothly.*

<a id="set-ctrlslideshow"></a>**When the slider shows**

With Ctrl (⌘ Cmd) — only while Ctrl is held. On every hover — always when pointing at an entry; then a plain click already lands at that point of the section.

**Default:** With Ctrl (⌘ Cmd) · *Desktop only*

<a id="set-ctrlslidemove"></a>**Moving the note along**

Ctrl (⌘ Cmd) + mouse button — the note follows the cursor while the button is held. Just Ctrl — the note follows the cursor as soon as Ctrl is held, no button needed; let go of Ctrl or leave the outline to stop.

**Default:** Ctrl (⌘ Cmd) + mouse button · *Desktop only*

<a id="set-ctrlslidemagnet"></a>**Snap to the dots, px**

Near a dot of the scale the slider jumps exactly onto it. How close the cursor has to be, in pixels. 0 — no snapping.

**Default:** 3 · *Desktop only*

<a id="set-ctrlslideswitchms"></a>**Moving to another section, ms**

While you drag with Ctrl (⌘ Cmd) and the mouse button held, you can move up or down to another item: the note glides to the same share of that section. How long the glide takes; 0 — instantly.

**Default:** 350 · *Desktop only*

<a id="settings-sl-wheel"></a>

#### Mouse wheel and touchpad over the slider

*Desktop only.*

<a id="set-ctrlwheel"></a>**Ctrl (⌘ Cmd) + wheel over an entry**

While Ctrl (⌘ Cmd) is held, the wheel moves the point inside the section by the marks of the scale. Straight away — the note goes there at once. Mark only — just the slider moves; click the entry (anywhere on it) to go there.

**Default:** Scroll the note straight away · *Desktop only*

<a id="set-ctrlwheelinvert"></a>**Invert the mouse wheel**

Wheel up moves the point to the right (further into the section), wheel down — to the left.

**Default:** On · *Desktop only*

<a id="set-ctrlpadinvert"></a>**Invert the touchpad**

Separately from the mouse wheel: a touchpad gesture moves the point the other way.

**Default:** On · *Desktop only*

<a id="settings-sl-look"></a>

#### Look of the slider

*Desktop only.*

<a id="set-ctrlslideopacity"></a>**Fill of the slider, %**

How strong the fill of the slider inside an entry is. When it is strong, the dots under it turn white (or dark grey on a light colour) so they stay visible.

**Default:** 15 · *Desktop only*

<a id="set-ctrlslidesubfill"></a>**Fill subsections too**

While the slider moves through a large section, its subsections are filled as well: the ones already passed — completely, the one you are in now — to its share. Nested subsections work the same way, each within its own bounds.

**Default:** On · *Desktop only*

<a id="set-ctrlslidedots"></a>**Dots on the top edge**

How many scale dots. You see all of them to the left of the cursor and the nearest one to the right. 0 — no dots.

**Default:** 10 · *Desktop only*

<a id="set-ctrlslidefillanim"></a>**Fill grows from the left**

When Ctrl (⌘ Cmd) is pressed while the cursor is already inside an item, and when you move to the next item, the fill grows smoothly from the left edge to its place instead of jumping. «With the note» — at the same speed as the note scrolls, so they move together.

**Default:** With the note · *Desktop only*

<a id="set-ctrlslidefillms"></a>**Appearance time, ms**

**Default:** 300 · *Desktop only*

---

<a id="settings-float"></a>

## Floating button

<a id="settings-f-look"></a>

### Look of the floating button

<a id="set-button-position"></a>**Button position**

The button can be dragged. Put it where you like and press “Pin here” — it will stay there.

<a id="set-floathomex"></a>**Button position: across**

Where the button stands until you drag it: 0 is the left (top) edge of the note, 100 the right (bottom). Once dragged, it stays where you put it.

**Default:** 90

<a id="set-floathomey"></a>**Button position: down**

**Default:** 85

<a id="settings-f-l-size"></a>

#### Size and shape of the floating button

<a id="set-floatsize"></a>**Button size**

0 — automatic: the same height as the outline search box, so the two look like a pair.

**Default:** 0 pixels

<a id="set-floaticonsize"></a>**Icon size**

**Default:** 22

<a id="set-floatradius"></a>**Rounding**

50 — a circle, 0 — a square.

**Default:** 50

<a id="set-floatborder"></a>**Border**

**Default:** On

<a id="set-floatborderw"></a>**Button border thickness, px**

**Default:** 1

<a id="set-floatbordercolor"></a>**Button border colour**

**Default:** theme colour

<a id="settings-f-l-bg"></a>

#### Floating button background

<a id="set-floatbg"></a>**Background colour**

**Default:** theme colour

<a id="set-floatfill"></a>**Background fill**

**Default:** Colour

<a id="set-floatimg"></a>**Image**

One of your images (section “Custom CSS, images and fonts”) or a new one from the device.

**Default:** — none —

<a id="set-floatimgop"></a>**Image visibility**

100 — the image as is; lower — the background colour lies on top so text stays readable.

**Default:** 60

<a id="set-floatimgpos"></a>**Anchor the image to**

Which part of the image stays put when the window changes size (centre by default).

**Default:** Centre

<a id="set-floatimgblur"></a>**Image blur**

Blurs the background image itself (0 — sharp). The blurred copy is made once, so it doesn't slow anything down.

**Default:** 0

<a id="set-floatimgfit"></a>**Fit**

**Default:** Fill (crop edges)

<a id="settings-f-l-grad"></a>

##### Button background gradient

<a id="set-floatbg2"></a>**Second gradient colour**

**Default:** theme colour

<a id="set-floatgradtype"></a>**Gradient type**

**Default:** Linear

<a id="set-floatgradpos"></a>**Transition midpoint, %**

Where the colours meet: lower — more of the second colour, higher — more of the first.

**Default:** 50

<a id="set-floatgradsoft"></a>**Transition softness, %**

0 — a sharp border between the colours, 100 — the transition spans the whole area.

**Default:** 100

<a id="settings-f-l-grad-op"></a>

##### Opacity of the button gradient colours

<a id="set-floatgradop1"></a>**First colour opacity, %**

**Default:** 100

<a id="set-floatgradop2"></a>**Second colour opacity, %**

**Default:** 100

<a id="settings-f-l-grad-dir"></a>

##### Direction of the button gradient

<a id="set-floatgradangle"></a>**Gradient angle, °**

**Default:** 135

<a id="settings-f-l-icon"></a>

#### Button icon and opacity

<a id="set-floaticoncolor"></a>**Icon colour**

**Default:** theme colour

<a id="set-floatopacity"></a>**Opacity at rest**

**Default:** 65 · on the phone: 100

<a id="settings-f-l-hover"></a>

##### Floating button on hover

*Desktop only.*

<a id="set-floatbghover"></a>**Background on hover**

**Default:** theme colour · *Desktop only*

<a id="set-floaticoncolorhover"></a>**Icon colour on hover**

**Default:** theme colour · *Desktop only*

<a id="set-floathoveropacity"></a>**Opacity on hover**

**Default:** 100 · *Desktop only*

<a id="settings-f-l-on"></a>

##### While the outline is open

<a id="set-floaticoncoloron"></a>**Icon while the outline is open**

**Default:** theme colour

<a id="set-floatborderon"></a>**Thin border while the outline is open**

**Default:** theme colour

<a id="settings-f-l-shadow"></a>

#### Floating button glow

<a id="set-floatshadow"></a>**Shadow**

Glow around the search field and its button. By default it is the same as the outline's, but it can be set separately or turned off. The glows of the search, the outline and the menu never lie on top of each other.

<a id="set-floatshadowsize"></a>**Glow radius**

**Default:** 28

<a id="set-floatshadowstrength"></a>**Glow strength**

**Default:** 11

<a id="set-floatshadowcolor"></a>**Glow colour**

The arrow makes the colour automatic: a dark shadow on a light theme and a soft light glow on a dark one, so the edge is always visible.

**Default:** #000000

<a id="settings-f-l-shadow-h"></a>

##### Button glow on hover

*Desktop only.*

<a id="set-floatshadowhover"></a>**Glow on hover**

**Default:** Same as at rest · *Desktop only*

<a id="settings-f-win"></a>

### Outline window at the button

<a id="set-floatplace"></a>**Where the outline opens**

Relative to the floating button. Where there is more room — beside it if it fits, otherwise above or below (on a narrow screen it may jump between the two). Beside — always to the left or right. Above / below — always over or under the button.

**Default:** Left / right of the button · on the phone: Above / below the button

<a id="set-floatzoom"></a>**Outline size at the button**

The whole outline — text, icons, spacing — proportionally smaller or larger, %. On a phone 70–80 % is comfortable.

**Default:** 100

*On the Mobile tab:* *On the phone there is no side width handle: a sideways swipe near the window edge is taken almost at once by the system gesture, so it worked only now and then. This is a limit of the phone, not a bug. Change the width with the corner.*

<a id="set-floatgap"></a>**Distance from the button**

Gap between the button and the outline — one value for every side. 0 — the same as between the search and the outline.

**Default:** 0

<a id="set-floatanim"></a>**How the outline appears**

Instantly — just appears next to the button. Grows — expands out of the button.

**Default:** Grows

<a id="set-floatanimms"></a>**Animation time**

In milliseconds. Longer is smoother and slower.

**Default:** 1199

<a id="settings-f-resize"></a>

### Resize handles of the outline window

<a id="set-floatresize"></a>**Resize by dragging a corner**

A corner bracket appears near the corner of the outline that is farthest from the button (on the phone — whenever the outline is open). Drag it: the whole outline grows or shrinks proportionally — text, icons, spacing — keeping its shape. Your size and font settings keep working; the drag only multiplies them. The arrow resets the size.

<a id="set-floatheightresize"></a>**Height — drag the far edge**

A short bar in the middle of the outline edge that is farthest from the button (top or bottom). Drag it to make the outline taller or shorter — this changes its proportions; the edge next to the button stays put. When it appears is set below. The arrow resets the height.

<a id="set-floatheightshow"></a>**When the height bar appears**

By the number of items that are visible in the outline right now (items inside a folded section do not count; unfold it — they count). Or only when the list scrolls, or always.

**Default:** Always

<a id="set-floatwidthresize"></a>**Width — drag the side edge**

A short bar in the middle of the outline's side edge that is farthest from the button. Drag it to make the outline wider or narrower; the edge next to the button stays put. The arrow resets the width.

*Desktop only*

<a id="settings-f-r-look"></a>

#### Look of the resize handles

<a id="set-floatresizecolor"></a>**Colour of the size handles**

**Default:** theme colour

<a id="set-floatresizethick"></a>**Thickness**

**Default:** 1.5

<a id="set-floatresizegap"></a>**Distance from the outline**

How far the corner and the bar stand from the edge of the outline, in pixels.

**Default:** 7

<a id="set-floatresizelen"></a>**Corner length**

Length of each side, counted from the middle of the corner, in pixels. Small values leave just a short piece of the curve at the corner.

**Default:** 20 pixels

<a id="set-floatheightlen"></a>**Bar length**

**Default:** 46 pixels

<a id="set-floatwidthlen"></a>**Side bar length**

**Default:** 46

<a id="set-resizeanim"></a>**How the corner and the bar appear**

Fade in — they simply appear; From the centre — they grow out of their middle. The time is below.

**Default:** Fade in

<a id="set-resizeanimms"></a>**Appearance time, ms**

**Default:** 160

---

<a id="settings-search"></a>

## Search

<a id="settings-s-field"></a>

### Search box

<a id="set-search-field"></a>**Search field**

Show a search box next to the expanded structure.

**Default:** On

<a id="set-search-at-bottom"></a>**Search at bottom**

Swap places: search below the structure, structure on top.

**Default:** Off

<a id="set-searchheight"></a>**Search box height, px**

0 — automatic: as tall as the floating button of the outline (32 on the desktop, 36 on the phone if that is not set either). The search mode button grows with it and the text field gets narrower.

**Default:** 40 pixels

<a id="settings-s-f-text"></a>

#### Text of the search box

<a id="set-searchfont"></a>**Search box font**

**Default:** As in the theme

<a id="set-searchtext"></a>**Text colour in the search box**

**Default:** theme colour

<a id="set-searchph"></a>**Placeholder colour in the empty search box**

The “Search structure” label shown while nothing is typed.

**Default:** theme colour

<a id="settings-s-f-bg"></a>

#### Search box background

<a id="set-searchfill"></a>**Search box background**

**Default:** Same as the outline

<a id="set-searchbg"></a>**First colour**

**Default:** theme colour

<a id="set-searchimg"></a>**Image**

One of your images (section “Custom CSS, images and fonts”) or a new one from the device.

**Default:** — none —

<a id="set-searchimgop"></a>**Image visibility**

100 — the image as is; lower — the background colour lies on top so text stays readable.

**Default:** 60

<a id="set-searchimgpos"></a>**Anchor the image to**

Which part of the image stays put when the window changes size (centre by default).

**Default:** Centre

<a id="set-searchimgblur"></a>**Image blur**

Blurs the background image itself (0 — sharp). The blurred copy is made once, so it doesn't slow anything down.

**Default:** 0

<a id="set-searchimgfit"></a>**Fit**

**Default:** Fill (crop edges)

<a id="settings-s-f-grad"></a>

##### Search background gradient

<a id="set-searchbg2"></a>**Second gradient colour**

**Default:** theme colour

<a id="set-searchgradtype"></a>**Gradient type**

**Default:** Linear

<a id="set-searchgradpos"></a>**Transition midpoint, %**

Where the colours meet: lower — more of the second colour, higher — more of the first.

**Default:** 50

<a id="set-searchgradsoft"></a>**Transition softness, %**

0 — a sharp border between the colours, 100 — the transition spans the whole area.

**Default:** 100

<a id="settings-s-f-grad-op"></a>

##### Opacity of the search gradient colours

<a id="set-searchgradop1"></a>**First colour opacity, %**

**Default:** 100

<a id="set-searchgradop2"></a>**Second colour opacity, %**

**Default:** 100

<a id="settings-s-f-grad-dir"></a>

##### Direction of the search gradient

<a id="set-searchgradangle"></a>**Gradient angle, °**

**Default:** 135

<a id="settings-s-f-border"></a>

#### Search box border

<a id="set-sbborderwidth"></a>**Search border thickness**

**Default:** 1

<a id="settings-s-f-b-rest"></a>

##### Search border at rest

<a id="set-sbbordercolor"></a>**Search border colour**

**Default:** theme colour

<a id="set-sbborderopacity"></a>**Search border opacity, %**

**Default:** 24

<a id="settings-s-f-b-hover"></a>

##### Search border on hover

*Desktop only.*

<a id="set-sbborderhovercolor"></a>**Search border colour on hover**

**Default:** theme colour · *Desktop only*

<a id="set-sbborderhoveropacity"></a>**Search border opacity on hover, %**

**Default:** 45 · *Desktop only*

<a id="settings-s-f-b-on"></a>

##### Border while searching the text

<a id="set-sbborderoncolor"></a>**Search border colour when searching text**

**Default:** theme colour

<a id="set-sbborderonopacity"></a>**Search border opacity when searching text, %**

**Default:** 100

<a id="settings-s-f-shadow"></a>

#### Search box glow

<a id="set-searchshadow"></a>**Glow around the search**

Glow around the search field and its button. By default it is the same as the outline's, but it can be set separately or turned off. The glows of the search, the outline and the menu never lie on top of each other.

**Default:** Same as the outline

<a id="set-searchshadowsize"></a>**Glow radius**

**Default:** 24

<a id="set-searchshadowstrength"></a>**Glow strength**

**Default:** 18

<a id="set-searchshadowcolor"></a>**Glow colour**

The arrow makes the colour automatic: a dark shadow on a light theme and a soft light glow on a dark one, so the edge is always visible.

**Default:** theme colour

<a id="settings-s-f-shadow-h"></a>

##### Search box glow on hover

*Desktop only.*

<a id="set-searchshadowhover"></a>**Glow on hover**

**Default:** Same as at rest · *Desktop only*

<a id="settings-s-btn"></a>

### Search mode button

*The button next to the search box switches between searching headings and searching the text of sections. When it is on, it gets an outline and a brighter icon.*

<a id="set-searchbtnstyle"></a>**Look of the search mode button**

Apart — a separate round button next to the search box. Joined — one rounded box split in two by a straight line.

**Default:** Joined

<a id="set-searchbtnside"></a>**Side of the search mode button**

**Default:** Left

<a id="set-searchbtnwidth"></a>**Button width, px**

Moves the dividing line left or right. 0 — the button part is square.

**Default:** 50 pixels

<a id="set-searchdivider"></a>**Dividing line thickness, px**

**Default:** 1

<a id="settings-s-b-icon"></a>

#### Icon of the search mode button

<a id="settings-s-b-i-rest"></a>

##### Search button icon at rest

<a id="set-sbtncolor"></a>**Icon colour at rest**

**Default:** theme colour

<a id="set-sbtnopacity"></a>**Icon brightness at rest, %**

**Default:** 60

<a id="settings-s-b-i-hover"></a>

##### Search button icon on hover

*Desktop only.*

<a id="set-sbtnhovercolor"></a>**Icon colour on hover**

**Default:** theme colour · *Desktop only*

<a id="set-sbtnhoveropacity"></a>**Icon brightness on hover, %**

**Default:** 85 · *Desktop only*

<a id="set-sbtnhoverscale"></a>**Button icon enlargement on hover, %**

**Default:** 100 · *Desktop only*

<a id="settings-s-b-i-on"></a>

##### Search button icon when the mode is on

<a id="set-sbtnoncolor"></a>**Colour when on (icon and outline)**

**Default:** theme colour

<a id="set-sbtnonopacity"></a>**Icon brightness when on, %**

**Default:** 100

<a id="settings-s-b-bg"></a>

#### Background of the search mode button

<a id="set-sbtnbg"></a>**Button background at rest**

**Default:** theme colour

<a id="set-sbtnbgop"></a>**Button background opacity at rest, %**

**Default:** 100

<a id="set-sbtnbgh"></a>**Button background on hover**

**Default:** theme colour · *Desktop only*

<a id="set-sbtnbghop"></a>**Button background opacity on hover, %**

**Default:** 100 · *Desktop only*

<a id="settings-s-back"></a>

### “Back to the current section” arrow

<a id="set-backarrow"></a>**Show the arrow**

An arrow appears in the search box when the current section is not in the visible part of the outline: up if it is above, down if it is below. Pressing it brings the outline to it.

**Default:** On

<a id="set-backarrowside"></a>**Arrow side**

**Default:** Right

<a id="set-backarrowmode"></a>**How to bring it**

Smoothly — scrolls with the outline smoothness (the time is in “Outline scrolling smoothness”). At once — jumps without animation.

**Default:** Smoothly

<a id="settings-s-ba-rest"></a>

#### “Back to the current section” arrow at rest

<a id="set-backarrowcolor"></a>**Arrow colour**

**Default:** theme colour

<a id="set-backarrowopacity"></a>**Arrow brightness, %**

**Default:** 60

<a id="settings-s-ba-hover"></a>

#### “Back to the current section” arrow on hover

*Desktop only.*

<a id="set-backarrowhovercolor"></a>**Arrow colour on hover**

**Default:** theme colour · *Desktop only*

<a id="set-backarrowhoveropacity"></a>**Arrow brightness on hover, %**

**Default:** 100 · *Desktop only*

<a id="set-backarrowhoverscale"></a>**Grow on hover, %**

**Default:** 115 · *Desktop only*

<a id="settings-s-flash"></a>

### Highlight of the found word

<a id="set-searchflashstyle"></a>**How the found word is marked**

In the note and in the hover card: a fill with a ring, or an underline.

**Default:** Underline

<a id="set-how-long-the-highlight-stays-ms"></a>**How long the highlight stays, ms**

**Default:** 2600

<a id="settings-s-fl-fill"></a>

#### Fill and frame of the found word

<a id="set-searchflashcolor"></a>**Found word highlight**

Colour of the mark on the word found by content search. The ring around it and the time it stays are below.

**Default:** theme colour

<a id="set-searchflashring"></a>**Found word ring**

**Default:** theme colour

<a id="settings-s-fl-ul"></a>

#### Underline of the found word

<a id="set-searchflashulcolor"></a>**Underline colour**

**Default:** theme colour

<a id="set-searchflashulopacity"></a>**Underline opacity, %**

**Default:** 100

<a id="set-searchflashulwidth"></a>**Underline thickness**

**Default:** 2

<a id="set-searchflashuloffset"></a>**Underline distance**

From the line the letters stand on, in pixels. Letters that hang below it (like g or y) are not counted.

**Default:** 2

---

<a id="settings-preview"></a>

## Hover preview

<a id="settings-pv-show"></a>

### When the preview shows

<a id="set-hoverpreview"></a>**Show preview**

A small card with the heading and the start of its text, shown while hovering.

**Default:** On

<a id="set-previewtrigger"></a>**Where the hint is called from**

Which part of the widget brings up the preview card.

**Default:** Bars and outline · *Desktop only*

<a id="set-previewkeep"></a>**Preview stays under the cursor**

While the cursor is on the preview it stays put, and you can, for example, change the heading level in it. Turn off and the preview hides as soon as the cursor leaves the bars.

**Default:** On · *Desktop only*

<a id="set-previewzone"></a>**Preview zone**

How far from the edge of the bars the preview appears even when the cursor is not on a bar itself — for the heading at the cursor's height. In pixels; 0 — the length of the longest bar at the peak of the wave.

**Default:** 0 · *Desktop only*

<a id="set-arrowkeysmode"></a>**Arrow keys over the bars**

«Hover card» — the note stays put, the hover card walks through the sections (the bar is marked); Enter goes to the chosen section, Esc cancels. «Go at once» — the note jumps to the next section right away, and the hover card hides as soon as an arrow is pressed.

**Default:** Hover card, Enter to go · *Desktop only*

<a id="set-previewsearch"></a>**While searching the text**

When the outline search looks through the text of sections: the card shows the piece of text with the found word and highlights it, or does not appear at all.

**Default:** Show the found words · *Desktop only*

<a id="settings-pv-place"></a>

### Where the preview stands

<a id="set-previewplacement"></a>**Preview position**

Automatic: over the outline — beside the outline; over the bars — beside the bars, or beside the outline when it is open next to the bars or would be covered. Beside the outline works only while the outline is open; otherwise the card stands by the bars.

**Default:** Beside the outline · *Desktop only*

<a id="set-previewstack"></a>**When there is no room beside the outline**

In a narrow window and on the phone the preview goes below or above the outline. “Outline by the button” — the outline stays by the floating button and the preview goes on the other side: button at the bottom — preview above the outline; at the top — below it (without a floating button — below). The outline then opens short of the full height and keeps room for the preview in advance — the window width decides, so the outline doesn’t jump. The preview never lies over the bars. “As before” — on the desktop the preview squeezes in at the side; on the phone there is none while the outline is open.

**Default:** Outline by the button

<a id="set-previewstackroom"></a>**Height kept for the preview, px**

How much shorter the outline opens when the preview goes below or above it. At most half the window height.

**Default:** 210

<a id="set-previewalign"></a>**Line the card up with**

While the card stands beside the open outline: its middle is level with the outline entry of the section, or with the bar of the section. Beside the bars it always lines up with the bar.

**Default:** The outline entry · *Desktop only*

<a id="set-previewtopgap"></a>**Not higher than**

The preview does not rise above this distance from the top of the screen — in pixels or % of the height. On the phone it is 15 % by default: the system interface is up there.

**Default:** 0 pixels · on the phone: 15%

<a id="settings-pv-p-gap"></a>

#### Preview offset

<a id="set-previewfitfrom"></a>**Preview offset**

From the bars — the preview stands past the longest bar of this note at the wave peak (if there is an H1, past it; only H2 — past H2) plus the amount below. From the screen edge — at its own distance from the edge on the bars’ side, however far they stretch.

**Default:** From the bars: auto + value

<a id="set-previewfitnear"></a>**Distance from the screen edge**

Distance from the screen edge where the bars are to the preview, in pixels.

**Default:** 90 pixels

<a id="set-previewgap"></a>**Added to the bars**

How much to add to the room the longest bar of this note takes at the wave peak, in pixels. More means farther away.

**Default:** 40 pixels

<a id="set-previewoutlinegap"></a>**Distance from the outline**

Space between the preview and the outline when the preview stands beside the outline, in pixels.

**Default:** 40 pixels · *Desktop only*

<a id="settings-pv-size"></a>

### Preview size

<a id="set-previewwidth"></a>**Card width**

Width of the preview card in pixels, capped by the window width.

**Default:** 380 pixels · *Desktop only*

<a id="set-previewscale"></a>**Resize with the outline**

When the floating outline is resized by its corner, the card grows or shrinks by the same amount and keeps its shape. The card settings below still work — they set the proportions inside the card.

**Default:** Always · *Desktop only*

<a id="set-previewchars"></a>**Preview length**

How many characters of the section text to show.

**Default:** 200 · on the phone: 120

<a id="settings-pv-p-fit"></a>

#### Preview on the phone fitted to the screen width

*Phone only.*

<a id="set-previewfit"></a>**Fit the screen width**

The preview fills the space from the bars to the opposite edge of the screen — on any phone. Everything inside scales with it, so proportions and text sizes stay the same. The near edge is “Preview offset”, the far edge is below.

**Default:** On · *Phone only*

<a id="set-previewfitedge"></a>**Gap to the screen edge**

Space between the preview and the opposite edge of the screen, in pixels.

**Default:** 12 pixels · *Phone only*

<a id="set-previewfitscale"></a>**Size of content**

How large everything inside the preview is on the phone: text, spacing, the level mark. 100 % — as on a screen 300 pixels wide; more — larger.

**Default:** 110 · *Phone only*

<a id="set-previewhoverscale"></a>**Preview enlargement on hover, %**

When the cursor is on the preview, it smoothly grows — from the side of the bars. 100% — no enlargement.

**Default:** 100 · *Desktop only*

<a id="settings-pv-window"></a>

### Preview window

<a id="settings-pv-bg"></a>

#### Preview background

<a id="set-previewbg"></a>**Preview background**

**Default:** theme colour

<a id="set-previewfill"></a>**Background fill**

**Default:** Colour

<a id="set-previewimg"></a>**Image**

One of your images (section “Custom CSS, images and fonts”) or a new one from the device.

**Default:** — none —

<a id="set-previewimgop"></a>**Image visibility**

100 — the image as is; lower — the background colour lies on top so text stays readable.

**Default:** 60

<a id="set-previewimgpos"></a>**Anchor the image to**

Which part of the image stays put when the window changes size (centre by default).

**Default:** Centre

<a id="set-previewimgblur"></a>**Image blur**

Blurs the background image itself (0 — sharp). The blurred copy is made once, so it doesn't slow anything down.

**Default:** 0

<a id="set-previewimgfit"></a>**Fit**

**Default:** Fill (crop edges)

<a id="set-previewbgopacity"></a>**Background opacity of the hover card**

100 — solid background, even if the theme makes it transparent. Lower — the note shows through; add blur so the text behind does not mix with the text on top.

**Default:** 100

<a id="set-previewblur"></a>**Blur behind the hover card**

How strongly whatever lies behind is blurred, in pixels. Visible when the background is not fully opaque (or the theme makes it see-through). 0 — no blur.

**Default:** 0

<a id="settings-pv-grad"></a>

##### Preview background gradient

<a id="set-previewbg2"></a>**Second gradient colour**

**Default:** theme colour

<a id="set-previewgradtype"></a>**Gradient type**

**Default:** Linear

<a id="set-previewgradpos"></a>**Transition midpoint, %**

Where the colours meet: lower — more of the second colour, higher — more of the first.

**Default:** 50

<a id="set-previewgradsoft"></a>**Transition softness, %**

0 — a sharp border between the colours, 100 — the transition spans the whole area.

**Default:** 100

<a id="settings-pv-grad-op"></a>

##### Opacity of the preview gradient colours

<a id="set-previewgradop1"></a>**First colour opacity, %**

**Default:** 100

<a id="set-previewgradop2"></a>**Second colour opacity, %**

**Default:** 100

<a id="settings-pv-grad-dir"></a>

##### Direction of the preview gradient

<a id="set-previewgradangle"></a>**Gradient angle, °**

**Default:** 135

<a id="settings-pv-bg-link"></a>

##### Preview picture: movement and shared with the outline

<a id="set-previewimgtrack"></a>**Beside: picture along the movement**

The preview picture is stretched over the whole height the card travels: at the bottom you see the bottom of the picture, at the top — the top, in the middle — the middle.

**Default:** Off

<a id="set-previewstacklinked"></a>**Below / above the outline: shared picture**

When the preview stands below or above the outline, they share one backdrop and one picture: below the outline the preview shows the bottom of the picture, above it — the top.

**Default:** Off

<a id="settings-pv-shape"></a>

#### Shape of the preview window

<a id="set-previewradius"></a>**Preview rounding, px**

The arrow — the shared rounding (as for the outline and search).

**Default:** 

<a id="set-previewpad"></a>**Preview inner padding, px**

**Default:** 

<a id="settings-pv-border"></a>

#### Preview border

<a id="set-previewborderw"></a>**Preview border thickness, px**

0 — no border.

**Default:** 1

<a id="set-previewbordercolor"></a>**Preview border colour**

**Default:** theme colour

<a id="set-previewborderop"></a>**Preview border opacity, %**

**Default:** 100

<a id="settings-pv-pin"></a>

#### Preview border for a pinned item

*Desktop only.*

<a id="set-previewpinborder"></a>**Preview outline**

**Default:** theme colour · *Desktop only*

<a id="set-previewpinborderopacity"></a>**Outline opacity**

**Default:** 70 · *Desktop only*

<a id="set-previewpinborderwidth"></a>**Outline thickness**

**Default:** 1.5 · *Desktop only*

<a id="settings-pv-shadow"></a>

#### Preview glow

<a id="set-previewshadow"></a>**Glow around the preview**

A glow around the panel: set by hand, or off. Its colour can be automatic — see below.

**Default:** Set by hand

<a id="set-previewshadowsize"></a>**Glow radius**

**Default:** 15

<a id="set-previewshadowstrength"></a>**Glow strength**

**Default:** 10

<a id="set-previewshadowcolor"></a>**Glow colour**

The arrow makes the colour automatic: a dark shadow on a light theme and a soft light glow on a dark one, so the edge is always visible.

**Default:** theme colour

<a id="settings-pv-shadow-h"></a>

##### Preview glow on hover

*Desktop only.*

<a id="set-previewshadowhover"></a>**Glow on hover**

**Default:** Same as at rest · *Desktop only*

<a id="set-previewshadowsizeh"></a>**Glow radius**

**Default:** 36 · *Desktop only*

<a id="set-previewshadowstrengthh"></a>**Glow strength**

**Default:** 30 · *Desktop only*

<a id="set-previewshadowcolorh"></a>**Glow colour**

**Default:** theme colour · *Desktop only*

<a id="settings-pv-text"></a>

### Preview font and colour

<a id="settings-pv-t-title"></a>

#### Section title in the preview

*The first three fonts are the ones set in Obsidian itself, so the card can match the note or the interface without picking anything.*

<a id="set-previewtitlefont"></a>**Heading font**

**Default:** Obsidian's interface font

<a id="set-previewtitlesize"></a>**Heading size**

**Default:** 20

<a id="set-previewtitleweight"></a>**Heading weight**

**Default:** 700

<a id="set-previewtitlecolor"></a>**Heading colour**

**Default:** theme colour

<a id="set-previewtitleopacity"></a>**Title opacity, %**

**Default:** 100

<a id="settings-pv-t-text"></a>

#### Section text in the preview

<a id="set-previewtextfont"></a>**Text font**

**Default:** Obsidian's interface font

<a id="set-previewtextsize"></a>**Text size**

**Default:** 12

<a id="set-previewtextweight"></a>**Text weight**

**Default:** 400

<a id="set-previewlineheight"></a>**Line spacing**

Line height of the preview text, as a percentage of its font size.

**Default:** 145

<a id="set-previewtextcolor"></a>**Text colour**

**Default:** theme colour

<a id="set-previewtextopacity"></a>**Text opacity, %**

**Default:** 100

<a id="settings-pv-anim"></a>

### Preview appearance

<a id="set-previewanim"></a>**How the preview appears**

From the side — slides out from whatever it stands beside (the bars or the outline). From the top, from the bottom — slides in from there. From the centre — grows out of the middle. No animation — at once. It disappears the same way. How noticeable — see “Effect strength”.

**Default:** From the bottom

<a id="set-previewanimlevel"></a>**Effect strength**

How noticeable the appearance is: 0 — it simply fades in, 3 — calm (default), 10 — slides in from far away or grows from almost nothing. The time sets only the speed.

**Default:** 10

<a id="set-previewanimms"></a>**Appearance time, ms**

**Default:** 600

<a id="set-previewmovems"></a>**Preview glide, ms**

When previews come one after another (the cursor moves to the next entry or bar), the card does not disappear but glides up or down and changes its content. How long the glide takes. 0 — it jumps.

**Default:** 600

<a id="settings-pv-level"></a>

### Heading level in the preview

<a id="set-numbgpad"></a>**Number backdrop padding, px**

The number has its own backdrop, separate from the zone backdrop with the numbers (with two backdrops or vertical numbers). The arrow — as the zone backdrop.

**Default:** 

<a id="set-numbgradius"></a>**Number backdrop rounding, px**

**Default:** 

<a id="set-numbg"></a>**Number backdrop fill**

**Default:** theme colour

<a id="set-numbgop"></a>**Number backdrop brightness, %**

**Default:** 

<a id="set-numbghover"></a>**Number backdrop fill on hover**

**Default:** theme colour · *Desktop only*

<a id="set-numbghoverop"></a>**Number backdrop brightness on hover, %**

**Default:**  · *Desktop only*

<a id="set-numbggrow"></a>**Number backdrop size on hover, px**

Plus — the backdrop gets bigger on hover, minus — smaller; equally on all sides and smoothly. 0 — as at rest.

**Default:** 0 · *Desktop only*

<a id="settings-previewlevel-1-dots"></a>

#### Dots

<a id="set-previewdotsize"></a>**Dot size**

**Default:** 12

<a id="set-previewdotgap"></a>**Space between dots**

**Default:** 12

<a id="set-previewdotsoff"></a>**Show inactive dots**

**Default:** On

<a id="settings-previewlevel-2-level-number-in-the-dots"></a>

#### Level number in the dots

*Desktop only.*

<a id="set-previewdotnums"></a>**Level number in the dots**

Point at the dots — each shows its level, 1 to 6, in a contrasting color.

**Default:** On · *Desktop only*

<a id="set-previewdotnumsize"></a>**Number size**

In pixels; 0 — to fit the dot.

**Default:** 0 · *Desktop only*

<a id="set-previewdotnumcolor"></a>**Number colour in a lit dot**

**Default:** theme colour · *Desktop only*

<a id="set-previewdotnumoffcolor"></a>**Number colour in a faint dot**

**Default:** theme colour · *Desktop only*

<a id="set-previewdotnumopacity"></a>**Number opacity**

**Default:** 100 · *Desktop only*

<a id="set-previewdotnumweight"></a>**Number weight**

**Default:** 700 · *Desktop only*

<a id="set-previewdotnumanim"></a>**Number appearance**

**Default:** Grows from the center · *Desktop only*

<a id="set-previewdotnumms"></a>**Number appearance time**

**Default:** 140 · *Desktop only*

<a id="set-previewdotnumlevel"></a>**Appearance strength**

How small the number starts growing from: 0 — barely noticeable, 10 — from the very center of the dot.

**Default:** 5 · *Desktop only*

<a id="set-previewdotoffopacity"></a>**Brightness of inactive dots**

**Default:** 10

<a id="set-previewdotoffhoveropacity"></a>**Inactive brightness on hover**

**Default:** 40 · *Desktop only*

*The heading level in the preview: as a letter and number (“H4”), as dots, or both. “H” and horizontal dots sit top right by the title, bottom right or bottom left; vertical dots stand separately at the side of the preview. On the desktop you can change the level with it.*

<a id="set-previewlevelmode"></a>**Look of the heading level**

**Default:** Level number (H4)

<a id="set-previewlevelscale"></a>**Size of the whole level zone, %**

One slider for everything at once: the number, the numbers, cells, backdrops, offsets and the “H1…H6” menu. 100% — as set in the settings below.

**Default:** 100

<a id="set-previewlevelcorner"></a>**Place of the heading level**

**Default:** Top right, by the title

<a id="set-previewleveledit"></a>**Change the level from the preview**

Point at the level mark: for “H” a menu H1…H6 drops down; for dots, the dot under the cursor grows a little — click the one you need. The current level is inactive. Arrows ↑ / ↓ while the cursor is anywhere on the preview — level up / down (they do not scroll the outline then). Nested sections move along, as in the outline.

**Default:** On · *Desktop only*

<a id="settings-pv-l-letter"></a>

#### Level number “H4”

<a id="set-previewlevelsize"></a>**Number size**

**Default:** 20

<a id="set-previewlevelweight"></a>**Number weight**

**Default:** 500

<a id="set-previewlevelper"></a>**Per level**

One look for all levels, automatic (H1 boldest, H6 thinnest) or your own for each level: weight and size.

**Default:** Same

<a id="settings-pv-l-l-rest"></a>

##### Number “H4” at rest

<a id="set-previewlevelcolor"></a>**Colour**

**Default:** theme colour

<a id="set-previewlevelopacity"></a>**Number brightness**

**Default:** 75

<a id="settings-pv-c-b-hover"></a>

##### Main colour on hover

*Desktop only.*

<a id="settings-pv-l-l-hover"></a>

##### Number “H4” on hover

*Desktop only.*

<a id="set-previewlevelhovercolor"></a>**Color on hover**

**Default:** theme colour · *Desktop only*

<a id="set-previewlevelhoveropacity"></a>**Brightness on hover**

**Default:** 81 · *Desktop only*

<a id="settings-pv-l-bd-h"></a>

##### Backdrop of the number “H4”

<a id="set-previewlevelbgw"></a>**Backdrop width, px**

0 — by the size of the number.

**Default:** 0

<a id="set-previewlevelbgh"></a>**Backdrop height, px**

0 — by the size of the number.

**Default:** 0

<a id="settings-pv-l-bd-h-shape"></a>

##### Size and shape of the number backdrop

<a id="set-previewlevelpad"></a>**Fill padding**

**Default:** 7

<a id="set-previewlevelradius"></a>**Fill rounding**

**Default:** 20

<a id="settings-pv-l-bd-rest"></a>

##### Level zone backdrop at rest

<a id="settings-pv-l-bd-h-rest"></a>

##### Number backdrop at rest

<a id="set-previewlevelbg"></a>**Fill around**

**Default:** theme colour

<a id="set-previewlevelbgopacity"></a>**Fill brightness**

**Default:** 5

<a id="settings-pv-l-bd-hover"></a>

##### Level zone backdrop on hover

*Desktop only.*

<a id="settings-pv-l-bd-h-hover"></a>

##### Number backdrop on hover

*Desktop only.*

<a id="set-previewlevelbghover"></a>**Fill on hover**

**Default:** theme colour · *Desktop only*

<a id="set-previewlevelbghoveropacity"></a>**Fill brightness on hover**

**Default:** 10 · *Desktop only*

<a id="set-previewlevelbggrow"></a>**Backdrop size on hover, px**

Plus — the backdrop gets bigger on hover, minus — smaller; equally on all sides and smoothly. 0 — as at rest.

**Default:** 0 · *Desktop only*

<a id="settings-pv-l-bd-glow"></a>

##### Glow under the level zone backdrop

<a id="set-lvlzoneshadow"></a>**Glow under the zone backdrop**

A glow around the panel: set by hand, or off. Its colour can be automatic — see below.

**Default:** Off

<a id="settings-pv-l-bd-glow-h"></a>

##### Glow under the zone backdrop on hover

*Desktop only.*

<a id="set-lvlzoneshadowhover"></a>**Glow on hover**

**Default:** Same as at rest · *Desktop only*

<a id="settings-pv-c-base"></a>

##### Main colour of the numbers and cells

<a id="settings-pv-c-b-rest"></a>

##### Main colour at rest

<a id="settings-pv-c-num"></a>

#### Number in the cell

<a id="set-segnumedgemode"></a>**Number in the end cells**

Auto — in the optical middle (slightly towards the flat end); manual — your own shift.

**Default:** Auto

<a id="settings-pv-c-n-r"></a>

##### Number at rest

<a id="set-segnumsize"></a>**Size**

**Default:** 11

<a id="set-segnumweight"></a>**Weight**

**Default:** 500

<a id="set-segnumcolor"></a>**Colour**

**Default:** theme colour

<a id="set-segnumop"></a>**Opacity, %**

**Default:** 60

<a id="settings-pv-c-n-u"></a>

##### Number above the current level

<a id="set-segnumsizeu"></a>**Size — of the number at rest, %**

**Default:** 100

<a id="set-segnumweightu"></a>**Weight — added to the number at rest**

**Default:** 0

<a id="set-segnumcoloru"></a>**Colour**

**Default:** theme colour

<a id="set-segnumopu"></a>**Opacity, %**

**Default:** 

<a id="settings-pv-c-n-d"></a>

##### Number below the current level

<a id="set-segnumsized"></a>**Size — of the number at rest, %**

**Default:** 100

<a id="set-segnumweightd"></a>**Weight — added to the number at rest**

**Default:** 0

<a id="set-segnumcolord"></a>**Colour**

**Default:** theme colour

<a id="set-segnumopd"></a>**Opacity, %**

**Default:** 

<a id="settings-pv-c-n-c"></a>

##### Number in the selected cell

<a id="set-segnumsizec"></a>**Size — of the number at rest, %**

These are relative to the number at rest: size 100 % — the same, weight 0 — the same.

**Default:** 100

<a id="set-segnumweightc"></a>**Weight — added to the number at rest**

**Default:** 200

<a id="set-segnumcolorc"></a>**Colour**

**Default:** theme colour

<a id="set-segnumopc"></a>**Opacity, %**

**Default:** 100

<a id="settings-pv-c-n-h"></a>

##### Number on hover

*Desktop only.*

<a id="set-segnumsizeh"></a>**Size — of the number at rest, %**

**Default:** 110 · *Desktop only*

<a id="set-segnumweighth"></a>**Weight — added to the number at rest**

**Default:** 200 · *Desktop only*

<a id="set-segnumcolorh"></a>**Colour**

**Default:** theme colour · *Desktop only*

<a id="set-segnumoph"></a>**Opacity, %**

**Default:** 100 · *Desktop only*

<a id="settings-pv-c-n-p"></a>

##### Number on press

*Desktop only.*

<a id="set-segnumsizep"></a>**Size — of the number at rest, %**

**Default:** 110 · *Desktop only*

<a id="set-segnumweightp"></a>**Weight — added to the number at rest**

**Default:** 300 · *Desktop only*

<a id="set-segnumcolorp"></a>**Colour**

**Default:** theme colour · *Desktop only*

<a id="set-segnumopp"></a>**Opacity, %**

**Default:** 100 · *Desktop only*

<a id="settings-pv-l-cells"></a>

#### Cell under the number

<a id="settings-pv-c-round"></a>

##### Rounding of the cells

<a id="set-segradius"></a>**Cell rounding, %**

50 — as round as the cell allows: a circle for a square cell, a capsule for a long one (never an oval). The outer corners of the end cells follow the rounding of the fill around them, so the lines stay parallel.

**Default:** 0

<a id="set-segradiusc"></a>**Rounding of the selected, %**

**Default:** 

<a id="set-segradiush"></a>**Rounding on hover, %**

**Default:**  · *Desktop only*

<a id="set-segradiusp"></a>**Rounding on press, %**

**Default:**  · *Desktop only*

<a id="settings-pv-c-end"></a>

##### End cells

<a id="set-segendmode"></a>**Outer corners of the end cells**

Auto — they follow the rounding of the backdrop; manual — your own value.

**Default:** Auto

<a id="settings-pv-c-cuts"></a>

##### Cuts between the cells

<a id="set-segline"></a>**Cut thickness**

**Default:** 1

<a id="set-seglineopacity"></a>**Cut transparency, %**

Between the cells there are no lines but cuts in the fill: the background shows through. 100 — right through, lower — the cut is slightly filled.

**Default:** 100

<a id="settings-pv-c-fill"></a>

##### Fill of the cells

<a id="settings-pv-c-f-on"></a>

##### Fill of the cells above the current level

<a id="set-segfillon"></a>**Cells above the current level (at rest)**

**Default:** theme colour

<a id="set-segfillonop"></a>**Opacity, %**

**Default:** 22

<a id="settings-pv-c-f-off"></a>

##### Fill of the cells below the current level

<a id="set-segfilloff"></a>**Cells below the current level (at rest)**

**Default:** theme colour

<a id="set-segfilloffop"></a>**Opacity, %**

**Default:** 6

<a id="settings-pv-c-f-cur"></a>

##### Fill of the selected cell (current level)

<a id="set-segfillcur"></a>**Selected (current level)**

**Default:** theme colour

<a id="set-segfillcurop"></a>**Opacity, %**

**Default:** 40

<a id="settings-pv-c-f-hover"></a>

##### Cell fill on hover

*Desktop only.*

<a id="set-segfillhover"></a>**On hover**

**Default:** theme colour · *Desktop only*

<a id="set-segfillhoverop"></a>**Opacity, %**

**Default:** 40 · *Desktop only*

<a id="settings-pv-c-f-press"></a>

##### Cell fill on press

*Desktop only.*

<a id="set-segfillpress"></a>**On press**

**Default:** theme colour · *Desktop only*

<a id="set-segfillpressop"></a>**Opacity, %**

**Default:** 65 · *Desktop only*

<a id="settings-pv-c-react"></a>

##### Cell reaction to hover

<a id="set-seghovergrow"></a>**Cell growth under the cursor, px**

The cell grows equally on all sides. The same as the backdrop’s “Fill padding” — an end cell lies exactly along the edge of the backdrop. Minus — the cell shrinks.

**Default:** 0 · *Desktop only*

<a id="set-segdepth"></a>**Cells with depth**

Each next level cell is darker, as if deeper under water; the cell under the cursor lights up.

**Default:** Off

<a id="settings-pv-l-both"></a>

#### Level number and numbers together

<a id="set-previewbothctl"></a>**Change the level with**

*Desktop only*

<a id="set-previewbothvplace"></a>**Where the level number goes**

The letter lies over the text and does not push it aside. Distances are limited by the edges of the preview: it never goes past them.

**Default:** Beside the dots

<a id="set-previewbothvgap"></a>**Distance from the numbers**

**Default:** 4

<a id="set-previewbothshift"></a>**Shift towards the text**

**Default:** 0

<a id="set-previewbothvpos"></a>**Level number height, %**

Within the column of dots: 0 — by the top dot, 50 — in the middle, 100 — by the bottom dot.

**Default:** 50

<a id="set-previewbothsidegap"></a>**Distance from the numbers**

**Default:** 6

<a id="set-previewbothsplit"></a>**Background**

**Default:** One for both

<a id="set-previewbothgap"></a>**Distance between backgrounds**

**Default:** 6

<a id="set-previewbothhside"></a>**Level number**

**Default:** Left of the dots

<a id="settings-pv-l-nb-glow"></a>

##### Glow under the number backdrop

<a id="set-lvlnumshadow"></a>**Glow under the number backdrop**

A glow around the panel: set by hand, or off. Its colour can be automatic — see below.

**Default:** Off

<a id="settings-pv-l-nb-glow-h"></a>

##### Glow under the number backdrop on hover

*Desktop only.*

<a id="set-lvlnumshadowhover"></a>**Glow on hover**

**Default:** Same as at rest · *Desktop only*

<a id="settings-pv-lm"></a>

##### The “H1…H6” menu at the number

*Desktop only.*

<a id="settings-pv-lm-size"></a>

##### Size and shape of the menu items

*Desktop only.*

<a id="set-lmsize"></a>**Size of “H1…H6” in the menu, px**

0 — as the number.

**Default:** 0 · *Desktop only*

<a id="set-lmweight"></a>**Weight of “H1…H6” in the menu**

**Default:** 600 · *Desktop only*

<a id="set-lmitempad"></a>**Menu item padding, px**

**Default:** 4 · *Desktop only*

<a id="set-lmitemradius"></a>**Menu item rounding, px**

**Default:**  · *Desktop only*

<a id="set-lmgap"></a>**Space between menu items, px**

**Default:** 2 · *Desktop only*

<a id="settings-pv-lm-rest"></a>

##### Menu items at rest

*Desktop only.*

<a id="set-lmtext"></a>**Colour of “H1…H6”**

**Default:** theme colour · *Desktop only*

<a id="set-lmtextop"></a>**Opacity of “H1…H6”, %**

**Default:** 100 · *Desktop only*

<a id="set-lmfill"></a>**Menu item fill**

**Default:** theme colour · *Desktop only*

<a id="set-lmfillop"></a>**Item fill opacity, %**

**Default:** 0 · *Desktop only*

<a id="settings-pv-lm-hover"></a>

##### Menu items on hover

*Desktop only.*

<a id="set-lmtexth"></a>**Colour of “H1…H6” on hover**

**Default:** theme colour · *Desktop only*

<a id="set-lmtexthop"></a>**Opacity of “H1…H6”, %**

**Default:** 100 · *Desktop only*

<a id="set-lmfillh"></a>**Item fill on hover**

**Default:** theme colour · *Desktop only*

<a id="set-lmfillhop"></a>**Item fill opacity, %**

**Default:** 100 · *Desktop only*

<a id="set-lmsizeh"></a>**Size of “H1…H6” on hover — of the rest size, %**

**Default:** 100 · *Desktop only*

<a id="set-lmgrow"></a>**Item growth under the cursor, px**

The item fill grows equally on all sides.

**Default:** 0 · *Desktop only*

<a id="settings-pv-lm-press"></a>

##### Menu items on press

*Desktop only.*

<a id="set-lmtextp"></a>**Colour of “H1…H6” on press**

**Default:** theme colour · *Desktop only*

<a id="set-lmtextpop"></a>**Opacity of “H1…H6”, %**

**Default:** 100 · *Desktop only*

<a id="set-lmfillp"></a>**Item fill on press**

**Default:** theme colour · *Desktop only*

<a id="set-lmfillpop"></a>**Item fill opacity, %**

**Default:** 100 · *Desktop only*

<a id="settings-pv-lm-cur"></a>

##### The current level in the menu

*Desktop only.*

<a id="set-previewmenucurop"></a>**Current level in the menu — opacity, %**

**Default:** 35 · *Desktop only*

<a id="settings-pv-lm-box"></a>

##### Menu backdrop

*Desktop only.*

<a id="set-lmbg"></a>**Menu backdrop fill**

**Default:** theme colour · *Desktop only*

<a id="set-lmbgop"></a>**Menu backdrop opacity, %**

**Default:** 100 · *Desktop only*

<a id="set-lmpad"></a>**Menu backdrop padding, px**

**Default:** 4 · *Desktop only*

<a id="set-lmradius"></a>**Menu backdrop rounding, px**

**Default:**  · *Desktop only*

<a id="set-lmborderop"></a>**Menu backdrop border — opacity, %**

**Default:** 100 · *Desktop only*

<a id="settings-pv-lm-glow"></a>

##### Glow under the menu

*Desktop only.*

<a id="set-lvlmenushadow"></a>**Glow under the “H1…H6” menu**

A glow around the panel: set by hand, or off. Its colour can be automatic — see below.

**Default:** The usual menu shadow · *Desktop only*

<a id="settings-pv-lm-glow-h"></a>

##### Glow under the menu on hover

*Desktop only.*

<a id="set-lvlmenushadowhover"></a>**Glow on hover**

**Default:** Same as at rest · *Desktop only*

<a id="settings-pv-l-zone"></a>

#### Level zone with the numbers 1–6

<a id="set-seglook"></a>**Ready-made look**

Sets the cell shape, cuts and behaviour — then adjust as you like.

<a id="set-segnumshow"></a>**Show the numbers**

**Default:** Always

<a id="set-previewdotsedit"></a>**Choosing the level with the numbers**

*Desktop only*

<a id="settings-pv-z-place"></a>

##### Position of the level zone

<a id="set-previewdotsaxis"></a>**Direction of the numbers**

<a id="set-previewdotsdir"></a>**Order of the numbers**

**Default:** Left to right, with room for all six

<a id="settings-pv-z-size"></a>

##### Size of the level zone

<a id="set-segcellw"></a>**Cell width**

All cells together; for a vertical scale — the width of the column.

**Default:** 24

<a id="set-segblockh"></a>**Block height**

0 — automatic: vertically six cells as wide as they are, horizontally — as the width.

**Default:** 0

<a id="set-previewlevelside"></a>**Side of the numbers**

**Default:** Right

<a id="settings-pv-l-bd"></a>

##### Level zone backdrop

---

<a id="settings-history"></a>

## History and undo

<a id="settings-h-undo"></a>

### Undoing actions

<a id="set-what-the-undo-button-undoes"></a>**What the undo button undoes**

Only the plugin’s actions (move, rename, level, delete…) or all edits of the note, ordinary typing included. Typing is recorded in steps and has its own section in the history. Your own edits in the editor are noticed (typing, paste, delete, drag, Ctrl+Z (⌘ Cmd+Z)); changes by other plugins or sync are not.

**Default:** Only plugin actions

<a id="set-undo-button-also-goes-back-after-a-jump"></a>**Undo button also goes back after a jump**

If the last thing you did was a jump through the outline or the bars (not an edit), the undo button in the header returns you to where you were reading. Several presses — several steps back.

**Default:** On

<a id="settings-h-store"></a>

### History storage

<a id="set-keep-history"></a>**Keep history**

Copied and deleted sections are kept in a file inside the plugin folder and survive restarts.

**Default:** A number of entries

<a id="set-keep-deletions"></a>**Keep deletions**

How many entries to keep in the deleted-sections list.

<a id="set-where-the-history-is-kept"></a>**Where the history is kept**

A separate file in the plugin folder, or inside the plugin settings file (data.json). The second option travels with any sync that syncs plugin settings, including Obsidian Sync; the history then moves there completely.

**Default:** Separate file (history.json)

<a id="set-history-file"></a>**History file**

The history of copies and deletions is kept in .obsidian/plugins/heading-rail/history.json inside your vault. The .obsidian folder is hidden, so it is easy to miss — the button opens it directly.

<a id="settings-h-window"></a>

### History window

<a id="set-order-of-entries-in-the-history"></a>**Order of entries in the history**

Newest at the top or oldest at the top — inside each section and each day.

**Default:** Newest first

<a id="settings-historder"></a>

#### Order of sections in the history window

*Order of the sections in the history window. Sections and days in the window fold with a click on their heading and stay folded until you unfold them.*

<a id="set-1-deleted"></a>**1. Deleted**

<a id="set-2-outline-changes"></a>**2. Outline changes**

<a id="set-3-text-edits"></a>**3. Text edits**

<a id="set-4-copied"></a>**4. Copied**

<a id="set-5-presets-effects-and-pastes"></a>**5. Presets, effects and pastes**

<a id="set-6-settings"></a>**6. Settings**

<a id="set-days-to-keep"></a>**Days to keep**
