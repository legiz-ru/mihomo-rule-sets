import ipaddress
import os

# 1. Обработка IP (wli)
nets = []
if os.path.exists('wl_raw.txt'):
    with open('wl_raw.txt', 'r') as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith('#'):
                continue
            try:
                nets.append(ipaddress.ip_network(line))
            except ValueError:
                continue
    merged = ipaddress.collapse_addresses(nets)
    with open('other/wli.list', 'w') as out:
        for net in merged:
            out.write(str(net) + '\n')

# 2. Обработка доменов (wld/wldc)
double_tlds = {'.gov.ru', '.com.ru', '.net.ru', '.org.ru', '.edu.ru'}

def get_root(domain):
    domain = domain.lower().strip().rstrip('.')
    for tld in double_tlds:
        if domain.endswith(tld):
            parts = domain[:-len(tld)].split('.')
            return f'{parts[-1]}{tld}' if parts[-1] else domain
    parts = domain.split('.')
    return '.'.join(parts[-2:]) if len(parts) >= 2 else domain

if os.path.exists('wld_raw.txt'):
    with open('wld_raw.txt', 'r') as f:
        domains = {get_root(line) for line in f if line.strip() and not line.startswith('#')}
    sorted_domains = sorted(list(domains))
    with open('other/wld.list', 'w') as f:
        for d in sorted_domains:
            f.write(f'+.{d}\n')
    with open('other/wldc.yaml', 'w') as f:
        f.write('payload:\n')
        for d in sorted_domains:
            f.write(f'  - DOMAIN-SUFFIX,{d}\n')