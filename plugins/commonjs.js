module.exports = function ({ template }) {
  return {
    post (file) {
      file.path.pushContainer('body', template.statement.ast(`
        if (typeof module === 'object' && module.exports) {
          module.exports = module.exports.default;
        }
      `))
    }
  }
}
