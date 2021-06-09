import "pinia";

declare module "pinia" {
  export interface PiniaCustomProperties<Id, S, G, A> {
    originalActions: A;
  }
}
