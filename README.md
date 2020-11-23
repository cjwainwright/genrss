# genrss

genrss (pronounced "Generous, err... S. Generous-s... Well, something like that!") is an RSS generator for static sites. It scans through the HTML files looking for content marked for inclusion in the RSS feed. Output is a valid RSS xml file, with entries sorted by date, truncated to a configurable number. The RSS file can then be included as part of your static site.

## Installation and setup

Install the package as a dev dependency in your project

```
npm i -D genrss
```

Add an npm script to your package.json to run genrss, this could be a postbuild script for example
```json
{
    ⋮
    "scripts": {
        ⋮
        "postbuild": "genrss"
    }
}
```

By default genrss will scan all `.html` and `.htm` files in the current directory and create a file called `rss.xml` in the same directory. If you wish to configure this create a `genrss.json` configuration file. The following is the default configuration:
```json
{
    "inputDir": "./",
    "inputFiles": ["**/*.html", "**/*.htm"],
    "outputDir": "./",
    "outputFile": "rss.xml",
    "itemCount": 10,
    "title": null,
    "description": "",
    "url": null
}
```
Omitting any of these values from your `genrss.json` config will result in the default value being used.

The `url` property is required as RSS feeds are designed to be consumed as standalone data and thus must use fully qualified links. Omitting this will result in an error when running. Content scanned by genrss is treated as if the `inputDir` is hosted at the `url`.

Note, the `title` and `description` property will, if left null, use the package `name` and `description` from your package.json. 


For example, to scan the contents of your `/dist` folder and output an RSS file to the same folder, which is then hosted at https://example.com, you would use the following `genrss.json` config:
```json
{
    "inputDir": "./dist",
    "outputDir": "./dist",
    "url": "https://example.com"
}
```
## Including content

Now we have genrss running, we need to tell it what content to include in the RSS feed. By default no content will be included and genrss will generate an RSS file with no entries.

To include some html content it needs to be wrapped in a single html element. Your html structure may already have an appropriate element and if so you should use that, but if not it's normally possible to wrap content in a `<span>...</span>` without affecting the layout of the page (some caveats do however apply).

The element must have an attribute `data-feed-id` set to some value, uniquely chosen for this feed entry. Further attributes can then be specified on the element to provide information about the feed entry, the full list of supported attributes is

* `data-feed-id` - The unique id for this feed item
* `data-feed-title` - The title of the feed item
* `data-feed-date` - The date of the feed item, can be any supported format
* `data-feed-url` - Allows explicitly setting the URL for the feed item's link, if not set the link will be set as the URL of the (last) page the crawler found the item on.

So for example you may have something like

```html
<div data-feed-i`="mythoughtsonthenatureofexistence" 
     data-feed-title="My thoughts on the nature of existence" 
     data-feed-date="10 Apr 2010">
    It seems that the physical world is merely a view on the underlying logic that determines it. Should the 
    whole of existence be reducible to a mere mathematical equation, is the existence of this equation not 
    equivalent to the physical world it predicts? Were another equation to be writ (or imagined, or merely 
    possible), are not all the consequences of it's logic enough to say that it is another world perhaps 
    containing entities with the power of mind to come to similar conclusions.
</div>
```

When genrss discovers this element it will create a feed item and use this element as the feed items "description", which is just RSS terminology for the items content.