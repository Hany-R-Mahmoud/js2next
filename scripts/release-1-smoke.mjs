const baseUrl = process.env.RELEASE_1_BASE_URL ?? 'http://localhost:3000';

const routes = [
  ['/', '/', 'JS2Next'],
  ['/tracks', '/tracks', 'Choose your track'],
  ['/tracks/javascript', '/tracks/javascript', 'JavaScript'],
  ['/learn/javascript/orientation-and-foundations', '/learn/javascript/orientation-and-foundations', 'Orientation and Foundations'],
  ['/learn/javascript/orientation-and-foundations/course-orientation', '/learn/javascript/orientation-and-foundations/course-orientation', 'Course Orientation'],
  ['/learn/javascript/orientation-and-foundations/course-orientation/quiz', '/learn/javascript/orientation-and-foundations/course-orientation/quiz', 'Submit answers'],
  ['/assessments/module/JS-M01', '/assessments/module/JS-M01', 'Module Review'],
  ['/assessments/cumulative/javascript', '/assessments/cumulative/javascript', 'Cumulative Review'],
  ['/review', '/review', 'JS2Next'],
  ['/progress', '/progress', 'JS2Next'],
  ['/preview/content/JS-01', '/preview/content/JS-01', 'JS2Next'],
];

const failures = [];

async function fetchReady(url) {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    try {
      return await fetch(url);
    } catch (error) {
      if (attempt === 19) throw error;
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
  }
}

for (const [requestedPath, expectedPath, marker] of routes) {
  const response = await fetchReady(`${baseUrl}${requestedPath}`);
  const body = await response.text();
  const finalUrl = new URL(response.url).pathname;

  if (!response.ok) failures.push(`${requestedPath}: HTTP ${response.status}`);
  if (finalUrl !== expectedPath) failures.push(`${requestedPath}: ended at ${finalUrl}, expected ${expectedPath}`);
  if (!body.includes(marker)) failures.push(`${requestedPath}: missing marker ${JSON.stringify(marker)}`);
}

if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Release 1 smoke passed: ${routes.length} critical routes`);
}
