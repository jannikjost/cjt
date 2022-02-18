<template>
  <article class="card">
    <p class="card__main">
      <slot></slot>
    </p>
    <footer class="card__footer">
      <slot name="footer"></slot>
    </footer>
  </article>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.card {
  border-radius: 4px;
  border: 1px solid #e4e7ed;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 14px;
  height: 100%;
  max-height: 494px;
  overflow: hidden;
}
.card__main {
  flex-grow: 1;
  overflow-y: auto;
}
</style>
