function getFullImageUrl(filename) {
  return `${global.IMG_BASE_URL}/uploads/${filename}`;
}

module.exports = { getFullImageUrl };