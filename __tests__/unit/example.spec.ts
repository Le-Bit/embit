import { shallowMount } from "@vue/test-utils";
import Home from "@/views/Home.vue";

describe("Home.vue", () => {
  it("mount a home component", () => {
    const wrapper = shallowMount(Home);
    expect(wrapper.text()).toMatch("home works well 21");
  });
});
