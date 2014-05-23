(function() {

  zengine.canvas {

    tileSize, 32,
    view: {
      height: 600,
      width: 800
    },
    
    assetPath: {
      sprites: "resources/img/icons/items/",
      tiles: "resources/img/tiles/"
    }

    screenElement: null,

    initialize: function(screenElement) {

      this.screenElement = screenElement;

      cnv.onmousemove = over;

    }

  }

})();