transforms.Fn('do.watch', function()
{
    this.pending = new WeakSet();

    this.process = (node) =>
    {
        const id = node.getAttribute('ot');

        if(!id || node.hasAttribute('ot-init') || this.pending.has(node))
        {
            return;
        }

        this.pending.add(node);
        transforms.run(id, node);
    };

    this.scan = () =>
    {
        document.querySelectorAll('[ot]').forEach((node) => this.process(node));
    };

    this.added = (node) =>
    {
        if(node.nodeType !== 1)
        {
            return;
        }

        if(node.hasAttribute('ot'))
        {
            this.process(node);
        }

        node.querySelectorAll('[ot]').forEach((child) => this.process(child));
    };

    this.observe = () =>
    {
        const observer = new MutationObserver((mutations) =>
        {
            for(const mutation of mutations)
            {
                mutation.addedNodes.forEach((node) => this.added(node));
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    };

    this.start = () =>
    {
        this.scan();
        this.observe();
    };

    if(document.readyState === 'loading')
    {
        document.addEventListener('DOMContentLoaded', () => this.start());

        return;
    }

    this.start();
});
