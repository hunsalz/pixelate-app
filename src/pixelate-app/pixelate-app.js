import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import {afterNextRender} from '@polymer/polymer/lib/utils/render-status.js';
import '@polymer/paper-slider/paper-slider.js';

/**
 * @customElement
 * @polymer
 */
class PixelateApp extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }

        .container {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
          overflow: hidden;
          background: var(--paper-blue-grey-800);
          @apply --layout-flex;
        }

        #box {
          display: inline-flex;
          flex-flow: column nowrap;
          justify-content: center;
          align-content: center;
          align-items: center;
          position: absolute;
          top: 50%;
          left: 50%;
          width: 80vw;
          height: 80vh;
          transform: translate(-50%, -50%);
        }

        canvas {
          image-rendering: optimizeSpeed;
          image-rendering: -moz-crisp-edges;
          image-rendering: -o-crisp-edges;
          image-rendering: -webkit-optimize-contrast;
          image-rendering: pixelated;
          -ms-interpolation-mode: nearest-neighbor;
        }

        paper-slider {
          width: 80vw;
        }
      </style>
      
      <div class="container">
        <div id="box">
          <canvas id="canvas"></canvas>
          <paper-slider min="1" max="100" value="{{size}}" immediate-value="{{size}}" pin></paper-slider>
        </div>
      </div>
    `;
  }
  static get properties() {
    return {
      img: {
        type: Object,
        value: new Image()
      },
      size: {
        type: Number,
        value: 50
      }
    };
  }

  constructor() {
    super();
    console.log("constructor called");
    
    this.img.crossOrigin = "anonymous";
    this.img.src = "images/girl.jpg";

    this.__resize = this.__resize || function () {
      
      console.log("resize");
      let deltaX = this.$.box.offsetWidth / this.img.width;
      let deltaY = this.$.box.offsetHeight / this.img.height;

      let delta = 1;
      if (deltaX < deltaY) {
        delta = deltaX;
      } else {
        delta = deltaY;
      }
      console.log("div width: " + this.$.box.offsetWidth);
      console.log("div height: " + this.$.box.offsetHeight);

      this.$.canvas.width = this.img.width * delta;
      this.$.canvas.height = this.img.height * delta;

      console.log("canvas width: " + this.$.canvas.width);
      console.log("canvas height: " + this.$.canvas.height);

      this.__draw();
    }.bind(this);


    afterNextRender(this, function () {


      let __this = this;
      this.img.onload = function () {  
        __this.__resize();
        
      }

      this._createPropertyObserver('size', '__draw', true);

      window.addEventListener('resize', this.__resize);
    });
  }

  __draw() {

    console.log("draw ...");

    let ctx = this.$.canvas.getContext('2d');
    let scale = this.size / 100;
    let w = this.$.canvas.width * scale;
    let h = this.$.canvas.height * scale;

    ctx.drawImage(this.img, 0, 0, w, h);

    ctx.msImageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(this.$.canvas, 0, 0, w, h, 0, 0, this.$.canvas.width, this.$.canvas.height); 
  }
}

window.customElements.define('pixelate-app', PixelateApp);
