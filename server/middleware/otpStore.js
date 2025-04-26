const otpStore = new Map();

/**
 * Store an OTP with a TTL (default 5 minutes)
 * @param {string} email
 * @param {string} code
 * @param {number} ttl - milliseconds
 */
function setOtp(email, code, ttl = 5 * 60 * 1000) {
  const expiresAt = Date.now() + ttl;
  otpStore.set(email, { code, expiresAt });
}

/**
 * Retrieve OTP if not expired
 * @param {string} email
 * @returns {string|null}
 */
function getOtp(email) {
  const entry = otpStore.get(email);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    otpStore.delete(email);
    return null;
  }
  return entry.code;
}

/**
 * Delete stored OTP
 * @param {string} email
 */
function deleteOtp(email) {
  otpStore.delete(email);
}

module.exports = { setOtp, getOtp, deleteOtp };