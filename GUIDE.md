# Heading Rail — Guide

*[English](GUIDE.md) · [Русский](GUIDE.ru.md)*

This guide explains how Heading Rail works and how to get what you want out of it. It does not walk through every slider one by one — each setting has its own description on the settings screen. Instead it explains the ideas behind them, so the sliders make sense when you get there.

---

## 1. The rail

### What you see

Each heading in the note is a short horizontal bar at the edge of the page. The bars run top to bottom in the same order as the headings. A bar's length depends on the heading's level: a first-level heading gets the longest bar, deeper levels get shorter ones. Even at a glance, the rail shows the shape of the document — where the big sections start and how much sits inside each.

Two short marks sit at the very top and bottom of the rail. They stand for the start and the end of the note: clicking the top one scrolls to the beginning, the bottom one to the end. They can be hidden, or kept visible but made unclickable.

### The current section

The bar for the section you are reading is highlighted, and the highlight follows you as you scroll. "The section you are reading" means the last heading above the middle of the screen — so the highlight moves on as soon as a new heading passes the middle, without waiting for it to reach the top.

![The rail at rest: bar lengths follow heading levels, the current section is lit, and the halo fades around it](screenshots/hr-rail.png)
*The rail beside this guide. Longer bars are higher-level headings; the lit bar is the section on screen, with the halo around it.*

### Long notes

If a note has more headings than fit in one column at a readable spacing, the rail adds a second column, then a third. The leftmost column is the start of the document. Within each column the bars are packed from the top.

### Where the rail sits

The rail can sit on the right or the left edge. You choose where its band begins and ends as a percentage of the note's height — for example from 10% to 90% — and whether, when there are only a few headings, the bars gather in the middle of that band, at its top or at its bottom. The spacing between bars either adapts to the note (spreading out between a minimum and a maximum) or stays fixed.

---

## 2. The wave

### The one idea behind it

When you point at the rail, the bars around the cursor react. Every frame, each bar receives **one number between 0 and 1**: how strongly the wave reaches it. 1 is the centre of the wave; 0 is a bar the wave does not touch at all.

Everything visual follows that number. Each property — length, colour, opacity, thickness — has a **value at rest** and a **value at the peak**, and moves between them in proportion to the number. That is why you can have a wave that only makes bars longer, one that only makes them brighter, one that only thickens them, or all at once: each property is its own pair of values riding on the same number.

So the wave is described in two separate parts:

- **the shape** decides what that number is for each bar;
- **the appearance** decides what each bar looks like for a given number.

Change one and the other stays put.

![The wave under the cursor: each bar takes its own share of the wave](screenshots/hr-wave.png)
*The wave under the cursor. Every bar here has received its own number between 0 and 1, and its length and brightness follow it.*

### The shape

The shape says how the strength falls off from the centre. The built-in shapes are:

- **Bell** — soft all the way, no visible edge.
- **Peak** — a sharp centre with long, thin tails.
- **Plateau** — a flat top with steep sides, so several bars in the middle are all at full strength.
- **Arc** — an even curve that ends cleanly at the edge of its reach.
- **Wedge** — a straight line down.
- **Step** — every bar within reach at full strength, nothing outside.
- **Ripple** — a main wave with a fainter second one behind it.

Next to the shape sits its **reach** — how many bars the wave spreads over — and, in the fine-tuning section, **edge sharpness**, which narrows the shape and hardens its edges.

**Your own shape** is the eighth option. Instead of a curve, you set the length of each bar directly in pixels: the centre bar, the one next to it, the one after that, and so on, mirrored above and below. You first choose how many bars the wave covers (always an odd number — one in the middle and the same count on each side), and a slider appears for every step. The lengths you set are the maximum each bar reaches; bars still grow into them gradually as the wave builds up, and the length slides smoothly between one step and the next as the cursor moves.

![Settings: your own wave shape, with a slider for the length of each step](screenshots/hr-custom-shape.png)
*Your own shape: choose how many bars the wave covers, then set each step's length in pixels.*

### Where the centre is

By default the centre of the wave **sits on a bar**. The empty space between two bars is split down the middle: while the cursor is over one bar, nothing moves at all, however much you wiggle it; once you cross the halfway line, the wave slides over to the next bar. This is the calm, predictable option.

The alternative is to let the centre **follow the cursor freely**. Then, with the cursor between two bars, those two share the wave, and both shift with every small movement. It feels more liquid and less stable.

**Distinct centre** is a related safeguard: it makes sure the bar nearest the cursor is always the longest, even when bars have different resting lengths.

### Length at the peak

There are two ways to say how long a bar gets at the centre of the wave:

- **Shared length** pulls every bar towards the same length. The crest of the wave comes out even, regardless of heading levels.
- **Added length** adds the same amount to each bar's own length, so deeper headings stay shorter even at the peak.

### Motion

Four timings describe how the wave moves:

- **Catch-up time** — how long the wave takes to reach the cursor. Zero pins it to the cursor.
- **Overshoot** — how far the wave swings past the cursor on a quick movement before settling back. Zero means it arrives and stops.
- **Build-up** — how long the wave takes to reach full strength when the cursor arrives.
- **Fade out** — how long it takes to die away when the cursor leaves.

Build-up and fade-out run at an even pace with soft ends, so the wave eases in and out rather than jumping and then crawling.

### Where the cursor has to be

On desktop, two more settings shape the wave by where the cursor is across the rail rather than along it:

- **Reaction zone** lets the bars start responding before the cursor reaches the rail. The strength fades smoothly to nothing at the outer edge of the zone, so the wave comes to meet the cursor instead of switching on.
- **React to horizontal movement** makes the wave stronger the further the cursor moves away from the window edge towards the text, and weaker right at the edge.

### The master slider

**Wave intensity**, at the top of the wave section, sits over everything else. It scales length, brightness, opacity, thickness and — more gently — reach, all at once. At zero the bars stop reacting. The other settings describe the character of the wave; this one only says how loudly it plays. It is the quickest way to make the whole effect calmer or bolder without losing its shape.

---

## 3. Highlighting where you are

Two separate things mark the current section, and each is switched on by itself.

### The current bar

The bar for the section you are reading can be highlighted **always**, **only while pointing at the rail** (on a phone: only while your finger is on it), or **not at all**. Its colour and opacity are set in the colour section.

### The halo

The halo lights up the neighbours of the current bar, fading with distance. It is set the same way as your own wave shape: first **how many bars** the halo covers — an odd number, the current bar in the middle — then **the brightness of each step** as a percentage, where step one is the immediate neighbour. The same values apply above and below.

Like the current bar, the halo can be shown always, only while pointing at the rail, or turned off.

**Highlight brings bars forward** controls how far the halo pulls bars towards full opacity. This matters when your bars are faint at rest: without it, the halo would be multiplied by that faintness and nearly vanish.

### When the current section changes

When you click somewhere else in the outline, the current section can change by a long way. You choose what the highlight does:

- **Jump** — it appears in the new place at once.
- **Travel** — the whole halo moves there together, with its own **travel time**, **overshoot on arrival** and **trail** — how brightly the bars it passes light up along the way.

---

## 4. The outline

### Opening it

- **Right-click** a bar to pin the outline open at that section. Right-click again to close it. The list button in the note's toolbar does the same.
- **Hold Ctrl** to peek at the outline for as long as the key is down. Clicking an entry while peeking navigates without pinning.

Because a bar at the peak of the wave is longer than the rail, it would lie across the outline. By default the bars therefore stay still while the outline is open. If you turn the wave on for the pinned or peeked outline, the list moves aside by exactly the space the bars take.

### Inside it

The outline keeps the current section centred as you scroll. A thin marker beside the bars shows which part of the rail the visible part of the outline covers. If the current section scrolls out of view in the list, a small pill appears above or below it; clicking it brings the section back.

The search field above the list filters entries by heading text; Escape clears it. The bars are never filtered — they always show the whole document. The search field can be moved below the list or hidden.

![The pinned outline beside the rail, with the current entry highlighted](screenshots/hr-outline.png)
*The pinned outline. The current entry is highlighted and kept centred; the thin marker beside the bars shows which part of the rail the list covers.*

### Hovering

Hovering a bar scrolls the outline to the matching heading without moving the note. Hovering an entry highlights its bar, and the other way round.

---

## 5. The preview card

Hovering a bar shows a card with the heading and the start of its section, so you can check what is there before jumping.

The card can be brought up by the bars, by the outline, by both, or by neither. By default it sits beside the rail; while the outline is open it moves beside the outline instead, so it never covers the list.

You can set its distance from the rail, its width, the number of characters it shows, and — in its own folded section — the font, size and weight of the heading and of the body text separately, plus line spacing. The first three fonts in each list are the ones set in Obsidian itself, so the card can match your note or your interface without choosing anything.

The card's distance is measured from the rail, and the space bars take at their peak is added automatically, so the longest bar never lies over the card.

---

![The preview card showing the start of a section](screenshots/hr-preview.png)
*Pointing at a bar brings up the start of its section — here, this very chapter.*

## 6. Moving through the note

### Jumping

Click a bar to scroll to its heading. You choose where the heading lands: **at the top** of the screen, **a third of the way down**, or **in the middle**.

### Scrubbing

Hold the mouse button on the rail and drag: the note follows the cursor in real time, the way a video follows the playhead along its timeline. Release to stop.

Holding **Space** with the cursor over the rail does the same without holding the mouse button — just move the cursor up and down. Space is only taken over while the cursor is on the rail; anywhere else it is an ordinary space.

### Wheel and keys

The mouse wheel, or a trackpad swipe, over the rail moves the note several times faster than over the text.

With the outline open and the cursor on the rail, the arrow keys step from heading to heading. Holding Ctrl lets the arrows do this from anywhere in the note.

---

## 7. Sections as units

### Selecting

In the outline:

- **Right-click** an entry to select it and open the action menu.
- **Shift-click** another entry to select everything between the two.
- **Alt-click** entries to add or remove them one at a time, so sections from unrelated parts of the note can be selected together.

Escape, the Cancel button, or an ordinary click clears the selection.

### What a section includes

A section is the heading plus everything under it, down to the next heading of the same or a higher level. Nested subsections go with it.

### Copying and deleting

With something selected, a small menu appears beside it: **Copy**, **Delete**, **Cancel**. The buttons act on the whole selection at once. Copy puts the sections on the clipboard without changing the note. Delete removes them from the note.

Before deleting, the plugin checks that the outline still matches the file on disk, and refuses to write if the file changed during the operation.

With the outline pinned, the cursor on the widget and something selected, the Delete or Backspace key deletes the selection. It is limited to exactly that situation so the key behaves normally everywhere else.

![Several sections selected in the outline, with the Copy, Delete and Cancel menu](screenshots/hr-sections.png)
*A range of sections selected with Shift-click, and the menu that acts on all of them at once.*

### History

The history button in the note's toolbar opens two lists: what was copied and what was deleted. A deleted section can be put back with one click; a copied one can be put back on the clipboard. Entries can be removed from the lists one by one.

The history lasts for the current session and clears when Obsidian restarts. Obsidian's own undo also works on every deletion.

### Commands

Three commands are available in the command palette and can be given hotkeys: copy the selected sections, delete the selected sections, and restore the last deletion.

---

## 8. On a phone

### Touch instead of hover

- **Tap** a bar to jump to it.
- **Drag a finger** along the rail to scrub through the note.
- **Long-press** a bar to open the outline at that section.
- **Long-press** an entry in the outline to select it and open the action menu; after that, ordinary taps add and remove entries.

The outline closes on a tap outside it. When the keyboard appears, the rail hides itself — there is no room for both.

![The rail and the outline on a phone](screenshots/hr-mobile.png)
*On a phone: the rail at the edge, and the outline opened with a long press.*

### What the phone settings contain

The phone tab only shows settings that actually do something on a touchscreen. Anything that depends on a hovering cursor — the reaction zone, where the wave centres, the distinct centre, scrolling on hover, holding Ctrl — is left out, because a finger covers exactly the spot where the difference would be visible.

### Switching it off on phones

On some devices Obsidian's own swipe gesture near the edge of the screen can get in the way of the rail. The very first setting on the phone tab turns the plugin off for phones alone. On desktop it keeps working as before.

---

## 9. Settings

### Desktop and phone

The settings screen has two tabs. Almost every setting exists separately on each, because what feels right under a mouse rarely feels right under a finger.

On the phone tab, each setting has a **chain button**. When it is pressed, the setting takes its value from the desktop tab and follows it from then on; the setting's description says so in words. Press it again to give the phone its own value. This works one setting at a time: the wave's shape can stay shared while its size differs.

### Folded sections

Settings are grouped into sections that fold away. Layout and Wave are open when the screen loads, with the main controls on top; fine tuning sits in folded sections inside them. Sections you open stay open while you work.

### Colours

Every colour sits on the same row as its own opacity, with an arrow on the right that hands the colour back to your theme. A colour left empty always comes from the theme, and the colour picker shows the actual theme colour it will use.

**Follow the theme** concerns colours that come from a style. The author of a style picked its colours for their own theme; if one of them would end up light on light or dark on dark in yours, its lightness is flipped while the hue stays the same. **Colours you set yourself are never touched** — even if you deliberately put something close to the background.

![Colour settings on the phone tab: colour, opacity, reset to theme and the chain button on one row](screenshots/hr-colours.png)
*Colour settings on the phone tab. Each row holds the colour, its opacity, the arrow back to the theme, and the chain button that borrows the desktop value.*

---

## 10. Styles

A style is a complete set of values applied at once. The plugin ships with one — **Base** — which is active from the moment you install it. The settings screen says which style is on; once you change anything, it says the style is on with your own changes on top, and the button becomes **Back to the style**.

Applying a style only changes the profile you are editing — desktop or phone — and only the values the style contains.

![The ready-made styles section with Base switched on](screenshots/hr-styles.png)
*Base is on from the moment of installation; the line under the list says which style is active and whether you have changed it.*

### Sending in your own

If you have arrived at something you like, **Share your own style** opens a window with your current settings. You can give the style a name and choose whether to send the desktop profile, the phone profile, or both — each is labelled in the letter. Copy the settings, open an email, paste them in and send.

Nothing leaves your device on its own: the plugin only opens your mail app with the letter ready. Only the plugin's settings are included, never anything from your vault. Styles that are sent in are reviewed and, if they are good, added to the list in a later release.

![The share window: style name, which profile to send, the settings to copy](screenshots/hr-share.png)
*The share window. Only the plugin's settings go into the letter — you can read every line before sending.*

---

## 11. When something looks wrong

**The bars are almost invisible.** Check the bar opacity next to the bar colour, and the per-level opacity in *Length by heading level*. If your theme has a very faint text colour, set a bar colour of your own.

**The wave feels sluggish.** Lower the catch-up time and the build-up. Zero catch-up pins the wave to the cursor.

**The wave jitters when I hold the cursor still.** Set *Where the wave centres* to *On a bar*.

**The preview card is too close to or too far from the rail.** Change *Distance from the bars* in the preview section. The space bars take at their peak is already added on top.

**The halo seems missing.** Check that the halo is set to *Always*, that its steps are above zero, and that *Highlight brings bars forward* is not at zero if your bars are faint.

**On a phone, the rail fights with Obsidian's edge swipe.** Turn the plugin off for phones at the top of the phone tab.

---

*Questions, ideas, or a better fork: lavrowws@gmail.com*
