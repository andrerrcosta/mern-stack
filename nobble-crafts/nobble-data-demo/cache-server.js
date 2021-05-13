const Profiles = require("../nobble-common-demo/dev-tools/profile/profiles");
const Assert = require("../nobble-common-demo/utils/assertions");
const ObjectMapper = require("../nobble-common-demo/utils/object-mapper");
const { isValid } = require("../nobble-common-demo/utils/optional");
const Terminal = require("../nobble-common-demo/utils/terminal.utils");
const cron = require("node-cron");

/**
 * Fake Cache Server.
 * Scalability 0.
 * Reliability: it's reliable.
 * Should you do something like that? i don't think so.
 * Do i want to configurate or create some real cache db? No, i do not.
 */

class CacheServer {

  static run() {
    cron.schedule("* * * * *", () => {
      for (const [value] of collections.entries()) {
        value.clearExpiredData();
      }
    });
  }

  static createCollection(collection) {
    Assert.isString(collection);
    let config = Object.assign({}, cacheServerConfig);
    config.collection = collection;
    if (!collections.has(collection)) {
      collections.set(collection, new CacheCollection(config));
    } else {
      Terminal.error("CacheServer", `The collection "${collection}" already exists`);
      throw new Error(`The collection "${collection}" already exists`)
    }
    return createCacheServerConfig(config);
  }

  static hasCollection(collection) {
    return collections.has(collection);
  }

  static hasKey(collection, key) {
    let cacheStore = collections.get(collection);
    if (isValid(cacheStore)) {
      return cacheStore.has(key);
    }
    return false;
  }

  static add(collection, key, value) {
    Assert.isString(collection);
    Assert.isString(key);
    Terminal.info("CacheServer:ADD", key, value);
    let cacheCollection = collections.get(collection);
    if (isValid(cacheCollection)) {
      if (cacheCollection.has(key, value)) {
        Terminal.error("CacheServer", `Cache for "${key}" already exists`);
        throw new Error(`Cache for "${key}" already exists`);
      } else {
        cacheCollection.set(key, value);
      }

    } else {
      Terminal.error("CacheServer", `Collection "${collection}" not found`);
      throw new Error(`Collection "${collection}" not found`)
    }
    return this;
  }

  static set(collection, key, value) {
    Assert.isString(collection);
    Assert.isString(key);
    let cacheCollection = collections.get(collection);
    if (isValid(cacheCollection)) {
      cacheCollection.set(key, value);
    } else {
      Terminal.error("CacheServer", `Collection "${collection}" not found`);
      throw new Error(`Collection "${collection}" not found`)
    }
    return this;
  }

  static setWithRetry(collection, key, value) {
    Assert.isString(collection);
    Assert.isString(key);
    let cacheCollection = collections.get(collection);
    if (isValid(cacheCollection)) {
      if (cacheCollection.has(key)) {
        let retry = 0;
        while (cacheCollection.has(key)) {
          key += ++retry;
        }
      }
      cacheCollection.set(key, value);
    } else {
      Terminal.error("CacheServer", `Collection "${collection}" not found`);
      throw new Error(`Collection "${collection}" not found`)
    }
    return this;
  }

  static get(collection, key) {
    Assert.isString(collection);
    Assert.isString(key);
    let cacheCollection = collections.get(collection);
    if (isValid(cacheCollection)) {
      return cacheCollection.get(key);
    } else {
      Terminal.error("CacheServer", `Collection "${collection}" not found`);
      throw new Error(`Collection "${collection}" not found`);
    }
  }

  static getCollection(collection) {
    Assert.isString(collection);
    return collections.get(collection);
  }

  static getAllCollections() {
    return collections.values();
  }

  static setOrRefresh(collection, key, value) {
    Assert.isString(collection);
    Assert.isString(key);
    let cacheCollection = collections.get(collection);
    if (isValid(cacheCollection)) {
      if (cacheCollection.has(key)) cacheCollection.refreshData(key);
      else cacheCollection.add(key, value);
    } else {
      Terminal.error("CacheServer", `Collection "${collection}" not found`);
      throw new Error(`Collection "${collection}" not found`)
    }
    return this;
  }

  static refresh(collection, key) {
    Assert.isString(collection);
    Assert.isString(key);
    let cacheCollection = collections.get(collection);
    if (isValid(cacheCollection)) {
      cacheCollection.refreshData(key);
    } else {
      Terminal.error("CacheServer", `Collection "${collection}" not found`);
      throw new Error(`Collection "${collection}" not found`)
    }
    return this;
  }

  static clearServer() {
    collections = new Map();
  }
}

const collections = new Map();

const cacheServerConfig = {
  collection: undefined,
  expiration: undefined
};

const createCacheServerConfig = (sharedConfig) => {

  let config = {
    expiration: 0,
  };

  return {
    expiration(expires) {
      config["expires"] = expires;
      if (isValid(sharedConfig)) sharedConfig["expires"] = config.expires;
      return this;
    },
    getConfig() {
      return config;
    },
    done() {
      if (isValid(config.profile)) Profiles.setProperty(`cacheserver-${config.collection}`, config, config.profile);
      return CacheServer;
    }
  }
}

class CacheCollection {

  constructor(config) {
    this.config = { profile: "default", expiration: 0 };
    if (isValid(config)) this.config = ObjectMapper.replace(this.config, config);
    this.store = new Map();
  }

  has(key) {
    return this.store.has(key);
  }

  set(key, value) {
    Assert.isString(key);
    this.store.set(key, { createdAt: new Date().getTime(), value: value });
  }

  get(key) {
    Assert.isString(key);
    if (this.store.has(key) && !this.isExpired(key)) {
      return this.store.get(key).value;
    }
  }

  delete(key) {
    this.store.delete(key);
  }

  clear() {
    this.store.clear();
  }

  refreshData(key) {
    this.store.get(key).createdAt = new Date();
  }

  isExpired(key) {
    let now = new Date().getTime();
    let data = this.store.get(key);
    if (this.config.expiration === 0) return false;
    return data.createdAt + this.config.expiration >= now;
  }

  clearExpiredData() {
    for (const [key, value] of this.store.entries()) {
      if (value.createdAt + this.config.expiration >= now) {
        this.store.delete(key);
      }
    }
  }

  getExpiredData() {
    let output = [];
    let now = new Date().getTime();
    for (const [key, value] of this.store.entries()) {
      if (value.createdAt + this.config.expiration >= now) {
        output.push(this.store.get(key))
      }
    }
  }

  getValidData() {
    let output = [];
    let now = new Date().getTime();
    for (const [key, value] of this.store.entries()) {
      if (value.createdAt + this.config.expiration < now) {
        output.push(this.store.get(key))
      }
    }
  }
}

module.exports = CacheServer;