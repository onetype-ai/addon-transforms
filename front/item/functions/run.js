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

    this.release = (context) =>
    {
        const listener = onetype.emitters.catch('onetype.dom.remove', (removed) =>
        {
            if(removed !== node && document.contains(node))
            {
                return;
            }

            onetype.emitters.off('onetype.dom.remove', listener);
            this.unobserve();
            item.Get('destroy') && item.Get('destroy').call(context, data, node, item);
        });
    };

    this.finish = () =>
    {
        requestAnimationFrame(() =>
        {
            node.removeAttribute('ot');
            node.removeAttribute('ot-init');
        });
    };

    this.start = () =>
    {
        node.setAttribute('ot-init', '');

        const context = this.state();

        item.Get('code').call(context, data, node, item);
        this.observe(context);
        this.track(context);
        this.release(context);
        this.finish();
    };

    if(data === null)
    {
        data = transforms.Fn('get.data', item.Get('config'), node);
    }

    item.Fn('load').then(() =>
    {
        document.contains(node) && this.start();
    });
});
