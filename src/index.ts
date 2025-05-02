import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { ISettingRegistry } from '@jupyterlab/settingregistry';
import { IMainMenu } from '@jupyterlab/mainmenu';

const PLUGIN_ID = 'jupyterlab_ai_assistant:plugin';

const plugin: JupyterFrontEndPlugin<void> = {
  id: PLUGIN_ID,
  description: 'Provide some (optional) AI add-ons to a Jupyter Lab environment',
  autoStart: true,
  requires: [ISettingRegistry, IMainMenu],
  activate: (app: JupyterFrontEnd, settingRegistry: ISettingRegistry, mainMenu: IMainMenu) => {
    let apiKey: string | undefined;
    let model: string | undefined;
    let language: string | undefined;

    function loadSettings(settings: ISettingRegistry.ISettings): void {
      apiKey = settings.get('openaiApiKey').composite as string;
      model = settings.get('openaiModel').composite as string;
      language = settings.get('language').composite as string;
      console.log('[AI Assistant] Settings loaded:', { apiKey, model, language });
      // Here: sync to Python helper if desired
    }

    Promise.all([app.restored, settingRegistry.load(PLUGIN_ID)])
      .then(([, settings]) => {
        loadSettings(settings);

        // Listen to changes
        settings.changed.connect(loadSettings);

        // Add commands
        app.commands.addCommand('jupyterlab-ai-assistant:clear-api-key', {
          label: 'Clear OpenAI API Key',
          execute: () => {
            settings.set('openaiApiKey', '');
          }
        });

        // Add menu item under "Settings" menu
        mainMenu.settingsMenu.addGroup([
          { command: 'jupyterlab-ai-assistant:clear-api-key' },
        ], 100);

      })
      .catch(reason => {
        console.error('Failed to load settings:', reason);
      });
  }
};

export default plugin;
