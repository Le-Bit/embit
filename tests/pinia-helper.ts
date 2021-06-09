import { PiniaStorePlugin, Pinia, createPinia } from "pinia";

const originalActionsPlugin: PiniaStorePlugin = ({ store, options }) => {
  store.originalActions = options.actions!;
};
export function createTestPinia(): Pinia {
  const pinia = createPinia();
  pinia.use(originalActionsPlugin);
  return pinia;
}
