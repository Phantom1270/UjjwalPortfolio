# Portfolio content and verification notes

Updated 2026-10-27. This is an implementation record, not public-facing website copy.

## Sources and factual decisions

The primary source is the supplied `Ujjwal_Shukla_Resume_latest.pdf`. Its text and embedded links were read before implementation. The original `index.html` supplies historical project material absent from the resume. Those historical claims were not treated as independently measured results.

- Education: B.Tech in Computer Science & Engineering, VIT Chennai, 2024–2028; CGPA 8.98/10. Removed inconsistent year-of-study labels.
- Student Performance Prediction: the pipeline, AdaBoost selection, GridSearchCV, Flask, logging, serialization, tests, MLflow, DVC, and both deployment paths come from the resume. CodePipeline → Elastic Beanstalk and Docker → Amazon ECR remain separate. No final container hosting service or performance metric was inferred.
- Fact-Checking Assistant: the resume supplies document processing, embeddings, vector retrieval, reranking, and grounded generation. The public repository confirms the project's identity and describes its retrieval application. Stronger README claims about guaranteed truth, enterprise readiness, costs, test counts, document counts, and availability were deliberately not copied or independently endorsed.
- Landroid: the resume supports a four-person team, ownership of the scoring pipeline, visualization/map overlays, and 2nd place among 100+ teams. The public repository link was verified; its generic Expo README does not independently substantiate the award or individual contribution.
- Hcare and MedVigilant are the same repository: `https://github.com/Phantom1270/HCare` has a README headed “MedVigilant.” The site shows Hcare with MedVigilant as its alternate name, retaining the resume's feature description and treating it as a prototype.
- LionScott's interface/backend, member management, billing, payments, and admin dashboard are preserved from the original portfolio. The historical “800+ members” and current commercial-production claims are omitted because no supporting evidence was available. A project-specific repository was not identified.
- Forest Fire: the original “92% accuracy” does not identify its metric or evaluation setup. It is omitted, not relabeled as R² or another score. EDA, feature engineering, comparison, and serialization come from the original site. Its earlier Elastic Beanstalk deployment is a historical claim; no current deployment URL was available. A project-specific repository was not identified.
- Wine EDA: the public report and repository confirm the Vinho Verde analysis. Existing Python/Pandas/visualization details are retained from the original portfolio.
- Leadership: the supplied resume documents MIC membership since 2024 and assistance with 5+ hackathons, including logistics, coordination, and event operations.

## Link checks

Direct HTTP GET checks returned 200 on 2026-10-27 for:

- `https://github.com/Phantom1270?tab=repositories`
- `https://github.com/Phantom1270/mlproject`
- `https://github.com/Phantom1270/mlproject_aws_CICD`
- `https://github.com/Phantom1270/Fake_News_RAG`
- `https://github.com/Phantom1270/Landroid-Hackathon-`
- `https://github.com/Phantom1270/HCare`
- `https://github.com/Phantom1270/WineDatasetEDA`
- `https://phantom1270.github.io/WineDatasetEDA/`
- `https://hcaress.streamlit.app/` (HTTP shell only; application functionality unverified, so no public demo link is offered)

The GitHub API was rate-limited; public repository HTML was used instead. Source links are repository-specific. The general profile link is labeled as a profile. LinkedIn and email match the user's supplied addresses; LinkedIn login behavior and actual email delivery were not tested. No project is labeled “Live.”

## Implementation

- Static HTML, CSS, and JavaScript; no package installation or build step.
- Warm ivory/charcoal/olive with Georgia and a system sans-serif stack. No external font requests.
- Three labeled HTML workflow diagrams; no fabricated screenshots, plots, or metrics.
- No intro animation, hidden essential content, custom cursor, continuous animation, or form pretending to submit.
- Accessible disclosure navigation with Escape, focus return, anchor focus, resize handling, and a no-JavaScript fallback.
- Existing CNAME and hosting structure retained. Resume PDF linked directly.
- Favicon and a 1200 × 630 social preview added. The preview is a typographic graphic, not project evidence.

## Verification

`tools/verify-site.cjs` runs a temporary local HTTP server and uses Playwright with installed Microsoft Edge. Playwright is a development tool supplied by the environment, not a site dependency. Set NODE_PATH to a Playwright installation and run `node tools/verify-site.cjs` to repeat the checks.

- Passed viewport/layout and internal anchor checks at 360, 390, 768, 1024, and 1440 pixels.
- Passed mobile keyboard activation, Tab order, Escape/focus return, anchor selection/focus, and desktop resize checks.
- Passed direct resume response and PDF signature, email action, reduced-motion, JavaScript-disabled navigation/content, and 200% text checks.
- No browser JavaScript or console errors in those checks.
- An initial 200% text overflow caused by a long contact heading's min-content width was reproduced and corrected with heading wrapping. The repeated check passes.
- No-JavaScript navigation remains in document flow. The enhanced sticky header measures its height for anchor offsets, including enlarged text; targeted regression checks pass.
- Desktop, tablet, and mobile screenshots were captured under ignored `tmp/qa/` and visually reviewed.
- An independent code review found no additional major issues. Its small-label and formatting suggestions were incorporated.

Limitations: tests use Chromium/Edge on Windows, not physical mobile devices or Safari/Firefox. Project applications, models, performance metrics, and historical results were not independently rerun. The website has not been published or pushed.
