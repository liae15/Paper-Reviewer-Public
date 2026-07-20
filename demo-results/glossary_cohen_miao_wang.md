# Glossary - Cohen, Miao, and Wang (Year TBD)

**Source (MLA 8):** Cohen, Maxime C., Sentao Miao, and Yining Wang. "Dynamic Pricing with Fairness Constraints." *Operations Research* (forthcoming). Available at SSRN or journal website.

## Source-Specific Terms

| Term | Definition (as used in this source) | Dictionary Alignment |
|---|---|---|
| **Price fairness** | The requirement that prices satisfy two conditions: (i) group fairness—prices are similar across different customer groups (│p_{i,t} - p_{j,t}│≤ δ_{ij}); (ii) time fairness—prices remain relatively stable over time for each group. | Not in `topic_dictionary.md`. Related to broader economic fairness concepts but specific to pricing context. **Candidate for addition.** |
| **Demand fairness** | A fairness constraint requiring that expected demand levels are similar across different customer groups, even when groups have different willingness to pay. Operationalized by setting different prices to achieve similar demand (│f_i(p_i) - f_j(p_j)│sufficiently small). | Not in `topic_dictionary.md`. Contrasts with price fairness—focuses on outcome equality rather than price equality. **Candidate for addition.** |
| **Group fairness** | The constraint that prices offered to different customer groups do not differ substantially, formalized as │p_{i,t} - p_{j,t}│≤ δ_{ij} for all time periods t and group pairs i,j, where δ_{ij} ≥ 0 is a fairness tolerance parameter. | Not in `topic_dictionary.md`. Distinct from algorithmic fairness definitions in ML literature; this is pricing-specific. **Candidate for addition.** |
| **Time fairness** | The constraint that prices offered to a single customer group remain relatively stable across time periods. Authors implement this through restrictions on how frequently and by how much prices can change. | Not in `topic_dictionary.md`. Related to behavioral economics concept of reference prices (Popescu & Wu 2007) but formalized as hard constraint. **Candidate for addition.** |
| **Regret** | The cumulative revenue loss compared to an optimal pricing policy that has full knowledge of demand parameters. Formally: R(T) = Σ_{t=1}^T [R(p*) - R(p_t)] where p* is the optimal price vector and p_t is the algorithm's price at time t. | Aligns with **reinforcement learning (RL)** concept in `topic_dictionary.md` where agents learn via reward/penalty signals. Regret is the standard performance metric in bandit/online learning settings. |
| **FaPU (Fairness and Pricing with UCB)** | Algorithm 1 in the paper. A dynamic pricing algorithm that uses upper confidence bound (UCB) exploration to learn demand while maintaining price fairness constraints (both group and time fairness). | Not in `topic_dictionary.md`. UCB is a classic bandit algorithm; FaPU adapts it for constrained pricing. Related to **reinforcement learning** in dictionary. **Candidate for addition.** |
| **Primal-dual algorithm** | Algorithm 6 in the paper. An online learning algorithm for demand fairness that maintains dual variables (Lagrange multipliers) for fairness constraints and updates primal (pricing) and dual variables iteratively. Based on adversarial linear bandits framework. | Related to **game theory** and optimization in `topic_dictionary.md` but specific technique not defined. Primal-dual methods are standard in constrained optimization. |
| **Dynamic regret** | A variant of regret for non-stationary environments where the optimal policy changes over time. Measured relative to a sequence of time-varying optimal policies rather than a single fixed optimum. | Extension of standard regret concept. Not in `topic_dictionary.md`. Important for real-world settings where demand evolves. **Candidate for addition.** |
| **Relative regret** | Regret expressed as a percentage of optimal revenue: (R(T) / T·R(p*)) × 100%. Used in experimental results to normalize performance across different parameter settings. | Performance metric variant. Not in `topic_dictionary.md`. Makes regret comparable across different problem scales. |
| **CILS (Constrained Index-based Learning Strategy)** | A benchmark algorithm used for comparison. Index-based approach for learning under constraints, showing inferior performance to FaPU in experiments. | Not in `topic_dictionary.md`. Benchmark algorithm specific to this paper's experimental setup. |
| **ILS-D (Index Learning with Demand constraints)** | A second benchmark algorithm tested in experiments. Designed for demand-constrained settings; shows intermediate performance between FaPU and CILS. | Not in `topic_dictionary.md`. Benchmark algorithm specific to this paper. |
| **Incomplete learning** | A phenomenon where constraints on the decision space prevent full exploration of the action space, leading to suboptimal long-run performance. Authors cite Lai & Robbins (1985) and Keskin & Zeevi (2018). | Related to **bounded rationality** in `topic_dictionary.md`—both involve suboptimal decisions due to constraints. Incomplete learning is exploration constraint; bounded rationality is cognitive/informational constraint. |

## Novel Terms - Recommended Additions to `topic_dictionary.md`

**High priority for dictionary inclusion:**

1. **Price fairness** – Central concept in algorithmic pricing and increasingly relevant to AI-driven pricing systems
2. **Demand fairness** – Alternative fairness notion with different policy implications
3. **Group fairness (pricing context)** – Distinct from ML fairness; important for economic applications
4. **Dynamic regret** – Standard metric in non-stationary online learning, applicable to many AI agent scenarios
5. **FaPU or UCB-based pricing** – Concrete algorithmic approach combining exploration and constraint satisfaction

**Medium priority:**

6. **Time fairness (pricing)** – Connects to reference-dependent preferences and customer expectations
7. **Relative regret** – Useful normalization for comparing algorithm performance

## Cross-References to Existing Dictionary Terms

| Dictionary Term | How This Paper Uses It |
|---|---|
| **Reinforcement learning (RL)** | Paper's algorithms use bandit framework (subset of RL) with regret minimization objective. FaPU employs UCB exploration, a classic RL technique. |
| **Bounded rationality** | Related to paper's discussion of incomplete learning—constraints limit exploration, analogous to cognitive limits in bounded rationality. |
| **Principal-agent problem** | Implicit: retailer (principal) delegates pricing to algorithm (agent); fairness constraints help align algorithm behavior with policy objectives. |
| **Asymmetric information** | Core motivation: retailer lacks full demand information and must learn while pricing, creating exploration-exploitation tradeoff. |
| **Behavioral economics** | Paper references Popescu & Wu (2007) and den Boer & Keskin (2022) on reference effects—time fairness connects to behavioral responses to price changes. |
| **Elasticity** | Implicitly present in demand functions f_i(p_i)—how responsive demand is to price changes drives optimal pricing and fairness tradeoffs. |
| **Opportunity cost** | Regret directly measures opportunity cost: revenue foregone by not knowing demand parameters. |
