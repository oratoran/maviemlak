import fs from "fs";
import { promisify } from "util";

export const readFile = promisify(fs.readFile);
export const writeFile = promisify(fs.writeFile);

type CacheTypes = "listings" | "pages" | "locations";

export async function createCustomUrlIdIndex(
  cache: CacheTypes,
  urlIdCache: Object
) {
  const cacheFile = `generated/${cache}.url_cache`;
  return writeFile(cacheFile, JSON.stringify(urlIdCache), "utf8").catch((e) => {
    console.log("Error writing", e);
  });
}

export async function getUrlCache(cache: CacheTypes) {
  let urlIdCache: null | { [x: string]: any } = null;

  try {
    urlIdCache = JSON.parse(
      await readFile(`generated/${cache}.url_cache`, "utf8")
    );
  } catch (_) {
    console.log("Error reading", _);
  }

  return urlIdCache;
}
