// @flow
const axios = require("axios");
const arpScanner = require("arpscan/promise");

const config /* :{
  host: string,
  interface: string,
  token: string,
  profiles: Array<{ segment: string, roomId: string }>
} */ = require("./config");

axios.defaults.baseURL = config.host;
axios.defaults.headers.common["Authorization"] = config.token;

const api = {
  getMacAddrs: async () => {
    const res = await axios.get("/mac_addrs");
    return Object.keys(res.data);
  },
  postLog: (room_id /* :string */, mac_addrs /* :string[] */) => {
    return axios.post("/log", {
      room_id,
      mac_addrs
    });
  }
};

(async () => {
  const units /* { ip: string,
    mac: string,
    vendor: string,
    timestamp: number }
    */ = await arpScanner(
    { interface: config.interface }
  );
  const registeredMa = await api.getMacAddrs();
  const registeredMaStr = registeredMa.join("__");

  const liveUnits = units.filter(
    unit => registeredMaStr.indexOf(unit.mac.toLowerCase()) !== -1
  );

  console.log({ registeredMa });
  config.profiles.forEach(({ segment, roomId }) => {
    const macAddrs = liveUnits
      .filter(unit => unit.ip.indexOf(segment) !== -1)
      .map(v => v.mac.toLowerCase());
    console.log({ segment, macAddrs, roomId });
    if (macAddrs.length > 0) {
      api.postLog(roomId, macAddrs);
    }
  });
})();
