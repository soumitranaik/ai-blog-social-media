const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/v1',  // Adjust the path based on your API
    createProxyMiddleware({
      target: 'https://api.openai.com',
      changeOrigin: true,
    })
  );

  app.use(
    '/images',  // Adjust the path based on your Firebase storage URL
    createProxyMiddleware({
      target: 'https://firebasestorage.googleapis.com',
      changeOrigin: true,
    })
  );
};
