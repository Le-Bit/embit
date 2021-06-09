import { Pinia, createPinia } from "pinia";

export function createTestPinia(): Pinia {
  const pinia = createPinia();
  return pinia;
}
