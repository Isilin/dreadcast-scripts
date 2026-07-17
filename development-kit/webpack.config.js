const path = require('path');
const WebpackUserscript = require('webpack-userscript');

module.exports = {
  mode: 'production',
  entry: './src/index.ts',
  output: {
    filename: 'dc-development-kit.user.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'DCDevKit',
    libraryTarget: 'window',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new WebpackUserscript({
      headers: {
        name: 'DC Development Kit',
        namespace: 'https://tonsite.com',
        version: '1.0.0',
        author: 'Ton Nom',
        description: 'Bibliothèque utilitaire pour Dreadcast.',
        match: 'https://www.dreadcast.net/Main',
        grant: ['GM_setValue', 'GM_getValue', 'GM_xmlhttpRequest'],
        require: ['https://code.jquery.com/jquery-3.7.1.min.js'],
        license: 'MIT',
      },
    }),
  ],
};
