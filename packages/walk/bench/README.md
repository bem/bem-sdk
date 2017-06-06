benchmarks
==========

**2016-05-07** Latest results, using `Node.js@4` and latest versions of modules:

* `enb@0.15.0`
* `scan-level@0.0.4`

```
                         flat level
                bem-walk x 13,091 ops/sec ±7.22% (70 runs sampled) mean 0.08 ms
    bem-walk + fs.stat() x 5,169 ops/sec ±3.20% (69 runs sampled) mean 0.19 ms
bem-walk + fs.statSync() x 9,522 ops/sec ±3.43% (78 runs sampled) mean 0.11 ms
                     enb x 10,469 ops/sec ±1.89% (79 runs sampled) mean 0.10 ms
                   scanl x 10,646 ops/sec ±6.66% (68 runs sampled) mean 0.09 ms

                         nested level
                bem-walk x 3,693 ops/sec ±2.78% (71 runs sampled) mean 0.27 ms
    bem-walk + fs.stat() x 2,511 ops/sec ±3.92% (68 runs sampled) mean 0.40 ms
bem-walk + fs.statSync() x 3,392 ops/sec ±3.21% (74 runs sampled) mean 0.29 ms
                     enb x 6,762 ops/sec ±1.50% (82 runs sampled) mean 0.15 ms
                   scanl x 4,355 ops/sec ±4.11% (73 runs sampled) mean 0.23 ms

                         bem-bl
                bem-walk x 195 ops/sec ±4.01% (67 runs sampled) mean 5.12 ms
    bem-walk + fs.stat() x 106 ops/sec ±3.09% (69 runs sampled) mean 9.42 ms
bem-walk + fs.statSync() x 145 ops/sec ±2.30% (75 runs sampled) mean 6.89 ms
                     enb x 164 ops/sec ±2.74% (82 runs sampled) mean 6.12 ms
                   scanl x 139 ops/sec ±3.18% (78 runs sampled) mean 7.22 ms

                         bem-components
                bem-walk x 139 ops/sec ±3.29% (72 runs sampled) mean 7.20 ms
    bem-walk + fs.stat() x 60.70 ops/sec ±2.77% (69 runs sampled) mean 16.48 ms
bem-walk + fs.statSync() x 85.82 ops/sec ±2.44% (77 runs sampled) mean 11.65 ms
                     enb x 93.10 ops/sec ±1.67% (71 runs sampled) mean 10.74 ms
                   scanl x 82.47 ops/sec ±2.79% (74 runs sampled) mean 12.13 ms
```
