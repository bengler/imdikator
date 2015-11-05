import {assert} from 'chai'
import {someInTree} from './iterators'
import {contains} from './predicates'

export function assertInRenderTree(renderTree, content) {
  assert(renderTree::someInTree(contains(content)), `Expected render tree to contain "${content}"`)
}

export function assertNotInRenderTree(renderTree, content) {
  assert(!renderTree::someInTree(contains(content)), `Expected render tree to NOT contain "${content}"`)
}
