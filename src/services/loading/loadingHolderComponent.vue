<template>
  <div class="LoadingHolder" v-show="$store.getters.loadingShown">
    <div class="loading-holder-inner">
      <div class="loading-holder-image" />
      <template v-if="$store.getters.loadingMark !== null">
        <div class="loading-holder-mark">{{ $store.getters.loadingMark }}</div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoadingHolder'
}
</script>

<style lang="scss">
.LoadingHolder {
  background-color: transparent;
  position: fixed;
  z-index: 10;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
  }
}
.loading-holder-inner {
  padding: 30px;
  background-color: rgba(0, 0, 0, .5);
  border-radius: 10px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
}
.loading-holder-image {
  width: 100px;
  height: 100px;
  margin-left: auto;
  margin-right: auto;
  background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Zz48ZyBzdHJva2Utd2lkdGg9IjAiIGZpbGw9IiNmZmYiPjxwYXRoIGQ9Ik03Mi4zOTMgODIuMjc4YTMuMjI4IDMuMjI4IDAgMTEtNC40NDktMS4xODQgMy4yNzUgMy4yNzUgMCAwMTQuNDUgMS4xODRoLS4wMDF6IiBvcGFjaXR5PSIuMSIvPjxwYXRoIGQ9Ik01My4yNzcgODkuMTg2YTMuMjY3IDMuMjY3IDAgMDEtNi41MzMgMHYtMi4yNzRhMy4yNjcgMy4yNjcgMCAwMTYuNTMzIDB2Mi4yNzR6bS0yMC4wMi0zLjY2MWEzLjI2IDMuMjYgMCAwMS01LjY1NC0zLjI0N2wyLjQxMy00LjIyMmEzLjMzNCAzLjMzNCAwIDAxNC41LTEuMiAzLjI1NSAzLjI1NSAwIDAxMS4xNTkgNC40NWwtMi40MTggNC4yMTl6IiBvcGFjaXR5PSIuMiIvPjxwYXRoIGQ9Ik0xNy43MjggNzIuNDA4YTMuMjcxIDMuMjcxIDAgMDEtMy4yOTItNS42NTRsNi40ODktMy43NTdhMy4yNjIgMy4yNjIgMCAwMTMuMjQ4IDUuNjU5bC02LjQ0NSAzLjc1MnoiIG9wYWNpdHk9Ii4zIi8+PHBhdGggZD0iTTEwLjgyNSA1My4yNDJhMy4yNTUgMy4yNTUgMCAxMTAtNi41MWgxMC4xMDZhMy4yNTUgMy4yNTUgMCAxMTAgNi41MUgxMC44MjV6IiBvcGFjaXR5PSIuNCIvPjxwYXRoIGQ9Ik0xNC40NDIgMzMuMTk3YTMuMTcyIDMuMTcyIDAgMDEtMS4xNTktNC40MjkgMy4yMyAzLjIzIDAgMDE0LjQ1LTEuMmwxMC45NzggNi4zNzRhMy4yNCAzLjI0IDAgMDEtMy4yNDEgNS42MWwtMTEuMDI4LTYuMzU1eiIgb3BhY2l0eT0iLjUiLz48cGF0aCBkPSJNMjcuNjA0IDE3LjY3NGw3LjY0NyAxMy4yNzZhMy4yNzIgMy4yNzIgMCAwMDQuNDcgMS4xODQgMy4yMzcgMy4yMzcgMCAwMDEuMTU5LTQuNDVsLTcuNjczLTEzLjI1NmEzLjIzNyAzLjIzNyAwIDEwLTUuNiAzLjI0MmwtLjAwMy4wMDR6IiBvcGFjaXR5PSIuNiIvPjxwYXRoIGQ9Ik00Ni43NDUgMTAuODE2YTMuMjY2IDMuMjY2IDAgMTE2LjUzMiAwVjI2LjExYTMuMyAzLjMgMCAwMS0zLjI5MiAzLjI5MiAzLjI1NyAzLjI1NyAwIDAxLTMuMjQxLTMuMjkybC4wMDEtMTUuMjk0eiIgb3BhY2l0eT0iLjciLz48cGF0aCBkPSJNNjYuNzY0IDE0LjQzMWEzLjI2OSAzLjI2OSAwIDAxNC40NS0xLjIgMy4yMTQgMy4yMTQgMCAwMTEuMiA0LjQ1bC03LjY2NiAxMy4yNzZhMy4yNjggMy4yNjggMCAwMS00LjQ1IDEuMiAzLjMxNSAzLjMxNSAwIDAxLTEuMTg0LTQuNDc2bDcuNjUtMTMuMjV6IiBvcGFjaXR5PSIuOCIvPjxwYXRoIGQ9Ik04Mi4zMzggMjcuNTY2bC0xMy4zIDcuNjY2YTMuMjY5IDMuMjY5IDAgMDAtMS4yIDQuNDUgMy4zMzcgMy4zMzcgMCAwMDQuNDUyIDEuMTg0bDEzLjMtNy42NjVhMy4yMTYgMy4yMTYgMCAwMDEuMTU5LTQuNDI2IDMuMTc0IDMuMTc0IDAgMDAtNC40MDctMS4yMWwtLjAwNC4wMDF6IiBvcGFjaXR5PSIuOSIvPjxwYXRoIGQ9Ik04OS4xNzMgNDYuNzM1YTMuMjU1IDMuMjU1IDAgMTEwIDYuNTFINzMuODU4YTMuMjU1IDMuMjU1IDAgMTEwLTYuNTFoMTUuMzE1eiIvPjwvZz48YW5pbWF0ZVRyYW5zZm9ybSBhdHRyaWJ1dGVOYW1lPSJ0cmFuc2Zvcm0iIHR5cGU9InJvdGF0ZSIgdmFsdWVzPSIwIDUwIDUwOyAzMCA1MCA1MDsgNjAgNTAgNTA7IDkwIDUwIDUwOyAxMjAgNTAgNTA7IDE1MCA1MCA1MDsgMTgwIDUwIDUwOyAyMTAgNTAgNTA7IDI0MCA1MCA1MDsgMjcwIDUwIDUwOyAzMDAgNTAgNTA7IDMzMCA1MCA1MDsiIGR1cj0iMXMiIGNhbGNNb2RlPSJkaXNjcmV0ZSIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiLz48L2c+PC9zdmc+');
  background-size: 100% 100%;
}
.loading-holder-mark {
  margin-top: 20px;
  font-size: 16px;
  line-height: 22px;
  color: #ffffff;
  text-align: center;
}
</style>
