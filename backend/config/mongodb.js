import dns from "node:dns";
import mongoose from "mongoose";

/**
 * `mongodb+srv://` needs an SRV lookup (`_mongodb._tcp.<host>`). On some Windows + Node
 * versions that returns `querySrv ECONNREFUSED` with the default resolver — not a
 * MongoDB Atlas outage. Using explicit DNS servers fixes it for many dev machines.
 *
 * - Set `MONGODB_DNS_SERVERS=8.8.8.8,1.1.1.1` to choose servers (comma-separated).
 * - Set `MONGODB_SKIP_DNS_OVERRIDE=1` to leave the OS resolver unchanged.
 * - On Windows, if unset, we default to Google DNS for this process only.
 */
const applyMongoSrvDnsWorkaround = (uri) => {
  if (!uri.startsWith("mongodb+srv:")) return;
  if (process.env.MONGODB_SKIP_DNS_OVERRIDE === "1") return;

  const fromEnv = process.env.MONGODB_DNS_SERVERS?.split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (fromEnv?.length) {
    dns.setServers(fromEnv);
    console.log("[MongoDB] DNS servers (SRV):", fromEnv.join(", "));
    return;
  }

  if (process.platform === "win32") {
    dns.setServers(["8.8.8.8", "8.8.4.4"]);
    console.log(
      "[MongoDB] Windows SRV workaround: using 8.8.8.8, 8.8.4.4 (set MONGODB_SKIP_DNS_OVERRIDE=1 or MONGODB_DNS_SERVERS to change)"
    );
  }
};

// Serverless: enable command buffering so queries wait for connection
// instead of failing immediately. Use 30s timeout for Vercel cold starts.
mongoose.set("bufferCommands", true);
mongoose.set("bufferTimeoutMS", 30000);

/** Prefer split vars so the DB password is not embedded in a connection string in .env files. */
export const resolveMongoUri = () => {
  const user = process.env.MONGODB_USER?.trim();
  const password = process.env.MONGODB_PASSWORD?.trim();
  const host = process.env.MONGODB_HOST?.trim();
  const db = process.env.MONGODB_DB?.trim();

  if (user && password && host && db) {
    const u = encodeURIComponent(user);
    const p = encodeURIComponent(password);
    return `mongodb+srv://${u}:${p}@${host}/${db}?retryWrites=true&w=majority`;
  }

  const legacy = process.env.MONGODB_URI?.trim();
  if (legacy) {
    return legacy;
  }

  return null;
};

const connectDB = async () => {
  const rawUri = resolveMongoUri();
  if (!rawUri) {
    console.error(
      "[MongoDB] Missing credentials: set MONGODB_USER, MONGODB_PASSWORD, MONGODB_HOST, MONGODB_DB — or MONGODB_URI for legacy setups only"
    );
    throw new Error("Missing MongoDB configuration");
  }

  // Parse and prepare URI
  let uri = rawUri.trim();

  applyMongoSrvDnsWorkaround(uri);

  const hasDbName = (() => {
    try {
      const parsed = new URL(uri);
      return parsed.pathname && parsed.pathname !== "/";
    } catch {
      return uri.includes("/") && !uri.endsWith("/");
    }
  })();

  if (!hasDbName) {
    const [base, query] = uri.split("?");
    uri = `${base.replace(/\/+$/, "")}/trendify${query ? `?${query}` : ""}`;
  }

  // Log connection attempt details
  console.log("[MongoDB] === CONNECTION ATTEMPT ===");
  console.log("[MongoDB] Full URI (masked):", uri.replace(/:([^@]+)@/, ':***@'));
  console.log("[MongoDB] Has query params:", uri.includes('?'));
  console.log("[MongoDB] Node env:", process.env.NODE_ENV);

  // Connection options for serverless environments
  const options = {
    serverSelectionTimeoutMS: 15000,    // 15s: cold-start + Atlas DNS/TLS can be slow
    connectTimeoutMS: 15000,            // 15s connection timeout
    socketTimeoutMS: 45000,           // 45s socket timeout
    maxPoolSize: 1,                   // single connection for serverless
  };

  // Cache the connection across serverless invocations (warm starts)
  // so we don't reconnect on every request.
  const globalKey = "__mongooseConnection";
  const cached = globalThis[globalKey] || (globalThis[globalKey] = { conn: null, promise: null });

  if (cached.conn) {
    return true;
  }

  if (!cached.promise) {
    console.log("[MongoDB] Starting mongoose.connect()...");
    cached.promise = mongoose
      .connect(uri, options)
      .then((m) => {
        cached.conn = m.connection;
        console.log("[MongoDB] ✅ Connected successfully!");
        console.log("[MongoDB] Connection readyState:", mongoose.connection.readyState);
        return cached.conn;
      })
      .catch((error) => {
        cached.promise = null;
        console.error("[MongoDB] ❌ Connection FAILED:", error.message);
        console.error("[MongoDB] Error name:", error.name);
        console.error("[MongoDB] Error code:", error.code || "N/A");
        throw error;
      });
  }

  console.log("[MongoDB] Awaiting connection promise...");
  await cached.promise;
  console.log("[MongoDB] Connection promise resolved. readyState:", mongoose.connection.readyState);
  return true;
};

export default connectDB;
