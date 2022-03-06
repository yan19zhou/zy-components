<template>
  <div class="loading__x">
    <div class="main">
      <L1 />
      <L2 />
      <L3 />
      <L4 />
      <L5 />
      <L6 />
      <L7 />
      <L8 />
      <L9 />
      <L10 />
      <L11 />
      <L12 />
      <L13 />
      <L14 />
      <L15 />
      <L16 />
      <L17 />
      <L18 />
      <L19 />
      <L20 />
      <L21 />
      <L22 />
      <L23 />
      <L24 />
      <L25 />
      <L26 />
      <L27 />
      <L28 />
      <L29 />
      <L30 />
      <L31 />
      <L32 />
      <L33 />
      <L34 />
      <L35 />
      <L36 />
      <L37 />
      <L38 />
      <L39 />
      <L40 />
      <L41 />
      <L42 />
      <L43 />
      <L44 />
      <L45 />
      <L46 />
      <L47 />
      <L48 />
      <L49 />
      <L50 />
      <L51 />
      <L52 />
      <L53 />
      <L54 />
      <L55 />
      <L56 />
      <L57 />
      <L58 />
      <L59 />
      <L60 />
      <L61 />
      <L62 />
      <L63 />
      <L64 />
      <L65 />
      <L66 />
      <L67 />
      <L68 />
      <L69 />
      <L70 />
      <L71 />
      <L72 />
      <L73 />
      <L74 />
      <L75 />
      <L76 />
      <L77 />
      <L78 />
      <L79 />
      <L80 />
      <L81 />
      <L82 />
      <L83 />
      <L84 />
      <L85 />
      <L86 />
      <L87 />
      <L88 />
      <L89 />
      <L90 />
      <L91 />
      <L92 />
      <L93 />
      <L94 />
      <L95 />
      <L96 />
      <L97 />
      <L98 />
      <L99 />
      <L100 />
      <L101 />
      <L102 />
      <L103 />
      <L104 />
      <L105 />
      <L106 />
      <L107 />
      <L108 />
      <L109 />
      <L110 />
      <L111 />
      <L112 />
      <L113 />
      <L114 />
      <L115 />
      <L116 />
      <L117 />
    </div>
  </div>
</template>

<!-- 下面的代码都是组件引入和布局相关，和Loading无关的 -->

<script>
const requireAll = require.context("./components", false, /\.vue$/i);
let components = {};
requireAll.keys().forEach((key) => {
  components[key.replace(/(\.\/|\.vue)/g, "")] = requireAll(key).default;
});
export default {
  components,
};
</script>

<style lang="scss" scoped>
.loading__x > .explain {
  display: flex;
  align-items: flex-start;
  flex-direction: column;

  a {
    margin-bottom: 10px;
    text-decoration: none;
    color: #1e80ff;
    font-weight: 600;

    &:hover {
      color: #f6416c;
    }
  }
}

.main {
  display: grid;
  grid-template-columns: repeat(auto-fill, 200px);
  div {
    margin-top: 10px;
    margin-bottom: 10px;
  }
}
/deep/ .com__box {
  width: 160px;
  height: 160px;
  border: 1px solid #ccc;
  margin: 10px;
  padding: 10px;
  box-sizing: border-box;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  .loading {
    margin-top: 15px;
  }

  h4.explain {
    margin-top: 20px;
    margin-bottom: 0;
    font-size: 14px;
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
