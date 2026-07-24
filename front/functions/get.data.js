transforms.Fn('get.data', function(config, node)
{
    const data = {};

    this.evaluate = (raw) =>
    {
        try
        {
            const evaluated = onetype.Function(raw, {}, false);

            return evaluated === undefined ? raw : evaluated;
        }
        catch(error)
        {
            error.raw = raw;

            return raw;
        }
    };

    this.read = (name, definition) =>
    {
        const raw = node.getAttribute('ot-' + name);

        if(raw === null)
        {
            return raw;
        }

        node.removeAttribute('ot-' + name);

        return definition.type === 'string' ? raw : this.evaluate(raw);
    };

    this.collect = () =>
    {
        Object.entries(config).forEach(([name, definition]) =>
        {
            name = name.toLowerCase();
            data[name] = onetype.DataDefineOne(this.read(name, definition), definition);
        });
    };

    this.collect();

    return data;
});
