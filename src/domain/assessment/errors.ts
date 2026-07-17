export class AssessmentValidationError extends Error {
  readonly path: string;
  constructor(path: string, message: string) { super(`${path}: ${message}`); this.name = 'AssessmentValidationError'; this.path = path; }
}
export class AssessmentEvaluationError extends Error {
  readonly questionId?: string;
  constructor(message: string, questionId?: string) { super(message); this.name = 'AssessmentEvaluationError'; this.questionId = questionId; }
}
