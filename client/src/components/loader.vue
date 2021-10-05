<template>
  <div class="loadingio-spinner-ripple">
    <div class="spinner-ripple">
      <div /><div />
    </div>
  </div>
</template>

<style scoped>
@keyframes spinner-ripple {
  0% {
    top: 96px;
    left: 96px;
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    top: 38px;
    left: 38px;
    width: 116px;
    height: 116px;
    opacity: 0;
  }
}
.spinner-ripple div {
  position: absolute;
  border-width: 4px;
  border-style: solid;
  opacity: 1;
  border-radius: 50%;
  animation: spinner-ripple 1s cubic-bezier(0,0.2,0.8,1) infinite;
}
.spinner-ripple div:nth-child(1) {
  border-color: #c952ff;
  animation-delay: 0s;
}
.spinner-ripple div:nth-child(2) {
  border-color: #46dff0;
  animation-delay: -0.5s;
}
.loadingio-spinner-ripple {
  width: 200px;
  height: 200px;
  display: inline-block;
  overflow: hidden;
  background: none;
}
.spinner-ripple {
  width: 100%;
  height: 100%;
  position: relative;
  transform: translateZ(0) scale(1);
  backface-visibility: hidden;
  transform-origin: 0 0;
}
.spinner-ripple div {
  box-sizing: content-box;
}
</style>
