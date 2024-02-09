const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  
  // custom set
  configureWebpack: {
    devServer: {
      allowedHosts: ['django-wheelsonrent.onrender.com'], // Change this to your Render.com subdomain
    },
    resolve: {
      fallback: {
        crypto: require.resolve('crypto-browserify'),
        util: require.resolve('util/'),
        stream: require.resolve('stream-browserify'),
      },
    },
  },
})
