# Content Authoring Specification

## Canonical packet

Each topic has:

- one Markdown authoring packet;
- one normalized JSON packet;
- a stable topic ID;
- a version number;
- track/module placement;
- required, optional, advanced, and content-type flags;
- required and recommended prerequisites;
- measurable learning objectives;
- why-it-matters and mental-model sections;
- concept sections and optional worked code example;
- common mistakes and summary;
- three in-lesson checks;
- a five-question topic quiz;
- research and verification metadata;
- publication and review status.

The JSON packet is normative for runtime. Markdown is normative for authoring. A compiler must prove they represent the same content revision.

## Originality policy

- Explain concepts independently.
- Do not paraphrase transcript passages line by line.
- Create original code examples and scenarios.
- Do not recreate distinctive source-course projects.
- Project material may inspire general case studies only.
- Legacy project text is never copied into a packet.
- Transcript metadata may be recorded internally for coverage traceability.

## Technical verification

Before human approval:

- JavaScript/browser claims: verify against current MDN or standards material.
- React claims: verify against official React documentation.
- Next.js claims: verify against official App Router documentation.
- Library-specific claims: verify against that library's official documentation.
- Record version-sensitive notes and review dates.

## IDs and versions

- Topic IDs are stable and never recycled.
- A semantic content change increments `version`.
- Small typography-only corrections may retain the version if the publication workflow records the edit.
- Retired content remains addressable for historical progress exports.
- Slugs may change; IDs are the durable key.

## Illustrative code

Code examples are display-only in Release 1. They must still be syntactically plausible and pedagogically scoped. Placeholder services such as `db` must be labeled illustrative in the lesson.
