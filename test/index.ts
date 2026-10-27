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

test('a heading with no usable text gets no id or link', async t => {
    const cases = [
        '<h2></h2>',
        '<h2>   </h2>',
        '<h2>???</h2>',
        '<h2><img alt=""></h2>'
    ]
    for (const html of cases) {
        const h = heading(html)
        anchor({}, [h])
        t.ok(!h.hasAttribute('id'), `${html} should get no id`)
        t.equal(h.querySelector('.anchorjs-link'), null,
            `${html} should get no link`)
        h.parentElement!.remove()
    }
})

test('two empty headings in one call get no ids', async t => {
    const a = heading('<h2></h2>')
    const b = heading('<h2></h2>')
    anchor({}, [a, b])
    t.ok(!a.hasAttribute('id') && !b.hasAttribute('id'),
        'neither empty heading should get an id')
    a.parentElement!.remove()
    b.parentElement!.remove()
})

test('an empty heading with an explicit id still gets a link', async t => {
    const h = heading('<h2 id="explicit"></h2>')
    anchor({}, [h])
    const link = h.querySelector('a.anchorjs-link')
    t.ok(link, 'should add a link')
    t.ok(link?.getAttribute('href')?.endsWith('#explicit'),
        'the link should point at the explicit id')
    h.parentElement!.remove()
})

test('skipped headings are not tracked', async t => {
    const empty = heading('<h2></h2>')
    const full = heading('<h2>Tracked</h2>')
    const a = anchor({}, [empty, full])
    t.equal(a.els.length, 1, 'only one heading is tracked')
    t.equal(a.els[0], full, 'the tracked heading is the one with text')
    empty.parentElement!.remove()
    full.parentElement!.remove()
})

test('all done', () => {
    if (window) {
        // @ts-expect-error tests
        window.testsFinished = true
    }
})

function heading (html:string):HTMLElement {
    const container = document.createElement('div')
    container.innerHTML = html
    document.body.appendChild(container)
    return container.firstElementChild as HTMLElement
}
