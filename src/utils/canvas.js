import { createCanvas, loadImage } from 'canvas';

// Define a list of color names and their RGB values
export const getColorInfo = async (imageUrl) => {
    let newImageUrl = imageUrl
    if (imageUrl.endsWith('.webp')) { // check if the image format is WebP
        newImageUrl = imageUrl.replace('.webp', '.jpeg') // replace the extension with JPEG
    }
    const image = await loadImage(newImageUrl);
    const centerX = Math.floor(image.width / 2);
    const centerY = Math.floor(image.height / 2);
    const regionSize = 300;
    const canvas = createCanvas(regionSize, regionSize);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, centerX - regionSize / 2, centerY - regionSize / 2, regionSize, regionSize, 0, 0, regionSize, regionSize);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let centerR = 0;
    let centerG = 0;
    let centerB = 0;
    for (let i = 0; i < imageData.data.length; i += 4) {
        centerR += imageData.data[i];
        centerG += imageData.data[i + 1];
        centerB += imageData.data[i + 2];
    }
    const centerPixelCount = imageData.data.length / 4;
    const centerAvgR = Math.round(centerR / centerPixelCount);
    const centerAvgG = Math.round(centerG / centerPixelCount);
    const centerAvgB = Math.round(centerB / centerPixelCount);
    let rDeviation = 0;
    let gDeviation = 0;
    let bDeviation = 0;
    for (let i = 0; i < imageData.data.length; i += 4) {
        rDeviation += (imageData.data[i] - centerAvgR) ** 2;
        gDeviation += (imageData.data[i + 1] - centerAvgG) ** 2;
        bDeviation += (imageData.data[i + 2] - centerAvgB) ** 2;
    }
    const centerColor = `rgb(${centerAvgR}, ${centerAvgG}, ${centerAvgB})`;

    const { name, originalName } = getColorName([centerAvgR, centerAvgG, centerAvgB])
    function getColorName(rgbValue) {
        let minDistance = Number.MAX_VALUE;
        let closestColor = null;

        for (let i = 0; i < colorMap.length; i++) {
            const color = colorMap[i];
            const distance = Math.sqrt(
                Math.pow(rgbValue[0] - color.rgb[0], 2) +
                Math.pow(rgbValue[1] - color.rgb[1], 2) +
                Math.pow(rgbValue[2] - color.rgb[2], 2)
            );
            if (distance < minDistance) {
                minDistance = distance;
                closestColor = color;
            }
        }
        let name = closestColor.name
        let originalName = closestColor.originalName
        return { name, originalName };
    }
    return { centerColor, name, originalName };
}

const colorMap = [
    { originalName: 'Black', name: 'Black', rgb: [0, 0, 0] },
    { originalName: 'Dim gray', name: 'Gray', rgb: [105, 105, 105] },
    { originalName: 'Gray', name: 'Gray', rgb: [128, 128, 128] },
    { originalName: 'Dark gray', name: 'Gray', rgb: [169, 169, 169] },
    { originalName: 'Slate gray', name: 'Gray', rgb: [112, 128, 144] },
    { originalName: 'Light slate gray', name: 'Gray', rgb: [119, 136, 153] },
    { originalName: 'Dark slate gray', name: 'Gray', rgb: [47, 79, 79] },
    { originalName: 'Light Purple', name: 'Purple', rgb: [200, 162, 200] },
    { originalName: 'Medium Purple', name: 'Purple', rgb: [128, 0, 128] },
    { originalName: 'Purple', name: 'Purple', rgb: [128, 0, 128] },
    { originalName: 'Dark Purple', name: 'Purple', rgb: [80, 0, 80] },
    { originalName: 'Dark green', name: 'Green', rgb: [0, 40, 0] },
    { originalName: 'Forest green', name: 'Green', rgb: [34, 139, 34] },
    { originalName: 'Green', name: 'Green', rgb: [0, 128, 0] },
    { originalName: 'Lime green', name: 'Green', rgb: [50, 205, 50] },
    { originalName: 'Olive green', name: 'Green', rgb: [85, 107, 47] },
    { originalName: 'Pale green', name: 'Green', rgb: [152, 251, 152] },
    { originalName: 'Sea green', name: 'Green', rgb: [46, 139, 87] },
    { originalName: 'Spring green', name: 'Green', rgb: [0, 255, 127] },
    { originalName: 'Yellow green', name: 'Green', rgb: [154, 205, 50] },
    { originalName: 'Navy blue', name: 'Blue', rgb: [0, 0, 128] },
    { originalName: 'Dark blue', name: 'Blue', rgb: [0, 0, 139] },
    { originalName: 'Midnight blue', name: 'Blue', rgb: [25, 25, 112] },
    { originalName: 'Blue', name: 'Blue', rgb: [0, 0, 255] },
    { originalName: 'Dodger blue', name: 'Blue', rgb: [30, 144, 255] },
    { originalName: 'Cornflower blue', name: 'Blue', rgb: [100, 149, 237] },
    { originalName: 'Sky blue', name: 'Blue', rgb: [135, 206, 235] },
    { originalName: 'Light blue', name: 'Blue', rgb: [173, 216, 230] },
    { originalName: 'Powder blue', name: 'Blue', rgb: [176, 224, 230] },
    { originalName: 'Baby blue', name: 'Blue', rgb: [189, 219, 255] },
    { originalName: 'Slate blue', name: 'Blue', rgb: [106, 90, 205] },
    { originalName: 'Steel blue', name: 'Blue', rgb: [70, 130, 180] },
    { originalName: 'Light steel blue', name: 'Blue', rgb: [176, 196, 222] },
    { originalName: 'Alice blue', name: 'Blue', rgb: [240, 248, 255] },
    { originalName: 'Light Brown', name: 'Brown', rgb: [205, 183, 158] },
    { originalName: 'Medium Brown', name: 'Brown', rgb: [165, 42, 42] },
    { originalName: 'Brown', name: 'Brown', rgb: [139, 69, 19] },
    { originalName: 'Dark Brown', name: 'Brown', rgb: [101, 67, 33] },
    { originalName: 'Silver', name: 'Silver', rgb: [192, 192, 192] },
    { originalName: 'Light Silver', name: 'Silver', rgb: [211, 211, 211] },
    { originalName: 'Dark Silver', name: 'Silver', rgb: [169, 169, 169] },
    { originalName: 'Medium Silver', name: 'Silver', rgb: [176, 176, 176] },
    { originalName: 'Pale Silver', name: 'Silver', rgb: [201, 192, 187] },
    { originalName: 'Beige', name: 'Beige', rgb: [245, 245, 220] },
    { originalName: 'Light Beige', name: 'Beige', rgb: [255, 245, 238] },
    { originalName: 'Dark Beige', name: 'Beige', rgb: [222, 184, 135] },
    { originalName: 'Medium Beige', name: 'Beige', rgb: [210, 180, 140] },
    { originalName: 'Pale Beige', name: 'Beige', rgb: [255, 239, 213] },
    { originalName: 'Red', name: 'Red', rgb: [255, 0, 0] },
    { originalName: 'Light Red', name: 'Red', rgb: [255, 182, 193] },
    { originalName: 'Dark Red', name: 'Red', rgb: [139, 0, 0] },
    { originalName: 'Medium Red', name: 'Red', rgb: [205, 92, 92] },
    { originalName: 'Crimson Red', name: 'Red', rgb: [220, 20, 60] },
    { originalName: 'Scarlet Red', name: 'Red', rgb: [255, 36, 0] },
    { originalName: 'Maroon Red', name: 'Red', rgb: [128, 0, 0] },
    { originalName: 'Burgundy Red', name: 'Red', rgb: [128, 0, 32] },
    { originalName: 'Ivory', name: 'Ivory', rgb: [255, 255, 240] },
    { originalName: 'Light Ivory', name: 'Ivory', rgb: [255, 255, 224] },
    { originalName: 'Dark Ivory', name: 'Ivory', rgb: [255, 235, 205] },
    { originalName: 'Medium Ivory', name: 'Ivory', rgb: [255, 240, 220] },
    { originalName: 'Cream Ivory', name: 'Ivory', rgb: [255, 253, 208] },
    { originalName: 'Pink', name: 'Pink', rgb: [255, 192, 203] },
    { originalName: 'Light Pink', name: 'Pink', rgb: [255, 182, 193] },
    { originalName: 'Dark Pink', name: 'Pink', rgb: [231, 84, 128] },
    { originalName: 'Medium Pink', name: 'Pink', rgb: [219, 112, 147] },
    { originalName: 'Hot Pink', name: 'Pink', rgb: [255, 105, 180] },
    { originalName: 'Orange', name: 'Orange', rgb: [255, 165, 0] },
    { originalName: 'Light Orange', name: 'Orange', rgb: [255, 204, 153] },
    { originalName: 'Dark Orange', name: 'Orange', rgb: [255, 140, 0] },
    { originalName: 'Medium Orange', name: 'Orange', rgb: [255, 128, 0] },
    { originalName: 'Coral Orange', name: 'Orange', rgb: [255, 127, 80] },
    { originalName: 'Gold', name: 'Gold', rgb: [255, 215, 0] },
    { originalName: 'Light Gold', name: 'Gold', rgb: [255, 236, 139] },
    { originalName: 'Dark Gold', name: 'Gold', rgb: [207, 181, 59] },
    { originalName: 'Rose Gold', name: 'Gold', rgb: [183, 110, 121] },
    { originalName: 'Pale Gold', name: 'Gold', rgb: [230, 190, 138] },
    { originalName: 'Yellow', name: 'Yellow', rgb: [255, 255, 0] },
    { originalName: 'Light Yellow', name: 'Yellow', rgb: [255, 255, 224] },
    { originalName: 'Dark Yellow', name: 'Yellow', rgb: [255, 215, 0] },
    { originalName: 'Medium Yellow', name: 'Yellow', rgb: [255, 204, 0] },
    { originalName: 'Lemon Yellow', name: 'Yellow', rgb: [255, 247, 0] },
    { originalName: 'White', name: 'White', rgb: [255, 255, 255] },
    { originalName: 'Snow White', name: 'White', rgb: [255, 250, 250] },
    { originalName: 'Ghost White', name: 'White', rgb: [248, 248, 255] },
    { originalName: 'Floral White', name: 'White', rgb: [255, 250, 240] }

];
