import { createPinia } from 'pinia';

import { useAppStore } from './modules/app';
import { useLayoutStore } from './modules/layout';
import { usePermissionStore } from './modules/permission';

const pinia = createPinia();

export { useAppStore, useLayoutStore, usePermissionStore };

export default pinia;
