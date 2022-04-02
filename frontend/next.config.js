module.exports = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/post',
        // destination: 'http://localhost:4000/api/image-upload',
        destination: 'http://9f51-188-247-65-132.ngrok.io/api/image-upload',
      },
    ]
  },
}
