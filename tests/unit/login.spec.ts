import { shallowMount, flushPromises } from "@vue/test-utils";
import Login from "@/views/Login.vue";
import { store } from "@/store";

describe("Login.vue", () => {
  it("renders props.msg when passed", async () => {
    const email = "t@l.c";
    const password = "manage2020";
    const mockLogin = jest
      .spyOn(Login.methods as any, "login")
      .mockImplementation(() => true);
    jest
      .spyOn(Login.methods as any, "authAction")
      .mockImplementation(() => true);
    const wrapper = shallowMount(Login, {
      global: {
        plugins: [store],
      },
    });
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
