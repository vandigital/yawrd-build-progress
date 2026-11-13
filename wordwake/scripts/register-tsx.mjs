// Public test harness: explicit .ts/.tsx imports; no application-specific resolution.
import { registerHooks } from 'node:module';
import { readFileSync } from 'node:fs';
import { transpileModule, JsxEmit, ModuleKind, ScriptTarget } from 'typescript';

registerHooks({
  load(address, context, fallback) {
    const pathname = new URL(address).pathname;
    if (!pathname.endsWith('.ts') && !pathname.endsWith('.tsx')) return fallback(address, context);
    const compiled = transpileModule(readFileSync(new URL(address), 'utf8'), {
      compilerOptions: { target: ScriptTarget.ES2022, module: ModuleKind.ESNext, jsx: JsxEmit.ReactJSX },
      fileName: pathname,
    });
    return { source: compiled.outputText, format: 'module', shortCircuit: true };
  },
});
