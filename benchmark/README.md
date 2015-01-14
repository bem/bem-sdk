benchmarks
==========

**2015-01-14** Latest results, using latest versions of modules:

* `enb@0.13.4`
* `scan-level@0.0.4`

```
                    bem-walk
           8,770 op/s » `flat` level
           2,939 op/s » `nested` level
             145 op/s » `bem-bl`
              88 op/s » `bem-core` + `bem-components`

                      enb@0.x
           6,493 op/s » `flat` level
           3,778 op/s » `nested` level
             109 op/s » `bem-bl`
              68 op/s » `bem-core` + `bem-components`

                      scan-level
           7,699 op/s » `flat` level
           3,146 op/s » `nested` level
             104 op/s » `bem-bl`
              65 op/s » `bem-core` + `bem-components`


  Suites:  3
  Benches: 12
  Elapsed: 20,469.39 ms

```
