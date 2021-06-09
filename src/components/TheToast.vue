<template>
  <transition name="toast">
    <div v-if="showError" class="toast-wrapper">
      <div class="toast-elem" @click="hideError()">{{ getLastError }}</div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useToastStore } from "../store/toast";
import { mapActions, mapState } from "pinia";

export default defineComponent({
  name: "TheToast",
  computed: {
    ...mapState(useToastStore, ["showError", "getLastError"]),
  },
  methods: {
    ...mapActions(useToastStore, ["setError", "hideError"]),
  },
});
</script>

<style scoped lang="scss">
.toast-wrapper {
  position: fixed;
  width: max-content;
  bottom: 60px;
  right: 5%;
}

.toast-elem {
  cursor: pointer;
  padding: 0.5em;
  border-radius: 10px;
  background-color: hsl(120, 62%, 73%);
  color: hsl(0, 62%, 10%);
}
.toast-enter-active {
  animation: wobble 0.5s ease;
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(60px);
}
.toast-leave-active {
  transition: all 0.3s ease;
}
@keyframes toasting {
  0% {
    transform: translateY(100px);
    opacity: 0;
  }
  50% {
    transform: translateY(0px);
    opacity: 1;
  }
}
@keyframes wobble {
  0% {
    transform: translateY(100px);
    opacity: 0;
  }
  50% {
    transform: translateY(0px);
    opacity: 1;
  }
  60% {
    transform: translateX(8px);
    opacity: 1;
  }
  70% {
    transform: translateX(-8px);
    opacity: 1;
  }
  80% {
    transform: translateX(4px);
    opacity: 1;
  }
  90% {
    transform: translateX(-4px);
    opacity: 1;
  }
  100% {
    transform: translateX(0px);
    opacity: 1;
  }
}
</style>
