import { shallowMount, flushPromises } from "@vue/test-utils";
import Login from "../../src/views/Login.vue";
import { createTestPinia } from "../pinia-helper";

describe("Login.vue", () => {
  it("renders props.msg when passed", async () => {
    const pinia = createTestPinia();
    const email = "t@l.c";
    const password = "manage2020";
    const mockLogin = jest
      .spyOn(Login.methods as any, "signInAction")
      .mockImplementation(() => true);
    const wrapper = shallowMount(Login, { global: { plugins: [pinia] } });
    const emailInput = wrapper.find("input[type=email]");
    const passwordInput = wrapper.find("input[type=password]");

    await emailInput.setValue(email);
    await passwordInput.setValue(password);
    await wrapper.find("button").trigger("click");
    await flushPromises();
    expect(mockLogin).toHaveBeenCalled();
    expect(mockLogin).toHaveBeenCalledWith(email, password);
  });
});
