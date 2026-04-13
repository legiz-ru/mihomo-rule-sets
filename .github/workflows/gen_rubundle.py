#!/usr/bin/env python3
"""
Generates a Mihomo example config by merging a base template with
the tun exclude-package list from other/ru-app-list-tun.yaml.

Usage:
  gen_rubundle.py                          # defaults for remnawave_prod_rubundle.yaml
  gen_rubundle.py <base> <tun> <output>   # custom paths
"""
import sys

if len(sys.argv) == 4:
    base_path, tun_path, out_path = sys.argv[1], sys.argv[2], sys.argv[3]
else:
    base_path = '.github/base/remnawave_prod_rubundle_base.yaml'
    tun_path  = 'other/ru-app-list-tun.yaml'
    out_path  = 'examples/remnawave_prod_rubundle.yaml'

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