const authenticateApiKey = (req, res, next) => {
    /** @type {string|undefined} */
    const clientApiKey = req.get("X-API-Key");
    if (!clientApiKey) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    if (clientApiKey !== process.env.API_KEY) {
        return res.status(403).json({ error: "Unauthorized" });
    }

    next();
};

module.exports = authenticateApiKey;
