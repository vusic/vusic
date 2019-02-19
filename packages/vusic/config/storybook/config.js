import { configure } from '@storybook/vue';
import storybook from '../../src/storybook';

storybook();

function loadStories() {
  // require('../../src/stories');
  require('../../src/modules/sequencer/sequencer.stories');
  require('../../src/modules/dawg/dawg.stories');
}

configure(loadStories, module);