// This file is part of OneType. Created and led by Dejan Tomic <hi@iamdejan.com>, co-authored by Stefan Pakic, onetype.ai

const transforms = onetype.Addon('transforms', (addon) =>
{
    addon.Field('id', {
        type: 'string',
        description: 'Unique transform id, the ot attribute names it on the node.'
    });

    addon.Field('icon', {
        type: 'string',
        value: 'sync_alt',
        description: 'The material icon name of the transform.'
    });

    addon.Field('name', {
        type: 'string',
        value: '',
        description: 'The name shown to whoever browses the transforms.'
    });

    addon.Field('description', {
        type: 'string',
        value: '',
        description: 'What the transform does, one sentence.'
    });

    addon.Field('js', {
        type: 'array',
        value: [],
        each: {
            type: 'string',
            description: 'One script url the transform loads before it runs.'
        },
        description: 'Script urls the transform loads before it runs.'
    });

    addon.Field('css', {
        type: 'array',
        value: [],
        each: {
            type: 'string',
            description: 'One stylesheet url the transform loads before it runs.'
        },
        description: 'Stylesheet urls the transform loads before it runs.'
    });

    addon.Field('config', {
        type: 'json',
        value: {},
        description: 'Defines of the ot attributes the transform reads, one define per attribute.'
    });

    addon.Field('metadata', {
        type: 'json',
        value: {},
        description: 'Free tags for whoever wants them.'
    });

    addon.Field('tags', {
        type: 'array',
        value: [],
        each: {
            type: 'string',
            description: 'One free grouping tag.'
        },
        description: 'Free grouping tags for browsing.'
    });

    addon.Field('code', {
        type: 'function',
        description: 'Runs once when the node initializes, the shared context rides this.'
    });

    addon.Field('destroy', {
        type: 'function',
        description: 'Runs when the node leaves the document, the observers are already gone.'
    });

    addon.Field('visible', {
        type: 'function',
        description: 'Runs when the node enters or leaves the viewport.'
    });

    addon.Field('resize', {
        type: 'function',
        description: 'Runs when the node resizes.'
    });

    addon.Field('scroll', {
        type: 'function',
        description: 'Runs as the node scrolls, the context carries progress, direction and speed.'
    });

    addon.Field('hover', {
        type: 'function',
        description: 'Runs as the pointer enters, moves over and leaves the node.'
    });

    addon.Field('click', {
        type: 'function',
        description: 'Runs when the node is clicked, the context carries the coordinates.'
    });

    addon.Field('structure', {
        type: 'function',
        description: 'Runs when the structure under the node mutates.'
    });
});

export default transforms;
