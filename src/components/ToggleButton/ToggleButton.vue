<template>
  <div class="py-1">
    <input 
    id="checkbox" 
    type="checkbox" 
    :checked="checked" 
    @change="onToggle" 
    class="toggle-checkbox" 
  />
    <label class="toggle" for="checkbox">
      <div id="bar1" class="bars"></div>
      <div id="bar2" class="bars"></div>
      <div id="bar3" class="bars"></div>
    </label>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits } from 'vue'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits(['update:modelValue'])

const checked = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const onToggle = () => {
  checked.value = !checked.value
}
</script>

<style scoped>
  .toggle-checkbox {
    display: none;
  }

  .toggle {
    position: relative;
    width: 30px;
    height: 30px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition-duration: .3s;
  }
  
  .bars {
    width: 100%;
    height: 4px;
    background-color: rgb(253, 255, 243);
    border-radius: 5px;
    transition-duration: .3s;
  }
  
  /* #checkbox:checked + .toggle .bars {
    margin-left: 13px;
  } */
  
  #checkbox:checked + .toggle #bar2 {
    transform: translateY(14px) rotate(60deg);
    margin-left: 0;
    transform-origin: right;
    transition-duration: .3s;
    z-index: 2;
  }
  
  #checkbox:checked + .toggle #bar1 {
    transform: translateY(28px) rotate(-60deg);
    transition-duration: .3s;
    transform-origin: left;
    z-index: 1;
  }
  
  #checkbox:checked + .toggle {
    transform: rotate(-90deg);
  }
</style>
