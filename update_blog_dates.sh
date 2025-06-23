#!/bin/bash

# Update blog post dates to recent 2025 dates (around June 2025)
declare -A date_updates=(
    ["Dec 15, 2025"]="Jun 20, 2025"
    ["Dec 12, 2025"]="Jun 18, 2025"
    ["Dec 10, 2025"]="Jun 15, 2025"
    ["Dec 8, 2025"]="Jun 12, 2025"
    ["Dec 5, 2025"]="Jun 10, 2025"
    ["Dec 3, 2025"]="Jun 8, 2025"
    ["Dec 20, 2025"]="Jun 22, 2025"
    ["Dec 18, 2025"]="Jun 21, 2025"
    ["Nov 30, 2025"]="Jun 5, 2025"
    ["Nov 28, 2025"]="Jun 3, 2025"
    ["Nov 25, 2025"]="Jun 1, 2025"
    ["Nov 22, 2025"]="May 30, 2025"
    ["Nov 20, 2025"]="May 28, 2025"
    ["Nov 18, 2025"]="May 25, 2025"
    ["Nov 15, 2025"]="May 22, 2025"
    ["Nov 12, 2025"]="May 20, 2025"
    ["Nov 10, 2025"]="May 18, 2025"
    ["Nov 8, 2025"]="May 15, 2025"
    ["Nov 5, 2025"]="May 12, 2025"
    ["Nov 3, 2025"]="May 10, 2025"
    ["Nov 1, 2025"]="May 8, 2025"
    ["Oct 30, 2025"]="May 5, 2025"
    ["Oct 28, 2025"]="May 3, 2025"
    ["Oct 25, 2025"]="May 1, 2025"
    ["Oct 22, 2025"]="Apr 28, 2025"
    ["Oct 20, 2025"]="Apr 25, 2025"
    ["Oct 18, 2025"]="Apr 22, 2025"
    ["Oct 15, 2025"]="Apr 20, 2025"
)

# Apply updates to all HTML files
for old_date in "${!date_updates[@]}"; do
    new_date="${date_updates[$old_date]}"
    echo "Updating $old_date to $new_date"
    find . -name "*.html" -exec sed -i '' "s/$old_date/$new_date/g" {} \;
done

echo "Blog dates updated successfully!"
