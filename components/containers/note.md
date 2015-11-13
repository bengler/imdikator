
1 - 2 dim	n variabler			all of: kjonn, all of: x



Befolkning i Oslo

Sammensetning


Rules

- In a bar chart always lock first dimension variables







**Nåtid**

[sammenlignet: null]
[år: 2012 / 2013 / …]
[Befolkningsgrupper: VIS ALLE]


[Kjonn: SKJUL [q='alle'] / VIS [q=0,1] <-- headergroups - 'alle'       <-- special case: 'alle finnes ikke'

DIM1/*, DIM2/*


[sammenlignet: Larvik]
[år: 2012 / 2013 / …]
[Befolkningsgrupper: VIS ALLE]
[Kjonn: ALLE / KVINNER / MENN]

STED, DIM1/*, DIM2/[VAR]  |

STED, DIM1/*, DIM2/[alle, kvinner, menn]  |


**Over tid**

[sammenlignet: null]
[år: HIDDEN]
[Befolkningsgrupper: VIS ALLE]
[Kjonn: ALLE / KVINNER / MENN]

DIM1/*, DIM2/[VAR]

[sammenlignet: Larvik]
[år: 2012 / 2013 / …]
[Befolkningsgrupper: INNVANDRERE, BEFOLKNINGEN, NORSKFORDTE]
[Kjonn: ALLE / KVINNER / MENN]

STED, DIM1/[VAR], DIM2/[VAR]


**Kart**

[sammenlignet: SET]
[år: 2012 / 2013 / …]
[Befolkningsgrupper: INNVANDRERE, BEFOLKNINGEN, NORSKFORDTE]
[Kjonn: ALLE / KVINNER / MENN]

STED, DIM1/[VAR], DIM2/[VAR]


**Benchmark**

[sammenlignet: SET]
[år: 2012 / 2013 / …]
[Befolkningsgrupper: INNVANDRERE, BEFOLKNINGEN, NORSKFORDTE]
[Kjonn: ALLE / KVINNER / MENN]

STED, DIM1/[VAR], DIM2/[VAR]

-----------



