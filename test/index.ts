import { test } from '@substrate-system/tapzero'
import { anchor, Anchor } from '../src/index.js'

test('Anchor', async t => {
    document.body.innerHTML += `
        <h2>The h2 tag</h2>
        <h1>The h1 tag</h1>
    `
    const anchor = new Anchor({
        visible: 'touch'
    })
    t.ok(anchor, 'Can create a new anchor instance')
})

test('anchor function', async t => {
    const a = anchor({ class: 'example-class' })
    t.ok(document.getElementById(a.urlify('The h2 tag')),
        'should add IDs to h2 elements')

    t.ok(!document.getElementById(a.urlify('The h1 tag')),
        'should not add IDs to h1 tags')

    t.ok(document.querySelector('a.example-class'),
        'should create an a tag with the class we passed in')
})

test('an empty heading does not throw', async t => {
    const h = heading('<h2></h2>')
    let err:unknown = null
    try {
        anchor({}, [h])
    } catch (_err) {
        err = _err
    }
    t.equal(err, null, 'add() should not throw on a childless heading')
    h.parentElement!.remove()
})

test('adding twice does not duplicate the link', async t => {
    const h = heading('<h2>Twice</h2>')
    anchor({}, [h])
    anchor({}, [h])
    t.equal(h.querySelectorAll('.anchorjs-link').length, 1,
        'a second add() should leave one link')
    h.parentElement!.remove()
})

function heading (html:string):HTMLElement {
    const container = document.createElement('div')
    container.innerHTML = html
    document.body.appendChild(container)
    return container.firstElementChild as HTMLElement
}
