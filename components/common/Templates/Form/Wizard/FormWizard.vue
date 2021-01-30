<template>
  <div>
    <ul :class="`nav nav-tabs ${navClass}`">
      <li
        v-for="(tab, tabIndex) in tabsWithoutTabDone"
        :key="tab.name"
        :class="{
          'nav-item': true,
          'step-doing': tab.isActive,
          'step-done': tab.isDone,
        }"
      >
        <a
          :class="{
            'nav-link': true,
            disabled: topNavDisabled,
          }"
          href="#"
          @click.prevent="clickedTab(tabIndex)"
        >
          <span>{{ tab.name }}</span>
          <small>{{ tab.desc }}</small>
        </a>
      </li>
    </ul>
    <slot></slot>
    <div
      v-if="!(lastStepEnd && isCompleted)"
      :class="`wizard-buttons ${navClass}`"
    >
      <button
        type="button"
        class="mr-1 btn btn-primary"
        :disabled="!currentActive > 0"
        @click="previousTab()"
      >
        Prev
      </button>
      <button
        type="button"
        class="btn btn-primary"
        :disabled="currentActive > totalTabs - 1"
        @click="nextTab()"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    navClass: {
      default: 'justify-content-center',
    },
    lastStepEnd: {
      default: false,
    },
    topNavDisabled: {
      default: false,
    },
    withValidate: {
      default: false,
    },
    done: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      tabs: [],
      currentActive: 0,
      totalTabs: 0,
      isCompleted: false,
    }
  },
  computed: {
    tabsWithoutTabDone() {
      return this.tabs.filter((item) => item.type !== 'done')
    },
  },
  created() {
    this.tabs = this.$children
  },
  mounted() {
    this.totalTabs = this.tabs.filter((x) => x.type !== 'done').length
  },
  methods: {
    tabStatusFix() {
      this.tabs.forEach((tab, tabIndex) => {
        let isDone = tab.isDone
        if (!isDone) {
          isDone = this.currentActive > tabIndex
        }
        tab.isDone = isDone
        tab.isActive = false
      })
    },
    clickedTab(tabIndex) {
      if (!this.topNavDisabled) {
        if (!(this.lastStepEnd && this.isCompleted)) {
          this.currentActive = tabIndex
          this.tabStatusFix()
          this.tabs[this.currentActive].isActive = true
        }
      }
    },
    previousTab() {
      this.currentActive--
      this.tabStatusFix()
      this.tabs[this.currentActive].isActive = true
    },

    async nextTab() {
      let valid = true
      if (this.withValidate) {
        valid = await this.tabs[this.currentActive].validate()
        if (valid) this.tabs[this.currentActive].submit()
      }

      if (valid) {
        this.currentActive++
        this.tabStatusFix()
        if (this.currentActive >= this.totalTabs) {
          this.isCompleted = true
          const doneTab = this.tabs.find((x) => x.type === 'done')
          if (doneTab) {
            doneTab.isActive = true
          } else this.tabs[this.currentActive - 1].isActive = true
          this.done()
        } else this.tabs[this.currentActive].isActive = true
      }
    },
  },
}
</script>
