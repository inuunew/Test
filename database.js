const database = {
  ff: {
    name: "Free Fire",
    require: ["userId"],
    image: "assets/ff.png",
    qris: false,
    desc: "Top up diamond Free Fire legal & aman",
    detail: "Tanpa login akun, layanan 24 jam",
    regular: [
      { name: "5 Diamond Free Fire", price: "Rp1.200", status: "online" },
      { name: "12 Diamond Free Fire", price: "Rp2.500", status: "online" },
      { name: "50 Diamond Free Fire", price: "Rp7.500", status: "online" },
      { name: "70 Diamond Free Fire", price: "Rp9.500", status: "online" },
      { name: "100 Diamond Free Fire", price: "Rp13.000", status: "online" },
      { name: "140 Diamond Free Fire", price: "Rp19.000", status: "online" },
      { name: "210 Diamond Free Fire", price: "Rp27.000", status: "online" },
      { name: "300 Diamond Free Fire", price: "Rp41.000", status: "online" },
      { name: "355 Diamond Free Fire", price: "Rp46.000", status: "online" },
      { name: "500 Diamond Free Fire", price: "Rp65.000", status: "online" },
      { name: "720 Diamond Free Fire", price: "Rp91.000", status: "online" },
      { name: "1000 Diamond Free Fire", price: "Rp127.000", status: "online" },
      { name: "1450 Diamond Free Fire", price: "Rp183.000", status: "online" },
      { name: "2180 Diamond Free Fire", price: "Rp275.000", status: "online" },
      { name: "3640 Diamond Free Fire", price: "Rp458.000", status: "online" },
      { name: "4000 Diamond Free Fire", price: "Rp516.000", status: "online" },
      { name: "7290 Diamond Free Fire", price: "Rp935.000", status: "online" }
    ],
    membership: [
      { name: "Membership level up pass", price: "Rp15.000", status: "online" },
      { name: "Membership Mingguan", price: "Rp29.000", status: "online" },
      { name: "Membership Bulanan", price: "Rp84.000", status: "online" },
      { name: "Boyah Pass", price: "Rp43.000", status: "online" }
    ]
  },

  ml: {
    name: "Mobile Legends",
    require: ["userId", "server"],
    serverType: "id",
    image: "assets/ml.png",
    qris: false,
    desc: "Top up diamond Mobile Legends cepat & aman",
    detail: "Tanpa login akun, layanan 24 jam",
    regular: [
      { name: "3 Diamond ML", price: "Rp1.500", status: "online" },
      { name: "5 Diamond ML", price: "Rp2.500", status: "online" },
      { name: "12(11+1) Diamond ML", price: "Rp3.800", status: "online" },
      { name: "19(17+2) Diamond ML", price: "Rp5.600", status: "online" },
      { name: "28(25+3) Diamond ML", price: "Rp8.000", status: "online" },
      { name: "36(33+3) Diamond ML", price: "Rp10.000", status: "online" },
      { name: "40(40+4) Diamond ML", price: "Rp11.500", status: "online" },
      { name: "56(51+5) Diamond ML", price: "Rp15.500", status: "online" },
      { name: "59(53+6) Diamond ML", price: "Rp16.500", status: "online" }, 
      { name: "74(69+5) Diamond ML", price: "Rp19.800", status: "online" },
      { name: "86(78+8) Diamond ML", price: "Rp21.500", status: "online" },
      { name: "100 Diamond ML", price: "Rp25.000", status: "online" },
      { name: "112 Diamond ML", price: "Rp30.000", status: "online" },
      { name: "144 Diamond ML", price: "Rp38.000", status: "online" },
      { name: "172 Diamond ML", price: "Rp44.800", status: "online" },
      { name: "185 Diamond ML", price: "Rp48.000", status: "online" },
      { name: "222 Diamond ML", price: "Rp58.000", status: "online" },
      { name: "257 Diamond ML", price: "Rp65.500", status: "online" },
      { name: "284 Diamond ML", price: "Rp73.000", status: "online" }, 
      { name: "278 Diamond ML", price: "Rp74.000", status: "online" },
      { name: "264 Diamond ML", price: "Rp75.000", status: "online" },
      { name: "296 Diamond ML", price: "Rp78.000", status: "online" },
      { name: "301 Diamond ML", price: "Rp80.000", status: "online" }
    ],
    membership: [
      { name: "1X Weekly diamond pass 220", price: "Rp29.000", status: "online" }, 
      { name: "2X Weekly diamond pass 440", price: "Rp57.000", status: "online" }, 
      { name: "3X Weekly diamond pass 660", price: "Rp84.000", status: "online" }
    ]
  },

  pubg: {
    name: "PUBG Mobile",
    require: ["userId"],
    image: "assets/pubg.png",
    qris: false,
    desc: "Top up UC PUBG Mobile cepat & aman",
    detail: "Tanpa login akun, layanan 24 jam",
    regular: [
      { name: "mobile 15 UC", price: "Rp8.000", status: "online" },
      { name: "mobile 35 UC", price: "Rp15.500", status: "online" },
      { name: "mobile 50 UC", price: "Rp16.500", status: "online" },
      { name: "mobile 70 UC", price: "Rp28.000", status: "online" },
      { name: "mobile 100 UC", price: "Rp29.500", status: "online" },
      { name: "mobile 125 UC", price: "Rp46.000", status: "online" },
      { name: "mobile 150 UC", price: "Rp47.000", status: "online" },
      { name: "mobile 200 UC", price: "Rp60.000", status: "online" },
      { name: "mobile 250 UC", price: "Rp73.000", status: "online" },
      { name: "mobile 300 UC", price: "Rp78.000", status: "online" },
      { name: "mobile 375 UC", price: "Rp82.000", status: "online" },
      
      
      
    ],
    membership: []
  },

  genshin: {
    name: "Genshin Impact",
    require: ["userId", "server"],
    serverType: "region",
    image: "assets/genshin.png",
    qris: false,
    desc: "Top up Genesis Crystal Genshin Impact cepat & aman",
    detail: "Tanpa login akun, layanan 24 jam",
    regular: [
      { name: "60 Crystal", price: "Rp12.000", status: "online" },
      { name: "60 Chronal Nexus", price: "Rp14.000", status: "online" },
      { name: "300+30 Crystal", price: "Rp55.000", status: "online" },
      { name: "980+110 Crystal", price: "Rp168.000", status: "online" },
      { name: "980+110 Chronal Nexus", price: "Rp168.000", status: "online" },
      { name: "1280+140 Genesis Crystal", price: "Rp222.000", status: "online" },
      { name: "1980+260 Genesis Crystal", price: "Rp349.000", status: "online" }
    ],
    membership: [
      { name: "Blessing of the Welkin Moon", price: "Rp55.000", status: "online" }, 
      { name: "Blessing of the Welkin Moon x2", price: "Rp109.000", status: "online" }
    ]
  },

  hok: {
    name: "Honor of Kings",
    require: ["userId"],
    image: "assets/hok.png",
    qris: false,
    desc: "Top up Tokens HOK cepat & aman",
    detail: "Tanpa login akun, layanan 24 jam",
    regular: [
      { name: "16 Tokens HOK", price: "Rp3.500", status: "offline" },
      { name: "80 Tokens HOK", price: "Rp15.000", status: "offline" },
      { name: "240 Tokens HOK", price: "Rp45.000", status: "offline" },
      { name: "400 Tokens HOK", price: "Rp73.000", status: "online" },
      { name: "560 Tokens HOK", price: "Rp103.000", status: "online" },
      { name: "800+30 Tokens HOK", price: "Rp146.000", status: "online" }
    ],
    membership: []
  },

  valorant: {
    name: "Valorant",
    require: [],
    image: "assets/valo.png",
    qris: false,
    desc: "Top up VP Valorant cepat & aman",
    detail: "Tanpa login akun, layanan 24 jam",
    regular: [
      { name: "475 VP", price: "Rp53.000", status: "online" },
      { name: "1000 VP", price: "Rp105.000", status: "online" },
      { name: "1475 VP", price: "Rp158.000", status: "online" },
      { name: "2050 VP", price: "Rp210.000", status: "online" },
      { name: "2525 VP", price: "Rp264.000", status: "online" }
    ],
    membership: []
  },

  fcmobile: {
    name: "FC Mobile",
    require: ["userId"],
    image: "assets/fcm.png",
    qris: false,
    desc: "Top up FC Points FC Mobile cepat & aman",
    detail: "Tanpa login akun, layanan 24 jam",
    regular: [
      { name: "40 FC Points", price: "Rp7.000", status: "offline" },
      { name: "39 silver", price: "Rp7.000", status: "online" },
      { name: "100 FC Points", price: "Rp16.500", status: "offline" },
      { name: "99 silver", price: "Rp16.500", status: "offline" },
      { name: "520 FC Points", price: "Rp77.000", status: "online" }, 
      { name: "999 silver", price: "Rp154.000", status: "online" }, 
      { name: "1070 silver", price: "Rp154.000", status: "online" }
    ],
    membership: []
  },

  codm: {
    name: "Call of Duty",
    require: ["userId"],
    image: "assets/cod.png",
    qris: false,
    desc: "Top up CP COD cepat & aman",
    detail: "Tanpa login akun, layanan 24 jam",
    regular: [
      { name: "26+5 CP", price: "Rp5.500", status: "online" },
      { name: "53+9 CP", price: "Rp10.000", status: "online" },
      { name: "106+21 CP", price: "Rp20.000", status: "online" },
      { name: "264+53 CP", price: "Rp45.000", status: "online" },
      { name: "645 CP", price: "Rp92.000", status: "online" }
    ],
    membership: []
  },

  asphalt9: {
    name: "Asphalt 9",
    require: ["userId"],
    image: "assets/asphalt.png",
    qris: false,
    desc: "Top up Tokens Asphalt cepat & aman",
    detail: "Tanpa login akun, layanan 24 jam",
    regular: [
      { name: "54 Tokens Asphalt", price: "Rp14.000", status: "online" },
      { name: "149 Tokens Asphalt", price: "Rp36.000", status: "online" },
      { name: "318 Tokens Asphalt", price: "Rp70.000", status: "offline" },
      { name: "706 Tokens Asphalt", price: "Rp145.000", status: "online" },
      { name: "1498 Tokens Asphalt", price: "Rp290.000", status: "online" }
    ],
    membership: []
  }, 
  roblox: {
    name: "Roblox Gift Card",
    require: ["voucher"],
    image: "https://files.catbox.moe/um0wr8.png",
    qris: false,
    desc: "Roblox Gift Card",
    detail: "tutorial redeem kunjungi website https://www.roblox.com/redeem dan pastikan masuk dengan akun roblox kalian agar gift card masuk ke akun kamu.",
    regular: [
      { name: "RGC (IDR)50.000", price: "Rp51.000", status: "online" },
      { name: "RGC (IDR)65.000", price: "Rp65.000", status: "online" },
      { name: "RGC (IDR)100.000", price: "Rp100.000", status: "offline" },
      { name: "RGC (US)$10", price: "Rp175.000", status: "online" },
      { name: "RGC (IDR)200.000", price: "Rp200.000", status: "online" }
    ],
    membership: []
  }
};

// databaseOther
const databaseOther = {
  alighm: {
    name: "[AKUN]ALIGHT MOTION PREM EXP 2027",
    require: ["voucher"],
    image: "https://files.catbox.moe/7h9pqr.png",
    qris: true,
    desc: "Bersifat AKUN bukan mod",
    detail: "bergaransi 3 bulan setelah pembelian, aktif sampai januari 2027. made by gmail generator",
    items: [
      { name: "AM Sharing", price: "Rp1.000", status: "online" },
      { name: "AM Private", price: "Rp5.000", status: "online" }
    ],
    membership: []
  }, 
  viu: {
    name: "[AKUN]VIU DRAMA",
    require: ["voucher"],
    image: "https://files.catbox.moe/7h9pqr.png",
    qris: true,
    desc: "Bersifat AKUN bukan mod",
    detail: "bergaransi 3 bulan setelah pembelian",
    items: [
      { name: "Viu 1 bulan", price: "Rp500", status: "online" },
      { name: "Viu 3 bulan", price: "Rp1.000", status: "online" },
      { name: "Viu 4 bulan", price: "Rp1.500", status: "online" },
      { name: "Viu 1 tahun", price: "Rp3.000", status: "online" },
      { name: "Viu Lifetime", price: "Rp5.000", status: "online" },
    ],
    membership: []
  }
};

// databasePanel
const databasePanel = {
  panel: {
    name: "Panel Bot wa/tele",
    require: ["username"],
    image: "https://files.catbox.moe/a4jl1w.jpeg",
    qris: true,
    desc: "Panel bot whatsapp/telegram",
    detail: "Aktif selama 30 hari GARANSI FULL",
    items: [
      { name: "1GB", price: "2000", status: "online" },
      { name: "2GB", price: "3000", status: "online" },
      { name: "3GB", price: "4000", status: "online" },
      { name: "4GB", price: "5000", status: "online" },
      { name: "5GB", price: "6000", status: "online" },
      { name: "6GB", price: "7000", status: "online" },
      { name: "7GB", price: "8000", status: "online" },
      { name: "8GB", price: "9000", status: "online" },
      { name: "Unlimited", price: "10000", status: "online" }, 
      { name: "Reseller public", price: "15000", status: "online" },
      { name: "Reseller private", price: "20000", status: "online" }, 
      { name: "Admin panel public", price: "20000", status: "online" }
    ],
    membership: []
  },
  vps1: {
    name: "VPS DIGITAL OCEAN",
    require: ["voucher"],
    image: "https://files.catbox.moe/n8f64z.png",
    qris: false,
    desc: "VPS LEGAL DO BILL VCC",
    detail: "Aktif 1bulan Garansi 25h,no instalasi apapun(kosongan)",
    items: [
      { name: "VPS R2C2 [LEGAL]", price: "25.000", status: "online" }, 
      { name: "VPS R4C2 [LEGAL]", price: "30.000", status: "online" }, 
      { name: "VPS R8C4 [LEGAL]", price: "35.000", status: "online" }, 
      { name: "VPS R16C4 [LEGAL]", price: "40.000", status: "offline" }
    ],
    membership: []
  }, 
  do1: {
    name: "AKUN DIGITAL OCEAN",
    require: ["voucher"],
    image: "https://files.catbox.moe/n8f64z.png",
    qris: false,
    desc: "DIGITAL OCEAN GMAIL MADE AWET TAHAN BANTING",
    detail: "NOTE : NO GARANSI, BUY=PAHAM!",
    items: [
      { name: "D.O BILL VCC 3 Droplet", price: "100.000", status: "online" }, 
      { name: "D.O BILL VCC 10 Droplet", price: "130.000", status: "online" }, 
      { name: "D.O BILL GPAY 10 Droplet", price: "120.000", status: "offline" }
    ],
    membership: []
  }
};