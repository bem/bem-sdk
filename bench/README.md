benchmarks
==========

**2015-07-03** Latest results, using `Node.js@0.12` and latest versions of modules:

* `enb@0.15.0`
* `scan-level@0.0.4`

```
                      bem-walk
           13,913 op/s » `flat` level
            4,860 op/s » `nested` level
              223 op/s » `bem-bl`
              152 op/s » `bem-core` + `bem-components`

                       enb@0.x
            8,894 op/s » `flat` level
            5,829 op/s » `nested` level
              150 op/s » `bem-bl`
               86 op/s » `bem-core` + `bem-components`

                       scan-level
           11,317 op/s » `flat` level
            4,909 op/s » `nested` level
              140 op/s » `bem-bl`
               84 op/s » `bem-core` + `bem-components`


   Suites:  3
   Benches: 12
   Elapsed: 17,992.13 ms
```
