import {
  backButton,
  viewport,
  themeParams,
  miniApp,
  initData,
  $debug,
  init as initSDK,
  disableVerticalSwipes,
  swipeBehavior
} from '@telegram-apps/sdk-react';
// import { postEvent } from '@telegram-apps/sdk';

/**
 * Initializes the application and configures its dependencies.
 */
export function init(debug: boolean): void {
  // Set @telegram-apps/sdk-react debug mode.
  $debug.set(debug);

  // Disable orientation
  // postEvent('web_app_toggle_orientation_lock', {
  //   locked: true,
  // });
  // Initialize special event handlers for Telegram Desktop, Android, iOS, etc.
  // Also, configure the package.
  initSDK();

  // Add Eruda if needed.
  import('eruda')
    .then((lib) => lib.default.init())
    .catch(console.error);

  // Check if all required components are supported.
  if (!backButton.isSupported() || !miniApp.isSupported()) {
    throw new Error('ERR_NOT_SUPPORTED');
  }

  // Mount all components used in the project.
  backButton.mount();
  miniApp.mount();
  themeParams.mount();
  swipeBehavior.mount();
  initData.restore();
  void viewport
    .mount()
    .catch((e) => {
      console.error('Something went wrong mounting the viewport', e);
    })
    .then(() => {
      // if navigator.userAgent is mobile, then requestFullscreen
      if (navigator.userAgent.includes('Mobile')) {
        viewport.requestFullscreen();
      }
      viewport.bindCssVars();
      disableVerticalSwipes();
      viewport.expand();
    });

  // Define components-related CSS variables.
  miniApp.bindCssVars();
  themeParams.bindCssVars();

  miniApp.setHeaderColor('#15191E');
  miniApp.setBackgroundColor('#15191E');
}
