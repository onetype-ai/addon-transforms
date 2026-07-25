// This file is part of OneType. Created and led by Dejan Tomic <hi@iamdejan.com>, co-authored by Stefan Pakic, onetype.ai

onetype.AddonReady('tests.back', (tests) =>
{
    tests.Item({
        id: 'transforms:back/declares',
        addon: 'transforms',
        description: 'The addon declares the shape a transform takes, holds its lifecycle callbacks and hands its front folder to assets.',
        callback: function({ assert })
        {
            this.registered = () =>
            {
                const transforms = onetype.AddonGet('transforms');

                assert.truthy(transforms, 'the transforms addon');

                return transforms;
            };

            this.shaped = (transforms) =>
            {
                const item = transforms.Item({
                    id: 'proof-shape',
                    name: 'Shape',
                    description: 'Registered so the defaults can be read back.',
                    code: function() {}
                });

                assert.equal(item.Get('icon'), 'sync_alt', 'the default icon');
                assert.equal(JSON.stringify(item.Get('js')), '[]', 'js defaults to nothing');
                assert.equal(JSON.stringify(item.Get('config')), '{}', 'config defaults to nothing');
                assert.equal(typeof item.Get('code'), 'function', 'the code callback');
            };

            this.lifecycle = (transforms) =>
            {
                const item = transforms.Item({
                    id: 'proof-lifecycle',
                    name: 'Lifecycle',
                    description: 'Registered carrying every moment it can answer.',
                    code: function() {},
                    destroy: function() {},
                    visible: function() {},
                    resize: function() {},
                    scroll: function() {},
                    hover: function() {},
                    click: function() {},
                    structure: function() {}
                });

                ['destroy', 'visible', 'resize', 'scroll', 'hover', 'click', 'structure'].forEach((moment) =>
                {
                    assert.equal(typeof item.Get(moment), 'function', 'the ' + moment + ' callback');
                });
            };

            this.asset = () =>
            {
                const shipped = Object.values(onetype.assets.Items()).filter((item) => item.Get('addon') === 'transforms');

                assert.equal(shipped.length, 1, 'assets carries the transforms front once');
                assert.truthy(shipped[0].Get('js'), 'the js folder it hands over');
            };

            const transforms = this.registered();

            this.shaped(transforms);
            this.lifecycle(transforms);
            this.asset();
        }
    });
});
