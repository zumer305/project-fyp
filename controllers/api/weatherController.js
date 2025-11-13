const axios = require("axios");

module.exports.current = async (req, res) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) return res.status(400).json({ message: "lat and lon required" });
    const apiKey = process.env.OWM_API_KEY;
    if (!apiKey) return res.status(500).json({ message: "OWM_API_KEY not configured" });
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const { data } = await axios.get(url);
    const payload = {
      temp: data.main?.temp,
      feels_like: data.main?.feels_like,
      humidity: data.main?.humidity,
      wind: data.wind?.speed,
      description: data.weather?.[0]?.description,
      icon: data.weather?.[0]?.icon,
      name: data.name
    };
    return res.json(payload);
  } catch (e) {
    return res.status(500).json({ message: "Weather fetch failed" });
  }
};

module.exports.forecast = async (req, res) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) return res.status(400).json({ message: "lat and lon required" });
    const apiKey = process.env.OWM_API_KEY;
    if (!apiKey) return res.status(500).json({ message: "OWM_API_KEY not configured" });
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const { data } = await axios.get(url);
    const items = (data.list || []).slice(0, 8).map(i => ({
      dt: i.dt,
      temp: i.main?.temp,
      description: i.weather?.[0]?.description,
      icon: i.weather?.[0]?.icon
    }));
    return res.json({ city: data.city?.name, items });
  } catch (e) {
    return res.status(500).json({ message: "Forecast fetch failed" });
  }
};