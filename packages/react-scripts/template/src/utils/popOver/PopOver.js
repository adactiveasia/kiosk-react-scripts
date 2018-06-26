// @flow

import { Math as ThreeMath } from 'three';

const fontHeightCache = new Map();

let workingCanvas = null;

/**
 * @public
 */
class PopOver {
    constructor(text, options) {
        const lines = text.split('\n');

        workingCanvas = document.createElement('canvas');
        workingCanvas.style.border = '1px solid black';

        const fontHeight = this.getFontHeight(options.size, options.font, workingCanvas);
        const lineHeight = fontHeight * options.lineHeight;
        const textHeight = lines.length * lineHeight;

        let textWidth = 0;
        lines.forEach((line) => {
            textWidth = Math.max(
                textWidth,
                this.getTextWidth(line, options.size, options.font, workingCanvas),
            );
        });

        const stokeWidth = 1;
        const width = textWidth + options.backgroundPadding + (stokeWidth * 2);
        const height = textHeight + options.backgroundPadding + (stokeWidth / 3) + options.pinHeight;

        workingCanvas.width = width * options.quality;
        workingCanvas.height = height * options.quality;

        const ctx = workingCanvas.getContext('2d');
        ctx.scale(options.quality, options.quality);

        ctx.clearRect(0, 0, width, height);

        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#7b0e19';
        this.drawPopOver(ctx, 0, 0, width, height, options.pinHeight, stokeWidth);

        ctx.textBaseline = 'hanging';
        ctx.textAlign = 'center';
        ctx.font = `${options.size}pt ${options.font}`;
        ctx.fillStyle = '#000000';

        const lineMarginTop = (lineHeight - fontHeight) / 2;

        let offsetY = lineMarginTop + (options.backgroundPadding / 2) + (stokeWidth) + options.fontHeightOffset;
        for (let k = 0; k < lines.length; k++) {
            ctx.fillText(
                lines[k],
                (width / 2) - (stokeWidth),
                offsetY,
            );

            offsetY += lineHeight + lineMarginTop;
        }

        this._canvas = document.createElement('canvas');
        this._canvas.width = ThreeMath.floorPowerOfTwo(workingCanvas.width);
        this._canvas.height = ThreeMath.floorPowerOfTwo(workingCanvas.height);
        this._canvas.getContext('2d').drawImage(
            workingCanvas,
            0, 0, workingCanvas.width, workingCanvas.height,
            0, 0, this._canvas.width, this._canvas.height,
        );
    }

    drawPopOver(ctx, x, y, width, height, pinHeight, stokeWidth) {
        ctx.lineWidth = stokeWidth;
        const shifted = {
            x: x + (stokeWidth / 2),
            y: y + (stokeWidth / 2)
        };
        const pinOffsetled = pinHeight - stokeWidth;
        const reduced = {
            width: width - (stokeWidth * 3),
            height: height - (stokeWidth) - pinHeight
        };
        ctx.beginPath();
        ctx.moveTo(shifted.x, shifted.y);
        ctx.lineTo(shifted.x + reduced.width, shifted.y);
        ctx.lineTo(shifted.x + reduced.width, shifted.y + reduced.height);
        ctx.lineTo(shifted.x, shifted.y + reduced.height);
        ctx.lineTo(shifted.x, shifted.y + reduced.height + pinOffsetled);
        ctx.lineTo(shifted.x + pinOffsetled, shifted.y + reduced.height);
        ctx.lineTo(shifted.x, shifted.y + reduced.height);
        ctx.lineTo(shifted.x, shifted.y);
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
