// vim: set ft=javascript fdm=marker et ff=unix tw=80 sw=2:

import { resolve } from 'path'

const { version, name, author, license, dependencies } = require('./package.json')

const banner = (name, short = false) => {
  let s;
  if (short) {
    s = `/*! ${name} v${version} | ${license} licensed | ${author} */`
  } else {
    s = `/*!
 * ${name} v${version}
 *
 * @author ${author}
 * Released under the ${license} license.
 */`
  }
  return s
}

export default {
  destDir: resolve(__dirname, './lib'),
  dependencies: Object.keys(dependencies).concat([ 'fs', 'path', 'events', 'module', 'util' ]),
  entry: [
    {
      input: 'src/index.js',
      plugins: [ 'babel', 'resolve', 'commonjs' ],
      targets: [
        { format: 'cjs', file: 'index.js', banner: banner(name) },
        { format: 'es', file: 'index.esm.js', banner: banner(name, true) }
      ]
    }
  ]
}
