## Create Events Page

Fields:

- **Event type** (required)
  - Dropdown with color-coded options
- **Title** (required)
  - Single-line text input
- **Start Date** (required)
  - Date picker
- **Time** (required)
  - Time input
- **End time** (optional)
  - Date picker
- **Time** (optional)
  - Time input
- **I dont know yet** (optional)  
    - Check box
- **Duration** (optional)
  - Dropdown: 30 min, 1 hour, 2 hours, 3 hours, Custom
- **Location mode** (required)
  - Toggle: Online / IRL
  - If Online:
    - URL input
    - Auto-detect platform from URL:
      - twitter.com/spaces → "🐦 X Spaces"
      - youtube.com/live → "▶ YouTube Live"
      - discord.gg → "💬 Discord"
      - Default: show domain name
  - If IRL:
    - Text input for venue name or address
- **Description** (optional)
  - Plain text area, 3–4 lines
- **Cover image** (optional)
  - Single image upload
- **Registration link** (optional)
  - URL input (for RSVPs or tickets)


Aactions:

- "Submit"

### Form changes by Event type

Selecting an `Event type` dynamically adjusts visible fields, defaults, validation, and helper text to match common requirements for that type. The form should change as follows:

- **Exchange Listing**
  - Defaults: `Location mode` → **Online**. Type pill uses exchange color.
  - Shows/Requires: `Exchange Pair URL` (required), `Source link` (optional), `Registration link` (optional).
  - Duration: default 30–60 minutes but editable.
  - Validation: `Exchange Pair URL` must be a valid URL; suggest extracting pair symbol when possible.

- **X Spaces**
  - Defaults: `Location mode` → **Online**.
  - Shows/Requires: `Event URL` (required). Platform detection should auto-label `🐦 X Spaces` when URL matches `twitter.com/spaces` and populate `xSpaceLink`.
  - Shows `Host handles` (optional) and a `Moderator` field.
  - Duration: suggest 60 minutes.
  - UX: show small platform chip and a link preview when detection succeeds.

- **AMA**
  - Defaults: `Location mode` → **Online**, but `IRL` allowed.
  - Shows/Requires: `Event URL` or `Invite link` (required when Online), `Host` (required), `Moderator` (optional).
  - Duration: suggest 60 minutes; allow custom.
  - UX: if `discord.gg` or `x.com` invite detected, display platform chip.

- **Livestream**
  - Defaults: `Location mode` → **Online**.
  - Shows/Requires: `Stream URL` (required). Detect `youtube.com/live`, `twitch.tv`, `kick.com` and show platform icon + embed preview.
  - Shows `Recording link` (optional) and `Stream channel` metadata.
  - Duration: suggest 1–2 hours.

- **Other / Generic**
  - Keep generic `URL` or `Venue` depending on `Location mode`.
  - Allow freeform notes to explain the event context.

Behavior rules common to all types:

- Changing the `Event type` updates the color pill and helper text but does not immediately destroy user-entered fields; if switching would hide a filled, now-incompatible field, prompt: "Switching types will remove/clear the following fields: X — Continue / Cancel".
- Required-field validation is type-aware and runs on blur and on submit.
- Platform detection runs on paste/blur of the URL field and populates a small inferred-platform chip; detection is non-destructive and editable.
- When a type implies a specific CTA (e.g., live `Join now` for X Spaces or Livestream), mark that behavior in the preview and ensure the `primaryLink` field is present and valid.