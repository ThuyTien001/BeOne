export interface EnvConfig {
    API: {
        SERVER_URL: string;
        DEFAULT_SPACE?: string;
    };
    FIREBASE: {
        APP_ID: string;
        PROJECT_ID: string;
        API_KEY: string;
        AUTH_DOMAIN: string;
        STORAGE_BUCKET: string;
        MESSAGING_SENDER_ID: string;
        MEASUREMENT_ID: string;
    },
    ZALO?: {
        ENABLE: boolean;
        PHONE_NUMBER: string;
    },
    FACEBOOK?: {
        ENABLE: boolean;
        PAGE_ID: string;
        SCRIPT_URL: string;
    },
    IS_PRODUCTION: boolean;
    ENV_NAME?: string;
    VERSION: string;
    DEFAULT_LANGUAGE?: string;
    LANGUAGES?: Array<string>;
}
