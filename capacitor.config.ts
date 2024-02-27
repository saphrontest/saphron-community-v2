import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.saphron.app',
  appName: 'saphron-mobile',
  webDir: 'build',
  server: {
    androidScheme: 'https',
    url: 'https://saphronhealth.com/'
  },
  plugins: {
    Keyboard: {
      resize: "body",
      style: "DARK",
      resizeOnFullScreen: true,
      scroll: true
    }
  }
};

export default config;
