module.exports = function (api) {
  api.cache(true)

  const presets = ['es2015', { modules: false }]

  const plugins = []

  return {
    presets, plugins
  }
}