import ipaddress

ipv4_nets = []
ipv6_nets = []

with open('raw_ips.txt', 'r') as f:
    for line in f:
        line = line.strip()
        if not line or line.startswith('#'):
            continue
        try:
            net = ipaddress.ip_network(line)
            if net.version == 4:
                ipv4_nets.append(net)
            else:
                ipv6_nets.append(net)
        except ValueError:
            continue

merged_v4 = ipaddress.collapse_addresses(ipv4_nets)
merged_v6 = ipaddress.collapse_addresses(ipv6_nets)

with open('ru-bundle/rknasnblock.list', 'w') as out:
    for net in merged_v4:
        out.write(str(net) + '\n')
    for net in merged_v6:
        out.write(str(net) + '\n')