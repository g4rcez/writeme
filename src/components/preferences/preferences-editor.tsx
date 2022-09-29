import { Dialog } from "../dialog";
import { FaHouseUser } from "react-icons/fa";
import { usePreferences } from "./preferences";
import { defaultExtensionsEnable } from "../editor/editor-preferences";
import { Checkbox } from "../form/checkbox";
import { Strings } from "../../lib/strings";

export const PreferencesEditor = () => {
  const [preferences, setPreferences] = usePreferences();

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <button className="flex items-center gap-x-2 link:text-main-500 transition-colors border-b border-transparent link:border-main-500">
          <FaHouseUser aria-hidden="true" />
          Preferences
        </button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>Edit your preferences</Dialog.Title>
        <Dialog.Description>
          Here you can edit your Preferences, for dark/light mode or your editor extensions enabled by default.
        </Dialog.Description>
        <div className={"mt-8"}>
          <ul>
            {defaultExtensionsEnable.map((extension) => {
              const checked = preferences.extensions.includes(extension);
              return (
                <li key={`checkbox-preferences-extensions-${extension}`}>
                  <Checkbox
                    onCheckedChange={() => {
                      const result = checked
                        ? preferences.extensions.filter((i) => extension !== i)
                        : [...preferences.extensions, extension];
                      setPreferences("extensions", result);
                    }}
                    id={`checkbox-preferences-extensions-${extension}`}
                    checked={checked}
                    value={checked ? "on" : "off"}
                  >
                    {Strings.capitalize(extension)}
                  </Checkbox>
                </li>
              );
            })}
          </ul>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
};
