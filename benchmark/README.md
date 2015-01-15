benchmarks
==========

**2015-01-14** Latest results, using latest versions of modules:

* `enb@0.13.4`
* `scan-level@0.0.4`

```
                      bem-walk
           8,999 op/s » `flat` level
           3,292 op/s » `nested` level
             160 op/s » `bem-bl`
              97 op/s » `bem-core` + `bem-components`

                      enb@0.x
           6,367 op/s » `flat` level
           3,749 op/s » `nested` level
             101 op/s » `bem-bl`
              64 op/s » `bem-core` + `bem-components`

                      scan-level
           8,493 op/s » `flat` level
           3,429 op/s » `nested` level
             105 op/s » `bem-bl`
              66 op/s » `bem-core` + `bem-components`


  Suites:  3
  Benches: 12
  Elapsed: 20,748.29 ms
```
