import localconfig from "./config/kkp.json";

const IS_PRODUCTION = process.env.NODE_ENV === "production";

module.exports = () => {
  return {
    ...localconfig,
    hooks: IS_PRODUCTION
      ? {
          postPublish: [
            {
              file: "sentry-expo/upload-sourcemaps",
              config: {
                organization: "sentry",
                project: "kkp-superapps-dev",
                authToken: process.env.SENTRY_AUTH_TOKEN,
              },
            },
          ],
        }
      : {},
  };
};
