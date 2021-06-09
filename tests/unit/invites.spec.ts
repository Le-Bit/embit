import { shallowMount, flushPromises } from "@vue/test-utils";
import Invites from "@/views/Invites.vue";
import { nextTick } from "vue";
import { createTestPinia } from "../pinia-helper";

describe("Invites.vue", () => {
  it("renders props.msg when passed", async () => {
    const pinia = createTestPinia();
    const mockInvites = jest
      .spyOn(Invites.methods as any, "generateInvite")
      .mockImplementation(() => true);
    jest
      .spyOn(Invites.methods as any, "initInvites")
      .mockImplementation(() => true);
    const wrapper = shallowMount(Invites, { global: { plugins: [pinia] } });
    await wrapper.find("button").trigger("click");
    await flushPromises();
    await nextTick();
    expect(mockInvites).toHaveBeenCalled();
  });
});
