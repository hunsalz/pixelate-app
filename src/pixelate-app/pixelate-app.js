import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';

import '@polymer/paper-slider/paper-slider.js';
import '@polymer/font-roboto/roboto.js';

class PixelateApp extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          color: white;
        }

        .container {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
          overflow: hidden;
          background: var(--paper-blue-grey-800);
        }

        #box {
          display: inline-flex;
          @apply --layout-vertical;
          position: absolute;
          top: 50%;
          left: 50%;
          width: 80vw;
          height: 80vh;
          transform: translate(-50%, -50%);
        }

        #pixelarea {
          display: inline-flex;
          @apply --layout-vertical;
          justify-content: center;
          height: 100%;
        }

        #controls { 
          display: inline-flex;
          @apply --layout-horizontal;
          justify-content: center;
          width: 100%;
          margin: 4vh 0 0 0;
        }

        canvas {
          display: block;
          margin: 0 auto;
          image-rendering: optimizeSpeed;
          image-rendering: -moz-crisp-edges;
          image-rendering: -o-crisp-edges;
          image-rendering: -webkit-optimize-contrast;
          image-rendering: pixelated;
          -ms-interpolation-mode: nearest-neighbor;
          background: var(--paper-blue-grey-800);
        }

        paper-slider {
          width: 60vw;
          --paper-slider-knob-color: white;
          --paper-slider-active-color: white;
        }
      </style>
      
      <div class="container">
        <div id="box">
          <div id="pixelarea">
            <canvas id="canvas"></canvas>
          </div>
          <div id="controls">
            <div>Pixelatation: [[__percentage(size)]]%</div>
            <paper-slider min="1" max="100" value="{{size}}" immediate-value="{{size}}" pin></paper-slider>
          </div>
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

    // img properties
    // TODO make src dynamic
    this.img.src = "images/leaf.jpg";
    this.img.crossOrigin = "anonymous";

    this.__resize = this.__resize || function () {

      // fit canvas in pixel area
      let ratio = this.__calculateAspectRatio(this.img.width, this.img.height, this.$.pixelarea.offsetWidth, this.$.pixelarea.offsetHeight);
      this.$.canvas.width = ratio.width;
      this.$.canvas.height = ratio.height;

      // re-draw image
      this.__pixelate();
    }.bind(this);


    afterNextRender(this, function () {

      // draw image on load ...
      let __this = this;
      this.img.onload = function () {
        __this.__resize();
      }
      // add event listener
      this._createPropertyObserver('size', '__pixelate', true);
      window.addEventListener('resize', this.__resize);
    });
  }

  /**
   * 
   * @param {*} size 
   */
  __percentage(size) {
    return 100 - size;
  }

  /**
   * 
   */
  __pixelate() {

    let ctx = this.$.canvas.getContext('2d');

    // define scale & ratio 
    let scale = this.size / 100;
    let ratio = this.__calculateAspectRatio(this.img.width, this.img.height, this.$.pixelarea.offsetWidth, this.$.pixelarea.offsetHeight);
    let width = ratio.width * scale;
    let height = ratio.height * scale;

    // draw scaled image
    ctx.drawImage(this.img, 0, 0, width, height);

    // draw scaled image on full canvas size
    ctx.msImageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(this.$.canvas, 0, 0, width, height, 0, 0, ratio.width, ratio.height);
  }

  /**
   * 
   * @param {*} srcWidth 
   * @param {*} srcHeight 
   * @param {*} maxWidth 
   * @param {*} maxHeight 
   */
  __calculateAspectRatio(srcWidth, srcHeight, maxWidth, maxHeight) {

    var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
    return { width: srcWidth * ratio, height: srcHeight * ratio };
  }
}

window.customElements.define('pixelate-app', PixelateApp);