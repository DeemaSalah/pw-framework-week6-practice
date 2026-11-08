# MODEL ANSWER - EX 4: the products page

`npm run explore -- a11y` reports two kinds of problem on three elements. A keyboard and a careful
look find two more that axe cannot. Fix all four; then the test passes and moves into
`tests/07-accessibility.spec.ts`.

## What axe finds

**1. critical - button-name - the promo banner's close button has no name.**
It contains only a drawing of an X. A screen reader announces "button" and nothing else.
In `app/public/index.html`:

```html
<button type="button" class="promo-close" data-test="promo-close" aria-label="Close the offer">
```

**2. serious - color-contrast - two pieces of text are too pale.**
The banner text is 2.0 : 1 against its background; the small print is 2.2 : 1. The minimum for
normal-size text is 4.5 : 1. In `app/public/app.css`:

```css
.promo p { margin: 0; font-size: 14px; color: var(--green); }
.small-print { font-size: 12px; color: var(--muted); }
```

## What axe does not find

**3. The newsletter field has no label - only a placeholder.**
axe accepts a placeholder as the field's name, so it reports nothing. But the placeholder vanishes
the moment you type, many screen-reader and browser combinations treat it unreliably, and pale grey
placeholder text is hard to read. Give it a real label. In `index.html`:

```html
<label for="newsletter-email">Email address</label>
<input id="newsletter-email" type="email" autocomplete="email" data-test="newsletter-email">
```

and in `app.css`, so the label sits on its own line:

```css
.newsletter label { flex-basis: 100%; margin-top: 0; }
```

**4. You cannot see where you are with the keyboard.**
Press Tab through the page: the links in the header still show where you are, but from Sign out
onwards nothing does - `app.css` removes the outline from every button. Replace the line
`button:focus { outline: none; }` in `app.css` (if you pasted the EX 3 fix, it is no longer the last line) with:

```css
button:focus-visible { outline: 3px solid var(--green-2); outline-offset: 2px; }
```

`:focus-visible` shows the ring for keyboard users and not on every mouse click - which is why
designers removed it in the first place.

**The lesson.** Two of the four came from a person with a keyboard, not from a tool. Automated
checks catch a large share of problems - Deque's own study puts it at about 57% by volume - and
none of the rest.
