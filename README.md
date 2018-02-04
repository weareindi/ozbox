# Ozbox
An image display script designed with progressive enhancement in mind.

***
### Usage
The main aim of this script is to take a hyperlink that normally forwards to an image file, override that default behaviour using javascript and load the image within a lightbox via ajax.

**At it’s most basic all you need to do is insert a data attribute on the hyperlink that points to an image file.**

```
<a href=”image.jpg” data-lightbox>click me to view image</a>
```

***
##### Groups
Did you notice there is no value to the ‘data-lightbox’ attribute in the example above?

Without a value with the data-lightbox attribute that image will load as a single image, it won’t interact with any other lightbox links. It will simply open a lightbox and load that single image.

If you would like to open a lightbox with multiple images that the user can change via previous and next buttons then you need to add a group name by adding a value to the data-lightbox attribute.

```
<a href=”image.jpg” data-lightbox=”group1”>click me to view all images in this group</a>
<a href=”image.jpg” data-lightbox=”group1”>click me to view all images in this group</a>
```

***
### Demo
Available here: [Live Demo](http://ozpital.com/plugins/ozbox/demo/)
