import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { TransitionLink } from "@/components/curtain/TransitionLink";
import { PROJECTS_ANCHOR } from "@/lib/projects";
import { CaseAnchor } from "./CaseAnchor";
import ChapterNav, { type CaseChapter } from "./ChapterNav";
import { SystemDiagram } from "./diagrams";
import { ChapterIntro, NextProject } from "./editorial";
import { caseFocus, prose, sectionGap } from "./styles";

const chapters: readonly CaseChapter[] = [
  { id: "overview", index: "01", label: "Overview" },
  { id: "decisions", index: "02", label: "Decisions" },
  { id: "final-experience", index: "03", label: "Final experience" },
  { id: "validation", index: "04", label: "Validation" },
  { id: "outcome", index: "05", label: "Outcome" },
];

const findings = [
  "Engineers asked for a file and a severity before they asked for a formula.",
  "Names such as FCPP and SCPP were useful to researchers and opaque to the people maintaining the code.",
  "An invisible pipeline classification made the assessment feel like a black box.",
  "A failed analyzer should not wipe out findings that had already succeeded.",
];

const versions = [
  ["V1", "Raw scores", "Numbers, with nowhere to act."],
  ["V2", "Metric dashboard", "Categories and ranges, still no file."],
  ["V3", "File-level diagnosis", "Issues attached to files. Users then questioned the pipeline."],
  ["V4", "Pipeline review", "Stages could be confirmed, moved, or excluded."],
  ["V5", "Evidence and recommendations", "The suggested change had to point at something observable."],
  ["V6", "Final flow", "Priority, drill-down, and a partial result when one analyzer failed."],
];

function Label({ children }: { children: string }) {
  return <p className="text-xs uppercase tracking-[0.16em] text-white/50">{children}</p>;
}

export default function MlsCaseStudy() {
  return (
    <article className="mx-auto w-full min-w-0 max-w-[1440px] overflow-x-clip">
      <ChapterNav title="MLSToolbox" chapters={chapters} />
      <div className="px-[var(--page-gutter)] pb-8">
        <header id="overview" className="scroll-mt-20 grid gap-10 pb-4 pt-8 lg:grid-cols-12 lg:pt-14">
          <div className="lg:col-span-8">
            <TransitionLink
              href={PROJECTS_ANCHOR}
              className={`group inline-flex min-h-11 items-center gap-2 text-sm text-white/70 transition-colors duration-300 fine:hover:text-white ${caseFocus}`}
            >
              <ArrowLeftIcon aria-hidden="true" className="size-4 transition-transform duration-300 fine:group-hover:-translate-x-1" />
              Selected work
            </TransitionLink>
            <p className="mt-8 text-sm text-white/55">MLSToolbox / CodeAssessment</p>
            <h1 className="mt-3 max-w-[16em] text-balance text-[clamp(2rem,4.4vw,3.7rem)] font-medium leading-[1.08] tracking-tight text-white">
              Helping ML engineers move from code-quality scores to actionable issues.
            </h1>
            <p className={`mt-5 ${prose}`}>
              I redesigned and built CodeAssessment, an MLSToolbox workflow that helps engineers assess unfamiliar Python ML repositories, review detected pipeline stages, and investigate prioritized issues with file-level evidence.
            </p>
            <p className="mt-6">
              <CaseAnchor
                href="#final-experience"
                className={`inline-flex min-h-11 items-center text-sm text-white underline decoration-white/30 underline-offset-4 transition-colors duration-200 fine:hover:text-secondary ${caseFocus}`}
              >
                Explore the final experience
              </CaseAnchor>
            </p>
          </div>
          <dl className="grid content-end gap-5 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1">
            {[
              ["Role", "Product Design + Software Engineering"],
              ["Duration", "12 weeks"],
              ["Team", "Researcher, software engineer, and me"],
              ["Context", "GESSI · UPC Barcelona · September–December 2025"],
            ].map(([term, detail]) => (
              <div key={term}>
                <dt className="text-xs uppercase tracking-[0.14em] text-white/45">{term}</dt>
                <dd className="mt-1 text-sm leading-6 text-white/85">{detail}</dd>
              </div>
            ))}
          </dl>
        </header>

        <section aria-labelledby="eval-preview" className="mt-10 border-t border-white/15 pt-6">
          <h2 id="eval-preview" className="text-sm text-white/70">
            Evaluation preview
          </h2>
          <dl className="mt-4 grid gap-6 sm:grid-cols-3">
            {[
              ["10:52 → 4:18", "Median time to an actionable issue"],
              ["2/6 → 5/6", "Task success"],
              ["2.7 → 4.2 / 5", "Confidence"],
            ].map(([value, caption]) => (
              <div key={caption}>
                <dt className="text-[clamp(1.35rem,2vw,1.7rem)] font-medium tracking-tight text-white">{value}</dt>
                <dd className="mt-1 text-sm leading-6 text-white/70">{caption}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 max-w-xl text-sm leading-6 text-white/60">
            Observed across two moderated usability rounds, six participants per round.{" "}
            <CaseAnchor href="#validation" className={`underline decoration-white/30 underline-offset-4 fine:hover:text-white ${caseFocus}`}>
              How this was measured
            </CaseAnchor>
          </p>
        </section>

        <section className={`${sectionGap} grid gap-8 border-t border-white/15 pt-8 lg:grid-cols-3`} aria-labelledby="snapshot-title">
          <h2 id="snapshot-title" className="sr-only">
            Project snapshot
          </h2>
          <div>
            <Label>Starting point</Label>
            <p className="mt-3 text-sm leading-6 text-white/80">
              MLSToolbox already had an Angular frontend, an HTTP gateway, and separate services for code generation and assessment. CodeAssessment could run Pylint and Radon. Research was defining ML-specific cohesion metrics. Scores were visible. Locating the file, and deciding what to do, was left to the engineer. The assessment screens were tied to inconsistent backend responses.
            </p>
          </div>
          <div>
            <Label>What changed in scope</Label>
            <p className="mt-3 text-sm leading-6 text-white/80">
              I joined to integrate those cohesion metrics. In the first two weeks, interviews and walkthroughs showed that another score would not help someone decide what to review. I expanded the assignment into a guided assessment: workflow, information architecture, the result contract, and the analyzer architecture behind it.
            </p>
          </div>
          <div>
            <Label>What I delivered</Label>
            <p className="mt-3 text-sm leading-6 text-white/80">
              A working path from an unfamiliar Python repository to a prioritized, file-level issue, with evidence and a recommendation. Pipeline classification could be reviewed before dependent analyses ran. The assessment stayed usable when one analyzer failed.
            </p>
          </div>
        </section>

        <section className={sectionGap} aria-labelledby="research-title">
          <Label>Research</Label>
          <h2 id="research-title" className="mt-3 max-w-3xl text-balance text-[clamp(1.6rem,2.8vw,2.3rem)] font-medium leading-snug tracking-tight text-white">
            A score of 5.1/10, and eleven minutes to find the file.
          </h2>
          <div className="mt-6 max-w-[40rem] space-y-5 text-[1.0625rem] leading-[1.65] text-white/80 md:text-[1.125rem]">
            <p>
              The clearest episode was the third repository walkthrough. An ML engineer was looking at a model-training repository. The early interface showed maintainability, complexity, functional cohesion, and structural cohesion. Functional cohesion read 5.1/10.
            </p>
            <p>
              He asked, in Spanish, “¿qué archivo está causando esto?” — which file is causing this. The interface could not answer. He opened the repository in his IDE, moved through three folders, inspected functions and imports, and spent 11 minutes finding that a preprocessing file also held feature-engineering and training logic.
            </p>
            <p>That was one session, not an average. The product had detected a signal and handed the localization work back to him.</p>
          </div>
          <p className="mt-8 max-w-3xl text-[clamp(1.35rem,2.2vw,1.85rem)] font-medium leading-snug tracking-tight text-white">
            The useful unit was a localized issue an engineer could investigate.
          </p>
          <dl className="mt-10 grid gap-x-8 gap-y-5 border-t border-white/15 pt-6 sm:grid-cols-2">
            {[
              ["Interviews", "Seven semi-structured interviews, 45–60 minutes each."],
              ["Walkthroughs", "Five repository walkthroughs. Five of the seven participants used a familiar repository; two used public repositories I supplied."],
              ["Who took part", "Three ML engineers, two software engineers working with ML systems, one researcher, and one master’s student maintaining Python pipelines."],
              ["Other inputs", "Six tools or interaction patterns benchmarked. Twelve repositories in the technical corpus. Thirty-four observations in an affinity map."],
            ].map(([term, detail]) => (
              <div key={term}>
                <dt className="text-sm text-white">{term}</dt>
                <dd className="mt-1 text-sm leading-6 text-white/70">{detail}</dd>
              </div>
            ))}
          </dl>
          <ul className="mt-8 max-w-3xl space-y-3">
            {findings.map((finding) => (
              <li key={finding} className="border-t border-white/15 pt-3 text-sm leading-6 text-white/80">
                {finding}
              </li>
            ))}
          </ul>
        </section>

        <div id="decisions" className="scroll-mt-20">
          <ChapterIntro kicker="Decisions" statement="Four choices that changed what the interface could explain." />
          <div className={`${sectionGap} space-y-16 md:space-y-20`}>
            <section aria-labelledby="decision-file" className="grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <Label>01 · File-level issue</Label>
                <h3 id="decision-file" className="mt-3 text-[clamp(1.35rem,2vw,1.75rem)] font-medium leading-snug tracking-tight text-white">
                  The file became the thing you opened, not the score.
                </h3>
                <div className="mt-4 space-y-4 text-sm leading-6 text-white/80">
                  <p>The dashboard could say a metric was low. It could not say where. In V3 I made a prioritized issue the main object, and attached each issue to one or more files. The score stayed as context.</p>
                  <p>I also tried a folder heatmap. It looked clear, and people still had to open several layers before they reached the file. With three participants, all three found the problem faster in an issue list. Two never used the heatmap. I did not time that comparison.</p>
                </div>
              </div>
              <div className="grid gap-px border border-white/15 bg-white/15 sm:grid-cols-2 lg:col-span-7">
                <div className="bg-primary p-5">
                  <p className="text-xs uppercase tracking-[0.14em] text-white/45">Before · explanatory</p>
                  <p className="mt-6 text-lg text-white">Functional cohesion: 5.1/10</p>
                  <p className="mt-3 text-sm leading-6 text-white/60">The number is from the walkthrough above. This is not a screenshot.</p>
                </div>
                <div className="bg-primary p-5">
                  <p className="text-xs uppercase tracking-[0.14em] text-white/45">After · explanatory</p>
                  <p className="mt-6 text-lg leading-snug text-white">preprocessing.py mixes preprocessing, feature engineering, and training.</p>
                  <p className="mt-3 text-sm text-white/80">Severity: high</p>
                </div>
              </div>
            </section>

            <section aria-labelledby="decision-pipeline" className="max-w-3xl">
              <Label>02 · Pipeline review</Label>
              <h3 id="decision-pipeline" className="mt-3 text-[clamp(1.35rem,2vw,1.75rem)] font-medium leading-snug tracking-tight text-white">
                The system proposes the pipeline. The engineer can correct it.
              </h3>
              <div className="mt-4 space-y-4 text-[1.0625rem] leading-[1.65] text-white/80">
                <p>Cohesion metrics depended on how stages and files were classified. When that classification stayed hidden, people treated the result as a guess. I added a review where the system showed the stages it had detected and the files assigned to them. An engineer could confirm a file, move it, or exclude it before analyses that depended on that structure.</p>
                <p>The extra step made the flow less automatic. I accepted that because a wrong stage would quietly change the diagnosis. In sessions, that review took about 20–40 seconds. It is a description of those interactions, not a completion time for every repository.</p>
                <p>Confidence later moved from 2.7 to 4.2 out of 5 between the two usability rounds. Pipeline review was one of several changes between those versions, so I do not treat that shift as evidence for this step alone.</p>
              </div>
            </section>

            <section aria-labelledby="decision-evidence" className="grid items-start gap-8 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <Label>03 · Evidence</Label>
                <h3 id="decision-evidence" className="mt-3 text-[clamp(1.35rem,2vw,1.75rem)] font-medium leading-snug tracking-tight text-white">
                  A recommendation had to point at something in the file.
                </h3>
                <div className="mt-4 space-y-4 text-sm leading-6 text-white/80">
                  <p>By V3 people could find a file, and some recommendations still felt arbitrary. In V5 I attached the suggestion to functions, mixed stages, or structural relationships the analyzer had actually seen.</p>
                  <p>The first layer is the issue, its severity, the file, and why it matters. Under that: evidence and a suggested action. Further down: the metric’s definition, interpretation, formula, and references. The recommendation supports a judgment. It does not replace one.</p>
                </div>
              </div>
              <div className="border border-white/15 p-5 lg:col-span-7">
                <p className="text-xs uppercase tracking-[0.14em] text-white/45">Example issue · from the case notes</p>
                <p className="mt-4 text-sm text-white/60">High</p>
                <p className="mt-1 text-xl text-white">preprocessing.py</p>
                <p className="mt-3 text-sm leading-6 text-white/80">Preprocessing, feature engineering, and training responsibilities are mixed in one file.</p>
                <ul className="mt-4 space-y-1 text-sm leading-6 text-white/75">
                  <li>scale_features() → data preprocessing</li>
                  <li>build_features() → feature engineering</li>
                  <li>train_model() → model training</li>
                </ul>
                <p className="mt-4 text-sm leading-6 text-white/80">Suggested action: move the training logic into the training module and separate feature construction.</p>
              </div>
            </section>

            <section aria-labelledby="decision-partial" className="max-w-3xl border-t border-white/15 pt-8">
              <Label>04 · Partial results</Label>
              <h3 id="decision-partial" className="mt-3 text-[clamp(1.35rem,2vw,1.75rem)] font-medium leading-snug tracking-tight text-white">
                Radon failed. Ten other analyzers had already finished.
              </h3>
              <div className="mt-4 space-y-4 text-[1.0625rem] leading-[1.65] text-white/80">
                <p>On a medium repository, Radon failed on an automatically generated file. The first implementation marked the whole assessment as an error. That was the wrong status for the person waiting on it: ten analyzers had completed.</p>
                <p>I changed the state model so each analyzer reports completed, warning, or failed. Valid findings stay on screen. The interface names the missing check and can retry that analysis. The summary can read completed with warnings.</p>
                <p>This incident is separate from the twelve analyzers available at handoff. It was one failed check among eleven in that run.</p>
              </div>
            </section>

            <aside className="max-w-3xl border-l border-white/20 pl-5">
              <Label>A score I dropped</Label>
              <h3 className="mt-3 text-lg font-medium text-white">A 0–100 Repository Health Score</h3>
              <p className="mt-3 text-sm leading-6 text-white/80">
                In V2 I proposed one number so repositories would be easier to compare. I dropped it after two sessions. A single score hid the difference between maintainability and separation of responsibilities. A repository could be easy to maintain and still mix stages, and 74/100 would bury the distinction the engineer needed. Category context and severity stayed. There is no global health gauge in the final flow.
              </p>
            </aside>
          </div>

          <section className={sectionGap} aria-labelledby="evolution-title">
            <h3 id="evolution-title" className="text-lg font-medium text-white">How the versions actually moved</h3>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-white/75">
              The jumps that mattered were raw scores to a categorized dashboard, then to a file, then to a reviewable pipeline, then to evidence and a result that survives one failed analyzer.
            </p>
            <ol className="mt-6 max-w-3xl">
              {versions.map(([version, title, note]) => (
                <li key={version} className="grid gap-1 border-t border-white/15 py-3 sm:grid-cols-[4.5rem_minmax(0,1fr)] sm:gap-4">
                  <p className="text-sm text-white/50">{version}</p>
                  <p className="text-sm leading-6 text-white/85">
                    <span className="text-white">{title}.</span> {note}
                  </p>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <section id="final-experience" className={`scroll-mt-20 ${sectionGap}`} aria-labelledby="final-title">
          <ChapterIntro kicker="Final experience" statement="Five steps, from an unfamiliar repository to a file worth opening." />
          <p id="final-title" className="sr-only">
            The final CodeAssessment workflow
          </p>
          <ol className="mt-8 max-w-3xl">
            {[
              ["01", "Connect", "Upload a ZIP or paste a Git URL. The form checks the input before processing starts."],
              ["02", "Review", "Inspect the detected ML stages. Confirm, move, or exclude files before analyses that depend on them."],
              ["03", "Assess", "Choose categories in plain language — code quality, maintainability, architecture, ML structure — and follow progress that names the work instead of spinning."],
              ["04", "Investigate", "Issues are ordered by severity. Scores stay in the background. Opening an issue shows the affected files."],
              ["05", "Act", "Evidence and a recommendation sit with the issue. Metric definitions, formulas, and references are one level further down."],
            ].map(([index, title, body]) => (
              <li key={index} className="grid gap-2 border-t border-white/15 py-5 sm:grid-cols-[6rem_minmax(0,1fr)] sm:gap-6">
                <p className="text-sm text-white/45">{index}</p>
                <div>
                  <h3 className="text-lg text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/75">{body}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-white/70">
            The same session could re-run an analysis or export the findings. Academic metric names stayed in the advanced layer.
          </p>
          <p className="mt-6">
            <CaseAnchor href="#system" className={`text-sm text-white/70 underline decoration-white/25 underline-offset-4 fine:hover:text-white ${caseFocus}`}>
              How the result contract made this consistent
            </CaseAnchor>
          </p>
        </section>

        <section id="system" className={`scroll-mt-20 ${sectionGap}`} aria-labelledby="system-title">
          <h2 id="system-title" className="max-w-3xl text-balance text-[clamp(1.6rem,2.8vw,2.3rem)] font-medium leading-snug tracking-tight text-white">
            The result contract made the experience consistent.
          </h2>
          <p className={`mt-4 ${prose}`}>
            If every analyzer returned a different shape, the interface could not explain them the same way. I defined a shared result so severity, a file diagnosis, evidence, and a recommendation arrived in one structure. The researcher owned the scientific definitions. I operationalized them: formula to algorithm, then a normalized result the interface could present.
          </p>
          <div className="mt-8">
            <SystemDiagram />
          </div>
          <ul className="mt-8 max-w-3xl space-y-3 text-sm leading-6 text-white/75">
            <li>A shared syntax tree meant analyzers described the same repository, and the project was not parsed again for every metric.</li>
            <li>Independent analyzers meant one failure did not delete the rest of the run.</li>
            <li>Feature-based Angular components kept input, scanning, and results able to change without rewriting the rest of MLSToolbox.</li>
            <li>Each upload used its own UUID session, so concurrent runs did not share files or state.</li>
          </ul>

          <details className="group mt-10 max-w-3xl border-t border-white/15">
            <summary className={`flex min-h-11 cursor-pointer list-none items-center justify-between py-4 text-white marker:content-none [&::-webkit-details-marker]:hidden ${caseFocus}`}>
              Implementation details
              <span aria-hidden="true" className="text-white/50 group-open:hidden">+</span>
              <span aria-hidden="true" className="hidden text-white/50 group-open:inline">–</span>
            </summary>
            <div className="space-y-4 pb-6 text-sm leading-6 text-white/75">
              <p>The assessment service is Python and Flask. The interface is Angular. Pylint covers general quality signals. Radon covers cyclomatic complexity and maintainability. I mapped both into the same result shape as the research metrics.</p>
              <p>The six cohesion metrics — CCPM, SCPM, FCPM, CCPP, SCPP, and FCPP — were defined by the principal researcher. I integrated them as analyzers and designed how a diagnosis appears before the formula.</p>
              <p>A factory builds the analyzers the engineer selected. Each one is a strategy. BaseAnalyzer holds the shared path checks, file selection, context access, and result assembly, which removed about 150 lines of duplicated setup. New metrics register instead of branching through the whole application.</p>
              <p>The conceptual result carries an analyzer id, a score, a module count, a severity, file diagnostics, a recommendation, details, and metric metadata. That is the contract described for the product, not a pasted production schema.</p>
              <p>CodeAssessment loads lazily. Errors are typed — invalid input, missing session, analyzer failure — and sessions are cleaned up so the interface can offer a next action instead of a generic failure.</p>
            </div>
          </details>
        </section>

        <section id="validation" className="scroll-mt-20" aria-labelledby="validation-title">
          <ChapterIntro kicker="Validation" statement="Three different questions, measured separately." />

          <div className={`${sectionGap} space-y-14`}>
            <section aria-labelledby="usability-title">
              <h3 id="usability-title" className="text-lg text-white">Usability</h3>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-white/75">
                Round 1 used V2 with six participants. Round 2 used V6 with six participants: four new, two returning. The task stayed the same. Identify a priority issue in an unfamiliar repository, explain the problem, and choose a coherent file without help from the moderator.
              </p>
              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[32rem] border-t border-white/15 text-left text-sm">
                  <caption className="sr-only">Usability results from round 1 and round 2</caption>
                  <thead>
                    <tr className="text-white/50">
                      <th className="py-2 pr-4 font-normal">Measure</th>
                      <th className="py-2 pr-4 font-normal">Round 1</th>
                      <th className="py-2 font-normal">Round 2</th>
                    </tr>
                  </thead>
                  <tbody className="text-white/85">
                    <tr className="border-t border-white/15">
                      <th className="py-3 pr-4 text-left font-normal">Median time</th>
                      <td className="py-3 pr-4">10 min 52 sec</td>
                      <td className="py-3">4 min 18 sec</td>
                    </tr>
                    <tr className="border-t border-white/15">
                      <th className="py-3 pr-4 text-left font-normal">Task success</th>
                      <td className="py-3 pr-4">2/6</td>
                      <td className="py-3">5/6</td>
                    </tr>
                    <tr className="border-t border-white/15">
                      <th className="py-3 pr-4 text-left font-normal">Correct interpretation without help</th>
                      <td className="py-3 pr-4">3/6</td>
                      <td className="py-3">5/6</td>
                    </tr>
                    <tr className="border-t border-white/15">
                      <th className="py-3 pr-4 text-left font-normal">Confidence</th>
                      <td className="py-3 pr-4">2.7 / 5</td>
                      <td className="py-3">4.2 / 5</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <ul className="mt-4 max-w-3xl space-y-2 text-sm leading-6 text-white/70">
                <li>Timing started once the repository was loaded and stopped when the participant named a concrete issue and a file.</li>
                <li>Two evaluators judged each explanation as correct, partial, or incorrect.</li>
                <li>Confidence was a 1–5 rating after the task: how sure they were that they would inspect the right place first.</li>
              </ul>
              <p className="mt-4 max-w-3xl text-sm leading-6 text-white/60">
                Directional findings from two small moderated rounds with partially overlapping participants. Multiple changes were introduced between versions.
              </p>
              <ul className="mt-6 max-w-3xl space-y-2 text-sm leading-6 text-white/75">
                <li>Evidence was opened in 14 of 18 diagnosis tasks. That is an interaction pattern, not 18 participants.</li>
                <li>All six round-2 participants opened pipeline review. Four corrected or verified a classification.</li>
                <li>Recommendation usefulness in round 2 averaged 4.4/5. Feedback during iteration pushed vague suggestions to name something observable in the file. I am not pinning that comment to a single version number.</li>
              </ul>
            </section>

            <section aria-labelledby="technical-title">
              <h3 id="technical-title" className="text-lg text-white">Technical and expert review</h3>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-white/75">
                The corpus was twelve Python ML repositories: six small, four medium, two large. We labeled 182 files with a primary stage. I did the first pass. The researcher reviewed ambiguous cases. Disagreements were resolved by consensus.
              </p>
              <dl className="mt-6 max-w-3xl divide-y divide-white/15 border-y border-white/15">
                {[
                  ["Pipeline classification", "Macro F1 of 0.84 before overrides, and 0.92 after assisted correction. The second figure includes human review. It is not autonomous performance."],
                  ["Diagnostic precision", "49 of 60 sampled issues held up in manual review, 81.7%. That is precision on the sample, not overall accuracy."],
                  ["Expert review of recommendations", "Three senior reviewers scored 30 recommendations. Average usefulness was 4.3/5, and 26 of 30 were considered actionable. This is separate from the 4.4/5 rating in the usability round."],
                  ["High-priority false positives", "On the same controlled cases, findings that were false or too weak to act on moved from 24% to 13% after pipeline review and severity-rule changes. The report does not state how many issues were in that comparison."],
                  ["Partial failure", "Valid results stayed visible in every partial-failure case that was tested. The report does not say how many cases that was."],
                ].map(([term, detail]) => (
                  <div key={term} className="grid gap-1 py-4 sm:grid-cols-[14rem_minmax(0,1fr)] sm:gap-6">
                    <dt className="text-sm text-white">{term}</dt>
                    <dd className="text-sm leading-6 text-white/75">{detail}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section aria-labelledby="extensibility-title" className="max-w-3xl">
              <h3 id="extensibility-title" className="text-lg text-white">An internal check on adding an analyzer</h3>
              <p className="mt-3 text-sm leading-6 text-white/75">
                Integrating a metric with the earlier approach took about one working day. The same kind of integration, using the shared analyzer contract, took about 2 hours 20 minutes. That is a comparison of two integrations, not a productivity benchmark, and I am not turning it into a percentage.
              </p>
            </section>
          </div>
        </section>

        <section id="outcome" className="scroll-mt-20" aria-labelledby="outcome-title">
          <ChapterIntro kicker="Outcome" statement="Shipped into MLSToolbox, with a narrower claim about use." />
          <div id="outcome-title" className="sr-only">
            Outcome and handoff
          </div>
          <div className="mt-8 grid gap-8 lg:grid-cols-3">
            <section>
              <h3 className="text-sm text-white">A working workflow</h3>
              <p className="mt-3 text-sm leading-6 text-white/75">
                CodeAssessment shipped inside MLSToolbox, on the team’s development and production environments. Someone could load a repository, review the pipeline, run the assessment, and read the findings without the technical team stepping in. Twelve analyzers were available, covering quality, complexity, maintainability, structure, detection, and cohesion.
              </p>
            </section>
            <section>
              <h3 className="text-sm text-white">What the evaluation can support</h3>
              <p className="mt-3 text-sm leading-6 text-white/75">
                On the moderated task, median time fell from 10:52 to 4:18, and task success moved from 2/6 to 5/6. Those are directional results from two small rounds, not production KPIs, and not proof that one feature caused the change.
              </p>
            </section>
            <section>
              <h3 className="text-sm text-white">Final two weeks</h3>
              <p className="mt-3 text-sm leading-6 text-white/75">
                During the final two weeks, we ran 24 analysis sessions across the 12-repository evaluation corpus and three additional repositories from the research group.
              </p>
              <h3 className="mt-6 text-sm text-white">After handoff</h3>
              <p className="mt-3 text-sm leading-6 text-white/75">
                After handoff, the team used the shared result contract to add another metric without changing the frontend workflow.
              </p>
            </section>
          </div>

          <section className={sectionGap} aria-labelledby="reflection-title">
            <h2 id="reflection-title" className="max-w-3xl text-balance text-[clamp(1.5rem,2.6vw,2.1rem)] font-medium leading-snug tracking-tight text-white">
              Control was the harder product decision.
            </h2>
            <div className="mt-5 max-w-[40rem] space-y-4 text-[1.0625rem] leading-[1.65] text-white/80">
              <p>The tempting promise was “upload a repository and get the answer.” Cohesion metrics depended on the pipeline context, so a fully automatic reading would have been confident and sometimes wrong. The review step added friction. I kept it because people could see the assumption and correct it.</p>
              <p>I also gave up the global health score, for the reason above: it made unlike problems look comparable. And I learned that the response contract decides what a screen is allowed to say. If a failure has no type, the interface can only apologize. If a result has no file, the interface cannot point.</p>
              <p>Static analysis still cannot establish data quality, runtime behavior, production model performance, or the business reason a structure exists. Recommendations stayed evidence for a person, not instructions.</p>
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div>
                <h3 className="text-sm text-white">What I would do sooner</h3>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-white/75">
                  <li>Recruit external ML engineers in the first week.</li>
                  <li>Record step-level behavior from the first version.</li>
                  <li>Define ground truth before building each analyzer.</li>
                  <li>Try notebooks and monorepos earlier.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm text-white">Still out of scope</h3>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-white/75">
                  <li>Deeper notebook support.</li>
                  <li>History across versions of a repository.</li>
                  <li>Pull-request integration.</li>
                  <li>Runtime and data-quality assessment.</li>
                </ul>
              </div>
            </div>
          </section>

          <div className={sectionGap}>
            <NextProject
              kicker="Next case study"
              index="02"
              title="Ominio"
              href="/work/ominio"
            />
          </div>
        </section>
      </div>
    </article>
  );
}
