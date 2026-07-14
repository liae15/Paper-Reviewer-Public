# Topic Dictionary - AI in Economic Decision-Making

This file defines key terms from artificial intelligence and economics at an upper-undergraduate level. The agent uses this dictionary to ensure depth and terminological consistency across all outputs. Terms are grouped by domain.

---

## Artificial Intelligence - Core Concepts

| Term | Definition |
|---|---|
| **AI agent** | A system that perceives its environment, reasons about goals, and takes autonomous actions over multiple steps without continuous human direction. |
| **Agentic AI** | AI systems designed for autonomy, planning, tool use, and iterative task execution, as distinct from single-turn generative models. |
| **Large language model (LLM)** | A neural network trained on large text corpora to predict and generate language; the base architecture behind most modern AI agents. |
| **Hallucination** | Model generation of plausible but factually incorrect content; a key reliability concern in research and decision-making contexts. |
| **Retrieval-augmented generation (RAG)** | A technique that supplements an LLM's generation with relevant passages retrieved from an external knowledge store, reducing hallucination. |

## AI - Training and Model Types

| Term | Definition |
|---|---|
| **Supervised learning** | Training a model on labeled input-output pairs so it learns to predict outputs for unseen inputs; the basis of most classification and regression tasks. |
| **Unsupervised learning** | Training without labeled outcomes; the model discovers structure (clusters, latent variables) in the data on its own. |
| **Reinforcement learning (RL)** | A paradigm where an agent learns by taking actions in an environment and receiving reward or penalty signals; used in game-playing, trading, and policy optimization. |
| **Reinforcement learning from human feedback (RLHF)** | A variant of RL that uses human preference judgments rather than an explicit reward function to steer model behavior. |
| **Fine-tuning** | Adapting a pre-trained model to a specific domain or task by continuing training on a curated dataset. |
| **Transfer learning** | Applying knowledge learned in one domain (e.g., general text) to a different domain (e.g., financial reports), reducing the data needed to reach good performance. |
| **Overfitting** | When a model learns noise or idiosyncrasies in the training data rather than generalizable patterns, causing poor performance on new data. |
| **Regularization** | Techniques (L1/L2 penalties, dropout, early stopping) that constrain a model's complexity to prevent overfitting. |
| **Random forest** | An ensemble method that trains many decision trees on random subsets of features and data, then aggregates their predictions; widely used for tabular economic data. |
| **Gradient boosting (XGBoost, LightGBM)** | An ensemble method that sequentially trains weak learners, with each new learner correcting errors of the previous ones; strong on structured/tabular datasets. |
| **Neural network** | A model composed of layers of interconnected nodes (neurons) that learn nonlinear mappings from inputs to outputs through backpropagation. |
| **Recurrent neural network (RNN) / LSTM** | Architectures designed for sequential data (time series, text) that maintain hidden state across time steps; predecessors to transformers in NLP. |
| **Transformer** | The attention-based architecture underlying modern LLMs; processes all input tokens in parallel and captures long-range dependencies. |
| **Support vector machine (SVM)** | A classifier that finds the optimal hyperplane separating classes in feature space; effective for small-to-medium datasets with clear margins. |
| **Cross-validation** | A resampling method (e.g., k-fold) that evaluates model performance by training and testing on different data splits, reducing evaluation variance. |
| **Bias-variance tradeoff** | The tension between a model that is too simple to capture patterns (high bias) and one that memorizes noise (high variance); central to model selection. |
| **Feature engineering** | The process of creating, selecting, or transforming input variables to improve model performance; often domain-specific (e.g., constructing economic indicators). |
| **Hyperparameter tuning** | Adjusting model settings (learning rate, tree depth, regularization strength) that are not learned during training; typically done via grid search or Bayesian optimization. |

## Economics

| Term | Definition |
|---|---|
| **Decision-making under uncertainty** | Choosing actions when outcomes depend on unknown or probabilistic states of the world; central to economic theory and agent evaluation. |
| **Rational agent (economic)** | An actor that consistently maximizes expected utility given its information and constraints; the standard behavioral assumption in microeconomics. |
| **Bounded rationality** | Herbert Simon's concept that real decision-makers operate under cognitive and informational limits, leading to satisficing rather than optimizing behavior. |
| **Expected utility theory** | A framework for decision-making under uncertainty where agents choose the option with the highest probability-weighted utility. |
| **Behavioral economics** | The study of how psychological biases, heuristics, and social factors cause economic decisions to deviate from rational-agent predictions. |
| **Game theory** | The study of strategic interaction among agents whose outcomes depend on each other's choices. |
| **Nash equilibrium** | A set of strategies where no player can improve their payoff by unilaterally changing their strategy; a baseline for evaluating strategic AI behavior. |
| **Principal-agent problem** | A situation where one party (the principal) delegates action to another (the agent) whose interests may not fully align, creating moral hazard and adverse selection risks. |
| **Adverse selection** | A market failure where one party has private information before a transaction, leading to a skewed pool of participants (e.g., insurance markets). |
| **Moral hazard** | The risk that a party insulated from consequences behaves differently than they would under full accountability; relevant to AI delegation. |
| **Market efficiency** | The degree to which asset prices incorporate all available information; relevant to evaluating whether AI agents improve or distort price discovery. |
| **Asymmetric information** | A condition where one party in a transaction has more or better information than the other, distorting outcomes. |
| **Elasticity** | A measure of how responsive one economic variable (e.g., demand) is to changes in another (e.g., price); important for AI-driven pricing models. |
| **Marginal analysis** | Decision-making based on comparing the additional benefit of an action to its additional cost; foundational to microeconomic optimization. |
| **Opportunity cost** | The value of the next-best alternative forgone when making a choice; often underweighted in automated decision systems. |
| **Resource allocation** | The process of distributing scarce inputs (capital, labor, materials) among competing uses; a core function agents may optimize. |
| **Productivity** | Output per unit of input; AI agents are evaluated partly on whether they increase productivity in economic workflows. |
| **Transaction cost** | The cost of participating in a market beyond the price of the good itself (search, bargaining, enforcement); agents may reduce these. |
| **Externality** | A cost or benefit imposed on third parties not involved in a transaction; agent-driven automation may create positive externalities (efficiency) or negative ones (displacement). |
| **Systemic risk** | The possibility that failure of one component (or correlated failures across components) destabilizes an entire system, such as a financial market. |
| **Pareto efficiency** | An allocation where no individual can be made better off without making someone else worse off; a welfare benchmark for evaluating AI-optimized outcomes. |
| **General equilibrium** | A state where supply equals demand simultaneously across all markets; AI-driven shocks to one market may propagate through this interconnected structure. |

## Intersection - AI + Economics

| Term | Definition |
|---|---|
| **Algorithmic trading** | Automated execution of financial trades based on pre-programmed rules or learned strategies; a precursor to general-purpose economic agents. |
| **Agent economy** | A hypothetical or emerging market structure in which AI agents autonomously initiate and complete economic transactions on behalf of human principals. |
| **Prompt sensitivity (economic)** | The finding that LLM economic preferences and decisions shift substantially with minor changes in task framing; undermines reliability for autonomous economic action. |
| **Locally optimal heuristic** | A decision rule that performs well in narrow conditions but fails to generalize; observed in LLM pricing and strategy tasks. |
| **Value alignment (economic)** | Ensuring an agent's optimization objective matches the economic interests of its principal rather than a proxy metric. |
| **Human-in-the-loop** | A system design where a human reviews and approves agent actions at critical decision points, trading autonomy for safety. |
| **Audit trail** | A persistent log of agent decisions and actions enabling post-hoc accountability review; essential for economic applications. |
| **Automated market maker (AMM)** | An algorithm that provides liquidity and sets prices in a market without a traditional order book; an early form of agent-mediated economic activity. |
| **Mechanism design** | The "inverse" of game theory - designing rules and incentives so that self-interested agents produce a desired collective outcome; relevant to governing AI agent marketplaces. |
