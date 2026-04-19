UUID = notification-keyboard-activate@matpb
INSTALL_DIR = $(HOME)/.local/share/gnome-shell/extensions/$(UUID)
ZIP = $(UUID).shell-extension.zip

.PHONY: install uninstall schemas zip clean

schemas:
	glib-compile-schemas schemas/

install: schemas
	mkdir -p $(INSTALL_DIR)/schemas
	cp extension.js prefs.js metadata.json $(INSTALL_DIR)/
	cp schemas/*.xml schemas/*.compiled $(INSTALL_DIR)/schemas/
	@echo "Installed. Restart GNOME Shell to activate."

uninstall:
	rm -rf $(INSTALL_DIR)
	@echo "Uninstalled. Restart GNOME Shell to complete removal."

zip: schemas
	rm -f $(ZIP)
	zip -r $(ZIP) extension.js prefs.js metadata.json LICENSE \
		schemas/*.xml schemas/*.compiled
	@echo "Built $(ZIP) — upload to https://extensions.gnome.org/upload/"

clean:
	rm -f $(ZIP) schemas/gschemas.compiled
