<template>
  <div class="DialogHolder">

    <transition-group
      name="dialog"
      tag="div"
    >

      <div
        v-for="(item, index) in $store.getters.dialogItems"
        :key="`dialog-${index}`"
        class="dialog-wraper"
      >

        <div class="dialog-background" @click="onClickBackground(item)" />

        <div class="dialog-frame">

          <div class="dialog-content">

            <div v-if="item.title" class="dialog-title">{{ item.title }}</div>

            <template v-if="item.message">

              <template v-if="!item.html">
                <div class="dialog-message">{{ item.message }}</div>
              </template>

              <template v-else>
                <div class="dialog-message" v-html="item.message" />
              </template>

            </template>

          </div>

          <div v-if="item.buttons.length > 0" class="dialog-buttons">

            <a
              v-for="(button, index) in item.buttons"
              :key="`dialog-button-${index}`"
              :class="{ 'secondary': button.secondary }"
              href="javascript:void(0);"
              @click="onClickButton(item, button)"
            >{{ button.label }}</a>

          </div>

        </div>

      </div>

    </transition-group>

  </div>
</template>

<script>
export default {
  name: 'DialogHolder',
  methods: {
    onClickBackground (item) {
      item.callback(null)

      // close dialog
      return this.$dialog.close({ id: item._id })
    },
    onClickButton (item, button) {
      item.callback(button.value)

      // close dialog
      return this.$dialog.close({ id: item._id })
    }
  }
}
</script>

<style lang="scss">
.DialogHolder {
  // structure
  .dialog-wraper {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 10;
    display: flex;
    align-items: center;
  }
  .dialog-background {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 0;
  }
  .dialog-frame {
    flex-grow: 0;
    flex-shrink: 0;
    margin-left: auto;
    margin-right: auto;
    position: relative;
    z-index: 1;
  }

  // theme
  .dialog-wraper {
    overflow-wrap: break-word;
  }
  .dialog-background {
    background-color: rgba(0, 0, 0, .3);
  }
  .dialog-frame {
    min-width: 395px;
    max-width: 80vw;
    border: 1px solid #000000;
    background-color: #ffffff;
    border-radius: 2px;
    overflow: hidden;
  }
  .dialog-content {
    user-select: initial;
    img, svg {
      max-width: 100%;
      height: auto;
    }
  }
  .dialog-title {
    padding: 10px 16px;
    border-bottom: 1px solid #dddde2;
    font-size: 18px;
    line-height: 25px;
    color: #000000;
    text-align: center;
    white-space: pre-line;
  }
  .dialog-message {
    padding: 60px 16px;
    max-height: 50vh;
    overflow: auto;
    font-size: 16px;
    line-height: 22px;
    color: #000000;
    text-align: center;
    white-space: pre-line;
  }
  .dialog-buttons {
    border-top: 1px solid #dddde2;
    padding: 8px 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    a {
      display: block;
      flex-grow: 0;
      flex-shrink: 0;
      width: 102px;
      padding: 10px 8px;
      border: 1px solid var(--pt-color-primary);
      background-color: var(--pt-color-primary);
      border-radius: 2px;
      font-size: 16px;
      line-height: 22px;
      font-weight: 500;
      color: var(--pt-color-primary-content);
      text-decoration: none;
      text-align: center;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      &:hover {
        opacity: .85;
      }
      &:active {
        opacity: 1;
      }
      &.secondary {
        border-color: #999999;
        background-image: linear-gradient(135deg, #ffffff 0%, #e3e3e3 100%);
        color: #000000;
        &:hover {
          background-image: linear-gradient(135deg, lighten(#ffffff, 10%) 0%, lighten(#e3e3e3, 10%) 100%);
        }
        &:active {
          background-image: linear-gradient(135deg, darken(#ffffff, 10%) 0%, darken(#e3e3e3, 10%) 100%);
        }
      }
      & + a {
        margin-left: 20px;
      }
    }
  }

  .dialog-enter-active, .dialog-leave-active {
    transition-property: visibility, opacity;
    transition-duration: .25s;
    .dialog-frame {
      transition-property: transform;
      transition-duration: .25s;
      transition-timing-function: ease-in-out;
    }
  }
  .dialog-enter {
    opacity: 0;
    visibility: hidden;
    .dialog-frame {
      transform: scale(1.1);
    }
  }
  .dialog-leave-to {
    opacity: 0;
    visibility: hidden;
    .dialog-frame {
      transform: scale(.9);
    }
  }
  .dialog-leave, .dialog-enter-to {
    opacity: 1;
    visibility: visible;
    .dialog-frame {
      transform: scale(1);
    }
  }
}
</style>
