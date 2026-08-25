import { isValidElement, type ReactElement } from "react";
import { describe, expect, it } from "vitest";

import RootLayout from "./layout";

describe("RootLayout", () => {
  it("tolera apenas no elemento raiz atributos inseridos por extensões antes da hidratação", () => {
    const layout = RootLayout({ children: <main>Campus</main> });

    expect(isValidElement(layout)).toBe(true);
    expect((layout as ReactElement<{ suppressHydrationWarning?: boolean }>).props.suppressHydrationWarning).toBe(true);
  });
});
