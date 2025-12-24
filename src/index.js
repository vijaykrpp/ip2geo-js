const axios = require("axios");

class Ip2Geo {
  static BASE_URL = "https://api.ip2geoapi.com/ip";

  constructor(apiKey = null, options = {}) {
    this.apiKey = apiKey;
    this.timeout = options.timeout || 60000;
  }

  async lookup(ip = null, options = {}) {
    const { format = null, callback = null } = options;

    if (callback && format !== "jsonp") {
      throw new Error("callback can only be used when format is 'jsonp'");
    }

    const params = {};

    if (this.apiKey) {
      params.key = this.apiKey;
    }

    if (format) {
      params.format = format;
    }

    if (callback) {
      params.callback = callback;
    }

    const url = ip
      ? `${Ip2Geo.BASE_URL}/${ip}`
      : Ip2Geo.BASE_URL;

    let response;

    try {
      response = await axios.get(url, {
        params,
        timeout: this.timeout,
        validateStatus: () => true // IMPORTANT: never throw on HTTP status
      });
    } catch (err) {
      // TRUE transport failure (DNS, timeout, connection)
      throw new Error("Unable to reach Ip2Geo API");
    }

    // Default JSON → return decoded object AS-IS
    if (!format || format === "json") {
      return response.data;
    }

    // XML / YAML / JSONP → raw response
    return response.data;
  }
}

module.exports = Ip2Geo;
