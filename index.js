const axios = require("axios");
const arpScanner = require("arpscan/promise");

const token = process.env.SCARLIST_TOKEN;
const interface = process.env.SCARLIST_INTERFACE || "wlan0";
const host = process.env.SCARLIST_HOST;

axios.defaults.baseURL = host;
axios.defaults.headers.common["Authorization"] = token;

(async () => {
  const data = await arpScanner({ interface });
  const registeredMa = Object.keys((await axios.get("/mac_addrs")).data);

  const liveMa = data.map(v => v.mac.toLowerCase());
  const macAddrs = liveMa.filter(ma => ma in registeredMa);
  console.log({ macAddrs, liveMa, registeredMa });
  //scarlist.anozon.me/mac_addrs?room_id=planck_units
  if (macAddrs.length === 0) {
    return;
  }
  await axios.post("/log", {
    room_id: "cps",
    mac_addrs: macAddrs
  });
})();
