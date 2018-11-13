// @flow
const axios = require("axios");
const arpScanner = require("arpscan/promise");

const config /* :{
  host: string,
  token: string,
  profiles: Array<{ interface: string, roomId: string }>
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

const scan = async (
  profile /* :{ interface: string, roomId: string } */,
  registeredMaStr
) => {
  const { interface, roomId } = profile;
  const units /* Array<{ ip: string,
    mac: string,
    vendor: string,
    timestamp: number }>
    */ = await arpScanner(
    { interface }
  );
  const liveUnits = units.filter(
    unit => registeredMaStr.indexOf(unit.mac.toLowerCase()) !== -1
  );
  const macAddrs = liveUnits.map(v => v.mac.toLowerCase());
  console.log({ interface, macAddrs, roomId });
  if (macAddrs.length > 0) {
    api.postLog(roomId, macAddrs);
  }
};

(async () => {
  const registeredMa = await api.getMacAddrs();
  const registeredMaStr = registeredMa.join("__");
  config.profiles.forEach(profile => {
    scan(profile, registeredMaStr);
  });
})();
