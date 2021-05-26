import { shallowMount, flushPromises } from "@vue/test-utils";
import Login from "@/views/Login.vue";

describe("Login.vue", () => {
  it("renders props.msg when passed", async () => {
    const email = "t@l.c";
    const password = "manage2020";
    const mockLogin = jest.spyOn(Login.methods as any, "login");
    const wrapper = shallowMount(Login);
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
