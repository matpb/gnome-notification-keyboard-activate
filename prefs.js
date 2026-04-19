// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (c) 2026 Mathieu-Philippe Bourgeois (matpb)

import Adw from 'gi://Adw';
import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import Gtk from 'gi://Gtk';

import {ExtensionPreferences} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

export default class NotificationKeyboardActivatePreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        const settings = this.getSettings();

        const page = new Adw.PreferencesPage();
        window.add(page);

        const behaviorGroup = new Adw.PreferencesGroup({title: 'Behavior'});
        page.add(behaviorGroup);

        const autoFocusRow = new Adw.SwitchRow({
            title: 'Auto-focus notifications',
            subtitle: 'Focus banners automatically when they appear. When off, press Super+N first, then Enter to activate.',
        });
        settings.bind('auto-focus', autoFocusRow, 'active', Gio.SettingsBindFlags.DEFAULT);
        behaviorGroup.add(autoFocusRow);

        const testGroup = new Adw.PreferencesGroup({title: 'Test'});
        page.add(testGroup);

        const testRow = new Adw.ActionRow({
            title: 'Send test notification',
            subtitle: 'Press Enter to activate, Escape to dismiss',
        });
        const testButton = new Gtk.Button({
            label: 'Send',
            valign: Gtk.Align.CENTER,
        });
        testButton.add_css_class('suggested-action');
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
        testRow.add_suffix(testButton);
        testRow.activatable_widget = testButton;
        testGroup.add(testRow);
    }
}
