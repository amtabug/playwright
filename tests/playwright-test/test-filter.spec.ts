/**
 * Copyright Microsoft Corporation. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { test, expect } from './playwright-test-fixtures';

test('config.testTitlePredicate should work', async ({ runInlineTest }) => {
  const result = await runInlineTest({
    'playwright.config.ts': `
      module.exports = { testTitlePredicate: (title: string) => title.includes("test2") };
    `,
    'a.test.ts': `
      import { test, expect } from '@playwright/test';
      test('test1', async () => { console.log('\\n%% test1'); });
      test('test2', async () => { console.log('\\n%% test2'); });
    `,
  });
  expect(result.exitCode).toBe(0);
  expect(result.passed).toBe(1);
  expect(result.output).toContain('%% test2');
});

test('project.testTitlePredicate should work', async ({ runInlineTest }) => {
  const result = await runInlineTest({
    'playwright.config.ts': `
      module.exports = { projects: [ { testTitlePredicate: (title: string) => title.includes("test2") } ] };
    `,
    'a.test.ts': `
      import { test, expect } from '@playwright/test';
      test('test1', async () => { console.log('\\n%% test1'); });
      test('test2', async () => { console.log('\\n%% test2'); });
    `,
  });
  expect(result.exitCode).toBe(0);
  expect(result.passed).toBe(1);
  expect(result.output).toContain('%% test2');
});

test('config.testTitlePredicate should override grep and grepInvert config', async ({ runInlineTest }) => {
  const result = await runInlineTest({
    'playwright.config.ts': `
      module.exports = { grep: /test./, grepInvert: /test2/, testTitlePredicate: (title: string) => title.includes("5") };
    `,
    'a.test.ts': `
      import { test, expect } from '@playwright/test';
      test('test1', async () => { console.log('\\n%% test1'); });
      test('test2', async () => { console.log('\\n%% test2'); });
      test('test3', async () => { console.log('\\n%% test3'); });
      test('test4', async () => { console.log('\\n%% test4'); });
      test('test5', async () => { console.log('\\n%% test5'); });
      test('another5', async () => { console.log('\\n%% another5'); });
    `,
  });
  expect(result.exitCode).toBe(0);
  expect(result.passed).toBe(2);
  expect(result.output).toContain('%% test5');
  expect(result.output).toContain('%% another5');
});
