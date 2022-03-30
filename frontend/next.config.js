module.exports = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/post',
        destination: 'http://localhost:4000/api/image-upload',
      },
    ]
  },
}
