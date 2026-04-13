#!/usr/bin/env python3
"""
Generates examples/remnawave_prod_rubundle.yaml by merging the base template
with the tun exclude-package list from other/ru-app-list-tun.yaml.
"""

base_path = '.github/base/remnawave_prod_rubundle_base.yaml'
tun_path = 'other/ru-app-list-tun.yaml'
out_path = 'examples/remnawave_prod_rubundle.yaml'

with open(base_path) as f:
    base_lines = f.readlines()

with open(tun_path) as f:
    tun_lines = f.readlines()

# Extract exclude-package section (skip the 'tun:' header line)
exclude_section = tun_lines[1:]

# Walk through the base template, find the end of the tun: block,
# and insert the exclude-package section before the next top-level key.
result = []
in_tun = False
tun_inserted = False

for line in base_lines:
    if line.startswith('tun:'):
        in_tun = True
    elif in_tun and not line.startswith(' ') and not line.startswith('\t') and line.strip():
        # First top-level key after tun: — insert exclude-package here
        if not tun_inserted:
            result.extend(exclude_section)
            tun_inserted = True
        in_tun = False
    result.append(line)

# Edge case: tun: is the very last section in the file
if in_tun and not tun_inserted:
    result.extend(exclude_section)

with open(out_path, 'w') as f:
    f.writelines(result)

print(f"Generated {out_path}")
