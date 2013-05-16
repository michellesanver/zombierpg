(function() {
    var pressedKeys = {};
    var moving = false;

    function setKey(event, status) {
        var code = event.keyCode;
        var key;

        switch(code) {
        case 32:
            key = 'SPACE'; break;
        case 37:
            key = 'LEFT'; break;
        case 38:
            key = 'UP'; break;
        case 39:
            key = 'RIGHT'; break;
        case 40:
            key = 'DOWN'; break;
        default:
            // Convert ASCII codes to letters
            key = String.fromCharCode(code);
        }
        pressedKeys[key] = status;
    }

    document.addEventListener('keydown', function(e) {
        setKey(e, true);
        moving = true;
    });

    document.addEventListener('keyup', function(e) {
        moving = false;
        setKey(e, false);
    });

    window.addEventListener('blur', function() {
        pressedKeys = {};
    });

    window.input = {
        isDown: function(key) {
            return pressedKeys[key.toUpperCase()];
        },

        moving: function() {
            return moving;
        },

        somethingIsDown: function() {
            var somethingIsDown = false;

            var keys = ["UP", "LEFT", "RIGHT", "DOWN", "A", "W", "S", "D"];

            for (index = 0; index < keys.length; ++index) {
                if( pressedKeys[keys[index]] == true) {
                    somethingIsDown = true;
                    moving = true;
                }
            }

            return somethingIsDown;
        }

    };
})();