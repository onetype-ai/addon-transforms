// This file is part of OneType. Created and led by Dejan Tomic <hi@iamdejan.com>, co-authored by Stefan Pakic, onetype.ai

onetype.AddonReady('tests.front', (tests) =>
{
    tests.Item({
        id: 'front/watches',
        addon: 'transforms',
        description: 'Watching reaches the nodes standing and the ones arriving after, and the ot-transform tag runs one where no attribute can.',
        callback: async function({ mount, run, settle, assert })
        {
            this.declared = async () =>
            {
                await run(() =>
                {
                    onetype.AddonGet('transforms').Item({
                        id: 'proof-watched',
                        name: 'Watched',
                        description: 'Marks whatever the watcher hands it.',
                        config: {},
                        code: function(data, node)
                        {
                            node.setAttribute('data-seen', 'yes');
                        }
                    });
                });
            };

            this.standing = async () =>
            {
                await mount('<div id="host"><div id="early" ott="proof-watched">idle</div></div>');

                await run(() => onetype.AddonGet('transforms').watch());

                assert.attribute('#early', 'data-seen', 'yes');
            };

            this.arriving = async () =>
            {
                await run(() =>
                {
                    const late = document.createElement('div');

                    late.id = 'late';
                    late.setAttribute('ott', 'proof-watched');

                    document.querySelector('#host').appendChild(late);
                });

                await new Promise((settled) => setTimeout(settled, 50));

                settle();

                assert.attribute('#late', 'data-seen', 'yes');
            };

            this.tagged = async () =>
            {
                await mount('<ot-transform id="tag" use="proof-watched"></ot-transform>');

                settle();

                assert.attribute('#tag', 'data-seen', 'yes');
            };

            await this.declared();
            await this.standing();
            await this.arriving();
            await this.tagged();
        }
    });
});
