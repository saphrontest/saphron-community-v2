import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.saphron.app',
  appName: 'saphron-mobile',
  webDir: 'build',
  server: {
    androidScheme: 'https',
    url: 'http://localhost:3000'
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
