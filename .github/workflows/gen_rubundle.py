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

# Walk through the base template: append tun: line, then immediately
# insert exclude-package at the top of the tun: block.
result = []

for line in base_lines:
    result.append(line)
    if line.startswith('tun:'):
        result.extend(exclude_section)

with open(out_path, 'w') as f:
    f.writelines(result)

print(f"Generated {out_path}")