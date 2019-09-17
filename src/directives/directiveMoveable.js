import Vue from 'vue';

function savePositionToLocalStorage(name, obj) {
  const originObj = window.localStorage.getItem(name) ? JSON.parse(window.localStorage.getItem(name)) : {};
  const targetObj = Object.assign(originObj, obj);
  window.localStorage.setItem(name, JSON.stringify(targetObj));
}


Vue.directive('moveable', {
  bind(el, binding) {
    const op = el; // 当前元素
    op.onmousedown = function (e) {
      el.classList.add('move-bg');
      const Width = binding.value === 'document' ? document.documentElement.clientWidth : op.parentNode.offsetWidth;
      const Height = binding.value === 'document' ? document.documentElement.clientHeight : op.parentNode.offsetHeight;
      // 鼠标按下，计算当前元素距离可视区的距离
      const disX = e.clientX - op.offsetLeft;
      const disY = e.clientY - op.offsetTop;
      document.onmousemove = function (moveEvent) {
        let l = moveEvent.clientX - disX;
        let t = moveEvent.clientY - disY;
        // 防止被拖出边界
        if (l <= 0) {
          l = 0;
        } else if (l >= Width - op.offsetWidth) {
          // document.documentElement.clientWidth 屏幕的可视宽度
          l = Width - op.offsetWidth;
        }
        if (t <= 0) {
          t = 0;
        } else if (t >= Height - op.offsetHeight) {
          // document.documentElement.clientHeight 屏幕的可视高度
          t = Height - op.offsetHeight;
        }
        // 移动当前元素
        op.style.left = `${l}px`;
        op.style.top = `${t}px`;
      };
      document.onmouseup = function (upEvent) {
        el.classList.remove('move-bg');
        document.onmousemove = null;
        document.onmouseup = null;
        // savePositionToLocalStorage(el.classList[2], { left: op.style.left, top: op.style.top });
      };
    };
  },
});

Vue.directive('resize', {
  bind(el, binding) {
    const op = el; // 当前元素
    op.onmousedown = function (e) {
      e.stopPropagation();
      // 鼠标按下，计算当前元素距离可视区的距离
      const startX = e.clientX;
      const startY = e.clientY;
      const domWidth = op.parentNode.clientWidth;
      const domHeight = op.parentNode.clientHeight;
      document.onmousemove = function (moveEvent) {
        e.stopPropagation();
        const l = e.clientX - startX;
        const t = e.clientY - startY;
        op.parentNode.style.width = `${domWidth + l}px`;
        op.parentNode.style.height = `${domHeight + t}px`;
      };
      document.onmouseup = function (upEvent) {
        e.stopPropagation();
        document.onmousemove = null;
        document.onmouseup = null;
        // savePositionToLocalStorage(binding.value, { width: op.parentNode.style.width, height: op.parentNode.style.height });
      };
    };
  },
});
