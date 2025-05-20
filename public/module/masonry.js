export function resizeMasonryItem(item) {
    var grid = document.getElementsByClassName('image-area')[0],
        rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap')),
        rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'));

    var itemHeight = item.querySelector('.masonry-image').getBoundingClientRect().height;
    var rowSpan = Math.ceil((itemHeight + rowGap) / (rowHeight + rowGap));

    item.style.gridRowEnd = 'span ' + rowSpan;

    // Set the image height to be less than or equal to its intrinsic height
    var img = item.querySelector('.masonry-image');
    img.style.height = 'auto'; // Set image height to auto to respect intrinsic dimensions
    img.style.maxHeight = '100%'; // Ensure the image does not stretch beyond its container
}


    /**
     * Apply spanning to all the masonry items
     *
     * Loop through all the items and apply the spanning to them using 
     * `resizeMasonryItem()` function.
     *
     * @uses resizeMasonryItem
     */
    export function resizeAllMasonryItems(){
    // Get all item class objects in one list
    var allItems = document.getElementsByClassName('image-spot');

    /*
    * Loop through the above list and execute the spanning function to
    * each list-item (i.e. each masonry item)
    */
for(var i=0;i<allItems.length;i++){
        resizeMasonryItem(allItems[i]);
    }
}
/**
 * Resize the items when all the images inside the masonry grid 
 * finish loading. This will ensure that all the content inside our
 * masonry items is visible.
 *
 * @uses ImagesLoaded
 * @uses resizeMasonryItem
 */
export function waitForImages() {
    var allItems = document.getElementsByClassName('image-spot');
    for(var i=0;i<allItems.length;i++){
        imagesLoaded( allItems[i], function(instance) {
            var item = instance.elements[0];
            resizeMasonryItem(item);
        } );
    }
}
 /* Resize all the grid items on the load and resize events */
 var masonryEvents = ['load', 'resize'];
 masonryEvents.forEach( function(event) {
    window.addEventListener(event, resizeAllMasonryItems);
});
/* Do a resize once more when all the images finish loading */

waitForImages();