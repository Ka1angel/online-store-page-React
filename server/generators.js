function generate2FACode() {
  return Math.floor(100000 + Math.random() * 900000).toString(); 
}

function generateUserId(email) {
  return `user-${email.replace(/[@.]/g, "-")}`; 
}

const user2FACodes = {}; 

export { generate2FACode, generateUserId, user2FACodes }