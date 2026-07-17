export type JsonPrimitive = string | number | boolean | null;
export interface JsonObject {
  readonly [key: string]: JsonValue;
}
export type JsonValue = JsonPrimitive | JsonObject | readonly JsonValue[];

export type ContentMode = 'preview' | 'production';

export interface ContentDiagnostic {
  readonly path: string;
  readonly message: string;
}

export interface ValidationResult {
  readonly ok: boolean;
  readonly diagnostics: readonly ContentDiagnostic[];
}

export interface ParsedMarkdownPacket {
  readonly frontmatter: Readonly<Record<string, string | number | boolean | readonly string[]>>;
  readonly body: string;
}

export interface CompiledContent {
  readonly normalizedPackets: readonly JsonObject[];
  readonly diagnostics: readonly ContentDiagnostic[];
}

export interface ManifestEntry {
  readonly id: string;
  readonly path: string;
  readonly version: number;
  readonly status: string;
  readonly reviewStatus: string;
}

export class ContentBoundaryError extends Error {
  readonly diagnostics: readonly ContentDiagnostic[];

  constructor(diagnostics: readonly ContentDiagnostic[]) {
    super(diagnostics.map((diagnostic) => `${diagnostic.path}: ${diagnostic.message}`).join('\n'));
    this.name = 'ContentBoundaryError';
    this.diagnostics = diagnostics;
  }
}
