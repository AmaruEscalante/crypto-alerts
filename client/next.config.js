module.exports = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
  env: {
    AUTH0_DOMAIN: "dev-1la8x365.us.auth0.com",
    AUTH0_CLIENT_ID: "MC6xOE60pd9xC1goZz3Vw2lo86GrqonO",
    CALLBACK_URL: "http://localhost:3000/",
  },
};
