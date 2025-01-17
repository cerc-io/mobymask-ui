const PackageJson = require('@npmcli/package-json');

// List of modules whose exports need to be updated
const MODULES = [
  {
    path: './node_modules/uint8arrays',
    subPaths: [
      './from-string',
      './to-string',
    ],
  },
  {
    path: './node_modules/it-pipe',
    subPaths: [
      '.',
    ],
  },
  {
    path: './node_modules/@libp2p/peer-id-factory',
    subPaths: [
      '.',
    ],
  },
  {
    path: './node_modules/@libp2p/peer-id',
    subPaths: [
      '.',
    ],
  },
  {
    path: './node_modules/@libp2p/crypto',
    subPaths: [
      './keys',
    ],
  },
  {
    path: './node_modules/@cerc-io/nitro-node-browser/node_modules/@multiformats/multiaddr',
    subPaths: [
      '.',
    ],
  },
];

async function main() {
  // eslint-disable-next-line no-restricted-syntax
  for await (const module of MODULES) {
    const pkgJson = await PackageJson.load(module.path);
    const { content } = pkgJson;

    module.subPaths.forEach((subPath) => {
      content.exports[subPath] = {
        ...content.exports[subPath],
        default: content.exports[subPath].import,
      };
    });

    pkgJson.update(content);

    await pkgJson.save();
  }
}

main();
