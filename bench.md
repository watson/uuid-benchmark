# Benchmark Results

| Method | Secure | Format | Re-use | Cache | Sync | Ops/sec | RME | Samples |
|--------|--------|--------|--------|-------|------|---------|-----|---------|
| [uuid/v1] |  | uuid |  | n/a | ✅ | 811,507 | ±2.82% | 82 |
| [uuid/v1] |  | hex |  | n/a | ✅ | 327,692 | ±2.50% | 81 |
| [uuid/v1] |  | hex | ✅ | n/a | ✅ | 446,807 | ±2.06% | 82 |
| [uuid/v4] | ✅ | uuid |  | n/a | ✅ | 226,238 | ±2.46% | 81 |
| [uuid/v4] | ✅ | hex |  | n/a | ✅ | 195,106 | ±4.64% | 75 |
| [uuid/v4] | ✅ | hex | ✅ | n/a | ✅ | 221,731 | ±3.92% | 80 |
| [fast-uuid] |  | uuid |  | n/a | ✅ | 589,476 | ±2.28% | 87 |
| [uuid-random] | ✅ | uuid |  | n/a | ✅ | 1,121,583 | ±1.45% | 89 |
| [sodium-uuid] | ✅ | hex |  | n/a | ✅ | 202,754 | ±0.92% | 89 |
| [sodium-uuid] | ✅ | hex | ✅ | n/a | ✅ | 203,440 | ±1.47% | 91 |
| [crypto.randomBytes] | ✅ | hex |  | n/a |  | 34,187 | ±4.53% | 71 |
| [crypto.randomBytes] | ✅ | hex |  | n/a | ✅ | 237,299 | ±3.68% | 80 |
| [crypto.randomBytes] | ✅ | hex |  | 256 | ✅ | 936,978 | ±2.13% | 92 |
| [crypto.randomBytes] | ✅ | hex | ✅ | 256 | ✅ | 876,253 | ±2.70% | 90 |
| [crypto.randomBytes] | ✅ | hex |  | 256 |  | 312,388 | ±1.51% | 76 |
| [crypto.randomBytes] | ✅ | hex | ✅ | 256 |  | 284,225 | ±1.43% | 76 |
| [crypto.randomBytes] | ✅ | hex |  | 4096 | ✅ | 1,115,024 | ±1.07% | 85 |
| [crypto.randomBytes] | ✅ | hex | ✅ | 4096 | ✅ | 1,049,101 | ±0.96% | 90 |
| [crypto.randomBytes] | ✅ | hex |  | 4096 |  | 695,092 | ±2.08% | 75 |
| [crypto.randomBytes] | ✅ | hex | ✅ | 4096 |  | 714,130 | ±4.54% | 75 |
| [crypto.randomBytes] | ✅ | hex |  | 65536 | ✅ | 1,137,460 | ±2.97% | 79 |
| [crypto.randomBytes] | ✅ | hex | ✅ | 65536 | ✅ | 1,093,908 | ±1.76% | 85 |
| [crypto.randomBytes] | ✅ | hex |  | 65536 |  | 851,490 | ±2.26% | 70 |
| [crypto.randomBytes] | ✅ | hex | ✅ | 65536 |  | 824,179 | ±1.25% | 76 |
| [crypto.randomFillSync] | ✅ | hex | ✅ | n/a | ✅ | 291,891 | ±1.18% | 88 |
| [crypto.randomFillSync] | ✅ | hex |  | 256 | ✅ | 993,988 | ±1.51% | 90 |
| [crypto.randomFillSync] | ✅ | hex | ✅ | 256 | ✅ | 1,000,888 | ±1.38% | 89 |
| [crypto.randomFillSync] | ✅ | hex |  | 4096 | ✅ | 1,289,090 | ±1.34% | 90 |
| [crypto.randomFillSync] | ✅ | hex | ✅ | 4096 | ✅ | 1,229,782 | ±1.31% | 93 |
| [crypto.randomFillSync] | ✅ | hex |  | 65536 | ✅ | 1,240,885 | ±1.31% | 92 |
| [crypto.randomFillSync] | ✅ | hex | ✅ | 65536 | ✅ | 1,218,096 | ±1.24% | 64 |
| [crypto.randomFill] | ✅ | hex | ✅ | n/a |  | 35,751 | ±1.24% | 77 |
| [crypto.randomFill] | ✅ | hex |  | 256 |  | 324,463 | ±1.05% | 75 |
| [crypto.randomFill] | ✅ | hex | ✅ | 256 |  | 317,362 | ±1.07% | 77 |
| [crypto.randomFill] | ✅ | hex |  | 4096 |  | 797,042 | ±1.47% | 77 |
| [crypto.randomFill] | ✅ | hex | ✅ | 4096 |  | 785,585 | ±1.47% | 77 |
| [crypto.randomFill] | ✅ | hex |  | 65536 |  | 917,081 | ±1.76% | 76 |
| [crypto.randomFill] | ✅ | hex | ✅ | 65536 |  | 881,770 | ±1.29% | 77 |
| [/dev/random] | ✅ | hex | ✅ | n/a |  | 37,900 | ±1.31% | 76 |
| [/dev/random] | ✅ | hex | ✅ | n/a | ✅ | 218,287 | ±1.25% | 92 |
| [/dev/random] | ✅ | hex |  | 256 |  | 230,807 | ±0.86% | 72 |
| [/dev/random] | ✅ | hex | ✅ | 256 |  | 226,728 | ±1.44% | 75 |
| [/dev/random] | ✅ | hex | ✅ | 256 | ✅ | 432,717 | ±1.47% | 93 |
| [/dev/random] | ✅ | hex |  | 4096 |  | 371,332 | ±1.12% | 76 |
| [/dev/random] | ✅ | hex | ✅ | 4096 |  | 365,701 | ±1.38% | 78 |
| [/dev/random] | ✅ | hex | ✅ | 4096 | ✅ | 482,084 | ±1.08% | 94 |
| [/dev/random] | ✅ | hex |  | 65536 |  | 378,072 | ±2.16% | 75 |
| [/dev/random] | ✅ | hex | ✅ | 65536 |  | 390,664 | ±2.05% | 66 |
| [/dev/random] | ✅ | hex | ✅ | 65536 | ✅ | 534,065 | ±1.31% | 30 |
| [/dev/urandom] |  | hex | ✅ | n/a |  | 38,226 | ±0.81% | 78 |
| [/dev/urandom] |  | hex | ✅ | n/a | ✅ | 222,412 | ±1.19% | 94 |
| [/dev/urandom] |  | hex |  | 256 |  | 229,025 | ±1.12% | 77 |
| [/dev/urandom] |  | hex | ✅ | 256 |  | 230,678 | ±1.52% | 75 |
| [/dev/urandom] |  | hex | ✅ | 256 | ✅ | 441,102 | ±0.92% | 90 |
| [/dev/urandom] |  | hex |  | 4096 |  | 390,959 | ±1.21% | 69 |
| [/dev/urandom] |  | hex | ✅ | 4096 |  | 369,882 | ±1.15% | 74 |
| [/dev/urandom] |  | hex | ✅ | 4096 | ✅ | 475,459 | ±0.76% | 93 |
| [/dev/urandom] |  | hex |  | 65536 |  | 353,085 | ±1.83% | 73 |
| [/dev/urandom] |  | hex | ✅ | 65536 |  | 366,854 | ±2.02% | 72 |
| [/dev/urandom] |  | hex | ✅ | 65536 | ✅ | 513,027 | ±1.83% | 30 |
