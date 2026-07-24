// This file is part of OneType. Created and led by Dejan Tomic <hi@iamdejan.com>, co-authored by Stefan Pakic, onetype.ai

transforms.Fn('item.load', function(item)
{
    if(!transforms.StoreGet('loaded'))
    {
        transforms.StoreSet('loaded', {});
    }

    const loaded = transforms.StoreGet('loaded');

    this.promise = (url, element) =>
    {
        loaded[url] = new Promise((resolve, reject) =>
        {
            element.onload = resolve;
            element.onerror = () => reject(onetype.Error(500, 'The url failed to load: :url:.', { url }, true));
            document.head.appendChild(element);
        });

        return loaded[url];
    };

    this.script = (url) =>
    {
        if(loaded[url])
        {
            return loaded[url];
        }

        const element = document.createElement('script');

        element.src = url;
        element.async = true;

        return this.promise(url, element);
    };

    this.style = (url) =>
    {
        if(loaded[url])
        {
            return loaded[url];
        }

        const element = document.createElement('link');

        element.rel = 'stylesheet';
        element.href = url;

        return this.promise(url, element);
    };

    const scripts = item.Get('js').map((url) => this.script(url));
    const styles = item.Get('css').map((url) => this.style(url));

    return Promise.all([...scripts, ...styles]);
});
