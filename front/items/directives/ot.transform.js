// This file is part of OneType. Created and led by Dejan Tomic <hi@iamdejan.com>, co-authored by Stefan Pakic, onetype.ai

onetype.AddonReady('directives', (directives) =>
{
    directives.ItemAdd({
        id: 'ot-transform',
        icon: 'sync_alt',
        name: 'Transform',
        description: 'Runs a transform on the node when it renders',
        category: 'visual',
        trigger: 'node',
        order: 668,
        strict: false,
        tag: 'ot-transform',
        attributes: {
            'use': {
                type: 'string',
                required: true,
                description: 'Id of the transform to run on the node.'
            },
            'data': {
                type: 'json',
                value: null,
                description: 'Configuration overlaid over the ott attributes, validated through the same defines.'
            }
        },
        code: function(data, item, compile, node)
        {
            if(node.tagName.toLowerCase() !== 'ot-transform')
            {
                return;
            }

            transforms.run(data['use'].value, node, data['data'].value);
        }
    });
});
