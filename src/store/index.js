import { createPinia } from 'pinia';

import { useAppStore } from './modules/app';
import { useLayoutStore } from './modules/layout';


const pinia = createPinia();

export { useAppStore, useLayoutStore };

export default pinia;
