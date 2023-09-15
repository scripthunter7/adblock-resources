const { readResources, defaultLists, regionalLists } = require('.')

const assert = require('node:assert')
const test = require('node:test')
const { Engine, FilterFormat, FilterSet } = require('adblock-rs')

test('resources are parsed OK by adblock-rust', t => {
    const resources = readResources()

    const filterSet = new FilterSet()
    const engine = new Engine(filterSet)

    resources.forEach(resource => {
        try {
            engine.addResource(resource)
        } catch(e) {
            console.error("Encountered an error when attempting to add this resource:", resource)
            throw e
        }
    })
})

const testLists = (lists) => {
    lists.forEach(list => {
        assert.ok(list.uuid !== undefined && typeof list.uuid === 'string')
        assert.ok(list.uuid.length === 36 || list.uuid.length === 37 || list.uuid === 'default', 'length mismatch for ' + list.uuid)
        assert.ok(list.title !== undefined && typeof list.title === 'string')
        assert.ok(list.desc !== undefined && typeof list.desc === 'string')
        assert.ok(list.langs !== undefined && Array.isArray(list.langs))
        list.langs.forEach(lang => assert.ok(typeof lang === 'string'))
        assert.ok(list.component_id !== undefined && typeof list.component_id === 'string')
        assert.ok(list.base64_public_key !== undefined && typeof list.base64_public_key === 'string')
        assert.ok(list.list_text_component !== undefined && typeof list.list_text_component === 'object')
        assert.ok(list.list_text_component.component_id !== undefined && typeof list.list_text_component.component_id === 'string')
        assert.ok(list.list_text_component.base64_public_key !== undefined && typeof list.list_text_component.base64_public_key === 'string')

        assert.ok(list.sources !== undefined && Array.isArray(list.sources))
        for (const source of list.sources) {
            assert.ok(source.url !== undefined && typeof source.url === 'string')
            let supportedFormat = false
            for (const format in FilterFormat) {
                if (source.format === FilterFormat[format]) {
                    supportedFormat = true
                }
            }
            assert.ok(supportedFormat)
            assert.ok(source.support_url !== undefined && typeof source.support_url === 'string')
        }
    })
}

test('default filter lists are correctly formatted', t => {
    testLists(defaultLists)
})

test('regional filter lists are correctly formatted', t => {
    testLists(regionalLists)
})
