import { shallowMount, flushPromises } from "@vue/test-utils";
import Register from "../../src/views/Register.vue";
import { createTestPinia } from "../pinia-helper";

describe("Register.vue", () => {
  it("renders props.msg when passed", async () => {
    const pinia = createTestPinia();
    const email = "t@l.c";
    const password = "manage2020";
    const name = "name";
    const inviteCode = "invite";

    const mockRegister = jest
      .spyOn(Register.methods as any, "signUpAction")
      .mockImplementation(() => true);
    const wrapper = shallowMount(Register, { global: { plugins: [pinia] } });

    const emailInput = wrapper.find("#email");
    const nameInput = wrapper.find("#name");
    const passwordInput = wrapper.find("#password");
    const inviteInput = wrapper.find("#invite");

    await emailInput.setValue(email);
    await passwordInput.setValue(password);
    await inviteInput.setValue(inviteCode);
    await nameInput.setValue(name);

    wrapper.find("button").trigger("click");

    await flushPromises();
    expect(mockRegister).toHaveBeenCalled();
    expect(mockRegister).toHaveBeenCalledWith(
      name,
      email,
      password,
      inviteCode
    );
  });
});
