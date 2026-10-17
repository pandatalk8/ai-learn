// Usage: node probe.mjs /absolute/path/to/bundled-cordis.mjs
// A behavioral probe of a pinned implementation, not a compatibility test suite.
import assert from 'node:assert/strict'
import { pathToFileURL } from 'node:url'
const { Context, Service } = await import(pathToFileURL(process.argv[2]).href)
const observations = {}
const gate = () => {
  let release
  const promise = new Promise(resolve => { release = resolve })
  return { promise, release }
}
const tick = () => new Promise(resolve => setImmediate(resolve))

{
  const root = new Context()
  const trace = []
  const consumer = await root.inject(['db'], ctx => {
    trace.push(`start:${ctx.db.id}`)
    return () => { trace.push(`stop:${ctx.db.id}`) }
  })
  assert.deepEqual(trace, []) // awaiting a pending fiber does not wait for services
  const first = await root.plugin(ctx => { ctx.provide('db', { id: 1 }) })
  await consumer.await()
  await first.dispose()
  const second = await root.plugin(ctx => { ctx.provide('db', { id: 2 }) })
  await consumer.await()
  await second.dispose()
  assert.deepEqual(trace, ['start:1', 'stop:1', 'start:2', 'stop:2'])
  observations.dependency_reactivation = trace
  await root.fiber.dispose()
}
{
  const root = new Context()
  const trace = [], blocked = gate()
  const fiber = await root.plugin(ctx => {
    ctx.effect(() => () => { trace.push('earlier cleanup') })
    ctx.effect(() => async () => {
      trace.push('later cleanup starts')
      await blocked.promise
      trace.push('later cleanup ends')
    })
  })
  const task = fiber.dispose()
  await tick()
  assert.deepEqual(trace, ['later cleanup starts', 'earlier cleanup'])
  blocked.release()
  await task
  observations.top_level_cleanup = trace
  await root.fiber.dispose()
}
{
  const root = new Context()
  const trace = [], blocked = gate()
  const fiber = await root.plugin(ctx => {
    ctx.effect(function* () {
      yield () => { trace.push('earlier cleanup') }
      yield async () => {
        trace.push('later cleanup starts')
        await blocked.promise
        trace.push('later cleanup ends')
      }
    })
  })
  const task = fiber.dispose()
  await tick()
  assert.deepEqual(trace, ['later cleanup starts'])
  blocked.release()
  await task
  observations.grouped_cleanup = trace
  await root.fiber.dispose()
}
{
  const root = new Context()
  const trace = [], blocked = gate()
  const provider = await root.plugin(ctx => {
    ctx.provide('db', {})
    ctx.effect(() => () => { trace.push('provider resource closed') })
  })
  const consumer = await root.inject(['db'], () => async () => {
    trace.push('consumer cleanup starts')
    await blocked.promise
    trace.push('consumer cleanup ends')
  })
  const task = provider.dispose()
  await tick()
  assert.ok(trace.includes('provider resource closed'))
  assert.ok(!trace.includes('consumer cleanup ends'))
  blocked.release()
  await task
  await consumer.await()
  observations.provider_cleanup_overlap = trace
  await root.fiber.dispose()
}
{
  const root = new Context()
  const left = root.isolate('db'), right = root.isolate('db')
  left.provide('db', 'left')
  right.provide('db', 'right')
  assert.equal(left.db, 'left')
  assert.equal(right.db, 'right')
  assert.equal(root.db, undefined)
  observations.isolation = [left.db, right.db, root.db ?? null]
  await root.fiber.dispose()
}
{
  const root = new Context()
  const event = 'research/policy'
  root.on(event, () => 0)
  root.on(event, () => 99)
  assert.equal(root.bail(event), 0)
  const flow = 'research/flow'
  root.on(flow, next => `outer(${next()})`)
  root.on(flow, () => 'veto')
  const result = root.waterfall(flow, () => 'base')
  assert.equal(result, 'outer(veto)')
  observations.events = { bailZero: 0, waterfall: result }
  await root.fiber.dispose()
}
{
  const root = new Context()
  let attempts = 0
  const remove = root.provide('db', {})
  const failed = root.inject(['db'], () => { attempts++; throw new Error('probe failure') })
  await failed.await().catch(() => {})
  await remove()
  root.provide('db', {})
  await failed.await().catch(() => {})
  observations.failed_fiber_attempts_after_dependency_returns = attempts
  await root.fiber.dispose()
}
{
  const root = new Context()
  let cleaned = false, unload
  const fiber = await root.plugin(() => {})
  fiber.ctx.effect(() => {
    unload = fiber.dispose()
    return () => { cleaned = true }
  })
  await unload
  observations.reentrant_setup_cleanup_collected = cleaned
  await root.fiber.dispose()
}
{
  const root = new Context()
  const trace = [], blocked = gate()
  const provider = await root.plugin(ctx => {
    ctx.effect(function* () {
      yield () => { trace.push('provider resource closed') }
      yield ctx.provide('db', {})
    })
  })
  await root.inject(['db'], () => async () => {
    trace.push('consumer cleanup starts')
    await blocked.promise
    trace.push('consumer cleanup ends')
  })
  const task = provider.dispose()
  await tick()
  assert.deepEqual(trace, ['consumer cleanup starts'])
  blocked.release()
  await task
  assert.deepEqual(trace, ['consumer cleanup starts', 'consumer cleanup ends', 'provider resource closed'])
  observations.grouped_provider_cleanup = trace
  await root.fiber.dispose()
}
{
  const root = new Context(), trace = []
  class Registry extends Service {
    constructor(ctx) { super(ctx, 'registryProbe') }
    register() {
      return this.ctx.effect(() => {
        trace.push('register')
        return () => { trace.push('unregister') }
      })
    }
  }
  const provider = await root.plugin(Registry)
  const consumer = await root.inject(['registryProbe'], ctx => { ctx.registryProbe.register() })
  await consumer.dispose()
  assert.deepEqual(trace, ['register', 'unregister'])
  assert.notEqual(provider.uid, null)
  observations.service_effect_owned_by_caller = trace
  await root.fiber.dispose()
}
console.log(JSON.stringify(observations, null, 2))
