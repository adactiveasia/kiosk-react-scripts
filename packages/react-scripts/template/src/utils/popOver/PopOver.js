// @flow

import { Math as ThreeMath } from 'three';
import downArrow from './down-arrow.svg';
import upArrow from './up-arrow.svg';

const fontHeightCache = new Map();

let workingCanvas = null;

/**
 * @public
 */
class PopOver {

    constructor(text, options) {
        this.text = text;
        this.options = options;
    }

    build() {
        return new Promise(
            (resolve)=> {
                const lines = this.text.split('\n');

                workingCanvas = document.createElement('canvas');
                workingCanvas.style.border = '1px solid black';

                const fontHeight = this.getFontHeight(this.options.size, this.options.font, workingCanvas);
                const lineHeight = fontHeight * this.options.lineHeight;
                const textHeight = lines.length * lineHeight;

                let textWidth = 0;
                lines.forEach((line) => {
                    textWidth = Math.max(
                        textWidth,
                        this.getTextWidth(line, this.options.size, this.options.font, workingCanvas),
                    );
                });

                const stokeWidth = 1;
                const marginLeft = this.options.directionIcon !== null ? 7 : 0;
                const width = marginLeft + textWidth + this.options.backgroundPadding + (stokeWidth * 2);
                const height = textHeight + this.options.backgroundPadding + (stokeWidth / 3) + this.options.pinHeight;

                workingCanvas.width = width * this.options.quality;
                workingCanvas.height = height * this.options.quality;

                const ctx = workingCanvas.getContext('2d');
                ctx.scale(this.options.quality, this.options.quality);

                ctx.clearRect(0, 0, width, height);

                ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
                ctx.strokeStyle ="rgba(0, 0, 0, 0.7)";
                this.drawPopOver(ctx, 0, 0, width, height, this.options.pinHeight, stokeWidth, 2);

                if(this.options.directionIcon !== null) {
                    const img = new Image();
                    img.src = this.options.directionIcon === "up" ? upArrow : downArrow;
                    img.onload = ()=> {
                        this.addText(ctx, lines, width, lineHeight, fontHeight, stokeWidth, marginLeft).then(
                            (firstOffsetY)=>{
                                const adjust = this.options.directionIcon === "up" ? 2 : 1;
                                ctx.drawImage(img, 2, firstOffsetY - adjust , marginLeft,lineHeight);
                                this.drawToCanvas(workingCanvas);
                                resolve();
                            }
                        );
                    };
                } else {
                    this.addText(ctx, lines, width, lineHeight, fontHeight, stokeWidth, marginLeft).then(
                        ()=>{
                            this.drawToCanvas(workingCanvas);
                            resolve();
                        }
                    );
                }
            }
        );
    }


    addText( ctx, lines, width, lineHeight, fontHeight, stokeWidth, marginLeft) {
        return new Promise(
            (resolve)=> {
                ctx.textBaseline = 'hanging';
                ctx.textAlign = 'center';
                ctx.font = `${this.options.size}pt ${this.options.font}`;
                ctx.fillStyle = '#ffffff';

                const lineMarginTop = (lineHeight - fontHeight) / 2;

                let offsetY = lineMarginTop + (this.options.backgroundPadding / 2) + (stokeWidth) + this.options.fontHeightOffset;
                const firstOffsetY = offsetY;
                for (let k = 0; k < lines.length; k++) {
                    ctx.fillText(
                        lines[k],
                        (width / 2) - (stokeWidth) + (marginLeft/2),
                        offsetY,
                    );

                    offsetY += lineHeight + lineMarginTop;
                }

                resolve(firstOffsetY);
            }
        );
    }

    drawToCanvas(workingCanvas) {
        this._canvas = document.createElement('canvas');
        this._canvas.width = ThreeMath.floorPowerOfTwo(workingCanvas.width);
        this._canvas.height = ThreeMath.floorPowerOfTwo(workingCanvas.height);
        this._canvas.getContext('2d').drawImage(
            workingCanvas,
            0, 0, workingCanvas.width, workingCanvas.height,
            0, 0, this._canvas.width, this._canvas.height,
        );
    }

    drawPopOver(ctx, x, y, width, height, pinHeight, stokeWidth, cornerRadius) {
        ctx.lineWidth = stokeWidth;
        const shifted = {
            x: x + (stokeWidth / 2),
            y: y + (stokeWidth / 2)
        };
        //const pinOffsetled = pinHeight - stokeWidth;
        const reduced = {
            width: width - (stokeWidth * 3),
            height: height - (stokeWidth) - pinHeight
        };
        ctx.beginPath();
        ctx.moveTo(shifted.x + cornerRadius, shifted.y);
        ctx.lineTo(shifted.x + reduced.width  - cornerRadius, shifted.y);
        ctx.arcTo(shifted.x + reduced.width, shifted.y, shifted.x + reduced.width, shifted.y + cornerRadius, cornerRadius);
        ctx.lineTo(shifted.x + reduced.width, shifted.y + reduced.height - cornerRadius);
        ctx.arcTo(shifted.x + reduced.width,  shifted.y + reduced.height, shifted.x + reduced.width - cornerRadius,  shifted.y + reduced.height , cornerRadius);
        ctx.lineTo(shifted.x  + cornerRadius, shifted.y + reduced.height);
        ctx.arcTo(shifted.x,  shifted.y + reduced.height, shifted.x,  shifted.y + reduced.height - cornerRadius , cornerRadius);
        ctx.lineTo(shifted.x, shifted.y + cornerRadius);
        ctx.arcTo(shifted.x,  shifted.y, shifted.x + cornerRadius,  shifted.y , cornerRadius);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
    }

    /**
     * @private
     * @param {number} size
     * @param {string} font
     * @param {HTMLCanvasElement} canvas
     * @return {*}
     */
    getFontHeight(size, font, canvas) {
        const fontStyle = `${size}pt ${font}`;

        if (fontHeightCache.has(fontStyle)) {
            return fontHeightCache.get(fontStyle);
        }

        // TODO: Try to guess at least
        // Make sure big text would be working
        canvas.width = 1000;
        canvas.height = 500;

        const context = canvas.getContext('2d');
        context.fillStyle = 'black';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.textBaseline = 'top';
        context.fillStyle = 'white';
        context.font = fontStyle;
        context.fillText('gM', 0, canvas.height / 2);

        const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
        let start = -1;
        let end = -1;
        for (let row = 0; row < canvas.height; row++) {
            for (let column = 0; column < canvas.width; column++) {
                const indexRedChannelPixel = (((row * canvas.width) + column) * 4);
                const isWhitePixel = pixels[indexRedChannelPixel] === 0;

                if (!isWhitePixel) {
                    if (start === -1) {
                        // First non transparent pixel
                        start = row;
                    }

                    // There is at least one non-transparent pixel, so end will at least be row
                    end = row + 1;

                    // No need to continue on that row, let's break the column loop
                    break;
                }
            }
        }

        const result = (end - start);
        fontHeightCache.set(fontStyle, result);

        return result;
    }

    /**
     * @private
     * @param {string} text
     * @param {number} size
     * @param {string} font
     * @param {HTMLCanvasElement} canvas
     * @return {number}
     */
    getTextWidth(text, size, font, canvas) {
        const context = canvas.getContext('2d');
        context.font = `${size}pt ${font}`;

        return context.measureText(text).width;
    }
}

export default PopOver;
