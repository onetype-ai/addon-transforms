// This file is part of OneType. Created and led by Dejan Tomic <hi@iamdejan.com>, co-authored by Stefan Pakic, onetype.ai

onetype.AddonReady('tests.back', (tests) =>
{
    tests.Item({
        id: 'back/claims',
        addon: 'transforms',
        description: 'The addon hands canon the pattern a transform file follows and the folder it registers in, so a stray one is caught.',
        callback: function({ assert })
        {
            this.pattern = () =>
            {
                const patterns = onetype.AddonGet('canon.patterns');

                if(!patterns)
                {
                    return;
                }

                const claimed = patterns.ItemGet('transforms:transforms');

                assert.truthy(claimed, 'the transforms pattern');
                assert.match(claimed.Get('claims'), '/items/transforms/', 'the folder it claims');
                assert.match(claimed.Get('pattern'), 'transforms.ItemAdd', 'the call it expects');
            };

            this.placement = () =>
            {
                const placements = onetype.AddonGet('canon.placements');

                if(!placements)
                {
                    return;
                }

                const placed = placements.ItemGet('transforms:transforms');

                assert.truthy(placed, 'the transforms placement');
                assert.equal(placed.Get('method'), 'ItemAdd', 'the method it names');
                assert.equal(placed.Get('receiver'), 'transforms', 'the receiver it rides');
                assert.match(placed.Get('home'), '/items/transforms/', 'the home it allows');
            };

            this.rejects = () =>
            {
                const transforms = onetype.AddonGet('transforms');

                assert.falsy(transforms.ItemGet('nobody-registered-this'), 'an unregistered id');
            };

            this.pattern();
            this.placement();
            this.rejects();
        }
    });
});
