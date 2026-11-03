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

**Privacy and security:** This is a public static website. Do not share your API key. The current version does not save your API key or include it in exported config files. You must paste it again after a full page/browser restart. Older versions may have stored a key; the new app removes that old browser-storage entry when you open its mini-window. Revoke a key in AI Studio if you suspect exposure.

Some browser settings or school restrictions can block popups, screenshot permissions, or external AI requests.

## Controls & new features

- **Resize the mini-window:** layout automatically adapts to narrow and short sizes (the browser's own window frame is still controlled by Chrome).
- **Right-click anywhere on either AI in a Bottle page or its mini-window:** close the mini-window in *any* mode. Right-click the main AI in a Bottle tab to reopen the popup and recover the in-memory conversation. This cannot detect right-clicks in unrelated tabs or programs, or fully minimize an OS window.
- **Triple left-click while Stealth Mode is enabled:** navigates the **main** AI in a Bottle tab to the configured Google Classroom address. Listeners work across both of this app's windows, but not outside them.
- **Box Capture:** Chrome asks you to pick a screen/tab, then you drag a rectangular crop over the screenshot and click **Use selected box**. Requires browser screen-sharing permission; nothing is uploaded until you ask a model to interpret the screenshot.
- **Local Ollama:** in **Config → Choose the brain**, select **Local • Ollama**. This restores the original ScreenStudy's local `qwen3-vl:4b-instruct` model if installed. Set the model name if you already have a different compatible model, then click **Test local connection**. No Gemini API quota applies to local Ollama. The target computer must have Ollama installed and running; this **will not** work on a school computer that cannot install Ollama.

For GitHub Pages, Ollama might block browser-origin requests. If needed, set `OLLAMA_ORIGINS=https://kevinkevinsonbooyah.github.io` in Ollama's environment and restart Ollama (see [official Ollama FAQ](https://github.com/ollama/ollama/blob/main/docs/faq.md)); browser local-network permissions may also be required. Do not publish your local Ollama server to the internet.

## Import, export, and repairing local AI

- **Settings → Export Config** downloads a JSON file containing engine preferences, Ollama host/model, and local daily usage limits. **The key, chat, screenshots and user data are intentionally excluded.**
- **Settings → Import Config** restores the supported settings only. Paste the Gemini API key yourself each new session.
- **Ollama → Repair Ollama** checks the local connection and downloads a Windows `.cmd` troubleshooting script. It is not launched automatically. After you review and run it on your **own** Windows PC, the script offers to install Ollama via official `winget`, pull the model, and optionally set the GitHub Pages origin. The app cannot bypass school installation restrictions.
- The app now includes animated sea backgrounds, a revised Classroom-tab favicon, simplified settings and general-subject practice questions alongside AP CSP.
