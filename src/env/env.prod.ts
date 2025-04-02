import { EnvConfig } from './env-config.interface';
const packageJson = require('../../package.json');

export const Env: EnvConfig = {
    ENV_NAME: 'Prod',
    IS_PRODUCTION: true,
    VERSION: (packageJson && packageJson.version) || 'Unknown',
    API: {
        SERVER_URL: 'https://test-dgf.beone.edu.vn/',
        DEFAULT_SPACE: 'Xcpn8bN3Kk6k3Emwp',
    },
    FIREBASE: {
        APP_ID: '1:1064852316065:web:72fee478f997866c44f5e0',
        PROJECT_ID: 'test-sms-cd26d',
        API_KEY: 'AIzaSyB0hyyodx8kRqtC3tfRAu9EHudAqZaKhZ4',
        AUTH_DOMAIN: 'test-sms-cd26d.firebaseapp.com',
        STORAGE_BUCKET: 'test-sms-cd26d.appspot.com',
        MESSAGING_SENDER_ID: '1064852316065',
        MEASUREMENT_ID: 'G-BXRTMVHKQ7',
    },
    ZALO: {
        ENABLE: true,
        PHONE_NUMBER: '0949882552',
    },
    FACEBOOK: {
        ENABLE: true,
        PAGE_ID: '122704204149094',
        SCRIPT_URL: 'https://connect.facebook.net/vi_VN/sdk/xfbml.customerchat.js',
    },
    DEFAULT_LANGUAGE: 'vi',
    LANGUAGES: ['vi', 'en'],
};
