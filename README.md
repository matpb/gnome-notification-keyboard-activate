# Notification Keyboard Activate

A GNOME Shell extension that lets you activate notification banners from the keyboard.

## The Problem

GNOME Shell disables keyboard focus on notification banners (`can_focus = false` in `messageTray.js`). This means you can focus a banner with `Super+N` and dismiss it with `Escape`, but there is no way to activate it (open the associated app) without using the mouse.

## What This Extension Does

- Makes notification banners keyboard-focusable
- **Enter** activates the notification (opens the app)
- **Tab** navigates to action buttons within the notification
- **Escape** dismisses the notification (unchanged from default)
- **Space** is intentionally blocked to prevent accidental activation
- Optionally auto-focuses banners when they appear (enabled by default)

## Installation

### From Source

```bash
git clone https://github.com/matpb/gnome-notification-keyboard-activate.git
cd gnome-notification-keyboard-activate
make install
```

Then restart GNOME Shell (`Alt+F2` then `r` on X11, or log out/in on Wayland) and enable the extension:

```bash
gnome-extensions enable notification-keyboard-activate@matpb
```

### Manual

Copy the files to `~/.local/share/gnome-shell/extensions/notification-keyboard-activate@matpb/` and compile the schemas:

```bash
glib-compile-schemas schemas/
```

## Settings

Open preferences via GNOME Extensions app or:

```bash
gnome-extensions prefs notification-keyboard-activate@matpb
```

**Auto-focus notifications** (default: on) - When enabled, banners are immediately keyboard-focused when they appear. When off, press `Super+N` first to focus, then `Enter` to activate.

## Compatibility

- GNOME Shell 46

## How It Works

GNOME Shell creates notification banners as `St.Button` widgets (via `NotificationMessage` in `calendar.js`), which natively support keyboard activation via Enter. However, `messageTray.js` explicitly sets `can_focus = false` on the banner, disabling all keyboard interaction beyond Escape to dismiss.

This extension overrides `_showNotification` to restore `can_focus = true` on the banner and adds key event handlers to properly route Enter (activate), Space (blocked), and Tab (navigate action buttons).

## License

GPL-3.0-or-later
