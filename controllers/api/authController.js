const jwt = require("jsonwebtoken");
const User = require("../../models/user.js");

function signToken(user) {
  return jwt.sign({ id: user._id, role: user.role || "user" }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

module.exports.signup = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "username, email, password required" });
    }
    const newUser = new User({ username, email, role: role === "admin" ? "admin" : "user" });
    const registered = await User.register(newUser, password);
    const token = signToken(registered);
    return res.status(201).json({ token, user: { id: registered._id, username: registered.username, email: registered.email, role: registered.role } });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

module.exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: "username and password required" });
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    const result = await user.authenticate(password);
    if (!result.user) return res.status(401).json({ message: "Invalid credentials" });
    const token = signToken(user);
    return res.json({ token, user: { id: user._id, username: user.username, email: user.email, role: user.role } });
  } catch (e) {
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports.logout = async (req, res) => {
  // Stateless JWT: client should discard token
  return res.json({ message: "Logged out" });
};

module.exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("username email role");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json({ user: { id: user._id, username: user.username, email: user.email, role: user.role } });
  } catch (e) {
    return res.status(500).json({ message: "Server error" });
  }
};