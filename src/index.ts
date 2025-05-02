import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { ISettingRegistry } from '@jupyterlab/settingregistry';

/**
 * Initialization data for the jupyterlab_ai_assistant extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab_ai_assistant:plugin',
  description: 'Provide some (optional) AI add-ons to a Jupyter Lab environment',
  autoStart: true,
  optional: [ISettingRegistry],
  activate: (app: JupyterFrontEnd, settingRegistry: ISettingRegistry | null) => {
    console.log('JupyterLab extension jupyterlab_ai_assistant is activated!');

    if (settingRegistry) {
      settingRegistry
        .load(plugin.id)
        .then(settings => {
          console.log('jupyterlab_ai_assistant settings loaded:', settings.composite);
        })
        .catch(reason => {
          console.error('Failed to load settings for jupyterlab_ai_assistant.', reason);
        });
    }
  }
};

export default plugin;
