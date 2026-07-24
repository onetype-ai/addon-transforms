// This file is part of OneType. Created and led by Dejan Tomic <hi@iamdejan.com>, co-authored by Stefan Pakic, onetype.ai

onetype.AddonReady('canon.patterns', (patterns) =>
{
    patterns.Item({
        id: 'transforms:transforms',
        description: 'A transform file wraps one transforms.ItemAdd in AddonReady, one transform per file named by its id.',
        match: '/items/transforms/[^/]+\\.js$',
        claims: '/items/transforms/',
        pattern: 'onetype.AddonReady(\'transforms\', (transforms) =>\n{\n    transforms.ItemAdd({ __fields__ });\n});',
        fields: {
            id: {
                type: 'string',
                required: true,
                description: 'The transform id, the value of the ott attribute.'
            },
            icon: {
                type: 'string',
                description: 'The material icon name of the transform.'
            },
            name: {
                type: 'string',
                required: true,
                description: 'Human name of the transform.'
            },
            description: {
                type: 'string',
                required: true,
                description: 'What the transform does, one sentence.'
            },
            js: {
                type: 'array|string',
                description: 'Script urls the transform loads before running, left out when none.'
            },
            css: {
                type: 'array|string',
                description: 'Style urls the transform loads before running, left out when none.'
            },
            config: {
                type: 'object',
                description: 'Defines of the transform properties, one define per property.'
            },
            metadata: {
                type: 'object',
                description: 'Free tags for whoever wants them.'
            },
            tags: {
                type: 'array',
                description: 'Search tags of the transform, left out when none.'
            },
            code: {
                type: 'function',
                description: 'Runs once when the transform initializes on a node.'
            },
            visible: {
                type: 'function',
                description: 'Runs when the node enters or leaves the viewport, left out when unused.'
            },
            resize: {
                type: 'function',
                description: 'Runs when the node resizes, left out when unused.'
            },
            scroll: {
                type: 'function',
                description: 'Runs as the node scrolls through the viewport, left out when unused.'
            },
            hover: {
                type: 'function',
                description: 'Runs as the pointer moves over the node, left out when unused.'
            },
            click: {
                type: 'function',
                description: 'Runs when the node is clicked, left out when unused.'
            },
            structure: {
                type: 'function',
                description: 'Runs when the structure of the node changes, left out when unused.'
            },
            destroy: {
                type: 'function',
                description: 'Runs when the node leaves the document, left out when unused.'
            }
        }
    });
});
