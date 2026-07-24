# Transforms

Transforms puts behavior and effects on plain markup. A node opts in with a single `ott` attribute naming a transform; the engine finds it, loads what it needs, reads its typed configuration from `ott-` attributes and drives its lifecycle in the browser. No components, no wrappers: the markup stays markup.

- Package: `@onetype/addon-transforms`, slug `onetype/addon/transforms`
- Depends on: nothing
- Sides: `front/` only, shipped as an asset bundle from `back/items/onetype/assets/transforms.js`

## Use a transform

```html
<div ott="fade" ott-duration="500" ott-label="hello"></div>
```

That is the whole integration surface. The engine initializes the node as soon as it exists, whether it was in the document from the start or added later. After initialization the markup is clean: `ott` and every `ott-` attribute are gone.

## Define a transform

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
        node.style.opacity = '0';
        node.style.transition = 'opacity ' + data.duration + 'ms';
    },
    visible: function(data, node, item)
    {
        node.style.opacity = '1';
    }
});
```

Field reference:

| Field | Type | Meaning |
| --- | --- | --- |
| `id` | string | The value the `ott` attribute uses. |
| `name`, `description`, `icon`, `tags`, `metadata` | | Presentation and free tags for whoever browses the transforms. |
| `js` | array of urls | Scripts loaded before the first run. Each url loads once per page. |
| `css` | array of urls | Stylesheets loaded before the first run. |
| `config` | defines | One define per `ott-` attribute the transform reads. Typed, with defaults. |
| `code` | function | Runs once when the node initializes. |
| `visible` | function | Runs when the node enters or leaves the viewport. |
| `resize` | function | Runs when the node resizes. |
| `scroll` | function | Runs as the node scrolls through the viewport. |
| `hover` | function | Runs as the pointer enters, moves over and leaves the node. |
| `click` | function | Runs when the node is clicked. |
| `destroy` | function | Runs when the node leaves the document, after the observers are released. |

## Read configuration from attributes

Every key in `config` maps to an `ott-` attribute. The engine reads the attribute, evaluates non string types as expressions, validates the result against the define, removes the attribute, and fills absences from the schema:

```html
<div ott="counter" ott-start="10" ott-steps="[1, 5, 10]" ott-live="true"></div>
```

```js
config: {
    start: { type: 'number', value: 0, description: 'First value shown.' },
    steps: { type: 'array', each: { type: 'number', description: 'One step.' }, description: 'Step sizes.' },
    live: { type: 'boolean', value: false, description: 'Whether the counter ticks on its own.' }
}
```

`data.start` is the number `10`, `data.steps` is a real array, `data.live` is a real boolean. A `string` define keeps the raw attribute text and never evaluates. A missing attribute takes the `value` of its define: the schema carries the default, the code never falls back.

## Write lifecycle handlers

Every lifecycle function is called as `fn.call(context, data, node, item)`. The shared `context` rides `this` across all of them and always carries the live interaction state:

```js
context.scroll   // { progress, direction, speed, top, bottom, visible }
context.hover    // { active, x, y, offset }
context.click    // { x, y }
```

So a `scroll` handler can read where the last click landed, and `code` can seed state the other handlers use:

```js
scroll: function(data, node)
{
    node.style.transform = 'translateY(' + (this.scroll.progress * data.distance) + 'px)';
},
click: function(data, node)
{
    node.classList.toggle('active');
}
```

Observers wire only for the handlers the transform declares; an undeclared event costs nothing. When the node leaves the document every observer is released and `destroy` runs last.

## Load libraries with a transform

```js
transforms.Item({
    id: 'chart',
    description: 'Renders a chart with an external library.',
    js: ['https://cdn.example.com/chart.min.js'],
    css: ['https://cdn.example.com/chart.min.css'],
    code: function(data, node)
    {
        new Chart(node, data);
    }
});
```

Assets load before the first `code` call and once per page no matter how many nodes use the transform. A url that fails to load rejects the run loudly.

## Run programmatically

```js
transforms.run('fade', node);                       // reads configuration from the ott attributes
transforms.run('fade', node, { duration: 100 });    // reads the attributes, then overlays this data
```

Passed data overlays the attributes and validates through the same defines: an unknown key or a wrong type fails loudly. Attributes are always consumed, so the markup ends clean either way.

## The ot-transform directive

When the directives addon is present (`supports: onetype/addon/directives`), transforms also run from rendered markup with reactive data:

```html
<ot-transform use="swiper" ott-loop="true" :data="{ speed: settings.speed }"></ot-transform>
```

Attributes: `use` (required, the transform id) and `data` (overlaid over the `ott-` attributes, validated through the same defines). Static configuration rides the `ott-` attributes, bound values ride `:data`, and the two merge with `data` winning per key.

An unknown id does nothing. A node initializes exactly once: the engine guards with a pending set while loading and an `ott-init` attribute during setup, so scans, mutations and manual runs never double fire.

## The watcher

On `onetype.document.ready` the engine scans the document for `[ott]` nodes and starts a MutationObserver. Markup added later, whether appended directly or nested inside an added subtree, initializes the same way. Nothing else to call.

## Guarantees

- Configuration is validated through the same define system as everything else in OneType: typed, sealed, defaults from the schema.
- A node initializes once, observers never leak, markup ends clean.
- Assets load once per url, lazily, only when a transform actually runs.
