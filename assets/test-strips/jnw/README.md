# Pool Test Strip Chart V2

## Primary master
Use `pool_test_strip_chart_v2_editable.svg` as the editable and developer-facing master.

Each test color is an independent SVG `<rect>` with:
- A unique descriptive object ID
- A separate fill color
- Its displayed value stored in metadata
- A flat center-sampled HEX value

The black range outlines visible in the manufacturer chart are preserved as separate vector objects.

## Adobe Express
Adobe Express can import the SVG and expose its detected colors for recoloring. Depending on the current Adobe Express editor behavior, it may treat the imported SVG as one graphic with a color palette rather than exposing every rectangle as an individually selectable layer.

For guaranteed one-square-at-a-time editing:
1. Open the SVG in Adobe Illustrator, Figma, or Inkscape.
2. Select the rectangle by its object ID.
3. Change only its fill.
4. Save/export the SVG and re-import it into Adobe Express.

## Mobile implementation
- iOS reference width: 358px
- Android reference width: 328px
- Preserve the SVG aspect ratio
- The Android display remains above the 28px minimum swatch size after proportional scaling
- Place the component inside a vertically scrollable screen if the surrounding UI requires more space

## Color accuracy
The attached chart includes minor lighting and compression variation. Each app swatch is a flat median sampled from the central area of the source swatch, not a gradient.
