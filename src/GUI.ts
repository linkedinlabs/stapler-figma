import './assets/css/main.scss';
import App from './views/App.svelte'; // eslint-disable-line import/extensions

const app = new App({
  target: document.body,
  props: {
    inspect: 'styles', // 'styles' or 'components'
    items: null,
  },
});

/**
 * @description Posts a message to the main thread with `loaded` set to `true`. Used in the
 * main thread to indicate the GUI is listening.
 *
 * @kind function
 * @name sendLoadedMsg
 *
 * @returns {null}
 */
const sendLoadedMsg = (): void => {
  // send message to main thread indicating UI has loaded
  parent.postMessage({ pluginMessage: { loaded: true } }, '*');

  return null;
};

/* process Messages from the plugin */

/** WIP
 * @description Clones a template html element and then updates the clone’s contents to match
 * the supplied options for each layer in the supplied array.
 *
 * @kind function
 * @name updateSelected
 *
 * @param {Array} items An array of items to clone. Each entry should include an `id`,
 * an `assignment`, `originalText`, `proposedText`, and a `locked` boolean.
 *
 * @returns {null}
 */
const updateSelected = (items: Array<{
  id: string,
  assignment: string,
  name: string,
  nodeType: 'text' | 'shape',
  originalImage: Uint8Array,
  originalText: string,
  proposedText: string,
  rounded: 'all' | 'none' | 'some',
  locked: boolean,
}>): void => {
  if (items) {
    app.items = items;
  }
};

/** WIP
 * @description Watches for incoming messages from the plugin’s main thread and dispatches
 * them to the appropriate GUI actions.
 *
 * @kind function
 * @name watchIncomingMessages
 *
 * @returns {null}
 */
const watchIncomingMessages = (): void => {
  onmessage = ( // eslint-disable-line no-undef
    event: {
      data: {
        pluginMessage: {
          action: string,
          payload: any,
        }
      }
    },
  ) => {
    const { pluginMessage } = event.data;
    const { payload } = pluginMessage;
    const { selected } = payload;

    switch (pluginMessage.action) {
      case 'refreshState':
        updateSelected(selected);
        break;
      // case 'resetState':
      //   setButtonState('ready');
      //   break;
      default:
        return null;
    }

    return null;
  };
};

// init GUI
window.app = app; // eslint-disable-line no-undef
// watchActions();
watchIncomingMessages();
sendLoadedMsg();

export default app;
