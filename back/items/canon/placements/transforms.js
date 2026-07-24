// This file is part of OneType. Created and led by Dejan Tomic <hi@iamdejan.com>, co-authored by Stefan Pakic, onetype.ai

onetype.AddonReady('canon.placements', (placements) =>
{
    placements.Item({
        id: 'transforms:transforms',
        method: 'ItemAdd',
        receiver: 'transforms',
        home: '/items/transforms/',
        description: 'A transform registers only in items transforms, never on the way.'
    });
});
