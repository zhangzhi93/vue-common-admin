import Vue from 'vue';

function addWaterMarker(parentNode, title, describe, font, textColor) { // parentNode：要插入的元素， title:标题，describe：描述，font：字体，textColor：字体颜色
  const img = document.createElement('canvas');
  parentNode.appendChild(img);
  img.width = 240;
  img.height = 150;
  img.style.display = 'none';
  const imgs = img.getContext('2d'); // 获取canvas画布
  imgs.rotate(-20 * Math.PI / 180); // 逆时针旋转π/9
  imgs.font = font || '16px Microsoft YaHei';
  imgs.fillStyle = textColor || 'rgba(200, 200, 200, 0.35)';
  imgs.textAlign = 'left';
  imgs.textBaseline = 'Middle';
  imgs.fillText(title, 15, 80); // 第一行字体
  describe && imgs.fillText(describe, 15, 100); // 第二行字体

  parentNode.style.position = 'relative';

  const div = document.createElement('div');
  div.style.position = 'absolute';
  div.style.zIndex = '9';
  div.style.top = '0px';
  div.style.left = '0px';
  div.style.width = '100%';
  div.style.height = '100%';
  div.style.left = '0px';
  div.style.pointerEvents = 'none';
  div.style.backgroundImage = 'url(' + img.toDataURL('image/png') + ')';
  parentNode.appendChild(div);
}

export default () => {
  Vue.directive('watermark', {
    bind(el, binding) {
      addWaterMarker(el, binding.value.title, binding.value.describe, binding.value.font, binding.value.textColor);
    }
  });
};
