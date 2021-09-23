// const withPWA = require('next-pwa')
// const runtimeCaching = require('next-pwa/cache')
// 
// module.exports = withPWA({
//   pwa: {
//     dest: 'public',
//     runtimeCaching,
//   },
// })

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  images: {
    domains: [process.env.IMAGE_HOST],
  },
})