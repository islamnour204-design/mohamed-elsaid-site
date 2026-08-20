# How to open Claude Code on this machine

Written for Islam, August 2026. Two routes. Route A is the one to use.

---

## Route A — PowerShell (recommended)

1. Press the **Windows key**.
2. Type `powershell` and press **Enter**. A dark blue window opens.
3. Point it at the project folder. Type this exactly, including the quotation marks, then press Enter:

   ```
   cd "C:\Users\Access\OneDrive\Desktop\Business\Mohamed essam website"
   ```

   `cd` means "change directory" — it tells the window which folder to work in.
   The quotation marks are required because the folder name has spaces in it. Without them Windows reads `Mohamed` as the whole folder name and fails.

4. Start Claude Code. Type:

   ```
   claude
   ```

   then press Enter.

That's it. You'll get a prompt where you can type instructions in plain English.

**To leave:** type `/exit` and press Enter, or press `Ctrl` + `C` twice.

---

## Route B — the Code tab in the Claude desktop app

Open the Claude desktop app and look for the **Code** tab in the sidebar. This runs the same tool with a friendlier wrapper. Point it at the same folder above.

Use this if PowerShell feels uncomfortable. Route A is more reliable when things go wrong, because you can see the error messages.

---

## Shortcut for next time

Instead of steps 1–3, open **File Explorer**, navigate to the project folder, click once in the address bar at the top, type `powershell` over the path, and press Enter. PowerShell opens already pointed at that folder. Then just type `claude`.

---

## What is verified vs. what to confirm

Verified on this machine on 15 August 2026:

- Claude Code **is installed**, via npm, at
  `C:\Users\Access\AppData\Roaming\npm\claude.cmd`
  Because it lives in that folder, the plain word `claude` works from any directory.
- Node.js, Git, Git Bash and VS Code are all installed as well.
- Windows PowerShell is present and is the correct terminal for this machine.

Not yet confirmed, because it needs you to type it:

- That the `claude` command runs first time without asking you to log in again. If it asks you to sign in, that is normal and only happens once.

**If `claude` is not recognised**, the fix is usually to close PowerShell and reopen it, which reloads the list of places Windows looks for commands. If it still fails, tell me and we'll reinstall it with one command.

---

## Useful once you're inside

| Type this | What it does |
|---|---|
| `/help` | List available commands |
| `/exit` | Quit |
| `/clear` | Start a fresh conversation, same folder |
| `/mcp` | Show connected tools and log in to any that need it |

## A note on folders

Claude Code only sees the folder you started it in, and everything beneath it. That is a safety feature, not a limitation. If you start it in the wrong folder it will not be able to see the website files — `cd` to the right one and start again.
