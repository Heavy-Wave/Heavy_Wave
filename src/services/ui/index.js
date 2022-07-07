function xhrGet (url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.onload = function () {
      resolve(xhr.responseText)
    }
    xhr.onerror = function () {
      reject(new TypeError('Local request failed'))
    }
    xhr.open('GET', url)
    xhr.send(null)
  })
}

export default {
  install (Vue, options) {
    Vue.prototype.$ui = new Vue({
      data () {
        return {
          data: {
            POS_MAIN: null,
            POS_CLIENT: null
          }
        }
      },
      created () {
        // 事件监听
        this.$events.on('bridge.error', error => {
          // 返回错误码 ≤ -2 的错误被定义为网络错误
          if (error.code < -1) {
            this.fillNetStatusByError(error)
          }
        })
      },
      methods: {
        /**
         * 按指定的 top_menu_id 获取 UI 配置
         *
         * @returns Promise<Void>
         */
        load (topMenuId) {
          return this.$bridge.settingsGet({ topMenuId })
            .then(({ msg, data }) => {
              if (!('unit_settings' in data) || data.unit_settings === null) {
                throw new Error('unit_settings 为 null')
              }

              const ps = []

              // 加载指定的外部 HTML
              for (const i in data.unit_settings) {
                if (typeof data.unit_settings[i].ui_unit_file_name !== 'string' || data.unit_settings[i].ui_unit_file_name.length === 0) {
                  continue
                }

                const filename = `${data.unit_settings[i].ui_unit_file_name}.html`
                const url = `template/${filename}`

                ps.push(
                  xhrGet(url)
                    .then(res => {
                      let content = res
                        // 注入 `unit` 属性
                        .replace(/<unit-(\S+)(\s+?)/g, '<unit-$1 :unit="unit"$2')

                      if (content.length === 0) {
                        content = '模板内容为空'
                      }

                      data.unit_settings[i].ui_unit_file_content = content
                    })
                    .catch(() => {
                      throw new Error('模板文件不存在：' + filename)
                    })
                )
              }

              Promise.all(ps)
                .then(() => {
                  this.data[topMenuId] = data
                })
                .then(() => {
                  this.$events.emit('ui.loaded')
                })
            })
        },

        /**
         * 按指定的 top_menu_id, sysset_id, set_index 查找 sys_setting
         *
         * @returns Object
         */
        getSysSetting (topMenuId, setId, index) {
          if (this.data[topMenuId] !== null) {
            return this.data[topMenuId].sys_settings.find(el =>
              el !== null &&
              el.sysset_id === setId &&
              el.set_index === index
            ) || null
          }

          return null
        },

        /**
         * 按指定的 top_menu_id, menu_id 查找 ui_unit
         *
         * @returns Object
         */
        findUnit (topMenuId, menuId) {
          if (this.data[topMenuId] !== null) {
            return this.data[topMenuId].unit_settings.find(el =>
              el !== null &&
              el.menu_id === menuId
            ) || null
          }

          return null
        },

        /**
         * 按指定的 top_menu_id, slot 查找 ui_unit 列表
         *
         * @returns Object
         */
        findUnitsBySlot (topMenuId, slot) {
          if (this.data[topMenuId] !== null) {
            return this.data[topMenuId].unit_settings.filter(el =>
              el !== null &&
              el.slot === slot
            )
          }

          return []
        },

        /**
         * 按指定的 top_menu_id, slot 查找默认 ui_unit
         *
         * @returns Object
         */
        findUnitBySlot (topMenuId, slot) {
          if (this.data[topMenuId] !== null) {
            const units = this.findUnitsBySlot(topMenuId, slot)
            if (units.length === 1) {
              return units[0]
            } if (units.length > 1) {
              return units.find(el => parseInt(el.default_flg) === 1) || null
            } else {
              return null
            }
          }

          return null
        },

        /**
         * 按指定的 ui_unit 查找 ui_element 列表
         *
         * @returns Object
         */
        findUiElementsByUnit (unit, elementType = null, elementGroupType = null) {
          if (unit !== null) {
            return unit.ui_element
              .filter(
                el =>
                  el !== null &&
                  (elementType === null || el.elements_type === elementType) &&
                  (elementGroupType === null || el.element_group_type === elementGroupType)
              )
              .sort((e1, e2) => {
                if (parseFloat(e1.auto_sort) > parseFloat(e2.auto_sort)) return 1
                if (parseFloat(e1.auto_sort) < parseFloat(e2.auto_sort)) return -1
                return 0
              })
          }

          return []
        },

        /**
         * 按指定的 top_menu_id, menu_id 查找 ui_element 列表
         *
         * @returns Array
         */
        findUiElements (topMenuId, menuId, elementType = null, elementGroupType = null) {
          const unit = this.findUnit(topMenuId, menuId)
          if (unit !== null) {
            return this.findUiElementsByUnit(unit, elementType, elementGroupType)
          }

          return null
        },

        /**
         * 按指定的 ui_unit 查找指定 elements_type, element_group_type 的 ui_element
         *
         * @returns Object
         */
        findElementByUnit (unit, elementType = null, elementGroupType = null) {
          if (unit !== null) {
            return unit.ui_element
              .find(
                el =>
                  el !== null &&
                  (elementType === null || el.elements_type === elementType) &&
                  (elementGroupType === null || el.element_group_type === elementGroupType)
              ) || null
          }

          return null
        },

        /**
         * 按指定的 ui_unit 判断是否存在指定 elements_type, element_group_type 的 ui_element
         *
         * @returns Boolean
         */
        hasElementByUnit (unit, elementType = null, elementGroupType = null) {
          if (unit !== null) {
            return unit.ui_element
              .some(
                el =>
                  el !== null &&
                  (elementType === null || el.elements_type === elementType) &&
                  (elementGroupType === null || el.element_group_type === elementGroupType)
              )
          }

          return false
        },

        /**
         * 按指定的 top_menu_id, menu_id 执行所有功能分子
         *
         * @returns Array<Promise<Object>>
         */
        runMolecules (topMenuId, menuId, elementType = null, elementGroupType = null, options) {
          return new Promise((resolve, reject) => {
            const elements = this.findUiElements(topMenuId, menuId, elementType, elementGroupType)

            if (elements === null || elements.length === 0) {
              reject(new Error(`no ui elements found for ${topMenuId} ${menuId} ${elementType} ${elementGroupType}`))
            }

            // 执行功能分子
            const ps = []

            for (let i = 0; i < elements.length; i++) {
              ps.push(
                this.runMoleculesByUiElement(topMenuId, elements[i], options)
              )
            }

            resolve(Promise.all(ps))
          })
        },

        /**
         * 按指定的 top_menu_id, ui_element 对象执行功能分子
         */
        runMoleculesByUiElement (topMenuId, uiElement, options) {
          return this.$bridge.molExec({
            topMenuId,
            uiUnitSetId: uiElement.ui_unit_set_id,
            uiElementId: uiElement.elements_id
          }, options)
            .then(res => {
              this.fillTipsByResponse(res)
              return res
            })
        },

        /**
         * 按指定的键值对以及 top_menu_id, menu_id 写入所有参数并执行功能分子
         *
         * @returns Array<Promise<Object>>
         */
        inputByUnit (kv, topMenuId, menuId, elementType = null, elementGroupType = null, options) {
          return new Promise((resolve, reject) => {
            const elements = this.findUiElements(topMenuId, menuId, elementType, elementGroupType)

            if (elements === null || elements.length === 0) {
              reject(new Error(`no ui elements found for ${topMenuId} ${menuId} ${elementType} ${elementGroupType}`))
            }

            const ps = []

            for (let i = 0; i < elements.length; i++) {
              const ps2 = []

              let shouldExecMol = true

              for (const key in kv) {
                // 转换为字符串类型
                let value
                switch (typeof value) {
                  case 'number':
                    value = kv[key].toString()
                    break
                  case 'boolean':
                    value = kv[key] ? 'true' : 'false'
                    break
                  default:
                    value = kv[key]
                }

                // 对 input_param_cond 正则匹配
                if (elements[i].input_param_cond !== null && elements[i].input_param_cond !== '') {
                  const re = new RegExp(elements[i].input_param_cond)
                  if (!re.test(value)) {
                    shouldExecMol = false
                    break
                  }
                }

                ps2.push(
                  this.setData(value, key, options)
                )
              }

              ps.push(
                Promise.all(ps2)
                  .then(({ msg, data }) => {
                    if (shouldExecMol) {
                      return this.runMoleculesByUiElement(topMenuId, elements[i], options)
                    }
                  })
              )
            }

            resolve(Promise.all(ps))
          })
        },

        /**
         * 按指定的 value, path 写入参数
         */
        setData (value, path, options) {
          return this.$bridge.paramsPut({
            paramsPath: path,
            paramsValue: value
          }, options)
        },

        /**
         * 按指定的 top_menu_id, menu_id 获取所有数据源
         *
         * @returns Array<Promise<Object>>
         */
        getData (topMenuId, menuId, elementType = null, elementGroupType = null, options) {
          return new Promise((resolve, reject) => {
            const elements = this.findUiElements(topMenuId, menuId, elementType, elementGroupType)

            if (elements === null || elements.length === 0) {
              reject(new Error(`no ui elements found for ${topMenuId} ${menuId} ${elementType} ${elementGroupType}`))
            }

            const ps = []

            for (let i = 0; i < elements.length; i++) {
              ps.push(
                this.getDataByUiElement(topMenuId, elements[i], options)
              )
            }

            resolve(Promise.all(ps))
          })
        },

        /**
         * 按指定的 top_menu_id, ui_element 对象获取数据源
         */
        getDataByUiElement (topMenuId, uiElement, options) {
          return this.$bridge.dataGet({
            topMenuId,
            uiUnitSetId: uiElement.ui_unit_set_id,
            uiElementId: uiElement.elements_id
          }, options)
            .then(res => {
              this.fillTipsByResponse(res)
              return res
            })
        },

        /**
         * 按指定的 top_menu_id, menu_id 判断是否存在需要自动执行的功能分子
         *
         * @returns Boolean
         */
        isMoleculesAuto (topMenuId, menuId, elementType, elementGroupType) {
          const items = this.findUiElements(topMenuId, menuId, elementType, elementGroupType)

          if (items === null || items.length === 0) {
            throw new Error(`no ui elements found for ${topMenuId} ${menuId} ${elementType} ${elementGroupType}`)
          }

          return items.some(el =>
            el !== null &&
            parseInt(el.auto_flg) === this.$const.UI.ELEMENT.AUTO_FLG.YES
          )
        },

        /**
         * 根据原生响应，提取 msg 并更新至全局系统状态
         */
        fillNetStatusByError (error) {
          this.$sys.updateNetStatus({
            code: error.code,
            message: error.message
          })
        },

        /**
         * 根据原生响应，提取 msg 并更新至全局系统状态
         */
        fillTipsByResponse (res) {
          if (typeof res.data === 'object' && res.data !== null) {
            if ('msg_flg' in res.data && parseInt(res.data.msg_flg) === 1) {
              if (typeof res.msg === 'string') {
                this.$sys.updateTips(res.msg)
              }
            }
          }
        }
      }
    })
  }
}
