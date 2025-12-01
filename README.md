# mihomo (clash-meta) rulesets

## ru-bundle
include: [itdoginfo-inside-russia](https://github.com/itdoginfo/allow-domains/) + [no-russia-hosts](https://github.com/dartraiden/no-russia-hosts) + [antifilter-community](https://community.antifilter.download/)
<details>
  <summary>how to add ↓ </summary>
  
<details>
  <summary>.yaml example for binary rule-set .mrs ↓ </summary>
  
```yaml
sniffer:
  enable: true
  force-dns-mapping: true
  parse-pure-ip: true
  sniff:
    HTTP:
      ports: [80, 8080-8880]
      override-destination: true
    TLS:
      ports: [443, 8443]
rule-providers:
  ru-bundle:
    type: http
    behavior: domain
    format: mrs
    url: https://github.com/legiz-ru/mihomo-rule-sets/raw/main/ru-bundle/rule.mrs
    path: ./ru-bundle/rule.mrs
    interval: 86400
rules:
  - RULE-SET,ru-bundle,PROXY
  - MATCH,DIRECT
```

</details>
<details>
  <summary>add to vpnbot ↓ </summary>
  
```shell
proxy:domain:86400:https://github.com/legiz-ru/mihomo-rule-sets/raw/main/ru-bundle/rule.mrs
```

</details>
</details>

## oisd (adblocklists + nsfw)
include all list from [oisd](oisd.nl)
<details>
  <summary>how to add ↓ </summary>
  
<details>
  <summary>.yaml example for binary rule-set .mrs ↓ </summary>
  
```yaml
sniffer:
  enable: true
  force-dns-mapping: true
  parse-pure-ip: true
  sniff:
    HTTP:
      ports: [80, 8080-8880]
      override-destination: true
    TLS:
      ports: [443, 8443]
rule-providers:
  oisd_big:
    type: http
    behavior: domain
    format: mrs
    url: https://github.com/legiz-ru/mihomo-rule-sets/raw/main/oisd/big.mrs
    path: ./oisd/big.mrs
    interval: 86400
  oisd_small:
    type: http
    behavior: domain
    format: mrs
    url: https://github.com/legiz-ru/mihomo-rule-sets/raw/main/oisd/small.mrs
    path: ./oisd/small.mrs
    interval: 86400
  oisd_nsfw_small:
    type: http
    behavior: domain
    format: mrs
    url: https://github.com/legiz-ru/mihomo-rule-sets/raw/main/oisd/nsfw_small.mrs
    path: ./oisd/nsfw_small.mrs
    interval: 86400
  oisd_nsfw_big:
    type: http
    behavior: domain
    format: mrs
    url: https://github.com/legiz-ru/mihomo-rule-sets/raw/main/oisd/nsfw.mrs
    path: ./oisd/nsfw_big.mrs
    interval: 86400
rules:
  - RULE-SET,oisd_small,REJECT
  - RULE-SET,oisd_big,REJECT
  - RULE-SET,oisd_nsfw_small,REJECT
  - RULE-SET,oisd_nsfw_big,REJECT
  - MATCH,DIRECT
```

</details>
<details>
  <summary>add to vpnbot ↓ </summary>
  
**BIG LIST:**

```shell
reject:domain:86400:https://github.com/legiz-ru/mihomo-rule-sets/raw/main/oisd/big.mrs
```
**SMALL LIST:**

```shell
reject:domain:86400:https://github.com/legiz-ru/mihomo-rule-sets/raw/main/oisd/small.mrs
```
**NSFW BIG LIST:**

```shell
reject:domain:86400:https://github.com/legiz-ru/mihomo-rule-sets/raw/main/oisd/nsfw.mrs
```
**NSFW SMALL LIST:**

```shell
reject:domain:86400:https://github.com/legiz-ru/mihomo-rule-sets/raw/main/oisd/nsfw_small.mrs
```

</details>
</details>

## re-filter
include domain & ip list from [re-filter](https://github.com/1andrevich/Re-filter-lists) & [ech+no-ech list by Akiyamov](https://github.com/Akiyamov/singbox-ech-list) based on re-filter
<details>
  <summary>how to add ↓ </summary>
  
<details>
  <summary>.yaml example for binary rule-set .mrs ↓ </summary>
  
```yaml
sniffer:
  enable: true
  force-dns-mapping: true
  parse-pure-ip: true
  sniff:
    HTTP:
      ports: [80, 8080-8880]
      override-destination: true
    TLS:
      ports: [443, 8443]
rule-providers:
  refilter_domains:
    type: http
    behavior: domain
    format: mrs
    url: https://github.com/legiz-ru/mihomo-rule-sets/raw/main/re-filter/domain-rule.mrs
    path: ./re-filter/domain-rule.mrs
    interval: 86400
  refilter_ipsum:
    type: http
    behavior: ipcidr
    format: mrs
    url: https://github.com/legiz-ru/mihomo-rule-sets/raw/main/re-filter/ip-rule.mrs
    path: ./re-filter/ip-rule.mrs
    interval: 86400
rules:
  - RULE-SET,refilter_domains,PROXY
  - RULE-SET,refilter_ipsum,PROXY
  - MATCH,DIRECT
```

</details>
<details>
  <summary>.yaml example with ECH+noECH rules ↓ </summary>
  
```yaml
sniffer:
  enable: true
  force-dns-mapping: true
  parse-pure-ip: true
  sniff:
    HTTP:
      ports: [80, 8080-8880]
      override-destination: true
    TLS:
      ports: [443, 8443]
rule-providers:
  refilter_noech:
    type: http
    behavior: domain
    format: mrs
    url: https://github.com/legiz-ru/mihomo-rule-sets/raw/main/re-filter/re-filter-noech.mrs
    path: ./re-filter/noech.mrs
    interval: 86400
  refilter_ech:
    type: http
    behavior: domain
    format: mrs
    url: https://github.com/legiz-ru/mihomo-rule-sets/raw/main/re-filter/re-filter-ech.mrs
    path: ./re-filter/ech.mrs
    interval: 86400
  refilter_ipsum:
    type: http
    behavior: ipcidr
    format: mrs
    url: https://github.com/legiz-ru/mihomo-rule-sets/raw/main/re-filter/ip-rule.mrs
    path: ./re-filter/ip-rule.mrs
    interval: 86400
rules:
  - DOMAIN,cloudflare-ech.com,PROXY
  - RULE-SET,refilter_ech,DIRECT
  - RULE-SET,refilter_noech,PROXY
  - RULE-SET,refilter_ipsum,PROXY
  - MATCH,DIRECT
```

</details>
<details>
  <summary>add to vpnbot ↓ </summary>
  
```shell
proxy:domain:86400:https://github.com/legiz-ru/mihomo-rule-sets/raw/main/re-filter/domain-rule.mrs
```
```shell
proxy:ipcidr:86400:https://github.com/legiz-ru/mihomo-rule-sets/raw/main/re-filter/ip-rule.mrs
```

</details>
</details>

## other rule-sets
<details>
  <summary>torrent clients, trackers, websites ↓ </summary>
  
<details>
  <summary>.yaml example for binary rule-set .mrs ↓ </summary>
  
```yaml
sniffer:
  enable: true
  force-dns-mapping: true
  parse-pure-ip: true
  sniff:
    HTTP:
      ports: [80, 8080-8880]
      override-destination: true
    TLS:
      ports: [443, 8443]
rule-providers:
  torrent-trackers:
    type: http
    behavior: domain
    format: mrs
    url: https://github.com/legiz-ru/mihomo-rule-sets/raw/main/other/torrent-trackers.mrs
    path: ./rule-sets/torrent-trackers.mrs
    interval: 86400
  torrent-websites:
    type: http
    behavior: domain
    format: mrs
    url: https://github.com/legiz-ru/mihomo-rule-sets/raw/main/other/torrent-websites.mrs
    path: ./rule-sets/torrent-websites.mrs
    interval: 86400
  torrent-clients:
    type: http
    behavior: classical
    format: yaml
    url: https://github.com/legiz-ru/mihomo-rule-sets/raw/main/other/torrent-clients.yaml
    path: ./rule-sets/torrent-clients.yaml
    interval: 86400
rules:
  - RULE-SET,torrent-clients,DIRECT
  - RULE-SET,torrent-trackers,DIRECT
  - RULE-SET,torrent-websites,PROXY
  - MATCH,DIRECT
```

</details>
<details>
  <summary>add to vpnbot ↓ </summary>
  
```shell
DIRECT:domain:86400:https://github.com/legiz-ru/mihomo-rule-sets/raw/main/other/torrent-trackers.mrs
```

```shell
PROXY:domain:86400:https://github.com/legiz-ru/mihomo-rule-sets/raw/main/other/torrent-websites.mrs
```

```shell
DIRECT:classical:86400:https://github.com/legiz-ru/mihomo-rule-sets/raw/main/other/torrent-clients.yaml
```

</details>
</details>

<details>
  <summary>lists from ru-bundle (itdoginfo-inside-russia, no-russia-hosts, antifilter-community) ↓ </summary>
  
<details>
  <summary>.yaml example for binary rule-set .mrs ↓ </summary>
  
```yaml
sniffer:
  enable: true
  force-dns-mapping: true
  parse-pure-ip: true
  sniff:
    HTTP:
      ports: [80, 8080-8880]
      override-destination: true
    TLS:
      ports: [443, 8443]
rule-providers:
  antifilter-community:
    type: http
    behavior: domain
    format: mrs
    url: https://github.com/legiz-ru/mihomo-rule-sets/raw/main/ru-bundle/antifilter-community.mrs
    path: ./ru-bundle/antifilter-community.mrs
    interval: 86400
  no-russia-hosts:
    type: http
    behavior: domain
    format: mrs
    url: https://github.com/legiz-ru/mihomo-rule-sets/raw/main/ru-bundle/no-russia-hosts.mrs
    path: ./ru-bundle/no-russia-hosts.mrs
    interval: 86400
  itdoginfo-inside-russia:
    type: http
    behavior: domain
    format: mrs
    url: https://github.com/legiz-ru/mihomo-rule-sets/raw/main/ru-bundle/itdoginfo-inside-russia.mrs
    path: ./ru-bundle/itdoginfo-inside-russia.mrs
    interval: 86400
rules:
  - RULE-SET,itdoginfo-inside-russia,PROXY
  - RULE-SET,no-russia-hosts,PROXY
  - RULE-SET,antifilter-community,PROXY
  - MATCH,DIRECT
```

</details>
<details>
  <summary>add to vpnbot ↓ </summary>
  
itdoginfo-inside-russia:
  
```shell
proxy:domain:86400:https://github.com/legiz-ru/mihomo-rule-sets/raw/main/ru-bundle/itdoginfo-inside-russia.mrs
```

no-russia-hosts:

```shell
proxy:domain:86400:https://github.com/legiz-ru/mihomo-rule-sets/raw/main/ru-bundle/no-russia-hosts.mrs
```

antifilter-community:

```shell
proxy:domain:86400:https://github.com/legiz-ru/mihomo-rule-sets/raw/main/ru-bundle/antifilter-community.mrs
```

</details>
</details>

<details>
  <summary>ru-app-list (Russian mobile apps) ↓ </summary>
  
<details>
  <summary>.yaml example for classical rule-set ↓ </summary>
  
```yaml
rule-providers:
  ru-app-list:
    type: http
    behavior: classical
    format: yaml
    url: https://github.com/legiz-ru/mihomo-rule-sets/raw/main/other/ru-app-list.yaml
    path: ./rule-sets/ru-app-list.yaml
    interval: 86400
rules:
  - RULE-SET,ru-app-list,DIRECT
  - MATCH,DIRECT
```

</details>
<details>
  <summary>add to vpnbot ↓ </summary>
  
```shell
DIRECT:classical:86400:https://github.com/legiz-ru/mihomo-rule-sets/raw/main/other/ru-app-list.yaml
```

</details>
</details>

<details>
  <summary>games-direct () ↓ </summary>
  
<details>
  <summary>.yaml example for classical rule-set ↓ </summary>
  
```yaml
rule-providers:
  ru-app-list:
    type: http
    behavior: classical
    format: yaml
    url: https://github.com/legiz-ru/mihomo-rule-sets/raw/main/other/games-direct.yaml
    path: ./rule-sets/games-direct.yaml
    interval: 86400
rules:
  - RULE-SET,games-direct,DIRECT
  - MATCH,DIRECT
```

</details>
<details>
  <summary>add to vpnbot ↓ </summary>
  
```shell
DIRECT:classical:86400:https://github.com/legiz-ru/mihomo-rule-sets/raw/main/other/games-direct.yaml
```

</details>
</details>

<details>
  <summary>discord-voice-ips ↓ </summary>
  
<details>
  <summary>.yaml example for binary rule-set .mrs ↓ </summary>
  
```yaml
rule-providers:
  discord-voice-ips:
    type: http
    behavior: ipcidr
    format: mrs
    url: https://github.com/legiz-ru/mihomo-rule-sets/raw/main/other/discord-voice-ip-list.mrs
    path: ./other/discord-voice-ips.mrs
    interval: 86400
rules:
  - RULE-SET,discord-voice-ips,PROXY
  - MATCH,DIRECT
```

</details>
<details>
  <summary>add to vpnbot ↓ </summary>
  
```shell
proxy:ipcidr:86400:https://github.com/legiz-ru/mihomo-rule-sets/raw/main/other/discord-voice-ip-list.mrs
```

</details>
</details>

# another mihomo rulesets
- [mihomo rule-sets](https://github.com/MetaCubeX/meta-rules-dat/tree/meta) by MetaCubeX include: asn/geoip/geosite
- [CDN-RuleSet](https://github.com/PentiumB/CDN-RuleSet) by PentiumB

## Stargazers over time
[![Stargazers over time](https://starchart.cc/legiz-ru/mihomo-rule-sets.svg?variant=adaptive)](https://starchart.cc/legiz-ru/mihomo-rule-sets)

