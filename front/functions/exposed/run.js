// This file is part of OneType. Created and led by Dejan Tomic <hi@iamdejan.com>, co-authored by Stefan Pakic, onetype.ai

transforms.FnExpose('run', function(id, node, data = null)
{
    const item = transforms.ItemGet(id);

    if(!item)
    {
        node.removeAttribute('ott');
        onetype.Error(404, 'Transform :id: is not registered, the node shows unstyled.', { id });

        return;
    }

    item.Fn('run', node, data);
});
