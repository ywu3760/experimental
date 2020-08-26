class Gallery {
    constructor(parentNode, id, style) {
        this.parentNode = document.body;
        if (typeof(arguments[0]) === "object" && arguments[0] instanceof Node) this.parentNode = arguments[0];
        else if (arguments.length >= 1) console.log("Invalid first parameter. Parameter needs to be an instance of Node. DOM Body Node will be used as default.");

        this.id = `gallery-experiment-${new Date().getTime()}`;
        if (["string", "number"].includes(typeof(arguments[1]))) this.id = `gallery-experiment-${arguments[1]}`;
        else if (arguments.length >= 2) console.log("Invalid second parameter. Parameter needs to be a number/string. A timestamp ID will be used as default.");

        this.style = {
            "width": "100%",
            "height": "400px",
            "padding": "10px 0px",
            "background-color": "black",
            "display": "flex",
            "flex-direction": "row",
            "overflow": "hidden",
            "align-items": "center",
            "user-select": "none"
        };
        (function(styleObj) {
            if (typeof(styleObj) === "object") for (const cssProp in styleObj) this.style[cssProp] = styleObj[cssProp];
            else if (arguments.length >= 3) console.log("Invalid third parameter. Parameter needs to be an object with CSS properties as keys and appropiate CSS values as values. Default styling will be used.");
        }).bind(this)(arguments[2]);

        this.images = [];
        this.imageSideMargin = 5;

        this.anchor = 0;
        this.progress = 0;
        this.scrolling = false;
        this.dragged = false;
        this.speed = 2000; // num of pixels per second

        this.update({ deepReload: true });
    }
    _Image(imageNode) {
        return new class GalleryImage {
            constructor() {
                this.node = imageNode || new Image();
            }
            click() {
                const img = this.node.cloneNode(true);
                Object.assign(img.style, {
                    "border-radius": "10px",
                    "max-width": "calc(100% - 80px)",
                    "max-height": "calc(100% - 80px)",
                    "box-shadow": "3px 3px 10px rgba(0, 0, 0, 0.7)"
                });

                const modalBox = document.createElement("div");
                Object.assign(modalBox.style, {
                    "width": "100vw",
                    "height": "100vh",
                    "position": "fixed",
                    "top": "0",
                    "left": "0",
                    "z-index": "99",
                    "display": "flex",
                    "justify-content": "center",
                    "align-items": "center",
                    "background-color": "rgba(0, 0, 0, 0.7)",
                    "opacity": "0",
                    "transition": "opacity 0.4s"
                });
                modalBox.onclick = function () {
                    if (event.target != img) modalBox.remove();
                }

                const times = document.createElement("div");
                times.innerHTML = "&times;";
                Object.assign(times.style, {
                    "font-family": "Arial, Helvetica, sans-serif",
                    "color": "#ffffff",
                    "font-size": "64px",
                    "text-decoration": "none",
                    "position": "absolute",
                    "top": "0%",
                    "right": "0%",
                    "z-index": "100",
                    "text-align": "center"
                });
                times.onmouseover = function () {
                    Object.assign(times.style, {
                        "color": "#aaaaaa",
                        "cursor": "pointer"
                    });
                }
                times.onmouseleave = function () {
                    Object.assign(times.style, {
                        "color": "#ffffff",
                        "cursor": "auto"
                    });
                }
                times.onclick = function () {
                    modalBox.remove();
                }

                modalBox.appendChild(img);
                modalBox.appendChild(times);
                document.body.appendChild(modalBox);

                times.style.width = times.style.height = `${(times.clientWidth > times.clientHeight) ? times.clientWidth : times.clientHeight}px`;

                modalBox.style.opacity = "1";
            }
        };
    }
    css() {
        switch (arguments.length) {
            case 0:
                return [...[this.style]][0];
            case 1:
                switch (typeof(arguments[0])) {
                    case "string":
                        return [...[this.style[arguments[0]]]][0];
                    case "object":
                        var cssProp = Object.keys(arguments[0]);
                        (function(cssObj) {
                            for (var i=0; i<cssProp.length; i++) this.style[cssProp[i]] = cssObj[cssProp[i]];
                        }).bind(this)(arguments[0]);
                        return this.update({ deepReload: true });
                    default:
                        return console.log("Invalid parameter. Parameter needs to be a string (CSS property currently in use) or an object with CSS properties as keys and appropiate CSS values as values.");
                }
            case 2:
                this.style[arguments[0]] = arguments[1];
                return this.update({ deepReload: true });
            default:
                return console.log("Invalid number of parameters. The number of parameters cannnot exceed 2.");
        }
    }
    appendImage() {
        if (arguments.length < 1 || (arguments[0] && typeof(arguments[0]) == "number")) {
            const limit = Math.abs(parseInt(arguments[0])) || 1,
                seed = new Date().getTime();
            function rndInt(low, high) {
                return Math.floor(Math.random()*(high + 1 - low)) + low;
            }
            for (var i=0; i<limit; i++) {
                const idx = seed + i;
                var imgProm = new Promise((resolve, reject) => {
                    const img = new Image();
                    img.addEventListener("load", () => resolve(img));
                    img.addEventListener("error", err => reject(err));
                    img.src = `https://picsum.photos/${rndInt(600, 1400)}/${rndInt(600, 1400)}?random=${idx}`;
                })
                .then(node => {
                    this.images.push(this._Image(node));
                    this.update();
                })
                .catch(err => console.log(`Operation failed to retrieve image at index ${idx - seed}. Please try again.`));
            }
        } else {
            for (var i=0; i<arguments.length; i++) {
                if (!(typeof(arguments[i] == "object") && arguments[i].constructor.name == "GalleryImage")) {
                    if (i == 0) console.log("Invalid first parameter. Parameter needs to be an integer indicating the number of random images to be added or a valid instance of GalleryImage.");
                    else console.log(`Invalid parameter at argument index ${i}. Parameter needs to be a valid instance of Gallery._Image.`);
                }
                else this.images.push(arguments[i]);
            }
            this.update();
        }
    }
    focus() {
        if (this.images.length < 1) return console.log("Method can only be used when gallery contains at least one image.");
        if (this.scrolling) return console.log("Operation cannot be performed right now because it is currently in use.")
        if (arguments.length < 1) {
            // autofocus

        } else if (arguments.length == 1 && typeof(arguments[0]) == "number") {
            const targetAnchor = Math.abs(parseInt(arguments[0]));
            const targetNode = this.images[targetAnchor];
            if (!targetNode) return console.log("Invalid parameter. Image index out of bound.");

            const targetRect = document.getElementById(`${this.id}-image-${targetAnchor}`).getBoundingClientRect();
            const distance = (window.innerWidth/2) - (targetRect.width/2) - targetRect.left;
            var speed = Math.abs(distance)/this.speed;
            speed = (speed > 1) ? 1 : speed;

            this.progress+= distance;
            this.scrolling = true;

            const imageNodes = Array.from(document.querySelectorAll(`#${this.id} img`));
            for (var i=0; i<imageNodes.length; i++) {
                Object.assign(imageNodes[i].style, {
                    "transform": `translateX(${this.progress}px)`,
                    "transition": `transform ${speed}s ease-in-out`
                })
            }

            this.anchor = targetAnchor;

            window.setTimeout(function() {
                this.scrolling = false;
            }.bind(this), speed*1000);
        } else return console.log("Invalid parameters. Method can be used with 0 parameters to autofocus or at most 1 parameter corresponding to the image index of a gallery image.")
    }
    update() {
        // Identifying Element
        const THAT = this,
            gallery = document.querySelector(`#${this.id}`) || (function() {
            var g = document.createElement("div");
            g.setAttribute("id", this.id);
            g.setAttribute("class", "Gallery-Module");
            this.parentNode.appendChild(g);

            g.onmousedown = function() {
                event.preventDefault();

                var referenceX = event.clientX,
                    origX = THAT.progress;
                
                function gMouseMove() {
                    event.preventDefault();

                    THAT.progress = origX + event.clientX - referenceX;
                    if (Math.round(THAT.progress) == Math.round(origX)) THAT.dragged = false;
                    else THAT.dragged = true;

                    const imageNodes = Array.from(document.querySelectorAll(`#${this.id} img`));
                    for (var i=0; i<imageNodes.length; i++) {
                        Object.assign(imageNodes[i].style, {
                            "transform": `translateX(${THAT.progress}px)`,
                            "transition": `none`
                        })
                    }
                };
                function gEventRemove() {
                    g.removeEventListener('mousemove', gMouseMove);

                    const imageNodes = Array.from(document.querySelectorAll(`#${this.id} img`));
                    var leftBound = (window.innerWidth/2) - (imageNodes[0].clientWidth/2);
                    var rightBound = (imageNodes.length-1)*THAT.imageSideMargin*(-2);

                    rightBound+= window.innerWidth/2;
                    for (var i=0; i<(imageNodes.length); i++) {
                        rightBound-= (i == imageNodes.length-1) ? imageNodes[i].clientWidth/2 : imageNodes[i].clientWidth;
                    }

                    if (THAT.progress > leftBound) THAT.focus(0);
                    if (THAT.progress < rightBound) THAT.focus(imageNodes.length - 1);

                    window.setTimeout(function() { THAT.dragged = false; }, 1);
                }
                g.addEventListener("mousemove", gMouseMove);
                g.addEventListener("mouseleave", gEventRemove);
                g.addEventListener("mouseup", gEventRemove);
            }
            
            return g;
        }).bind(this)();

        // Applying Style
        for (const cssProp in this.css()) gallery.style[cssProp] = this.css()[cssProp];

        // Refreshing Images
        const deepReload = Boolean(arguments[0] && arguments[0].deepReload);
        if (deepReload) gallery.innerHTML = "";

        for (var i=0; i<this.images.length; i++) {
            const idx = i;
            const galleryImage = this.images[idx];
            const imgNode = galleryImage.node.cloneNode(true);

            if (deepReload || Array.from(document.querySelectorAll(`#${this.id} img`)).filter(node => node.src === imgNode.src).length < 1) {
                gallery.appendChild(imgNode);

                // image attributes
                imgNode.setAttribute("id", `${this.id}-image-${i}`);

                // image css
                Object.assign(imgNode.style, {
                    "max-height": "100%",
                    "max-width": "100%",
                    "margin": `0px ${this.imageSideMargin}px`,
                    "transform": `translateX(${THAT.progress}px)`,
                    "transition": "none",
                    "cursor": "pointer"
                });
                
                // image event listeners
                imgNode.onclick = function() {
                    if (!THAT.dragged) {
                        galleryImage.click.bind(galleryImage)();
                        THAT.focus(idx);
                    }
                };
            }
        }
    }
}

// Example Usage:
// const gallery = new Gallery(
//     document.querySelector(".gallery"),
//     undefined,
//     { "height": "70vh" }
// );
// gallery.appendImage(20);