import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.saphron.app',
  appName: 'Saphron Mobile',
  webDir: 'build',
  server: {
    url: 'https://saphronhealth.com'
  },
  plugins: {
    Keyboard: {
      resize: 'native',
      resizeOnFullScreen: true,
      scroll: true
    },
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      launchFadeOutDuration: 3000,
      showSpinner: true,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      spinnerColor: "#999999",
      splashFullScreen: true,
      splashImmersive: true,
      layoutName: "launch_screen",
      useDialog: true
    }
  }
};

export default config;
