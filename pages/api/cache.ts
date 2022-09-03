import fs from "fs";

const cachePath = "./.cache";
const FIVE_MINUTES = 5 * 60 * 1000; // ms

export const fetchFromCache = () => {
  if (fs.existsSync(cachePath)) {
    const data = fs.readFileSync(cachePath, { encoding: "utf-8" });
    const { ts, ...rest } = JSON.parse(data);
    if (ts && Date.now() - parseInt(ts) < FIVE_MINUTES) {
      console.log("Cache is still valid");
      return {
        ...rest,
        ts,
      };
    } else {
      console.log("Cache is busted");
      return null;
    }
  } else {
    return null;
  }
};

export const saveToCache = async (data: any) =>
  fs.writeFile(
    cachePath,
    JSON.stringify({
      ...data,
      ts: Date.now(),
    }),
    { encoding: "utf-8" },
    () => {
      console.log("cache created");
    },
  );
