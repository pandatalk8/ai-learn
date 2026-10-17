import { transform } from 'esbuild'
import { resolve } from 'node:path'

const root = resolve(process.env.CORDIS_SOURCE ?? './cordis')
export default {
  root,
  resolve: { alias: { cordis: resolve(root, 'packages/core/src/index.ts') } },
  plugins: [{
    name: 'research-typescript',
    enforce: 'pre',
    async transform(code, id) {
      if (!id.endsWith('.ts')) return
      return transform(code, { loader: 'ts', target: 'es2022', sourcemap: 'inline' })
    },
  }],
  test: { include: ['packages/core/tests/*.spec.ts'], pool: 'forks' },
}
