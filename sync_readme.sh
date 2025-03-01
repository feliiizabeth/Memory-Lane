#!/bin/bash

# File paths
INDEX="index.md"
README="README.md"

# Front matter starts and ends with `---`
delimiter="---"

# Static README content
title="# Memory Lane"
about="A collection of my New York University memos written in Markdown with [Obsidian](https://obsidian.md/)."

# Extract INDEX content after the front matter
extracted_content=$(sed -e "/$delimiter/,/$delimiter/d" "$INDEX")

# Write to README the static content followed by the extracted INDEX content
printf "%s\n\n%s\n%s" "$title" "$about" "$extracted_content" > "$README"

# Confirm script execution
echo "README sync complete!"