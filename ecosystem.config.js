module.exports = {
  apps: [{
    name: "donghua",
    script: "npm",
    args: "start",
    cwd: "/home/ubuntu/donghua",
    env: {
      PORT: 3000,
      NODE_ENV: "production",
      NEXT_PUBLIC_API_BASE_URL: "https://hh3d.id.vn/api",
      NEXT_PUBLIC_SECERT_CRYPTO_KEY_PRODUCTS_DAILYMOTION_SERVER: "24062003",
      NEXT_PUBLIC_SITE_URL: "https://hh3dtq.site",
      NEXT_PUBLIC_G_ID: "G-0EEY3R7F0S",
      NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION: "aNoVo34Nv7bVSvnx3iM0WWJHePdMclD4h1_YNqtb-jU"
    }
  }]
}
