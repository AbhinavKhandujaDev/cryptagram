/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: [
      "img.icons8.com",
      "i.pravatar.cc",
      "source.unsplash.com",
      "ipfs.infura.io",
    ],
  },
  BASE_URL: process.env.BASE_URL,
  PORT: process.env.PORT,
  CLIENT_BASE_URL: process.env.CLIENT_BASE_URL,
  MEDIA_BASE_URL: process.env.MEDIA_BASE_URL,
};
