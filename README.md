# AI in a Bottle 🏴‍☠️

A compact pirate-themed AP Computer Science Principles study helper, built as a single HTML file.

## Open the app

- **GitHub Pages:** https://kevinkevinsonbooyah.github.io/AI-in-a-Bottle/ (once Pages is enabled)
- **Locally:** download `index.html` and open it in a browser.

## Activate GitHub Pages (repository owner)

1. Go to **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select **main** and **/(root)**, then **Save**.

GitHub will publish `index.html` at the URL above.

## Window controls

- Resize the popup from its window edges: the header, tabs, chat, and controls reflow for narrow or short windows.
- Right-click anywhere **inside the app** (home page or mini-window) to conceal the mini-window contents; right-click again to restore them. The underlying browser popup frame may remain visible, because browser JavaScript cannot minimize an operating-system window.
- When **Stealth Mode** is checked, three quick left-clicks anywhere inside the app (including the parent page and mini-window) close the mini-window and navigate the parent tab to Google Classroom.
- These gestures work only while interacting with the AI in a Bottle webpages. They cannot intercept mouse events in unrelated tabs, browsers, or desktop apps.
- Right-click is reserved for this shortcut, so use Ctrl+V or keyboard shortcuts to paste into the app.

## Gemini setup

Create an API key in [Google AI Studio](https://aistudio.google.com/api-keys), then enter it within **Run → Config → Online Gemini**. The app does not contain a Gemini API key, and no key should ever be committed to this repository. Smart routing uses available free-tier models and the on-screen request counters track local estimates, not Google's official account quotas.

**Privacy and security:** This is a public static website. Do not share your API key. If you choose to remember it, the browser stores the key locally in unencrypted web storage. Other GitHub Pages apps under the same `kevinkevinsonbooyah.github.io` origin can potentially read that storage. Avoid saving the key on school/shared computers; revoke it from AI Studio if you suspect exposure.

Some browser settings or school restrictions can block popups, screenshot permissions, or external AI requests.

## Controls & new features

- **Resize the mini-window:** layout automatically adapts to narrow and short sizes (the browser's own window frame is still controlled by Chrome).
- **Right-click anywhere on either AI in a Bottle page or its mini-window:** quickly conceal or reveal the mini-window's contents in *any* mode. A website cannot minimize the operating system window or detect right-clicks in unrelated tabs/programs.
- **Triple left-click while Stealth Mode is enabled:** navigates the **main** AI in a Bottle tab to the configured Google Classroom address. Listeners work across both of this app's windows, but not outside them.
- **Box Capture:** Chrome asks you to pick a screen/tab, then you drag a rectangular crop over the screenshot and click **Use selected box**. Requires browser screen-sharing permission; nothing is uploaded until you ask a model to interpret the screenshot.
- **Local Ollama:** in **Config → Choose the brain**, select **Local • Ollama**. This restores the original ScreenStudy's local `qwen3-vl:4b-instruct` model if installed. Set the model name if you already have a different compatible model, then click **Test local connection**. No Gemini API quota applies to local Ollama. The target computer must have Ollama installed and running; this **will not** work on a school computer that cannot install Ollama.

For GitHub Pages, Ollama might block browser-origin requests. If needed, set `OLLAMA_ORIGINS=https://kevinkevinsonbooyah.github.io` in Ollama's environment and restart Ollama (see [official Ollama FAQ](https://github.com/ollama/ollama/blob/main/docs/faq.md)); browser local-network permissions may also be required. Do not publish your local Ollama server to the internet.
