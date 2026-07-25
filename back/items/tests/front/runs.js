// This file is part of OneType. Created and led by Dejan Tomic <hi@iamdejan.com>, co-authored by Stefan Pakic, onetype.ai

onetype.AddonReady('tests.front', (tests) =>
{
    tests.Item({
        id: 'front/runs',
        addon: 'transforms',
        description: 'A transform reaches the node its ott attribute names, reads its typed configuration, runs once and leaves the markup clean.',
        callback: async function({ mount, run, settle, assert })
        {
            this.declared = async () =>
            {
                await run(() =>
                {
                    onetype.AddonGet('transforms').Item({
                        id: 'proof',
                        name: 'Proof',
                        description: 'Writes what it was handed onto the node it ran on.',
                        config: {
                            size: {
                                type: 'number',
                                value: 42,
                                description: 'A number, so the attribute proves its type.'
                            },
                            label: {
                                type: 'string',
                                value: 'idle',
                                description: 'A string, so a default proves it stands.'
                            }
                        },
                        code: function(data, node)
                        {
                            const seen = Number(node.getAttribute('data-times') ? node.getAttribute('data-times') : 0);

                            node.setAttribute('data-handed', JSON.stringify(data));
                            node.setAttribute('data-typed', typeof data.size);
                            node.setAttribute('data-times', String(seen + 1));
                        }
                    });
                });
            };

            this.defaults = async () =>
            {
                await mount('<div id="plain" ott="proof">idle</div>');

                assert.attribute('#plain', 'data-handed', '{"size":42,"label":"idle"}');
                assert.attribute('#plain', 'data-typed', 'number');
            };

            this.attributes = async () =>
            {
                await mount('<div id="given" ott="proof" ott-size="7" ott-label="set">idle</div>');

                assert.attribute('#given', 'data-handed', '{"size":7,"label":"set"}');
                assert.attribute('#given', 'data-typed', 'number');
            };

            this.cleaned = () =>
            {
                settle();

                assert.attribute('#given', 'ott', null);
                assert.attribute('#given', 'ott-size', null);
                assert.text('#given', 'idle');
            };

            this.once = async () =>
            {
                await run(() => onetype.AddonGet('transforms').run('proof', document.querySelector('#given')));

                assert.attribute('#given', 'data-times', '1');
            };

            this.absent = async () =>
            {
                await mount('<div id="absent" ott="nobody-registered-this">idle</div>');

                settle();

                assert.exists('#absent');
                assert.attribute('#absent', 'ott', null);
                assert.attribute('#absent', 'data-handed', null);
            };

            await this.declared();
            await this.defaults();
            await this.attributes();
            this.cleaned();
            await this.once();
            await this.absent();
        }
    });
});
