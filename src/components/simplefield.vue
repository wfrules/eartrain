<template>
    <div><span class="caption">{{caption}}</span><span>{{val}}</span></div>
</template>

<script>
    export default {
        name: "simplefield",
        props: {
          val: {},
          caption: {}
        }
    }
</script>

<style scoped>
  .caption {
    color: blue;
  }
</style>
