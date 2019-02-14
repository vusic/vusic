import { VueConstructor, CreateElement } from 'vue';
import { Drag, Drop } from 'vue-drag-drop';
import { Prop, Component, Vue } from 'vue-property-decorator';
import { createHOC } from '@/modules/utils';

let dragging: string | null = null;

export const accepting = (component: VueConstructor) => {
  @Component
  class Accepting extends Vue {
    @Prop({ type: String, required: true }) public group!: string;

    public drop(data: any, e: MouseEvent) {
      if (this.group === dragging) {
        this.$emit('drop', data, e);
      }
    }

    public handleDragover(_: any, e: DragEvent) {
      if (this.group !== dragging && e.dataTransfer) {
        e.dataTransfer.dropEffect = 'none';
      }
    }

    public render(createElement: CreateElement) {
      return createHOC(component, createElement, this, {
        on: {
          drop: this.drop,
          dragover: this.handleDragover,
        },
      });
    }
  }

  return Accepting;
};

export const giving = (component: VueConstructor) => {
  @Component
  class Giving extends Vue {
    @Prop({ type: String, required: true }) public group!: string;

    public dragstart() {
      this.$log.debug('dragstart', this.group);
      dragging = this.group;
    }

    public dragend() {
      dragging = null;
    }

    public render(createElement: CreateElement) {
      return createHOC(component, createElement, this, {
        on: {
          dragstart: this.dragstart,
          dragend: this.dragend,
        },
      });
    }
  }

  return Giving;
};

export default {
  install() {
    Vue.component('drag', giving(Drag));
    Vue.component('drop', accepting(Drop));
  },
};
