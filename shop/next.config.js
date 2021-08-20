// const withPWA = require('next-pwa')
// const runtimeCaching = require('next-pwa/cache')
// 
// module.exports = withPWA({
//   pwa: {
//     dest: 'public',
//     runtimeCaching,
//   },
// })

module.exports = {
  images: {
    domains: [process.env.IMAGE_HOST],
  },
}
