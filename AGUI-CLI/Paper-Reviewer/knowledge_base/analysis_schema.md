# Analysis Schema

Use this table to produce a structured breakdown of each source document in the corpus. Every field must be populated; if a source does not address a field, enter "Not addressed" with a brief note on why.

## Schema Table

| Field | Description | Guidance |
|---|---|---|
| **Research Question** | The central question or problem the source sets out to address. | State it as a question. If implicit, reconstruct it and note that it was inferred. |
| **Assumptions** | Foundational premises the authors take as given, including theoretical frameworks, axioms, or unstated beliefs. | Distinguish stated assumptions from those the agent infers. |
| **Data** | The empirical material the source relies on - datasets, surveys, case studies, simulations, corpora, or prior literature. | Note data provenance, time range, and sample size where available. |
| **Method** | The analytical approach - experimental design, statistical technique, simulation framework, qualitative coding, literature review, etc. | Classify as quantitative, qualitative, mixed, or theoretical. |
| **Evaluation Criteria** | How the source judges success or validity - metrics, benchmarks, significance thresholds, or qualitative standards. | If no explicit criteria are given, note their absence. |
| **Findings** | The principal results or conclusions. | Separate empirical findings (evidence) from interpretive conclusions (inference). Use the evidence/inference/speculation labels from `agent_scope.md`. |
| **Limitations** | Acknowledged or apparent constraints - sample bias, methodological gaps, scope restrictions, reproducibility concerns. | Include both author-stated limitations and those identified by the agent. |
| **Relationship to Other Sources** | How this source connects to others in the corpus - agreements, contradictions, extensions, or gaps. | Reference specific sources by their glossary filename. |

## Usage

When a user supplies a new document, populate this table and save the result alongside the corresponding glossary file in the `glossary/` directory. The populated table should appear as a markdown table within the glossary file, beneath the term definitions and content summary.
