# Step 1 prompt — paste into a new chat in each Claude web project

This prompt is the content format for the whole pipeline. Claude Code's `/build-index` and
`/build-page` expect exactly this shape, so if the format changes, update the skills as well.

---

# Summary-page content extraction

Goal: write content specs that Claude Code will turn into a visual, interactive study site for this subject. Claude Code only sees what you write, so it has to be complete and faithful to the course files.

Rules:
- Use only the project files. If something isn't covered there, write `> GAP: <what is missing>`. Don't fill it from general knowledge.
- Cite the source for every point: `[file, p. N]` or `[file, slide N]`.
- Write in the language the course materials use, and keep their technical terms and notation.
- Math in LaTeX: `$inline$` and `$$display$$`. Use the course's notation exactly.
- Do one topic per message, then stop and wait for me to say "next". Don't batch topics, because you'll skim.

Message 1: list every file (name, type, page/slide count, topics covered) and propose the topic order for the site, grouped into topics → subtopics. One subtopic = one page. Wait for my OK.

Then, one message per subtopic, give me one markdown block I can save as `NN-topic-slug.md` (NN = page order, two digits; slug lowercase-with-dashes, ASCII only). Use exactly these headings, in this order:

````markdown
---
slug: NN-topic-slug
title: Human-readable title
topic: topic-id            # from 00-index.md
exam_weight: high          # high | medium | low
exam_weight_note: "task 3 on 4 of 5 exams"
builds_on: [NN-other-slug] # pages you need first (may be empty)
used_in: [NN-other-slug]   # pages that use this one (may be empty)
sources: ["file.pdf", "Øving 4.pdf"]
---

## Pretest
2–3 short questions to answer BEFORE reading. Format each as:
**Q:** …
**A:** …

## Mental model
Plain language: why it works. 3–6 sentences. [cite]

## Concepts and definitions
- **Term**: definition [cite]

## Visuals
The most important section for me. List every figure worth drawing, 2–5 per page:
- **What it shows** · type (process diagram / curve sketch / flowchart / cross-section / table-as-picture / plot) [cite the slide or figure it comes from]
  - Elements, labels, arrows, axes (with units), what goes up or down, and what to highlight.
- **Interactive plot** (only if an equation below suits it): which equation, which parameter to slide and over what range. Take the values from the worked example or øving, and cite them.

## Equations
For each equation:
### Name
$$ … $$
| Symbol | Meaning | Unit |
|---|---|---|
| $k$ | rate constant | $\mathrm{s^{-1}}$ |
When valid / assumptions. [cite]

## Worked example
One example taken from the course materials (lecture, øving or exam), fully solved in numbered steps. [cite]

## Faded example
A second example from the course materials, in numbered steps. Mark the steps the student should try themselves with **(try)**. If the materials only have one example, write `> GAP: no second example in files`. [cite]

## Exam traps
- **Trap**: why it catches people. [cite]

## Past exam tasks
- Exam (e.g. H2023) task N: what it asks.

## Test yourself
3–5 questions, same **Q:** / **A:** format as the pretest.

## Sources
- [file, pages/slides used]
````

Last message: an `00-index.md` with this shape:

````markdown
---
subject: CODE
name: Course name
topics:
  - id: topic-id
    title: Topic title
    weight: high            # high | medium | low — how heavily it weighs on exams
    weight_note: "on 5 of 5 exams, usually task 1"
    summary: One line.
    pages:
      - { slug: 01-topic-slug, title: Page title }
past_exams:
  - { id: h2024, label: "Exam autumn 2024", note: "with solutions" }
---

## Topic map
How the topics connect, in plain language, and how the exam weight was judged. [cite]
````
