module.exports = {
  // Presets are run in reversed order: https://babeljs.io/docs/en/presets#preset-ordering
  presets: [
    [
      '@babel/preset-env',
      {
        targets: 'last 2 Chrome versions',
      },
    ],
    '@babel/preset-react',
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-nullish-coalescing-operator',
    '@babel/plugin-proposal-optional-chaining',
  ],
};
