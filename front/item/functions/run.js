transforms.Fn('item.run', function(item, node, data = null)
{
    this.scroll = () => ({
        progress: 0,
        direction: 'down',
        speed: 0,
        top: 0,
        bottom: 0,
        visible: false
    });

    this.hover = () => ({
        active: false,
        x: 0,
        y: 0,
        offset: 0
    });

    this.click = () => ({
        x: 0,
        y: 0
    });

    this.state = () => ({
        scroll: this.scroll(),
        hover: this.hover(),
        click: this.click()
    });

    this.observe = (context) =>
    {
        item.Get('visible') && onetype.ObserverVisible(node, () => item.Get('visible').call(context, data, node, item));
        item.Get('resize') && onetype.ObserverResize(node, () => item.Get('resize').call(context, data, node, item));

        item.Get('click') && onetype.ObserverClick(node, (click) =>
        {
            context.click = click;
            item.Get('click').call(context, data, node, item);
        });
    };

    this.track = (context) =>
    {
        item.Get('scroll') && onetype.ObserverScroll(node, (scroll) =>
        {
            context.scroll = scroll;
            item.Get('scroll').call(context, data, node, item);
        });

        item.Get('hover') && onetype.ObserverHover(node, (hover) =>
        {
            context.hover = hover;
            item.Get('hover').call(context, data, node, item);
        }, context.hover.offset);
    };

    this.unobserve = () =>
    {
        onetype.ObserverUnvisible(node);
        onetype.ObserverUnresize(node);
        onetype.ObserverUnscroll(node);
        onetype.ObserverUnhover(node);
        onetype.ObserverUnclick(node);
    };

    this.watch = (context) =>
    {
        if(!item.Get('structure'))
        {
            return null;
        }

        const observer = new MutationObserver(() => item.Get('structure').call(context, data, node, item));

        observer.observe(node, {
            childList: true,
            subtree: true
        });

        return observer;
    };

    this.release = (context, watcher) =>
    {
        const listener = onetype.emitters.catch('onetype.dom.remove', (removed) =>
        {
            if(removed !== node && document.contains(node))
            {
                return;
            }

            onetype.emitters.off('onetype.dom.remove', listener);
            watcher && watcher.disconnect();
            this.unobserve();
            item.Get('destroy') && item.Get('destroy').call(context, data, node, item);
        });
    };

    this.finish = () =>
    {
        requestAnimationFrame(() =>
        {
            node.removeAttribute('ott');
            node.removeAttribute('ott-init');
        });
    };

    this.start = () =>
    {
        const context = this.state();
        const watcher = this.watch(context);

        item.Get('code') && item.Get('code').call(context, data, node, item);
        this.observe(context);
        this.track(context);
        this.release(context, watcher);
        this.finish();
    };

    this.merge = (provided) =>
    {
        const read = transforms.Fn('get.data', item.Get('config'), node);

        Object.entries(provided).forEach(([name, value]) =>
        {
            read[name] = onetype.DataDefineOne(value, item.Get('config')[name]);
        });

        return read;
    };

    if(!transforms.StoreGet('ran'))
    {
        transforms.StoreSet('ran', new WeakSet());
    }

    if(node.hasAttribute('ott-init') || transforms.StoreGet('ran').has(node))
    {
        return;
    }

    transforms.StoreGet('ran').add(node);
    node.setAttribute('ott-init', '');
    data = data === null ? transforms.Fn('get.data', item.Get('config'), node) : this.merge(data);

    item.Fn('load').then(() =>
    {
        document.contains(node) && this.start();
    }).catch(() =>
    {
        transforms.StoreGet('ran').delete(node);
        node.removeAttribute('ott');
        node.removeAttribute('ott-init');
    });
});
