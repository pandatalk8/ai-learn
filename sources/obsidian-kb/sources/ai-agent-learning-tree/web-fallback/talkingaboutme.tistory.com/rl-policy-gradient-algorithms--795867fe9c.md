Title: [RL] Policy Gradient Algorithms

URL Source: http://talkingaboutme.tistory.com/entry/RL-Policy-Gradient-Algorithms

Published Time: 2019-06-17T12:56:24+09:00

Markdown Content:
본문 바로가기 메뉴 바로가기
자신에 대한 고찰
생각많은 소심남 

자신에 대한 고찰

검색하기 CATEGORY 
티스토리 뷰
Study/AI
[RL] Policy Gradient Algorithms
생각많은 소심남 2019. 6. 17. 12:56

(해당 글은 OpenAI Engineer인 Lilian Weng의 포스트 내용을 원저자 동의하에 번역한 내용입니다.)

 

Policy Gradient Algorithms

Abstract: In this post, we are going to look deep into policy gradient, why it works, and many new policy gradient algorithms proposed in recent years: vanilla policy gradient, actor-critic, off-policy actor-critic, A3C, A2C, DPG, DDPG, D4PG, MADDPG, TRPO,

lilianweng.github.io

Policy Gradient

 강화학습의 목적은 optimal reward를 얻기 위해서 agent에게 optimal한 behavior strategy를 찾는데 있다. 여러 알고리즘들이 있지만, policy gradient는 수식에서 보통 
π
𝜋
라고 표현되는 policy를 직접적으로 모델링하고 최적화하는데 주력하며, 보통은 
θ
𝜃
라고 하는 특정 parameter로 구성된 함수, 
π
θ
𝜋
𝜃
 로 표현된다. Bellman equation에 나오는 reward (objective) function의 값은 이 policy의 영향을 받고, 해당 알고리즘을 적용한 방법들은 보통 최적의 reward를 얻는데있어 이 
θ
𝜃
를 최적화하는 경향을 띄고 있다.

 reward function은 다음과 같이 정의된다.

J
(
θ
)
=
∑


s
∈
S
d
π
(
s
)
V
π
(
s
)
=
∑


s
∈
S
d
π
(
s
)
∑


a
∈
A
π
θ
(
a
|
s
)
Q
π
(
s
,
a
)
𝐽
(
𝜃
)
=
∑
𝑠
∈
𝑆
𝑑
𝜋
(
𝑠
)
𝑉
𝜋
(
𝑠
)
=
∑
𝑠
∈
𝑆
𝑑
𝜋
(
𝑠
)
∑
𝑎
∈
𝐴
𝜋
𝜃
(
𝑎
|
𝑠
)
𝑄
𝜋
(
𝑠
,
𝑎
)

 여기서 
d
π
(
s
)
𝑑
𝜋
(
𝑠
)
는 policy 
π
θ
𝜋
𝜃
를 가진 상태의 markov chain에 대한 stationary distribution이다. (다른게 표현하면 policy 
π
θ
𝜋
𝜃
에 대한 on-policy state distribution) 여기서 policy 
π
θ
𝜋
𝜃
의 
θ
𝜃
는 생략되어서 표현되곤 한다. 예를 들어서 위의 
d
π
,
Q
π
𝑑
𝜋
,
𝑄
𝜋
란 표기도 정식대로 표기하면 policy 
π
θ
𝜋
𝜃
를 가진 상태이므로 
d
π
θ
,
Q
π
θ
𝑑
𝜋
𝜃
,
𝑄
𝜋
𝜃
라고 표기되어야 한다. Stationary distribution이란 용어가 이해가 어려울텐데, 만약 특정 environment상의 markov chain을 가진 state를 계속 이동한다고 가정해보자. 그러면 시간이 끝까지 흘러가게 되면, 어느 특정 state에 도달하게 될 확률은 어느 한 값으로 수렴하게 될텐데, 이걸 policy 
π
θ
𝜋
𝜃
에 대한 stationary probability가 되는 것이다. 그러면 stationary distribution 
d
π
(
s
)
=
lim
t
→
∞
P
(
s
t
=
s
|
s
0
,
π
θ
)
𝑑
𝜋
(
𝑠
)
=
lim
𝑡
→
∞
𝑃
(
𝑠
𝑡
=
𝑠
|
𝑠
0
,
𝜋
𝜃
)
는 state 
s
0
𝑠
0
에서 시작해서 t step동안 policy 
π
θ
𝜋
𝜃
에 따라 action을 취할 때 
s
t
=
s
𝑠
𝑡
=
𝑠
일 확률을 나타내게 된다. 사실 Markov chain에 대한 stationary distribution는 Google 검색 엔진에 들어가 있는 PageRank algorithm을 구성하는 주요 요건이기도 하다. 이에 대해서 확인해보려면, 이 글을 읽어보면 좋을거 같다.

 Policy-based method가 continuous space를 가지는 environment 상에서 조금 더 유용한 것은 당연하다. 왜냐하면, value function의 value을 estimate하기에는 무한의 action과 state가 존재하고 value-based approach는 continuous space를 가진 environment에서 계산하기에는 너무 힘들기 때문이다. 예를 들어 generalized policy iteration 기법같은 경우에는 policy를 improve하는 step인 
a
r
g
max
a
∈
A
Q
π
(
s
,
a
)
𝑎
𝑟
𝑔
max
𝑎
∈
𝐴
𝑄
𝜋
(
𝑠
,
𝑎
)
에서는 action space에 대한 전체 탐색이 필요한데, 이렇게 되면 curse of dimensionality가 발생하게 된다.  

 gradient ascent 기법을 사용하면, 가장 큰 return을 줄 수 있는 policy 
π
θ
𝜋
𝜃
에서 
θ
𝜃
를 찾는데 있어 policy gradient인 
∇
θ
J
(
θ
)
∇
𝜃
𝐽
(
𝜃
)
이 이끄는 방향대로 
θ
𝜃
를 바꿀 수 있게 된다.

 Policy Gradient Theorem

 policy gradient 
∇
θ
J
(
θ
)
∇
𝜃
𝐽
(
𝜃
)
를 계산하는 것은 전체 동작에 있어서 매우 유용한 동작인데, 이 계산이 (
π
θ
𝜋
𝜃
 에 의해 직접적으로 결정되는) action selection과 (
π
θ
𝜋
𝜃
 에 의해 간접적으로 결정되는) target selecton behavior에 의한 stationary distribution에 영향을 주기 때문이다. 주어진 environment가 unknown이면, policy가 update되면서 state distribution 
d
π
(
s
)
𝑑
𝜋
(
𝑠
)
 이 어떻게 바뀌게 될지 estimate하는 것이 어렵기 때문이다.

 다행히도 policy gradient theorem이 이런 문제를 해결할 수 있다. 이를 활용하면, objective function에 대한 derivative를 앞에서 문제로 작용했던 
d
π
(
.
)
𝑑
𝜋
(
.
)
 와 관련되지 않게끔, 식을 재구성해주고, gradient를 계산하는 
∇
θ
J
(
θ
)
∇
𝜃
𝐽
(
𝜃
)
 도 매우 간략하게 해준다.

∇
θ
J
(
θ
)
	
=
∇
θ
∑


s
∈
S
d
π
(
s
)
∑


a
∈
A
Q
π
(
s
,
a
)
π
θ
(
a
|
s
)

	
∝
∑


s
∈
S
d
π
(
s
)
∑


a
∈
A
Q
π
(
s
,
a
)
∇
θ
π
θ
(
a
|
s
)
∇
𝜃
𝐽
(
𝜃
)
	
=
∇
𝜃
∑
𝑠
∈
𝑆
𝑑
𝜋
(
𝑠
)
∑
𝑎
∈
𝐴
𝑄
𝜋
(
𝑠
,
𝑎
)
𝜋
𝜃
(
𝑎
|
𝑠
)

	
∝
∑
𝑠
∈
𝑆
𝑑
𝜋
(
𝑠
)
∑
𝑎
∈
𝐴
𝑄
𝜋
(
𝑠
,
𝑎
)
∇
𝜃
𝜋
𝜃
(
𝑎
|
𝑠
)

(
∵
d
π
(
s
)
,
Q
π
(
s
,
a
)
∵
𝑑
𝜋
(
𝑠
)
,
𝑄
𝜋
(
𝑠
,
𝑎
)
 가 
θ
𝜃
에 관한 함수가 아니기 때문이다.)

Proof of Policy Gradient Theorem

 이번 장은 Sutton 책 13.1절에 나와있는 증명을 따라가보고, 왜 policy gradient theorem이 맞는지에 대해서 규명해보고자 한다.

 먼저 state-value function의 derivative에서 시작해본다.

	
∇
θ
V
π
(
s
)
	
	
=
∇
θ
(
∑


a
∈
A
π
θ
(
a
|
s
)
Q
π
(
s
,
a
)
)
	
	
=
∑


a
∈
A
(
∇
θ
π
θ
(
a
|
s
)
Q
π
(
s
,
a
)
+
π
θ
(
a
|
s
)
∇
θ
Q
π
(
s
,
a
)
)
	
; Derivative product rule.

	
=
∑


a
∈
A
(
∇
θ
π
θ
(
a
|
s
)
Q
π
(
s
,
a
)
+
π
θ
(
a
|
s
)
∇
θ
∑


s
′
,
r
P
(
s
′
,
r
|
s
,
a
)
(
r
+
V
π
(
s
′
)
)
)
	
; Extend 
Q
π
 with future state value.

	
=
∑


a
∈
A
(
∇
θ
π
θ
(
a
|
s
)
Q
π
(
s
,
a
)
+
π
θ
(
a
|
s
)
∑


s
′
,
r
P
(
s
′
,
r
|
s
,
a
)
∇
θ
V
π
(
s
′
)
)
	
P
(
s
′
,
r
|
s
,
a
)
 or 
r
 is not a func of 
θ

	
=
∑


a
∈
A
(
∇
θ
π
θ
(
a
|
s
)
Q
π
(
s
,
a
)
+
π
θ
(
a
|
s
)
∑


s
′
P
(
s
′
|
s
,
a
)
∇
θ
V
π
(
s
′
)
)
	
; Because 
P
(
s
′
|
s
,
a
)
=
∑
r
P
(
s
′
,
r
|
s
,
a
)
	
∇
𝜃
𝑉
𝜋
(
𝑠
)

	
=
∇
𝜃
(
∑
𝑎
∈
𝐴
𝜋
𝜃
(
𝑎
|
𝑠
)
𝑄
𝜋
(
𝑠
,
𝑎
)
)

	
=
∑
𝑎
∈
𝐴
(
∇
𝜃
𝜋
𝜃
(
𝑎
|
𝑠
)
𝑄
𝜋
(
𝑠
,
𝑎
)
+
𝜋
𝜃
(
𝑎
|
𝑠
)
∇
𝜃
𝑄
𝜋
(
𝑠
,
𝑎
)
)
	
; Derivative product rule.

	
=
∑
𝑎
∈
𝐴
(
∇
𝜃
𝜋
𝜃
(
𝑎
|
𝑠
)
𝑄
𝜋
(
𝑠
,
𝑎
)
+
𝜋
𝜃
(
𝑎
|
𝑠
)
∇
𝜃
∑
𝑠
′
,
𝑟
𝑃
(
𝑠
′
,
𝑟
|
𝑠
,
𝑎
)
(
𝑟
+
𝑉
𝜋
(
𝑠
′
)
)
)
	
; Extend 
𝑄
𝜋
 with future state value.

	
=
∑
𝑎
∈
𝐴
(
∇
𝜃
𝜋
𝜃
(
𝑎
|
𝑠
)
𝑄
𝜋
(
𝑠
,
𝑎
)
+
𝜋
𝜃
(
𝑎
|
𝑠
)
∑
𝑠
′
,
𝑟
𝑃
(
𝑠
′
,
𝑟
|
𝑠
,
𝑎
)
∇
𝜃
𝑉
𝜋
(
𝑠
′
)
)
	
𝑃
(
𝑠
′
,
𝑟
|
𝑠
,
𝑎
)
 or 
𝑟
 is not a func of 
𝜃

	
=
∑
𝑎
∈
𝐴
(
∇
𝜃
𝜋
𝜃
(
𝑎
|
𝑠
)
𝑄
𝜋
(
𝑠
,
𝑎
)
+
𝜋
𝜃
(
𝑎
|
𝑠
)
∑
𝑠
′
𝑃
(
𝑠
′
|
𝑠
,
𝑎
)
∇
𝜃
𝑉
𝜋
(
𝑠
′
)
)
	
; Because 
𝑃
(
𝑠
′
|
𝑠
,
𝑎
)
=
∑
𝑟
𝑃
(
𝑠
′
,
𝑟
|
𝑠
,
𝑎
)

위의 식을 통해서 아래의 수식을 도출할 수 있다.

∇
θ
V
π
(
s
)
=
∑


a
∈
A
(
∇
θ
π
θ
(
a
|
s
)
Q
π
(
s
,
a
)
+
π
θ
(
a
|
s
)
∑


s
′
P
(
s
′
|
s
,
a
)
∇
θ
V
π
(
s
′
)
)
∇
𝜃
𝑉
𝜋
(
𝑠
)
=
∑
𝑎
∈
𝐴
(
∇
𝜃
𝜋
𝜃
(
𝑎
|
𝑠
)
𝑄
𝜋
(
𝑠
,
𝑎
)
+
𝜋
𝜃
(
𝑎
|
𝑠
)
∑
𝑠
′
𝑃
(
𝑠
′
|
𝑠
,
𝑎
)
∇
𝜃
𝑉
𝜋
(
𝑠
′
)
)

 잘 보면 알겠지만 빨간 term이 recursive하게 반복되는 것을 볼 수 있고, future state-value function 
V
π
(
s
′
)
𝑉
𝜋
(
𝑠
′
)
 이 같은 방정식을 통해서 계속 반복적으로 풀어지는 것도 확인할 수 있다. 

 그러면 이제 policy 
π
θ
𝜋
𝜃
에 따라 state 
s
𝑠
에서 시작해서, k step 후에 state 
x
𝑥
에 도달하는 transition의 probability를 
ρ
π
(
s
→
x
,
k
)
𝜌
𝜋
(
𝑠
→
𝑥
,
𝑘
)
 라고 하고, 이에 따른 전개를 살펴보자.

s
a
∼
π
θ
(
.
|
s
)
−−−−−→
s
′
a
∼
π
θ
(
.
|
s
′
)
−−−−−−→
s
′′
a
∼
π
θ
(
.
|
s
′′
)
−−−−−−→
…
𝑠
→
𝑎
∼
𝜋
𝜃
(
.
|
𝑠
)
𝑠
′
→
𝑎
∼
𝜋
𝜃
(
.
|
𝑠
′
)
𝑠
″
→
𝑎
∼
𝜋
𝜃
(
.
|
𝑠
″
)
…

k = 0 : 
ρ
π
(
s
→
s
,
k
=
0
)
=
1
𝜌
𝜋
(
𝑠
→
𝑠
,
𝑘
=
0
)
=
1
k = 1 : 해당 state에서 취할 수 있는 모든 행동을 수행한 후에, target state까지 걸리는 transition probability를 모두 더한 형태가 된다 : 
ρ
π
(
s
→
s
′
,
k
=
1
)
=
∑
a
π
θ
(
a
|
s
)
P
(
s
′
|
s
,
a
)
𝜌
𝜋
(
𝑠
→
𝑠
′
,
𝑘
=
1
)
=
∑
𝑎
𝜋
𝜃
(
𝑎
|
𝑠
)
𝑃
(
𝑠
′
|
𝑠
,
𝑎
)
이제 목표를 policy 
π
θ
𝜋
𝜃
에 따라 움직일때 state 
s
𝑠
에서 시작해서 k+1 step후에 state 
x
𝑥
에 도달하는 걸로 가정해보자. 먼저 위에 도식화한 것과 같이 k step까지는 state 
s
𝑠
에서 state 
s
′
𝑠
′
으로 이동할 수 있다. (state 
s
′
𝑠
′
는 아무 곳이나 될 수 있다. 
s
′
∈
S
𝑠
′
∈
𝑆
)
그리고 마지막 step에 state 
x
𝑥
에 도달하는 형태가 될 것이다. 이렇게 될 경우, transition probability를 recursive하게 update할 수 있게 된다. : 
ρ
π
(
s
→
x
,
k
+
1
)
=
∑
s
′
ρ
π
(
s
→
s
′
,
k
)
ρ
π
(
s
′
→
x
,
1
)
𝜌
𝜋
(
𝑠
→
𝑥
,
𝑘
+
1
)
=
∑
𝑠
′
𝜌
𝜋
(
𝑠
→
𝑠
′
,
𝑘
)
𝜌
𝜋
(
𝑠
′
→
𝑥
,
1
)

 이제 앞에서 다뤘던 recursive형태의 
∇
θ
V
π
(
s
)
∇
𝜃
𝑉
𝜋
(
𝑠
)
를 푸는 작업을 다시 해보자. 일단 식을 좀 간단히 해보기 위해 
ϕ
(
s
)
=
∑
a
∈
A
∇
θ
π
θ
(
a
|
s
)
Q
π
(
s
,
a
)
𝜙
(
𝑠
)
=
∑
𝑎
∈
𝐴
∇
𝜃
𝜋
𝜃
(
𝑎
|
𝑠
)
𝑄
𝜋
(
𝑠
,
𝑎
)
라고 축약하겠다. 
∇
θ
V
π
(
.
)
∇
𝜃
𝑉
𝜋
(
.
)
를 무한대로 계속 확장시키다보면, state 
s
𝑠
에서 시작해서 특정 step 후에 어느 state로든 transition이 가능하고, 이때의 visitation probability를 모두 더함으로써 
∇
θ
V
π
(
s
)
∇
𝜃
𝑉
𝜋
(
𝑠
)
를 쉽게 구할 수 있을 것이다.

	
∇
θ
V
π
(
s
)

	
=
ϕ
(
s
)
+
∑


a
π
θ
(
a
|
s
)
∑


s
′
P
(
s
′
|
s
,
a
)
∇
θ
V
π
(
s
′
)

	
=
ϕ
(
s
)
+
∑


s
′
∑


a
π
θ
(
a
|
s
)
P
(
s
′
|
s
,
a
)
∇
θ
V
π
(
s
′
)

	
=
ϕ
(
s
)
+
∑


s
′
ρ
π
(
s
→
s
′
,
1
)
∇
θ
V
π
(
s
′
)

	
=
ϕ
(
s
)
+
∑


s
′
ρ
π
(
s
→
s
′
,
1
)
[
ϕ
(
s
′
)
+
∑


s
′′
ρ
π
(
s
′
→
s
′′
,
1
)
∇
θ
V
π
(
s
′′
)
]

	
=
ϕ
(
s
)
+
∑


s
′
ρ
π
(
s
→
s
′
,
1
)
ϕ
(
s
′
)
+
∑


s
′′
ρ
π
(
s
→
s
′′
,
2
)
∇
θ
V
π
(
s
′′
)
 ; Consider 
s
′
 as the middle point for 
s
→
s
′′

	
=
ϕ
(
s
)
+
∑


s
′
ρ
π
(
s
→
s
′
,
1
)
ϕ
(
s
′
)
+
∑


s
′′
ρ
π
(
s
→
s
′′
,
2
)
ϕ
(
s
′′
)
+
∑


s
′′′
ρ
π
(
s
→
s
′′′
,
3
)
∇
θ
V
π
(
s
′′′
)

	
=
…
; Repeatedly unrolling the part of 
∇
θ
V
π
(
.
)

	
=
∑


x
∈
S
∞
∑


k
=
0
ρ
π
(
s
→
x
,
k
)
ϕ
(
x
)
	
∇
𝜃
𝑉
𝜋
(
𝑠
)

	
=
𝜙
(
𝑠
)
+
∑
𝑎
𝜋
𝜃
(
𝑎
|
𝑠
)
∑
𝑠
′
𝑃
(
𝑠
′
|
𝑠
,
𝑎
)
∇
𝜃
𝑉
𝜋
(
𝑠
′
)

	
=
𝜙
(
𝑠
)
+
∑
𝑠
′
∑
𝑎
𝜋
𝜃
(
𝑎
|
𝑠
)
𝑃
(
𝑠
′
|
𝑠
,
𝑎
)
∇
𝜃
𝑉
𝜋
(
𝑠
′
)

	
=
𝜙
(
𝑠
)
+
∑
𝑠
′
𝜌
𝜋
(
𝑠
→
𝑠
′
,
1
)
∇
𝜃
𝑉
𝜋
(
𝑠
′
)

	
=
𝜙
(
𝑠
)
+
∑
𝑠
′
𝜌
𝜋
(
𝑠
→
𝑠
′
,
1
)
[
𝜙
(
𝑠
′
)
+
∑
𝑠
″
𝜌
𝜋
(
𝑠
′
→
𝑠
″
,
1
)
∇
𝜃
𝑉
𝜋
(
𝑠
″
)
]

	
=
𝜙
(
𝑠
)
+
∑
𝑠
′
𝜌
𝜋
(
𝑠
→
𝑠
′
,
1
)
𝜙
(
𝑠
′
)
+
∑
𝑠
″
𝜌
𝜋
(
𝑠
→
𝑠
″
,
2
)
∇
𝜃
𝑉
𝜋
(
𝑠
″
)
 ; Consider 
𝑠
′
 as the middle point for 
𝑠
→
𝑠
″

	
=
𝜙
(
𝑠
)
+
∑
𝑠
′
𝜌
𝜋
(
𝑠
→
𝑠
′
,
1
)
𝜙
(
𝑠
′
)
+
∑
𝑠
″
𝜌
𝜋
(
𝑠
→
𝑠
″
,
2
)
𝜙
(
𝑠
″
)
+
∑
𝑠
‴
𝜌
𝜋
(
𝑠
→
𝑠
‴
,
3
)
∇
𝜃
𝑉
𝜋
(
𝑠
‴
)

	
=
…
; Repeatedly unrolling the part of 
∇
𝜃
𝑉
𝜋
(
.
)

	
=
∑
𝑥
∈
𝑆
∑
𝑘
=
0
∞
𝜌
𝜋
(
𝑠
→
𝑥
,
𝑘
)
𝜙
(
𝑥
)

 

 이를 이용해서 Q-value function에 대한 derivative 
∇
θ
Q
π
(
s
,
a
)
∇
𝜃
𝑄
𝜋
(
𝑠
,
𝑎
)
 를 없앨 수 있게 된다. 이 값을 objective function 
J
(
θ
)
𝐽
(
𝜃
)
에 넣게 되면, 다음과 같은 과정을 수행할 수 있다.

∇
θ
J
(
θ
)
	
=
∇
θ
V
π
(
s
0
)
	
; Starting from a random state 
s
0

	
=
∑


s
∞
∑


k
=
0
ρ
π
(
s
0
→
s
,
k
)
ϕ
(
s
)
	
; Let 
η
(
s
)
=
∑
∞
k
=
0
ρ
π
(
s
0
→
s
,
k
)

	
=
∑


s
η
(
s
)
ϕ
(
s
)
	
	
=
(
∑


s
η
(
s
)
)
∑


s
η
(
s
)
∑
s
η
(
s
)
ϕ
(
s
)
	
; Normalize 
η
(
s
)
,
s
∈
S
 to be a probability distribution.

	
∝
∑


s
η
(
s
)
∑
s
η
(
s
)
ϕ
(
s
)
	
∑
s
η
(
s
)
 is a constant

	
=
∑


s
d
π
(
s
)
∑


a
∇
θ
π
θ
(
a
|
s
)
Q
π
(
s
,
a
)
	
d
π
(
s
)
=
η
(
s
)
∑
s
η
(
s
)
 is stationary distribution.
∇
𝜃
𝐽
(
𝜃
)
	
=
∇
𝜃
𝑉
𝜋
(
𝑠
0
)
	
; Starting from a random state 
𝑠
0

	
=
∑
𝑠
∑
𝑘
=
0
∞
𝜌
𝜋
(
𝑠
0
→
𝑠
,
𝑘
)
𝜙
(
𝑠
)
	
; Let 
𝜂
(
𝑠
)
=
∑
𝑘
=
0
∞
𝜌
𝜋
(
𝑠
0
→
𝑠
,
𝑘
)

	
=
∑
𝑠
𝜂
(
𝑠
)
𝜙
(
𝑠
)

	
=
(
∑
𝑠
𝜂
(
𝑠
)
)
∑
𝑠
𝜂
(
𝑠
)
∑
𝑠
𝜂
(
𝑠
)
𝜙
(
𝑠
)
	
; Normalize 
𝜂
(
𝑠
)
,
𝑠
∈
𝑆
 to be a probability distribution.

	
∝
∑
𝑠
𝜂
(
𝑠
)
∑
𝑠
𝜂
(
𝑠
)
𝜙
(
𝑠
)
	
∑
𝑠
𝜂
(
𝑠
)
 is a constant

	
=
∑
𝑠
𝑑
𝜋
(
𝑠
)
∑
𝑎
∇
𝜃
𝜋
𝜃
(
𝑎
|
𝑠
)
𝑄
𝜋
(
𝑠
,
𝑎
)
	
𝑑
𝜋
(
𝑠
)
=
𝜂
(
𝑠
)
∑
𝑠
𝜂
(
𝑠
)
 is stationary distribution.

 episode로 동작하는 경우(episodic case), propotionality 상수 (
∑
s
η
(
s
)
∑
𝑠
𝜂
(
𝑠
)
)는 episode의 average length가 되고, 연속해서 동작하는 경우(continuing case, 즉 termination이 없는 경우), 해당 값은 1이 된다. (Sutton and Barto 책 13.2절 참고) 그러면 gradient는 다음과 같이 다시 정리할 수 있게 된다.

 
∇
θ
J
(
θ
)
	
∝
∑


s
∈
S
d
π
(
s
)
∑


a
∈
A
Q
π
(
s
,
a
)
∇
θ
π
θ
(
a
|
s
)
	
	
=
∑


s
∈
S
d
π
(
s
)
∑


a
∈
A
π
θ
(
a
|
s
)
Q
π
(
s
,
a
)
∇
θ
π
θ
(
a
|
s
)
π
θ
(
a
|
s
)
	
	
=
E
π
[
Q
π
(
s
,
a
)
∇
θ
ln
π
θ
(
a
|
s
)
]
	
; Because 
(
ln
x
)
′
=
1
x
∇
𝜃
𝐽
(
𝜃
)
	
∝
∑
𝑠
∈
𝑆
𝑑
𝜋
(
𝑠
)
∑
𝑎
∈
𝐴
𝑄
𝜋
(
𝑠
,
𝑎
)
∇
𝜃
𝜋
𝜃
(
𝑎
|
𝑠
)

	
=
∑
𝑠
∈
𝑆
𝑑
𝜋
(
𝑠
)
∑
𝑎
∈
𝐴
𝜋
𝜃
(
𝑎
|
𝑠
)
𝑄
𝜋
(
𝑠
,
𝑎
)
∇
𝜃
𝜋
𝜃
(
𝑎
|
𝑠
)
𝜋
𝜃
(
𝑎
|
𝑠
)

	
=
𝐸
𝜋
[
𝑄
𝜋
(
𝑠
,
𝑎
)
∇
𝜃
ln
⁡
𝜋
𝜃
(
𝑎
|
𝑠
)
]
	
; Because 
(
ln
⁡
𝑥
)
′
=
1
𝑥

 여기서 
E
π
𝐸
𝜋
 는 policy 
π
θ
𝜋
𝜃
를 따를 때, state distribution과 action distribution 상태에서의 평균값, 
E
s
∼
d
π
,
a
∼
π
θ
𝐸
𝑠
∼
𝑑
𝜋
,
𝑎
∼
𝜋
𝜃
를 말하고, 결국 이 뜻은 on policy 상태에서의 평균값을 구하는 것과 동일하게 된다.

 policy gradient theorem은 수많은 policy gradient algorithm의 이론적인 기반을 제공해준다. 가장 기초적인 vanila policy gradient update는 bias는 없지만 variance가 높다. 후속으로 나온 algorithm들은 bias를 변화시키지 않은 상태에서 variance를 줄이는데 초점을 맞췄다.

∇
θ
J
(
θ
)
=
E
π
[
Q
π
(
s
,
a
)
∇
θ
ln
π
θ
(
a
|
s
)
]
∇
𝜃
𝐽
(
𝜃
)
=
𝐸
𝜋
[
𝑄
𝜋
(
𝑠
,
𝑎
)
∇
𝜃
ln
⁡
𝜋
𝜃
(
𝑎
|
𝑠
)
]

GAE (General advantage estimation) 기법을 적용한 policy gradient method를 설명한 paper(schulmann et al, 2016)에 대한 간략한 요약과 GAE를 구성하는 몇몇 요소들에 대해 심도있게 다룬 포스트들이 있는데, 한번 읽어볼 것을 권한다.

Policy Gradient method의 일반적인 형태 (출처 : Schulman et al, 2016)

Policy Gradient Algorithms

 몇년동안 수많은 policy gradient algorithm들이 나와, 다 다룰 여건이 되지는 않지만, 읽어봐야 할 몇몇 algorithm에 대해서 소개를 해보고자 한다.

REINFORCE

  REINFORCE (Monte-Carlo policy gradient)는 episode 샘플 내에서 Monte-Carlo method를 통해 구한 estimated return을 가지고 policy parameter 
θ
𝜃
를 update해 나가는 기법이다. REINFORCE는 sample내에서의 gradient에 대한 expectation이 actual 내에서의 gradient에 대한 expectation이 같기 때문에 효과가 있다. 아래의 식을 보면 알 수 있다.

∇
θ
J
(
θ
)
	
=
E
π
[
Q
π
(
s
,
a
)
∇
θ
ln
π
θ
(
a
|
s
)
]
	
	
=
E
π
[
G
t
∇
θ
ln
π
θ
(
A
t
|
S
t
)
]
	
; Because 
Q
π
(
S
t
,
A
t
)
=
E
π
[
G
t
|
S
t
,
A
t
]
∇
𝜃
𝐽
(
𝜃
)
	
=
𝐸
𝜋
[
𝑄
𝜋
(
𝑠
,
𝑎
)
∇
𝜃
ln
⁡
𝜋
𝜃
(
𝑎
|
𝑠
)
]

	
=
𝐸
𝜋
[
𝐺
𝑡
∇
𝜃
ln
⁡
𝜋
𝜃
(
𝐴
𝑡
|
𝑆
𝑡
)
]
	
; Because 
𝑄
𝜋
(
𝑆
𝑡
,
𝐴
𝑡
)
=
𝐸
𝜋
[
𝐺
𝑡
|
𝑆
𝑡
,
𝐴
𝑡
]
 

 이를 통해서 real sample trajectory들로부터 total expected return 
G
t
𝐺
𝑡
를 구할 수 있게 되었고, 이를 이용해서 policy gradient를 update할 수 있게 되었다. 이때 전체 trajectory를 활용하게 되고, 이때문에 Monte-Carlo method라고 부르는 것이다.

 절차는 매우 직관적이다.

처음에 policy parameter 
θ
𝜃
를 랜덤하게 지정한다.
해당 policy parameter 
θ
𝜃
를 가진 policy 
π
θ
𝜋
𝜃
를 통해서 trajectory를 생성한다.
: 
S
1
,
A
1
,
R
2
,
S
2
,
A
2
,
.
.
.
,
S
T
𝑆
1
,
𝐴
1
,
𝑅
2
,
𝑆
2
,
𝐴
2
,
.
.
.
,
𝑆
𝑇
t
=
1
,
2
,
.
.
T
𝑡
=
1
,
2
,
.
.
𝑇
 에 대해서
total expected return 
G
t
𝐺
𝑡
를 estimate한다.
이를 바탕으로 policy parameter를 업데이트한다.
: 
θ
←
θ
+
α
γ
t
G
t
∇
θ
ln
π
θ
(
A
t
|
S
t
)
𝜃
←
𝜃
+
𝛼
𝛾
𝑡
𝐺
𝑡
∇
𝜃
ln
⁡
𝜋
𝜃
(
𝐴
𝑡
|
𝑆
𝑡
)

 REINFORCE가 가장 많이 쓰이는 형태는 bias를 변하지 않게 하는 상태로 gradient estimation에 대한 variance를 줄이기 위해서 total expected return 
G
t
𝐺
𝑡
에서 baseline value를 빼는 것이다. (가능하면 bias를 유지한 상태에서 variance를 낮추고 싶은 것이다.) 예를 들어, 가장 많이 쓰이는 baseline이 state-action value (
Q
(
s
,
a
)
𝑄
(
𝑠
,
𝑎
)
에서 state value를 빼는 것인데, 위의 방법을 적용하고 싶으면, gradient ascent update시 advantage function (
A
(
s
,
a
)
=
Q
(
s
,
a
)
−
V
(
s
)
𝐴
(
𝑠
,
𝑎
)
=
𝑄
(
𝑠
,
𝑎
)
−
𝑉
(
𝑠
)
)를 사용하면 되는 것이다. 다른 포스트에서 왜 이런 baseline이 variance를 줄이는데 도움이 되는지를 policy gradient에 대한 기본적인 내용에 덧붙여서 잘 설명하고 있다.

Actor-Critic

 policy gradient에서 두개의 핵심 요소는 policy model과 value function이다. policy를 학습하는데 덧붙여서 value function을 학습하는 것도 좋은 성능을 보여주는데, value function을 이해하는 것 자체가 vanila policy gradient에서 gradient varience를 줄이는 것처럼 policy를 update하는데 도움을 주기 때문이다. 이게 바로 Actor-Critic method가 추구하는 것이다.

 Actor-critic method는 두 개의 모델로 구성되어 있는데, 어떨 때는 서로의 모델이 parameter를 공유하는 경우도 있다:

Critic 모델은 algorithm내 사용되는 value function (state-action value function 
Q
w
(
a
|
s
)
𝑄
𝑤
(
𝑎
|
𝑠
)
이거나 state value function 
V
w
(
s
)
𝑉
𝑤
(
𝑠
)
를 결정할 value function parameter 
w
𝑤
를 update한다.
Actor 모델은 critic 모델이 제안한 방향대로, 현재의 policy 
π
θ
(
a
|
s
)
𝜋
𝜃
(
𝑎
|
𝑠
)
를 결정할 parameter 
θ
𝜃
를 update한다.

그러면 이제 간단한 action-value actor-critic algorithm이 어떻게 동작하는지를 살펴보겠다.

초기에 
s
,
θ
,
w
𝑠
,
𝜃
,
𝑤
를 랜덤하게 초기화하고, policy 
π
θ
(
a
|
s
)
𝜋
𝜃
(
𝑎
|
𝑠
)
에 기반해 action 
a
𝑎
를 샘플링한다. (
a
∼
π
θ
(
a
|
s
)
𝑎
∼
𝜋
𝜃
(
𝑎
|
𝑠
)
)
t
=
1
,
2
,
.
.
T
𝑡
=
1
,
2
,
.
.
𝑇
 에 대해서

reward 
r
t
∼
R
(
s
,
a
)
𝑟
𝑡
∼
𝑅
(
𝑠
,
𝑎
)
와 next state 
s
′
∼
P
(
s
′
|
s
,
a
)
𝑠
′
∼
𝑃
(
𝑠
′
|
𝑠
,
𝑎
)
를 sampling한다.
next state 
s
′
𝑠
′
를 이용해서 policy 
π
θ
(
a
′
|
s
′
)
𝜋
𝜃
(
𝑎
′
|
𝑠
′
)
로부터 next action 
a
′
𝑎
′
를 sampling한다. (
a
′
∼
π
θ
(
a
′
|
s
′
)
𝑎
′
∼
𝜋
𝜃
(
𝑎
′
|
𝑠
′
)
)
policy parameter 
θ
𝜃
를 update한다: 
θ
←
θ
+
α
θ
Q
w
(
s
,
a
)
∇
θ
ln
π
θ
(
a
|
s
)
𝜃
←
𝜃
+
𝛼
𝜃
𝑄
𝑤
(
𝑠
,
𝑎
)
∇
𝜃
ln
⁡
𝜋
𝜃
(
𝑎
|
𝑠
)
앞에서 구한 reward를 가지고, time t에서의 state-action value에 대한 correction(TD error)을 계산한다.
: 
δ
t
=
r
t
+
γ
Q
w
(
s
′
,
a
′
)
−
Q
w
(
s
,
a
)
𝛿
𝑡
=
𝑟
𝑡
+
𝛾
𝑄
𝑤
(
𝑠
′
,
𝑎
′
)
−
𝑄
𝑤
(
𝑠
,
𝑎
)

그리고 이 값을 활용해서 state-action value function의 parameter 
w
𝑤
를 update한다.
: 
w
←
w
+
α
w
δ
t
∇
w
Q
w
(
s
,
a
)
𝑤
←
𝑤
+
𝛼
𝑤
𝛿
𝑡
∇
𝑤
𝑄
𝑤
(
𝑠
,
𝑎
)
action과 state를 update한다.
: 
a
←
a
′
,
s
←
s
′
𝑎
←
𝑎
′
,
𝑠
←
𝑠
′

 여기서 두 개의 learning rate parameter 
α
θ
,
α
w
𝛼
𝜃
,
𝛼
𝑤
가 나오는데, 각각 policy parameter와 value function parameter를 update하기 위해 미리 정의된 hyperparameter이다.

Off-Policy Policy Gradient

 앞에서 소개한 REINFORCE나 vanila actor-critic method는 on-policy policy gradient method이다. 즉, 우리가 최적화해서 구하기를 원하는 target policy와 매우 유사한 policy로부터 training sample이 수집되어야 한다는 것이다. Off-policy method는 on-policy와 반대로 몇가지 이점을 가져올 수 있다.

Off-policy 방법은 full trajectory가 필요하지 않기 때문에, sample efficiency 측면에서 지난 episode에서 trajectory를 뽑아서 재사용할 수 있다. (이때 사용하는 것이 "experience replay"이다.)
Sample trajectory가 우리가 구하고자 하는 target policy와는 다른 behavior policy로부터 구할 수 있는데, 이를 통해서 exploration 측면에서 더 좋을 수 있다.

 이제 off-policy policy gradient가 어떻게 계산되는지를 살펴보고자 한다. sample을 수집하는데 사용된 behavior policy는 (마치 hyperparameter를 미리 지정하는 것과 같은) known policy인데, 이를 
β
(
a
|
s
)
𝛽
(
𝑎
|
𝑠
)
라고 해보겠다. 그러면 objective function은 behavior policy 에 의해서 정의된 state distribution에서 계산한 reward를 모두 더한 값이 되겠다.

J
(
θ
)
=
∑


s
∈
S
d
β
(
s
)
∑


a
∈
A
Q
π
(
s
,
a
)
π
θ
(
a
|
s
)
=
E
s
∼
d
β
[
∑


a
∈
A
Q
π
(
s
,
a
)
π
θ
(
a
|
s
)
]
𝐽
(
𝜃
)
=
∑
𝑠
∈
𝑆
𝑑
𝛽
(
𝑠
)
∑
𝑎
∈
𝐴
𝑄
𝜋
(
𝑠
,
𝑎
)
𝜋
𝜃
(
𝑎
|
𝑠
)
=
𝐸
𝑠
∼
𝑑
𝛽
[
∑
𝑎
∈
𝐴
𝑄
𝜋
(
𝑠
,
𝑎
)
𝜋
𝜃
(
𝑎
|
𝑠
)
]

 위 식에서 
d
β
(
s
)
𝑑
𝛽
(
𝑠
)
는 behavior policy 
β
𝛽
에 따른 stationary distribution이 된다. 여기서 
d
β
(
s
)
=
lim
t
→
∞
P
(
S
t
=
s
|
S
0
,
β
)
𝑑
𝛽
(
𝑠
)
=
lim
𝑡
→
∞
𝑃
(
𝑆
𝑡
=
𝑠
|
𝑆
0
,
𝛽
)
 이고, 
Q
π
𝑄
𝜋
는 (Behavior policy 
β
𝛽
가 아닌) target policy 
π
𝜋
 에 대해서 estimated된 state-action value function 이라는 것을 기억하자.

 Behavior Policy 
β
(
a
|
s
)
𝛽
(
𝑎
|
𝑠
)
에 의해 나온 action 
a
𝑎
를 통해 training observation을 sampling했을 때, 이에 대한 gradient를 다음과 같이 다시 써볼 수 있다.

∇
θ
J
(
θ
)
	
=
∇
θ
E
s
∼
d
β
[
∑


a
∈
A
Q
π
(
s
,
a
)
π
θ
(
a
|
s
)
]
	
	
=
E
s
∼
d
β
[
∑


a
∈
A
(
Q
π
(
s
,
a
)
∇
θ
π
θ
(
a
|
s
)
+
π
θ
(
a
|
s
)
∇
θ
Q
π
(
s
,
a
)
)
]
	
; Derivative product rule. 

	
(
i
)
≈
E
s
∼
d
β
[
∑


a
∈
A
Q
π
(
s
,
a
)
∇
θ
π
θ
(
a
|
s
)
]
	
; Ignore the red part: 
π
θ
(
a
|
s
)
∇
θ
Q
π
(
s
,
a
)

	
=
E
s
∼
d
β
[
∑


a
∈
A
β
(
a
|
s
)
π
θ
(
a
|
s
)
β
(
a
|
s
)
Q
π
(
s
,
a
)
∇
θ
π
θ
(
a
|
s
)
π
θ
(
a
|
s
)
]
	
	
=
E
β
[
π
θ
(
a
|
s
)
β
(
a
|
s
)
Q
π
(
s
,
a
)
∇
θ
ln
π
θ
(
a
|
s
)
]
	
; The blue part is the importance weight
∇
𝜃
𝐽
(
𝜃
)
	
=
∇
𝜃
𝐸
𝑠
∼
𝑑
𝛽
[
∑
𝑎
∈
𝐴
𝑄
𝜋
(
𝑠
,
𝑎
)
𝜋
𝜃
(
𝑎
|
𝑠
)
]

	
=
𝐸
𝑠
∼
𝑑
𝛽
[
∑
𝑎
∈
𝐴
(
𝑄
𝜋
(
𝑠
,
𝑎
)
∇
𝜃
𝜋
𝜃
(
𝑎
|
𝑠
)
+
𝜋
𝜃
(
𝑎
|
𝑠
)
∇
𝜃
𝑄
𝜋
(
𝑠
,
𝑎
)
)
]
	
; Derivative product rule. 

	
≈
(
𝑖
)
𝐸
𝑠
∼
𝑑
𝛽
[
∑
𝑎
∈
𝐴
𝑄
𝜋
(
𝑠
,
𝑎
)
∇
𝜃
𝜋
𝜃
(
𝑎
|
𝑠
)
]
	
; Ignore the red part: 
𝜋
𝜃
(
𝑎
|
𝑠
)
∇
𝜃
𝑄
𝜋
(
𝑠
,
𝑎
)

	
=
𝐸
𝑠
∼
𝑑
𝛽
[
∑
𝑎
∈
𝐴
𝛽
(
𝑎
|
𝑠
)
𝜋
𝜃
(
𝑎
|
𝑠
)
𝛽
(
𝑎
|
𝑠
)
𝑄
𝜋
(
𝑠
,
𝑎
)
∇
𝜃
𝜋
𝜃
(
𝑎
|
𝑠
)
𝜋
𝜃
(
𝑎
|
𝑠
)
]

	
=
𝐸
𝛽
[
𝜋
𝜃
(
𝑎
|
𝑠
)
𝛽
(
𝑎
|
𝑠
)
𝑄
𝜋
(
𝑠
,
𝑎
)
∇
𝜃
ln
⁡
𝜋
𝜃
(
𝑎
|
𝑠
)
]
	
; The blue part is the importance weight

 여기서 
π
θ
(
a
|
s
)
β
(
a
|
s
)
𝜋
𝜃
(
𝑎
|
𝑠
)
𝛽
(
𝑎
|
𝑠
)
를 importance weight라고 부른다. 
Q
π
𝑄
𝜋
가 target policy에 대한 state-action value function이기 때문이기도 하고, 또한 policy parameter 
θ
𝜃
에 대한 함수이기도 하기 때문에 product rule을 적절히 사용해서 
∇
θ
Q
π
(
s
,
a
)
∇
𝜃
𝑄
𝜋
(
𝑠
,
𝑎
)
 에 대한 derivative를 구해야 한다. 하지만 target policy를 모르는 현실 상에서 
∇
θ
Q
π
(
s
,
a
)
∇
𝜃
𝑄
𝜋
(
𝑠
,
𝑎
)
를 계산하는 것은 거의 불가능하다. 다행히도 앞의 수식 전개에서 무시했던 Q에 대한 gradient를 이용해서 approximated gradient를 사용한다면, 적어도 policy improvement가 이뤄지고, 궁극적으로 true local minimum에 도달할 수 있는 것을 보장할 수 있다. 여기(Degris, White & Sutton, 2012) 에 증명식이 나와 있다.

 요약하자면, off-policy 에 맞춰 policy gradient를 적용할 경우, 이를 weighted sum을 통해서 조정할 수 있고, 이 때의 weight는 behaivor policy와 target policy간의 비율인 importance weight 
π
θ
(
a
|
s
)
β
(
a
|
s
)
𝜋
𝜃
(
𝑎
|
𝑠
)
𝛽
(
𝑎
|
𝑠
)
 가 된다.

A3C (Asynchronous Advantage Actor-Critic)

[논문 | 코드]

 Asynchronous Advantage Actor-Critic (Mnih et al., 2016), 짧게 A3C라고 불리는 이 algorithm은 parallel training에 초점을 맞춘 classic policy gradient method이다. 

 A3C에서, Critic 모델은 여러 개의 Actor 모델이 병렬적으로 학습되면서 global parameter를 통해 시간 단위로 동기화되는 동안, value function을 학습한다. 결국, A3C는 parallel training 환경에서 잘 동작하도록 설계되었다.

우선 state value function을 예로 한번 들어보겠다. state value function에 대한 loss function은 
J
v
(
w
)
=
(
G
t
−
V
w
(
s
)
)
2
𝐽
𝑣
(
𝑤
)
=
(
𝐺
𝑡
−
𝑉
𝑤
(
𝑠
)
)
2
에 대한 mean squared error를 최소화 하려는 목적이 있고, 이때 gradient descent를 통해 optimal 
w
𝑤
를 찾을 수 있다. 이 때의 state value function은 policy gradient update시 baseline으로 활용할 수 있다.

 algorithm은 다음과 같이 동작한다.

Synchronization을 위한 global parameter 
θ
,
w
𝜃
,
𝑤
와 thread용 parameter 
θ
′
,
w
′
𝜃
′
,
𝑤
′
를 선언하고 초기화한다.
t
=
1
𝑡
=
1
로 time step을 초기화 한다.
T
≤
T
M
A
X
𝑇
≤
𝑇
𝑀
𝐴
𝑋
인 동안
gradient를 초기화한다
: 
d
θ
=
0
,
d
w
=
0
𝑑
𝜃
=
0
,
𝑑
𝑤
=
0
thread 전용 parameter를 global parameter와 synchronize시킨다.
: 
θ
′
=
θ
,
w
′
=
w
𝜃
′
=
𝜃
,
𝑤
′
=
𝑤
t
s
t
a
r
t
=
t
𝑡
𝑠
𝑡
𝑎
𝑟
𝑡
=
𝑡
로 설정하고 starting state 
s
t
𝑠
𝑡
를 sampling한다.
(
s
t
!
=
T
E
R
M
I
N
A
L
𝑠
𝑡
!
=
𝑇
𝐸
𝑅
𝑀
𝐼
𝑁
𝐴
𝐿
)이고, 
t
−
t
s
t
a
r
t
≤
t
m
a
x
𝑡
−
𝑡
𝑠
𝑡
𝑎
𝑟
𝑡
≤
𝑡
𝑚
𝑎
𝑥
인 동안:
policy 
π
θ
′
(
a
t
|
s
t
)
𝜋
𝜃
′
(
𝑎
𝑡
|
𝑠
𝑡
)
로부터 action 
a
t
𝑎
𝑡
를 수행하고,
a
t
∼
π
θ
′
(
a
t
|
s
t
)
𝑎
𝑡
∼
𝜋
𝜃
′
(
𝑎
𝑡
|
𝑠
𝑡
)
), 이에 대한 새로운 reward 
R
t
𝑅
𝑡
와 새로운 state 
s
t
+
1
𝑠
𝑡
+
1
를 얻어온다.
time을 update한다.
: 
t
=
t
+
1
,
T
=
T
+
1
𝑡
=
𝑡
+
1
,
𝑇
=
𝑇
+
1
estimated return을 담을 변수를 초기화하고, 조건에 맞게 정의한다.

R
=
{
0
	
if
s
t
 is TERMINAL


V
w
′
(
s
t
)
	
otherwise
𝑅
=
{
0
	
if
𝑠
𝑡
 is TERMINAL


𝑉
𝑤
′
(
𝑠
𝑡
)
	
otherwise
i
=
t
−
1
,
.
.
.
t
s
t
a
r
t
𝑖
=
𝑡
−
1
,
.
.
.
𝑡
𝑠
𝑡
𝑎
𝑟
𝑡
 까지
R
←
r
i
+
γ
R
𝑅
←
𝑟
𝑖
+
𝛾
𝑅
thread 전용 parameter 
θ
′
𝜃
′
에 대해서 gradient를 accumulate한다.
: 
d
θ
←
d
θ
+
∇
θ
′
log
π
θ
′
(
a
i
|
s
i
)
(
R
−
V
w
′
(
s
i
)
)
𝑑
𝜃
←
𝑑
𝜃
+
∇
𝜃
′
log
⁡
𝜋
𝜃
′
(
𝑎
𝑖
|
𝑠
𝑖
)
(
𝑅
−
𝑉
𝑤
′
(
𝑠
𝑖
)
)

thread 전용 parameter 
w
′
𝑤
′
에 대해서 gradient를 accumulate한다.
: 
d
w
←
d
w
+
2
(
R
−
V
w
′
(
s
i
)
)
∇
w
′
(
R
−
V
w
′
(
s
i
)
)
𝑑
𝑤
←
𝑑
𝑤
+
2
(
𝑅
−
𝑉
𝑤
′
(
𝑠
𝑖
)
)
∇
𝑤
′
(
𝑅
−
𝑉
𝑤
′
(
𝑠
𝑖
)
)
θ
,
w
𝜃
,
𝑤
 를 
d
θ
,
d
w
𝑑
𝜃
,
𝑑
𝑤
를 이용해서 asynchronous하게 update해준다

 A3C 자체가 여러 agent를 학습시키는데 있어 parallelism이 가능하게끔 해줬는데, 그 중에서도 특히 위의 algorithm 전개 중 6.2 부분이 loss를 줄이는데 사용되는 minibatch-based stochastic gradient descent를 parallel하게 동작하도록 수정된 부분이다. 해당 부분이 바로 학습 thread가 각기 얻은 결과를 통해 
w
,
θ
𝑤
,
𝜃
를 수정해가는 것이다.

A2C (Advantage Actor Critic)

[논문 | 코드]

 A2C 는 앞에서 소개한 A3C의 Synchoronous, Deterministic version이다. 그래서 A3C 중 앞의 "A" (Asynchronous)가 진 이유이기도 하다. A3C에서 각 agent는 각각 독립적으로 global parameter에 자신의 state에 대해 전달했었기 때문에, 때때로는 thread별로 동작하는 agent에 다른 version의 policy가 수행되면서, update된 policy의 결과가 optimal하지 않을 가능성이 존재했었다. 이런 문제를 해결하기 위해서 A2C에서는 coordinator가 있어서 global parameter를 update하기전에 각 agent에서 동작하는 학습이 끝날때까지 기다리고, 다음 iteration에 모든 agent가 같은 policy를 가지고 병렬적으로 수행할 수 있도록 해준다. 이렇게 동기화된 gradient update는 학습을 조금더 확실하게 해주고, 잠재적으로는 convergence를 빠르게 할 수 있도록 해준다. 

 OpenAI의 글에서 언급되다시피 A2C는 A3C에 비해서 GPU를 효율적으로 사용하고, 큰 batch size를 가지고 학습하는 경우에도 A3C와 같거나 더 나은 성능을 보여준다.

A3C와 A2C 구조 비교

DPG (Deterministic Policy Gradient)

[논문 | 코드]

 위에서 소개한 방법에서, policy function 
π
(
⋅
|
s
)
𝜋
(
⋅
|
𝑠
)
 는 주어진 state 
s
𝑠
상에서 action 
A
𝐴
에 대한 probability distribution을 모델링한 것이기 때문에, stochastic하다. 반대로 Deterministic Policy Gradient (DPG)는 policy를 deterministic decision을 하는 것(
a
=
μ
(
s
)
𝑎
=
𝜇
(
𝑠
)
)으로 모델링한다. policy가 single action을 내뱉을때, 이에 대한 policy function의 gradient를 계산한다는 것 자체가 이상하게 들릴 수 있다. 한번 하나하나씩 살펴보고자 한다.

 글의 전개를 위해서 앞에서 다뤘던 몇가지 표현을 다시 언급해본다.

ρ
0
(
s
)
𝜌
0
(
𝑠
)
 :  state에 대한 initial distribution
ρ
μ
(
s
→
s
′
,
k
)
𝜌
𝜇
(
𝑠
→
𝑠
′
,
𝑘
)
 : state 
s
𝑠
에서 시작했을때, policy 
π
𝜋
에 따라서 k step 후 state 
s
′
𝑠
′
에 도달하기까지의 visitation probability density
ρ
μ
(
s
′
)
𝜌
𝜇
(
𝑠
′
)
 : Discounted state distribution. 다음과 같이 정의된다.

ρ
μ
(
s
′
)
=
∫
s
∑
∞
k
=
1
γ
k
−
1
ρ
0
(
s
)
ρ
μ
(
s
→
s
′
,
k
)
d
s
𝜌
𝜇
(
𝑠
′
)
=
∫
𝑠
∑
𝑘
=
1
∞
𝛾
𝑘
−
1
𝜌
0
(
𝑠
)
𝜌
𝜇
(
𝑠
→
𝑠
′
,
𝑘
)
𝑑
𝑠

여기서 우리가 최적화해야 할 objective function은 다음과 같다.

J
(
θ
)
=
∫
s
ρ
μ
(
s
)
Q
(
s
,
μ
θ
(
s
)
)
d
s
𝐽
(
𝜃
)
=
∫
𝑠
𝜌
𝜇
(
𝑠
)
𝑄
(
𝑠
,
𝜇
𝜃
(
𝑠
)
)
𝑑
𝑠

 Deterministic Policy Gradient Theorem : 이제 gradient를 계산해볼 차례이다. chain rule에 따르면, 우선 action 
a
𝑎
에 대해 Q의 gradient를 구하고, policy parameter 
θ
𝜃
에 대해 deterministic policy function 
μ
𝜇
의 gradient를 구할 것이다.

∇
θ
J
(
θ
)
	
=
∫
s
ρ
μ
(
s
)
∇
a
Q
μ
(
s
,
a
)
∇
θ
μ
θ
(
s
)
|
a
=
μ
θ
(
s
)

	
=
E
s
∼
ρ
μ
[
∇
a
Q
μ
(
s
,
a
)
∇
θ
μ
θ
(
s
)
|
a
=
μ
θ
(
s
)
]
d
s
∇
𝜃
𝐽
(
𝜃
)
	
=
∫
𝑠
𝜌
𝜇
(
𝑠
)
∇
𝑎
𝑄
𝜇
(
𝑠
,
𝑎
)
∇
𝜃
𝜇
𝜃
(
𝑠
)
|
𝑎
=
𝜇
𝜃
(
𝑠
)

	
=
𝐸
𝑠
∼
𝜌
𝜇
[
∇
𝑎
𝑄
𝜇
(
𝑠
,
𝑎
)
∇
𝜃
𝜇
𝜃
(
𝑠
)
|
𝑎
=
𝜇
𝜃
(
𝑠
)
]
𝑑
𝑠

 여기서 deterministic policy를 stochastic policy의 특별한 경우라고 생각해볼 수 있는데, 가령 한 action에 대한 probability distribution이 0이 아닌 유일한 값만 가지는 경우가 그렇다. 사실 DPG 논문에서, 저자는 만약 현재의 stochastic policy 
π
μ
θ
,
σ
𝜋
𝜇
𝜃
,
𝜎
가 deterministic policy 
μ
θ
𝜇
𝜃
와 variation variable 
σ
𝜎
에 의해서 re-parameterized 되는 경우, stochastic policy는 
σ
=
0
𝜎
=
0
 일때 결과적으로 deterministic policy와 동일하다는 것을 보여줬다. deterministic policy와 비교했을 때, stochastic policy가 전체 state와 action space에 대해서 데이터를 완성해야 한다는 측면에서 더 많은 샘플이 필요할 거라 기대한다.

  Deterministic policy gradient theorem은 일반적인 policy gradient framework에 적용해볼 수 있다.

  이제 과정을 증명하기 위해서 on-policy actor-critic algorithm의 예를 살펴보자, on-policy actor-critic 이 매번 수행될때마다, 
a
=
μ
θ
(
s
)
𝑎
=
𝜇
𝜃
(
𝑠
)
에 의해서 두개의 action이 deterministic하게 선택되며, SARSA algorithm은 아래에서 계산될 새로운 gradient에 따라서 on-policy parameter를 update한다.

δ
t
	
=
R
t
+
γ
Q
w
(
s
t
+
1
,
a
t
+
1
)
−
Q
w
(
s
t
,
a
t
)
	
TD error in SARSA


w
t
+
1
	
=
w
t
+
α
w
δ
t
∇
w
Q
w
(
s
t
,
a
t
)
	

θ
t
+
1
	
=
θ
t
+
α
θ
∇
a
Q
w
(
s
t
,
a
t
)
∇
θ
μ
θ
(
s
)
|
a
=
μ
θ
(
s
)
	
 Deterministic policy gradient theorem 
𝛿
𝑡
	
=
𝑅
𝑡
+
𝛾
𝑄
𝑤
(
𝑠
𝑡
+
1
,
𝑎
𝑡
+
1
)
−
𝑄
𝑤
(
𝑠
𝑡
,
𝑎
𝑡
)
	
TD error in SARSA


𝑤
𝑡
+
1
	
=
𝑤
𝑡
+
𝛼
𝑤
𝛿
𝑡
∇
𝑤
𝑄
𝑤
(
𝑠
𝑡
,
𝑎
𝑡
)


𝜃
𝑡
+
1
	
=
𝜃
𝑡
+
𝛼
𝜃
∇
𝑎
𝑄
𝑤
(
𝑠
𝑡
,
𝑎
𝑡
)
∇
𝜃
𝜇
𝜃
(
𝑠
)
|
𝑎
=
𝜇
𝜃
(
𝑠
)
	
 Deterministic policy gradient theorem 

 하지만 environment내에 sufficient noise가 있지 않는한, policy의 determinacy로 인해서, 충분한 exploration이 이뤄지는 것을 보장하기가 매우 어렵다. 그래서 policy에 noise를 더하거나,(역설적이게도 이렇게 noise를 더하면 policy가 nondeterministic하게 된다..) 아니면 샘플을 모아서 다른 stochastic behaior policy를 수행하게 함으로써 off-policy처럼 학습하게 하는 방법을 취할 수 있다.

 off-policy approach라는 건 training trajectory가 stochastic policy 
β
(
a
|
s
)
𝛽
(
𝑎
|
𝑠
)
에 의해서 생성되고, 이로 인해 state distribution이 discounted state density 
ρ
β
𝜌
𝛽
 를 따르게 되는 것이다.

J
β
(
θ
)
	
=
∫
s
ρ
β
Q
μ
(
s
,
μ
θ
(
s
)
)
d
s


∇
θ
J
β
(
θ
)
	
=
E
s
∼
ρ
β
[
∇
a
Q
μ
(
s
,
a
)
∇
θ
μ
θ
(
s
)
|
a
=
μ
θ
(
s
)
]
𝐽
𝛽
(
𝜃
)
	
=
∫
𝑠
𝜌
𝛽
𝑄
𝜇
(
𝑠
,
𝜇
𝜃
(
𝑠
)
)
𝑑
𝑠


∇
𝜃
𝐽
𝛽
(
𝜃
)
	
=
𝐸
𝑠
∼
𝜌
𝛽
[
∇
𝑎
𝑄
𝜇
(
𝑠
,
𝑎
)
∇
𝜃
𝜇
𝜃
(
𝑠
)
|
𝑎
=
𝜇
𝜃
(
𝑠
)
]

 여기서 policy가 deterministic하기 때문에, 주어진 state 
s
𝑠
에 대한 estimated reward를 구할 때, 
∑
a
π
(
a
|
s
)
Q
π
(
s
,
a
)
∑
𝑎
𝜋
(
𝑎
|
𝑠
)
𝑄
𝜋
(
𝑠
,
𝑎
)
를 구할 필요 없이, 
Q
μ
(
s
,
μ
θ
(
s
)
)
𝑄
𝜇
(
𝑠
,
𝜇
𝜃
(
𝑠
)
)
 만 알면 된다. 이렇게 stochastic policy에 대해서 off-policy 기법을 적용할 때, behavior와 target policy간의 오차를 보정해주기 위해서 importance sampling을 사용하곤 하는데, 이 부분에 대해서는 위(off-policy policy gradient)에서 설명했다. 하지만 deterministic policy gradient가 action에 대한 integral을 제거해주기 때문에, importance sampling 사용을 피할 수 있다.

DDPG (Deep Deterministic Policy Gradient)

[ 논문 | 코드 ]

 Deep Deterministic Policy Gradient를 줄인, DDPG(Lillicrap et al, 2015)는 DPG에 DQN을 결합시킨 model-free off-policy actor-critic algorithm이다. DQN (Deep Q-Network)에 대해서 다시 다뤄보자면, experience replay과 frozen target network를 통해서 Q-function에 대한 학습을 안정화시킨 효과를 나타낸다. 원래의 DQN은 discrete space상에서 동작하지만, DDPG는 actor-critic framework를 활용하여 deterministic policy를 학습하면서, 효과를 continuous space까지로 확장시켰다.

 좀 더 나은 exploration을 하기 위해서, exploration policy 
μ
′
𝜇
′
는 noise 
N
𝑁
을 추가함으로써 만들 수 있다.

μ
′
(
s
)
=
μ
θ
(
s
)
+
N
𝜇
′
(
𝑠
)
=
𝜇
𝜃
(
𝑠
)
+
𝑁

 추가로 DDPG는 ("conservation policy iteration"이라 부르는) soft update를 actor network 과 critic network의 parameter에 각각 적용한다. ( 
τ
≪
1
𝜏
≪
1
, 
θ
′
→
τ
θ
+
(
1
−
τ
)
θ
′
𝜃
′
→
𝜏
𝜃
+
(
1
−
𝜏
)
𝜃
′
 ) 이 방법을 사용하면, target network이 천천히 변화가 강제로 발생하는데, 이 부분은 DQN에서 target network를 특정 period 동안 frozen 시키는 것과 다른 부분이다.

 논문에서 유념히 볼 부분 중 하나는 robotics에서 활용되는 부분인데, low dimensional features에 대한 서로 다른 physical unit을 normalize 시키는 부분이다. 예를 들어 특정 모델이 policy를 학습하는데 있어 robot의 position과 velocity를 입력으로 받게끔 설계되어 있다. 이런 물리적 특정은 자연적으로 각기 다를 것이고, 같은 type 자체도 수많은 로봇내에서 그 특성이 다르기 때문에 학습이 어려울 것이다. 이때 Batch normalization을 사용해서, 샘플들을 하나의 minibatch에 넣고 모든 dimension에 대해서 normalize 시킴으로써 해결할 수 있다.

DDPG Algorithm (출처 : Lillicrap et al, 2015)

D4PG (Distributed Distributional DDPG)

[ 논문 | 코드 ]

Distributed Distributional DDPG (D4PG) 는 DDPG에 distributional 개념이 반영되도록 몇가지 개선점이 적용되었다.

 (1) Distributional Critic : Critic network는 expected Q value를 하나의 random variable 로 estimate하는데, 이 random variable은 
w
𝑤
에 의해서 parameterize되는 distribution 
Z
w
𝑍
𝑤
를 가진다. 이를 통해서 Q value 
Q
w
(
s
,
a
)
=
E
[
Z
w
(
x
,
a
)
]
𝑄
𝑤
(
𝑠
,
𝑎
)
=
𝐸
[
𝑍
𝑤
(
𝑥
,
𝑎
)
]
 를 가지게 된다. 이 때 distributional parameter를 학습하는데 있어 초점을 맞출 loss는 두 개의 distributions 사이의 거리를 수치화시킨 어떤 값을 최소화하는 것이 될텐데, 논문에서는 이를 distributional TD error라고 표현하고 있다. 

L
(
w
)
=
E
[
d
(
T
μ
θ
,
Z
w
′
(
s
,
a
)
,
Z
w
(
s
,
a
)
]
𝐿
(
𝑤
)
=
𝐸
[
𝑑
(
𝑇
𝜇
𝜃
,
𝑍
𝑤
′
(
𝑠
,
𝑎
)
,
𝑍
𝑤
(
𝑠
,
𝑎
)
]

 (위 식에서 
d
(
)
𝑑
(
)
 함수는 distance를 구하는 함수이고 
T
μ
θ
𝑇
𝜇
𝜃
는 Bellman operator이다.)

이를 이용해서 DPG에서 도출된 policy gradient update는 다음과 같이 바꿀 수 있다.

∇
θ
J
(
θ
)
	
≈
E
ρ
μ
[
∇
a
Q
w
(
s
,
a
)
∇
θ
μ
θ
(
s
)
|
a
=
μ
θ
(
s
)
]
	
; gradient update in DPG

	
=
E
ρ
μ
[
E
[
∇
a
Z
w
(
s
,
a
)
]
∇
θ
μ
θ
(
s
)
|
a
=
μ
θ
(
s
)
]
	
; expectation of the Q-value distribution
∇
𝜃
𝐽
(
𝜃
)
	
≈
𝐸
𝜌
𝜇
[
∇
𝑎
𝑄
𝑤
(
𝑠
,
𝑎
)
∇
𝜃
𝜇
𝜃
(
𝑠
)
|
𝑎
=
𝜇
𝜃
(
𝑠
)
]
	
; gradient update in DPG

	
=
𝐸
𝜌
𝜇
[
𝐸
[
∇
𝑎
𝑍
𝑤
(
𝑠
,
𝑎
)
]
∇
𝜃
𝜇
𝜃
(
𝑠
)
|
𝑎
=
𝜇
𝜃
(
𝑠
)
]
	
; expectation of the Q-value distribution

 (2) 
N
𝑁
-step returns : TD-error를 계산할 때, future step에 얻어질 reward를 반영하기 위해서 one-step이 아닌, 
N
𝑁
-step TD target error를 구한다. 그래서 이에 따른 새로운 TD-target은 다음과 같이 정의된다:

r
(
s
0
,
a
0
)
+
E
[
N
−
1
∑


n
=
1
r
(
s
n
,
a
n
)
+
γ
N
Q
(
s
N
,
μ
θ
(
s
N
)
)
|
s
0
,
a
0
]
𝑟
(
𝑠
0
,
𝑎
0
)
+
𝐸
[
∑
𝑛
=
1
𝑁
−
1
𝑟
(
𝑠
𝑛
,
𝑎
𝑛
)
+
𝛾
𝑁
𝑄
(
𝑠
𝑁
,
𝜇
𝜃
(
𝑠
𝑁
)
)
|
𝑠
0
,
𝑎
0
]

 (3) Multiple Distributed Parallel Actors : D4PG 는 
K
𝐾
개의 Actor를 운용하면서, Parallel하게 experience를 수집하고, 같은 replay buffer에다가 data를 집어넣는다.

 (4) Prioritized Experienced Replay (PER) : 마지막 수정된 부분은 size 
R
𝑅
의 replay buffer에서 non-uniform probability 
p
i
𝑝
𝑖
 만큼 sampling을 수행하는 것이다. 이 방법을 통해서 sample 
i
𝑖
는 
(
R
p
i
)
−
1
(
𝑅
𝑝
𝑖
)
−
1
 의 확률로 선택되게 되고, 이로 인해 importance weight는 
(
R
p
i
)
−
1
(
𝑅
𝑝
𝑖
)
−
1
을 가지게 된다.

D4PG Algorithm (Barth-Maron et al, 2018) 참고로 논문에서는 deterministic policy를 
π
𝜋
로 표시했지만, 위의 글에서는 
μ
𝜇
로 표현했다.

MADDPG (Multi-Agent Deep Deterministic Policy Gradient)

[ 논문 | 코드 ]

 Multi-Agent DDPG (MADDPG) (Lowe et al, 2017)는 여러 개의 agent가 local information만 가지고, task를 처리할 수 있도록 서로 협력하는 환경으로 DDPG를 확장시킨 algorithm이다. agent 한개의 관점에서 볼때, environment는 non-stationary하고, 이때 다른 agent의 policy들은 빠르게 update되는데, 그 agent 입장에서는 unknown 상태로 남아있는 것이다. MADDPG는 이렇게 environment가 변하고, agent들간의 interaction을 처리할 수 있도록 actor-critic 모델이 재설계된 형태를 나타낸다. 

 여기서 RL 문제는 Markov games라고 알려져 있는, MDP의 Multi-agent 형태로 정형화시킬 수 있다. 다시 말해서, 총 
N
𝑁
개의 agent가 있고, State의 집합 
S
𝑆
가 있다고 가정해보자. 각 agent는 수행 가능한 action set 
A
1
,
.
.
.
,
A
N
𝐴
1
,
.
.
.
,
𝐴
𝑁
이 있고, 관찰 가능한 observation set 
O
1
,
.
.
.
,
O
N
𝑂
1
,
.
.
.
,
𝑂
𝑁
이 있다. 이때의 state-transtion function은 앞에서 언급한 모든 State, action, observation space와 연관되어 있다. 
T
:
S
×
A
1
×
…
A
N
↦
S
𝑇
:
𝑆
×
𝐴
1
×
…
𝐴
𝑁
↦
𝑆
 각 agent의 stochastic policy는 각 agent가 가진 state, action하고만 연관되어 있다: 
π
θ
i
:
O
i
×
A
i
↦
[
0
,
1
]
𝜋
𝜃
𝑖
:
𝑂
𝑖
×
𝐴
𝑖
↦
[
0
,
1
]
, 그리고 보통 deterministic policy라고 하는, 주어진 observation에 대한 action의 probability distribution은 다음과 같이 표현할 수 있다: 
μ
θ
i
:
O
i
↦
A
i
𝜇
𝜃
𝑖
:
𝑂
𝑖
↦
𝐴
𝑖
 

 여기서 observation과 deterministic policy를 하나의 vector 형태로 보고( 
→
o
=
o
1
,
…
,
o
N
,
→
μ
=
μ
1
,
…
,
μ
N
𝑜
→
=
𝑜
1
,
…
,
𝑜
𝑁
,
𝜇
→
=
𝜇
1
,
…
,
𝜇
𝑁
 ), policy 역시 vector 형태의 
→
θ
=
θ
1
,
…
,
θ
N
𝜃
→
=
𝜃
1
,
…
,
𝜃
𝑁
에 의해 결정된다고 가정해보자. 이때 MADDPG의 
i
𝑖
번째 agent의  critic network는 centralized action-value function 
Q
→
μ
i
(
→
o
,
a
1
,
…
,
a
N
)
𝑄
𝑖
𝜇
→
(
𝑜
→
,
𝑎
1
,
…
,
𝑎
𝑁
)
 를 학습하게 되는데, 여기서 
a
1
∈
A
1
,
…
,
a
N
∈
A
N
𝑎
1
∈
𝐴
1
,
…
,
𝑎
𝑁
∈
𝐴
𝑁
는 모든 agent의 action을 말한다. 각 
Q
→
μ
i
𝑄
𝑖
𝜇
→
 
i
=
1
,
…
,
N
𝑖
=
1
,
…
,
𝑁
으로 나누어져서 학습이 되는데, 이로 인해서 multiple agent는 서로 경쟁하는 형태의 conflicting reward를 포함하여, 하나의 reward 구조를 가지게 된다. 반면, 여러개의 actor network은 각 agent 별로 스스로 탐색하고, policy parameter 
θ
i
𝜃
𝑖
를 update하게 된다.

 Actor Network update:

∇
θ
i
J
(
θ
i
)
=
E
→
o
,
a
∼
D
[
∇
a
i
Q
→
μ
i
(
→
o
,
a
1
,
…
,
a
N
)
∇
θ
i
μ
θ
i
(
o
i
)
|
a
i
=
μ
θ
i
(
o
i
)
]
∇
𝜃
𝑖
𝐽
(
𝜃
𝑖
)
=
𝐸
𝑜
→
,
𝑎
∼
𝐷
[
∇
𝑎
𝑖
𝑄
𝑖
𝜇
→
(
𝑜
→
,
𝑎
1
,
…
,
𝑎
𝑁
)
∇
𝜃
𝑖
𝜇
𝜃
𝑖
(
𝑜
𝑖
)
|
𝑎
𝑖
=
𝜇
𝜃
𝑖
(
𝑜
𝑖
)
]

 위의 수식에서 
D
𝐷
가 replay memory의 size라고 할 때, 해당 memory에 담겨있는 여러개의 episode sample은 
(
→
o
,
a
1
,
…
,
a
N
,
r
1
,
…
,
r
N
,
→
o
′
)
(
𝑜
→
,
𝑎
1
,
…
,
𝑎
𝑁
,
𝑟
1
,
…
,
𝑟
𝑁
,
𝑜
→
′
)
 이 될텐데, 이 표현의 의미는 주어진 현재의 observation 
→
o
𝑜
→
이 있을 때, agent가 
a
1
,
…
,
a
N
𝑎
1
,
…
,
𝑎
𝑁
에 해당하는 action을 수행하고 이에 따른 reward로 
r
1
,
…
,
r
N
𝑟
1
,
…
,
𝑟
𝑁
을 받게 되며, 이로 인해서 새로운 observation 
→
o
′
𝑜
→
′
에 도달한다는 것이다.

 Critic Network update:

L
(
θ
i
)
	
=
E
→
o
,
a
1
,
…
,
a
N
,
r
1
,
…
,
r
N
,
→
o
′
[
Q
→
μ
i
(
→
o
,
a
1
,
…
,
a
N
)
−
y
)
2
]
	

where 
y
	
=
r
i
+
γ
Q
→
μ
′
i
(
→
o
′
,
a
′
1
,
…
,
a
′
N
)
|
a
′
j
=
μ
′
θ
j
	
; TD target!
𝐿
(
𝜃
𝑖
)
	
=
𝐸
𝑜
→
,
𝑎
1
,
…
,
𝑎
𝑁
,
𝑟
1
,
…
,
𝑟
𝑁
,
𝑜
→
′
[
𝑄
𝑖
𝜇
→
(
𝑜
→
,
𝑎
1
,
…
,
𝑎
𝑁
)
−
𝑦
)
2
]


where 
𝑦
	
=
𝑟
𝑖
+
𝛾
𝑄
𝑖
𝜇
→
′
(
𝑜
→
′
,
𝑎
1
′
,
…
,
𝑎
𝑁
′
)
|
𝑎
𝑗
′
=
𝜇
𝜃
𝑗
′
	
; TD target!

 위의 식에서 
→
μ
′
𝜇
→
′
은 delayed softly-updated parameter를 가진 target policy이다.

 만약 target policy 
→
μ
′
𝜇
→
′
가 critic network을 update하는 동안에 unknown 상태로 존재한다면, 각 agent로 하여금 이를 학습하고, 서로가 가지고 있는 policy에다가 어느정도의 approximation을 가해서 발전시킨다. MADDPG는 이렇게 각 agent별로 근사화된 policy들을 활용해서, output으로 도출한 policy가 그렇게 정확하지 않더라도 효율적으로 학습을 시킬 수 있게 된다. 

 물론 주어진 environment내에서 agent끼리 서로 경쟁하거나 협력을 하면서 high variance가 발생할 수 있는데, 이를 완화하기 위해서 MADDPG는 policy ensembles이라고 하는 요소를 하나 더 제안했다. 이 policy ensemble이 하는 역할은 다음과 같다.

한 개의 agent에 대해서 K개의 policy를 학습시킨다.
episode rollout시 random하게 policy를 선택한다.
policy들에 대한 gradient update를 수행하기 위해서 위의 K개의 policy에 대한 ensemble을 취한다.

 간단하게 요약하자면, MADDPG는 multi-agent environment에서도 DDPG를 활용하기 위해서 DDPG에 다음 3개의 요소를 추가한 것이다.

Centralized critic + decentralized actors의 형태
Actor들은 policy learning을 위해서 다른 agent들이 가지고 있는 approximated policy를 활용할 수 있다.
Variance를 줄이기 위해서 Policy ensemble을 가미했다.

MADDPG의 구조 (Lowe et al, 2017)

TRPO (Trust Region Policy Optimization)

[ 논문 | 코드 ]

 training stability를 향상시키기 위해서, 한 step내에서 policy를 변화시킬 수 있는 parameter update는 피해야 한다. Trust Region Policy Optimization (TRPO) (Schulman et al, 2015) 는 매 iteration 마다 policy를 update할 수 있는 size에 KL Divergence 제한을 가해서, parameter update를 피할 수 있게 했다.

 만약 수행하는 policy가 off-policy라면, episode rollout이 behavior policy 
β
(
a
|
s
)
𝛽
(
𝑎
|
𝑠
)
 를 따르는 동안의 objective function은 아래 식과 같이 주어진 모든 state visitation dstribution과 action에 대한 advantage를 계산하게 될 것이다.

J
(
θ
)
	
=
∑


s
∈
S
ρ
π
θ
old
∑


a
∈
A
(
π
θ
(
a
|
s
)
^
A
θ
old
(
s
,
a
)
)
	
	
=
∑


s
∈
S
ρ
π
θ
old
∑


a
∈
A
(
β
(
a
|
s
)
π
θ
(
a
|
s
)
β
(
a
|
s
)
^
A
θ
old
(
s
,
a
)
)
	
; Applying Importance Sampling

	
=
E
s
∼
ρ
π
θ
old
,
α
∼
β
[
π
θ
(
a
|
s
)
β
(
a
|
s
)
^
A
θ
old
(
s
,
a
)
]
	
𝐽
(
𝜃
)
	
=
∑
𝑠
∈
𝑆
𝜌
𝜋
𝜃
old
∑
𝑎
∈
𝐴
(
𝜋
𝜃
(
𝑎
|
𝑠
)
𝐴
^
𝜃
old
(
𝑠
,
𝑎
)
)

	
=
∑
𝑠
∈
𝑆
𝜌
𝜋
𝜃
old
∑
𝑎
∈
𝐴
(
𝛽
(
𝑎
|
𝑠
)
𝜋
𝜃
(
𝑎
|
𝑠
)
𝛽
(
𝑎
|
𝑠
)
𝐴
^
𝜃
old
(
𝑠
,
𝑎
)
)
	
; Applying Importance Sampling

	
=
𝐸
𝑠
∼
𝜌
𝜋
𝜃
old
,
𝛼
∼
𝛽
[
𝜋
𝜃
(
𝑎
|
𝑠
)
𝛽
(
𝑎
|
𝑠
)
𝐴
^
𝜃
old
(
𝑠
,
𝑎
)
]

 위 식에서 
θ
old
𝜃
old
는 update 이전의 policy parameter이기 때문에, 우리가 알고 있는 값이고, 
ρ
π
θ
old
𝜌
𝜋
𝜃
old
 는 DPG에서 구한 방식과 동일하게 정의할 수 있다. 그리고 
β
(
a
|
s
)
𝛽
(
𝑎
|
𝑠
)
는 수집된 trajectory에 대한 behavior policy이다. 여기서 우리는 보통 true reward에 대한 정보가 없기 때문에 true advantage function 
A
(
⋅
)
𝐴
(
⋅
)
가 아닌 estimated advantage function 
^
A
(
⋅
)
𝐴
^
(
⋅
)
를 쓰게 된다.

 위와 다르게 on-policy의 상황이라면, 이 때의 behavior policy 
β
(
a
|
s
)
𝛽
(
𝑎
|
𝑠
)
 는 
π
θ
old
(
a
|
s
)
𝜋
𝜃
old
(
𝑎
|
𝑠
)
가 되고, 이 때의 objective function은 다음과 같이 된다.

J
(
θ
)
=
E
s
∼
ρ
π
θ
old
,
a
∼
π
θ
old
[
π
θ
(
a
|
s
)
π
θ
old
(
a
|
s
)
^
A
θ
old
(
s
,
a
)
]
𝐽
(
𝜃
)
=
𝐸
𝑠
∼
𝜌
𝜋
𝜃
old
,
𝑎
∼
𝜋
𝜃
old
[
𝜋
𝜃
(
𝑎
|
𝑠
)
𝜋
𝜃
old
(
𝑎
|
𝑠
)
𝐴
^
𝜃
old
(
𝑠
,
𝑎
)
]

TRPO는 objective function 
J
(
θ
)
𝐽
(
𝜃
)
를 최대화하는데 있어 trust region constraint를 사용했는데, 이건 KL-divergence에 의해서 측정되는 old policy와 new policy간의 간격을 작게 만들어주는 역할을 하고 보통 
δ
𝛿
로 표현된다.

E
s
∼
ρ
π
θ
old
[
D
K
L
(
π
θ
old
(
⋅
|
s
)
|
|
π
θ
(
⋅
|
s
)
]
≤
δ
𝐸
𝑠
∼
𝜌
𝜋
𝜃
old
[
𝐷
𝐾
𝐿
(
𝜋
𝜃
old
(
⋅
|
𝑠
)
|
|
𝜋
𝜃
(
⋅
|
𝑠
)
]
≤
𝛿

 이 방법을 통해서, 이런 hard constraint가 충족되는 동안 old policy와 new policy가 그렇게 많이 diverge하지 않게 된다. 그러는 동안, TRPO는 policy iteration을 통해서 지속적인 성능 향상을 보여줄 수 있게 된다. 관심이 있으면 논문의 증명 부분을 읽어보면 좋을거 같다.

PPO ( Proximal Policy Optimization )

[ 논문 | 코드 ]

 TRPO가 상대적으로 복잡하긴 하지만, 여전히 Trust Region Constraint와 유사한 constraint를 사용하고자 한다면, proximal policy optimization (PPO) (Schulman et al, 2017)는 clipped surrogate objective를 사용해서 TRPO와 유사한 성능을 내면서 이를 간단하게 만들 수 있다.

 우선 old policy와 new policy 간의 probability ratio를 다음과 같이 정의하겠다.

r
(
θ
)
=
π
θ
(
a
|
s
)
π
θ
old
(
a
|
s
)
𝑟
(
𝜃
)
=
𝜋
𝜃
(
𝑎
|
𝑠
)
𝜋
𝜃
old
(
𝑎
|
𝑠
)

 그러면 (on-policy) TRPO의 objective function은 다음과 같이 된다.

J
TRPO
(
θ
)
=
E
[
r
(
θ
)
^
A
θ
old
(
s
,
a
)
]
𝐽
TRPO
(
𝜃
)
=
𝐸
[
𝑟
(
𝜃
)
𝐴
^
𝜃
old
(
𝑠
,
𝑎
)
]

 
θ
old
𝜃
old
와 
θ
𝜃
 간의 거리에 대한 제한이 없다면, 
J
TRPO
(
θ
)
𝐽
TRPO
(
𝜃
)
를 maximize하는 작업 자체는 parameter update를 극도로 크게 만들수도 있고, policy ratio도 크게 만들만큼 안정성이 없게 된다. PPO에서는 
r
(
θ
)
𝑟
(
𝜃
)
가  1 이내의 작은 interval (정확하게는 
[
1
−
ϵ
,
1
+
ϵ
]
[
1
−
𝜖
,
1
+
𝜖
]
 )내에 유지될 수 있게끔 constraint를 걸었는데, 여기서 
ϵ
𝜖
은 hyperparameter가 된다. (여기서 clip의 개념이 들어간다.)

J
CLIP
(
θ
)
=
E
[
min
(
r
(
θ
)
^
A
θ
old
(
s
,
a
)
,
clip
(
r
(
θ
)
,
1
−
ϵ
,
1
+
ϵ
)
^
A
θ
old
(
s
,
a
)
)
]
𝐽
CLIP
(
𝜃
)
=
𝐸
[
min
(
𝑟
(
𝜃
)
𝐴
^
𝜃
old
(
𝑠
,
𝑎
)
,
clip
(
𝑟
(
𝜃
)
,
1
−
𝜖
,
1
+
𝜖
)
𝐴
^
𝜃
old
(
𝑠
,
𝑎
)
)
]

 그래서 위의 식과 같이 Clip function이 적용된 objective function은 위와 같은데, 여기서 
clip
(
r
(
θ
)
,
1
−
ϵ
,
1
+
ϵ
)
clip
(
𝑟
(
𝜃
)
,
1
−
𝜖
,
1
+
𝜖
)
은 
[
1
−
ϵ
,
1
+
ϵ
]
[
1
−
𝜖
,
1
+
𝜖
]
 내에서 ratio을 다듬는(clip) 역할을 한다. 그래서 PPO의 objective function은 원래의 값과 clip된 값들 중 작은 값을 취하는 형태로 되어 있는데, 이를 통해서 좀더 나은 reward를 얻기 위해서 극도로 policy를 update하는 등의 동작은 없어지게 된다.

 policy fuction (actor)와 value function (critic)간에 parameter를 공유하는 형태의 network에다가 PPO를 적용하는 경우, 앞에서 소개한 clipped reward를 쓰는 것에 덧붙여서, objective function에다가 value estimation에 대한 error term (아래 식 중 빨간 부분) 와 entropy term (아래 식 중 파란 부분)을 덧붙여서 사용하는데, 이를 통해 exploration을 충분히 수행할 수 있도록 해준다.

J
CLIP
′
(
θ
)
=
E
[
J
CLIP
(
θ
)
−
c
1
(
V
θ
(
s
)
−
V
target
)
2
+
c
2
H
(
s
,
π
θ
(
⋅
)
)
]
𝐽
CLIP
′
(
𝜃
)
=
𝐸
[
𝐽
CLIP
(
𝜃
)
−
𝑐
1
(
𝑉
𝜃
(
𝑠
)
−
𝑉
target
)
2
+
𝑐
2
𝐻
(
𝑠
,
𝜋
𝜃
(
⋅
)
)
]

 여기서도 역시 
c
1
,
c
2
𝑐
1
,
𝑐
2
는 hypterparameter constant이다.

 PPO는 여러 benchmark task에서도 훨씬 더 간단하면서도, 놀라운 결과를 보여줬다.

ACER ( Actor-Critic with Experience Replay )

[ 논문 | 코드 ]

 ACER는 Actor-Critic with Experience Replay (Wang et al, 2017) 를 줄인 말로, experience replay를 가진 off-policy actor-critic 모델이며, sample efficiency를 많이 향상시키고, data correlation을 줄였다. A3C가 ACER의 기반이긴 하지만, on-policy 였고, ACER가 A3C의 off-policy 모델이라고 보면 될거 같다. A3C를 off-policy 형태로 만드는데 있어 가장 큰 걸림돌은 off-policy estimator에 대한 stability를 어떻게 제어할 수 있느냐였다. ACER는 이를 극복하기 위해서 3가지 개선 사항을 적용했다.

Retrace Q-value estimation 적용
bias correction을 통해서 importance weight를 생략함
efficient TRPO 적용

Retrace Q-Value Estimation

 Retrace 는 off-policy return 기반의 Q-value estimation 알고리즘으로, 어떤 target policy 와 behavior policy ( 
π
,
β
𝜋
,
𝛽
 ) 에 대해서도 convergence를 보장하고, 추가로 data efficiency까지 가져왔다.

 잠시 prediction을 위한 TD learning이 어떻게 동작하는지를 살펴보자.

TD error 를 계산한다. ( 
δ
t
=
R
t
+
γ
E
a
∼
π
Q
(
S
t
+
1
,
a
)
−
Q
(
S
t
,
A
t
)
𝛿
𝑡
=
𝑅
𝑡
+
𝛾
𝐸
𝑎
∼
𝜋
𝑄
(
𝑆
𝑡
+
1
,
𝑎
)
−
𝑄
(
𝑆
𝑡
,
𝐴
𝑡
)
)
여기서 
r
t
+
γ
E
a
∼
π
Q
(
s
t
+
1
,
a
)
𝑟
𝑡
+
𝛾
𝐸
𝑎
∼
𝜋
𝑄
(
𝑠
𝑡
+
1
,
𝑎
)
는 "TD target"으로 알려져 있는 부분이다. 그리고 expectation 
E
a
∼
π
𝐸
𝑎
∼
𝜋
 를 취하는 이유는 현재의 policy 
π
𝜋
를 취할 때, total return이 어떻게 될지에 대한 가장 좋은 estimation이기 때문이다.


goal에 도달하기 위해서 error를 수정하면서 Q-value를 update함 ( 
Q
(
S
t
,
A
t
)
←
Q
(
S
t
,
A
t
)
+
α
δ
t
𝑄
(
𝑆
𝑡
,
𝐴
𝑡
)
←
𝑄
(
𝑆
𝑡
,
𝐴
𝑡
)
+
𝛼
𝛿
𝑡
 )
다르게 표현하면 Q-value에 대한 증가폭은 TD error에 비례하다는 것이다. ( 
Δ
Q
(
S
t
,
A
t
)
=
α
δ
t
Δ
𝑄
(
𝑆
𝑡
,
𝐴
𝑡
)
=
𝛼
𝛿
𝑡
 )

 rollout이 off-policy일 경우, Q-value update할때 importance sampling을 적용해야 한다.

Δ
Q
imp
(
S
t
,
A
t
)
=
γ
t
∏


1
≤
τ
≤
t
π
(
A
τ
|
S
τ
)
β
(
A
τ
|
S
τ
)
δ
t
Δ
𝑄
imp
(
𝑆
𝑡
,
𝐴
𝑡
)
=
𝛾
𝑡
∏
1
≤
𝜏
≤
𝑡
𝜋
(
𝐴
𝜏
|
𝑆
𝜏
)
𝛽
(
𝐴
𝜏
|
𝑆
𝜏
)
𝛿
𝑡

 importance weight로 product를 취하는 것은 어쩌면 이로 인해 엄청 큰 variance를 야기할 수도 있기 때문에 고민이 되는 부분이다. Retrace Q-value estimation은 importance weight가 상수 c 이상보다 커질 수 없도록 
Δ
Q
Δ
𝑄
를 수정하는 방법을 취했다.

Δ
Q
ret
(
S
t
,
A
t
)
=
γ
t
∏


1
≤
τ
≤
t
min
(
c
,
π
(
A
τ
|
S
τ
)
β
(
A
τ
|
S
τ
)
)
δ
t
Δ
𝑄
ret
(
𝑆
𝑡
,
𝐴
𝑡
)
=
𝛾
𝑡
∏
1
≤
𝜏
≤
𝑡
min
(
𝑐
,
𝜋
(
𝐴
𝜏
|
𝑆
𝜏
)
𝛽
(
𝐴
𝜏
|
𝑆
𝜏
)
)
𝛿
𝑡

 ACER에서는 L2 Error term( 
(
Q
ret
(
s
,
a
)
−
Q
(
s
,
a
)
)
2
(
𝑄
ret
(
𝑠
,
𝑎
)
−
𝑄
(
𝑠
,
𝑎
)
)
2
 ) 을 최소화함으로써 critic network을 학습시킬 때, 모델이 지향해야 할 target model을 계산하기 위해 
Q
ret
𝑄
ret
 을 사용했다.

Importance weights truncation

 policy gradient 
^
g
𝑔
^
의 high variance 현상을 줄이기 위해서, ACER에서는 importance weight를 상수 c로 제한을 걸고, 여기에 덧붙여 correction term을 추가했다. 아래의 식에 나오는 
^
g
ACER
t
𝑔
^
𝑡
ACER
 가 바로 
t
𝑡
시점에서의 ACER policy gradient를 나타낸다.

^
g
ACER
t
	
=
w
t
(
Q
ret
(
S
t
,
A
t
)
−
V
θ
v
(
S
t
)
)
∇
θ
ln
π
θ
(
A
t
|
S
t
)
	
; Let 
w
t
=
π
(
A
t
|
S
t
)
β
(
A
t
|
S
t
)
)

	
=
min
(
c
,
w
t
)
(
Q
ret
(
S
t
,
A
t
)
−
V
w
(
S
t
)
)
∇
θ
ln
π
θ
(
A
t
|
S
t
)
	
	
+
E
a
∼
π
[
max
(
0
,
w
t
(
a
)
−
c
w
t
(
a
)
)
(
Q
w
(
S
t
,
a
)
−
V
w
(
S
t
)
)
∇
θ
ln
π
θ
(
a
|
S
t
)
]
	
; Let 
w
t
(
a
)
=
π
(
a
|
S
t
)
β
(
a
|
S
t
)
𝑔
^
𝑡
ACER
	
=
𝑤
𝑡
(
𝑄
ret
(
𝑆
𝑡
,
𝐴
𝑡
)
−
𝑉
𝜃
𝑣
(
𝑆
𝑡
)
)
∇
𝜃
ln
⁡
𝜋
𝜃
(
𝐴
𝑡
|
𝑆
𝑡
)
	
; Let 
𝑤
𝑡
=
𝜋
(
𝐴
𝑡
|
𝑆
𝑡
)
𝛽
(
𝐴
𝑡
|
𝑆
𝑡
)
)

	
=
min
(
𝑐
,
𝑤
𝑡
)
(
𝑄
ret
(
𝑆
𝑡
,
𝐴
𝑡
)
−
𝑉
𝑤
(
𝑆
𝑡
)
)
∇
𝜃
ln
⁡
𝜋
𝜃
(
𝐴
𝑡
|
𝑆
𝑡
)

	
+
𝐸
𝑎
∼
𝜋
[
max
(
0
,
𝑤
𝑡
(
𝑎
)
−
𝑐
𝑤
𝑡
(
𝑎
)
)
(
𝑄
𝑤
(
𝑆
𝑡
,
𝑎
)
−
𝑉
𝑤
(
𝑆
𝑡
)
)
∇
𝜃
ln
⁡
𝜋
𝜃
(
𝑎
|
𝑆
𝑡
)
]
	
; Let 
𝑤
𝑡
(
𝑎
)
=
𝜋
(
𝑎
|
𝑆
𝑡
)
𝛽
(
𝑎
|
𝑆
𝑡
)

 여기서 
Q
w
(
⋅
)
𝑄
𝑤
(
⋅
)
과 
V
w
(
⋅
)
𝑉
𝑤
(
⋅
)
은 parameter 
w
𝑤
에 따라서 critic network가 predict 하는 value function이 되고, 식 첫째줄의 
V
θ
v
(
S
t
)
𝑉
𝜃
𝑣
(
𝑆
𝑡
)
은 variance를 줄이기 위해서 설정한 classic baseline이다. 우선 두번째 식의 첫번째 항(파란 부분)은 clipped importance weight인데, 이렇게 clipping 기법을 적용하면 variance를 낮추는데 도움이 된다. 여기다가 baseline인 state-value function 
V
w
(
⋅
)
𝑉
𝑤
(
⋅
)
를 빼서 variance reduction 효과를 더 높일 수 있게 된다. 두번째 항(빨간 부분)은 앞에서 소개했다시피 unbiased estimation을 얻기 위해서 correction term을 삽입한 것이다.

Efficient TRPO

 추가적으로, ACER는 TRPO의 개념에다 연산을 효율적으로 처리하기 위해서 수정을 약간 가했다. TRPO에서는 한 update 시점을 기준으로 이전의 policy와 이후의 policy 사이의 KL divergence를 계산했었는데, ACER는 이전의 policy에 대한 average를 유지하고, update되는 policy가 이 average에서 그렇게 멀어지지 않게끔 제한을 두었다.

 ACER 논문은 수많은 공식들로 꽉차있는 논문이기 때문에 TD-learning이나 Q-learning, importance sampling, TRPO에 대한 지식을 가지고 본다면 조금더 쉽게 이해할 수 있을 것이다.

ACKTR (Actor-Critic using Kronecker-factored Trust Region)

[ 논문 | 코드 ]

 ACKTR (Actor-Critic using Kronecker-factored Trust Region) (Yuhuai et al, 2017) (actor의 발음과 유사) 는 Actor-critic 모델에서 각 network가 gradient update를 할 때 Kronecker-factored approximation curvature (K-FAC)를 쓰는 것을 제안했다. K-FAC은 natural gradient를 연산하는데 있어 큰 개선점을 가져왔는데, 여기서 natural gradient는 우리가 알고 있는 standard gradient와는 조금 다른 개념이다. 여기에 natural gradient에 대해서 설명을 잘해놓은 곳이 있는데, 요약을 다음과 같이 하고 있었다.

"우선 old network에 대해서 new network의 KL Divergence의 constant 값을 얻을 수 있는 모든 parameter의 조합을 고려했다. 이 constant 값은 step size나 learning rate 관점으로도 바라볼 수 있는데, 이런 parameter 조합들중에서 loss function을 최소화할 수 있는 것을 선택하는 것이 natural gradient의 의미이다."

  우선 여기에선 ACTKR를 소개했지만, 여기에는 natural gradient과 optimization method에 대한 수많은 이론적 개념이 관련되어 있기 때문에, 자세히 다루지는 않을 것이다. 혹시 이 개념에 관심이 있다면, ACKTR 논문을 읽기 전에 아래 글들을 읽어볼 것을 권한다.

Amari, Natural Gradient Works Efficiently in Learning, 1998
Kakade, A Natural Policy Gradient, 2002
A intuitive explanation of natural gradient descent
(Wikipedia) Kronecker product
Martens & Grosse, Optimizing neural networks with kronecker-factored approximate curvature, 2015

 여기 K-FAC 논문에 대한 요약을 나열했다.

 "여기에 나온 Approximation은 크게 두가지 과정으로 나누어져 있다. 첫번째로 Fisher information의 row와 column을 그룹별로 나누는데, 각 그룹은 주어진 layer에 대한 모든 weights를 나타내게끔 되고, 이 값들이 결국 matrix에 대한 block-partitioning을 야기하게 된다. 그러면 해당 group내의 block들은 훨씬 작은 행렬들 사이의 Kronecker product로 approximate시킬 수 있게 된다. 여기서 우리가 확인하고 싶은 부분은 해당 network의 gradient에 대한 statistics와 관련하여 assumption을 추정할 수 있는 무언가가 있느냐는 것이다.
 두번째 단계에서는 이 행렬을 block-diagonal하거나 block-tridiagonal 한 inverse matrix로 approximate하는 것이다. 여기서 도출되는 approximation은 inverse covariance와 tree-structured graphic model, 그리고 linear regression 사이의 관계를 잘 살펴봄으로써 증명할 수 있다. 확실한 것은 이런 증명은 Fisher information 자체에 적용하는 것이 아니라는 것인데, 실험을 통해서 inverse fisher information이 이런 구조를 (approximate하게) 가지고는 있지만, Fisher information 자체는 그런 구조를 가지지 않는다는 것을 확인할 수 있었다."
SAC (Soft Actor-Critic)

[ 논문 | 코드 ]

Soft Actor-Critic (SAC) (Haarnoja et al, 2018) 는 exploration을 조금더 잘하게 하기 위해서 reward에다가 policy에 대한 entropy measure를 추가한 기법이다. 이를 통해서 가능한한 랜덤하게 행동하면서, task를 잘 수행할 수 있게끔 policy를 학습하길 바라는 것이다. 이 기법은 off-policy actor-critic model에 maximum entropy reinforcement learning framework를 가미한 것이다. 이전에는 Soft Q-learning 이란 이름으로 연구가 진행되었었다.

 SAC를 구성하는 3가지 요소는 다음과 같다.

policy function network와 value function network을 따로 분리해서 가지고 있는 actor-critic 구조
이전에 수집한 data를 재사용할 수 있는 형태의 off-policy formulation
Stability와 exploration을 만족시키기 위한 Entropy maxmization

 Policy는 동시에 entropy와 expected return을 최대화하기 위한 objective function을 통해서 학습된다.

J
(
θ
)
=
T
∑


t
=
1
E
(
s
t
,
a
t
)
∼
ρ
π
θ
[
r
(
s
t
,
a
t
)
+
α
H
(
π
θ
(
⋅
|
s
t
)
)
]
𝐽
(
𝜃
)
=
∑
𝑡
=
1
𝑇
𝐸
(
𝑠
𝑡
,
𝑎
𝑡
)
∼
𝜌
𝜋
𝜃
[
𝑟
(
𝑠
𝑡
,
𝑎
𝑡
)
+
𝛼
𝐻
(
𝜋
𝜃
(
⋅
|
𝑠
𝑡
)
)
]

 위 식에서 
H
(
⋅
)
𝐻
(
⋅
)
이 entropy measure이고, 
α
𝛼
는 entropy term의 중요성을 결정하는 변수로 보통은 temperature parameter로 알려져 있다. 여기서 Entropy maximization을 통해 policy가 (1) 조금더 탐색하고 (2) near-optimal strategy들의 여러가지 형태를 담을 수 있게끔 해준다. (예를 들어 똑같이 좋아보이는 option들이 여러개 존재한다면, policy는 동일한 확률로 해당 option을 선택할 수 있어야 한다는 것이다.)

 결국 SAC는 세가지 함수를 학습하는데 초점을 맞추고 있다.

Parameter 
θ
𝜃
에 대한 policy, 
π
θ
𝜋
𝜃
Parameter 
w
𝑤
에 의해 결정되는 Soft Q-value function, 
Q
w
𝑄
𝑤
Parameter 
ψ
𝜓
에 의해 결정되는 Soft state-value function, 
V
ψ
𝑉
𝜓

: 이론적으로는 
Q
𝑄
와 
π
𝜋
를 통해서 
V
𝑉
를 추론할 수 있지만, 실제 상황에서는 이렇게 하면 training에 안정성을 더할 수 있다.

 Soft Q-value (아니면 state-action value) 와 soft state value는 다음과 같이 정의할 수 있다

Q
(
s
t
,
a
t
)
	
=
r
(
s
t
,
a
t
)
+
γ
E
s
t
+
1
∼
ρ
π
(
s
)
[
V
(
s
t
+
1
)
]
	
; according to Bellman equation


where 
V
(
s
t
)
	
=
E
a
t
∼
π
[
Q
(
s
t
,
a
t
)
−
α
log
π
(
a
t
|
s
t
)
]
	
; soft state value function
𝑄
(
𝑠
𝑡
,
𝑎
𝑡
)
	
=
𝑟
(
𝑠
𝑡
,
𝑎
𝑡
)
+
𝛾
𝐸
𝑠
𝑡
+
1
∼
𝜌
𝜋
(
𝑠
)
[
𝑉
(
𝑠
𝑡
+
1
)
]
	
; according to Bellman equation


where 
𝑉
(
𝑠
𝑡
)
	
=
𝐸
𝑎
𝑡
∼
𝜋
[
𝑄
(
𝑠
𝑡
,
𝑎
𝑡
)
−
𝛼
log
⁡
𝜋
(
𝑎
𝑡
|
𝑠
𝑡
)
]
	
; soft state value function

여기서 Q-value내의 
V
(
s
t
+
1
)
𝑉
(
𝑠
𝑡
+
1
)
을 state value function으로 치환시키면 아래 식과 같이 유도할 수 있다.

Q
(
s
t
,
a
t
)
=
r
(
s
t
,
a
t
)
+
γ
E
(
s
t
+
1
,
a
t
+
1
)
∼
ρ
π
[
Q
(
s
t
+
1
,
a
t
+
1
)
−
α
log
π
(
a
t
+
1
|
s
t
+
1
)
]
𝑄
(
𝑠
𝑡
,
𝑎
𝑡
)
=
𝑟
(
𝑠
𝑡
,
𝑎
𝑡
)
+
𝛾
𝐸
(
𝑠
𝑡
+
1
,
𝑎
𝑡
+
1
)
∼
𝜌
𝜋
[
𝑄
(
𝑠
𝑡
+
1
,
𝑎
𝑡
+
1
)
−
𝛼
log
⁡
𝜋
(
𝑎
𝑡
+
1
|
𝑠
𝑡
+
1
)
]

 여기서 
ρ
π
(
s
)
𝜌
𝜋
(
𝑠
)
와 
ρ
π
(
s
,
a
)
𝜌
𝜋
(
𝑠
,
𝑎
)
는 policy 
π
(
a
|
s
)
𝜋
(
𝑎
|
𝑠
)
에 의해서 도출되는 state distribution의 state marginal과 state-action marginal 인데, 이 부분은 DPG에서도 비슷한 방식으로 유도했었다.

 soft state value function은 mean squared error를 최소화하는 방향으로 학습된다.

J
V
(
ψ
)
	
=
E
s
t
∼
D
[
1
2
(
V
ψ
(
s
t
)
−
E
[
Q
w
(
s
t
,
a
t
)
−
log
π
θ
(
a
t
|
s
t
)
]
)
2
]


with gradient: 
∇
ψ
J
V
(
ψ
)
	
=
∇
ψ
V
ψ
(
s
t
)
(
V
ψ
(
s
t
)
−
Q
w
(
s
t
,
a
t
)
+
log
π
θ
(
a
t
|
s
t
)
)
𝐽
𝑉
(
𝜓
)
	
=
𝐸
𝑠
𝑡
∼
𝐷
[
1
2
(
𝑉
𝜓
(
𝑠
𝑡
)
−
𝐸
[
𝑄
𝑤
(
𝑠
𝑡
,
𝑎
𝑡
)
−
log
⁡
𝜋
𝜃
(
𝑎
𝑡
|
𝑠
𝑡
)
]
)
2
]


with gradient: 
∇
𝜓
𝐽
𝑉
(
𝜓
)
	
=
∇
𝜓
𝑉
𝜓
(
𝑠
𝑡
)
(
𝑉
𝜓
(
𝑠
𝑡
)
−
𝑄
𝑤
(
𝑠
𝑡
,
𝑎
𝑡
)
+
log
⁡
𝜋
𝜃
(
𝑎
𝑡
|
𝑠
𝑡
)
)

 위의 식에서 
D
𝐷
은 replay buffer를 말한다.

 soft Q function은 soft Bellman residual을 최소화하는 방향으로 학습된다.

J
Q
(
w
)
	
=
E
(
s
t
,
a
t
)
∼
D
[
1
2
(
Q
w
(
s
t
,
a
t
)
−
(
r
(
s
t
,
a
t
)
+
γ
E
s
t
+
1
∼
ρ
π
(
s
)
[
V
¯
ψ
(
s
t
+
1
)
]
)
2
]


with gradient: 
∇
w
J
Q
(
w
)
	
=
∇
w
Q
w
(
s
t
,
a
t
)
(
Q
w
(
s
t
,
a
t
)
−
r
(
s
t
,
a
t
)
−
γ
V
¯
ψ
(
s
t
+
1
)
)
𝐽
𝑄
(
𝑤
)
	
=
𝐸
(
𝑠
𝑡
,
𝑎
𝑡
)
∼
𝐷
[
1
2
(
𝑄
𝑤
(
𝑠
𝑡
,
𝑎
𝑡
)
−
(
𝑟
(
𝑠
𝑡
,
𝑎
𝑡
)
+
𝛾
𝐸
𝑠
𝑡
+
1
∼
𝜌
𝜋
(
𝑠
)
[
𝑉
𝜓
¯
(
𝑠
𝑡
+
1
)
]
)
2
]


with gradient: 
∇
𝑤
𝐽
𝑄
(
𝑤
)
	
=
∇
𝑤
𝑄
𝑤
(
𝑠
𝑡
,
𝑎
𝑡
)
(
𝑄
𝑤
(
𝑠
𝑡
,
𝑎
𝑡
)
−
𝑟
(
𝑠
𝑡
,
𝑎
𝑡
)
−
𝛾
𝑉
𝜓
¯
(
𝑠
𝑡
+
1
)
)

 잘 보일지는 모르겠지만 
¯
ψ
𝜓
¯
는 exponential moving average를 가지는 (혹은 "어려운 방법으로" 주기적으로만 update되는 ) target value function을 말하는데, 마치 DQN에서 training을 안정화시키기 위해서 target Q network의 parameter를 다루는 방법과 동일하다.

 SAC는 KL-divergence를 최소화하는 방향으로 policy를 update한다.

π
new
	
=
arg
min


π
′
∈
Π
D
KL
(
π
′
(
.
|
s
t
)
∥
exp
(
Q
π
old
(
s
t
,
.
)
)
Z
π
old
(
s
t
)
)

	
=
arg
min


π
′
∈
Π
D
KL
(
π
′
(
.
|
s
t
)
∥
exp
(
Q
π
old
(
s
t
,
.
)
−
log
Z
π
old
(
s
t
)
)
)


objective for update: 
J
π
(
θ
)
	
=
∇
θ
D
KL
(
π
θ
(
.
|
s
t
)
∥
exp
(
Q
w
(
s
t
,
.
)
−
log
Z
w
(
s
t
)
)
)

	
=
E
a
t
∼
π
[
−
log
(
exp
(
Q
w
(
s
t
,
a
t
)
−
log
Z
w
(
s
t
)
)
π
θ
(
a
t
|
s
t
)
)
]

	
=
E
a
t
∼
π
[
log
π
θ
(
a
t
|
s
t
)
−
Q
w
(
s
t
,
a
t
)
+
log
Z
w
(
s
t
)
]
𝜋
new
	
=
arg
⁡
min
𝜋
′
∈
Π
𝐷
KL
(
𝜋
′
(
.
|
𝑠
𝑡
)
‖
exp
⁡
(
𝑄
𝜋
old
(
𝑠
𝑡
,
.
)
)
𝑍
𝜋
old
(
𝑠
𝑡
)
)

	
=
arg
⁡
min
𝜋
′
∈
Π
𝐷
KL
(
𝜋
′
(
.
|
𝑠
𝑡
)
‖
exp
⁡
(
𝑄
𝜋
old
(
𝑠
𝑡
,
.
)
−
log
⁡
𝑍
𝜋
old
(
𝑠
𝑡
)
)
)


objective for update: 
𝐽
𝜋
(
𝜃
)
	
=
∇
𝜃
𝐷
KL
(
𝜋
𝜃
(
.
|
𝑠
𝑡
)
‖
exp
⁡
(
𝑄
𝑤
(
𝑠
𝑡
,
.
)
−
log
⁡
𝑍
𝑤
(
𝑠
𝑡
)
)
)

	
=
𝐸
𝑎
𝑡
∼
𝜋
[
−
log
⁡
(
exp
⁡
(
𝑄
𝑤
(
𝑠
𝑡
,
𝑎
𝑡
)
−
log
⁡
𝑍
𝑤
(
𝑠
𝑡
)
)
𝜋
𝜃
(
𝑎
𝑡
|
𝑠
𝑡
)
)
]

	
=
𝐸
𝑎
𝑡
∼
𝜋
[
log
⁡
𝜋
𝜃
(
𝑎
𝑡
|
𝑠
𝑡
)
−
𝑄
𝑤
(
𝑠
𝑡
,
𝑎
𝑡
)
+
log
⁡
𝑍
𝑤
(
𝑠
𝑡
)
]

위의 식에서 policy 
Π
Π
는 현재의 policy를 가지고 쉽게 바꿀수 있는 잠재적인 policy들의 집합이다. 예를 들어 
Π
Π
는 modeling하기는 어렵지만, 직관적이고, 쉽게 다룰 수 있는 Gaussian mixture distribution의 집합일 수도 있다. 
Z
π
old
(
s
t
)
𝑍
𝜋
old
(
𝑠
𝑡
)
는 distribution을 normalize시키는 partition function이다. 이건 쉽게 다룰수 있는건 아니지만 그렇다고 gradient에 영향을 미치는 것은 아니다. 결국 objective function인 
J
π
(
θ
)
𝐽
𝜋
(
𝜃
)
를 최소화하는 것은 policy들의 집합인 
Π
Π
를 어떻게 선택하냐에 달린 것이다.

 이렇게 update를 하면서 
Q
π
new
(
s
t
,
a
t
)
≥
Q
π
old
(
s
t
,
a
t
)
𝑄
𝜋
new
(
𝑠
𝑡
,
𝑎
𝑡
)
≥
𝑄
𝜋
old
(
𝑠
𝑡
,
𝑎
𝑡
)
의 관계는 항상 만족시키는데, 이 부분에 대한 증명은 논문의 Appendix B.2의 lemma를 살펴보면 확인할 수 있다.

 한번 이렇게 soft action-state value, soft state value network, policy network에 대해서 objective function 과 gradient가 정의되면, soft actor-critic algorithm은 직관적으로 표현할 수 있게 된다.

Soft Actor-Critic algorithm (Haarnoja et al, 2018)

SAC with Automatically Adjusted Temperature

[ 논문 | 코드 ]

  SAC algorithm은 temperature parameter와 관련해서는 불안한 성향을 띈다. 사실 entropy 자체가 더 좋은 policy를 찾는 목적을 가진 상태에서 task를 수행하거나 학습하는 순간 모두 매우 예측이 어렵기 때문에, temperature를 조절하는 것 자체가 어렵긴 하다. 그래서 SAC에서 개선점을 찾은 것은 제한된(constrained) optimization problem을 사용하자는 것이다. 다시 말하자면, expected return을 최적화하면서, policy가 아래의 minimum entropy constraint를 만족시키게끔 하자는 것이다.

max


π
0
,
…
,
π
T
E
[
T
∑


t
=
0
r
(
s
t
,
a
t
)
]
s.t. 
∀
t
, 
H
(
π
t
)
≥
H
0
max
𝜋
0
,
…
,
𝜋
𝑇
𝐸
[
∑
𝑡
=
0
𝑇
𝑟
(
𝑠
𝑡
,
𝑎
𝑡
)
]
s.t. 
∀
𝑡
, 
𝐻
(
𝜋
𝑡
)
≥
𝐻
0

 위 식에서 
H
0
𝐻
0
은 미리 정의한 minimum policy entropy threshold 이다.

 Expected return 
E
[
∑
T
t
=
0
r
(
s
t
,
a
t
)
]
𝐸
[
∑
𝑡
=
0
𝑇
𝑟
(
𝑠
𝑡
,
𝑎
𝑡
)
]
 은 모든 time step 에 대한 reward들의 합으로 나눠서 볼 수 있다. 사실 policy 
π
t
𝜋
𝑡
는 이전 time step의 policy 
π
t
−
1
𝜋
𝑡
−
1
에는 전혀 영향을 주지 않기 때문에, 정해진 time step 
T
𝑇
에 대해서 서로 다른 step size로 나누어서 return maximize할 수 있게 된다. (어떻게 보면 이건 Dynamic Programming이기도 하다.)

일단 
γ
=
1
𝛾
=
1
이라고 가정하면 위의 문제는 아래와 같이 재정의를 할 수 있다.

max


π
0
(
E
[
r
(
s
0
,
a
0
)
]
+
max


π
1
(
E
[
.
.
.
]
+
max


π
T
E
[
r
(
s
T
,
a
T
)
]




1st maximization
)




second but last maximization
)




last maximization
max
𝜋
0
(
𝐸
[
𝑟
(
𝑠
0
,
𝑎
0
)
]
+
max
𝜋
1
(
𝐸
[
.
.
.
]
+
max
𝜋
𝑇
𝐸
[
𝑟
(
𝑠
𝑇
,
𝑎
𝑇
)
]
⏟
1st maximization
)
⏟
second but last maximization
)
⏟
last maximization

 그러면 가장 마지막 time step 
T
𝑇
에서부터 optimization을 수행할 수 있다.

maximize 
E
(
s
T
,
a
T
)
∼
ρ
π
[
r
(
s
T
,
a
T
)
]
 s.t. 
H
(
π
T
)
−
H
0
≥
0
maximize 
𝐸
(
𝑠
𝑇
,
𝑎
𝑇
)
∼
𝜌
𝜋
[
𝑟
(
𝑠
𝑇
,
𝑎
𝑇
)
]
 s.t. 
𝐻
(
𝜋
𝑇
)
−
𝐻
0
≥
0

 여기서 다음의 함수를 만들게 되면,

h
(
π
T
)
	
=
H
(
π
T
)
−
H
0
=
E
(
s
T
,
a
T
)
∼
ρ
π
[
−
log
π
T
(
a
T
|
s
T
)
]
−
H
0


f
(
π
T
)
	
=
{
E
(
s
T
,
a
T
)
∼
ρ
π
[
r
(
s
T
,
a
T
)
]
,
	
if 
h
(
π
T
)
≥
0


−
∞
	
otherwise
ℎ
(
𝜋
𝑇
)
	
=
𝐻
(
𝜋
𝑇
)
−
𝐻
0
=
𝐸
(
𝑠
𝑇
,
𝑎
𝑇
)
∼
𝜌
𝜋
[
−
log
⁡
𝜋
𝑇
(
𝑎
𝑇
|
𝑠
𝑇
)
]
−
𝐻
0


𝑓
(
𝜋
𝑇
)
	
=
{
𝐸
(
𝑠
𝑇
,
𝑎
𝑇
)
∼
𝜌
𝜋
[
𝑟
(
𝑠
𝑇
,
𝑎
𝑇
)
]
,
	
if 
ℎ
(
𝜋
𝑇
)
≥
0


−
∞
	
otherwise

 optimization은 다음과 같이 축약할 수 있게 된다.

maximize
f
(
π
T
)
 s.t. 
h
(
π
T
)
≥
0
maximize
𝑓
(
𝜋
𝑇
)
 s.t. 
ℎ
(
𝜋
𝑇
)
≥
0

위와 같은 inequality constraint를 가진 상태에서의 maximization optimization을 풀기 위해서는 Lagrange multiplier ("dual variable"라고도 부르는 것) 
α
T
𝛼
𝑇
를 이용한 Lagrangian expression을 만들어야 한다.

L
(
π
T
,
α
T
)
=
f
(
π
T
)
+
α
T
h
(
π
T
)
𝐿
(
𝜋
𝑇
,
𝛼
𝑇
)
=
𝑓
(
𝜋
𝑇
)
+
𝛼
𝑇
ℎ
(
𝜋
𝑇
)

특정한 policy 
π
T
𝜋
𝑇
가 주어졌을 때 
α
T
𝛼
𝑇
에 관해서 
L
(
π
T
,
α
T
)
𝐿
(
𝜋
𝑇
,
𝛼
𝑇
)
를 최소화하는 case를 고려해보면 다음과 같다.

h
(
π
T
)
≥
0
ℎ
(
𝜋
𝑇
)
≥
0
와 같이 Constraint가 만족될 경우, 
f
(
π
T
)
𝑓
(
𝜋
𝑇
)
의 값에 대해서 조절할 수 없기 때문에 
α
T
=
0
𝛼
𝑇
=
0
라고 설정할 수 있고, 이로 인해 Lagrangian Expression은 다음과 같이 
L
(
π
T
,
0
)
=
f
(
π
T
)
𝐿
(
𝜋
𝑇
,
0
)
=
𝑓
(
𝜋
𝑇
)
라고 정의할 수 있다.
만약 constraint가 충족되지 않는다면, 결국 
h
(
π
T
)
<
0
ℎ
(
𝜋
𝑇
)
<
0
 이므로,  
α
T
→
∞
𝛼
𝑇
→
∞
를 취함으로써,  
L
(
π
T
,
α
T
)
→
−
∞
𝐿
(
𝜋
𝑇
,
𝛼
𝑇
)
→
−
∞
라는 관계를 얻을 수 있다. 이로 인해 Lagrangian Expression은 
L
(
π
T
,
∞
)
=
−
∞
=
f
(
π
T
)
𝐿
(
𝜋
𝑇
,
∞
)
=
−
∞
=
𝑓
(
𝜋
𝑇
)
라고 정의할 수 있다.

 위의 두가지 case 모두 다음의 equatoin을 정의할 수 있고,

f
(
π
T
)
=
min


α
T
≥
0
L
(
π
T
,
α
T
)
𝑓
(
𝜋
𝑇
)
=
min
𝛼
𝑇
≥
0
𝐿
(
𝜋
𝑇
,
𝛼
𝑇
)

동시에 이 
f
(
π
T
)
𝑓
(
𝜋
𝑇
)
를 maximize해야 한다.

max


π
T
f
(
π
T
)
=
min


α
T
≥
0
max


π
T
L
(
π
T
,
α
T
)
max
𝜋
𝑇
𝑓
(
𝜋
𝑇
)
=
min
𝛼
𝑇
≥
0
max
𝜋
𝑇
𝐿
(
𝜋
𝑇
,
𝛼
𝑇
)

 결국, 
f
(
π
T
)
𝑓
(
𝜋
𝑇
)
를 maximize하기 위해서는 dual problem을 아래와 같이 나열해볼 수 있다. 기억해야 할 것은 
max
π
T
f
(
π
T
)
max
𝜋
𝑇
𝑓
(
𝜋
𝑇
)
를 확실하게 maximize하고, 
−
∞
−
∞
 가 되지 않게끔 하고 싶을 경우, constraint는 항상 만족되어야 한다는 것이다.

max


π
T
E
[
r
(
s
T
,
a
T
)
	
=
max


π
T
f
(
π
T
)
]

	
=
min


α
T
≥
0
max


π
T
L
(
π
T
,
α
T
)

	
=
min


α
T
≥
0
max


π
T
f
(
π
T
)
+
α
T
h
(
π
T
)

	
=
min


α
T
≥
0
max


π
T
E
(
s
T
,
a
T
)
∼
ρ
π
[
r
(
s
T
,
a
T
)
]
+
α
T
(
E
(
s
T
,
a
T
)
∼
ρ
π
[
−
log
π
T
(
a
T
|
s
T
)
]
−
H
0
)

	
=
min


α
T
≥
0
max


π
T
E
(
s
T
,
a
T
)
∼
ρ
π
[
r
(
s
T
,
a
T
)
−
α
T
log
π
T
(
a
T
|
s
T
)
]
−
α
T
H
0

	
=
min


α
T
≥
0
max


π
T
E
(
s
T
,
a
T
)
∼
ρ
π
[
r
(
s
T
,
a
T
)
+
α
T
H
(
π
T
)
−
α
T
H
0
]
max
𝜋
𝑇
𝐸
[
𝑟
(
𝑠
𝑇
,
𝑎
𝑇
)
	
=
max
𝜋
𝑇
𝑓
(
𝜋
𝑇
)
]

	
=
min
𝛼
𝑇
≥
0
max
𝜋
𝑇
𝐿
(
𝜋
𝑇
,
𝛼
𝑇
)

	
=
min
𝛼
𝑇
≥
0
max
𝜋
𝑇
𝑓
(
𝜋
𝑇
)
+
𝛼
𝑇
ℎ
(
𝜋
𝑇
)

	
=
min
𝛼
𝑇
≥
0
max
𝜋
𝑇
𝐸
(
𝑠
𝑇
,
𝑎
𝑇
)
∼
𝜌
𝜋
[
𝑟
(
𝑠
𝑇
,
𝑎
𝑇
)
]
+
𝛼
𝑇
(
𝐸
(
𝑠
𝑇
,
𝑎
𝑇
)
∼
𝜌
𝜋
[
−
log
⁡
𝜋
𝑇
(
𝑎
𝑇
|
𝑠
𝑇
)
]
−
𝐻
0
)

	
=
min
𝛼
𝑇
≥
0
max
𝜋
𝑇
𝐸
(
𝑠
𝑇
,
𝑎
𝑇
)
∼
𝜌
𝜋
[
𝑟
(
𝑠
𝑇
,
𝑎
𝑇
)
−
𝛼
𝑇
log
⁡
𝜋
𝑇
(
𝑎
𝑇
|
𝑠
𝑇
)
]
−
𝛼
𝑇
𝐻
0

	
=
min
𝛼
𝑇
≥
0
max
𝜋
𝑇
𝐸
(
𝑠
𝑇
,
𝑎
𝑇
)
∼
𝜌
𝜋
[
𝑟
(
𝑠
𝑇
,
𝑎
𝑇
)
+
𝛼
𝑇
𝐻
(
𝜋
𝑇
)
−
𝛼
𝑇
𝐻
0
]

이제 optimal 
π
T
𝜋
𝑇
 와 
α
T
𝛼
𝑇
를 순차적으로 계산하려고 한다. 우선, 주어진 현재의 
α
T
𝛼
𝑇
에 대해서 
L
(
π
∗
T
,
α
T
)
𝐿
(
𝜋
𝑇
∗
,
𝛼
𝑇
)
를 maximize할 수 있는 best policy 
π
∗
T
𝜋
𝑇
∗
를 구한다. 그리고 난 후 policy 
π
∗
T
𝜋
𝑇
∗
를 대입해서 
L
(
π
∗
T
,
α
∗
T
)
𝐿
(
𝜋
𝑇
∗
,
𝛼
𝑇
∗
)
 를 minimize할 수 있는 
α
∗
T
𝛼
𝑇
∗
를 구한다. 만약 policy를 구하기 위한 neural network 한개와 temperature parameter를 구하기 위한 neural network을 하나 가지고 있다고 가정해보면, 이런 순차적인 update process는 training동안 network parameter를 update하는 방법과 동일하게 된다.

 
π
∗
T
	
=
arg
max


π
T
E
(
s
T
,
a
T
)
∼
ρ
π
[
r
(
s
T
,
a
T
)
+
α
T
H
(
π
T
)
−
α
T
H
0
]


α
∗
T
	
=
arg
min


α
T
≥
0
E
(
s
T
,
a
T
)
∼
ρ
π
∗
[
α
T
H
(
π
∗
T
)
−
α
T
H
0
]
𝜋
𝑇
∗
	
=
arg
⁡
max
𝜋
𝑇
𝐸
(
𝑠
𝑇
,
𝑎
𝑇
)
∼
𝜌
𝜋
[
𝑟
(
𝑠
𝑇
,
𝑎
𝑇
)
+
𝛼
𝑇
𝐻
(
𝜋
𝑇
)
−
𝛼
𝑇
𝐻
0
]


𝛼
𝑇
∗
	
=
arg
⁡
min
𝛼
𝑇
≥
0
𝐸
(
𝑠
𝑇
,
𝑎
𝑇
)
∼
𝜌
𝜋
∗
[
𝛼
𝑇
𝐻
(
𝜋
𝑇
∗
)
−
𝛼
𝑇
𝐻
0
]

Thus, 
max


π
T
E
[
r
(
s
T
,
a
T
)
]
=
E
(
s
T
,
a
T
)
∼
ρ
π
∗
[
r
(
s
T
,
a
T
)
+
α
∗
T
H
(
π
∗
T
)
−
α
∗
T
H
0
]
Thus, 
max
𝜋
𝑇
𝐸
[
𝑟
(
𝑠
𝑇
,
𝑎
𝑇
)
]
=
𝐸
(
𝑠
𝑇
,
𝑎
𝑇
)
∼
𝜌
𝜋
∗
[
𝑟
(
𝑠
𝑇
,
𝑎
𝑇
)
+
𝛼
𝑇
∗
𝐻
(
𝜋
𝑇
∗
)
−
𝛼
𝑇
∗
𝐻
0
]

그럼 이제 다시 soft Q-value function을 살펴보면, 다음과 같다.

Q
T
−
1
(
s
T
−
1
,
a
T
−
1
)
	
=
r
(
s
T
−
1
,
a
T
−
1
)
+
E
[
Q
(
s
T
,
a
T
)
−
α
T
log
π
(
a
T
|
s
T
)
]
	
	
=
r
(
s
T
−
1
,
a
T
−
1
)
+
E
[
r
(
s
T
,
a
T
)
]
+
α
T
H
(
π
T
)
	

Q
∗
T
−
1
(
s
T
−
1
,
a
T
−
1
)
	
=
r
(
s
T
−
1
,
a
T
−
1
)
+
max


π
T
E
[
r
(
s
T
,
a
T
]
+
α
T
H
(
π
∗
T
)
	
; plug in the optimal 
π
∗
T
𝑄
𝑇
−
1
(
𝑠
𝑇
−
1
,
𝑎
𝑇
−
1
)
	
=
𝑟
(
𝑠
𝑇
−
1
,
𝑎
𝑇
−
1
)
+
𝐸
[
𝑄
(
𝑠
𝑇
,
𝑎
𝑇
)
−
𝛼
𝑇
log
⁡
𝜋
(
𝑎
𝑇
|
𝑠
𝑇
)
]

	
=
𝑟
(
𝑠
𝑇
−
1
,
𝑎
𝑇
−
1
)
+
𝐸
[
𝑟
(
𝑠
𝑇
,
𝑎
𝑇
)
]
+
𝛼
𝑇
𝐻
(
𝜋
𝑇
)


𝑄
𝑇
−
1
∗
(
𝑠
𝑇
−
1
,
𝑎
𝑇
−
1
)
	
=
𝑟
(
𝑠
𝑇
−
1
,
𝑎
𝑇
−
1
)
+
max
𝜋
𝑇
𝐸
[
𝑟
(
𝑠
𝑇
,
𝑎
𝑇
]
+
𝛼
𝑇
𝐻
(
𝜋
𝑇
∗
)
	
; plug in the optimal 
𝜋
𝑇
∗

그러면 time step 
T
−
1
𝑇
−
1
으로 돌아갔을때의 expected return은 다음과 같이 된다.

	
max


π
T
−
1
(
E
[
r
(
s
T
−
1
,
a
T
−
1
)
]
+
max


π
T
E
[
r
(
s
T
,
a
T
]
)
	
	
=
max


π
T
−
1
(
Q
∗
T
−
1
(
s
T
−
1
,
a
T
−
1
)
−
α
∗
T
H
(
π
∗
T
)
)
	
; should s.t. 
H
(
π
T
−
1
)
−
H
0
≥
0

	
=
min


α
T
−
1
≥
0
max


π
T
−
1
(
Q
∗
T
−
1
(
s
T
−
1
,
a
T
−
1
)
−
α
∗
T
H
(
π
∗
T
)
+
α
T
−
1
(
H
(
π
T
−
1
)
−
H
0
)
)
	
; dual problem w/ Lagrangian.

	
=
min


α
T
−
1
≥
0
max


π
T
−
1
(
Q
∗
T
−
1
(
s
T
−
1
,
a
T
−
1
)
+
α
T
−
1
H
(
π
T
−
1
)
−
α
T
−
1
H
0
)
−
α
∗
T
H
(
π
∗
T
)
	
	
max
𝜋
𝑇
−
1
(
𝐸
[
𝑟
(
𝑠
𝑇
−
1
,
𝑎
𝑇
−
1
)
]
+
max
𝜋
𝑇
𝐸
[
𝑟
(
𝑠
𝑇
,
𝑎
𝑇
]
)

	
=
max
𝜋
𝑇
−
1
(
𝑄
𝑇
−
1
∗
(
𝑠
𝑇
−
1
,
𝑎
𝑇
−
1
)
−
𝛼
𝑇
∗
𝐻
(
𝜋
𝑇
∗
)
)
	
; should s.t. 
𝐻
(
𝜋
𝑇
−
1
)
−
𝐻
0
≥
0

	
=
min
𝛼
𝑇
−
1
≥
0
max
𝜋
𝑇
−
1
(
𝑄
𝑇
−
1
∗
(
𝑠
𝑇
−
1
,
𝑎
𝑇
−
1
)
−
𝛼
𝑇
∗
𝐻
(
𝜋
𝑇
∗
)
+
𝛼
𝑇
−
1
(
𝐻
(
𝜋
𝑇
−
1
)
−
𝐻
0
)
)
	
; dual problem w/ Lagrangian.

	
=
min
𝛼
𝑇
−
1
≥
0
max
𝜋
𝑇
−
1
(
𝑄
𝑇
−
1
∗
(
𝑠
𝑇
−
1
,
𝑎
𝑇
−
1
)
+
𝛼
𝑇
−
1
𝐻
(
𝜋
𝑇
−
1
)
−
𝛼
𝑇
−
1
𝐻
0
)
−
𝛼
𝑇
∗
𝐻
(
𝜋
𝑇
∗
)

그러면 이전의 time step 
T
𝑇
와 동일한 방법으로 optimal policy 
π
∗
T
−
1
𝜋
𝑇
−
1
∗
와 
α
∗
T
−
1
𝛼
𝑇
−
1
∗
을 구해볼 수 있다.

π
∗
T
−
1
	
=
arg
max


π
T
−
1
E
(
s
T
−
1
,
a
T
−
1
)
∼
ρ
π
[
Q
∗
T
−
1
(
s
T
−
1
,
a
T
−
1
)
+
α
T
−
1
H
(
π
T
−
1
)
−
α
T
−
1
H
0
]


α
∗
T
−
1
	
=
arg
min


α
T
−
1
≥
0
E
(
s
T
−
1
,
a
T
−
1
)
∼
ρ
π
∗
[
α
T
−
1
H
(
π
∗
T
−
1
)
−
α
T
−
1
H
0
]
𝜋
𝑇
−
1
∗
	
=
arg
⁡
max
𝜋
𝑇
−
1
𝐸
(
𝑠
𝑇
−
1
,
𝑎
𝑇
−
1
)
∼
𝜌
𝜋
[
𝑄
𝑇
−
1
∗
(
𝑠
𝑇
−
1
,
𝑎
𝑇
−
1
)
+
𝛼
𝑇
−
1
𝐻
(
𝜋
𝑇
−
1
)
−
𝛼
𝑇
−
1
𝐻
0
]


𝛼
𝑇
−
1
∗
	
=
arg
⁡
min
𝛼
𝑇
−
1
≥
0
𝐸
(
𝑠
𝑇
−
1
,
𝑎
𝑇
−
1
)
∼
𝜌
𝜋
∗
[
𝛼
𝑇
−
1
𝐻
(
𝜋
𝑇
−
1
∗
)
−
𝛼
𝑇
−
1
𝐻
0
]

 초록색으로 표현한 
α
T
−
1
𝛼
𝑇
−
1
을 update하는 공식은 위에서 파란색으로 표현한 
α
T
𝛼
𝑇
를 update하는 공식과 동일한 형태를 가지고 있는 것을 확인할 수 있다. 이런 과정을 반복해서, 아래와 같은 동일한 objective function을 minimize함으로써, 매 time step 마다 optimal temperature parameter를 학습할 수 있게 된다.

J
(
α
)
=
E
a
t
∼
π
t
[
−
α
log
π
t
(
a
t
|
π
t
)
−
α
H
0
]
𝐽
(
𝛼
)
=
𝐸
𝑎
𝑡
∼
𝜋
𝑡
[
−
𝛼
log
⁡
𝜋
𝑡
(
𝑎
𝑡
|
𝜋
𝑡
)
−
𝛼
𝐻
0
]

objective function 
J
(
α
)
𝐽
(
𝛼
)
에 관하여 
α
𝛼
를 학습하는 것을 제외하고 나머지 부분은 SAC algorith과 동일하다.

Soft Actor-Critic algorithm with automatically adjusted temperature

TD3 (Twin Delayed Deep Deterministic Policy Gradient)

[ 논문 | 코드 ]

 Q-learning algorithm은 흔히 value function에 대한 overestimation으로 인한 성능의 영향을 받는 것으로 알려져 있다. 이렇게 overestimation이 training 도중에 계속 발생하면, policy update시 부정적으로 영향을 끼치게 된다. 이런 특성으로 인해서 Double Q-learning과 Double DQN이란 기법들이 등장했는데, 이 두가지 방법은 두개의 value network을 사용해서 action selection update와 Q-value update를 분리시키는 방법이었다.

 Twin Delayed Deep Deterministic Policy Gradient (TD3; Fujimoto et al, 2018)는 이렇게 value function에 대한 overestimation을 막기 위해서 DDPG에다가 몇가지 기법을 적용한 algorithm이다.

(1) Clipped Double Q-learning : Double Q-learning에서는 action selection과 Q-value estimation이 두개의 network으로 따로 분리되어 이뤄졌었다. DDPG 설정에 맞췄을때, 두개의 deterministic actor network ( 
μ
θ
1
,
μ
θ
2
𝜇
𝜃
1
,
𝜇
𝜃
2
 )와 두개의 critic network ( 
Q
w
1
,
Q
w
2
𝑄
𝑤
1
,
𝑄
𝑤
2
 )이 있는 상태에서 Double Q-learning의 Bellman equation은 다음과 같이 도출할 수 있다.

y
1
	
=
r
+
γ
Q
w
2
(
s
′
,
μ
θ
1
(
s
′
)
)


y
2
	
=
r
+
γ
Q
w
1
(
s
′
,
μ
θ
2
(
s
′
)
)
𝑦
1
	
=
𝑟
+
𝛾
𝑄
𝑤
2
(
𝑠
′
,
𝜇
𝜃
1
(
𝑠
′
)
)


𝑦
2
	
=
𝑟
+
𝛾
𝑄
𝑤
1
(
𝑠
′
,
𝜇
𝜃
2
(
𝑠
′
)
)

하지만, policy가 느리게 변화하기 때문에, 서로 independent한 decision을 하기에는 두개의 network가 너무 유사하게 된다. 이를 피하기 위해, Clippped Double Q-learning은 두 network 중 minimum estimation을 선택하게끔 해서 학습 도중에 벗어나는 것을 막는 underestimation bias를 선호하게 만들었다.

y
1
	
=
r
+
γ
min


i
=
1
,
2
Q
w
i
(
s
′
,
μ
θ
1
(
s
′
)
)


y
2
	
=
r
+
γ
min


i
=
1
,
2
Q
w
i
(
s
′
,
μ
θ
2
(
s
′
)
)
𝑦
1
	
=
𝑟
+
𝛾
min
𝑖
=
1
,
2
𝑄
𝑤
𝑖
(
𝑠
′
,
𝜇
𝜃
1
(
𝑠
′
)
)


𝑦
2
	
=
𝑟
+
𝛾
min
𝑖
=
1
,
2
𝑄
𝑤
𝑖
(
𝑠
′
,
𝜇
𝜃
2
(
𝑠
′
)
)

(2) Delayed update of Target and Policy Networks : actor-critic 모델에서는, policy network의 update와 value network의 update가 깊게 연관되어 있는데, 다시 말해서 policy network이 나쁘게 동작하면, overestimation에 의해서 Value estimation diverge하고, value network이 부정확하면, policy network 자체도 나쁘게 된다는 것이다.

 결국 Variance를 줄이기 위해서, TD3는 policy network를 Q-function보다는 적은 빈도로 update시킨다. Policy network은 value error가 update동안 충분히 작아질 때까지 그대로 유지하게 되는 것이다. 이런 개념은 DQN에서 target network이 stable objective function을 가진 상태로 주기적으로 update하는 방법과 유사하다.

(3) Target Policy Smoothing : value function에서 아주 잠깐 발생하는 peak에 의해서 overfit 될 수 있는 deterministic policy에 대처하기 위해서, TD3는 value function에 대한 smoothing regularization strategy를 적용했다. 이 때 뽑혀진 action에 대해서 작은 clipped random noise를 가하고, mini-batch 내에서 평균을 취하는 것이다.

y
	
=
r
+
γ
Q
w
(
s
′
,
μ
θ
(
s
′
)
+
ϵ
)
	

ϵ
	
∼
clip
(
N
(
0
,
σ
)
,
−
c
,
+
c
)
	
 ; clipped random noises.
𝑦
	
=
𝑟
+
𝛾
𝑄
𝑤
(
𝑠
′
,
𝜇
𝜃
(
𝑠
′
)
+
𝜖
)
	

𝜖
	
∼
clip
(
𝑁
(
0
,
𝜎
)
,
−
𝑐
,
+
𝑐
)
	
 ; clipped random noises.

(중간의 
N
(
0
,
σ
)
𝑁
(
0
,
𝜎
)
는 통계에서 나오는 내용이지만, mean이 0이고 standard deviation이 
σ
𝜎
인 normal distribution을 나타내는 것이다.)

 이런 접근 방식은 SARSA algorithm의 update 방식에서 차용해온 것이고, 이를 통해서 서로 유사한 action은 유사한 value를 가지게끔 해준다.

이게 최종 algorithm이다.

TD3 Algorithm (Fujimoto et al, 2018)

Quick Summary

위의 algorithm을 다뤄본 후에, algorithm 사이에 공통되는 요소나 원칙에 대해서 나열해보고자 한다.

학습을 stabilize하기 위해서는 variance를 줄이고, bias가 변하지 않게끔 유지시켜라
Off-policy 기법은 exploration을 더 잘할 수 있게 해주고, data sample을 효율적으로 사용할 수 있게 해준다.
Experience Replay 사용 (replay memory buffer로부터 data를 sampling해서 학습시킴)
Target network은 Actively learned policy network보다는 느리게 update되거나, 주기적으로 고정된다.
Batch Normalization 적용
Entropy-regularized reward 사용
Critic Network와 Actor Network은 서로 network내의 하위 계층의 parameter와 policy function과 value function을 대표하는 두개의 output을 공유할 수 있다.
Stochastic Policy가 아닌 Deterministic Policy를 학습시키는 것도 가능하다.
Policy update시 policy가 diverge하는 것을 막기 위한 Constraint를 삽입한다.
(K-FAC과 같은) 새로운 optimization method를 적용해볼 수 있다.
Policy에 대한 Entropy Maximization은 Agent가 exploration을 더 잘할 수 있게끔 해준다.
Value function에 대한 overestimation이 발생하지 않도록 해라.
그외 다른 것들도 있겠다.

 (역자) 긴 페이지를 할애하여 Policy Gradient에 대한 정리를 했다. 개인적으로 강화학습을 공부하는 입장에서 Policy Gradient method들을 review하다보니, 정말로 많은 수식 증빙과 이론적인 배경이 바탕이 되는 것을 느꼈다. 아무쪼록 Policy Gradient를 공부하는 학생에게 도움이 되었으면 좋겠다.

 * 혹시 번역된 내용 중에 잘못된 부분이 있으면, 밑의 댓글로 남겨주거나, 메일( kcsgoodboy at gmail dot com or 원저자 lilian dot wengweng at gmail dot com ) 을 주면 감사하겠습니다.

좋아요39
공유하기
게시글 관리
구독하기
저작자표시 비영리 변경금지
(새창열림)
'Study > AI' 카테고리의 다른 글
[DL] Meta-Learning: Learning to Learn Fast
  (24)
[RL] Temporal Difference Learning : TD(0)
  (0)
[ML] Averaged Perceptron / Pegasos
  (0)
[ML][DS] ColumnTransformer를 활용한 Column Align
  (0)
[RL] (Spinning Up) Proof for Using Q-Function in Policy Gradient Formula
  (0)
[RL] (Spinning Up) Proof for Don't Let the Past Distract You
  (0)
[RL] (Spinning Up) Intro to Policy Optimization
  (0)
공유하기 링크
페이스북
카카오스토리
트위터
TAG
A3C, Actor-Critic, D4PG, DDPG, DPG, MADDPG, Policy Gradient, REINFORCE, SAC, TRPO
댓글 24 댓글펼치기
자신에 대한 고찰
생각많은 소심남 님의 블로그입니다.
구독하기
elsa_rsrchr
좋은 글 감사합니다!! 많은 도움이 되었습니다!
2020.01.19 20:46 신고
생각많은 소심남
읽어주셔서 감사합니다!!
2020.01.21 10:17 신고
헬케로
정말 정리를 잘해주셨네요, 이해하기 쉽지 않은 부분까지도 잘 설명해주셔서 감사합니다.
2020.02.11 16:07 신고
생각많은 소심남
방문해주셔서 감사합니다.
2020.04.20 21:46 신고
규철이
최고네요! 조금만 빨리 이 포스팅을 봤으면 좋았을텐데 정말 최고입니당
2020.04.14 20:48 신고
생각많은 소심남
읽어주셔서 감사합니다.
2020.04.20 21:46 신고
KGS
책을 읽어도 어떤게 문제가 되어 발전했는지 파악이 느렸었는데, 덕분에 많은 도움받았습니다! 감사합니다!
2020.08.13 15:06 신고
생각많은 소심남
봐주셔서 감사합니다!
2020.08.13 21:45 신고
김태윤
좋은 글 감사합니다 논문 쓰고있는데 도움이 많이 됐습니다 그런데 A2C에서 병렬구성의 효율성을 위해 비동기적요소를 추가한게 A3C인걸로 알고있는데 아닌가요?
2020.10.27 18:14 신고
생각많은 소심남
넵 맞습니다. A2C에서 병렬화에 대한 효율성을 위해서 비동기적 특성을 가한 것이 A3C 입니다. 실제 논문이 나온것도 A2C는 Sutton이 1986년에 제시했던것이고, A3C는 Mnih가 2016년에 발표했었습니다.

그런데 찾아보시면 아시겠지만, 각 Agent가 비동기된 상태에서 학습되면, 어떤 Agent는 학습이 잘된 케이스도 있겠지만, 어떤 Agent는 학습이 되기 이전의 parameter를 가져서 학습이 잘 안되는 케이스가 있을 겁니다. 결국 각 agent의 weight이 update되는 시점에도 이 안좋은 policy를 가진 agent로 인해서 전체적으로도 성능이 저하될 수 있는 여지가 있을 겁니다. 그래서 링크에도 언급되어 있지만, OpenAI에서 구현한 A2C는 조금더 그런 안좋은 Agent의 policy도 동기화를 통해 weight를 자주 update함으로써, 기존의 A3C보다 메모리 효율성이 좋아졌다. 이정도로 알고 있습니다.
2020.10.27 18:39 신고
김태윤
a3c가 멀티쓰레드 쓸 때 거의 무조건 좋은지 알았는데 아니였군요
2020.10.27 21:21 신고
임정섭
정리 감사합니다,
다만 아직 풀리지 않은 의문점이 있습니다.
저는 dpg 가 왜 policy gradient 의 특수한 경우인지 이해가 안되서 여기까지 오게되었는데 아직 의문이 해소가 안됐습니다 ㅠ
기존 policy gradient 는 gradient(log_prob(action)) * V 공식을 사용하는데요, deterministic한 경우에는 log_prob(action) 이 0 이 나와버려서 gradient 가 없게 되는게 제 뇌피셜입니다.

그런데 sutton 이 제시하는 dpg 에는 gradient(Q(s,a)) * gradient(a) 로 0 이 아닌 값이 나오니 일치하지가 않습니다. 인지부조화를 겪고 있는데 혹시 조언해주실 수 있을까요?
2020.11.04 00:30 신고
생각많은 소심남
안녕하세요.

우선 dpg가 왜 Policy Gradient의 특수한 형태였는지에 대한 질문은 우리가 REINFORCE라고 알고 있는 Vanila Policy Gradient에서는 Policy를 stochastic하게 action을 샘플링해서 취했던 것을 Deterministic하게 해도 학습되는 효과를 누릴 수 있다는 점에서 확인할 수 있다시피, 뭔가 action에 대한 확률 분포를 그냥 1, 0으로 특정지은 것에서 다른 것이라고 볼 수 있습니다. 그래서 원래 글 쓰신분도 특수한 케이스라고 표현을 하신 것 같습니다. 제가 본문에도 소개했다시피 Stochastic Policy에서 그 분산을 표현하는 hyperparameter (
σ
𝜎
)에 따라서 stochastic policy도 deterministic policy가 될 수 있다고 언급했었습니다.

그리고 질문 하신 내용을 다시 정리해보면 결국은 Deterministic Policy도 Sutton이 언급한 Policy Gradient Theorem을 만족할 수 있느냐에 대한 답변이 될텐데, (제가 마무리하지는 못했지만) 아래 글을 참고하시면 좋을 거 같습니다.

https://talkingaboutme.tistory.com/entry/RL-Review-Deterministic-Policy-Gradient-Algorithm
2020.11.04 16:49 신고
kevin
좋은 글 감사합니다. 이 부분부터 너무 어려워 지는 거 같은데, 많은 도움이 될 것 같습니다.
proof 부분에 phi(s^'') 을 빼 먹으신거 같은데 식 번호가 없으니 구체적으로 directing을 못하겠네요.
2020.12.07 11:54 신고
생각많은 소심남
안녕하세요. 읽어주셔서 감사합니다.

말씀하신 부분은 어떤 쪽인지 모르겠네요. proof라면 proof of Policy gradient theorem 쪽 부분인거 같은데, 잘못된 부분을 찾기가 어렵네요.
그리고 제가 
ϕ
𝜙
 notation을 사용한 부분이 얼마 없는데, 그 중에서도 제가 작성한 부분인 SAC에선 
s
′
𝑠
′
이 들어갈 부분이 안보이네요. 자세히 알려주시면 글을 개선하는데 도움이 될거 같습니다. 감사합니다.
2020.12.07 14:04 신고
kevin
예... 그러니까 지금 그림이 보이실지 모르겠지만 아래 그림 처럼 되야 하지 않나 해서요.
https://komputervision.files.wordpress.com/2020/12/image-2.png
이런... 댓글에 하이퍼링크 안 먹네요.
2020.12.07 14:45 신고
생각많은 소심남
아! 맞습니다. unrolling하면서 value function를 확장시켜야 하니까 해당 부분에 말씀하신것처럼 s''에 대한 값이 남아있어야 하겠네요. 해당 부분 수정하겠습니다.
덕분에 내용을 개선할 수 있었네요. 감사합니다!
2020.12.07 14:52 신고
xim
안녕하세요
PPO 와 같은 알고리즘에는 target network 가 없고
DDPG 및 TD3 같은 알고리즘에는 target network 가 있는데
여기서 말하는 target network 가 off-policy 에서 말하는 target policy 와 이를 평가하는 target 가치함수 라고 생각하면 되는건가요?
2021.04.11 16:25 신고
생각많은 소심남
안녕하세요.
지금 말씀하신 내용이 맞습니다.
PPO에서는 부연 설명했다시피 on-policy 계열이고, On-policy 계열 학습은 실제 경험을 쌓는 policy (behavior policy)와 궁극적으로 학습되는 policy (target policy)가 동일합니다. 반면 DDPG와 같은 계열은 Off-policy로써, behavior policy와 target policy가 다른 학습입니다. 사실 이 개념이 중요한 이유는 학습에 사용되는 샘플링 데이터에 대한 효율성 때문입니다. 우리가 만약 궁극적으로 학습해야 할 환경에 대한 분포를 아는 경우라면 모르겠지만, 학습을 하는 이상 데이터를 샘플링해야 할 것이고, on-policy는 학습하는 정책과 행동하는 정책이 동일하기 때문에 이런 분포를 동일하다고 가정하는 것이 가능합니다. 반면 off-policy는 학습하는 정책에 대한 샘플링 분포와 실제 행동하는 정책에 대한 샘플링 분포가 다르기 때문에 이를 극복할 방법이 필요합니다. 이 때 보통 활용되는게 Importance Sampling이라는 것입니다.
더 자세하게 확인하고 싶으시면 제가 이전에 정리한 글(https://talkingaboutme.tistory.com/entry/RL-Off-policy-Learning-for-Prediction)이 있으니 참고해주시면 감사하겠습니다.
2021.04.11 23:10 신고
mychoi
안녕하세요.
글을 읽던 중 틀린 부분이 있어 댓글 남깁니다.
D4PG 의 (1) Distributional Critic 에서 빨간색 부분의 "Q_w" -> "Z_w"로 수정되어야 하고, (2) N-step returns 에서 "이에 따른 새로운 TD-error ~~" -> "이에 따른 새로운 TD-target~~" 이렇게 수정되어야 합니다.
좋은 글 감사합니다.
2022.08.25 20:16 신고
생각많은 소심남
안녕하세요.
지적해주신 부분이 맞습니다. 위 글도 내용에 맞게 다시 수정했습니다.
해당 내용 공유해주셔서 감사합니다.
2022.08.25 22:23 신고
1111
td3 와 MADDPG의 경우 사용법 자체가 다른 애들인건가요?
학습시킬 에이전트가 복수일 경우 => maddpg
학습시킬 에이전트가 1개일 경우 => td3라 보면 되는걸까요?
2022.11.15 10:57 신고
생각많은 소심남
안녕하세요.
우선 MADDPG의 경우는 Multi-agent, 즉 말씀하신 것처럼 에이전트가 여러개 있는 상황에서 DDPG 알고리즘을 적용한 케이스입니다. 일반적으로 이런 알고리즘은 actor-critic 구조로 되어 있는데, MADDPG는 특히 multi actor가 DDPG를 통해서 쌓은 경험들을 centralized critic로 개선시키는 형태로 되어 있습니다. 그래서 엄밀히 말하자면 여러개의 agent를 학습시키는 것이 아니라 여러개의 agent로 좀 더 좋은 정책을 개선하는 방법이라고 할 수 있겠습니다.
TD3는 Twin Delayed DDPG의 준말인데, DDPG에서 delayed update같은 개념을 통해서 개선시킨 것으로 일단 타겟은 단일 agent로 되어 있긴 합니다.
2022.11.15 17:09 신고
baduk
외 회사에서 일하는데 한줄기 빛이네요 너무 감사합니다.
2024.12.06 20:42 신고
댓글쓰기 폼
 
비밀글
입력
공지사항
2015년은 조금더 열심히 해보려고 합니다.
[2014.04.10] 드리는 말씀
[Notice] 블로그에 오신 분들께 드리는 ⋯
[Public] Profile - update⋯
최근에 올라온 글
[Book] 머신 러닝 Q&AI
[Thing] Jetson Orin Nano + ⋯
[Book] 자연어 처리를 위한 허깅페이스 트랜스⋯
[Book] 10가지 프로젝트로 끝내는 트랜스포머⋯
최근에 달린 댓글
안녕하세요. 댓글을 늦게 보았네요. 제가 남들 앞⋯
생각많은 소심남님 읽는 내내 집중하게 되는 글이었어요 ⋯
ก้้้้้้้้้้้้้้้้้้้้้้้้้้้้⋯
추억이네요
Total
2,709,749
Today
45
Yesterday
58
링크
chans_jupyter
TAG
End-To-End
Kinect for windows
Distribution
Gan
reward
Windows Phone 7
Kinect
Kinect SDK
Offline RL
Off-policy
파이썬
인공지능
Policy Gradient
arduino
딥러닝
PowerPoint
ColorStream
bias
TensorFlow Lite
한빛미디어
dynamic programming
RL
Expression Blend 4
SketchFlow
windows 8
Variance
Pipeline
DepthStream
강화학습
processing
more
«   2026/07   »
일	월	화	수	목	금	토
			1	2	3	4
5	6	7	8	9	10	11
12	13	14	15	16	17	18
19	20	21	22	23	24	25
26	27	28	29	30	31	
글 보관함
Blog is powered by Tistory / Designed by Tistory
티스토리툴바
자신에 대한 고찰구독하기
