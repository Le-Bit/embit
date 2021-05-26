import { mount, flushPromises } from "@vue/test-utils";
import Invites from "@/views/Invites.vue";
import { nextTick } from "vue";

describe("Invites.vue", () => {
  it("renders props.msg when passed", async () => {
    const mockInvites = jest.spyOn(Invites.methods as any, "generate");
    const wrapper = mount(Invites);

    await wrapper.find("button").trigger("click");
    await flushPromises();
    await nextTick();
    expect(mockInvites).toHaveBeenCalled();
  });
});
