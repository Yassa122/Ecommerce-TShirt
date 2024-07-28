/** @type {import('next').NextConfig} */
const withPWA = require("@ducanh2912/next-pwa").default({
    dest: "public",
   cacheOnFrontEndNav: true,
   aggressiveFrontEndNavCaching: true,
   reloadOnOnLine: true,  
    swcMinify: true,
    disable:false,
    workboxOPtions:{
        disableDevLogs:true
    }
});
  
const nextConfig = {};

  // Your Next config is automatically typed!
  module.exports = withPWA(nextConfig);