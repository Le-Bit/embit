import { shallowMount, flushPromises } from "@vue/test-utils";
import Register from "@/views/Register.vue";

describe("Register.vue", () => {
  it("renders props.msg when passed", async () => {
    const email = "t@l.c";
    const password = "manage2020";
    const name = "name";
    const inviteCode = "invite";

    const mockRegister = jest.spyOn(Register.methods as any, "register");
    const wrapper = shallowMount(Register);

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
    expect(mockRegister).toReturnWith("ddd");
  });
});
