'use client';

import { AssessmentClient } from './AssessmentClient';
import type { AssessmentPageData } from './types';

export function AssessmentRunner({ data, backHref }: { readonly data: AssessmentPageData; readonly backHref: string }) {
  return <AssessmentClient data={data} backHref={backHref} />;
}
