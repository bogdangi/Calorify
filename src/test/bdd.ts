import { describe, it } from 'vitest';

export type StepAction = () => void | Promise<void>;

export interface ScenarioContext {
  given: (description: string, fn: StepAction) => Promise<void>;
  when: (description: string, fn: StepAction) => Promise<void>;
  then: (description: string, fn: StepAction) => Promise<void>;
  and: (description: string, fn: StepAction) => Promise<void>;
  but: (description: string, fn: StepAction) => Promise<void>;
}

async function executeStep(keyword: string, description: string, fn: StepAction) {
  try {
    await fn();
  } catch (error: any) {
    const originalMessage = error?.message || String(error);
    error.message = `[${keyword.toUpperCase()}] ${description}\n\n${originalMessage}`;
    throw error;
  }
}

function createScenarioContext(): ScenarioContext {
  return {
    given: (desc, fn) => executeStep('Given', desc, fn),
    when: (desc, fn) => executeStep('When', desc, fn),
    then: (desc, fn) => executeStep('Then', desc, fn),
    and: (desc, fn) => executeStep('And', desc, fn),
    but: (desc, fn) => executeStep('But', desc, fn),
  };
}

export function feature(name: string, suiteFn: () => void) {
  describe(`Feature: ${name}`, suiteFn);
}

export interface ScenarioFunction {
  (name: string, testFn: (ctx: ScenarioContext) => Promise<void> | void): void;
  skip: (name: string, testFn: (ctx: ScenarioContext) => Promise<void> | void) => void;
  only: (name: string, testFn: (ctx: ScenarioContext) => Promise<void> | void) => void;
  outline: <T extends Record<string, any>>(
    name: string,
    examples: T[],
    testFn: (ctx: ScenarioContext, example: T) => Promise<void> | void
  ) => void;
}

export const scenario: ScenarioFunction = Object.assign(
  function (name: string, testFn: (ctx: ScenarioContext) => Promise<void> | void) {
    it(`Scenario: ${name}`, async () => {
      const ctx = createScenarioContext();
      await testFn(ctx);
    });
  },
  {
    skip: (name: string, testFn: (ctx: ScenarioContext) => Promise<void> | void) => {
      it.skip(`Scenario: ${name}`, async () => {
        const ctx = createScenarioContext();
        await testFn(ctx);
      });
    },
    only: (name: string, testFn: (ctx: ScenarioContext) => Promise<void> | void) => {
      it.only(`Scenario: ${name}`, async () => {
        const ctx = createScenarioContext();
        await testFn(ctx);
      });
    },
    outline: <T extends Record<string, any>>(
      name: string,
      examples: T[],
      testFn: (ctx: ScenarioContext, example: T) => Promise<void> | void
    ) => {
      for (const example of examples) {
        const title = `${name} | ${Object.entries(example)
          .map(([k, v]) => `${k}=${v}`)
          .join(', ')}`;
        it(`Scenario Outline: ${title}`, async () => {
          const ctx = createScenarioContext();
          await testFn(ctx, example);
        });
      }
    },
  }
);

