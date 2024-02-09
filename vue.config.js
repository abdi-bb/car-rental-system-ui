const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,

  // custom set
  devServer: {
    public: 'django-wheelsonrent.onrender.com', // Change this to your Render.com subdomain
  },
  
  // custom set
  configureWebpack: {
    resolve: {
      fallback: {
        crypto: require.resolve('crypto-browserify'),
        util: require.resolve('util/'),
        stream: require.resolve('stream-browserify'),
      },
    },
  },
})
