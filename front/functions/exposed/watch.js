// This file is part of OneType. Created and led by Dejan Tomic <hi@iamdejan.com>, co-authored by Stefan Pakic, onetype.ai

transforms.FnExpose('watch', function()
{
    this.pending = new WeakSet();

    this.process = (node) =>
    {
        const id = node.getAttribute('ott');

        if(!id || node.hasAttribute('ott-init') || this.pending.has(node))
        {
            return;
        }

        this.pending.add(node);
        transforms.run(id, node);
    };

    this.scan = () =>
    {
        document.querySelectorAll('[ott]').forEach((node) => this.process(node));
    };

    this.added = (node) =>
    {
        if(node.nodeType !== 1)
        {
            return;
        }

        if(node.hasAttribute('ott'))
        {
            this.process(node);
        }

        node.querySelectorAll('[ott]').forEach((child) => this.process(child));
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

    if(document.readyState !== 'loading')
    {
        return this.start();
    }

    document.addEventListener('DOMContentLoaded', () => this.start());
}, 'Watches the document, transforming the nodes standing and the ones that arrive after.');
