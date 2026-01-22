#!/bin/bash

SVG_FILE="icon.svg"
OUTPUT_DIR="."

mkdir -p $OUTPUT_DIR

for size in 128 48 32 16; do
    inkscape "$SVG_FILE" -w $size -h $size -o "$OUTPUT_DIR/icon${size}.png"
done

echo "Export completed!"

