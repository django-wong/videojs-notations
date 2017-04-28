### videojs-notations
=================


![](https://raw.githubusercontent.com/django-wong/videojs-notations/master/Screen%20Shot%202017-04-28.png)


A plugin for videojs inspired by [ajbogh/video-js-html5Thumbnails](https://github.com/ajbogh/video-js-html5Thumbnails) and [spchuang/videojs-markers](https://github.com/spchuang/videojs-markers)

-----
Usage
-----
```javascript
var video = videojs('#example');
video.notations({
    'notations': [
        {
            'time': 3,
            'text': 'Scantly unrepealably slinky'
        },
        {
            'time': 12.2,
            'text': 'Unbulky bemoisten slumberer bash'
        },
        {
            'time': 32.21,
            'text': 'Inappropriately havel'
        }
    ],
    'size': 180,
    'fontSize': 12,
    'showPreviewWhenHoverOnSeekBar': false
});
```

-------
Options
-------
```javascript
{
    'onHover': function(){

    },
    'onClick': function(){
        
    },
    'notations': [],
    'size': 128,
    'fontSize': 14,
    'showPreviewWhenHoverOnSeekBar': false
}
```

-------
License
-------
[WTFPL](http://www.wtfpl.net/txt/copying/)
