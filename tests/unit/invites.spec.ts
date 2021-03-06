import { mount, flushPromises } from "@vue/test-utils";
import Invites from "@/views/Invites.vue";
import { nextTick } from "vue";
import { store } from "@/store";

describe("Invites.vue", () => {
  it("renders props.msg when passed", async () => {
    const mockInvites = jest
      .spyOn(Invites.methods as any, "generate")
      .mockImplementation(() => true);
    jest
      .spyOn(Invites.methods as any, "initInvites")
      .mockImplementation(() => true);
    const wrapper = mount(Invites, {
      global: {
        plugins: [store],
      },
    });
    await wrapper.find("button").trigger("click");
    await flushPromises();
    await nextTick();
    expect(mockInvites).toHaveBeenCalled();
  });
});
