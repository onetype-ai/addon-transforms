# Transforms

Transforms is the OneType addon that puts behavior and effects on plain markup. A node opts in with a single `ot` attribute naming a transform; the engine finds it, loads what it needs, reads its typed configuration from `ot-` attributes and drives its lifecycle in the browser. No components, no wrappers: the markup stays markup.

- Package: `@onetype/addon-transforms`, slug `onetype/addon/transforms`
- Depends on: nothing
- Sides: `front/` only, shipped as an asset bundle registered in `back/items/onetype/assets/transforms.js`

## Registering a transform

```js
transforms.Item({
    id: 'fade',
    name: 'Fade',
    description: 'Fades the node in when it enters the viewport.',
    config: {
        duration: {
            type: 'number',
            value: 300,
            description: 'Milliseconds the fade runs.'
        }
    },
    code: function(data, node, item)
    {
        node.style.transition = 'opacity ' + data.duration + 'ms';
    }
});
```

Fields: `id` (the value of the `ot` attribute), `icon`, `name`, `description`, `js` and `css` (urls loaded before the first run, each an array of strings), `config` (defines of the `ot-` attributes the transform reads, one define per attribute), `metadata`, `tags`, and the lifecycle functions below.

## The lifecycle

`code` runs once when the node initializes. The optional observers run only when declared: `visible` (viewport enter and leave), `resize`, `scroll` (the context carries progress, direction and speed), `hover` (enter, move, leave with coordinates), `click`, `structure` (mutations under the node), and `destroy` when the node leaves the document, after every observer is released.

Every lifecycle function is called as `fn.call(context, data, node, item)`. The shared `context` rides `this` across all of them and carries the live `scroll`, `hover` and `click` state, so a `scroll` handler can read where the last click landed.

## Markup and configuration

```html
<div ot="fade" ot-duration="500"></div>
```

The engine reads each `ot-` attribute named by the `config` defines, evaluates non string types as expressions, validates the result against the define and removes the attribute from the node. A missing attribute takes the `value` of its define: the schema carries the default, the code never falls back. During initialization the node briefly wears `ot-init`; after the first frame both `ot` and `ot-init` are gone, leaving clean markup.

## The watcher

On `onetype.document.ready` the engine scans the document for `[ot]` nodes and starts a MutationObserver, so markup added later initializes itself the same way. A node initializes exactly once: the `ot-init` guard and a pending set stop double runs, and every observer is released when the node leaves the document.

## Exposed functions

- `transforms.run(id, node, data)` runs one transform on one node. Without `data` the configuration is read from the node attributes. An unknown id does nothing.

## Loading assets

A transform that names `js` or `css` urls loads them before its first run. Every url loads once per page regardless of how many nodes use the transform, and a url that fails to load rejects the run loudly.

## Guarantees

- Configuration is validated through the same define system as everything else in OneType: typed, sealed, defaults from the schema.
- A node initializes once, observers never leak, and the markup ends clean: no `ot` attributes survive initialization.
