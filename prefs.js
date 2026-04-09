// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (c) 2026 Mathieu-Philippe Bourgeois (matpb)

import Gtk from 'gi://Gtk';
import Gio from 'gi://Gio';
import GLib from 'gi://GLib';

import {ExtensionPreferences} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

export default class NotificationKeyboardActivatePreferences extends ExtensionPreferences {
    getPreferencesWidget() {
        const settings = this.getSettings();

        const grid = new Gtk.Grid({
            margin_top: 18,
            margin_bottom: 18,
            margin_start: 18,
            margin_end: 18,
            row_spacing: 12,
            column_spacing: 18,
        });

        // Auto-focus toggle
        const labelBox = new Gtk.Box({
            orientation: Gtk.Orientation.VERTICAL,
            spacing: 4,
            hexpand: true,
        });

        labelBox.append(new Gtk.Label({
            label: 'Auto-focus notifications',
            hexpand: true,
            halign: Gtk.Align.START,
        }));

        const description = new Gtk.Label({
            label: '<small>Automatically focus banners when they appear.\nWhen off, press Super+N first, then Enter to activate.</small>',
            use_markup: true,
            hexpand: true,
            halign: Gtk.Align.START,
            wrap: true,
        });
        description.add_css_class('dim-label');
        labelBox.append(description);

        const autoFocusSwitch = new Gtk.Switch({
            valign: Gtk.Align.CENTER,
            halign: Gtk.Align.END,
        });
        settings.bind('auto-focus', autoFocusSwitch, 'active', Gio.SettingsBindFlags.DEFAULT);

        grid.attach(labelBox, 0, 0, 1, 1);
        grid.attach(autoFocusSwitch, 1, 0, 1, 1);

        // Test notification button
        const testButton = new Gtk.Button({label: 'Send Test Notification'});
        testButton.connect('clicked', () => {
            Gio.DBus.session.call(
                'org.freedesktop.Notifications',
                '/org/freedesktop/Notifications',
                'org.freedesktop.Notifications',
                'Notify',
                new GLib.Variant('(susssasa{sv}i)', [
                    'Notification Keyboard Activate',
                    0,
                    'input-keyboard-symbolic',
                    'Keyboard Activate Test',
                    'Press Enter to activate, Escape to dismiss',
                    [],
                    {},
                    -1,
                ]),
                null,
                Gio.DBusCallFlags.NONE,
                -1,
                null,
                null
            );
        });
        grid.attach(testButton, 0, 1, 2, 1);

        return grid;
    }
}
