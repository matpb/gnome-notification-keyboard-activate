// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (c) 2026 Mathieu-Philippe Bourgeois (matpb)

import Clutter from 'gi://Clutter';
import {Extension, InjectionManager} from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import {MessageTray} from 'resource:///org/gnome/shell/ui/messageTray.js';

export default class NotificationKeyboardActivate extends Extension {
    _injectionManager = null;
    _keyPressHandlerId = null;
    _settings = null;

    enable() {
        this._settings = this.getSettings();
        this._injectionManager = new InjectionManager();

        const settings = this._settings;

        // GNOME hardcodes `banner.can_focus = false` (messageTray.js), which
        // prevents the notification banner (an St.Button) from receiving
        // keyboard events. We override _showNotification to restore focusability
        // and optionally auto-focus the banner when it appears.
        this._injectionManager.overrideMethod(
            MessageTray.prototype,
            '_showNotification',
            (original) =>
                function () {
                    original.call(this);

                    if (this._banner) {
                        this._banner.can_focus = true;

                        // Block Space on the banner itself. St.Button natively
                        // fires 'clicked' on Space before events bubble to
                        // parent widgets, so we intercept at the banner level.
                        // Space still works on action buttons inside the banner.
                        this._banner.connect('key-press-event', (_actor, event) => {
                            if (event.get_key_symbol() === Clutter.KEY_space)
                                return Clutter.EVENT_STOP;
                            return Clutter.EVENT_PROPAGATE;
                        });

                        if (settings.get_boolean('auto-focus'))
                            this._banner.grab_key_focus();
                    }
                }
        );

        // Fallback key handler on the banner container. Handles the case where
        // focus lands on _bannerBin rather than the banner widget itself.
        const bannerBin = Main.messageTray._bannerBin;
        this._keyPressHandlerId = bannerBin.connect(
            'key-press-event',
            (_actor, event) => {
                const symbol = event.get_key_symbol();
                const focused = global.stage.get_key_focus();
                const banner = Main.messageTray._banner;

                // Block Space at the container level too
                if (symbol === Clutter.KEY_space) {
                    if (!banner || focused === banner || !banner.contains(focused))
                        return Clutter.EVENT_STOP;
                    return Clutter.EVENT_PROPAGATE;
                }

                // Enter activates the notification's default action
                if (
                    symbol === Clutter.KEY_Return ||
                    symbol === Clutter.KEY_KP_Enter
                ) {
                    // Let action buttons handle their own Enter
                    if (banner && focused !== banner && banner.contains(focused))
                        return Clutter.EVENT_PROPAGATE;

                    const notification = Main.messageTray._notification;
                    if (notification) {
                        notification.activate();
                        return Clutter.EVENT_STOP;
                    }
                }

                return Clutter.EVENT_PROPAGATE;
            }
        );
    }

    disable() {
        if (this._keyPressHandlerId) {
            Main.messageTray._bannerBin.disconnect(this._keyPressHandlerId);
            this._keyPressHandlerId = null;
        }

        if (this._injectionManager) {
            this._injectionManager.clear();
            this._injectionManager = null;
        }

        this._settings = null;
    }
}
