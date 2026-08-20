import DC from '@dreadcast/ddk';
import type { RegisteredScript, Setting, Settings, SettingValue } from '@dreadcast/ddk';
import type { ScriptEntry } from '@dreadcast/registry';

const { h } = DC.dom;

/** Un script propose-t-il des réglages ? */
export const hasSettings = (id: string): boolean => {
  const definition = DC.scripts.get(id);
  return definition !== undefined && (definition.settings?.length ?? 0) > 0;
};

const field = (
  setting: Setting,
  value: SettingValue,
  onChange: (value: SettingValue) => void,
): HTMLElement => {
  const id = `dcsm_setting_${setting.key}`;

  switch (setting.type) {
    case 'boolean':
      return DC.ui.checkbox(id, value === true, onChange);

    case 'number':
      return h('input', {
        id,
        type: 'number',
        value: String(value),
        ...(setting.min === undefined ? {} : { min: String(setting.min) }),
        ...(setting.max === undefined ? {} : { max: String(setting.max) }),
        ...(setting.step === undefined ? {} : { step: String(setting.step) }),
        style: { color: 'white' },
        on: {
          input: (event) => onChange(Number((event.target as HTMLInputElement).value)),
        },
      });

    case 'color':
      return DC.ui.colorPicker(id, String(value), onChange);

    case 'select':
      return h(
        'select',
        {
          id,
          style: { color: 'white' },
          on: {
            change: (event) => onChange((event.target as HTMLSelectElement).value),
          },
        },
        setting.options.map((option) =>
          h(
            'option',
            {
              value: option.value,
              ...(option.value === value ? { selected: true } : {}),
            },
            option.label,
          ),
        ),
      );

    case 'text':
      return h('input', {
        id,
        type: 'text',
        value: String(value),
        ...(setting.placeholder === undefined ? {} : { placeholder: setting.placeholder }),
        style: { color: 'white' },
        on: {
          input: (event) => onChange((event.target as HTMLInputElement).value),
        },
      });
  }
};

const row = (setting: Setting, draft: Settings): HTMLElement =>
  h(
    'div',
    {
      style: {
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
        marginBottom: '0.75rem',
      },
    },
    h('label', { for: `dcsm_setting_${setting.key}`, style: { flex: '1' } }, setting.label),
    field(setting, draft[setting.key] as SettingValue, (value) => {
      draft[setting.key] = value;
    }),
    setting.help === undefined
      ? null
      : h('small', { class: 'couleur5', style: { flex: '1' } }, setting.help),
  );

/**
 * Écran de réglages d'un script.
 *
 * Les scripts lisent leurs réglages au démarrage : une modification ne prend
 * effet qu'au rechargement de la page, comme pour l'activation d'un script.
 */
export const openSettings = (script: ScriptEntry, definition: RegisteredScript): void => {
  const draft: Settings = { ...DC.scripts.readSettings(definition) };
  const settings = definition.settings ?? [];

  DC.ui.popUp(
    `dcsm_settings_${script.id}`,
    `Réglages : ${script.name}`,
    h(
      'div',
      { style: { color: 'white', minWidth: '420px' } },
      settings.map((setting) => row(setting, draft)),
      DC.ui.textButton(`dcsm_settings_${script.id}_save`, 'Sauvegarder', () => {
        DC.scripts.writeSettings(script.id, draft);
        engine.closeDataBox(`dcsm_settings_${script.id}`);
      }),
      h(
        'p',
        null,
        h(
          'em',
          { class: 'couleur5' },
          'Les réglages sont appliqués au prochain chargement de la page.',
        ),
      ),
    ),
  );
};
