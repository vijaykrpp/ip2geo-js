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

    try {
      const response = await axios.get(url, {
        params,
        timeout: this.timeout
      });

      // JSON is default
      if (!format || format === "json") {
        if (!response.data?.success) {
          throw new Error(response.data?.error || "Unknown API error");
        }
        return response.data;
      }

      // XML / YAML / JSONP → raw response
      return response.data;
    } catch (err) {
      if (err.response?.data?.error) {
        throw new Error(err.response.data.error);
      }
      throw err;
    }
  }
}

module.exports = Ip2Geo;
