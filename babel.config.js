// Use only the CSS interop plugin from NativeWind - let babel-preset-expo handle
// JSX transformation to avoid duplicate __self/__source from multiple transforms.
const nativewindBabel = require('nativewind/babel')();
const cssInteropPlugin = nativewindBabel.plugins[0];

module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
    ],
    plugins: [cssInteropPlugin],
  };
};
