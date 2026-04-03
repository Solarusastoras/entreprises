const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api/idelis',
    createProxyMiddleware({
      target: 'https://api.idelis.fr',
      changeOrigin: true,
      pathRewrite: {
        '^/api/idelis': '', // On retire le /api/idelis local avant d'envoyer à la vraie API
      },
    })
  );
};
