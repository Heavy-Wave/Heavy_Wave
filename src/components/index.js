import 'normalize.css'

import moment from 'moment'

import 'flatpickr/dist/flatpickr.css'
import flatpickr from 'flatpickr'

import { Mandarin } from 'flatpickr/dist/l10n/zh'

import vueModalToastPlugin from 'vue-modal-toast-plugin'
import 'vue-modal-toast-plugin/dist/vue-modal-toast-plugin.min.css'

import FlexRow from '@/components/global/FlexRow'
import FlexColumn from '@/components/global/FlexColumn'
import Expanded from '@/components/global/Expanded'
import Modal from '@/components/global/Modal'
import StatusBar from '@/components/global/StatusBar'
import SystemBar from '@/components/global/SystemBar'
import NavWrapper from '@/components/global/NavWrapper'
import NavPanel from '@/components/global/NavPanel'
import NavPageButton from '@/components/global/NavPageButton'
import NavPrevButton from '@/components/global/NavPrevButton'
import NavNextButton from '@/components/global/NavNextButton'
import FormInput from '@/components/global/FormInput'
import FormSelect from '@/components/global/FormSelect'
import FormSearchSelect from '@/components/global/FormSearchSelect'
import FormCheckbox from '@/components/global/FormCheckbox'
import FormCheckboxes from '@/components/global/FormCheckboxes'
import FormRadio from '@/components/global/FormRadio'
import FormStaff from '@/components/global/FormStaff'
import Btn from '@/components/global/Btn'
import BtnGroup from '@/components/global/BtnGroup'
import PtIcon from '@/components/global/PtIcon'
import Scroller from '@/components/global/Scroller'
import TableWrapper from '@/components/global/TableWrapper'
import Tabs from '@/components/global/Tabs'
import TabNav from '@/components/global/TabNav'
import TabPane from '@/components/global/TabPane'
import DisplayPrice from '@/components/global/DisplayPrice'
import DisplayQuantity from '@/components/global/DisplayQuantity'
import ImageBox from '@/components/global/ImageBox'
import QrCode from '@/components/global/QrCode'
import PosterPlayer from '@/components/global/PosterPlayer'
import Keyboard from '@/components/global/Keyboard'
import PayList from '@/components/global/PayList'
import PtSlot from '@/components/global/PtSlot'
import PtSlotPopItem from '@/components/global/PtSlotPopItem'
import PtSlotPopHolder from '@/components/global/PtSlotPopHolder'
import PtTips from '@/components/global/PtTips'
import MoneyAdminKbd from '@/components/global/MoneyAdminKbd'

import UnitDialog from '@/components/unit/UnitDialog'
import UnitClient from '@/components/unit/UnitClient'
import UnitClientLogo from '@/components/unit/UnitClientLogo'
import UnitClientPoster from '@/components/unit/UnitClientPoster'
import UnitClientList from '@/components/unit/UnitClientList'
import UnitMain from '@/components/unit/UnitMain'
import UnitMainMenu from '@/components/unit/UnitMainMenu'
import UnitMainHeaderReceipt from '@/components/unit/UnitMainHeaderReceipt'
import UnitMainHeaderVip from '@/components/unit/UnitMainHeaderVip'
import UnitMainList from '@/components/unit/UnitMainList'
import UnitMainSubtotal from '@/components/unit/UnitMainSubtotal'
import UnitMainAction from '@/components/unit/UnitMainAction'
import UnitMainCheckout from '@/components/unit/UnitMainCheckout'
import UnitMainScan from '@/components/unit/UnitMainScan'
import UnitMainProducts from '@/components/unit/UnitMainProducts'
import UnitMainInfo from '@/components/unit/UnitMainInfo'
import UnitMainPromotion from '@/components/unit/UnitMainPromotion'
import UnitMainReceiptList from '@/components/unit/UnitMainReceiptList'
import UnitMainReceiptPayList from '@/components/unit/UnitMainReceiptPayList'
import UnitMainGift from '@/components/unit/UnitMainGift'
import UnitMainGiftChoose from '@/components/unit/UnitMainGiftChoose'
import UnitMainPay from '@/components/unit/UnitMainPay'
import UnitMainPayGateways from '@/components/unit/UnitMainPayGateways'
import UnitMainPayTotal from '@/components/unit/UnitMainPayTotal'
import UnitMainPayNavi from '@/components/unit/UnitMainPayNavi'
import UnitMainPaySeller from '@/components/unit/UnitMainPaySeller'
import UnitMainPayMeta from '@/components/unit/UnitMainPayMeta'
import UnitMainPayCoupons from '@/components/unit/UnitMainPayCoupons'
import UnitMainVipQuery from '@/components/unit/UnitMainVipQuery'
import UnitMainPayPop from '@/components/unit/UnitMainPayPop'
import UnitMainPayResultPop from '@/components/unit/UnitMainPayResultPop'
import UnitMainFuncVertical from '@/components/unit/UnitMainFuncVertical'
import UnitMainFuncVerticalPagi from '@/components/unit/UnitMainFuncVerticalPagi'
import UnitMainFuncHorizontal from '@/components/unit/UnitMainFuncHorizontal'
import UnitMainFuncHorizontalPagi from '@/components/unit/UnitMainFuncHorizontalPagi'
import UnitMainMoney from '@/components/unit/UnitMainMoney'
import UnitMainMoneyNavi from '@/components/unit/UnitMainMoneyNavi'
import UnitMainReserveFund from '@/components/unit/UnitMainReserveFund'
import UnitMainReview from '@/components/unit/UnitMainReview'
import UnitMainInventory from '@/components/unit/UnitMainInventory'
import UnitMainInventoryMk from '@/components/unit/UnitMainInventoryMk'
import UnitMainRetailStats from '@/components/unit/UnitMainRetailStats'
import UnitMainRetailStatsPop from '@/components/unit/UnitMainRetailStatsPop'
import UnitMainReturn from '@/components/unit/UnitMainReturn'
import UnitMainReturnPopIn from '@/components/unit/UnitMainReturnPopIn'
import UnitMainReturnPopGoods from '@/components/unit/UnitMainReturnPopGoods'
import UnitMainExchange from '@/components/unit/UnitMainExchange'
import UnitMainExchangePopEqual from '@/components/unit/UnitMainExchangePopEqual'
import UnitMainExchangePopIn from '@/components/unit/UnitMainExchangePopIn'
import UnitMainExchangePopOut from '@/components/unit/UnitMainExchangePopOut'
import UnitMainReport from '@/components/unit/UnitMainReport'
import UnitMainProductSearch from '@/components/unit/UnitMainProductSearch'
import UnitMainBroken from '@/components/unit/UnitMainBroken'
import UnitMainBrokenPop from '@/components/unit/UnitMainBrokenPop'
import UnitMainShift from '@/components/unit/UnitMainShift'
import UnitMainShiftPop from '@/components/unit/UnitMainShiftPop'
import UnitMainOtherodd from '@/components/unit/UnitMainOtherodd'
import UnitMainOtheroddPop from '@/components/unit/UnitMainOtheroddPop'
import UnitMainOtheroddIntro from '@/components/unit/UnitMainOtheroddIntro'

export default {
  install (Vue, options) {
    Vue.component(FlexRow.name, FlexRow)
    Vue.component(FlexColumn.name, FlexColumn)
    Vue.component(Expanded.name, Expanded)
    Vue.component(Modal.name, Modal)
    Vue.component(StatusBar.name, StatusBar)
    Vue.component(SystemBar.name, SystemBar)
    Vue.component(NavWrapper.name, NavWrapper)
    Vue.component(NavPanel.name, NavPanel)
    Vue.component(NavPageButton.name, NavPageButton)
    Vue.component(NavPrevButton.name, NavPrevButton)
    Vue.component(NavNextButton.name, NavNextButton)
    Vue.component(FormInput.name, FormInput)
    Vue.component(FormSelect.name, FormSelect)
    Vue.component(FormSearchSelect.name, FormSearchSelect)
    Vue.component(FormCheckbox.name, FormCheckbox)
    Vue.component(FormCheckboxes.name, FormCheckboxes)
    Vue.component(FormRadio.name, FormRadio)
    Vue.component(FormStaff.name, FormStaff)
    Vue.component(Btn.name, Btn)
    Vue.component(BtnGroup.name, BtnGroup)
    Vue.component(PtIcon.name, PtIcon)
    Vue.component(Scroller.name, Scroller)
    Vue.component(TableWrapper.name, TableWrapper)
    Vue.component(Tabs.name, Tabs)
    Vue.component(TabNav.name, TabNav)
    Vue.component(TabPane.name, TabPane)
    Vue.component(DisplayPrice.name, DisplayPrice)
    Vue.component(DisplayQuantity.name, DisplayQuantity)
    Vue.component(ImageBox.name, ImageBox)
    Vue.component(QrCode.name, QrCode)
    Vue.component(PosterPlayer.name, PosterPlayer)
    Vue.component(Keyboard.name, Keyboard)
    Vue.component(PayList.name, PayList)
    Vue.component(PtSlot.name, PtSlot)
    Vue.component(PtSlotPopItem.name, PtSlotPopItem)
    Vue.component(PtSlotPopHolder.name, PtSlotPopHolder)
    Vue.component(PtTips.name, PtTips)
    Vue.component(MoneyAdminKbd.name, MoneyAdminKbd)

    Vue.component(UnitDialog.name, UnitDialog)
    Vue.component(UnitClient.name, UnitClient)
    Vue.component(UnitClientLogo.name, UnitClientLogo)
    Vue.component(UnitClientPoster.name, UnitClientPoster)
    Vue.component(UnitClientList.name, UnitClientList)
    Vue.component(UnitMain.name, UnitMain)
    Vue.component(UnitMainMenu.name, UnitMainMenu)
    Vue.component(UnitMainHeaderReceipt.name, UnitMainHeaderReceipt)
    Vue.component(UnitMainHeaderVip.name, UnitMainHeaderVip)
    Vue.component(UnitMainList.name, UnitMainList)
    Vue.component(UnitMainSubtotal.name, UnitMainSubtotal)
    Vue.component(UnitMainAction.name, UnitMainAction)
    Vue.component(UnitMainCheckout.name, UnitMainCheckout)
    Vue.component(UnitMainScan.name, UnitMainScan)
    Vue.component(UnitMainProducts.name, UnitMainProducts)
    Vue.component(UnitMainInfo.name, UnitMainInfo)
    Vue.component(UnitMainPromotion.name, UnitMainPromotion)
    Vue.component(UnitMainReceiptList.name, UnitMainReceiptList)
    Vue.component(UnitMainReceiptPayList.name, UnitMainReceiptPayList)
    Vue.component(UnitMainGift.name, UnitMainGift)
    Vue.component(UnitMainGiftChoose.name, UnitMainGiftChoose)
    Vue.component(UnitMainPay.name, UnitMainPay)
    Vue.component(UnitMainPayGateways.name, UnitMainPayGateways)
    Vue.component(UnitMainPayTotal.name, UnitMainPayTotal)
    Vue.component(UnitMainPayNavi.name, UnitMainPayNavi)
    Vue.component(UnitMainPaySeller.name, UnitMainPaySeller)
    Vue.component(UnitMainPayMeta.name, UnitMainPayMeta)
    Vue.component(UnitMainPayCoupons.name, UnitMainPayCoupons)
    Vue.component(UnitMainVipQuery.name, UnitMainVipQuery)
    Vue.component(UnitMainPayPop.name, UnitMainPayPop)
    Vue.component(UnitMainPayResultPop.name, UnitMainPayResultPop)
    Vue.component(UnitMainFuncVertical.name, UnitMainFuncVertical)
    Vue.component(UnitMainFuncVerticalPagi.name, UnitMainFuncVerticalPagi)
    Vue.component(UnitMainFuncHorizontal.name, UnitMainFuncHorizontal)
    Vue.component(UnitMainFuncHorizontalPagi.name, UnitMainFuncHorizontalPagi)
    Vue.component(UnitMainMoney.name, UnitMainMoney)
    Vue.component(UnitMainMoneyNavi.name, UnitMainMoneyNavi)
    Vue.component(UnitMainReserveFund.name, UnitMainReserveFund)
    Vue.component(UnitMainReview.name, UnitMainReview)
    Vue.component(UnitMainInventory.name, UnitMainInventory)
    Vue.component(UnitMainInventoryMk.name, UnitMainInventoryMk)
    Vue.component(UnitMainRetailStats.name, UnitMainRetailStats)
    Vue.component(UnitMainRetailStatsPop.name, UnitMainRetailStatsPop)
    Vue.component(UnitMainReturn.name, UnitMainReturn)
    Vue.component(UnitMainReturnPopIn.name, UnitMainReturnPopIn)
    Vue.component(UnitMainReturnPopGoods.name, UnitMainReturnPopGoods)
    Vue.component(UnitMainExchange.name, UnitMainExchange)
    Vue.component(UnitMainExchangePopEqual.name, UnitMainExchangePopEqual)
    Vue.component(UnitMainExchangePopIn.name, UnitMainExchangePopIn)
    Vue.component(UnitMainExchangePopOut.name, UnitMainExchangePopOut)
    Vue.component(UnitMainReport.name, UnitMainReport)
    Vue.component(UnitMainProductSearch.name, UnitMainProductSearch)
    Vue.component(UnitMainBroken.name, UnitMainBroken)
    Vue.component(UnitMainBrokenPop.name, UnitMainBrokenPop)
    Vue.component(UnitMainShift.name, UnitMainShift)
    Vue.component(UnitMainShiftPop.name, UnitMainShiftPop)
    Vue.component(UnitMainOtherodd.name, UnitMainOtherodd)
    Vue.component(UnitMainOtheroddPop.name, UnitMainOtheroddPop)
    Vue.component(UnitMainOtheroddIntro.name, UnitMainOtheroddIntro)

    moment.locale('zh-cn')

    flatpickr.localize(Mandarin)

    Vue.use(vueModalToastPlugin, { store: options.store })
  }
}
