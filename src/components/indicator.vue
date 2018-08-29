<template>
    <div class="container">
      <span class="caption">{{$props.caption}}</span>
      <span class="detail">
        <svg class="icon" aria-hidden="true"  v-if="$store.state.token != ''">
          <use xlink:href="#icon-baifenbi"></use>
        </svg>
        <span>{{rate}}%</span>
        <svg class="icon" aria-hidden="true"  v-if="$store.state.token != ''">
          <use xlink:href="#icon-zhengque"></use>
        </svg>
        <span class="right">{{$props.right}}</span>
        <svg class="icon" aria-hidden="true"  v-if="$store.state.token != ''">
          <use xlink:href="#icon-cuowu"></use>
        </svg>
        <span class="wrong">{{$props.wrong}}</span>
      </span>
    </div>
</template>

<script>
    import _common from '@/com/common';
    export default {
        name: "indicator",
        computed: {
          rate(){
            return _common.getRate(this.$props.right, this.$props.wrong).toFixed(0);
          }
        },
        props: {
          right: {},
          wrong: {},
          caption: {}
        }
    }
</script>

<style scoped>
  .container{

  }
  .detail {
;
  }
  .caption {
    color: blue;
  }
  .right {
    color: green;
  }
  .wrong {
    color: red;
  }
</style>
